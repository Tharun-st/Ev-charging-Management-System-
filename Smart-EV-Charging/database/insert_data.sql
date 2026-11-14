-- =======================================================
-- Smart EV Charging Management System Sample Records
-- Database: smart_ev_charging
-- =======================================================

USE smart_ev_charging;

-- 1. INSERT SAMPLE USERS
-- Passwords hashed with bcrypt: 'admin123' for admin, 'user123' for drivers
INSERT INTO USERS (user_id, name, email, password, phone, role, created_at) VALUES
(1, 'Admin User', 'admin@smartev.com', '$2b$10$E/.hh9EuT9CsYn7kO5TI7OdlL.LQy1bw0g8a34MGQ2GoEtudshp1S', '+1-555-0100', 'admin', '2026-01-01 08:00:00'),
(2, 'Alice Johnson', 'alice.johnson@example.com', '$2b$10$qJdARGPMRzSvk5U1a5YdTeY4NBR7x02v76GDgabHhsYHp6iRSGnoC', '+1-555-0101', 'user', '2026-01-10 09:30:00'),
(3, 'Bob Smith', 'bob.smith@example.com', '$2b$10$qJdARGPMRzSvk5U1a5YdTeY4NBR7x02v76GDgabHhsYHp6iRSGnoC', '+1-555-0102', 'user', '2026-02-01 10:15:00'),
(4, 'Charlie Brown', 'charlie.b@example.com', '$2b$10$qJdARGPMRzSvk5U1a5YdTeY4NBR7x02v76GDgabHhsYHp6iRSGnoC', '+1-555-0103', 'user', '2026-02-15 11:45:00'),
(5, 'Diana Prince', 'diana.prince@example.com', '$2b$10$qJdARGPMRzSvk5U1a5YdTeY4NBR7x02v76GDgabHhsYHp6iRSGnoC', '+1-555-0104', 'user', '2026-03-01 14:20:00'),
(6, 'Evan Wright', 'evan.wright@example.com', '$2b$10$qJdARGPMRzSvk5U1a5YdTeY4NBR7x02v76GDgabHhsYHp6iRSGnoC', '+1-555-0105', 'user', '2026-03-10 16:00:00')
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password);

-- 2. INSERT SAMPLE VEHICLES
INSERT INTO VEHICLES (vehicle_id, user_id, vehicle_model, license_plate, battery_capacity, port_type, created_at) VALUES
(1, 2, 'Tesla Model 3 Long Range', 'EV-CA-1001', 75.00, 'CCS2', '2026-01-12 10:00:00'),
(2, 3, 'Hyundai Ioniq 5', 'EV-NY-2002', 77.40, 'CCS2', '2026-02-05 11:00:00'),
(3, 4, 'Tata Nexon EV Max', 'EV-TX-3003', 40.50, 'CCS2', '2026-02-18 12:30:00'),
(4, 5, 'MG ZS EV Excite', 'EV-WA-4004', 50.30, 'CCS2', '2026-03-05 15:00:00'),
(5, 6, 'Nissan Leaf Plus', 'EV-FL-5005', 62.00, 'CHAdeMO', '2026-03-12 16:30:00'),
(6, 2, 'Porsche Taycan 4S', 'EV-CA-9999', 93.40, 'CCS2', '2026-04-01 09:00:00'),
(7, 3, 'Ford Mustang Mach-E', 'EV-CA-2044', 88.00, 'CCS2', '2026-02-20 11:00:00'),
(8, 4, 'Audi e-tron GT Quattro', 'EV-SF-5501', 93.40, 'CCS2', '2026-02-22 14:00:00'),
(9, 5, 'Kia EV6 GT-Line', 'EV-SJ-7721', 77.40, 'CCS2', '2026-02-25 09:30:00'),
(10, 6, 'BMW i4 M50 Gran Coupe', 'EV-PA-8890', 83.90, 'CCS2', '2026-03-01 10:00:00'),
(11, 2, 'Rivian R1T Adventure', 'EV-CA-4422', 135.00, 'CCS2', '2026-03-04 12:00:00'),
(12, 3, 'Polestar 2 Long Range', 'EV-OAK-3311', 78.00, 'CCS2', '2026-03-08 15:30:00')
ON DUPLICATE KEY UPDATE vehicle_model=VALUES(vehicle_model);

