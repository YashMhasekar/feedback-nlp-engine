@echo off
echo ============================================================
echo Feedback Analyzer - Setup Checker
echo ============================================================
echo.

echo Checking Python...
python --version
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
) else (
    echo [OK] Python is installed
)

echo.
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

echo.
echo Checking npm...
npm --version
if errorlevel 1 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
) else (
    echo [OK] npm is installed
)

echo.
echo ============================================================
echo All prerequisites are installed!
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd backend
echo    python app.py
echo.
echo 2. Start Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser:
echo    http://localhost:4010
echo.
echo ============================================================
pause