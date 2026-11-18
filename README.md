# Loma Novo — pacote para construir fora (Antigravity) no molde dos Espaços

Pacote completo e enxuto para construir a reestruturação do Loma **fora**
dos Espaços — no Antigravity, pela cota generosa do Marcos — já no molde
exato daqui, para depois importar quase 1:1, sem reconstruir.

**Estado (18/11/2026): só o pacote. Nenhuma tela do Loma foi construída.**
O código neste pacote ainda é o exemplo de notas do template limpo —
ele prova que tela, action e banco conversam, e será substituído pelo
domínio do Loma na primeira fase de construção, quando o Marcos autorizar.

## O que tem dentro

```
README.md             -> este arquivo
GUIA-ANTIGRAVITY.md   -> instruções de construção, com "O app a construir" já preenchido com o Loma novo
PROGRESSO.md          -> registro por fase (atualizar a cada fase, com aceite do Marcos)
specs/
  01-especificacao-tecnica.md                 -> produto, 5 abas, módulos, design Loma Editorial
  02-especificacao-inteligencia-artificial.md -> orquestradores, especialistas, skills, Jev
  03-correcoes-e-melhorias.md                 -> camadas transversais (conectores, glossário, Aprender etc.)
  04-mapa-modulos-especialistas-skills.md     -> mapa reconciliado, com as respostas do Marcos na seção 4
space.json            -> runtime typescript, nome "Loma Novo", slug provisório "loma-novo"
package.json          -> Bun 1.3.10, React 19, @hatch/space-sdk
tsconfig.base.json
client/               -> telas (src/App.tsx; app grande = 1 arquivo por área)
server/               -> regras e tabelas (src/actions.ts, src/schema.ts)
drizzle/              -> migração SQL por mudança de schema
```

## Ordem de leitura para quem for construir

1. Este README
2. `GUIA-ANTIGRAVITY.md` inteiro
3. `specs/` na ordem 01 → 04 (o mapa, nº 04, manda nas divergências —
   a seção 4 dele traz as respostas do Marcos)

## Regras que não mudam

- Stack fixo: TypeScript + React 19 + Tailwind 4 + Bun + Drizzle/SQLite
  + `@hatch/space-sdk`. Nada de Next.js, Vue, Express, Python/PHP,
  `better-sqlite3` direto, nem `localStorage` no lugar do banco.
- Banco: só via `ctx.db()` dentro das actions; o cliente nunca toca
  no banco — só chama `api.<action>()`.
- Sem fragmentação: nada de pasta `components/`, `hooks/` ou `utils/`,
  nem um arquivo por botão. App grande: 1 arquivo por área em
  `client/src` (Home, Bem-estar, Casa, Finanças, Crescer) e o mesmo em
  `server/src` — 15 a 20 arquivos de código no total, no máximo.
- Custo zero: GitHub privado é grátis; no Antigravity, usar o pote do
  Gemini (separado do pote Claude+GPT) e **não ligar o "AI Credit
  Overages"**. Verba só depois que o produto gerar renda.
- Dados de exemplo: só a família fictícia brasileira de divulgação,
  marcada como exemplo e apagável. Nunca dados reais do Marcos.

## Importar para os Espaços (depois de construído e aceito fora)

1. Subir o projeto pronto num **repositório privado no GitHub** (grátis)
   ou mandar o **.zip** no chat do Mano.
2. Dizer ao Mano: **"importa esse repo"** — ele nasce como Espaço novo
   (`loma-novo`), em paralelo ao Loma atual.
3. O Mano cria o Espaço, adapta se preciso, compila, audita e entrega
   o cartão para testar no iPhone.

**Nunca importar por cima do Loma atual**, que tem dados reais.
Testar o novo com dados de exemplo e só migrar os dados reais depois
da aprovação do Marcos.