-- 3. INSERT SAMPLE CHARGING STATIONS
INSERT INTO CHARGING_STATIONS (station_id, station_name, location, latitude, longitude, total_ports, status, price_per_kwh, created_at) VALUES
(1, 'Metro EV Hub - Downtown Central', '100 Market St, Downtown', 37.77490000, -122.41940000, 4, 'active', 0.28, '2026-01-01 00:00:00'),
(2, 'GreenCharge SuperStation - Tech Park', '500 Innovation Way, Silicon Valley', 37.38610000, -122.08390000, 4, 'active', 0.32, '2026-01-05 00:00:00'),
(3, 'EcoPower Express - Highway 101 Oasis', 'Mile Marker 42, Interstate 101', 37.56300000, -122.32550000, 2, 'active', 0.35, '2026-01-15 00:00:00'),
(4, 'CityMall ChargePoint - Westside', '750 Westside Galleria Blvd', 37.68790000, -122.47020000, 2, 'maintenance', 0.25, '2026-02-01 00:00:00'),
(5, 'Silicon Bay Supercharger - Menlo Park', '2400 Sand Hill Rd, Menlo Park', 37.42200000, -122.18100000, 6, 'active', 0.34, '2026-02-10 00:00:00'),
(6, 'Airport SkyCharge Terminal Hub', 'SFO International Airport, North Access Rd', 37.62130000, -122.37900000, 6, 'active', 0.38, '2026-02-15 00:00:00'),
(7, 'Golden Gate EcoCharge Plaza', '1000 Presidio Blvd, San Francisco', 37.80100000, -122.45800000, 4, 'active', 0.29, '2026-02-20 00:00:00'),
(8, 'East Bay Express Charger', '555 12th St, Downtown Oakland', 37.80440000, -122.27120000, 4, 'active', 0.27, '2026-02-25 00:00:00'),
(9, 'Stanford Research ChargeHub', '3165 Porter Dr, Palo Alto', 37.40980000, -122.14650000, 6, 'active', 0.33, '2026-03-01 00:00:00'),
(10, 'San Jose Innovation ChargePoint', '170 W San Carlos St, Downtown San Jose', 37.33180000, -121.89060000, 6, 'active', 0.31, '2026-03-05 00:00:00'),
(11, 'Marina Green Solar EV Park', 'Marina Blvd & Scott St, San Francisco', 37.80550000, -122.44100000, 4, 'active', 0.26, '2026-03-10 00:00:00'),
(12, 'Napa Valley Green Corridor', '500 First St, Napa', 38.29750000, -122.28690000, 4, 'active', 0.36, '2026-03-15 00:00:00')
ON DUPLICATE KEY UPDATE station_name=VALUES(station_name), total_ports=VALUES(total_ports), price_per_kwh=VALUES(price_per_kwh), latitude=VALUES(latitude), longitude=VALUES(longitude);

