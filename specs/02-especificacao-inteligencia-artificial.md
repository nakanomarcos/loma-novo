```markdown
# Especificação da inteligência artificial

## 1. Princípio central

A IA não será organizada como uma skill por módulo.

Será organizada em três camadas:

```text
IA DO APP
│
├── Orquestrador central
│
├── Orquestradores por área
│
└── Skills por decisão recorrente
```

A regra é:

- Um orquestrador central entende a pessoa e decide o caminho.
- Um orquestrador por área coordena os módulos daquela área.
- Especialistas operam conjuntos de módulos relacionados.
- Skills executam decisões recorrentes e específicas.
- Módulos simples não precisam de skill própria; eles usam skills compartilhadas.

## 2. Por que não usar uma skill por módulo

Se cada módulo tivesse uma skill própria, o app teria:

```text
28 módulos
+ 18 submódulos de Finanças
= 46 skills
```

Isso causaria problemas:

- Duplicação de decisões.
- Conflito entre módulos.
- Consumo desnecessário de contexto.
- Dificuldade de manutenção.
- Falta de coordenação entre áreas.

Exemplo:

```text
Consulta no dentista do filho
├── Filhos
├── Saúde
├── Agenda
├── Finanças
└── Documentos
```

Uma única skill por módulo não resolveria a conexão entre essas áreas.

A solução é um orquestrador central que entende a intenção e aciona os especialistas corretos.

## 3. Camada 1 — Orquestrador central

O orquestrador central é a porta de entrada da IA.

Ele recebe:

```text
Entrada do usuário
├── Texto
├── E-mail
├── Foto
├── Recibo
├── Mensagem do banco
├── Comando de voz
└── Ação manual
```

Ele decide:

```text
Orquestrador central
├── Qual área está envolvida
├── Qual módulo é o dono da informação
├── Quais módulos devem ser conectados
├── Se precisa pedir informação ao usuário
├── Se pode agir automaticamente
├── Se deve ignorar a entrada
└── Qual especialista deve ser acionado
```

### Regra de confiança

```text
Score alto
└── Executa a ação
    └── Mostra resumo
        └── Oferece desfazer

Score baixo
└── Faz uma pergunta curta
    └── Confirma antes de agir

Score nulo
└── Ignora em silêncio
```

### Exemplo

```text
Entrada: “Levei meu filho ao dentista hoje, custou R$ 180.”
│
└── Orquestrador central
    ├── Detecta: Filhos
    ├── Detecta: Saúde
    ├── Detecta: Finanças
    ├── Detecta: Agenda
    ├── Cria compromisso concluído
    ├── Cria registro de consulta
    ├── Cria despesa de saúde
    ├── Vincula ao filho
    └── Mostra resumo com desfazer
