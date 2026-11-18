# Loma — Mapa módulo → especialista → skills → Jev (reconciliado)

**Data:** 17/11/2026 · **Status:** rascunho para confirmação do Marcos — NÃO é spec congelada e NÃO autoriza construção.
**Fontes:** `Especificac_a_o_te_cnica_do_aplicativo.md` (spec técnica), `Especificac_a_o_da_intelige_ncia_artificial.md` (spec IA, §11 já traz um mapa), `Correc_o_es_e_melhorias.md` (camadas transversais), e a conversa de 17/11 no chat "Áreas da vida que o Loma cobre" (arquitetura confirmada em princípio + 2 ajustes do Mano).

## 1. Regras já acordadas (não se discutem aqui)

- 1 orquestrador central → 6 orquestradores por área → especialistas → skills por decisão recorrente. Nada de skill por módulo, nada de orquestrador por skill.
- **Jev só para escolha finita** (módulo dono, categoria, pessoa, conta/cartão, duplicata sim/não, prioridade, alertar ou não, vincular à meta ou não, confirmar ação). **Nunca** para cálculo determinístico (saldo, fatura, dose, data, soma, juros, parcela, projeção de aposentadoria) nem para recomendação aberta com evidência (diagnóstico, plano, análise de humor, treino, análise de gastos) — ali a IA explica com os dados primeiro e o Jev só decide a ação final sugerida.
- **Ajuste 1 (Mano, 17/11): conector mora FORA do app.** Gmail, Calendar, banco, Spotify etc. são conectados no Muse de cada pessoa, não dentro do Loma — o orquestrador chama a camada de conectores, nunca guarda senha no banco do Loma.
- **Ajuste 2 (Mano, 17/11): dono único também vale para especialista.** Um módulo aparece num só lugar como dono; os outros só acessam por hiperlink. Isso resolve as duas duplicações abaixo.
- Toda ação importante permite desfazer; toda recomendação mostra evidências.

## 2. O mapa

Skills compartilhadas (valem para todos): escolher módulo dono · classificar entrada · detectar duplicata · criar hiperlink · extrair dados de recibo/documento · priorizar item da Home · definir responsável/data/horário · detectar pessoa/categoria/conta/cartão/valor/status · criar alerta/lembrete/tarefa · arquivar.

### Home / Seu Dia — orquestrador: Home

| Módulo | Especialista dono | Skills (além das compartilhadas) | Jev |
| --- | --- | --- | --- |
| Início (painel do dia, não é conteúdo) | Alertas | priorizar Home, criar alerta, criar hiperlink | Sim — priorizar, alertar ou não |
| Agenda & Aniversários | Agenda | criar compromisso, detectar conflito, sugerir melhor horário, criar lembrete | Sim — módulo dono, pessoa, duplicata |
| Hábitos | Rotina | criar hábito, detectar padrão de falha, sugerir ajuste de rotina | Sim — prioridade, criar tarefa ou não |
| Tarefas | Rotina | criar tarefa, priorizar, detectar prazo | Sim — prioridade |
| Alertas | Alertas | criar alerta, priorizar, detectar risco | Sim — alertar ou não |
| Busca | Apoio transversal | buscar, classificar, vincular | Sim — módulo dono |

### Bem-estar — orquestrador: Bem-estar

| Módulo | Especialista dono | Skills | Jev |
| --- | --- | --- | --- |
| Saúde | Saúde | classificar consulta, extrair dados de exame, detectar medicamento/alergia, sugerir acompanhamento | Sim — pessoa, categoria, duplicata. **Não** — dose e data (cálculo) |
| Corpo & Esporte | Corpo | sugerir treino, adaptar treino à limitação, interpretar progresso, detectar sinais de lesão | **Não** para a recomendação de treino (evidência primeiro). Sim só para a ação final |
| Cuidados | Saúde | criar rotina, detectar produto, sugerir autocuidado | Sim — categoria, prioridade |
| Humor | Emoções | classificar humor, detectar gatilho, relacionar humor e sono | **Não** para a análise. Sim só para a ação de autocuidado sugerida |
| Devocional | Espiritual | criar leitura, criar reflexão, criar meta espiritual | Sim — meta, prática |
| Espiritualidade | Espiritual | criar prática, criar meta, detectar comunidade | Sim — meta, prática |
| Alimentação & Cozinha | Corpo | criar refeição, sugerir lista, detectar restrição | Sim — categoria, lista |

### Casa & Família — orquestrador: Casa & Família

