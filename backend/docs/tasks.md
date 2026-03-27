# TASKS

## GERAL

   [ ] - VARREDURA PARA MELHORIAS NO CÓDIGO
   [X] - ARRUMAR ENV
   [X] - MELHORAR DOCKERFILE

## PRIORIDADE

- CONCLUIDOS PORÉM NO AGUARDO DE TESTES
  - API - Editar dados usuário

- AGUARDANDO PARA SER CONCLUÍDO.
  - PAGAMENTO - Mercado Pago (d: Se o usuário esta pagando e for banido, oque vai acontecer com a assinatura? cancelada ou reembolsado?)

- SEMANA QUE VEM
  - Criar testes automatizados para api
  - CORREÇÃO - Corrigir search - impedir que usuários sem plano ou com plano vencido possam ser encontrados

- ADICIONAR NOVAS RNs
  1. 3 serviços
  2. 5 serviços
  3. 10 serviços

## BACKEND

- TESTE 2E2
  [ ] - ??

- DOCS: Atualizar
  [X] - checkPayment
  [X] - sendPayment
  [X] - env
  [X] - Banco de dados
  [X] - Deletar conta
  [X] - post denuncia
  [X] - get denuncia
  [X] - provider
  [X] - send-otp
  [X] - check-otp
  [X] - put-user
  [X] - auth
  [X] - get plan
  - work
    [ ] - post
    [X] - put
    [X] - delete

- MERCADO PAGO e REGRAS DE NEGOCIO
  - Planos
    [X] - Criar plano
    [X] - Ler planos
  - (API - Provider) Assinaturas
    [ ] - Webhook: Validar se a assinatura foi realizada
  [X] - Adicionar RNs na infra do sistema (album)
  [X] - criar plano de assinaturas de acordo com as regras de negocio

- DATABASE
  [X] - Implementar postgres
  [X] - plan
  [X] - ok

- CONTROLLERS (API)
  - account
    [ ] - delete account
    [X] - put account
          - Editar dados gerais do usuário menos: Email e senha (outra api)
          - Atualizar foto de perfil caso o usuário não tenha
          - Editar ou criar dados do prestador
    [X] - delete picture
    [X] - post picture
  - plan
    [ ] - get plans
  - Provider
    [ ] - search: Correção
    [X] - get my Provider
  - Auth
    [X] - ok
  - work
    [X] - post
    [X] - put
    [X] - delete

- MIDDLEWARE
  [X] - reqlimiters
  [X] - auth

- TESTE UNITÁRIO
  [X] - plan
  [X] - ok

- INSERT
  [X] - plan
  [X] - ok

- CRON-JOB
  [X] - album: Remover videos ou fotos que não estão cadastrados no servidor a cada 24h
  [X] - OTPs: Remover tokens vencidos a cada 24h
  [X] - Token: Remover tokens vencidos a cada 24h
