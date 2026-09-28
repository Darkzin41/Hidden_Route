---
id: CHG-20260927-publicacao-segura
status: implemented
date: 2026-09-27
affected_capabilities: catalogo-hidden-route
---

# Publicação segura do Hidden Route

## Resultado esperado

Publicar o workspace organizado no repositório oficial sem expor ambiente,
credenciais, uploads ou dados locais e manter os gates de qualidade no GitHub.

## Solução

O MySQL fica limitado a `127.0.0.1` e exige senhas no `.env`; links públicos
aceitam apenas HTTP(S); cookies de sessão são redigidos nos logs; exemplos
legados não carregam credenciais fixas nem SQL interpolado. CI, Playwright,
CodeQL e Dependabot verificam o repositório.

## Estratégia de testes

Testes de regressão cobrem o Compose, o `.env.example`, a higiene do legado e
os protocolos aceitos por URLs administrativas. `npm run security:check`,
`npm run check` e `npm run test:e2e` formam o gate de publicação.

## Limites

Não há deploy da aplicação. O relatório completo da auditoria fica no
armazenamento local gerenciado pelo Codex Security, fora do Git.
