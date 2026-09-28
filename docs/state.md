# Estado local

**Última atualização:** 2026-09-27

- A modernização do Hidden Route está implementada no workspace npm local.
- O legado está preservado sem alterações em `legacy/`.
- A SPA fica em `apps/web`, a API em `apps/api` e a infraestrutura MySQL em `database/`.
- O banco local `hidden_route` está migrado e populado; o administrador é criado a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` ignorado.
- Ponta Verde está publicada. Juçatuba e Unicamping permanecem em rascunho, sem conteúdo factual inventado.
- O build da SPA é copiado para `apps/api/dist/web` e servido pelo Express em produção local.
- As imagens reaproveitadas foram convertidas para WebP responsivo; uploads locais são processados pelo Sharp.
- O repositório oficial é `https://github.com/Darkzin41/Hidden_Route`, no branch `main`.
- CI, Playwright, CodeQL e Dependabot verificam o código; não existe deploy da aplicação.
- O MySQL aceita conexões publicadas somente em `127.0.0.1` e exige senhas locais.

## Retomada rápida

1. Garanta que o Docker Desktop esteja ativo.
2. Execute `npm run db:up`, `npm run db:migrate` e `npm run db:seed`.
3. Para desenvolvimento, execute `npm run dev` e abra `http://127.0.0.1:5173`.
4. Para o modo local de produção, execute `npm run build` e `npm start`, depois abra `http://127.0.0.1:3000`.
5. Use `npm run check` e `npm run test:e2e` antes de novas entregas.
