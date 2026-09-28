# Instruções do projeto

## Memória técnica

1. Leia `specs/README.md`.
2. Abra somente as capabilities relacionadas à tarefa.
3. Consulte `specs/system.md` para confirmar o implementado.
4. Consulte `specs/testing.md` antes de alterar cobertura.
5. Use `docs/state.md` somente para handoff local.

Mudança funcional atualiza a capability; decisão duradoura cria ou substitui ADR; alteração de evidência atualiza `testing.md`; marco relevante atualiza `history.md`.

## Restrições

- A execução do produto permanece local; não configurar hospedagem ou deploy
  sem solicitação explícita.
- O repositório oficial é `https://github.com/Darkzin41/Hidden_Route`. Criar
  remotos, fazer push, abrir PR ou alterar configurações do GitHub exige
  autorização explícita do usuário para a tarefa atual.
- Não versionar `.env`, uploads reais, senhas ou dados pessoais.
- Preservar `legacy/` como referência histórica, sem usá-lo como código executável.
