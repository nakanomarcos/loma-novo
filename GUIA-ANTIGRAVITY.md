# Guia para construir fora (Antigravity ou outra IA) — Loma Novo

> Leia este arquivo inteiro antes de escrever qualquer código. O molde
> abaixo é o que faz a importação para os Espaços ser quase 1:1. Fora
> dele, importar vira reconstruir — e a economia de tokens some.
>
> **Leia também, nesta ordem, a pasta `specs/`:**
> 1. `01-especificacao-tecnica.md` — produto, navegação, módulos, design
> 2. `02-especificacao-inteligencia-artificial.md` — orquestradores, especialistas, skills, Jev
> 3. `03-correcoes-e-melhorias.md` — camadas transversais
> 4. `04-mapa-modulos-especialistas-skills.md` — mapa reconciliado, com as respostas do Marcos na seção 4
>
> **Estado deste pacote (18/11/2026): pacote de documentos + molde, NÃO é autorização para construir tudo de uma vez.**
> A construção só começa quando o Marcos disser, fase por fase, com aceite dele em cada fase.

## O app a construir

- **Nome / slug:** Loma Novo / `loma-novo` (slug provisório, para nascer em paralelo ao Loma atual, sem sobrescrever os dados reais dele)
- **O que faz (1 frase):** Organizador doméstico e familiar completo — a pessoa lança a vida em frase solta e a IA organiza, classifica e ajuda a decidir, por área da vida.
- **Estrutura (spec técnica):** 5 abas — Home / Bem-estar / Casa / Finanças / Crescer — mais Apoio transversal. Criação com "+" dentro de cada módulo. Um dado tem um único módulo dono; os outros só acessam por hiperlink. Visual Loma Editorial Design (ver spec técnica §12).
- **Módulos:** a contagem "28 módulos" era aproximação do Marcos, não teto — somando as specs são 41 módulos distintos, mais Finanças como mini-app (a conta exata dos "18 de Finanças" ainda está em aberto, ver mapa §4.3). Não inventar corte nem fusão por conta própria.
- **IA:** 1 orquestrador central → 6 orquestradores por área → especialistas → skills por decisão recorrente (não skill por módulo). Jev só para escolha finita; nunca para cálculo nem para recomendação aberta com evidências. Conectores moram FORA do app, no Muse de cada pessoa.
- **Decisões do Marcos já anotadas no mapa (§4):** Espiritual terá especialista próprio; Alertas ele acha que será skill; Notas pode ter módulo próprio compartilhado/coletor (anotação feita em qualquer módulo — ex.: Devocional, Treinos — também aparece reunida em Notas); Sono e energia = sub-item de Humor/Corpo, sem módulo próprio; no item do botão central Lançar ele escreveu "pode apagar" (ler como: a spec nova remove o Lançar central — confirmar com ele na primeira fase antes de codar a navegação). **Fase 5 — Inteligência Conectada: SIM (esclarecido pelo Marcos em 18/11/2026)** — ela roda nos Espaços, como fase final do roadmap (IA transversal, automações e relatórios de vida). As skills dela não moram dentro do app: são skills do Muse (ver seção "Skills da Fase 5" neste guia).
- **Exemplo de uso:** a pessoa escreve/dita "amanhã dentista da Sofia às 10h e pagar a conta de luz de R$ 180 sexta" → a IA propõe os itens classificados (Agenda/Filhos e Finanças/Contas), a pessoa confere e salva — tudo gravado via actions no banco, nunca em `localStorage`.
- **Dados de exemplo:** usar só a família fictícia brasileira de divulgação, marcada como exemplo e apagável. Nunca usar dados reais do Marcos neste pacote.
- **O exemplo de notas do template** (`notes` em `App.tsx`/`actions.ts`/`schema.ts`) é só a prova de que tela, action e banco conversam. Ao construir a primeira fase de verdade, ele é substituído pelo domínio do Loma — não manter os dois.

## O stack (fixo — não trocar)

- **Linguagem:** TypeScript em tudo — cliente e servidor.
- **Front-end:** React 19 + TypeScript (`.tsx`), Tailwind CSS 4,
  React Query para buscar dados.
- **Back-end:** TypeScript rodando em **Bun** — NÃO é Node puro e NÃO
  é API REST/Express. São **actions** em `server/src/actions.ts`,
  chamadas pelo front via `@hatch/space-sdk`.
- **Banco de dados:** SQLite interno de cada app (`app.db`), acessado
  com Drizzle ORM. Modelo em `server/src/schema.ts`, migrações em
  `drizzle/`. O banco só é tocado dentro das actions, via `ctx.db()`.
- **Validação:** Zod em toda action (`request`/`response`).
- **Build:** `bun run build` (servidor com Bun, cliente com o SDK).

## O que NÃO usar (importar vira reconstrução)

- Next.js, Vue, Svelte, Python/PHP no back-end.
- Express, `better-sqlite3` direto, REST com `fetch("/api/...")`.
- `localStorage` no lugar do banco — dado salvo só no navegador
  some ao recarregar e não é o app.
- Réplica HTML estática bonita sem `actions.ts` + `app.db` — ela roda
  no navegador, mas não é o app.

## Estrutura (não reestruturar — só crescer dentro dela)

