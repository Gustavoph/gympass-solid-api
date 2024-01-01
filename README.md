# App (GymPass Style App)

## RFs (Requisitor Funcionais)
 - Funcionalidades da aplicação

 - [ ] Deve ser possível se cadastrar
 - [ ] Deve ser possível se autenticar
 - [ ] Deve ser possível obter o perfil do usuário logado
 - [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado
 - [ ] Deve ser possível o usuário obter o seu histórico de check-ins
 - [ ] Deve ser possível o usuário buscar academias próximas
 - [ ] Deve ser possível o usuário buscar academias pelo nome
 - [ ] Deve ser possível o usuário realizar check-in em uma academia
 - [ ] Deve ser possível validar o check-in de um usuário
 - [ ] Deve ser possível cadastrar uma academia

## RNs (Regras de Negócio)
 - Regras e condições aplicadas a alguma funcionalidade (RF)

 - [ ] O usuário não deve se cadastrar com um e-mail duplicado
 - [ ] O usuário não pode fazer 2 check-ins no mesmo dia
 - [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia
 - [ ] O check-in só pode ser validado até 20 minutos após criado
 - [ ] A check-in só pode ser validado por administradores
 - [ ] A academia só pode ser cadastradas por administradores

## RNFs (Requisitos Não-Funcionais)
 - Requisitos técnicos da aplicação (infra)

 - [ ] A senha do usuário precisa estar criptografada
 - [ ] Os dados precisa estar persistidos em um banco PostgreSQL
 - [ ] Todas as listas devem ser paginadas com 20 itens por página
 - [ ] O usuário deve ser identificado por um JWT

## Tecnologias utilizadas
 - NodeJS
 - PostgreSQL
 - Prisma
 - JWT
 - Jest
 - Typescript
