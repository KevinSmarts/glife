@ECHO off

SET LOCATIONS=%CD%/locations

PUSHD %1
cd ./qsrc2tw/tools/QSRC2TW
CALL QSRC2TW.exe -in "%LOCATIONS%" -out "../../twine-code"
cd ../..

REM Check if node is installed
node -v 2> Nul
if "%errorlevel%" == "9009" (
    echo node could not be found
) else (
	call npx tsc
	call npx esbuild "temp/typescript.js" --minify --outfile="twine-code/-generatedFromTS/typescript-min.js"
)

POPD

if %PROCESSOR_ARCHITECTURE% == AMD64 (
	CALL "%~dp0qsrc2tw\tools\tweeGo\tweego_win64.exe" --head "%~dp0qsrc2tw\twine-code\misc\head.txt" -o "%~dp0glife.html" "%~dp0qsrc2tw\twine-code"
) else (
	CALL "%~dp0qsrc2tw\tools\tweeGo\tweego_win86.exe" --head "%~dp0qsrc2tw\twine-code\misc\head.txt" -o "%~dp0glife.html" "%~dp0qsrc2tw\twine-code"
)



@ECHO ON
