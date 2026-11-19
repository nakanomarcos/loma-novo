# ESPEC — Gráficos do Loma Novo

> Linguagem única de gráficos para o app inteiro, juntando as duas referências do Marcos:
> o **Real × Meta dos Hábitos do Loma atual** e a **barra de progresso com marca da meta do Dashplan**.
> São 4 padrões. Nada fora deles sem listar antes no relatório de verificação.
> Biblioteca: **Recharts**. Cores: só a paleta oficial do Loma. Números sempre `tabular-nums`.
> Regra de ouro: sem dados, o gráfico **não aparece** (nunca escrever "sem valor" na tela).

Paleta dos gráficos: coral `#E8836B` · coral forte `#CF6248` · sálvia `#7D8C6F` · dourado `#C79A3B` · violeta `#653259` · vinho `#7E354F` · cacau `#2E2019` · trilha (fundo da barra) `#E7DBC6` · texto suave `#7A675A`.

---

## Padrão 1 — Real × Meta (do Loma atual, Hábitos)

Comparação direta entre o que foi feito e o que era a meta, um item por linha.

- Uma linha por item: nome à esquerda, barra horizontal do **Real**, e a **Meta** como marca (ver Padrão 2) ou segunda barra fina logo abaixo, em tom neutro.
- No fim da linha, os dois números escritos: `Real 4 × Meta 5` (formato do Loma atual).
- Uso: Hábitos (dias feitos × meta da semana), Orçamento por categoria (gasto × teto), Investir > Alocação (atual × alvo), Treinos (sessões × meta).

## Padrão 2 — Progresso com Marca da Meta (do Dashplan) ⭐ o principal de leitura rápida

Uma barra só, para bater o olho e saber se está dentro do esperado.

- Trilha `#E7DBC6`, altura 8px, cantos redondos.
- Preenchimento = **Real**, com a **porcentagem concluída escrita** à direita da barra (ex.: `68%`).
- **Marca da meta:** um traço vertical de 2px em cacau `#2E2019` posicionado onde a meta/ritmo esperado está (ex.: no orçamento, o % do mês já decorrido; numa meta de economia, o valor-alvo), com o rótulo `Meta` em 10px acima ou abaixo do traço.
- Leitura por cor do preenchimento: **passou da marca → sálvia** `#7D8C6F`; **abaixo da marca → coral** `#E8836B`; **estourou o teto** (despesa acima do limite) → coral forte `#CF6248`.
- Abaixo da barra, em 13px suave: `Real R$ 1.360 · Meta R$ 2.000` (só os números que importam).
- Uso: Metas de Finanças, limite dos Cartões, Orçamento do mês, Plano de gastos por categoria, qualquer "quanto já fiz do que devia".

## Padrão 3 — Donut de composição

- Donut com o **total no centro** (ex.: patrimônio, total do mês) e legenda ao lado com nome + % de cada fatia, nas cores da paleta, no máximo 6 fatias (o resto vira "Outros").
- Uso: Investir (alocação por classe de ativo), Orçamento (despesas por categoria), Patrimônio (onde o dinheiro está).

## Padrão 4 — Série no tempo

- **Barras pareadas por mês:** receita (sálvia) × despesa (coral), últimos 6 meses, valor no toque/tooltip.
- **Área de evolução:** patrimônio ao longo do tempo em violeta `#653259` com preenchimento em degradê suave até transparente.
- Uso: Finanças > Visão Geral (os dois), Investir > Rentabilidade (área), Humor & Sono (linha simples dos últimos dias, se houver dados).

---

## Onde cada padrão entra

| Tela | Padrão |
| --- | --- |
| Finanças > Visão Geral | Série (barras receita × despesa) + Série (área do patrimônio) |
| Finanças > Orçamento (mês) | Progresso com Marca (ritmo do mês) |
| Finanças > Orçamento (categorias) | Real × Meta por categoria + Donut do mês |
| Finanças > Cartões | Progresso com Marca (limite usado × limite) |
| Finanças > Metas | Progresso com Marca (acumulado × alvo) |
| Finanças > Investir | Donut de alocação + Real × Meta (alocação atual × alvo) + Área de evolução |
| Home > Hábitos / Bem-estar > Hábitos | Real × Meta da semana (igual ao Loma atual) |
| Bem-estar > Humor & Sono | Série simples (linha), só com dados |

## Aceite

- Prints de cada gráfico novo no `RELATORIO-VERIFICACAO.md`, com dados de exemplo suficientes para o gráfico aparecer de verdade (barra com marca visível, donut com 3+ fatias).
- Nenhum gráfico inventado fora destes 4 padrões sem listar antes.
