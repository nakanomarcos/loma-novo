# PADRONIZAÇÃO VISUAL — aplicar no projeto Loma JÁ EXISTENTE no Antigravity

> **Isto é uma ATUALIZAÇÃO do projeto que já está rodando. NÃO é um projeto novo.**
> Não recriar nada, não recomeçar, não apagar telas, módulos, dados, actions ou schema.
> Muda **só a camada visual** (cores, fontes e medidas dos cartões), para o app daqui ficar com a aparência do Loma atual dos Espaços. Todo o resto — as 5 fases já construídas, funções e dados de exemplo — fica exatamente como está.

## 1. Cores — trocar a paleta "Editorial" pela do Loma atual

Aplicar estes tokens no `theme.css` (são os valores reais do Loma atual):

```text
Fundo da página:        #FAF4E8  (creme quente)
Superfície do cartão:   #FFFDF8
Superfície morna:       #F3E9D7
Texto principal:        #2E2019
Texto suave (meta):     #7A675A
Borda / linha delicada: #E7DBC6
Destaque (coral):       #E8836B   ← substitui o rosa antigo #C47882 em todo o app
Destaque forte:         #CF6248
Cacau (cartão escuro):  #2E2019
Cacau suave:            #4A382C
Verde sálvia:           #7D8C6F
Dourado:                #C79A3B
Perigo:                 #B3402E
```

- Uma paleta só, padronizada no app inteiro — sem trocar a cor de destaque a cada área.
- **Cartão-herói (decisão do Marcos em 19/11, referência: página do Clube Divos da IA que ele anexou):** nada de marrom-espresso. O herói usa um **degradê vinho → roxo/violeta**, mais claro que o espresso e ainda assim bem diferente do fundo creme — o mesmo degradê padronizado na Home **e** nas visões gerais das áreas:

```text
Degradê do herói (linear, 135°):
  0%   #7E354F  (vinho — tinto contido, sem puxar pro vermelho vivo)
  55%  #653259  (vinho puxado pro roxo)
  100% #4C2B57  (violeta profundo)
Brilho suave no canto superior direito: #A85D7A com 20% de opacidade (radial)
Texto sobre o herói:        #FFF7EA (creme)
Texto secundário no herói:  creme com 75% de opacidade
Caixas de números no herói: branco com 10% de opacidade + borda branca com 12%
Números/destaques no herói: #F3C6D2 (rosa claro, como no anexo)
```

- O cacau `#2E2019` continua valendo para **texto** e para a marca — só não é mais fundo de herói.

## 2. Fontes — as do Loma atual

- Títulos e marca: **Fraunces** (serifada) — substitui a DM Serif Display.
- Corpo e interface: a sans atual do Loma (sem serifar texto corrido).
- Números, datas e valores: `tabular-nums`.

EMENDA ao item 2 (gráficos): os gráficos seguem a espec do arquivo ESPEC-GRAFICOS-LOMA.md que coloquei na raiz — 4 padrões apenas: (1) Real × Meta, como o dos Hábitos do Loma atual; (2) Progresso com Marca da Meta, como o do Dashplan (barra do Real com % concluída + traço vertical da meta, cor por situação); (3) Donut de composição; (4) Série no tempo. Aplicar a tabela "onde cada padrão entra" da espec, com Recharts e só a paleta oficial. Nenhum gráfico fora desses padrões sem listar antes no RELATORIO-VERIFICACAO.md.


## 3. Cartões — padrão do Loma atual, nas medidas reduzidas (já aprovadas pelo Marcos)

- Cada item é um **cartão individual empilhado** — nada de um cartão grande agrupando a lista inteira com linhas divisórias dentro.
- Cartão **expansível**: tocar abre o detalhe em sanfona, com Editar/Excluir dentro; concluir risca o título e manda o cartão apagado para o fim da lista.
- Raio **24px**, fundo `#FFFDF8`, linha delicada: sombra fina `0 1px 0 #E7DBC6`, sem sombra pesada.

| Medida | Valor |
| --- | ---: |
| Padding vertical do cartão de item | **12px** |
| Padding horizontal | 16px |
| Altura do cartão fechado | ≈62–64px |
| Espaço entre cartões | **8px** |
| Círculo de concluir | **32px** (área de toque ≥40px) |
| Título do item | 16px semibold |
| Linha meta | **13px / 18px** |
| Título de seção | **20px** (Fraunces) |
| Padding do cartão-herói | 16px |
| Botões | pílula, 44–48px de altura |

## 4. Aba lateral (Apoio) — cartões empilhados

- Remover o painel com abas internas (Visão 360° / Consultor IA / Pessoas / Backup).
- Como o menu "Mais" do Loma atual: cada entrada é um **cartão individual empilhado**, nas medidas da seção 3 (Visão 360°, Consultor IA, Pessoas da Casa, Personalizar, Dados & Backup, Log). Tocar no cartão abre a tela correspondente.

## 5. O que NÃO muda nesta padronização

- Nenhuma função, action, tabela, módulo ou dado — nem os de exemplo.
- Estrutura de arquivos continua a mesma (1 arquivo por área, sem fragmentar).

## 6. Aceite desta rodada

- `bun run typecheck` e `bun run build` verdes.
- Prints mobile (390px e 360px) das mesmas telas de antes — Home, uma lista de cada área e o Apoio — mostrando a paleta e os cartões novos, sem nada cortado.
- Registrar no `PROGRESSO.md`: "Padronização visual aplicada sobre o projeto existente (sem refazer): paleta e fontes do Loma atual + medidas reduzidas de cartões + Apoio em cartões empilhados."
- Parar e esperar o aceite do Marcos.