```
client/src/   -> App.tsx, main.tsx, api.ts, theme.css, globals.d.ts
server/src/   -> actions.ts, schema.ts
drizzle/      -> migração SQL por mudança de schema
package.json, space.json, tsconfig.base.json na raiz
```

- `main.tsx`, `api.ts` e `globals.d.ts`: **não mexer**.
- `App.tsx` é onde ficam as telas. `actions.ts` é onde ficam as
  regras. `schema.ts` é onde ficam as tabelas.

## Regra anti-fragmentação (importante — o problema que o Marcos já viu)

O Antigravity tende a criar dezenas de pastinhas, cada uma com um
arquivinho de 10–20 linhas. **Aqui é o contrário:**

- **NÃO criar** pastas `components/`, `hooks/`, `utils/`, `services/`
  nem um arquivo por botão, por tela pequena ou por função.
- Tela nova vira uma seção dentro de `App.tsx`.
- App grande: **1 arquivo por área** em `client/src` (ex.: `Home.tsx`,
  `Financas.tsx`, `Casa.tsx`) e o mesmo em `server/src` — uns
  **15–20 arquivos no total, no máximo**, nunca centenas.
- Arquivos grandes e claros valem mais que muitos arquivos miúdos:
  os apps reais do Marcos são assim (Gui Finance: `App.tsx` com
  1.102 linhas; Loma: 1 `App.tsx` gigante + 1 `actions.ts`).
- `node_modules` não é código do app — nunca contar nem copiar
  essas pastas.

## Como trabalhar (fases, com aceite)

1. Trabalhe por fase pequena (ex.: Fase 1 = listar + adicionar).
2. Ao fim de cada fase, atualize o `PROGRESSO.md` na raiz: o que foi
   feito, o que falta, o que foi testado.
3. Ao fim de cada fase, rode `bun run typecheck` e `bun run build`.
   Só passe para a próxima fase com os dois verdes.
4. Entregue **print mobile** (tela de celular, 390 px) de cada tela
   nova — o app é usado primeiro no iPhone.
5. Nunca invente dado de exemplo como se fosse dado real do usuário:
   exemplo vem marcado como exemplo e com botão para apagar.

## Aceite final (antes de entregar o repo)

- [ ] `bun run typecheck` verde
- [ ] `bun run build` verde
- [ ] App abre, lista vazia, adiciona, apaga, recarrega e continua lá
- [ ] Print mobile de cada tela
- [ ] `PROGRESSO.md` atualizado
- [ ] Nenhuma pasta nova fora da estrutura acima; nenhum arquivo
      com menos de ~50 linhas sem motivo
- [ ] Nenhum segredo, senha ou dado pessoal no código

## Skills da Fase 5 (quem prepara é o Mano, no Muse — não é código deste pacote)

A Fase 5 tem duas metades:

- **Dentro do app (código deste pacote, fase final da construção):** insights entre módulos, alertas inteligentes, detecção de padrões, automações e relatórios de vida 360° — isso é `actions.ts`/`schema.ts` + agendamentos do próprio Espaço. Não precisa de skill.
- **Fora do app, no Muse de cada pessoa:** as skills que o assistente usa para decidir e agir sobre o Loma (classificar entrada, escolher módulo dono, detectar duplicata, extrair recibo, priorizar a Home, gerar insight com evidências etc.). Skill não é pasta do app — é arquivo `SKILL.md` no ambiente do Muse, como a spec de IA define: skills por decisão recorrente/compartilhada, nunca 1 por módulo.

Ordem de preparo das skills (não fazer tudo agora):

1. **Lista/inventário:** já existe — é o mapa em `specs/04` (skills compartilhadas + skills por especialista). Nada a inventar.
2. **Skills compartilhadas primeiro:** elas já servem desde a Fase 1, não só na Fase 5.
3. **Skills por especialista:** preparar conforme o módulo daquela área ficar pronto (Fases 1 a 4).
4. **Skills transversais da Fase 5 por último** (insights entre módulos, padrões, relatórios): elas dependem do modelo de dados congelado das fases anteriores — escrevê-las antes é retrabalho.

Quem construir fora (Antigravity) **não** cria skills: entrega o app e o `PROGRESSO.md`; as skills o Mano prepara aqui, a partir do mapa.

## Importar para os Espaços (quem faz é o Mano, não você)

1. Suba o projeto pronto num repositório **privado** no GitHub
   (grátis) ou entregue o `.zip`.
2. O Marcos diz ao Mano: **"importa esse repo"** + se é um Espaço
   novo ou se substitui um app atual.
3. O Mano cria o Espaço pela ferramenta oficial, adapta o código
   para `App.tsx / actions.ts / schema.ts`, gera a migração Drizzle,
   compila, audita e entrega o cartão para testar no iPhone.

**Nunca importar por cima de um app com dados reais.** Importa-se
como app novo em paralelo, testa-se com dados de exemplo e só depois
se migram os dados reais.

## Custo zero (regra do Marcos)

- GitHub privado: grátis. Antigravity: usar o pote do **Gemini**
  (separado do pote Claude+GPT). **Não ligar o "AI Credit
  Overages"** — quando a cota acabar, para, não cobra.
- Verba só entra depois que o produto gerar renda.
