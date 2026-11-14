-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - DATABASE TRIGGERS (DDL)
-- Database: smart_ev_charging
-- Purpose: Enforces automated data integrity, cascading state transitions,
--          and cross-table consistency at the database engine level.
-- ====================================================================

USE smart_ev_charging;

DELIMITER //

-- ====================================================================
-- 1. TRIGGER: trg_validate_booking_time
-- Prevents invalid bookings where end time is not after start time
-- ====================================================================
DROP TRIGGER IF EXISTS trg_validate_booking_time //
CREATE TRIGGER trg_validate_booking_time
BEFORE INSERT ON BOOKING
FOR EACH ROW
BEGIN
    IF NEW.end_time <= NEW.start_time THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Integrity Error: Booking end_time must be strictly after start_time.';
    END IF;
END //

-- ====================================================================
-- 2. TRIGGER: trg_prevent_double_active_session
-- Ensures a charging port cannot have more than one concurrent in-progress session
-- ====================================================================
DROP TRIGGER IF EXISTS trg_prevent_double_active_session //
CREATE TRIGGER trg_prevent_double_active_session
BEFORE INSERT ON CHARGING_SESSION
FOR EACH ROW
BEGIN
    DECLARE v_active_count INT;
    IF NEW.status = 'in_progress' THEN
        SELECT COUNT(*) INTO v_active_count
        FROM CHARGING_SESSION
        WHERE port_id = NEW.port_id AND status = 'in_progress';

        IF v_active_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Integrity Error: This port already has an active charging session.';
        END IF;
    END IF;
END //

-- ====================================================================
-- 3. TRIGGER: trg_after_session_start_occupy_port
-- Automatically sets port status to 'occupied' when a new session starts
-- ====================================================================
DROP TRIGGER IF EXISTS trg_after_session_start_occupy_port //
CREATE TRIGGER trg_after_session_start_occupy_port
AFTER INSERT ON CHARGING_SESSION
FOR EACH ROW
BEGIN
    IF NEW.status = 'in_progress' THEN
        UPDATE CHARGING_PORTS
        SET status = 'occupied'
        WHERE port_id = NEW.port_id;
    END IF;
END //

-- ====================================================================
-- 4. TRIGGER: trg_after_session_end_free_port
-- Automatically resets port status to 'available' when a session completes or stops
-- ====================================================================
DROP TRIGGER IF EXISTS trg_after_session_end_free_port //
CREATE TRIGGER trg_after_session_end_free_port
AFTER UPDATE ON CHARGING_SESSION
FOR EACH ROW
BEGIN
    IF OLD.status = 'in_progress' AND NEW.status IN ('completed', 'stopped') THEN
        UPDATE CHARGING_PORTS
        SET status = 'available'
        WHERE port_id = NEW.port_id;
    END IF;
END //

-- ====================================================================
-- 5. TRIGGER: trg_increment_station_ports
-- Automatically keeps total_ports synchronized when new ports are added
-- ====================================================================
DROP TRIGGER IF EXISTS trg_increment_station_ports //
CREATE TRIGGER trg_increment_station_ports
AFTER INSERT ON CHARGING_PORTS
FOR EACH ROW
BEGIN
    UPDATE CHARGING_STATIONS
    SET total_ports = (
        SELECT COUNT(*) 
        FROM CHARGING_PORTS 
        WHERE station_id = NEW.station_id
    )
    WHERE station_id = NEW.station_id;
END //

-- ====================================================================
-- 6. TRIGGER: trg_decrement_station_ports
-- Automatically keeps total_ports synchronized when ports are removed
-- ====================================================================
DROP TRIGGER IF EXISTS trg_decrement_station_ports //
CREATE TRIGGER trg_decrement_station_ports
AFTER DELETE ON CHARGING_PORTS
FOR EACH ROW
BEGIN
    UPDATE CHARGING_STATIONS
    SET total_ports = (
        SELECT COUNT(*) 
        FROM CHARGING_PORTS 
        WHERE station_id = OLD.station_id
    )
    WHERE station_id = OLD.station_id;
END //

DELIMITER ;
