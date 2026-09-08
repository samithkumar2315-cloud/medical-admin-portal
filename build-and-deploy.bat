@echo off
title Medical Administration Portal - Build & Deploy
powershell.exe -ExecutionPolicy Bypass -File "%~dp0build-and-deploy.ps1"
pause
