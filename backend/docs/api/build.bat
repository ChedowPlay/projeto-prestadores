@echo off
cd /d %~dp0
mkdir build 2>nul
mkdir ..\..\src\views\apiExample 2>nul


cls
echo Gerando index.html...
call aglio --theme-variables ./themes/default.less --theme-template ./template/triple.jade -i index.apib -o build/index.html > nul 2>&1 || (echo Erro ao gerar index.html & exit /b)


cls
echo Gerando dracula.html...
call aglio --theme-variables ./themes/dracula.less --theme-template ./template/triple.jade -i index.apib -o build/dracula.html > nul 2>&1 || (echo Erro ao gerar dracula.html & exit /b)


cls
echo Salvando index.html no servidor...
copy /Y build\index.html ..\..\src\views\apiExample\index.html > nul 2>&1 || echo Erro ao copiar index.html

echo Salvando dracula.html no servidor...
copy /Y build\dracula.html ..\..\src\views\apiExample\dracula.html > nul 2>&1 || echo Erro ao copiar dracula.html


powershell -c [System.Media.SystemSounds]::Beep.Play()
msg * "Builds gerados e salvos no servidor!"

cls
