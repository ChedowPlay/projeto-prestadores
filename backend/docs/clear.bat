@echo off
cd /d %~dp0

cls
echo Apagando arquivos...

del /f /q ..\banco.sqlite
del /f /q ..\bancoTeste.sqlite
del /f /q ..\serverlog.log
rmdir /s /q ..\src\public\media
