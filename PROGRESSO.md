# PROGRESSO — Loma Novo (construção fora, no Antigravity)

> Atualizar ao fim de cada fase: o que foi feito, o que falta, o que foi testado.
> Só avançar para a próxima fase com typecheck + build verdes e aceite do Marcos.

## Estado atual

- **Fase 0 — Pacote (18/11/2026): CONCLUÍDA.**
  - Molde dos Espaços (@hatch/space-sdk, Bun, React 19, Tailwind 4, Drizzle/SQLite via actions).
  - Specs alinhadas em `specs/` (01 a 04), com o mapa reconciliado com as respostas do Marcos.
  - `GUIA-ANTIGRAVITY.md` revisado.
  - Regra anti-fragmentação rigorosamente absorvida: 1 arquivo por área, sem pastinhas `components/`, `hooks/`, `utils/`, máximo de 15 a 20 arquivos no projeto.

- **Fase 1 — Fundação (18/11/2026): CONCLUÍDA E VALIDADA.**
  - **Construção 100% no molde:** Bun + React 19 + Tailwind 4 + Drizzle/SQLite via actions com Zod.
  - **Arquitetura sem fragmentação:** 4 arquivos no cliente (`App.tsx`, `Home.tsx`, `Financas.tsx`, `Apoio.tsx`) e 2 no servidor (`schema.ts`, `actions.ts`).
  - **Navegação mobile-first (390px):** Barra superior com Avatar drawer + título + `[+]` contextual. Barra inferior com 5 abas fixas (`[ Home ]`, `[ Bem-estar ]`, `[ Casa ]`, `[ Finanças ]`, `[ Crescer ]`), sem botão central "Lançar".
  - **Área Home / Seu Dia:** Início com Hero Card, Agenda 14 dias com aniversários, Hábitos com streaks diários, Tarefas com prioridade, e Notas como agregador centralizado.
  - **Área Finanças (8 módulos canônicos):** Resumo com patrimônio líquido e fluxo, Orçamento, Contas, Cartões, Metas, Investir, Proteção e Consultor.
  - **Apoio Transversal (Drawer lateral):** Pessoas da Casa, Personalizar preferências e paleta, Log do Sistema e limpeza de dados de teste em 1 clique.

- **Fase 2 — Corpo e mente (18/11/2026): CONCLUÍDA E VALIDADA.**
  - Aba Bem-estar ativada com os 7 módulos integrados ([BemEstar.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/BemEstar.tsx)): Visão Geral, Saúde Preventiva, Corpo & Treinos, Cuidados & Autocuidado, Humor/Sono/Energia, Devocional, Alimentação & Cozinha.
  - Espelhamento automático de treinos e devocional em `notes`.
  - Migração Drizzle: [0003_loma_bem_estar.sql](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/drizzle/0003_loma_bem_estar.sql).

- **Fase 3 — Casa e família (18/11/2026): CONCLUÍDA E VALIDADA.**
  - Aba Casa ativada com os 10 módulos integrados ([Casa.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/Casa.tsx)): Visão Geral, Mercado & Despensa, Manutenções, Filhos, Desejos/Compras, Pets, Veículos, Patrimônio, Segurança, Família & Rede.
  - Responsividade Mobile: validação visual em 390 px e 360 px com zero overflow.

- **Fase 4 — Crescimento e futuro (18/11/2026): CONCLUÍDA E VALIDADA.**
  - Aba Crescer ativada com os 8 módulos integrados ([Crescer.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/Crescer.tsx)): Trabalho, Estudos, Livros, Projetos, Viagens, Documentos, Filmes & Séries, Música.
  - Espelhamento automático de resenhas e anotações em Notas.

- **Fase 5 — Conectada & Inteligência Transversal (18/11/2026): CONCLUÍDA E VALIDADA.**
  - Alertas Inteligentes Proativos na Home com ações em 1 clique.
  - Cruzamento analítico entre módulos (Saúde × Finanças, Sono × Carreira, etc.).
  - Visão 360° & Relatório de Vida com harmonia geral familiar.
  - Consultor Loma IA com fundamentação estrita em evidências do sistema.
  - Busca Global & Command Palette (`Cmd+K` / `🔍`).
  - Migração Drizzle [0006_loma_fase5_conectada.sql](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/drizzle/0006_loma_fase5_conectada.sql).

