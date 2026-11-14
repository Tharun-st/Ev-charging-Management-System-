@echo off
title EV Charging - Backend Server
cd /d "%~dp0Smart-EV-Charging\backend"
set "PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%"

echo ========================================================
echo  Starting EV Charging Backend (http://localhost:5000)
echo ========================================================
npm start
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Backend stopped unexpectedly.
    pause
)
