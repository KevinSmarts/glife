@ECHO off

SET LOCATIONS=%CD%/locations

PUSHD %1
cd ./qsrc2tw/tools/QSRC2TW
node index.js -in "%LOCATIONS%" -out "../../twine-code"
POPD



if %PROCESSOR_ARCHITECTURE% == AMD64 (
	CALL "%~dp0qsrc2tw\tools\tweeGo\tweego_win64.exe" --head "%~dp0qsrc2tw\twine-code\misc\head.txt" -o "%~dp0glife.html" "%~dp0qsrc2tw\twine-code"
) else (
	CALL "%~dp0qsrc2tw\tools\tweeGo\tweego_win86.exe" --head "%~dp0qsrc2tw\twine-code\misc\head.txt" -o "%~dp0glife.html" "%~dp0qsrc2tw\twine-code"
)



@ECHO ON
