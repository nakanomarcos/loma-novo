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
  - **Área Home / Seu Dia:** Início com Hero Card Espresso, Agenda 14 dias com aniversários, Hábitos com streaks diários, Tarefas com prioridade, e Notas como agregador centralizado.
  - **Área Finanças (8 módulos canônicos):** Resumo com patrimônio líquido e fluxo, Orçamento, Contas, Cartões, Metas, Investir, Proteção e Consultor.
  - **Apoio Transversal (Drawer lateral):** Pessoas da Casa, Personalizar preferências e paleta, Log do Sistema e limpeza de dados de teste em 1 clique.

- **Fase 2 — Corpo e mente (18/11/2026): CONCLUÍDA E VALIDADA.**
  - **Aba Bem-estar ativada com os 7 módulos integrados ([BemEstar.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/BemEstar.tsx)):**
    1. **Visão Geral:** Hero Card Espresso com métricas de síntese e atalhos rápidos.
    2. **Saúde Preventiva:** Consultas, exames, medicamentos e vacinas com médico/clínica, data, detalhes e checkbox de conclusão.
    3. **Corpo & Treinos:** Registro de atividades físicas, duração e notas.
    4. **Cuidados & Autocuidado:** Rotinas de cuidados pessoais com frequência e alternância diária.
    5. **Humor, Sono & Energia:** Registro de humor, energia (1 a 5), horas de sono e notas reflexivas.
    6. **Devocional & Espiritualidade:** Leituras bíblicas, orações e gratidão.
    7. **Alimentação & Cozinha:** Planejamento de cardápio semanal e receitas favoritas.
  - **Espelhamento Automático no Agregador de Notas:** Treinos e reflexões do Devocional espelhados em `notes`.
  - **Migração Drizzle:** [0003_loma_bem_estar.sql](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/drizzle/0003_loma_bem_estar.sql).

- **Fase 3 — Casa e família (18/11/2026): CONCLUÍDA E VALIDADA.**
  - **Aba Casa ativada com os 10 módulos integrados ([Casa.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/Casa.tsx)):**
    1. **Visão Geral:** Hero Card Espresso com métricas domésticas e listas rápidas.
    2. **Mercado & Despensa:** Lista de compras com categorias e alternância de carrinho.
    3. **Casa / Manutenções Domésticas:** Reparos por cômodo, prazos e custos.
    4. **Filhos & Rotina Escolar:** Acompanhamento de Sofia.
    5. **Desejos & Compras Planejadas:** Aquisições futuras e prioridades.
    6. **Pets & Cuidados:** Perfil de Thor, vacinas e cuidados.
    7. **Veículos & Revisões:** Honda HR-V 2022 com quilometragem e revisões.
    8. **Patrimônio & Bens:** Bens materiais e garantias.
    9. **Segurança & Emergência:** Contatos essenciais de urgência.
    10. **Família & Rede:** Relacionamentos e aniversários.
  - **Responsividade Mobile:** Validação visual em 390 px e 360 px com zero overflow.

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

