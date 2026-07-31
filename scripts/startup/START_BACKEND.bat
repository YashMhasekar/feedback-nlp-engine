@echo off
echo ============================================================
echo Starting Feedback Analyzer Backend Server
echo ============================================================
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo.
echo Installing/Checking dependencies...
pip install flask flask-cors pandas openpyxl xlrd

echo.
echo ============================================================
echo Starting Flask Server on http://localhost:5002
echo ============================================================
echo.
echo Press CTRL+C to stop the server
echo.

python app.py

pause