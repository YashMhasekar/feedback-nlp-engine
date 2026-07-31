@echo off
echo ========================================
echo DATABASE QUICK FIX
echo ========================================
echo.

echo Step 1: Fixing database...
python backend/fix_database_completely.py
echo.

echo Step 2: Testing signup flow...
python backend/test_signup_flow.py
echo.

echo Step 3: Showing current users...
python backend/check_users.py
echo.

echo ========================================
echo FIX COMPLETE
echo ========================================
echo.
echo If all tests passed, your database is working correctly!
echo.
echo Next steps:
echo 1. Start backend: python backend/app.py
echo 2. Start frontend: cd frontend ^&^& npm start
echo 3. Test signup at: http://localhost:3000/signup
echo.
pause
