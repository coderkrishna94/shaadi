@echo off
title Wedding Invitation - Local Server
echo ========================================================
echo   WEDDING INVITATION WEBSITE - LOCAL HOST
echo ========================================================
echo.
cd /d "%~dp0"

echo Starting server on local network...
echo.
echo   Invitation Link: http://localhost:5173/rishabh-weds-simran
echo   Visual Editor:   http://localhost:5173/editor
echo   Phone / Wi-Fi:   http://192.168.1.11:5173/rishabh-weds-simran
echo.
echo ========================================================
echo (Keep this window open while using the website)
echo ========================================================
echo.

start http://localhost:5173/editor
powershell -ExecutionPolicy Bypass -Command "npx vite --host 0.0.0.0 --port 5173"
pause
