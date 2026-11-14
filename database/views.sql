-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - DATABASE VIEWS (DDL)
-- Database: smart_ev_charging
-- Purpose: Provides abstracted, secure, and aggregated data layers
--          for Driver and Administrator Dashboards and Reporting.
-- ====================================================================

USE smart_ev_charging;

-- 1. Real-time Station & Port Availability View
-- Aggregates port counts by status per station for fast lookup on maps/dashboards
DROP VIEW IF EXISTS vw_station_port_availability;
CREATE VIEW vw_station_port_availability AS
SELECT 
    s.station_id,
    s.station_name,
    s.location,
    s.latitude,
    s.longitude,
    s.price_per_kwh,
    s.status AS station_status,
    s.total_ports,
    SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS available_ports,
    SUM(CASE WHEN p.status = 'occupied' THEN 1 ELSE 0 END) AS occupied_ports,
    SUM(CASE WHEN p.status = 'reserved' THEN 1 ELSE 0 END) AS reserved_ports,
    SUM(CASE WHEN p.status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance_ports
FROM CHARGING_STATIONS s
LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
GROUP BY 
    s.station_id, 
    s.station_name, 
    s.location, 
    s.latitude, 
    s.longitude, 
    s.price_per_kwh, 
    s.status, 
    s.total_ports;

-- 2. Live Active Charging Sessions View
-- Powers real-time admin monitoring and active user session cards
DROP VIEW IF EXISTS vw_active_charging_sessions;
CREATE VIEW vw_active_charging_sessions AS
SELECT 
    cs.session_id,
    cs.booking_id,
    cs.user_id,
    u.name AS driver_name,
    u.email AS driver_email,
    u.phone AS driver_phone,
    cs.vehicle_id,
    v.vehicle_model,
    v.license_plate,
    s.station_id,
    s.station_name,
    s.location AS station_location,
    p.port_id,
    p.port_number,
    p.port_type,
    p.power_rating,
    s.price_per_kwh,
    cs.start_time,
    cs.initial_battery_level,
    TIMESTAMPDIFF(MINUTE, cs.start_time, NOW()) AS elapsed_minutes,
    cs.status AS session_status
FROM CHARGING_SESSION cs
INNER JOIN USERS u ON cs.user_id = u.user_id
LEFT JOIN VEHICLES v ON cs.vehicle_id = v.vehicle_id
INNER JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
INNER JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
WHERE cs.status = 'in_progress';

-- 3. Comprehensive User Booking History View
-- Powers the 'My Bookings' page and admin booking management table
DROP VIEW IF EXISTS vw_user_booking_history;
CREATE VIEW vw_user_booking_history AS
SELECT 
    b.booking_id,
    b.user_id,
    u.name AS user_name,
    u.email AS user_email,
    u.phone AS user_phone,
    b.station_id,
    s.station_name,
    s.location AS station_location,
    b.port_id,
    p.port_number,
    p.port_type,
    p.power_rating,
    b.vehicle_id,
    v.vehicle_model,
    v.license_plate,
    b.booking_time,
    b.start_time,
    b.end_time,
    TIMESTAMPDIFF(MINUTE, b.start_time, b.end_time) AS duration_minutes,
    b.status AS booking_status,
    b.created_at
FROM BOOKING b
INNER JOIN USERS u ON b.user_id = u.user_id
INNER JOIN CHARGING_STATIONS s ON b.station_id = s.station_id
INNER JOIN CHARGING_PORTS p ON b.port_id = p.port_id
LEFT JOIN VEHICLES v ON b.vehicle_id = v.vehicle_id;

-- 4. Station Revenue and Energy Performance View
-- Aggregates financial and technical metrics per station for executive reports
DROP VIEW IF EXISTS vw_station_revenue_energy;
CREATE VIEW vw_station_revenue_energy AS
SELECT 
    s.station_id,
    s.station_name,
    s.location,
    s.status AS station_status,
    COUNT(DISTINCT cs.session_id) AS total_sessions,
    ROUND(COALESCE(SUM(ec.energy_consumed), 0), 2) AS total_energy_kwh,
    ROUND(COALESCE(AVG(ec.energy_consumed), 0), 2) AS avg_energy_per_session,
    ROUND(COALESCE(SUM(pm.amount), 0), 2) AS total_revenue
FROM CHARGING_STATIONS s
LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
LEFT JOIN CHARGING_SESSION cs ON p.port_id = cs.port_id
LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
LEFT JOIN PAYMENT pm ON cs.session_id = pm.session_id AND pm.payment_status = 'completed'
GROUP BY 
    s.station_id, 
    s.station_name, 
    s.location, 
    s.status;

-- 5. User Consumption & Expenditure Summary View
-- Summary for driver dashboard profile cards and admin user management
DROP VIEW IF EXISTS vw_user_consumption_summary;
CREATE VIEW vw_user_consumption_summary AS
SELECT 
    u.user_id,
    u.name AS user_name,
    u.email,
    u.phone,
    u.role,
    u.is_active,
    COUNT(DISTINCT v.vehicle_id) AS registered_vehicles,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    COUNT(DISTINCT cs.session_id) AS total_sessions,
    ROUND(COALESCE(SUM(ec.energy_consumed), 0), 2) AS total_energy_consumed_kwh,
    ROUND(COALESCE(SUM(pm.amount), 0), 2) AS total_spent
FROM USERS u
LEFT JOIN VEHICLES v ON u.user_id = v.user_id
LEFT JOIN BOOKING b ON u.user_id = b.user_id
LEFT JOIN CHARGING_SESSION cs ON u.user_id = cs.user_id
LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
LEFT JOIN PAYMENT pm ON u.user_id = pm.user_id AND pm.payment_status = 'completed'
GROUP BY 
    u.user_id, 
    u.name, 
    u.email, 
    u.phone, 
    u.role, 
    u.is_active;

-- 6. Daily Charging & Revenue Analytics View
-- Powers historical trend charts on User and Admin Dashboards
DROP VIEW IF EXISTS vw_daily_charging_analytics;
CREATE VIEW vw_daily_charging_analytics AS
SELECT 
    DATE(cs.start_time) AS charging_date,
    COUNT(DISTINCT cs.session_id) AS daily_sessions_count,
    ROUND(COALESCE(SUM(ec.energy_consumed), 0), 2) AS daily_energy_kwh,
    ROUND(COALESCE(SUM(pm.amount), 0), 2) AS daily_revenue
FROM CHARGING_SESSION cs
LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
LEFT JOIN PAYMENT pm ON cs.session_id = pm.session_id AND pm.payment_status = 'completed'
GROUP BY DATE(cs.start_time);