```

## 4. Camada 2 — Orquestradores por área

Serão seis orquestradores por área.

```text
ORQUESTRADORES
│
├── Home / Seu Dia
├── Bem-estar
├── Casa & Família
├── Finanças
├── Crescer
└── Apoio transversal
```

### 4.1 Home / Seu Dia

```text
HOME / SEU DIA
├── Agenda & Aniversários
├── Hábitos
├── Tarefas
├── Alertas
└── Busca
```

Função:

- Entender compromissos.
- Criar tarefas.
- Criar lembretes.
- Priorizar a Home.
- Detectar conflitos de agenda.
- Sugerir rotinas.

### 4.2 Bem-estar

```text
BEM-ESTAR
├── Saúde
├── Corpo & Esporte
├── Cuidados
├── Humor
├── Alimentação & Cozinha
└── Devocional / Espiritualidade
```

Função:

- Organizar consultas e exames.
- Interpretar registros de humor.
- Sugerir treinos.
- Respeitar limitações físicas.
- Organizar alimentação.
- Apoiar práticas espirituais.

### 4.3 Casa & Família

```text
CASA & FAMÍLIA
├── Casa
├── Filhos
├── Pessoas da casa
├── Relacionamentos
├── Mercado
├── Compras
├── Pet
├── Veículos
├── Patrimônio
└── Segurança
```

Função:

- Organizar rotina doméstica.
- Gerenciar filhos.
- Detectar itens de mercado.
- Organizar compras.
- Gerenciar pets.
- Organizar veículos.
- Proteger documentos e segurança.

### 4.4 Finanças

Finanças é um caso à parte.

Ela é um mini-app dentro do app e possui orquestrador próprio.

```text
FINANÇAS
├── Resumo
├── Orçamento
├── Contas
├── Cartões
├── Metas
├── Investir
├── Proteção
└── Consultor
```

### 4.5 Crescer

```text
CRESCER
├── Trabalho
├── Estudos
├── Livros
├── Projetos
├── Viagens
├── Documentos
├── Filmes & Séries
└── Música
```

Função:

- Organizar trabalho e renda.
- Criar planos de estudo.
- Organizar leituras.
- Gerenciar projetos.
- Planejar viagens.
- Organizar documentos.
- Recomendar conteúdos.

### 4.6 Apoio transversal

```text
APOIO TRANSVERSAL
├── Pessoas da casa
├── Personalizar
└── Log do sistema
```

Função:

- Gerenciar perfis.
- Controlar permissões.
- Personalizar módulos.
- Registrar atividades.
- Detectar erros.
- Organizar logs.

## 5. Especialistas por área

Dentro de cada área, existem especialistas.

Um especialista opera vários módulos relacionados.

### 5.1 Especialistas da Home

```text
HOME / SEU DIA
├── Especialista Agenda
│   ├── Agenda & Aniversários
│   └── Compromissos
│
├── Especialista Rotina
│   ├── Hábitos
│   └── Tarefas
│
└── Especialista Alertas
    ├── Alertas
    └── Priorização da Home
```

### 5.2 Especialistas do Bem-estar

```text
BEM-ESTAR
├── Especialista Saúde
│   ├── Saúde
│   └── Cuidados
│
├── Especialista Corpo
│   ├── Corpo & Esporte
│   └── Alimentação & Cozinha
│
├── Especialista Emoções
│   ├── Humor
│   └── Sono e energia
│
└── Especialista Espiritual
    ├── Devocional
    └── Espiritualidade
```

### 5.3 Especialistas da Casa & Família

```text
CASA & FAMÍLIA
├── Especialista Família
│   ├── Filhos
│   ├── Pessoas da casa
│   └── Relacionamentos
│
├── Especialista Casa & Consumo
│   ├── Casa
│   ├── Mercado
│   ├── Compras
│   ├── Pet
│   └── Veículos
│
└── Especialista Patrimônio & Segurança
    ├── Patrimônio
    └── Segurança
```

### 5.4 Especialistas das Finanças

```text
FINANÇAS
├── Especialista Dia a Dia
│   ├── Resumo
│   ├── Orçamento
│   ├── Contas
│   └── Cartões
│
├── Especialista Patrimônio
│   ├── Metas
│   ├── Investir
│   └── Proteção
│
└── Especialista Consultor
    ├── Diagnóstico
    ├── Plano
    ├── Simulações
    └── Recomendações
```

### 5.5 Especialistas do Crescer

```text
CRESCER
├── Especialista Trabalho
│   ├── Trabalho
│   └── Projetos
│
├── Especialista Aprendizado
│   ├── Estudos
│   ├── Livros
│   └── Documentos
│
└── Especialista Vida & Cultura
    ├── Viagens
    ├── Filmes & Séries
    └── Música
