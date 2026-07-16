@echo off
setlocal
set "TOOL_DIR=%~dp0"
set "CODEX_PY=C:\Users\AONUSR02\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

where python >nul 2>nul
if exist "%CODEX_PY%" (
  start "Booth Layout Server" /min "%CODEX_PY%" -m http.server 8765 --bind 127.0.0.1 --directory "%TOOL_DIR%"
  start "" "http://127.0.0.1:8765/"
  exit /b
)

if %ERRORLEVEL% EQU 0 (
  start "Booth Layout Server" /min python -m http.server 8765 --bind 127.0.0.1 --directory "%TOOL_DIR%"
  start "" "http://127.0.0.1:8765/"
  exit /b
)

start "" "%TOOL_DIR%index.html"
