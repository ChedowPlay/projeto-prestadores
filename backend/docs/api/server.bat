@echo off
cd /d %~dp0

cls
echo Iniciando servidor...
echo server on: http://127.0.0.1:3000/
call aglio --theme-variables ./themes/default.less --theme-template ./template/triple.jade -i index.apib -s > nul 2>&1 || (echo Erro ao iniciar servidor & exit /b)
