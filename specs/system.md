# Sistema implementado

**Última verificação:** 2026-09-28
**Referência:** branch `main` do repositório oficial

## Finalidade e unidades executáveis

O Hidden Route é um catálogo local persistente para praias pouco conhecidas de São Luís e arredores. O workspace contém:

- `apps/web`: SPA React 19, Vite, Tailwind 4, React Router e TanStack Query;
- `apps/api`: Express 5 organizado por domínio, com Zod, `mysql2/promise`, autenticação por cookie e uploads Sharp;
- `database`: MySQL 8.4 em Docker Compose, migration versionada e seed idempotente;
- `legacy`: protótipos originais preservados somente como referência.

## Superfícies públicas

- `/`, `/praias`, `/praias/:slug`, `/sobre` e `/contato` usam layout editorial tropical responsivo.
- A navbar flutuante marca a rota ativa, oferece menu móvel e responde à direção do scroll.
- O parallax usa `transform`, `requestAnimationFrame` e `IntersectionObserver`, sendo desativado por `prefers-reduced-motion`.
- Busca, catálogo, detalhe, avaliações e contato consomem a API real e apresentam carregamento, vazio, sucesso e erro.

## Administração

- `/admin/login` autentica por cookie `httpOnly` e `SameSite=Lax`.
- As demais rotas administrativas são protegidas e cobrem resumo, praias, parceiros, avaliações e mensagens.
- Praias e parceiros podem ser criados, editados e arquivados; avaliações podem ser aprovadas ou rejeitadas; mensagens podem ser lidas ou arquivadas.
- Uploads JPEG, PNG e WebP de até 5 MB são convertidos para WebP otimizado com nomes aleatórios.
- O painel não usa parallax.

## Persistência e segurança

O schema versionado contém `admins`, `beaches`, `beach_images`, `partners`, `reviews`, `contact_messages` e `schema_migrations`. Consultas são parametrizadas; entradas usam Zod; senhas usam bcrypt; a API aplica Helmet, rate limiting e envelopes JSON uniformes. O health check valida uma consulta real ao MySQL.

O Compose limita o MySQL a `127.0.0.1` e exige as senhas do `.env`. URLs expostas ao público aceitam apenas HTTP(S). Login e consulta de sessão administrativa possuem limites independentes; respostas 429 seguem o envelope de erros da API. O logger redige cookies e autorização recebidos, além de `Set-Cookie` enviado. O `.env.example` contém somente chaves e valores não sensíveis; segredos permanecem vazios até a configuração local.

## Versionamento e integração contínua

O repositório oficial é `https://github.com/Darkzin41/Hidden_Route`. GitHub Actions executa o gate raiz e o Playwright contra MySQL isolado; CodeQL analisa JavaScript e TypeScript ativos, excluindo apenas `legacy/**`; Dependabot acompanha dependências npm e ações. Secret Scanning, Push Protection e atualizações de segurança do Dependabot estão habilitados no repositório.

## Execução

Em desenvolvimento, Vite encaminha `/api` e `/uploads` ao Express. No modo de produção local, o Express entrega o build da SPA, os uploads e o fallback de rotas diretas.

## Restrições

O sistema é executado apenas localmente. O GitHub guarda e verifica o código,
mas não hospeda nem publica a aplicação.
