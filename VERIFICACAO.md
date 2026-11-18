# VERIFICAÇÃO — antes de importar para os Espaços

> Sem esta verificação aprovada, o código **não** vai para importação.
> Corrigir lá no Antigravity é barato (cota de lá). Corrigir aqui é caro (cota gratuita do Muse).
> A verificação tem 3 camadas: **1) auditoria lá → 2) relatório → 3) conferência do Mano aqui.**

---

## Prompt para colar no Antigravity (no fim de cada fase)

```
Faça uma auditoria de verificação deste projeto, sem escrever código novo do app.

Leia GUIA-ANTIGRAVITY.md e VERIFICACAO.md e confira, com evidência, cada item da lista de verificação deste arquivo:
estrutura de pastas, contagem e tamanho dos arquivos, padrões proibidos, stack, typecheck, build e comportamento (listar / adicionar / apagar / recarregar e continua salvo).

Crie o arquivo RELATORIO-VERIFICACAO.md na raiz com:
- data e fase auditada
- resultado de cada item: PASSOU ou FALHOU, com a evidência (comando rodado e saída resumida, árvore de arquivos, contagem de linhas por arquivo)
- lista de tudo que falhou, sem corrigir por conta própria itens que mudem regra, tela ou dado — esses você só aponta

Atualize também o PROGRESSO.md e anexe print mobile (390 px) de cada tela da fase.
Pare e espere meu aceite. Não importe nada, não publique nada.
```

---

## Lista de verificação (o que o relatório precisa provar)

### 1. Estrutura — o molde, sem fragmentação
- [ ] Só existem as pastas do molde: `client/`, `server/`, `drizzle/`, `specs/` (documentos) e a raiz. Nada de `components/`, `hooks/`, `utils/`, `services/`, `pages/`, `api/`.
- [ ] Arquivos de código: **15 a 20 no máximo** (app grande = 1 arquivo por área em `client/src` e o mesmo em `server/src`). `node_modules` não conta e nunca entra no relatório como código.
- [ ] Nenhum arquivo de código com menos de ~50 linhas sem motivo escrito no relatório.
- [ ] Relatório traz a árvore de arquivos e a contagem de linhas por arquivo.

### 2. Stack — o dos Espaços, sem substituições
- [ ] `space.json` com `"runtime": "typescript"`, nome e slug corretos.
- [ ] `package.json` com Bun, React 19, `@hatch/space-sdk`, `drizzle-orm`, `zod` — e **sem** dependência nova sem motivo escrito no relatório.
- [ ] Busca no código (grep) com **zero** ocorrências de: `express`, `better-sqlite3`, `next`, `vue`, `svelte`, `localStorage`, `fetch("/api/` e `fetch('/api/`.
- [ ] Banco só via `ctx.db()` dentro de `server/src/actions.ts` (e arquivos de área do servidor); o cliente só chama `api.<action>()`.
- [ ] Toda action com validação Zod de entrada e saída; tabelas só em `server/src/schema.ts` (e arquivos de área); cada mudança de schema tem migração nova em `drizzle/`.
- [ ] `client/src/main.tsx`, `client/src/api.ts` e `client/src/globals.d.ts` sem alteração.

### 3. Build — verde, com saída no relatório
- [ ] `bun run typecheck` verde (colar a saída resumida no relatório).
- [ ] `bun run build` verde (colar a saída resumida no relatório).

### 4. Comportamento — o app de verdade, não a réplica
- [ ] App abre; lista vazia aparece limpa (campo vazio nunca aparece escrito na tela).
- [ ] Adicionar funciona, apagar funciona, **recarregar a página e o dado continua lá** (prova de que salvou no banco, não no navegador).
- [ ] Print mobile (390 px) de cada tela da fase, anexado.
- [ ] Dados na tela são só os de exemplo (família fictícia), marcados como exemplo e apagáveis. Nenhum dado real, segredo, senha ou chave no código ou nos prints.

### 5. Processo
- [ ] `PROGRESSO.md` atualizado: fase, o que foi feito, o que falta, o que foi testado.
- [ ] O que foi construído é **só a fase combinada** — nada de fase seguinte antecipada, nada de módulo fora do mapa (`specs/04`).
- [ ] Pontos em aberto do mapa (`specs/04`, seção 4) não foram decididos sozinhos: estão listados no relatório como perguntas.

---

## Depois do relatório (camada 3 — aqui)

1. O Marcos traz o projeto de volta (repo privado no GitHub ou .zip) **com** `RELATORIO-VERIFICACAO.md`, `PROGRESSO.md` e os prints dentro.
2. O Mano confere o relatório e faz uma checagem por amostragem no código (estrutura, padrões proibidos, actions × schema) **antes** de importar.
3. Se algo falhou: volta para o Antigravity corrigir lá, com a lista do relatório — não corrige aqui.
4. Se passou: importa como Espaço novo, em paralelo, e a auditoria do build aqui é a prova final.
5. Na primeira importação, medir a cota antes e depois (Token Survivor) e anotar o custo real no `PROGRESSO.md`.
