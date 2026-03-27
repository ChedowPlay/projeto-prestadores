# Documentação Básica de Como Usar o Aglio

> Moficado por LucasATS 😉😎

## O que é o Aglio?

Aglio é uma ferramenta de linha de comando que converte arquivos de especificação API Blueprint em documentação HTML.

## Instalação

Para instalar o Aglio, você precisa ter o Node.js e o npm (Node Package Manager) instalados. Em seguida, você pode instalar o Aglio globalmente usando o seguinte comando:

  npm install -g aglio

## Comandos

  cd .\backend\docs\api\

### Gera um servidor de desenvolvimento

> Tema claro

  aglio --theme-variables ./themes/default.less --theme-template ./template/triple.jade -i index.apib -s
  
> Tema dracula

  aglio --theme-variables ./themes/dracula.less --theme-template ./template/triple.jade -i index.apib -s

### Gera o build em html

> Tema claro

  aglio --theme-variables ./themes/default.less --theme-template ./template/triple.jade -i index.apib -o build/index.html

> Tema dracula

  aglio --theme-variables ./themes/dracula.less --theme-template ./template/triple.jade -i index.apib -o build/dracula.html

### Gera o build e envia para o servidor

  build.bat

## Observações

Esse é um sistema legado, que estou tentando manter operante, existem alguns ``erros`` que podem simplesmente serem ignorados.
