-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - ADBMS ANALYTICAL QUERIES
-- Database: smart_ev_charging
-- Demonstrates: Joins, Aggregates, GROUP BY, HAVING, Subqueries, 
--               Correlated Subqueries, EXISTS, and Window Functions.
-- ====================================================================

USE smart_ev_charging;

-- ====================================================================
-- 1. BASIC & MULTI-TABLE JOINS
-- ====================================================================

-- 1.1 INNER JOIN: Available charging ports with station metadata & unit pricing
SELECT 
    s.station_id,
    s.station_name,
    s.location,
    p.port_id,
    p.port_number,
    p.port_type,
    p.power_rating,
    s.price_per_kwh,
    p.status AS port_status
FROM CHARGING_PORTS p
INNER JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
WHERE p.status = 'available' AND s.status = 'active'
ORDER BY s.station_name, p.port_number;

-- 1.2 MULTI-TABLE JOIN (5 Tables): Active charging sessions with driver, vehicle, station & port details
SELECT 
    cs.session_id,
    u.user_id,
    u.name AS driver_name,
    u.phone AS driver_phone,
    v.vehicle_model,
    v.license_plate,
    s.station_name,
    s.location AS station_location,
    p.port_number,
    p.port_type,
    cs.start_time,
    cs.initial_battery_level,
    cs.status AS session_status
FROM CHARGING_SESSION cs
INNER JOIN USERS u ON cs.user_id = u.user_id
LEFT JOIN VEHICLES v ON cs.vehicle_id = v.vehicle_id
INNER JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
INNER JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
WHERE cs.status = 'in_progress';

-- 1.3 LEFT JOIN: All registered users and their registered EV count
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    COUNT(v.vehicle_id) AS total_vehicles
FROM USERS u
LEFT JOIN VEHICLES v ON u.user_id = v.user_id
GROUP BY u.user_id, u.name, u.email, u.role
ORDER BY total_vehicles DESC;

-- ====================================================================
-- 2. AGGREGATE FUNCTIONS, GROUP BY & HAVING
-- ====================================================================

-- 2.1 Station Revenue & Energy Summary (Aggregate Functions: COUNT, SUM, AVG)
SELECT 
    s.station_id,
    s.station_name,
    s.location,
    COUNT(DISTINCT cs.session_id) AS total_sessions,
    ROUND(COALESCE(SUM(ec.energy_consumed), 0), 2) AS total_kwh_delivered,
    ROUND(COALESCE(AVG(ec.energy_consumed), 0), 2) AS avg_kwh_per_session,
    ROUND(COALESCE(SUM(pm.amount), 0), 2) AS total_revenue
FROM CHARGING_STATIONS s
LEFT JOIN CHARGING_PORTS p ON s.station_id = p.station_id
LEFT JOIN CHARGING_SESSION cs ON p.port_id = cs.port_id
LEFT JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
LEFT JOIN PAYMENT pm ON cs.session_id = pm.session_id AND pm.payment_status = 'completed'
GROUP BY s.station_id, s.station_name, s.location
ORDER BY total_revenue DESC;

-- 2.2 GROUP BY with HAVING: High-demand stations delivering > 30 kWh total
SELECT 
    s.station_id,
    s.station_name,
    COUNT(DISTINCT cs.session_id) AS completed_sessions,
    SUM(ec.energy_consumed) AS total_energy_kwh
FROM CHARGING_STATIONS s
INNER JOIN CHARGING_PORTS p ON s.station_id = p.station_id
INNER JOIN CHARGING_SESSION cs ON p.port_id = cs.port_id
INNER JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
GROUP BY s.station_id, s.station_name
HAVING SUM(ec.energy_consumed) > 30.00
ORDER BY total_energy_kwh DESC;

-- 2.3 GROUP BY with HAVING: Users who have completed more than 1 booking
SELECT 
    u.user_id,
    u.name,
    u.email,
    COUNT(b.booking_id) AS booking_count
FROM USERS u
JOIN BOOKING b ON u.user_id = b.user_id
GROUP BY u.user_id, u.name, u.email
HAVING COUNT(b.booking_id) >= 1
ORDER BY booking_count DESC;

-- ====================================================================
-- 3. SUBQUERIES
-- ====================================================================