| Módulo | Especialista dono | Skills | Jev |
| --- | --- | --- | --- |
| Casa | Casa & Consumo | criar tarefa, detectar manutenção, sugerir compra | Sim — categoria, prioridade |
| Filhos | Família | identificar filho, criar compromisso/gasto/documento do filho | Sim — pessoa, categoria |
| Pessoas da casa | Família | identificar pessoa, definir responsável, definir permissão | Sim — pessoa, responsável |
| Relacionamentos | Família | identificar pessoa, detectar aniversário, sugerir contato | Sim — pessoa |
| Mercado | Casa & Consumo | criar item, detectar despensa, sugerir lista, categorizar compra | Sim — categoria, duplicata |
| Compras | Casa & Consumo | criar desejo, comparar preço, detectar garantia | Sim — categoria, prioridade |
| Pet | Casa & Consumo | criar consulta, detectar vacina, criar gasto | Sim — pessoa (pet), categoria |
| Veículos | Casa & Consumo | criar manutenção, detectar abastecimento, detectar documento | Sim — categoria |
| Patrimônio | Patrimônio & Segurança | criar bem, detectar garantia, detectar valorização | Sim — categoria |
| Segurança | Patrimônio & Segurança | criar contato de emergência, detectar risco, criar plano | Sim — alertar ou não |

### Finanças — orquestrador próprio (mini-app)

| Módulo | Especialista dono | Skills | Jev |
| --- | --- | --- | --- |
| Resumo | Dia a Dia | consolidar dados, detectar alerta, priorizar insight | Sim — priorizar insight |
| Orçamento | Dia a Dia | categorizar lançamento, detectar receita/despesa, criar previsão | Sim — categoria, conta/cartão |
| Contas | Dia a Dia | classificar conta, detectar saldo, detectar transferência | Sim — conta. **Não** — saldo (cálculo) |
| Cartões | Dia a Dia | detectar fatura, parcela, juros | Sim — cartão, categoria. **Não** — valores da fatura (cálculo) |
| Metas | Patrimônio | criar meta, detectar progresso, detectar conflito | Sim — vincular à meta ou não |
| Investir | Patrimônio | classificar ativo, detectar aporte, criar projeção | Sim — classificar ativo. **Não** — projeção/rentabilidade (cálculo) |
| Proteção | Patrimônio | detectar seguro, detectar risco, criar alerta | Sim — categoria, alertar ou não |
| Consultor | Consultor | diagnosticar, criar plano, simular, explicar insight | **Não** para diagnóstico/plano (evidência primeiro). Sim só para a ação final |

**Os 18 de Finanças (leitura reconciliada — confirmar):** 8 módulos acima + 10 submódulos dentro de Investir = **18**: Carteira, Aportes e resgates, Rentabilidade, Alocação, Liquidez, Previdência, Aposentadoria, Projeção até os 100 anos, Liberdade financeira, Mercado. Os 10 itens dentro de Mercado (Dólar, Euro, Iene, Bitcoin, Selic, CDI, IPCA, Ibovespa, Ações favoritas, FIIs favoritos) são **indicadores, não módulos** — e só aparecem na Home quando relevantes para aquela pessoa.

### Crescer — orquestrador: Crescer

| Módulo | Especialista dono | Skills | Jev |
| --- | --- | --- | --- |
| Trabalho | Trabalho | classificar projeto, criar proposta, detectar cliente/prazo | Sim — categoria, cliente |
| Estudos | Aprendizado | criar meta de estudo, criar resumo, sugerir revisão, detectar certificado | Sim — categoria |
| Livros | Aprendizado | classificar livro, criar resenha, extrair citação | Sim — categoria |
| Projetos | Trabalho | criar projeto, criar tarefa, detectar prazo | Sim — categoria, prioridade |
| Viagens | Vida & Cultura | criar viagem, criar roteiro, detectar reserva/documento necessário, criar checklist | Sim — categoria, duplicata |
| Documentos | Aprendizado | extrair documento, classificar documento, criar alerta | Sim — categoria, pessoa |
| Filmes & Séries | Vida & Cultura | classificar conteúdo, criar watchlist, sugerir recomendação | Sim — categoria |
| Música | Vida & Cultura | classificar música, criar playlist, detectar memória | Sim — categoria |

### Apoio transversal (não são módulos de conteúdo)

Personalizar e Log do sistema usam só skills compartilhadas. **Pessoas da casa aparece aqui no anexo de Apoio e também em Casa & Família — resolvido pelo Ajuste 2: o dono é Casa & Família (especialista Família); em Apoio ela só aparece como link no menu lateral.** O mesmo vale para Documentos: dono é Crescer (Aprendizado); Saúde, Filhos, Veículos etc. só linkam.

