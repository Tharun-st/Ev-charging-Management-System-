-- ====================================================================
-- SMART EV CHARGING MANAGEMENT SYSTEM - TRANSACTIONS (ACID DEMONSTRATION)
-- Database: smart_ev_charging
-- Purpose: Demonstrates ACID Properties, START TRANSACTION, COMMIT, 
--          ROLLBACK, and SAVEPOINTS.
-- ====================================================================
-- ACID CONCEPTS IN SMART EV CHARGING:
--
-- 1. ATOMICITY:
--    Either all steps of a charging session checkout (update session status,
--    log energy consumption, free port, and record payment) succeed together,
--    or NONE of them persist.
--
-- 2. CONSISTENCY:
--    The database transitions from one valid state to another, strictly
--    maintaining all foreign keys, check constraints, and business invariants.
--
-- 3. ISOLATION:
--    Concurrent users booking or charging simultaneously do not observe
--    uncommitted "dirty" data from each other (InnoDB default REPEATABLE READ).
--
-- 4. DURABILITY:
--    Once a transaction is committed, changes survive even during system crashes
--    via the InnoDB Redo Log (WAL - Write-Ahead Logging).
-- ====================================================================

USE smart_ev_charging;

-- ====================================================================
-- SCENARIO 1: SUCCESSFUL ATOMIC TRANSACTION (WITH COMMIT)
-- Completes an active charging session, writes telemetry reading,
-- frees the port, and generates payment record in a single atomic unit.
-- ====================================================================

START TRANSACTION;

-- Step 1: Conclude active session #3
UPDATE CHARGING_SESSION
SET end_time = NOW(),
    final_battery_level = 88.00,
    status = 'completed'
WHERE session_id = 3 AND status = 'in_progress';

-- Step 2: Record telemetry energy consumption reading
INSERT INTO ENERGY_CONSUMPTION (session_id, energy_consumed, peak_power, voltage, recorded_at)
VALUES (3, 42.50, 145.00, 400.00, NOW());

-- Step 3: Release charging port back to available
UPDATE CHARGING_PORTS
SET status = 'available'
WHERE port_id = 2;

-- Step 4: Record successful payment entry ($11.90)
INSERT INTO PAYMENT (
    user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time
) VALUES (
    2, 3, NULL, 11.90, 'credit_card', 'completed', CONCAT('TXN_DEMO_', UNIX_TIMESTAMP()), NOW()
);

-- Verification within transaction before permanent persistence
SELECT 
    cs.session_id, 
    cs.status AS session_status, 
    ec.energy_consumed, 
    cp.status AS port_status, 
    p.amount, 
    p.payment_status
FROM CHARGING_SESSION cs
JOIN ENERGY_CONSUMPTION ec ON cs.session_id = ec.session_id
JOIN CHARGING_PORTS cp ON cs.port_id = cp.port_id
JOIN PAYMENT p ON cs.session_id = p.session_id
WHERE cs.session_id = 3;

-- Commit all changes permanently
COMMIT;

-- ====================================================================
-- SCENARIO 2: TRANSACTION FAILURE & ROLLBACK (DEMONSTRATION)
-- Simulates booking creation failure where an error condition is encountered,
-- triggering an explicit ROLLBACK to preserve original database state.
-- ====================================================================

START TRANSACTION;

-- Step 1: Driver reserves a charging slot
INSERT INTO BOOKING (
    user_id, station_id, port_id, vehicle_id, booking_time, start_time, end_time, status
) VALUES (
    2, 1, 1, 1, NOW(), '2026-09-15 10:00:00', '2026-09-15 11:00:00', 'pending'
);

-- Store generated booking ID
SET @test_booking_id = LAST_INSERT_ID();

-- Step 2: Tentatively mark port as reserved
UPDATE CHARGING_PORTS
SET status = 'reserved'
WHERE port_id = 1;

-- Simulated verification check:
-- Suppose external payment authorization fails or driver vehicle was deactivated
-- We simulate the failure trigger:
SET @payment_successful = FALSE;

-- Conditional logic evaluation
-- In failure scenario, we execute explicit ROLLBACK:
ROLLBACK;

-- Verify that the booking was NOT saved and port status was restored:
SELECT 
    COUNT(*) AS booking_exists 
FROM BOOKING 
WHERE booking_id = @test_booking_id;

SELECT 
    port_id, port_number, status 
FROM CHARGING_PORTS 
WHERE port_id = 1;

-- ====================================================================
-- SCENARIO 3: ADVANCED TRANSACTION WITH SAVEPOINTS
-- Demonstrates partial rollback to an intermediate checkpoint without
-- discarding earlier valid operations.
-- ====================================================================

START TRANSACTION;

-- Step 1: Update user vehicle details (Successful operation)
UPDATE VEHICLES
SET battery_capacity = 82.00
WHERE vehicle_id = 1;

-- Set Savepoint after Step 1
SAVEPOINT sp_vehicle_updated;

-- Step 2: Attempt to apply a temporary promotional wallet credit or charge
INSERT INTO PAYMENT (
    user_id, session_id, booking_id, amount, payment_method, payment_status, transaction_id, payment_time
) VALUES (
    2, NULL, NULL, 50.00, 'wallet', 'pending', CONCAT('TXN_WALLET_', UNIX_TIMESTAMP()), NOW()
);

-- Suppose the wallet payment had an invalid condition or was declined:
-- Rollback specifically to the savepoint:
ROLLBACK TO SAVEPOINT sp_vehicle_updated;

-- Only the vehicle update remains in the transaction workspace.
-- Commit the valid portion:
COMMIT;
