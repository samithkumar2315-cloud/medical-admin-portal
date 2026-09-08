@echo off
title Push to GitHub
powershell.exe -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1"
pause
