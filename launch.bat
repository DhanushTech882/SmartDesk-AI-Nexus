@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Windows;C:\Windows\System32\WindowsPowerShell\v1.0"
title SmartDesk AI Launcher
echo ========================================================
echo    SmartDesk AI - Cognitive ITSM Platform Launcher
echo ========================================================
echo.
echo [1] Launching Cognitive Backend Server on port 5000...
start "SmartDesk AI Backend (Port 5000)" cmd /k "cd backend && node server.js"

timeout /t 2 >nul

echo [2] Launching Enterprise Next.js Frontend on port 3000...
start "SmartDesk AI Next.js Frontend (Port 3000)" cmd /k "cd frontend && npm.cmd run dev"

echo [3] Waiting for servers to initialize...
timeout /t 4 >nul

echo [4] Opening SmartDesk AI in your default browser...
start http://localhost:3000

echo.
echo ========================================================
echo   SmartDesk AI is now LIVE!
echo   Single Host URL: http://localhost:3000
echo ========================================================
echo.
echo Application running successfully. You can keep this window open or minimize it.
pause >nul

