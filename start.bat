@echo off
title Smart EV Charging System
cd /d "%~dp0"

echo ========================================================
echo   Smart EV Charging Management System Launcher
echo ========================================================
echo.

REM Ensure Node.js and MySQL are in PATH
set "PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%"

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found in PATH.
    echo Please verify Node.js is installed at C:\Program Files\nodejs.
    echo.
    pause
    exit /b 1
)

REM Check MySQL service
echo [*] Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] MySQL80 service is not running. Attempting to start it...
    net start MySQL80
) else (
    echo [OK] MySQL service is running.
)

echo.
echo [*] Starting Backend (http://localhost:5000) and Frontend (http://localhost:5173)...
echo [*] Opening your browser in 3 seconds...
echo.

REM Launch browser automatically in background
start "" cmd /c "ping 127.0.0.1 -n 4 >nul & start http://localhost:5173"

REM Run both servers in this window
call npm start

if %errorlevel% neq 0 (
    echo.
    echo [!] Application stopped or encountered an error.
    pause
)
