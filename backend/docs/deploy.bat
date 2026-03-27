@echo off
cd /d %~dp0


cls
echo Copiando arquivos...
xcopy /E /I /H /Y "C:\Users\lucas\Documents\GitHub\diboa-club\backend\*" "C:\Users\lucas\Documents\GitHub\deploy-dev-diboa-club\" /EXCLUDE:exclude.txt > nul 2>&1 || (echo Erro ao copiar arquivos & exit /b)


cd C:\Users\lucas\Documents\GitHub\deploy-dev-diboa-club


:: Comandos Git
:: Atualizando o repositório
git checkout main
git pull origin main

:: Adicionando as mudanças
git add .

:: Criando o nome do commit
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
    set "year=%%c"

    set "month=%%b"
    set "day=%%a"
)
set "year=%year:~-2%"

for /f "tokens=1-2 delims=: " %%a in ("%time%") do (
    set "hour=%%a"
    set "minute=%%b"
)

:: Ajustando o nome do commit
set "commit_msg=1.0%year%%month%%day%V - %hour%:%minute%"

:: Realizando o commit
git commit -m "%commit_msg%"

:: Enviando para a branch main
git push origin main


powershell -c [System.Media.SystemSounds]::Beep.Play()
msg * "Deploy realizado como: ""%commit_msg%"
