@echo off
title Stop Smart EV Charging System
cd /d "%~dp0"

echo ========================================================
echo   Stopping Smart EV Charging System
echo ========================================================
echo.

taskkill /F /IM node.exe /T 2>nul
if %errorlevel% equ 0 (
    echo [OK] Stopped Node.js processes.
) else (
    echo [*] No running Node.js processes were found.
)

echo.
echo All EV charging servers have been stopped.
ping 127.0.0.1 -n 3 >nul
