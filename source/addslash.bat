@echo off

if exist setting.js (
set x=setting.js
) else (
if exist js\setting.js (
set x=js\setting.js
) else (
if exist ..\js\setting.js (
set x=..\js\setting.js
) else (
echo "cant find setting.js!"
exit /b
)))

:: change value of version file
findstr /v "^//" %x% > temp.tmp
type temp.tmp > %x%
del /f temp.tmp

@echo // %date% %time% >> %x%
