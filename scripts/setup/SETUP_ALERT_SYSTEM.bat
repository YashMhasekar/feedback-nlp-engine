@echo off
echo ========================================
echo   ALERT SYSTEM SETUP
echo ========================================
echo.

echo [1/3] Initializing Alerts Database...
cd backend
python alerts_database.py
if errorlevel 1 (
    echo ERROR: Failed to initialize alerts database
    pause
    exit /b 1
)
echo.

echo [2/3] Testing Alert System...
python -c "from alerts_database import get_alert_stats; stats = get_alert_stats(); print(f'Alert System Ready! Stats: {stats}')"
if errorlevel 1 (
    echo ERROR: Alert system test failed
    pause
    exit /b 1
)
echo.

echo [3/3] Verifying Integration...
python -c "from app import app; print('Backend integration verified!')"
if errorlevel 1 (
    echo ERROR: Backend integration failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Alert System is ready to use!
echo.
echo Next steps:
echo 1. Start backend: python app.py
echo 2. Start frontend: cd ../frontend && npm start
echo 3. Upload feedback with concerning content to test
echo 4. Check Admin Dashboard > Alert System tab
echo.
pause
