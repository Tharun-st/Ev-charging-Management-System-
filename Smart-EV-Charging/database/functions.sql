-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - STORED FUNCTIONS (DDL)
-- Database: smart_ev_charging
-- Purpose: Modular computational routines returning scalar values.
-- ====================================================================

USE smart_ev_charging;

DELIMITER //

-- ====================================================================
-- 1. FUNCTION: fn_calculate_charging_cost
-- Computes the billing cost based on energy consumed (kWh) and station rate
-- ====================================================================
DROP FUNCTION IF EXISTS fn_calculate_charging_cost //
CREATE FUNCTION fn_calculate_charging_cost(
    p_energy_kwh     DECIMAL(8,2),
    p_price_per_kwh  DECIMAL(6,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_cost DECIMAL(10,2);
    IF p_energy_kwh IS NULL OR p_energy_kwh <= 0 THEN
        RETURN 0.00;
    END IF;
    IF p_price_per_kwh IS NULL OR p_price_per_kwh <= 0 THEN
        RETURN 0.00;
    END IF;
    SET v_cost = ROUND(p_energy_kwh * p_price_per_kwh, 2);
    RETURN v_cost;
END //

-- ====================================================================
-- 2. FUNCTION: fn_get_available_ports_count
-- Returns the number of currently available ports at a given station
-- ====================================================================
DROP FUNCTION IF EXISTS fn_get_available_ports_count //
CREATE FUNCTION fn_get_available_ports_count(
    p_station_id INT
)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_available_count INT;
    SELECT COUNT(*) INTO v_available_count
    FROM CHARGING_PORTS
    WHERE station_id = p_station_id AND status = 'available';
    RETURN COALESCE(v_available_count, 0);
END //

-- ====================================================================
-- 3. FUNCTION: fn_calculate_duration_minutes
-- Returns time elapsed in minutes between two timestamps
-- ====================================================================
DROP FUNCTION IF EXISTS fn_calculate_duration_minutes //
CREATE FUNCTION fn_calculate_duration_minutes(
    p_start_time DATETIME,
    p_end_time   DATETIME
)
RETURNS INT
DETERMINISTIC
BEGIN
    IF p_start_time IS NULL OR p_end_time IS NULL THEN
        RETURN 0;
    END IF;
    IF p_end_time < p_start_time THEN
        RETURN 0;
    END IF;
    RETURN TIMESTAMPDIFF(MINUTE, p_start_time, p_end_time);
END //

-- ====================================================================
-- 4. FUNCTION: fn_get_user_total_spent
-- Returns lifetime settled payments for a specific user ID
-- ====================================================================
DROP FUNCTION IF EXISTS fn_get_user_total_spent //
CREATE FUNCTION fn_get_user_total_spent(
    p_user_id INT
)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(10,2);
    SELECT COALESCE(SUM(amount), 0.00) INTO v_total
    FROM PAYMENT
    WHERE user_id = p_user_id AND payment_status = 'completed';
    RETURN v_total;
END //

DELIMITER ;
