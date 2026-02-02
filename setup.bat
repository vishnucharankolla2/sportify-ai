@echo off
REM Sportify AI Setup Script for Windows

echo.
echo ===============================================
echo   Sportify AI - MVP Setup
echo ===============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION%

echo.
echo Installing dependencies...
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed

REM Create .env if doesn't exist
if not exist .env (
    echo.
    echo Creating .env file from template...
    copy .env.example .env
    echo [OK] .env created
    echo Please edit with your credentials:
    echo   - DATABASE_URL
    echo   - OPENAI_API_KEY
    echo   - Other config values
)

echo.
echo ===============================================
echo   Setup Complete!
echo ===============================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Run: npm run db:setup
echo 3. Run: npm run db:seed
echo 4. Run: npm run dev
echo.
echo Documentation:
echo   - README.md - Quick start
echo   - docs\API.md - API reference
echo   - docs\IMPLEMENTATION.md - Architecture
echo.
