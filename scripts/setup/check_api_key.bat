@echo off
echo ========================================
echo   Gemini API Key Status Check
echo ========================================
echo.

if not exist .env (
    echo ❌ .env file not found!
    echo.
    echo Please run: set_api_key.bat
    echo.
    pause
    exit /b 1
)

findstr /C:"GOOGLE_API_KEY" .env > nul
if errorlevel 1 (
    echo ❌ GOOGLE_API_KEY not found in .env file!
    echo.
    echo Please run: set_api_key.bat
    echo.
    pause
    exit /b 1
)

findstr /C:"your_api_key_here" .env > nul
if not errorlevel 1 (
    echo ⚠️  API key not configured yet!
    echo.
    echo Current value: your_api_key_here
    echo.
    echo Please run: set_api_key.bat
    echo.
    pause
    exit /b 1
)

echo ✅ API key is configured!
echo.
echo Your .env file contains a Gemini API key.
echo.
echo To verify it's working:
echo   1. Start the backend: python backend/app.py
echo   2. Look for: "✓ Gemini API key loaded successfully"
echo.
echo ========================================
pause
