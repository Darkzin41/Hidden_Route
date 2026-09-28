---
id: ADR-0001
status: superseded
date: 2026-09-27
superseded_by: ADR-0003
---

# ADR-0001 — Workspace npm local

## Contexto

O código existente separava um site estático e uma API exemplar sem integração real.

## Decisão

Usar workspaces npm com `apps/web` e `apps/api`, MySQL em Docker e orquestração na raiz. O legado permanece em `legacy/`.

## Consequências

Web e API mantêm responsabilidades e testes próprios, enquanto a raiz fornece comandos comuns. A decisão posterior de versionar e verificar o código no GitHub está registrada no ADR-0003; a execução da aplicação continua local.