-- 3.1 SCALAR SUBQUERY: Sessions with energy consumption greater than the overall system average
SELECT 
    cs.session_id,
    cs.user_id,
    ec.energy_consumed,
    (SELECT ROUND(AVG(energy_consumed), 2) FROM ENERGY_CONSUMPTION) AS system_avg_kwh,
    ROUND(ec.energy_consumed - (SELECT AVG(energy_consumed) FROM ENERGY_CONSUMPTION), 2) AS diff_from_avg
FROM CHARGING_SESSION cs
JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
WHERE ec.energy_consumed > (
    SELECT AVG(energy_consumed) FROM ENERGY_CONSUMPTION
)
ORDER BY ec.energy_consumed DESC;

-- 3.2 SUBQUERY WITH IN: Find all users who have vehicles compatible with 'CHAdeMO' port type
SELECT 
    user_id,
    name,
    email,
    phone
FROM USERS
WHERE user_id IN (
    SELECT user_id 
    FROM VEHICLES 
    WHERE port_type = 'CHAdeMO'
);

-- 3.3 SUBQUERY WITH NOT IN: Find all registered users who have NEVER made any booking
SELECT 
    user_id,
    name,
    email,
    created_at
FROM USERS
WHERE role = 'user'
  AND user_id NOT IN (
      SELECT DISTINCT user_id 
      FROM BOOKING 
      WHERE user_id IS NOT NULL
  );

-- 3.4 CORRELATED SUBQUERY: Users whose total settled payment exceeds the average payment across all users
SELECT 
    u.user_id,
    u.name,
    u.email,
    (SELECT COALESCE(SUM(p.amount), 0) 
     FROM PAYMENT p 
     WHERE p.user_id = u.user_id AND p.payment_status = 'completed') AS total_spent
FROM USERS u
WHERE u.role = 'user'
  AND (SELECT COALESCE(SUM(p.amount), 0) 
       FROM PAYMENT p 
       WHERE p.user_id = u.user_id AND p.payment_status = 'completed') > (
           SELECT AVG(user_total)
           FROM (
               SELECT SUM(amount) AS user_total
               FROM PAYMENT
               WHERE payment_status = 'completed'
               GROUP BY user_id
           ) AS avg_table
       );

-- 3.5 SUBQUERY WITH EXISTS: Stations that have at least one port currently in 'maintenance'
SELECT 
    s.station_id,
    s.station_name,
    s.location,
    s.status
FROM CHARGING_STATIONS s
WHERE EXISTS (
    SELECT 1 
    FROM CHARGING_PORTS cp 
    WHERE cp.station_id = s.station_id 
      AND cp.status = 'maintenance'
);

-- 3.6 SUBQUERY WITH NOT EXISTS: Stations where ALL ports are available (no ports currently occupied or reserved)
SELECT 
    s.station_id,
    s.station_name,
    s.location
FROM CHARGING_STATIONS s
WHERE NOT EXISTS (
    SELECT 1 
    FROM CHARGING_PORTS cp 
    WHERE cp.station_id = s.station_id 
      AND cp.status IN ('occupied', 'reserved')
);

-- ====================================================================
-- 4. ADVANCED ANALYTICAL / WINDOW FUNCTIONS (MySQL 8.0+)
-- ====================================================================

-- 4.1 DENSE_RANK: Rank charging sessions by energy consumed within each station
SELECT 
    s.station_name,
    cs.session_id,
    u.name AS driver_name,
    ec.energy_consumed,
    DENSE_RANK() OVER (
        PARTITION BY s.station_id 
        ORDER BY ec.energy_consumed DESC
    ) AS consumption_rank
FROM CHARGING_SESSION cs
JOIN CHARGING_PORTS p ON cs.port_id = p.port_id
JOIN CHARGING_STATIONS s ON p.station_id = s.station_id
JOIN USERS u ON cs.user_id = u.user_id
JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
ORDER BY s.station_name, consumption_rank;

-- 4.2 Payment Method Distribution & Revenue Contribution
SELECT 
    payment_method,
    payment_status,
    COUNT(*) AS total_transactions,
    ROUND(SUM(amount), 2) AS total_revenue,
    ROUND(AVG(amount), 2) AS average_ticket_size
FROM PAYMENT
GROUP BY payment_method, payment_status
ORDER BY total_revenue DESC;
