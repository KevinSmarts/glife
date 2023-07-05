@ECHO off

:: The folder where the callvalidator.py can be found
set VALIDATOR=tools
:: The list file with the files that will be validated [optional]
set LIST=glife-validate.qproj
:: The qsrc file that will be validated [optional]
:: set FILE=
:: The folder where the LIST or the FILE can be found [optional, will use the root folder if not set]
set FOLDER=tools
:: The folder where the qsrc file can be found [mandatory]
set SOURCE=locations
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

cls
echo.

echo.

@ECHO ON
:: python %VALIDATOR%\callvalidator.py source=%SOURCE%
:: python %VALIDATOR%\callvalidator.py source=%SOURCE% file=%FILE% folder=%FOLDER%
python %VALIDATOR%\callvalidator.py source=%SOURCE% list=%LIST% folder=%FOLDER%
@ECHO OFF
echo.
echo Done.

:exit