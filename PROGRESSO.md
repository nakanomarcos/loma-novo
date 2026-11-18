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
    1. **Visão Geral:** Hero Card Espresso com métricas de síntese (saúde pendente, treinos da semana, sono médio, cuidados e humor mais recente) e atalhos rápidos.
    2. **Saúde Preventiva:** Consultas, exames, medicamentos e vacinas com médico/clínica, data, detalhes e checkbox de conclusão com atualização instantânea no banco.
    3. **Corpo & Treinos:** Registro de atividades físicas (musculação, corrida, caminhada, natação), duração e anotações técnicas.
    4. **Cuidados & Autocuidado:** Rotinas de cuidados pessoais (pele, cabelo, corpo, unhas) com frequência e alternância diária.
    5. **Humor, Sono & Energia:** Registro de humor (radiante, calmo, cansado, ansioso, desafiador), nível de energia (1 a 5), horas de sono e notas reflexivas.
    6. **Devocional & Espiritualidade:** Leituras bíblicas, orações e motivos de gratidão, com badges de passagem bíblica e reflexão do dia.
    7. **Alimentação & Cozinha:** Planejamento de cardápio semanal (café, almoço, jantar, lanche) por dia da semana e receitas favoritas.
  - **Espelhamento Automático no Agregador de Notas:** Treinos e reflexões do Devocional criam automaticamente notas na tabela compartilhada `notes`, rotuladas com seus respectivos módulos de origem (`Treinos`, `Devocional`) e tags de identificação.
  - **Migração Drizzle:** [0003_loma_bem_estar.sql](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/drizzle/0003_loma_bem_estar.sql).

- **Fase 3 — Casa e família (18/11/2026): CONCLUÍDA E VALIDADA.**
  - **Aba Casa ativada com os 10 módulos integrados ([Casa.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/Casa.tsx)):**
    1. **Visão Geral:** Hero Card Espresso com métricas de gestão doméstica e listas rápidas.
    2. **Mercado & Despensa:** Lista de compras com categorias e alternância de carrinho.
    3. **Casa / Manutenções Domésticas:** Reparos por cômodo, prazos e custos.
    4. **Filhos & Rotina Escolar:** Acompanhamento de Sofia.
    5. **Desejos & Compras Planejadas:** Aquisições futuras e prioridades.
    6. **Pets & Cuidados:** Perfil de Thor, vacinas e cuidados.
    7. **Veículos & Revisões:** Honda HR-V 2022 com quilometragem e revisões.
    8. **Patrimônio & Bens:** Bens materiais e garantias.
    9. **Segurança & Emergência:** Contatos essenciais de urgência.
    10. **Família & Rede:** Relacionamentos e aniversários.
  - **Correção e Validação de Responsividade Mobile (390 px e 360 px):** Validação visual via Chrome DevTools Protocol (`hasOverflow: false` em 100% das telas).
  - Aceite formal do Marcos recebido.

- **Fase 4 — Crescimento e futuro (18/11/2026): CONCLUÍDA E VALIDADA.**
  - Aba Crescer ativada com os 8 módulos integrados ([Crescer.tsx](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/client/src/Crescer.tsx)): Trabalho, Estudos, Livros, Projetos, Viagens, Documentos, Filmes & Séries, Música.
  - Espelhamento automático de resenhas e anotações em Notas.
  - Testes e prints mobile em 390 px e 360 px validados.
  - Aceite formal do Marcos recebido.

