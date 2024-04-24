@echo off
for %%a in (%*) do "%~dp0qsp_parser.exe" %%a --level warn
pause