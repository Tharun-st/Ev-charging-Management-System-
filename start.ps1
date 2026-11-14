# Smart EV Charging Management System - One-Click Launcher for PowerShell
$ErrorActionPreference = 'Continue'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Set PATH
$env:Path = "C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;$env:Path"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Smart EV Charging Management System" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check MySQL
Write-Host "[*] Checking MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name MySQL80 -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -ne 'Running') {
    Write-Host "[!] Starting MySQL80 service..." -ForegroundColor Yellow
    Start-Service -Name MySQL80 -ErrorAction SilentlyContinue
}
Write-Host "[OK] MySQL service is running." -ForegroundColor Green

# 2. Launch Backend
Write-Host "[*] Starting Backend Server (http://localhost:5000)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "title EV Backend && cd /d `"$projectRoot\Smart-EV-Charging\backend`" && set PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH% && npm start"

# 3. Launch Frontend
Write-Host "[*] Starting Frontend App (http://localhost:5173)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "title EV Frontend && cd /d `"$projectRoot\Smart-EV-Charging\frontend`" && set PATH=C:\Program Files\nodejs;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH% && npm run dev"

# 4. Wait and Open Browser
Write-Host "[*] Waiting 3 seconds for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "[*] Opening browser to http://localhost:5173 ..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  System is running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Demo Login:" -ForegroundColor White
Write-Host "  - Admin:  admin@smartev.com / admin123" -ForegroundColor Gray
Write-Host "  - Driver: alice.johnson@example.com / user123" -ForegroundColor Gray
Write-Host ""
Write-Host "  To stop the application, run: .\stop.bat" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