- **Fase 5 — Conectada & Inteligência Transversal (18/11/2026): CONCLUÍDA E TESTADA.**
  - **Inteligência Conectada (Orquestrador Transversal & Insights):**
    - Seção de **Alertas Inteligentes Proativos** na Home com severidades (`Urgente`, `Aviso`, `Info`), botões de ação com 1 clique (ex: "Criar Tarefa de Renovação", "Lançar Aporte") e opção de dispensar.
    - Seção de **Cruzamento entre Módulos** com correlações analíticas reais (Saúde × Finanças, Sono × Carreira, Casa × Manutenção, Viagens × Documentos).
  - **Visão 360° & Relatório de Vida:**
    - Painel consolidado no Drawer de Apoio com índices percentuais para os 4 pilares da vida familiar:
      - Saúde & Bem-estar: 92% (Ótimo)
      - Finanças & Reserva: 88% (Sólido)
      - Casa & Família: 90% (Ativo)
      - Crescer & Estudos: 86% (Fluindo)
      - **Harmonia Geral: 89/100**
    - Síntese diagnóstica, focos de atenção preventiva e lista de conquistas/pontos fortes da família.
  - **Consultor Loma IA (Transversal & Explicável):**
    - Orientador de vida que responde a dúvidas do usuário fundamentando-se exclusivamente em fatos reais do banco de dados (saldo disponível, tarefas abertas, leitura ativa, exames agendados).
    - Botões rápidos com perguntas frequentes ("Como está o equilíbrio da família?", "Como estão os planos para a viagem?", etc.).
    - Exibição explícita da lista de evidências do sistema antes de qualquer recomendação (conforme `specs/01` e `specs/02`).
  - **Busca Global & Command Palette (`Cmd+K` / `🔍`):**
    - Ativação instantânea via teclado (`⌘K` / `Ctrl+K`) ou botão de lupa no cabeçalho superior.
    - Pesquisa em tempo real unificando **todas** as tabelas do Loma (compromissos, tarefas, notas, finanças, consultas, treinos, compras, pet, veículos, livros, cursos, viagens, documentos).
    - Clique no resultado que fecha o modal e navega direto para a aba e sub-aba correspondente.
  - **Soberania de Dados & Backup em 1 Clique:**
    - Botão de exportação no Drawer de Apoio que gera e faz download do arquivo `loma-backup-YYYY-MM-DD.json` consolidando as 27 tabelas do sistema.
  - **Drizzle Schema & Migração:**
    - Nova tabela `smart_alerts` criada em `server/src/schema.ts`.
    - Migração Drizzle [0006_loma_fase5_conectada.sql](file:///Users/nakanomarcos/Desktop/PROJETOS/loma-pacote-novo-molde/drizzle/0006_loma_fase5_conectada.sql) criada e registrada no `_journal.json`.
  - **Actions Zod:**
    - `getInteligenciaOverview`, `dismissSmartAlert`, `executeSmartAlertAction`, `askLifeConsultant`, `globalSearch`, `exportAllData`.
    - Integração de alertas em `loadDemoData` e `clearDemoData`.
  - **Estrutura Estrita do Molde Mantida:**
    - Exatamente **12 arquivos de código** (teto de 15 a 20 respeitado).
    - Zero fragmentação em subpastas (`components/`, `hooks/`, etc.).
    - Sem `localStorage`, sem Express, banco via `ctx.db()`.
  - **Testes & Validação:**
    - `bun run typecheck`: 0 erros.
    - `bun run build`: build limpo de servidor (0.30 MB) e cliente.
    - Suíte de integração automatizada (`scratch/test-fase5.ts`) passou com 100% de sucesso.
    - 5 novos prints mobile capturados em 390 px e 360 px com zero overflow lateral.

---

## Registro de fases

| Fase | O que foi feito | Testado (typecheck/build/print mobile) | Aceite do Marcos |
| --- | --- | --- | --- |
| 0 — Pacote | Molde + specs + guia + PROGRESSO.md inicial | Não se aplica (pacote documental) | Concluído |
| 1 — Fundação | Casca 5 abas, Home completa, Finanças 8 módulos, Apoio drawer, Loma Editorial Design, dados fictícios apagáveis | `bun run typecheck` verde · `bun run build` verde · Prints mobile capturados | Concluído |
| 2 — Corpo e mente | Aba Bem-estar completa (7 módulos) + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 4 prints mobile capturados | Concluído |
| 3 — Casa e família | Aba Casa completa (10 módulos) + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 6 prints mobile capturados | Concluído |
| 4 — Crescer | Aba Crescer completa (8 módulos) + Hero Card + espelhamento em Notas | `bun run typecheck` verde · `bun run build` verde · 9 prints mobile capturados | Concluído |
| 5 — Conectada | Inteligência Conectada (alertas, insights, Visão 360°, Consultor IA, Busca Global Cmd+K, Backup JSON) | `bun run typecheck` verde · `bun run build` verde · 5 prints mobile capturados (390px e 360px, zero overflow) | **Entregue para validação final** |

---

## Tamanho do código

> Contagem oficial via `wc -l` realizada em 18/11/2026 ao término da **Fase 5 — Conectada**.  
> **Escopo de Código:** exclusivamente `client/src/` e `server/src/` (`.ts`, `.tsx`, `.css`) + `drizzle/` (`.sql`).  
> **Regra do Molde:** contagem direta de linhas via `wc -l` sem fragmentação de pastas.

| Arquivo | Linhas |
| --- | ---: |
| `server/src/actions.ts` | 3.668 |
| `client/src/App.tsx` | 1.767 |
| `client/src/Crescer.tsx` | 891 |
| `client/src/Casa.tsx` | 879 |
| `client/src/Home.tsx` | 791 |
| `server/src/schema.ts` | 587 |
| `client/src/BemEstar.tsx` | 559 |
| `client/src/Financas.tsx` | 475 |
| `client/src/Apoio.tsx` | 459 |
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
| **Total de Código** | **10.656** |

- **Diferença em relação à Fase 4:** **+1.037 linhas** (Fase 4: 9.619 linhas → Fase 5: 10.656 linhas).
- **Total de Documentos (`.md`):** **3.519 linhas** (em 9 arquivos de especificação e governança).

