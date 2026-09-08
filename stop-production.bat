@echo off
title Stop Medical Administration Portal
taskkill /F /IM MedicalAdminPortal.exe >nul 2>&1
echo Medical Administration Portal production server stopped.
timeout /t 2 >nul
