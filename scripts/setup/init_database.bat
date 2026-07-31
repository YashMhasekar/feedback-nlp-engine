@echo off
echo ========================================
echo Database Initialization Script
echo ========================================
echo.

echo Initializing SQLite database...
python database.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database initialized successfully!
    echo ========================================
    echo.
    echo Database file: backend\database.db
    echo.
    echo Tables created:
    echo   - users (for authentication)
    echo   - feedback_analysis (for NLP results)
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database initialization failed!
    echo ========================================
    echo.
)

pause
