# Estratégia e mapa de testes

**Última verificação:** 2026-09-28

## Gates locais

| Comando                  | Cobertura                                          | Último resultado                |
| ------------------------ | -------------------------------------------------- | ------------------------------- |
| `npm run format:check`   | Formatação sem escrita                             | aprovado                        |
| `npm run lint`           | JavaScript, JSX e scripts                          | aprovado                        |
| `npm run specs:check`    | Arquivos obrigatórios, status e links locais       | aprovado                        |
| `npm test`               | Unidade, componentes, contratos e integração MySQL | 47 testes aprovados             |
| `npm run build`          | Build Vite e cópia para o Express                  | aprovado                        |
| `npm run test:e2e`       | Jornadas pública e administrativa                  | 5 aprovados, 1 skip intencional |
| `npm run security:check` | Dependências de produção e desenvolvimento         | 0 vulnerabilidades              |

O skip E2E é intencional: o fluxo administrativo completo roda no projeto desktop; o projeto móvel cobre catálogo, menu e formulários públicos.

## Responsabilidade por camada

| Comportamento                                            | Evidência                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Navbar, direção do scroll, parallax e movimento reduzido | `apps/web/src/shared/**/*.test.*` e Playwright                                             |
| Formulários, autenticação e rotas                        | `apps/web/src/**/*.test.jsx`                                                               |
| Envelopes, validação, sessão, CRUD, moderação e upload   | `apps/api/tests/api-contract.test.js`                                                      |
| Migration e seed                                         | `apps/api/tests/migrations.test.js` e `seed-data.test.js`                                  |
| Persistência, estados e admin configurado por ambiente   | `apps/api/tests/repositories.integration.test.js` contra MySQL, com transações reversíveis |
| Processamento de imagens                                 | `apps/api/tests/upload-service.test.js`                                                    |
| Compose local, `.env.example` e higiene do legado        | `apps/api/tests/security-config.test.js`                                                   |
| Protocolos seguros em links administrativos              | `apps/api/tests/admin-schemas.test.js`                                                     |
| Limite de consultas repetidas à sessão administrativa    | `apps/api/tests/api-contract.test.js`                                                      |
| Redação de cookies de sessão nos logs HTTP               | `apps/api/tests/http-logging.test.js`                                                      |
| Escopo de análise do CodeQL sem o legado não executável  | `apps/api/tests/security-config.test.js`                                                   |
| Fallback de rota direta da SPA                           | `apps/api/tests/spa-fallback.test.js`                                                      |
| Jornadas completas e breakpoints desktop/móvel           | `tests/e2e`                                                                                |

## Gates no GitHub

- `CI / Qualidade e segurança`: MySQL isolado, migrations, seed, auditoria de
  dependências, `npm run check`.
- `CI / Fluxos ponta a ponta`: Playwright desktop e móvel contra MySQL
  isolado.
- `CodeQL / JavaScript e TypeScript`: análise estática do código ativo em push,
  pull request e agenda semanal; `legacy/**` fica fora por não ser executável.
- Dependabot: atualizações semanais para npm e GitHub Actions.

## Regra de manutenção

Todo comportamento novo deve começar com teste falhando na camada mais baixa adequada. Testes de integração não podem depender de registros criados por execuções E2E anteriores; dados temporários devem viver em transações reversíveis.
