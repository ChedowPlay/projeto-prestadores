# nota para o eu do futuro, pq eu vou esquecer disso:

## Montar pastas

  mkdir -p ./volumes/banco
  touch ./volumes/banco/banco.sqlite
  mkdir -p ./volumes/logs
  touch ./volumes/logs/serverlog.log

## Subir servidor 

  docker compose up -d --build

## Log dos arquivos

  docker logs -f server

## Ver dockers rodando

  docker ps

## Analisar qual web esta rodando

  curl -I https://api.212.85.1.241.nip.io

## Remove containers e volumes antigos

  docker compose down -v