```

## 6. Camada 3 — Skills

Skills são habilidades por decisão recorrente, não por tela.

Uma skill responde a uma pergunta objetiva ou executa uma tarefa específica.

### 6.1 Skills compartilhadas

Estas skills são usadas por todos os módulos.

```text
SKILLS COMPARTILHADAS
├── Escolher módulo dono
├── Classificar entrada
├── Detectar duplicata
├── Criar hiperlink entre módulos
├── Extrair dados de recibo
├── Extrair dados de documento
├── Priorizar item da Home
├── Definir responsável
├── Definir data e horário
├── Detectar pessoa relacionada
├── Detectar categoria
├── Detectar conta ou cartão
├── Detectar valor
├── Detectar status
├── Criar alerta
├── Criar lembrete
├── Criar tarefa
└── Arquivar item
```

### 6.2 Skills por especialista

```text
SKILLS POR ESPECIALISTA
│
├── Agenda
│   ├── Criar compromisso
│   ├── Detectar conflito de agenda
│   ├── Sugerir melhor horário
│   └── Criar lembrete
│
├── Rotina
│   ├── Criar hábito
│   ├── Criar tarefa
│   ├── Detectar padrão de falha
│   └── Sugerir ajuste de rotina
│
├── Saúde
│   ├── Classificar consulta
│   ├── Extrair dados de exame
│   ├── Detectar medicamento
│   ├── Detectar alergia
│   └── Sugerir acompanhamento
│
├── Corpo
│   ├── Sugerir treino
│   ├── Adaptar treino à limitação
│   ├── Interpretar progresso
│   └── Detectar sinais de lesão
│
├── Emoções
│   ├── Classificar humor
│   ├── Detectar gatilho
│   ├── Relacionar humor e sono
│   └── Sugerir autocuidado
│
├── Família
│   ├── Identificar filho
│   ├── Identificar responsável
│   ├── Criar compromisso do filho
│   ├── Criar gasto do filho
│   └── Criar documento do filho
│
├── Casa & Consumo
│   ├── Criar item de mercado
│   ├── Detectar item da despensa
│   ├── Sugerir lista de compras
│   ├── Classificar compra
│   ├── Detectar garantia
│   └── Sugerir manutenção
│
├── Finanças
│   ├── Categorizar lançamento
│   ├── Detectar receita
│   ├── Detectar despesa
│   ├── Detectar parcela
│   ├── Detectar assinatura
│   ├── Detectar duplicata
│   ├── Definir conta
│   ├── Definir cartão
│   ├── Detectar meta relacionada
│   ├── Detectar risco financeiro
│   ├── Criar simulação
│   └── Sugerir prioridade
│
├── Trabalho
│   ├── Classificar projeto
│   ├── Criar proposta
│   ├── Detectar cliente
│   ├── Criar tarefa profissional
│   └── Detectar prazo
│
├── Aprendizado
│   ├── Criar meta de estudo
│   ├── Criar resumo
│   ├── Sugerir revisão
│   └── Detectar certificado
│
└── Viagens
    ├── Criar viagem
    ├── Criar roteiro
    ├── Detectar reserva
    ├── Criar checklist
    └── Detectar documento necessário
