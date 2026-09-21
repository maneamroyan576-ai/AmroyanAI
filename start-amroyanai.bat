@echo off
title AmroyanAI

cd /d "C:\Users\USER\Desktop\Amroyan AI"

start "" cmd /k "npm start"

timeout /t 3 /nobreak >nul

start "" "http://localhost:3000"