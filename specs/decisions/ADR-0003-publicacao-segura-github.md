---
id: ADR-0003
status: accepted
date: 2026-09-27
---

# ADR-0003 — Publicação segura no GitHub

## Contexto

O catálogo foi concluído e o responsável autorizou a atualização do repositório
público `Darkzin41/Hidden_Route`. A decisão original proibia qualquer remoto
durante a modernização local.

## Decisão

Versionar o workspace no branch `main` do repositório oficial, mantendo a
execução da web, API e MySQL local. O GitHub executará CI, Playwright e CodeQL;
o Dependabot acompanhará npm e GitHub Actions. O banco será publicado somente
em loopback e não haverá credenciais funcionais em arquivos versionados.

## Consequências

Mudanças passam a ter verificação reproduzível fora da máquina de
desenvolvimento. `.env`, uploads, dados do banco, relatórios locais e
dependências instaladas continuam fora do Git. Esta decisão não autoriza
deploy, hospedagem ou novos serviços externos.
