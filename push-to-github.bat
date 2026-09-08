@echo off
title Push to GitHub
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1"
pause
