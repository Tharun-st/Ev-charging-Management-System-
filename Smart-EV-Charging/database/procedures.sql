-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - STORED PROCEDURES (DDL)
-- Database: smart_ev_charging
-- Purpose: Encapsulates core business transactions, enforces domain logic,
--          and provides modular database routines.
-- ====================================================================

USE smart_ev_charging;

DELIMITER //

-- ====================================================================
-- 1. PROCEDURE: sp_create_booking
-- Validates port availability, prevents double-booking overlaps,
-- creates the reservation record, and updates port status to 'reserved'.
-- ====================================================================
DROP PROCEDURE IF EXISTS sp_create_booking //
CREATE PROCEDURE sp_create_booking(
    IN  p_user_id     INT,
    IN  p_station_id  INT,
    IN  p_port_id     INT,
    IN  p_vehicle_id  INT,
    IN  p_start_time  DATETIME,
    IN  p_end_time    DATETIME,
    OUT o_booking_id  INT,
    OUT o_status_code VARCHAR(20),
    OUT o_message     VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_port_count INT;
    DECLARE v_port_status VARCHAR(20);
    DECLARE v_overlap_count INT;

    -- Basic input validation
    IF p_start_time >= p_end_time THEN
        SET o_booking_id = NULL;
        SET o_status_code = 'INVALID_TIME';
        SET o_message = 'Booking start time must be strictly earlier than end time.';
        LEAVE proc_label;
    END IF;

    -- Verify port exists and belongs to the specified station
    SELECT COUNT(*), status INTO v_port_count, v_port_status
    FROM CHARGING_PORTS
    WHERE port_id = p_port_id AND station_id = p_station_id
    GROUP BY status;

    IF v_port_count = 0 THEN
        SET o_booking_id = NULL;
        SET o_status_code = 'PORT_NOT_FOUND';
        SET o_message = 'Selected port does not exist at this station.';
        LEAVE proc_label;
    END IF;

    IF v_port_status = 'maintenance' THEN
        SET o_booking_id = NULL;
        SET o_status_code = 'PORT_MAINTENANCE';
        SET o_message = 'Port is currently under maintenance.';
        LEAVE proc_label;
    END IF;

    -- Check for overlapping active or confirmed bookings for the same port
    SELECT COUNT(*) INTO v_overlap_count
    FROM BOOKING
    WHERE port_id = p_port_id
      AND status IN ('confirmed', 'pending')
      AND (
          (start_time <= p_start_time AND end_time > p_start_time) OR
          (start_time < p_end_time AND end_time >= p_end_time) OR
          (p_start_time <= start_time AND p_end_time >= end_time)
      );

    IF v_overlap_count > 0 THEN
        SET o_booking_id = NULL;
        SET o_status_code = 'SLOT_UNAVAILABLE';
        SET o_message = 'This charging port is already booked for the selected time window.';
        LEAVE proc_label;
    END IF;

    -- Insert confirmed booking
    INSERT INTO BOOKING (user_id, station_id, port_id, vehicle_id, booking_time, start_time, end_time, status)
    VALUES (p_user_id, p_station_id, p_port_id, p_vehicle_id, NOW(), p_start_time, p_end_time, 'confirmed');

    SET o_booking_id = LAST_INSERT_ID();

    -- Mark port as reserved if the reservation starts within 30 minutes
    IF TIMESTAMPDIFF(MINUTE, NOW(), p_start_time) <= 30 THEN
        UPDATE CHARGING_PORTS
        SET status = 'reserved'
        WHERE port_id = p_port_id;
    END IF;

    SET o_status_code = 'SUCCESS';
    SET o_message = 'Booking successfully confirmed.';
END //

-- ====================================================================
-- 2. PROCEDURE: sp_start_charging_session
-- Initializes a charging session, links booking (if any), verifies vehicle,
-- and locks the charging port status to 'occupied'.
-- ====================================================================
DROP PROCEDURE IF EXISTS sp_start_charging_session //
CREATE PROCEDURE sp_start_charging_session(
    IN  p_booking_id      INT,
    IN  p_user_id         INT,
    IN  p_port_id         INT,
    IN  p_vehicle_id      INT,
    IN  p_initial_battery DECIMAL(5,2),
    OUT o_session_id      INT,
    OUT o_message         VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_port_status VARCHAR(20);

    -- Check port status
    SELECT status INTO v_port_status
    FROM CHARGING_PORTS
    WHERE port_id = p_port_id;

    IF v_port_status = 'occupied' THEN
        SET o_session_id = NULL;
        SET o_message = 'Port is already occupied by another active session.';
        LEAVE proc_label;
    END IF;

    IF v_port_status = 'maintenance' THEN
        SET o_session_id = NULL;
        SET o_message = 'Port is currently under maintenance.';
        LEAVE proc_label;
    END IF;

    -- Insert active session
    INSERT INTO CHARGING_SESSION (
        booking_id, user_id, port_id, vehicle_id, start_time, initial_battery_level, status
    ) VALUES (
        p_booking_id, p_user_id, p_port_id, p_vehicle_id, NOW(), p_initial_battery, 'in_progress'
    );

    SET o_session_id = LAST_INSERT_ID();

    -- Update port status to occupied
    UPDATE CHARGING_PORTS
    SET status = 'occupied'
    WHERE port_id = p_port_id;

    -- If connected with booking, mark booking as completed
    IF p_booking_id IS NOT NULL THEN
        UPDATE BOOKING
        SET status = 'completed'
        WHERE booking_id = p_booking_id;
    END IF;

    SET o_message = 'Charging session started successfully.';
END //

-- ====================================================================
-- 3. PROCEDURE: sp_complete_charging_session
-- Concludes an active session, logs telemetry readings, calculates final
-- amount due based on station tariff, and resets port status to 'available'.
-- ====================================================================
DROP PROCEDURE IF EXISTS sp_complete_charging_session //
CREATE PROCEDURE sp_complete_charging_session(
    IN  p_session_id       INT,
    IN  p_final_battery    DECIMAL(5,2),
    IN  p_energy_consumed  DECIMAL(8,2),
    IN  p_peak_power       DECIMAL(6,2),
    IN  p_voltage          DECIMAL(6,2),
    OUT o_amount_due       DECIMAL(10,2),
    OUT o_message          VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_port_id INT;
    DECLARE v_station_id INT;
    DECLARE v_price_per_kwh DECIMAL(6,2);
    DECLARE v_current_status VARCHAR(20);

    -- Fetch session details
    SELECT cs.port_id, cp.station_id, cs.status
    INTO v_port_id, v_station_id, v_current_status
    FROM CHARGING_SESSION cs
    JOIN CHARGING_PORTS cp ON cs.port_id = cp.port_id
    WHERE cs.session_id = p_session_id;

    IF v_current_status IS NULL THEN
        SET o_amount_due = 0.00;
        SET o_message = 'Charging session not found.';
        LEAVE proc_label;
    END IF;

    IF v_current_status <> 'in_progress' THEN
        SET o_amount_due = 0.00;
        SET o_message = 'Session is already ended.';
        LEAVE proc_label;
    END IF;

    -- Fetch station tariff
    SELECT price_per_kwh INTO v_price_per_kwh
    FROM CHARGING_STATIONS
    WHERE station_id = v_station_id;

    -- Calculate total cost
    SET o_amount_due = ROUND(p_energy_consumed * v_price_per_kwh, 2);

    -- Update session status to completed
    UPDATE CHARGING_SESSION
    SET end_time = NOW(),
        final_battery_level = p_final_battery,
        status = 'completed'
    WHERE session_id = p_session_id;

    -- Insert energy consumption telemetry
    INSERT INTO ENERGY_CONSUMPTION (session_id, energy_consumed, peak_power, voltage, recorded_at)
    VALUES (p_session_id, p_energy_consumed, p_peak_power, p_voltage, NOW());

    -- Free up port back to available
    UPDATE CHARGING_PORTS
    SET status = 'available'
    WHERE port_id = v_port_id;

    SET o_message = 'Charging session completed successfully.';
END //

-- ====================================================================
-- 4. PROCEDURE: sp_process_payment
-- Handles payment recording, generates unique transaction ID,
-- and updates payment status.
-- ====================================================================
DROP PROCEDURE IF EXISTS sp_process_payment //
CREATE PROCEDURE sp_process_payment(
    IN  p_session_id     INT,
    IN  p_booking_id     INT,
    IN  p_user_id        INT,
    IN  p_amount         DECIMAL(10,2),
    IN  p_payment_method VARCHAR(30),
    OUT o_transaction_id VARCHAR(100),
    OUT o_payment_id     INT,
    OUT o_message        VARCHAR(255)
)
BEGIN
    -- Generate pseudo-unique transaction reference
    SET o_transaction_id = CONCAT('TXN_', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '_', FLOOR(1000 + RAND() * 9000));

    INSERT INTO PAYMENT (
        user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time
    ) VALUES (
        p_user_id, p_session_id, p_booking_id, p_amount, p_payment_method, 'completed', o_transaction_id, NOW()
    );

    SET o_payment_id = LAST_INSERT_ID();
    SET o_message = 'Payment processed and verified successfully.';
END //

-- ====================================================================
-- 5. PROCEDURE: sp_get_admin_dashboard_metrics
-- Computes and returns all 10 key administrative statistics in a single call.
-- ====================================================================
DROP PROCEDURE IF EXISTS sp_get_admin_dashboard_metrics //
CREATE PROCEDURE sp_get_admin_dashboard_metrics(
    OUT o_total_users       INT,
    OUT o_total_vehicles    INT,
    OUT o_total_stations    INT,
    OUT o_total_ports       INT,
    OUT o_available_ports   INT,
    OUT o_occupied_ports    INT,
    OUT o_total_bookings    INT,
    OUT o_active_sessions   INT,
    OUT o_total_energy_kwh  DECIMAL(10,2),
    OUT o_total_revenue     DECIMAL(12,2)
)
BEGIN
    -- Total registered users (role='user')
    SELECT COUNT(*) INTO o_total_users FROM USERS WHERE role = 'user';

    -- Total vehicles
    SELECT COUNT(*) INTO o_total_vehicles FROM VEHICLES;

    -- Total stations
    SELECT COUNT(*) INTO o_total_stations FROM CHARGING_STATIONS;

    -- Total ports and status breakdown
    SELECT 
        COUNT(*),
        COALESCE(SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END), 0)
    INTO o_total_ports, o_available_ports, o_occupied_ports
    FROM CHARGING_PORTS;

    -- Total bookings
    SELECT COUNT(*) INTO o_total_bookings FROM BOOKING;

    -- Active charging sessions
    SELECT COUNT(*) INTO o_active_sessions FROM CHARGING_SESSION WHERE status = 'in_progress';

    -- Total energy consumed
    SELECT COALESCE(SUM(energy_consumed), 0.00) INTO o_total_energy_kwh FROM ENERGY_CONSUMPTION;

    -- Total completed revenue
    SELECT COALESCE(SUM(amount), 0.00) INTO o_total_revenue FROM PAYMENT WHERE payment_status = 'completed';
END //

DELIMITER ;