```

## 7. Módulos sem skill própria

Módulos que são apenas listas, arquivos ou CRUD não precisam de skill exclusiva.

Eles usam skills compartilhadas.

```text
MÓDULOS SEM SKILL PRÓPRIA
├── Notas
├── Documentos
├── Música
├── Filmes & Séries
├── Livros
├── Pessoas da casa
├── Personalizar
└── Log do sistema
```

Exemplo:

```text
Nota
├── Usa skill: classificar entrada
├── Usa skill: escolher módulo dono
├── Usa skill: criar hiperlink
└── Usa skill: criar alerta
```

## 8. Uso do Jev

O Jev deve ser usado apenas onde existe uma escolha entre opções finitas.

```text
JEV
├── Escolher módulo dono
├── Escolher categoria
├── Escolher pessoa
├── Escolher conta
├── Escolher cartão
├── Detectar duplicata: sim ou não
├── Definir prioridade
├── Alertar ou não
├── Criar tarefa ou não
├── Vincular à meta ou não
└── Confirmar ação
```

O Jev não deve ser usado para cálculos determinísticos.

```text
NÃO USAR JEV PARA
├── Calcular saldo
├── Calcular fatura
├── Calcular dose
├── Calcular data
├── Calcular soma
├── Calcular juros
├── Calcular parcela
└── Calcular projeção de aposentadoria
```

O Jev também não deve ser usado para recomendações abertas com evidência.

```text
NÃO USAR JEV PARA
├── Diagnóstico financeiro
├── Plano de aposentadoria
├── Análise de humor
├── Recomendação de treino
├── Análise de gastos
└── Explicação de insight
```

Nesses casos, a IA explica com os dados primeiro.

Depois, o Jev pode decidir apenas a ação final sugerida.

```text
Consultor financeiro
├── IA analisa os dados
├── IA explica o diagnóstico
├── IA mostra evidências
├── IA propõe opções
└── Jev decide a ação final
```

## 9. Fluxo completo da IA

```text
ENTRADA DO USUÁRIO
│
├── Texto
├── E-mail
├── Foto
├── Recibo
├── Mensagem do banco
└── Comando de voz
│
└── ORQUESTRADOR CENTRAL
    ├── Entende a intenção
    ├── Detecta áreas envolvidas
    ├── Define módulo dono
    ├── Aplica regra de confiança
    ├── Escolhe orquestrador de área
    │
    ├── HOME / SEU DIA
    │   ├── Especialista Agenda
    │   ├── Especialista Rotina
    │   └── Especialista Alertas
    │
    ├── BEM-ESTAR
    │   ├── Especialista Saúde
    │   ├── Especialista Corpo
    │   ├── Especialista Emoções
    │   └── Especialista Espiritual
    │
    ├── CASA & FAMÍLIA
    │   ├── Especialista Família
    │   ├── Especialista Casa & Consumo
    │   └── Especialista Patrimônio & Segurança
    │
    ├── FINANÇAS
    │   ├── Especialista Dia a Dia
    │   ├── Especialista Patrimônio
    │   └── Especialista Consultor
    │
    ├── CRESCER
    │   ├── Especialista Trabalho
    │   ├── Especialista Aprendizado
    │   └── Especialista Vida & Cultura
    │
    └── APOIO TRANSVERSAL
        ├── Skills compartilhadas
        ├── Skills de classificação
        ├── Skills de extração
        └── Skills de vinculação
│
└── SKILLS
    ├── Escolher módulo dono
    ├── Classificar entrada
    ├── Detectar duplicata
    ├── Criar hiperlink
    ├── Extrair dados
    ├── Priorizar Home
    ├── Criar alerta
    ├── Criar tarefa
    └── Confirmar ação
│
└── RESPOSTA AO USUÁRIO
    ├── Ação executada
    ├── Resumo do que foi feito
    ├── Hiperlinks criados
    ├── Alertas criados
    ├── Opção de desfazer
    └── Próxima ação sugerida
```

## 10. Exemplo completo

```text
Entrada: “Levei meu filho ao dentista hoje, custou R$ 180.”
│
└── ORQUESTRADOR CENTRAL
    ├── Detecta: Filhos
    ├── Detecta: Saúde
    ├── Detecta: Agenda
    ├── Detecta: Finanças
    ├── Detecta: Documentos
    ├── Define módulo dono: Filhos
    ├── Score alto: executa
    │
    ├── ORQUESTRADOR CASA & FAMÍLIA
    │   ├── Especialista Família
    │   │   ├── Identifica filho
    │   │   ├── Cria compromisso concluído
    │   │   └── Cria registro de consulta
    │   │
    │   └── Especialista Casa & Consumo
    │       └── Não acionado
    │
    ├── ORQUESTRADOR BEM-ESTAR
    │   └── Especialista Saúde
    │       ├── Cria registro de consulta no dentista
    │       └── Vincula ao histórico de saúde do filho
    │
    ├── ORQUESTRADOR FINANÇAS
    │   └── Especialista Dia a Dia
    │       ├── Cria despesa de saúde
    │       ├── Valor: R$ 180
    │       ├── Categoria: Saúde
    │       ├── Pessoa: Filho
    │       └── Vincula ao orçamento
    │
    ├── ORQUESTRADOR HOME / SEU DIA
    │   └── Especialista Agenda
    │       ├── Cria compromisso concluído
    │       └── Remove da lista de próximos compromissos
    │
    └── SKILLS
        ├── Escolher módulo dono: Filhos
        ├── Detectar pessoa: Filho
        ├── Detectar categoria: Saúde
        ├── Detectar valor: R$ 180
        ├── Criar hiperlink: Filhos → Saúde
        ├── Criar hiperlink: Saúde → Finanças
        ├── Criar hiperlink: Agenda → Filhos
        └── Criar alerta: verificar recibo
