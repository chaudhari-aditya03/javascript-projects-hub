@echo off
REM Real-Time Chat Application - Quick Start Script for Windows
REM This script sets up and runs both backend and frontend

color 0A
cls

echo.
echo ================================
echo Real-Time Chat App - Quick Start
echo ================================
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt > nul 2>&1

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo [OK] Backend configured
    echo.
) else (
    echo [OK] Backend configured
    echo.
)

REM Frontend Setup
echo [2/4] Setting up Frontend...
cd ..\frontend

echo Installing dependencies...
call npm install > nul 2>&1

if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo.
    echo [OK] Frontend configured
    echo.
) else (
    echo [OK] Frontend configured
    echo.
)

REM Summary
echo [3/4] Setup Complete!
echo.
echo [4/4] To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo ================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ================================
echo.
echo Happy Chatting! 💬
echo.
pause
