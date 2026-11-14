-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - DATABASE SCHEMA (DDL)
-- Database: smart_ev_charging
-- Engine: InnoDB (Supports ACID transactions, Foreign Keys, Row-Level Locking)
-- ====================================================================
-- ADBMS NORMALIZATION DOCUMENTATION:
--
-- 1. FIRST NORMAL FORM (1NF):
--    - Each table has a defined Primary Key (user_id, vehicle_id, station_id, etc.).
--    - All column values are atomic (e.g., location, name, port_type are individual scalar attributes).
--    - No repeating groups or comma-separated lists of values.
--
-- 2. SECOND NORMAL FORM (2NF):
--    - Satisfies 1NF.
--    - Every non-key attribute is fully functionally dependent on the entire Primary Key.
--    - Since all primary keys are single-column synthetic/surrogate keys (AUTO_INCREMENT),
--      partial functional dependencies cannot exist.
--
-- 3. THIRD NORMAL FORM (3NF):
--    - Satisfies 2NF.
--    - No transitive functional dependencies exist (X -> Y -> Z where X is PK).
--    - Non-key attributes depend solely on the candidate keys. For example, vehicle
--      specifications belong in VEHICLES, user profile attributes reside strictly in USERS,
--      station metadata in CHARGING_STATIONS, and port details in CHARGING_PORTS.
-- ====================================================================

CREATE DATABASE IF NOT EXISTS smart_ev_charging
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smart_ev_charging;

-- Disable foreign key checks during schema initialization
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS PAYMENT;
DROP TABLE IF EXISTS ENERGY_CONSUMPTION;
DROP TABLE IF EXISTS CHARGING_SESSION;
DROP TABLE IF EXISTS BOOKING;
DROP TABLE IF EXISTS CHARGING_PORTS;
DROP TABLE IF EXISTS CHARGING_STATIONS;
DROP TABLE IF EXISTS VEHICLES;
DROP TABLE IF EXISTS USERS;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 1. USERS TABLE
-- Stores credentials and profiles for EV drivers and system administrators
-- ====================================================================
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    phone VARCHAR(20),
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ====================================================================
-- 2. VEHICLES TABLE
-- Stores registered electric vehicles belonging to users
-- ====================================================================
CREATE TABLE VEHICLES (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL UNIQUE,
    battery_capacity DECIMAL(6,2) NOT NULL COMMENT 'Capacity in kWh',
    port_type VARCHAR(50) NOT NULL COMMENT 'e.g. CCS2, Type 2, CHAdeMO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_battery_capacity CHECK (battery_capacity > 0.0),
    CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) 
        REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_vehicles_user (user_id),
    INDEX idx_vehicles_plate (license_plate)
) ENGINE=InnoDB;

-- ====================================================================
-- 3. CHARGING_STATIONS TABLE
-- Physical charging station hubs, locations, and tariff pricing
-- ====================================================================
CREATE TABLE CHARGING_STATIONS (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_ports INT NOT NULL DEFAULT 1,
    status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    price_per_kwh DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT 'Tariff per kWh in USD/local currency',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_price_per_kwh CHECK (price_per_kwh >= 0.00),
    CONSTRAINT chk_total_ports CHECK (total_ports >= 0),
    INDEX idx_stations_status (status),
    INDEX idx_stations_location (location(50))
) ENGINE=InnoDB;

-- ====================================================================
-- 4. CHARGING_PORTS TABLE
-- Individual charging connectors/plugs installed at stations
-- ====================================================================
CREATE TABLE CHARGING_PORTS (
    port_id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    port_number VARCHAR(20) NOT NULL,
    port_type VARCHAR(50) NOT NULL COMMENT 'e.g. CCS2 Fast DC, Type 2 AC, CHAdeMO',
    power_rating DECIMAL(6,2) NOT NULL COMMENT 'Rated power in kW',
    status ENUM('available', 'occupied', 'reserved', 'maintenance') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_power_rating CHECK (power_rating > 0.0),
    CONSTRAINT uq_station_port UNIQUE (station_id, port_number),
    CONSTRAINT fk_port_station FOREIGN KEY (station_id) 
        REFERENCES CHARGING_STATIONS(station_id) ON DELETE CASCADE,
    INDEX idx_ports_station (station_id),
    INDEX idx_ports_status (status)
) ENGINE=InnoDB;

