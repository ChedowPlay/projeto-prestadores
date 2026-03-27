# DI BOACLUB

## **🚗 FIRST PLAY**

Se quiser,

instale [NVM - Windowns](https://github.com/coreybutler/nvm-windows/releases) para rodar esse projeto

    nvm install 22.13.1

> Acessa a pasta do frontend

    cd frontend

## Antes de comçar a codar

    npm i

## **📂 PLAY**

    npm run dev

## **📂 PLAY WITH DOCKER**

> Docker está desatualizado!

Inicie o docker compose

    docker compose up -d

> Para parar os containers

    docker compose down

> Para ver os logs

    docker compose logs -f

## **🐳 DOCKER**

O docker é usado em ambiente de homologação e produção, entretanto se for necessário, é recomendado o uso em ambiente dev para compartibilidade entre maquinas.

Para mais informações consulte o artigo [Como usar o docker](../.github/target/Helper/Como%20usar%20o%20docker.md)

## **🔨 TESTES EXTERNOS COM TUNEL**

⚠️ Necessário ter SSH instalado no seu computador

> Rode o comando de run dev abra outro terminal e execute o segundo comando

    ssh -R testefrontdiboa:80:<SEU IP>:3001 serveo.net

⚠️ Para perfeitas condições, libere a porta 3001, utilize o ipv4 ao invés do localhost.

## **⚙️ OUTRAS CONFIGURAÇÕES**

> Liberar portas de acesso no windowns 7 ou 10.

1. Pesquisar por windowns defender firewall>Regras de Saída.
2. Crie uma Nova Regra.
3. Selecione a opção tipo de Porta (TCP).
4. Em portas remotas, digite um valor desejavel que seja o mesmo da porta no .env, normalmente 80 para produção e 3001 para desenvolvimento.
5. Em ação, selecione Permitir Conexão.
6. Avançar até a ultima sessão, escolher nome (diboaclub).

## **📚 BIBLIOTECA DE PACOTES**

### Frontend Core

    npm i next@15.0.4 react@19.0.0 react-dom@19.0.0

### UI & Styling

    npm i @emotion/react@11.14.0 @emotion/styled@11.14.0 @mui/material@6.4.3
    npm i @phosphor-icons/react@2.1.7 bootstrap@5.3.3 react-bootstrap@2.10.8
    npm i react-icons@5.4.0 swiper@11.2.2

### Authentication & Security

    npm i next-auth@4.24.11 bcrypt@5.1.1 jsonwebtoken@9.0.2
    npm i cookie@1.0.2 cookies-next@5.1.0 nookies@2.5.2

### HTTP & API

    npm i axios@1.7.9

### Development

    npm i --save-dev typescript@5 @types/react@19 @types/react-dom@19 @types/node@20.17.16
    npm i --save-dev eslint@8 eslint-config-next@15.0.4 sass@1.82.0


Code Review
Last deploy: 2026-05-19
