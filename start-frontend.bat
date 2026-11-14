@echo off
title EV Charging - Frontend Server
cd /d "%~dp0Smart-EV-Charging\frontend"
set "PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%"

echo ========================================================
echo  Starting EV Charging Frontend (http://localhost:5173)
echo ========================================================
npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Frontend stopped unexpectedly.
    pause
)
