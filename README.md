# Hidden Route

Catálogo local de praias pouco conhecidas de São Luís e estabelecimentos próximos.

## Requisitos

- Node.js 20 ou superior
- Docker Desktop com Docker Compose

## Configuração local

1. Copie `.env.example` para `.env` e preencha `DB_PASSWORD`,
   `DB_ROOT_PASSWORD`, `JWT_SECRET` e `ADMIN_PASSWORD` com valores exclusivos.
   O projeto recusa iniciar o banco quando as senhas obrigatórias estão vazias.
2. Execute `npm ci` para uma instalação reproduzível.
3. Execute `npm run db:up`.
4. Execute `npm run db:migrate` e `npm run db:seed`.
5. Execute `npm run dev` e abra `http://127.0.0.1:5173`.

## Build local

Execute `npm run build` e depois `npm start`. A API servirá o front-end compilado em `http://127.0.0.1:3000`.

## Qualidade

- `npm test`: testes automatizados dos workspaces.
- `npm run test:e2e`: testes ponta a ponta com Playwright.
- `npm run security:check`: auditoria das dependências do workspace.
- `npm run specs:check`: valida a memória técnica e seus links locais.
- `npm run check`: formatação, lint, specs, testes e build.

O GitHub executa esses gates em cada push e pull request. O CodeQL analisa o
JavaScript, e o Dependabot acompanha dependências npm e GitHub Actions.

O código antigo foi preservado em `legacy/` apenas como referência.
