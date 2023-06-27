@ECHO off

:: The file that will be generated or open
set TESTFOLDER=test
set TESTSUITE=test\testsuite-basic.qproj 
:: set QSPGUI=tools\QSPgui\qspgui.exe
set QSPGUI=Qqsp.exe
set SAVE_ENABLED=FALSE
set LOCATIONSFOLDER=locations
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:menu
cls
echo.
echo :: QSP Compiler and Launcher
echo.

echo.

if defined QSPGUI (
	if not exist "%QSPGUI%" ( 
		echo QSP EXEC : [ERROR] - %QSPGUI% not found.
		set QSPGUI=
	) else ( echo QSP EXEC : [OK] - "%QSPGUI%")
) else ( echo QSP EXEC : [NOT DEFINED] - Using Windows DEFAULT.)

echo.

if defined NOT_FOUND (
	echo ERROR: Option '%action%' wasn't recognized. Is it lowercase? 
	set NOT_FOUND=
)

echo QPSGUI: %QSPGUI% 
echo.

:build
echo.

echo Building ...

@ECHO ON
python tools\testbuilder.py %LOCATIONSFOLDER% %TESTSUITE% %SAVE_ENABLED%
@ECHO OFF

SET /p MYVAR=<_temp-filename.txt
SET TXTFILE="%MYVAR%.txt"
SET QSPFILE="%MYVAR%.qsp"

@ECHO ON
tools\txt2gam.exe  %TXTFILE% %QSPFILE% : > nul
del %TXTFILE%
del _temp-filename.txt
%QSPGUI% %QSPFILE%
@ECHO OFF


echo.
echo Done.
pause