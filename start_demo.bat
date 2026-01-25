@echo off
echo ========================================
echo   Self-Healing Demo - Mission Control
echo ========================================
echo.

echo [1/3] Starting Healer (Backend Monitor + Breakable App)...
cd backend
start "Healer & Backend" cmd /k "python healer.py"
cd ..
timeout /t 2 /nobreak > nul

echo [2/3] Starting Mission Control API Server (Port 5001)...
cd backend
start "Mission Control API" cmd /k "python api_server.py"
cd ..
timeout /t 2 /nobreak > nul

echo [3/3] Starting Frontend Dashboard (Port 3000)...
cd frontend
start "Frontend Dashboard" cmd /k "npm run dev"

echo.
echo ========================================
echo   All services starting...
echo ========================================
echo.
echo   Frontend Dashboard: http://localhost:3000
echo   Breakable App:      http://localhost:5000
echo   Mission Control API: http://localhost:5001
echo.
echo   To crash the app, use the Control Panel on the frontend!
echo ========================================