- **Ajustes de Padrão Visual e Dados (Loma Atual) — 18/11/2026: CONCLUÍDO E TESTADO.**
  1. **Cartões no Padrão do Loma Atual (Medidas Reduzidas):**
     - Cada item é um **cartão individual empilhado** (eliminada qualquer lista agrupada com divisórias internas).
     - **Cartão expansível:** toque no cartão abre a sanfona de detalhes com botões "Editar" e "Excluir" embutidos.
     - **Conclusão:** círculo de 32px (área de toque ≥40px); ao concluir, risca o título e move o cartão com opacidade reduzida para o fim da lista.
     - **Design canônico aplicado:** raio 24px (`rounded-[24px]`), fundo `#FFFDF8`, borda suave `#EFE5D5` com linha delicada (`shadow-[0_1px_0_rgba(223,213,196,0.5)]`), sem sombra pesada.
     - **Medidas exatas:** padding vertical 12px (`py-3`), horizontal 16px (`px-4`); altura fechada ≈62–64px (`min-h-[62px]`); espaçamento entre cartões 8px (`space-y-2`); título 16px semibold (`text-[16px] font-semibold text-[#2C241E]`); linha meta 13px (`text-[13px] text-[#7C6E62]`); título de seção serifado 20px (`font-serif text-[20px] font-medium text-[#2C241E]`); hero card com padding 16px (`p-4 rounded-[24px]`); botões pílula de 44–48px.
  2. **Aba Lateral (Apoio) Refeita em Cartões:**
     - Removido o painel com abas internas horizontais.
     - Reconstruído no modelo do menu "Mais" do Loma atual: lista de cartões individuais empilhados nas medidas canônicas — *Visão 360°*, *Consultor Loma IA*, *Pessoas da Casa*, *Personalizar*, *Dados & Backup*, *Log do Sistema*, *Limpar Dados de Exemplo*.
     - Toque no cartão abre a tela respectiva com cabeçalho contextual e botão "← Voltar ao Menu".
  3. **Exportação e Importação em Todos os Formatos:**
     - **Exportação:** JSON (backup completo de todas as 27 tabelas), CSV (por módulo, com colunas específicas), Markdown (relatório estruturado Área → Módulo → Itens) e PDF (relatório formatado para leitura/impressão via `@media print`).
     - **Importação:** aceita arquivos `.json`, `.csv`, `.md`, `.markdown`, `.pdf`, `.txt`. O parser converte as linhas/seções e mapeia para os módulos canônicos.
     - **Tela de Conferência Prévia Obrigatória:** nenhuma importação é gravada diretamente. A tela exibe prévia editável dos itens (título ajustável, categoria, módulo dono), checkboxes de seleção, detecção automática e badge `⚠️ Possível Duplicado`, botão para desmarcar duplicados em lote e botão para confirmar gravação via action `importVerifiedItems` no SQLite.
  4. **Responsividade e Anti-overflow:**
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
| Padrão Visual & Dados | Cartões Loma Atual (individuais, expansíveis, 24px, 62px, reordenação de concluídos), Apoio em cartões, Export/Import multi-formato (JSON, CSV, MD, PDF) com tela de conferência prévia | `bun run typecheck` verde · `bun run build` verde · 14 prints mobile novos (390px e 360px, zero overflow) | **Aguardando aceite** |

---

## Tamanho do código

> Contagem oficial via `wc -l` realizada em 18/11/2026 após aplicação do **Padrão Visual do Loma Atual e Exportação/Importação Multi-formato**.  
> **Escopo de Código:** exclusivamente `client/src/` e `server/src/` (`.ts`, `.tsx`, `.css`) + `drizzle/` (`.sql`).  
> **Regra do Molde:** contagem direta de linhas via `wc -l` sem fragmentação de pastas (máximo de 15 a 20 arquivos).

| Arquivo | Linhas |
| --- | ---: |
| `server/src/actions.ts` | 3.777 |
| `client/src/App.tsx` | 1.772 |
| `client/src/Apoio.tsx` | 1.204 |
| `client/src/Crescer.tsx` | 895 |
| `client/src/Casa.tsx` | 805 |
| `client/src/Home.tsx` | 799 |
| `client/src/BemEstar.tsx` | 611 |
| `server/src/schema.ts` | 587 |
| `client/src/Financas.tsx` | 476 |
| `drizzle/0002_loma_fundacao.sql` | 131 |
| `drizzle/0004_loma_casa_familia.sql` | 130 |
| `drizzle/0005_loma_crescer.sql` | 106 |
| `drizzle/0003_loma_bem_estar.sql` | 70 |
| `client/src/theme.css` | 59 |
| `client/src/main.tsx` | 28 |
| `client/src/api.ts` | 20 |
| `client/src/globals.d.ts` | 18 |
| `drizzle/0006_loma_fase5_conectada.sql` | 13 |
| `drizzle/0001_initial.sql` | 5 |
| **Total de Código** | **11.506** |

- **Diferença em relação à contagem anterior (Fase 5):** **+850 linhas** (Fase 5: 10.656 linhas → Atual: 11.506 linhas).
  - *Adições:* Parser multi-formato (JSON, CSV, MD, PDF), tela interativa de conferência com detecção de duplicados, botões de exportação múltipla no Apoio, padronização canônica de cartões individuais expansíveis em todas as telas e action `importVerifiedItems` com validação Zod.
- **Total de Documentos (`.md`):** **3.550 linhas** (em 9 arquivos de especificação e governança).
