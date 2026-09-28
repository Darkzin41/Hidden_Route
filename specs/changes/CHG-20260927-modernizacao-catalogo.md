---
id: CHG-20260927-modernizacao-catalogo
status: implemented
date: 2026-09-27
affected_capabilities: catalogo-hidden-route
---

# Modernização do catálogo Hidden Route

## Resultado esperado

Entregar um catálogo local moderno, responsivo e persistente para praias e parceiros, com avaliações moderadas, contato e administração.

## Solução

React/Vite/Tailwind consome uma API Express organizada por domínio. MySQL mantém catálogo, avaliações, mensagens e administradores. A API serve uploads e o build da SPA.

## Segurança e falhas

Entradas serão validadas com Zod, consultas parametrizadas, senhas com hash, cookies protegidos e limites de requisição. A interface terá estados de carregamento, vazio, sucesso e erro.

## Estratégia de testes

Aplicar TDD em regras e comportamentos, integração API/MySQL e componentes; validar jornadas com Playwright e executar o gate raiz antes da conclusão.

## Critérios de aceite

Os critérios aprovados estão consolidados em `../capabilities/core.md` e `../testing.md`.
