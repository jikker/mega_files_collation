@echo off
:: execute current project 
cd /d ./nwjs

:: taskkill /f /im nw.exe
tasklist /FI "IMAGENAME eq nw.exe" 2>NUL | find /I /N "nw.exe">NUL
if "%ERRORLEVEL%"=="0" taskkill /f /im nw.exe

nw ../source