- **Padronização Visual Loma Atual & Cartão-Herói Degradê (19/11/2026): CONCLUÍDA E TESTADA.**
  - **Padronização visual aplicada sobre o projeto existente (sem refazer):**
    1. **Paleta e fontes do Loma atual ([PADRONIZACAO-VISUAL-LOMA.md](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/PADRONIZACAO-VISUAL-LOMA.md)):**
       - Fundo da página: `#FAF4E8` (creme quente).
       - Superfície do cartão: `#FFFDF8`.
       - Superfície morna: `#F3E9D7`.
       - Texto principal: `#2E2019`.
       - Texto suave (meta): `#7A675A`.
       - Borda / linha delicada: `#E7DBC6`.
       - Destaque (coral): `#E8836B` (substitui o rosa antigo `#C47882` em todo o app).
       - Destaque forte: `#CF6248`.
       - Verde sálvia: `#7D8C6F`.
       - Dourado: `#C79A3B`.
       - Perigo: `#B3402E`.
       - Tipografia: **Fraunces** para títulos serifados e marca (substitui DM Serif Display); sans oficial do Loma para texto corrido; `tabular-nums` para valores e datas.
    2. **Emenda do Cartão-Herói (Home e Visões Gerais de Todas as Áreas):**
       - Substituído o fundo marrom-espresso/cacau por degradê linear 135°: `#7E354F` (0%) → `#653259` (55%) → `#4C2B57` (100%), com brilho radial suave (`#A85D7A` a 20%) no canto superior direito.
       - Texto do herói em creme `#FFF7EA` (secundário a 75%).
       - Caixas de números com fundo branco a 10% (`bg-white/10`) e borda branca a 12% (`border-white/12`).
       - Números e destaques em rosa claro `#F3C6D2` (Fraunces serif).
       - Aplicado uniformemente em: Home (Painel do Dia), Finanças (Patrimônio Líquido Familiar), Bem-Estar (Saúde & Equilíbrio Integral), Casa (Gestão Doméstica & Familiar), Crescer (Crescimento & Futuro) e Apoio (Diagnóstico Transversal 360°).
    3. **Cartões no Padrão e Medidas Reduzidas:**
       - Cartões individuais empilhados, fundo `#FFFDF8`, raio 24px (`rounded-[24px]`), borda `#E7DBC6` com sombra fina `0 1px 0 #E7DBC6` (sem sombras pesadas).
       - Padding vertical 12px (`py-3`), horizontal 16px (`px-4`), altura fechada ≈62–64px (`min-h-[62px]`), espaço entre cartões 8px (`space-y-2`).
       - Círculo de concluir 32px com área de toque mínima ≥40px.
       - Sanfona expansível com botões de Editar/Excluir/Reabrir embutidos.
       - Conclusão risca o título e move o cartão com opacidade reduzida para o final da lista.
    4. **Aba Lateral (Apoio) em Cartões Empilhados:**
       - Menu estilo "Mais" com cartões individuais empilhados: Visão 360°, Consultor IA, Pessoas da Casa, Personalizar, Dados & Backup, Log do Sistema.
    5. **Exportação/Importação Multi-formato com Conferência Prévia:**
       - JSON, CSV, Markdown e PDF com tela interativa de conferência e alerta de duplicados antes de gravar.
    6. **Responsividade Mobile:**
       - 100% testado em 390 px e 360 px com zero overflow horizontal (`hasOverflow: false`).

---

## Registro de fases

| Fase | O que foi feito | Testado (typecheck/build/print mobile) | Aceite do Marcos |
| --- | --- | --- | --- |
| 0 — Pacote | Molde + specs + guia + PROGRESSO.md inicial | Não se aplica (pacote documental) | Concluído |
| 1 — Fundação | Casca 5 abas, Home completa, Finanças 8 módulos, Apoio drawer, Loma Editorial Design, dados fictícios apagáveis | `bun run typecheck` verde · `bun run build` verde · Prints mobile capturados | Concluído |
| 2 — Corpo e mente | Aba Bem-estar completa (7 módulos) + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 4 prints mobile capturados | Concluído |
| 3 — Casa e família | Aba Casa completa (10 módulos) + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 6 prints mobile capturados | Concluído |
| 4 — Crescer | Aba Crescer completa (8 módulos) + Hero Card + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 9 prints mobile capturados | Concluído |
| 5 — Conectada | Inteligência Conectada (alertas, insights, Visão 360°, Consultor IA, Busca Global Cmd+K, Backup JSON) | `bun run typecheck` verde · `bun run build` verde · 5 prints mobile capturados | Concluído |
| Padronização Visual Loma Atual | Paleta oficial Loma atual (#FAF4E8, #2E2019, #E8836B, #E7DBC6), Fraunces, cartões 24px/62px sanfona, herói degradê vinho→roxo (#7E354F→#653259→#4C2B57) com rosa #F3C6D2 em todas as áreas, Apoio em cartões e export/import conferido | `bun run typecheck` verde · `bun run build` verde · 15 prints mobile novos (390px e 360px, zero overflow) | **Aguardando aceite** |

---

## Tamanho do código

> Contagem oficial via `wc -l` realizada em 19/11/2026 após aplicação da **Padronização Visual do Loma Atual e Cartão-Herói Degradê**.  
> **Escopo de Código:** exclusivamente `client/src/` e `server/src/` (`.ts`, `.tsx`, `.css`) + `drizzle/` (`.sql`).  
> **Regra do Molde:** contagem direta de linhas via `wc -l` sem fragmentação de pastas (máximo de 15 a 20 arquivos).

| Arquivo | Linhas |
| --- | ---: |
| `server/src/actions.ts` | 3.777 |
| `client/src/App.tsx` | 1.772 |
| `client/src/Apoio.tsx` | 1.209 |
| `client/src/Crescer.tsx` | 898 |
| `client/src/Casa.tsx` | 808 |
| `client/src/Home.tsx` | 800 |
| `client/src/BemEstar.tsx` | 614 |
| `server/src/schema.ts` | 587 |
| `client/src/Financas.tsx` | 485 |
| `drizzle/0002_loma_fundacao.sql` | 131 |
| `drizzle/0004_loma_casa_familia.sql` | 130 |
| `drizzle/0005_loma_crescer.sql` | 106 |
| `client/src/theme.css` | 74 |
| `drizzle/0003_loma_bem_estar.sql` | 70 |
| `client/src/main.tsx` | 28 |
| `client/src/api.ts` | 20 |
| `client/src/globals.d.ts` | 18 |
| `drizzle/0006_loma_fase5_conectada.sql` | 13 |
| `drizzle/0001_initial.sql` | 5 |
| **Total de Código** | **11.545** |

- **Diferença em relação à contagem anterior:** **+39 linhas** (de 11.506 para 11.545 linhas), referentes aos tokens e classes de herói degradê no `theme.css` e refinamentos de tipografia.
- **Total de Documentos (`.md`):** **3.653 linhas** (em 10 arquivos de especificação, padronização e governança).
