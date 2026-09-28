# Marcos do projeto

## 2026-09-27 — início da modernização local

- O protótipo HTML/CSS e o exemplo de API foram preservados em `legacy/`.
- O contrato para catálogo, moderação, contato e administração foi aprovado.
- A implementação foi iniciada em um workspace npm local, sem Git ou publicação.

## 2026-09-27 — catálogo local verificado

- A SPA React/Vite, a API Express e o MySQL em Docker foram integrados.
- Catálogo, busca, detalhe, contato, avaliações moderadas e painel administrativo foram entregues.
- Navbar direcional, menu móvel, parallax com movimento reduzido e identidade editorial tropical foram validados nos breakpoints de aceite.
- Imagens legadas foram convertidas para WebP e uploads ganharam validação e processamento local.
- Testes unitários, de integração e E2E, build de produção, auditoria de dependências e smoke test local compõem o gate de entrega.

## 2026-09-27 — publicação segura autorizada

- O workspace foi preparado para substituir o arquivo ZIP do repositório oficial por código versionado e organizado.
- O MySQL foi restrito ao loopback, segredos ficaram fora dos arquivos versionados e o legado foi saneado para consulta pública.
- CI, Playwright, CodeQL e Dependabot foram adicionados como gates remotos, sem deploy da aplicação.

## 2026-09-28 — publicação verificada no GitHub

- O workspace organizado substituiu o ZIP na `main` do repositório oficial sem versionar ambiente, credenciais, uploads ou artefatos locais.
- CI, Playwright e CodeQL foram executados com sucesso contra o commit publicado.
- Alertas iniciais do CodeQL resultaram em rate limiting adicional para a sessão administrativa e na exclusão explícita do legado não executável.
- Secret Scanning, Push Protection e atualizações de segurança do Dependabot foram habilitados; não havia alertas abertos de segredos ou dependências.
