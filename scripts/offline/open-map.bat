@echo off
rem Double-click to open the map. It starts a small local server (nothing is installed) and opens your browser.
rem The first time, Windows may ask whether to allow PowerShell to run; choose Run anyway.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