-- 4. INSERT SAMPLE CHARGING PORTS
INSERT INTO CHARGING_PORTS (port_id, station_id, port_number, port_type, power_rating, status, created_at) VALUES
(1, 1, 'P1-01', 'CCS2 Fast DC', 150.00, 'available', '2026-01-01 01:00:00'),
(2, 1, 'P1-02', 'CCS2 Fast DC', 150.00, 'occupied', '2026-01-01 01:00:00'),
(3, 1, 'P1-03', 'Type 2 AC', 22.00, 'available', '2026-01-01 01:00:00'),
(4, 1, 'P1-04', 'Type 2 AC', 22.00, 'reserved', '2026-01-01 01:00:00'),
(5, 2, 'P2-01', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-01-05 01:00:00'),
(6, 2, 'P2-02', 'CCS2 Fast DC', 150.00, 'occupied', '2026-01-05 01:00:00'),
(7, 2, 'P2-03', 'Type 2 AC', 22.00, 'available', '2026-01-05 01:00:00'),
(8, 2, 'P2-04', 'CHAdeMO Fast DC', 50.00, 'available', '2026-01-05 01:00:00'),
(9, 3, 'P3-01', 'CCS2 Fast DC', 150.00, 'available', '2026-01-15 01:00:00'),
(10, 3, 'P3-02', 'CCS2 Fast DC', 150.00, 'maintenance', '2026-01-15 01:00:00'),
(11, 4, 'P4-01', 'Type 2 AC', 22.00, 'maintenance', '2026-02-01 01:00:00'),
(12, 4, 'P4-02', 'Type 2 AC', 22.00, 'maintenance', '2026-02-01 01:00:00'),
-- Station 5 (Menlo Park)
(13, 5, 'P5-01', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-02-10 01:00:00'),
(14, 5, 'P5-02', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-02-10 01:00:00'),
(15, 5, 'P5-03', 'CCS2 Fast DC', 150.00, 'occupied', '2026-02-10 01:00:00'),
(16, 5, 'P5-04', 'CCS2 Fast DC', 150.00, 'available', '2026-02-10 01:00:00'),
(17, 5, 'P5-05', 'Type 2 AC', 22.00, 'available', '2026-02-10 01:00:00'),
(18, 5, 'P5-06', 'CHAdeMO Fast DC', 50.00, 'available', '2026-02-10 01:00:00'),
-- Station 6 (SFO Airport)
(19, 6, 'P6-01', 'CCS2 Ultra-Fast DC', 350.00, 'occupied', '2026-02-15 01:00:00'),
(20, 6, 'P6-02', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-02-15 01:00:00'),
(21, 6, 'P6-03', 'CCS2 Fast DC', 150.00, 'available', '2026-02-15 01:00:00'),
(22, 6, 'P6-04', 'CCS2 Fast DC', 150.00, 'available', '2026-02-15 01:00:00'),
(23, 6, 'P6-05', 'Type 2 AC', 22.00, 'reserved', '2026-02-15 01:00:00'),
(24, 6, 'P6-06', 'Type 2 AC', 22.00, 'available', '2026-02-15 01:00:00'),
-- Station 7 (Presidio Golden Gate)
(25, 7, 'P7-01', 'CCS2 Fast DC', 150.00, 'available', '2026-02-20 01:00:00'),
(26, 7, 'P7-02', 'CCS2 Fast DC', 150.00, 'occupied', '2026-02-20 01:00:00'),
(27, 7, 'P7-03', 'Type 2 AC', 22.00, 'available', '2026-02-20 01:00:00'),
(28, 7, 'P7-04', 'Type 2 AC', 22.00, 'available', '2026-02-20 01:00:00'),
-- Station 8 (Downtown Oakland)
(29, 8, 'P8-01', 'CCS2 Fast DC', 150.00, 'available', '2026-02-25 01:00:00'),
(30, 8, 'P8-02', 'CCS2 Fast DC', 150.00, 'available', '2026-02-25 01:00:00'),
(31, 8, 'P8-03', 'Type 2 AC', 22.00, 'occupied', '2026-02-25 01:00:00'),
(32, 8, 'P8-04', 'CHAdeMO Fast DC', 50.00, 'available', '2026-02-25 01:00:00'),
-- Station 9 (Stanford Research Palo Alto)
(33, 9, 'P9-01', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-03-01 01:00:00'),
(34, 9, 'P9-02', 'CCS2 Fast DC', 150.00, 'available', '2026-03-01 01:00:00'),
(35, 9, 'P9-03', 'CCS2 Fast DC', 150.00, 'occupied', '2026-03-01 01:00:00'),
(36, 9, 'P9-04', 'Type 2 AC', 22.00, 'available', '2026-03-01 01:00:00'),
(37, 9, 'P9-05', 'Type 2 AC', 22.00, 'available', '2026-03-01 01:00:00'),
(38, 9, 'P9-06', 'CHAdeMO Fast DC', 50.00, 'available', '2026-03-01 01:00:00'),
-- Station 10 (San Jose Innovation)
(39, 10, 'P10-01', 'CCS2 Ultra-Fast DC', 350.00, 'available', '2026-03-05 01:00:00'),
(40, 10, 'P10-02', 'CCS2 Ultra-Fast DC', 350.00, 'occupied', '2026-03-05 01:00:00'),
(41, 10, 'P10-03', 'CCS2 Fast DC', 150.00, 'available', '2026-03-05 01:00:00'),
(42, 10, 'P10-04', 'CCS2 Fast DC', 150.00, 'available', '2026-03-05 01:00:00'),
(43, 10, 'P10-05', 'Type 2 AC', 22.00, 'available', '2026-03-05 01:00:00'),
(44, 10, 'P10-06', 'Type 2 AC', 22.00, 'available', '2026-03-05 01:00:00'),
-- Station 11 (Marina Green Solar Park)
(45, 11, 'P11-01', 'CCS2 Fast DC', 150.00, 'available', '2026-03-10 01:00:00'),
(46, 11, 'P11-02', 'CCS2 Fast DC', 150.00, 'available', '2026-03-10 01:00:00'),
(47, 11, 'P11-03', 'Type 2 AC', 22.00, 'occupied', '2026-03-10 01:00:00'),
(48, 11, 'P11-04', 'Type 2 AC', 22.00, 'available', '2026-03-10 01:00:00'),
-- Station 12 (Napa Valley Green Corridor)
(49, 12, 'P12-01', 'CCS2 Fast DC', 150.00, 'available', '2026-03-15 01:00:00'),
(50, 12, 'P12-02', 'CCS2 Fast DC', 150.00, 'available', '2026-03-15 01:00:00'),
(51, 12, 'P12-03', 'Type 2 AC', 22.00, 'available', '2026-03-15 01:00:00'),
(52, 12, 'P12-04', 'Type 2 AC', 22.00, 'maintenance', '2026-03-15 01:00:00')
ON DUPLICATE KEY UPDATE port_number=VALUES(port_number), power_rating=VALUES(power_rating), status=VALUES(status);

-- 5. INSERT SAMPLE BOOKINGS
INSERT INTO BOOKING (booking_id, user_id, station_id, port_id, vehicle_id, booking_time, start_time, end_time, status, created_at) VALUES
(1, 2, 1, 2, 1, '2026-08-15 08:30:00', '2026-08-15 09:00:00', '2026-08-15 10:00:00', 'completed', '2026-08-15 08:30:00'),
(2, 3, 2, 6, 2, '2026-08-15 13:00:00', '2026-08-15 14:00:00', '2026-08-15 15:30:00', 'completed', '2026-08-15 13:00:00'),
(3, 4, 1, 4, 3, '2026-08-16 09:00:00', '2026-08-16 12:00:00', '2026-08-16 13:00:00', 'confirmed', '2026-08-16 09:00:00'),
(4, 5, 2, 5, 4, '2026-08-16 10:00:00', '2026-08-16 16:00:00', '2026-08-16 17:00:00', 'confirmed', '2026-08-16 10:00:00'),
(5, 6, 2, 8, 5, '2026-08-14 10:00:00', '2026-08-14 11:00:00', '2026-08-14 12:00:00', 'cancelled', '2026-08-14 10:00:00')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. INSERT SAMPLE CHARGING SESSIONS
INSERT INTO CHARGING_SESSION (session_id, booking_id, user_id, port_id, vehicle_id, start_time, end_time, initial_battery_level, final_battery_level, status, created_at) VALUES
(1, 1, 2, 2, 1, '2026-08-15 09:05:00', '2026-08-15 09:55:00', 20.00, 85.00, 'completed', '2026-08-15 09:05:00'),
(2, 2, 3, 6, 2, '2026-08-15 14:05:00', '2026-08-15 15:20:00', 15.00, 90.00, 'completed', '2026-08-15 14:05:00'),
(3, NULL, 2, 2, 1, '2026-08-16 10:00:00', NULL, 30.00, NULL, 'in_progress', '2026-08-16 10:00:00'),
(4, NULL, 3, 6, 2, '2026-08-16 10:15:00', NULL, 25.00, NULL, 'in_progress', '2026-08-16 10:15:00')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 7. INSERT SAMPLE ENERGY CONSUMPTION
INSERT INTO ENERGY_CONSUMPTION (consumption_id, session_id, energy_consumed, peak_power, voltage, recorded_at) VALUES
(1, 1, 48.75, 142.50, 400.00, '2026-08-15 09:55:00'),
(2, 2, 58.05, 148.00, 405.00, '2026-08-15 15:20:00'),
(3, 3, 14.20, 115.00, 396.00, '2026-08-16 10:20:00'),
(4, 4, 18.50, 138.00, 402.00, '2026-08-16 10:25:00')
ON DUPLICATE KEY UPDATE energy_consumed=VALUES(energy_consumed);

-- 8. INSERT SAMPLE PAYMENTS
INSERT INTO PAYMENT (payment_id, user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time) VALUES
(1, 2, 1, 1, 13.65, 'credit_card', 'completed', 'TXN_20260815_001', '2026-08-15 09:58:00'),
(2, 3, 2, 2, 18.58, 'upi', 'completed', 'TXN_20260815_002', '2026-08-15 15:22:00'),
(3, 4, NULL, 3, 5.00, 'wallet', 'completed', 'TXN_20260816_003', '2026-08-16 09:05:00'),
(4, 5, NULL, 4, 5.00, 'upi', 'pending', 'TXN_20260816_004', '2026-08-16 10:02:00')
ON DUPLICATE KEY UPDATE payment_status=VALUES(payment_status);
