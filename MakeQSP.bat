@ECHO off

:: Set batch file path
set BATDir=%~dp0

:: Set those lines to fit your setup. 
:: This is where glife.qsp will be copied. If you don't want to move it just comment (::) the line below.
:: set CP_TO=..\GL_ECV

:: This is the program used to open the QSPFILE. If you comment this line windows will launch the default app for the ".qsp" extension.
set QSPGUI=tools\Player-video\qspgui.exe
set QGEN=tools\QGen5\QGen.exe

:: The file that will be generated or open
set QSPFILE=glife.qsp

:: Chimrod validation tool
set QSPParser=tools\Parser\qsp_parser.exe
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:menu
cls
echo.
echo :: Girl Life - QSP Compiler and Launcher ::
echo.

if defined QGEN (
	if not exist "%BATDir%%QGEN%" ( 
		echo QGEN       : [ERROR] - "%BATDir%%QGEN%"  not found. Using DEFAULT application.
		set QGEN=
	) else ( 
			echo QGEN       : [OK] - "%BATDir%%QGEN%")
) else echo QGEN     : [NOT DEFINED] - Using DEFAULT application.

if defined QSPGUI (
	if not exist "%BATDir%%QSPGUI%" ( 
		echo QSP EXEC   : [ERROR] -"%BATDir%%QSPGUI%" not found.
		set QSPGUI=
	) else ( echo QSP EXEC   : [OK] - "%BATDir%%QSPGUI%")
) else ( echo QSP EXEC   : [NOT DEFINED] - Using Windows DEFAULT.)

if defined QSPFILE (
	if not exist "%BATDir%%QSPFILE%" ( 
		echo QSP FILE   : [WARNING] - "%BATDir%%QSPFILE%" not found.
	) else ( echo QSP FILE   : [OK] - "%BATDir%%QSPFILE%")
) else ( echo QSP FILE   : [NOT DEFINED] - ERROR: CAN'T CONTINUE.)

if defined CP_TO (
	if not exist "%CP_TO%" (
		echo COPY       : [ERROR] - Destination "%CP_TO%" not found. Copy DISABLED.
		set CP_TO=
	) else ( echo COPY      : [OK] - "%CP_TO%")
) else (  echo COPY       : [DISABLED] )

if defined QSPParser (
	if not exist "%BATDir%%QSPParser%" ( 
		echo QSP Parser : [WARNING] - "%BATDir%%QSPParser%" not found.
		echo              Please visit the Girl Life Discord to download the latest version.
	) else ( echo QSP Parser : [OK] - "%BATDir%%QSPParser%")
) else ( echo QSP Parser : [NOT FOUND - DISABLED ]	)



echo.

if defined NOT_FOUND (
	echo ERROR: Option '%action%' wasn't recognized. Is it lowercase? 
	set NOT_FOUND=
)

echo.
echo ACTIONS: (B)uild  (D)ebug  (R)un  (F)ull  (Q)Gen  (V)alidate  (E)xit
echo.
set /p action=Choose an action:

if defined QSPFILE (
	if %action% == b goto build
	if %action% == B goto build
	if %action% == d goto build_debug
	if %action% == D goto build_debug
	if %action% == r goto run
	if %action% == R goto run
	if %action% == f goto build
	if %action% == F goto build
	if %action% == v goto parser
	if %action% == V goto parser
	if %action% == q goto qgen
	if %action% == Q goto qgen
)

if %action% == e goto exit
if %action% == E goto exit

set NOT_FOUND=1
goto menu

:build
echo.
echo Building ...

@ECHO ON
python tools\txtmerge.py locations glife.txt
tools\txt2gam.exe glife.txt %QSPFILE% > nul
@ECHO OFF

echo.
if defined CP_TO ( echo Copying %QSPFILE% to "%CP_TO%" ... & copy %QSPFILE% %CP_TO% > nul )

echo.
echo Done.
pause
if %action% == f ( goto run ) else ( goto menu )

:build_debug
echo.
echo Building DEBUG ...

@ECHO ON
python tools\build_debug.py locations glife.txt
tools\txt2gam.exe glife.txt %QSPFILE% > nul
@ECHO OFF

echo.
if defined CP_TO ( echo Copying %QSPFILE% to "%CP_TO%" ... & copy %QSPFILE% %CP_TO% > nul )

echo.
echo Done.
pause
goto menu

:qgen
echo.
echo Running ...
if defined CP_TO ( start %QGEN% %CP_TO%\%QSPFILE% ) else ( start %QGEN% %QSPFILE% )
pause
goto menu

:parser
echo.
echo validating...

@ECHO ON
"%BATDir%%QSPParser%" --level warn "%BATDir%glife.txt" > "%BATDir%validation.log"
@ECHO off
pause
goto menu

:run
echo.
echo Running ...

if defined CP_TO ( start "%BATDir%%QSPGUI%" %CP_TO%\%QSPFILE% ) else ( start "%BATDir%%QSPGUI%" %QSPFILE% )




:exit