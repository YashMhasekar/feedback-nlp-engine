@echo off
echo ============================================================
echo FEEDBACK ANALYSIS DATABASE SETUP
echo ============================================================
echo.

echo Step 1: Initializing new feedback_analysis.db database...
python backend\test_feedback_db.py
if errorlevel 1 (
    echo ERROR: Database initialization failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Migrating existing data (if any)...
python backend\migrate_feedback_data.py
if errorlevel 1 (
    echo WARNING: Migration had issues, but continuing...
)

echo.
echo ============================================================
echo SETUP COMPLETE!
echo ============================================================
echo.
echo The new feedback_analysis.db database is ready to use.
echo.
echo What happens now:
echo   - All NLP analysis outputs will be saved to feedback_analysis.db
echo   - Authentication data remains in database.db (unchanged)
echo   - Trends and Insights charts will read from feedback_analysis.db
echo   - Data persists across app restarts
echo.
echo Next steps:
echo   1. Start the backend: START_BACKEND_SIMPLE.bat
echo   2. Upload feedback through the Faculty Dashboard
echo   3. View live charts in Trends and Insights
echo.
pause