## 3. Camadas transversais (embaixo dos orquestradores, não viram especialista nem skill)

| Camada | O que cobre |
| --- | --- |
| Conectores | Gmail, Google Calendar, banco/Open Finance, cartões, corretoras, mercado/câmbio/cripto, governo, notas fiscais, armazenamento — **fora do app, no Muse de cada pessoa** |
| Dados externos | Dólar, Euro, Iene, Bitcoin, Selic, CDI, IPCA, Ibovespa, ações e FIIs — dentro de Investir → Mercado; na Home só se relevantes |
| Memória e contexto | Perfil, família, metas, hábitos, históricos financeiro e de saúde, preferências, evidências dos insights |
| Permissões e segurança | Controle de acesso, confirmação de ações, privacidade, criptografia, auditoria, revogação |
| Educação (Aprender) | Guias, cursos, PDFs, vídeos, checklists e trilhas **dentro de cada módulo** |
| Glossário | Transversal, prioridade Finanças (Selic, CDI, IPCA, CDB, FII, reserva, etc. — explicação simples + exemplo + onde aparece + erro comum + ação) |
| Favoritos | Qualquer coisa pode ser favoritada: módulo, meta, pessoa, documento, transação, investimento, indicador |
| Menu lateral (círculo/avatar no topo) | Perfil, Pessoas da casa, Favoritos, Aprender, Glossário, Conectores, Notificações, Personalizar, Privacidade e segurança, Backup, Ajuda, Suporte, Log — sem substituir as abas |
| Ajuda e onboarding | Tutoriais, perguntas frequentes, suporte, feedback |

## 4. Divergências encontradas — decidir antes de congelar

1. **Contagem 28 vs 41.** O Marcos falou em 28 módulos; somando as listas das specs dá **41 módulos distintos** (Home 6 + Bem-estar 7 + Casa 10 + Finanças 8 + Crescer 8 + Personalizar e Log) — 42 entradas contando "Pessoas da casa" duplicada. Pergunta: 28 era aproximado e valem os 41, ou 28 é o teto e 13 precisam ser fundidos/cortados (e quais)?
Era aproximação… muita coisa para contar
2. **Especialistas 14 vs 16.** A spec de IA lista 16 especialistas (§5); o anexo de correções lista 14 (faltam Espiritual e Alertas). Confirmar se Espiritual e Alertas existem como especialistas próprios.
Espiritual terá um especialista e alertas, acho que será skill
3. **Finanças 18.** A leitura 8 + 10 de Investir fecha a conta — confirmar se é essa a contagem dele.
não sei ao certo… calma, é muita coisa.
4. **Notas.** Aparece na spec de IA (§7, sem skill própria) e no Roadmap Fase 1, mas **não** está na estrutura §7 da spec técnica. Incluir como módulo ou tratar como função compartilhada?
Pode ter um módulo, mas será compartilhado. por exemplo: em todo lugar que puder fazer anotações as anotações vão ficar lá mas também podem vir para cá para este módulo específico assim eu consigo visualizar todas as anotações que eu já fiz, por exemplo em devocional hoje tem um campo onde eu posso fazer uma anotação lá, mas digamos que em treinos eu queira fazer também...
5. **Sono e energia.** Aparece como skill do especialista Emoções, mas não é módulo em nenhuma lista — confirmar que fica como sub-item de Humor/Corpo, sem módulo próprio.
Sim
6. **Decisão pendente e separada (não incluída neste mapa):** a spec técnica apaga o botão central Lançar, muda as abas para Home / Bem-estar / Casa / Finanças / Crescer e troca as fontes para DM Serif + Plus Jakarta — isso revoga 3 decisões atuais do Loma e ainda não foi confirmado como substituição. Não construir a partir dela até o Marcos confirmar.
pode apagar
7. **Não confundir:** a "Fase 5 — Inteligência conectada" do roadmap da expansão é outra coisa que a "Fase 5 — Card Skill em Mais" do Finanças 360°, que só começa com o ok dele.
Esquece a Fase 5

> Esclarecimento do Marcos (18/11/2026, 11:42): a Fase 5 — Inteligência Conectada SIM, ele quer que rode nos Espaços. O 'Esquece a Fase 5' acima não vale para ela.

## 5. Próximo passo

Depois que ele responder os itens 1–5 (e o 6, quando quiser), o mapa vira spec congelada — e só então qualquer construção da expansão começa, seguindo o padrão grilling → spec → ok dele → build.