│
└── RESPOSTA AO USUÁRIO
    ├── Consulta registrada para o filho
    ├── Compromisso marcado como concluído
    ├── Despesa de R$ 180 criada em Saúde
    ├── Registro vinculado ao histórico de saúde
    ├── Recibo pode ser anexado
    └── [Desfazer]
```

## 11. Mapa módulo → especialista → skills

```text
MÓDULOS
│
├── HOME
│   ├── Início
│   │   ├── Especialista: Alertas
│   │   └── Skills: priorizar Home, criar alerta, criar hiperlink
│   │
│   ├── Agenda & Aniversários
│   │   ├── Especialista: Agenda
│   │   └── Skills: criar compromisso, detectar conflito, criar lembrete
│   │
│   ├── Hábitos
│   │   ├── Especialista: Rotina
│   │   └── Skills: criar hábito, detectar padrão, sugerir ajuste
│   │
│   ├── Tarefas
│   │   ├── Especialista: Rotina
│   │   └── Skills: criar tarefa, priorizar, detectar prazo
│   │
│   ├── Alertas
│   │   ├── Especialista: Alertas
│   │   └── Skills: criar alerta, priorizar, detectar risco
│   │
│   └── Busca
│       ├── Especialista: Apoio transversal
│       └── Skills: buscar, classificar, vincular
│
├── BEM-ESTAR
│   ├── Saúde
│   │   ├── Especialista: Saúde
│   │   └── Skills: classificar consulta, extrair exame, detectar medicamento
│   │
│   ├── Corpo & Esporte
│   │   ├── Especialista: Corpo
│   │   └── Skills: sugerir treino, adaptar treino, detectar lesão
│   │
│   ├── Cuidados
│   │   ├── Especialista: Saúde
│   │   └── Skills: criar rotina, detectar produto, sugerir autocuidado
│   │
│   ├── Humor
│   │   ├── Especialista: Emoções
│   │   └── Skills: classificar humor, detectar gatilho, relacionar sono
│   │
│   ├── Devocional
│   │   ├── Especialista: Espiritual
│   │   └── Skills: criar leitura, criar reflexão, criar meta espiritual
│   │
│   ├── Espiritualidade
│   │   ├── Especialista: Espiritual
│   │   └── Skills: criar prática, criar meta, detectar comunidade
│   │
│   └── Alimentação & Cozinha
│       ├── Especialista: Corpo
│       └── Skills: criar refeição, sugerir lista, detectar restrição
│
├── CASA
│   ├── Casa
│   │   ├── Especialista: Casa & Consumo
│   │   └── Skills: criar tarefa, detectar manutenção, sugerir compra
│   │
│   ├── Filhos
│   │   ├── Especialista: Família
│   │   └── Skills: identificar filho, criar compromisso, criar gasto, criar documento
│   │
│   ├── Pessoas da casa
│   │   ├── Especialista: Família
│   │   └── Skills: identificar pessoa, definir responsável, definir permissão
│   │
│   ├── Relacionamentos
│   │   ├── Especialista: Família
│   │   └── Skills: identificar pessoa, detectar aniversário, sugerir contato
│   │
│   ├── Mercado
│   │   ├── Especialista: Casa & Consumo
│   │   └── Skills: criar item, detectar despensa, sugerir lista, categorizar compra
│   │
│   ├── Compras
│   │   ├── Especialista: Casa & Consumo
│   │   └── Skills: criar desejo, comparar preço, detectar garantia
│   │
│   ├── Pet
│   │   ├── Especialista: Casa & Consumo
│   │   └── Skills: criar consulta, detectar vacina, criar gasto
│   │
│   ├── Veículos
│   │   ├── Especialista: Casa & Consumo
│   │   └── Skills: criar manutenção, detectar abastecimento, detectar documento
│   │
│   ├── Patrimônio
│   │   ├── Especialista: Patrimônio & Segurança
│   │   └── Skills: criar bem, detectar garantia, detectar valorização
│   │
│   └── Segurança
│       ├── Especialista: Patrimônio & Segurança
│       └── Skills: criar contato de emergência, detectar risco, criar plano
│
├── FINANÇAS
│   ├── Resumo
│   │   ├── Especialista: Dia a Dia
│   │   └── Skills: consolidar dados, detectar alerta, priorizar insight
│   │
│   ├── Orçamento
│   │   ├── Especialista: Dia a Dia
│   │   └── Skills: categorizar lançamento, detectar receita, detectar despesa, criar previsão
│   │
│   ├── Contas
│   │   ├── Especialista: Dia a Dia
│   │   └── Skills: classificar conta, detectar saldo, detectar transferência
│   │
│   ├── Cartões
│   │   ├── Especialista: Dia a Dia
│   │   └── Skills: detectar fatura, detectar parcela, detectar juros
│   │
│   ├── Metas
│   │   ├── Especialista: Patrimônio
│   │   └── Skills: criar meta, detectar progresso, detectar conflito
│   │
│   ├── Investir
│   │   ├── Especialista: Patrimônio
│   │   └── Skills: classificar ativo, detectar aporte, criar projeção
│   │
│   ├── Proteção
│   │   ├── Especialista: Patrimônio
│   │   └── Skills: detectar seguro, detectar risco, criar alerta
│   │
│   └── Consultor
│       ├── Especialista: Consultor
│       └── Skills: diagnosticar, criar plano, simular, explicar insight
│
├── CRESCER
│   ├── Trabalho
│   │   ├── Especialista: Trabalho
│   │   └── Skills: classificar projeto, criar proposta, detectar cliente
│   │
│   ├── Estudos
│   │   ├── Especialista: Aprendizado
│   │   └── Skills: criar meta, criar resumo, sugerir revisão
│   │
│   ├── Livros
│   │   ├── Especialista: Aprendizado
│   │   └── Skills: classificar livro, criar resenha, extrair citação
│   │
│   ├── Projetos
│   │   ├── Especialista: Trabalho
│   │   └── Skills: criar projeto, criar tarefa, detectar prazo
│   │
│   ├── Viagens
│   │   ├── Especialista: Vida & Cultura
│   │   └── Skills: criar viagem, criar roteiro, detectar reserva
│   │
│   ├── Documentos
│   │   ├── Especialista: Aprendizado
│   │   └── Skills: extrair documento, classificar documento, criar alerta
│   │
│   ├── Filmes & Séries
│   │   ├── Especialista: Vida & Cultura
│   │   └── Skills: classificar conteúdo, criar watchlist, sugerir recomendação
│   │
│   └── Música
│       ├── Especialista: Vida & Cultura
│       └── Skills: classificar música, criar playlist, detectar memória
│
└── APOIO
    ├── Pessoas da casa
    │   ├── Especialista: Apoio transversal
    │   └── Skills: identificar pessoa, definir permissão, definir responsável
    │
    ├── Personalizar
    │   ├── Especialista: Apoio transversal
    │   └── Skills: personalizar módulos, definir atalhos, configurar notificações
    │
    └── Log do sistema
        ├── Especialista: Apoio transversal
        └── Skills: registrar atividade, detectar erro, diagnosticar sistema
```

## 12. Regras finais da IA

- Um orquestrador central para todo o app.
- Seis orquestradores por área.
- Especialistas dentro de cada área.
- Skills por decisão recorrente.
- Skills compartilhadas para tarefas comuns.
- Módulos simples usam skills compartilhadas.
- Finanças tem orquestrador próprio e três especialistas.
- O Jev é usado apenas para escolhas finitas.
- Cálculos são feitos por código determinístico.
- Recomendações abertas são explicadas pela IA com evidências.
- Toda ação importante deve permitir desfazer.
- Toda recomendação deve mostrar evidências.
- A IA deve conectar módulos, não duplicar informações.


