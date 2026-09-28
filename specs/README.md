# Memória técnica do Hidden Route

Este diretório contém o contrato necessário para compreender e modificar o projeto.

## Ordem de leitura

1. Leia este índice.
2. Abra `capabilities/core.md` para o contrato funcional.
3. Consulte `system.md` para confirmar a arquitetura implementada.
4. Consulte `testing.md` antes de alterar cobertura.
5. Leia os ADRs citados e `open-decisions.md`.
6. Consulte `docs/state.md` para o handoff local.

## Autoridade

| Documento              | Autoridade                         |
| ---------------------- | ---------------------------------- |
| `capabilities/core.md` | Contrato e estado de entrega       |
| `system.md`            | Arquitetura realmente implementada |
| `testing.md`           | Estratégia e mapa de evidências    |
| `open-decisions.md`    | Questões ainda não decididas       |
| `decisions/*.md`       | Motivos e consequências duradouras |
| `history.md`           | Marcos do projeto                  |

Mudança funcional atualiza a capability; mudança de evidência atualiza `testing.md`; decisão duradoura cria ou substitui ADR.
