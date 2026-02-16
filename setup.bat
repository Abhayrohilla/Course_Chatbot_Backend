@echo off
echo ===============================================
echo   Course Buddy Chatbot - Quick Setup Script
echo ===============================================
echo.

echo [1/4] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Python not installed or not in PATH!
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call .\venv\Scripts\activate

echo [3/4] Installing Python dependencies (this may take a few minutes)...
pip install -r requirements.txt --quiet

echo [4/4] Installing Frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo.
echo ===============================================
echo   Setup Complete! 
echo ===============================================
echo.
echo To start the application:
echo.
echo   1. Backend:  .\venv\Scripts\activate
echo                python -m uvicorn app.main:app --reload --port 8000
echo.
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo   3. Open:     http://localhost:5173
echo.
pause
