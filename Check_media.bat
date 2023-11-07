@echo off
python "%~dp0tools\check_missing_media.py"
if errorlevel 1 pause