-- ====================================================================
-- 5. BOOKING TABLE
-- Advance slot reservations made by users for specific ports
-- ====================================================================
CREATE TABLE BOOKING (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    port_id INT NOT NULL,
    vehicle_id INT,
    booking_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_time CHECK (end_time > start_time),
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) 
        REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_station FOREIGN KEY (station_id) 
        REFERENCES CHARGING_STATIONS(station_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_port FOREIGN KEY (port_id) 
        REFERENCES CHARGING_PORTS(port_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) 
        REFERENCES VEHICLES(vehicle_id) ON DELETE SET NULL,
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_station (station_id),
    INDEX idx_booking_port (port_id),
    INDEX idx_booking_status (status),
    INDEX idx_booking_start (start_time)
) ENGINE=InnoDB;

-- ====================================================================
-- 6. CHARGING_SESSION TABLE
-- Real-time and completed physical vehicle charging sessions
-- ====================================================================
CREATE TABLE CHARGING_SESSION (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    user_id INT NOT NULL,
    port_id INT NOT NULL,
    vehicle_id INT,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    initial_battery_level DECIMAL(5,2) COMMENT 'Percentage % (0-100)',
    final_battery_level DECIMAL(5,2) COMMENT 'Percentage % (0-100)',
    status ENUM('in_progress', 'completed', 'stopped', 'failed') NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_session_initial_battery CHECK (initial_battery_level BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_session_final_battery CHECK (final_battery_level IS NULL OR final_battery_level BETWEEN 0.00 AND 100.00),
    CONSTRAINT fk_session_booking FOREIGN KEY (booking_id) 
        REFERENCES BOOKING(booking_id) ON DELETE SET NULL,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) 
        REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_session_port FOREIGN KEY (port_id) 
        REFERENCES CHARGING_PORTS(port_id) ON DELETE CASCADE,
    CONSTRAINT fk_session_vehicle FOREIGN KEY (vehicle_id) 
        REFERENCES VEHICLES(vehicle_id) ON DELETE SET NULL,
    INDEX idx_session_user (user_id),
    INDEX idx_session_port (port_id),
    INDEX idx_session_status (status)
) ENGINE=InnoDB;

-- ====================================================================
-- 7. ENERGY_CONSUMPTION TABLE
-- Telemetry readings of electrical energy consumed per session
-- ====================================================================
CREATE TABLE ENERGY_CONSUMPTION (
    consumption_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    energy_consumed DECIMAL(8,2) NOT NULL COMMENT 'Energy consumed in kWh',
    peak_power DECIMAL(6,2) COMMENT 'Peak power observed in kW',
    voltage DECIMAL(6,2) COMMENT 'Operating voltage in V',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_energy_consumed CHECK (energy_consumed >= 0.00),
    CONSTRAINT fk_consumption_session FOREIGN KEY (session_id) 
        REFERENCES CHARGING_SESSION(session_id) ON DELETE CASCADE,
    INDEX idx_consumption_session (session_id)
) ENGINE=InnoDB;

-- ====================================================================
-- 8. PAYMENT TABLE
-- Financial billing records for completed charging sessions or bookings
-- ====================================================================
CREATE TABLE PAYMENT (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id INT,
    booking_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'upi', 'wallet', 'net_banking') NOT NULL DEFAULT 'upi',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100) UNIQUE,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_payment_amount CHECK (amount >= 0.00),
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) 
        REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_session FOREIGN KEY (session_id) 
        REFERENCES CHARGING_SESSION(session_id) ON DELETE SET NULL,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) 
        REFERENCES BOOKING(booking_id) ON DELETE SET NULL,
    INDEX idx_payment_user (user_id),
    INDEX idx_payment_session (session_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_txid (transaction_id)
) ENGINE=InnoDB;
