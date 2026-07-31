@echo off
echo ========================================
echo   Gemini API Key Configuration
echo ========================================
echo.
echo This script will help you set up your Gemini API key.
echo.
echo Get your API key from: https://makersuite.google.com/app/apikey
echo.
echo ========================================
echo.

set /p API_KEY="AIzaSyC6VQV4_OPsiQfyu46lm0co35YPEyywfIM"

if "%API_KEY%"=="" (
    echo.
    echo ERROR: No API key provided!
    echo Please run the script again and enter your API key.
    pause
    exit /b 1
)

echo.
echo Updating .env file...

(
echo # Google Gemini API Key for AI Summary Generation
echo GOOGLE_API_KEY=%API_KEY%
echo.
echo # Backend Configuration
echo BACKEND_PORT=5002
echo FRONTEND_URL=http://localhost:4010
echo.
echo # Upload Configuration
echo MAX_FILE_SIZE=16777216
echo UPLOAD_FOLDER=uploads
) > .env

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your Gemini API key has been configured successfully!
echo.
echo Next steps:
echo   1. Restart your backend server if it's running
echo   2. Upload a feedback file to test AI summary generation
echo.
echo ========================================
pause
