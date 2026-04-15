@echo off
echo ==============================
echo BUILD COMPLETO DEMS
echo ==============================

echo.
echo 1. Construyendo Angular...
cd Windows\DEMSFRONT || exit /b
call npm install || exit /b
call npm run build:electron || exit /b

echo.
echo 2. Construyendo Electron...
cd ..\electron || exit /b
call npm install || exit /b
call npm run dist || exit /b

echo.
echo 3. Generando instalador final...
cd ..\..\installer || exit /b

REM Ruta de Inno Setup (ajusta si es necesario)
set INNO="C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

%INNO% setup.iss || exit /b

echo.
echo ==============================
echo BUILD COMPLETO TERMINADO
echo ==============================
pause