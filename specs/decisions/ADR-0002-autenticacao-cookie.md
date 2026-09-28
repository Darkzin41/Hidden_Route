---
id: ADR-0002
status: accepted
date: 2026-09-27
---

# ADR-0002 — Autenticação administrativa por cookie

## Contexto

Apenas administradores precisam de identidade; visitantes não terão contas.

## Decisão

Validar senha com bcrypt e emitir JWT em cookie `httpOnly`, `SameSite=Lax`, com expiração. Rotas administrativas exigem o cookie válido.

## Consequências

Tokens não ficam acessíveis ao JavaScript do navegador. A versão local não inclui recuperação de senha nem revogação centralizada.
