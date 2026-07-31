@echo off
echo ========================================
echo Student Feedback Analysis System
echo With Authentication
echo ========================================
echo.

echo Step 1: Checking backend setup...
cd backend

if not exist "database.db" (
    echo Database not found. Initializing...
    python database.py
    echo.
)

if not exist "venv" (
    echo Virtual environment not found. Creating...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/updating backend dependencies...
pip install -r requirements.txt --quiet

echo.
echo Step 2: Starting backend server...
echo Backend will run on http://localhost:5002
echo.
start "Backend Server" cmd /k "venv\Scripts\activate && python app.py"

cd ..

echo.
echo Step 3: Starting frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

echo Frontend will run on http://localhost:4010
echo.
start "Frontend Server" cmd /k "npm start"

cd ..

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5002
echo Frontend: http://localhost:4010
echo.
echo Available Routes:
echo   - http://localhost:4010/          (Homepage)
echo   - http://localhost:4010/signup    (Sign Up)
echo   - http://localhost:4010/login     (Login)
echo   - http://localhost:4010/dashboard/faculty  (Faculty Dashboard)
echo   - http://localhost:4010/dashboard/admin    (Admin Dashboard)
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will continue running in separate windows)
pause > nul
