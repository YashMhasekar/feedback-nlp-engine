@echo off
echo ========================================
echo Installing All Dependencies
echo ========================================
echo.

echo Step 1: Backend Dependencies
echo ========================================
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python packages...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ✅ Backend dependencies installed!
echo.

cd ..

echo Step 2: Frontend Dependencies
echo ========================================
cd frontend

echo Installing Node packages...
call npm install

echo.
echo ✅ Frontend dependencies installed!
echo.

cd ..

echo Step 3: Initialize Database
echo ========================================
cd backend
call venv\Scripts\activate
python database.py
cd ..

echo.
echo ========================================
echo ✅ ALL DEPENDENCIES INSTALLED!
echo ========================================
echo.
echo Next steps:
echo   1. Configure backend/.env with your API keys
echo   2. Run START_AUTH_SYSTEM.bat to start the application
echo.
pause
