@echo off
REM Smart EV Charging Management System - Quick Start Script for Windows
REM This script sets up and starts both backend and frontend

setlocal enabledelayedexpansion

set "PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%"

cls
echo.
echo ================================
echo Smart EV Charging System Setup
echo ================================
echo.

REM Check for Node.js
echo Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo OK: Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed
    pause
    exit /b 1
)
echo OK: npm is installed

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo OK: Backend dependencies installed

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo OK: Frontend dependencies installed

cls
echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Ensure MySQL is running
echo 2. Set up database (see SETUP_GUIDE.md)
echo 3. Open 2 terminals:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
pause
