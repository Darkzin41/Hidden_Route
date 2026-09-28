---
id: catalogo-hidden-route
contract_status: confirmed
implementation_status: verified
last_verified: 2026-09-28
last_verified_ref: github-main
---

# Catálogo Hidden Route

## Finalidade e limites

Divulgar praias pouco conhecidas de São Luís e parceiros próximos. Visitantes consultam conteúdo, enviam contato e avaliações; administradores gerenciam o catálogo e moderam contribuições.

## Atores e permissões

- Visitante: lê praias publicadas, parceiros ativos e avaliações aprovadas; envia contato e avaliação sem conta.
- Administrador: autentica-se e gerencia praias, parceiros, imagens, avaliações e mensagens.

## Contrato comportamental

- Praias em rascunho ou arquivadas não aparecem publicamente.
- Avaliações nascem pendentes e não alteram a média antes da aprovação.
- Registros com histórico são arquivados em vez de apagados definitivamente.
- Parceiros expõem apenas canais externos confirmados; não há reserva interna.
- Parallax respeita `prefers-reduced-motion`; o painel administrativo não usa parallax.

## Estado atual e lacunas

A capacidade está implementada e verificada localmente, com gates reproduzidos no GitHub. Ponta Verde é publicada pelo seed; Juçatuba e Unicamping permanecem como rascunhos até que a equipe confirme informações factuais. Não há integrações externas, reserva, recuperação de senha ou deploy nesta versão.

## Evidências

Os comandos, totais e arquivos de teste verificados estão definidos em `../testing.md`.

## Relações

- Design: `../changes/CHG-20260927-modernizacao-catalogo.md`.
- Mudanças: `../changes/CHG-20260927-modernizacao-catalogo.md` e `../changes/CHG-20260927-publicacao-segura.md`.
- ADRs: `../decisions/ADR-0001-workspace-local.md`, `../decisions/ADR-0002-autenticacao-cookie.md` e `../decisions/ADR-0003-publicacao-segura-github.md`.
