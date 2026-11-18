```markdown
# Especificação técnica do aplicativo

## 1. Visão do produto

O aplicativo é um organizador de vida pessoal e familiar, com inteligência artificial integrada. Ele reúne rotina, saúde, casa, família, finanças, trabalho, estudos, lazer, documentos e planos em um único sistema.

O objetivo é que cada informação tenha um lugar definido, sem duplicação, e que os módulos conversem entre si por hiperlinks internos.

A experiência é mobile-first, modular e calma. O usuário abre a Home para ver o que exige atenção hoje e navega por cinco áreas principais: Home, Bem-estar, Casa, Finanças e Crescer.

## 2. Princípios de produto

- Cada área da vida tem um módulo próprio.
- Cada módulo tem uma página própria.
- Cada módulo pode conter submódulos, listas, gráficos, metas, documentos e insights.
- Os módulos são expansíveis no menu.
- Cada cartão do menu pode abrir sua página completa.
- Cada página de módulo possui botão de retorno para o menu.
- Os hiperlinks internos funcionam como conexões entre módulos.
- A inteligência artificial organiza, classifica, sugere e explica.
- A IA deve mostrar evidências antes de recomendar uma ação.
- Nenhum dado deve existir em dois módulos como fonte primária.
- Um dado pode aparecer em outros módulos por hiperlink.
- A Home mostra apenas o que é urgente, importante ou recorrente.
- A navegação deve ter no máximo três níveis de profundidade.
- A barra inferior deve ter cinco abas fixas.
- Não haverá botão central fixo de “Lançar”.
- A criação de registros acontece dentro do módulo correspondente.

## 3. Navegação principal

```text
APP
│
├── HOME
│
├── BEM-ESTAR
│
├── CASA
│
├── FINANÇAS
│
├── CRESCER
│
└── APOIO
```

A barra inferior terá cinco abas fixas:

```text
[ Home ] [ Bem-estar ] [ Casa ] [ Finanças ] [ Crescer ]
```

Não haverá botão central de ação.

A criação de novos registros será feita por um botão “+” no canto superior direito de cada módulo.

Exemplos:

```text
Saúde          [+]
Filhos         [+]
Finanças       [+]
Projetos       [+]
```

## 4. Regras de navegação

```text
1 toque  → abre a aba
2 toques → abre o módulo
3 toques → abre o submódulo ou detalhe
```

Exemplo:

```text
Home
└── Filhos
    └── Saúde do filho
        └── Consulta no dentista
```

Se o compromisso já estiver na Home:

```text
Home
└── Consulta no dentista — terça
    └── Detalhe do compromisso
        └── Filhos
```

## 5. Regras de dados

Cada informação tem um módulo dono.

O módulo dono é onde o dado é criado, editado e armazenado.

Outros módulos podem exibir o dado por hiperlink, mas não duplicam sua fonte.

Exemplo:

```text
Filhos
└── Consulta no dentista
    ├── Aparece na Home
    ├── Aparece na Agenda
    ├── Gera registro em Saúde
    ├── Pode gerar gasto em Finanças
    └── Pode gerar documento em Documentos
```

Exemplo:

```text
Estudos
└── Estudar inglês
    ├── Aparece na Home
    ├── Aparece em Hábitos
    ├── Pode gerar anotação em Notas
    ├── Pode gerar gasto em Finanças
    └── Pode ser vinculado a um curso
```

## 6. Estrutura completa do aplicativo

```text
APP
│
├── HOME
│   ├── Início
│   │   ├── Compromissos dos próximos 14 dias
│   │   ├── Contas a pagar
│   │   ├── Hábitos de hoje
│   │   ├── Tarefas prioritárias
│   │   ├── Alertas importantes
│   │   └── Atalhos personalizados
│   │
│   ├── Agenda & Aniversários
│   │   ├── Compromissos
│   │   ├── Próximos 14 dias
│   │   ├── Aniversários
│   │   ├── Eventos
│   │   ├── Lembretes
│   │   └── Calendário familiar
│   │
│   ├── Hábitos
│   │   ├── Hábitos diários
│   │   ├── Hábitos semanais
│   │   ├── Rotina da manhã
│   │   ├── Rotina da noite
│   │   ├── Streaks
│   │   └── Estatísticas
│   │
│   ├── Tarefas
│   │   ├── Hoje
│   │   ├── Esta semana
│   │   ├── Pendentes
│   │   ├── Em andamento
│   │   ├── Concluídas
│   │   ├── Atrasadas
│   │   └── Por área da vida
│   │
│   ├── Alertas
│   │   ├── Financeiros
│   │   ├── Saúde
│   │   ├── Casa
│   │   ├── Filhos
│   │   ├── Trabalho
│   │   ├── Documentos
│   │   ├── Viagens
│   │   ├── Aniversários
│   │   ├── Hábitos
│   │   └── Segurança
│   │
│   └── Busca
│       ├── Buscar módulos
│       ├── Buscar pessoas
│       ├── Buscar tarefas
│       ├── Buscar compromissos
│       ├── Buscar transações
│       ├── Buscar documentos
│       ├── Buscar notas
│       ├── Buscar livros
│       ├── Buscar receitas
│       ├── Buscar medicamentos
│       ├── Buscar lugares
│       └── Buscar históricos
│
├── BEM-ESTAR
│   ├── Saúde
│   │   ├── Perfil de saúde
│   │   ├── Consultas
│   │   ├── Exames
│   │   ├── Medicamentos
│   │   ├── Alergias
│   │   ├── Condições crônicas
│   │   ├── Vacinas
│   │   ├── Histórico médico
│   │   ├── Receitas médicas
│   │   ├── Documentos de saúde
│   │   ├── Peso e medidas
│   │   ├── Pressão arterial
│   │   ├── Glicemia
│   │   ├── Sono
│   │   ├── Hidratação
│   │   └── Insights de saúde
│   │
│   ├── Corpo & Esporte
│   │   ├── Perfil físico
│   │   ├── Treinos
│   │   ├── Planilhas de treino
│   │   ├── Academia
│   │   ├── Corrida
│   │   ├── Caminhada
│   │   ├── Natação
│   │   ├── Futebol
│   │   ├── Ciclismo
│   │   ├── Medidas e progresso
│   │   ├── Peso e composição
│   │   ├── Sono e recuperação
│   │   ├── Hidratação
│   │   ├── Lesões e limitações
│   │   ├── Metas físicas
│   │   ├── Histórico de treinos
│   │   └── Insights de performance
│   │
│   ├── Cuidados
│   │   ├── Rotina de cuidados
│   │   ├── Pele
│   │   ├── Corpo
│   │   ├── Cabelo
│   │   ├── Unhas
│   │   ├── Sono e descanso
│   │   ├── Bem-estar emocional
│   │   ├── Consultas e autocuidado
│   │   ├── Produtos e tratamentos
│   │   ├── Rotinas de beleza
│   │   ├── Histórico de cuidados
│   │   └── Insights de autocuidado
│   │
│   ├── Humor
│   │   ├── Registro diário
│   │   ├── Estados emocionais
│   │   ├── Gatilhos
│   │   ├── Energia
│   │   ├── Sono
│   │   ├── Padrões recorrentes
│   │   ├── Reflexões
│   │   ├── Histórico emocional
│   │   └── Insights emocionais
│   │
│   ├── Devocional
│   │   ├── Leitura diária
│   │   ├── Oração
│   │   ├── Reflexões
│   │   ├── Versículos salvos
│   │   ├── Estudos bíblicos
│   │   ├── Metas espirituais
│   │   ├── Histórico e progresso
│   │   └── Anotações
│   │
│   ├── Espiritualidade
│   │   ├── Perfil espiritual
│   │   ├── Leitura bíblica
│   │   ├── Oração
│   │   ├── Jejum
│   │   ├── Gratidão
│   │   ├── Comunidade e igreja
│   │   ├── Práticas espirituais
│   │   ├── Metas espirituais
│   │   ├── Histórico espiritual
│   │   └── Insights espirituais
│   │
│   └── Alimentação & Cozinha
│       ├── Planejamento semanal
│       ├── Refeições
│       ├── Café da manhã
│       ├── Almoço
│       ├── Jantar
│       ├── Lanches
│       ├── Receitas
│       ├── Receitas favoritas
│       ├── Lista de compras
│       ├── Despensa
│       ├── Validade de alimentos
│       ├── Dieta
│       ├── Metas nutricionais
│       ├── Água e hidratação
│       ├── Restrições alimentares
│       ├── Histórico alimentar
│       └── Insights alimentares
│
├── CASA
│   ├── Casa
│   │   ├── Rotina da casa
│   │   ├── Tarefas domésticas
│   │   ├── Limpeza
│   │   ├── Organização
│   │   ├── Manutenção
│   │   ├── Reparos
│   │   ├── Contas da casa
│   │   ├── Móveis
│   │   ├── Eletrodomésticos
│   │   ├── Compras da casa
│   │   ├── Despesas compartilhadas
│   │   ├── Histórico da casa
│   │   └── Insights da casa
│   │
│   ├── Filhos
│   │   ├── Perfil de cada filho
│   │   ├── Saúde e vacinas
│   │   ├── Consultas
│   │   ├── Dentista
│   │   ├── Escola
│   │   ├── Turma e professores
│   │   ├── Tarefas escolares
│   │   ├── Reuniões escolares
│   │   ├── Atividades e cursos
│   │   ├── Rotina e tarefas
│   │   ├── Sono
│   │   ├── Mesada
│   │   ├── Poupança do filho
│   │   ├── Roupas e itens
│   │   ├── Documentos
│   │   ├── Marcos e memórias
│   │   ├── Fotos e conquistas
│   │   └── Insights de desenvolvimento
│   │
│   │   ├── Saúde do filho
│   │   │   ├── Consultas
│   │   │   ├── Vacinas
│   │   │   ├── Dentista
│   │   │   ├── Medicamentos
│   │   │   ├── Alergias
│   │   │   ├── Exames
│   │   │   └── Histórico médico
│   │   │
│   │   │   └── Consulta no dentista
│   │   │       ├── Data e horário
│   │   │       ├── Dentista
│   │   │       ├── Local
│   │   │       ├── Motivo
│   │   │       ├── Valor
│   │   │       ├── Status
│   │   │       ├── Documentos
│   │   │       └── Histórico
│   │
│   ├── Pessoas da casa
│   │   ├── Membros
│   │   ├── Perfis
│   │   ├── Responsabilidades
│   │   ├── Permissões
│   │   ├── Configurações familiares
│   │   ├── Divisão de tarefas
│   │   ├── Divisão de despesas
│   │   ├── Histórico familiar
│   │   └── Insights da família
│   │
│   ├── Relacionamentos
│   │   ├── Pessoas importantes
│   │   ├── Família
│   │   ├── Amigos
│   │   ├── Colegas
│   │   ├── Rede profissional
│   │   ├── Aniversários
│   │   ├── Datas especiais
│   │   ├── Último contato
│   │   ├── Próxima ação
│   │   ├── Presentes
│   │   ├── Preferências
│   │   ├── Encontros
│   │   ├── Histórico de interações
│   │   └── Insights de vínculos
│   │
│   ├── Mercado
│   │   ├── Lista de compras
│   │   ├── Compras realizadas
│   │   ├── Categorias
│   │   ├── Produtos
│   │   ├── Preços
│   │   ├── Comparação de preços
│   │   ├── Estoque doméstico
│   │   ├── Validade
│   │   ├── Recorrências de compra
│   │   ├── Compras por pessoa
│   │   ├── Compras por categoria
│   │   ├── Histórico de compras
│   │   └── Insights de consumo
│   │
│   ├── Compras
│   │   ├── Lista de desejos
│   │   ├── Pesquisas de preço
│   │   ├── Prioridade
│   │   ├── Necessidade versus desejo
│   │   ├── Orçamento de compra
│   │   ├── Compras realizadas
│   │   ├── Notas fiscais
│   │   ├── Garantias
│   │   ├── Devoluções
│   │   ├── Histórico de compras
│   │   └── Insights de consumo
│   │
│   ├── Pet
│   │   ├── Perfil do pet
│   │   ├── Saúde
│   │   ├── Vacinas
│   │   ├── Consultas
│   │   ├── Veterinário
│   │   ├── Medicamentos
│   │   ├── Alimentação
│   │   ├── Ração
│   │   ├── Banho
│   │   ├── Tosa
│   │   ├── Passeios
│   │   ├── Gastos
│   │   ├── Documentos
│   │   ├── Memórias e fotos
│   │   └── Insights do pet
│   │
│   ├── Veículos
│   │   ├── Veículos
│   │   ├── Carro
│   │   ├── Moto
│   │   ├── Bicicleta
│   │   ├── Documentos
│   │   ├── Licenciamento
│   │   ├── IPVA
│   │   ├── Seguro
│   │   ├── Manutenção
│   │   ├── Revisões
│   │   ├── Combustível
│   │   ├── Recargas
│   │   ├── Gastos
│   │   ├── Viagens
│   │   ├── Histórico de manutenção
│   │   └── Insights de custo
│   │
│   ├── Patrimônio
│   │   ├── Imóveis
│   │   ├── Móveis
│   │   ├── Eletrodomésticos
│   │   ├── Equipamentos
│   │   ├── Objetos de valor
│   │   ├── Manutenção
│   │   ├── Reparos
│   │   ├── Garantias
│   │   ├── Seguro residencial
│   │   ├── Valorização
│   │   ├── Avaliação
│   │   ├── Gastos e melhorias
│   │   ├── Histórico patrimonial
│   │   └── Insights patrimoniais
│   │
│   └── Segurança
│       ├── Contatos de emergência
│       ├── Plano familiar
│       ├── Senhas e acessos
│       ├── Seguros
│       ├── Documentos críticos
│       ├── Kit de emergência
│       ├── Contatos médicos
│       ├── Contatos de confiança
│       ├── Plano de evacuação
│       ├── Histórico de incidentes
│       └── Insights de proteção
│
├── FINANÇAS
│   ├── Resumo
│   │   ├── Patrimônio líquido
│   │   ├── Saldo disponível
│   │   ├── Entradas do mês
│   │   ├── Saídas do mês
│   │   ├── Contas próximas
│   │   ├── Progresso das metas
│   │   ├── Alertas financeiros
│   │   ├── Gráfico de fluxo do mês
│   │   ├── Gráfico de patrimônio
│   │   ├── Comparativo mensal
│   │   ├── Comparativo anual
│   │   └── Insights financeiros
│   │
│   ├── Orçamento
│   │   ├── Receitas
│   │   ├── Salário
│   │   ├── Freela
│   │   ├── Aluguéis
│   │   ├── Dividendos
│   │   ├── Reembolsos
│   │   ├── Renda extra
│   │   ├── Despesas
│   │   ├── Despesas fixas
│   │   ├── Despesas variáveis
│   │   ├── Parcelas
│   │   ├── Categorias
│   │   ├── Moradia
│   │   ├── Mercado
│   │   ├── Transporte
│   │   ├── Lazer
│   │   ├── Saúde
│   │   ├── Educação
│   │   ├── Orçado versus realizado
│   │   ├── Envelope do mês
│   │   ├── Contas a pagar
│   │   ├── Contas a receber
│   │   ├── Assinaturas
│   │   ├── Recorrências
│   │   ├── Fluxo de caixa
│   │   ├── Previsão do mês
│   │   ├── Comparativo mensal
│   │   └── Insights de orçamento
│   │
│   ├── Contas
│   │   ├── Conta corrente
│   │   ├── Poupança
│   │   ├── Carteiras digitais
│   │   ├── Dinheiro em espécie
│   │   ├── Contas conjuntas
│   │   ├── Contas de investimento
│   │   ├── Saldo atual
│   │   ├── Saldo previsto
│   │   ├── Histórico de saldo
│   │   ├── Conciliação
│   │   ├── Lançamentos importados
│   │   ├── Transferências
│   │   └── Insights de liquidez
│   │
│   ├── Cartões
│   │   ├── Cartões de crédito
│   │   ├── Faturas
│   │   ├── Parcelamentos
│   │   ├── Empréstimos
│   │   ├── Financiamentos
│   │   ├── Rotativo
│   │   ├── Cheque especial
│   │   ├── Consórcios
│   │   ├── Juros
│   │   ├── IOF
│   │   ├── Taxas
│   │   ├── Prazo
│   │   ├── Estratégia de quitação
│   │   ├── Histórico de dívidas
│   │   └── Insights de crédito
│   │
│   ├── Metas
│   │   ├── Reserva de emergência
│   │   ├── Viagem
│   │   ├── Carro
│   │   ├── Casa
│   │   ├── Educação
│   │   ├── Reforma
│   │   ├── Aposentadoria
│   │   ├── Liberdade financeira
│   │   ├── Valor-alvo
│   │   ├── Prazo
│   │   ├── Aporte mensal
│   │   ├── Aporte extra
│   │   ├── Progresso
│   │   ├── Previsão de conclusão
│   │   ├── Prioridade
│   │   ├── Responsáveis
│   │   ├── Histórico de metas
│   │   └── Insights de metas
│   │
│   ├── Investir
│   │   ├── Carteira
│   │   ├── Tesouro
│   │   ├── CDB
│   │   ├── LCI
│   │   ├── LCA
│   │   ├── Fundos
│   │   ├── Ações
│   │   ├── FIIs
│   │   ├── Cripto
│   │   ├── Previdência
│   │   ├── Imóveis
│   │   ├── Aportes
│   │   ├── Resgates
│   │   ├── Rentabilidade
│   │   ├── Proventos
│   │   ├── Dividendos
│   │   ├── Impostos
│   │   ├── Alocação
│   │   ├── Risco
│   │   ├── Liquidez
│   │   ├── Aposentadoria
│   │   ├── Projeção até os 100 anos
│   │   ├── Liberdade financeira
│   │   └── Insights de investimentos
│   │
│   ├── Proteção
│   │   ├── Seguro de vida
│   │   ├── Plano de saúde
│   │   ├── Seguro residencial
│   │   ├── Seguro de veículo
│   │   ├── Seguro de viagem
│   │   ├── Previdência
│   │   ├── Reserva de emergência
│   │   ├── Riscos familiares
│   │   ├── Dependentes
│   │   ├── Beneficiários
│   │   ├── Cobertura
│   │   ├── Prêmio
│   │   ├── Vigência
│   │   ├── Renovação
│   │   ├── Impostos
│   │   ├── Obrigações
│   │   ├── Histórico de proteção
│   │   └── Insights de proteção
│   │
│   └── Consultor
│       ├── Diagnóstico financeiro
│       ├── Prioridades
│       ├── Plano de 30 dias
│       ├── Plano de 90 dias
│       ├── Plano de 365 dias
│       ├── Simulações
│       ├── Cenários
│       ├── Explicação dos insights
│       ├── Evidências dos insights
│       ├── Histórico de decisões
│       ├── Plano versus realidade
│       └── Insights financeiros
│
├── CRESCER
│   ├── Trabalho
│   │   ├── Perfil profissional
│   │   ├── Áreas de atuação
│   │   ├── Habilidades
│   │   ├── Portfólio
│   │   ├── Projetos profissionais
│   │   ├── Clientes
│   │   ├── Contatos profissionais
│   │   ├── Propostas
│   │   ├── Orçamentos
│   │   ├── Contratos
│   │   ├── Reuniões
│   │   ├── Entrevistas
│   │   ├── Tarefas
│   │   ├── Prazos
│   │   ├── Renda
│   │   ├── Pagamentos
│   │   ├── Metas de renda
│   │   ├── Desenvolvimento profissional
│   │   ├── Histórico profissional
│   │   └── Insights de carreira
│   │
│   ├── Estudos
│   │   ├── Perfil de aprendizado
│   │   ├── Idiomas
│   │   ├── Inglês
│   │   ├── Cursos
│   │   ├── Aulas
│   │   ├── Aulas particulares
│   │   ├── Matérias
│   │   ├── Resumos
│   │   ├── Revisões
│   │   ├── Flashcards
│   │   ├── Certificados
│   │   ├── Metas de estudo
│   │   ├── Histórico de estudos
│   │   └── Insights de progresso
│   │
│   ├── Livros
│   │   ├── Lendo agora
│   │   ├── Quero ler
│   │   ├── Lidos
│   │   ├── Resenhas
│   │   ├── Notas
│   │   ├── Citações
│   │   ├── Metas de leitura
│   │   ├── Estantes
│   │   ├── Coleções
│   │   ├── Autores
│   │   ├── Gêneros
│   │   ├── Histórico de leitura
│   │   └── Insights de leitura
│   │
│   ├── Projetos
│   │   ├── Projetos ativos
│   │   ├── Ideias
│   │   ├── Backlog
│   │   ├── Tarefas
│   │   ├── Prazos
│   │   ├── Marcos
│   │   ├── Progresso
│   │   ├── Recursos
│   │   ├── Arquivos
│   │   ├── Pessoas envolvidas
│   │   ├── Custos
│   │   ├── Histórico de projetos
│   │   └── Insights de execução
│   │
│   ├── Viagens
│   │   ├── Próximas viagens
│   │   ├── Destinos
│   │   ├── Datas
│   │   ├── Roteiro
│   │   ├── Reservas
│   │   ├── Passagens
│   │   ├── Hospedagem
│   │   ├── Ingressos
│   │   ├── Transporte
│   │   ├── Documentos
│   │   ├── Vistos
│   │   ├── Seguro-viagem
│   │   ├── Orçamento
│   │   ├── Gastos
│   │   ├── Checklist de bagagem
│   │   ├── Memórias
│   │   ├── Fotos
│   │   ├── Histórico de viagens
│   │   └── Insights de viagem
│   │
│   ├── Documentos
│   │   ├── Documentos pessoais
│   │   ├── RG
│   │   ├── CPF
│   │   ├── CNH
│   │   ├── Passaporte
│   │   ├── Certidões
│   │   ├── Documentos dos filhos
│   │   ├── Contratos
│   │   ├── Renovações
│   │   ├── Garantias
│   │   ├── Impostos
│   │   ├── Obrigações
│   │   ├── Seguros
│   │   ├── Arquivos
│   │   ├── PDFs
│   │   ├── Comprovantes
│   │   ├── Histórico documental
│   │   └── Insights de organização
│   │
│   ├── Filmes & Séries
│   │   ├── Assistindo agora
│   │   ├── Quero assistir
│   │   ├── Assistidos
│   │   ├── Avaliações
│   │   ├── Watchlist
│   │   ├── Recomendações
│   │   ├── Gêneros
│   │   ├── Plataformas
│   │   ├── Histórico de assistidos
│   │   └── Insights de consumo cultural
│   │
│   └── Música
│       ├── Playlists
│       ├── Artistas favoritos
│       ├── Álbuns
│       ├── Músicas salvos
│       ├── Descobertas
│       ├── Memórias musicais
│       ├── Gêneros
│       ├── Plataformas
│       ├── Histórico de escuta
│       └── Insights musicais
│
└── APOIO
    ├── Pessoas da casa
    │   ├── Membros
    │   ├── Perfis
    │   ├── Responsabilidades
    │   ├── Permissões
    │   ├── Configurações familiares
    │   ├── Divisão de tarefas
    │   ├── Divisão de despesas
    │   ├── Histórico familiar
    │   └── Insights da família
    │
    ├── Personalizar
    │   ├── Tema
    │   ├── Modo claro
    │   ├── Modo escuro
    │   ├── Ordem dos módulos
    │   ├── Módulos visíveis
    │   ├── Módulos ocultos
    │   ├── Atalhos da Home
    │   ├── Notificações
    │   ├── Preferências
    │   ├── Idioma
    │   ├── Moeda
    │   ├── Fuso horário
    │   ├── Privacidade
    │   └── Backup
    │
    └── Log do sistema
        ├── Atividades
        ├── Sincronizações
        ├── Erros
        ├── Importações
        ├── Exportações
        ├── Histórico de alterações
        ├── Histórico de acessos
        ├── Histórico de integrações
        ├── Diagnóstico do sistema
        └── Configurações técnicas
```

## 7. Módulos do aplicativo

### 7.1 Home

A Home é o painel do dia.

Ela não é um módulo de conteúdo, mas uma tela que reúne informações de todos os módulos.

```text
HOME
├── Início
├── Agenda & Aniversários
├── Hábitos
├── Tarefas
├── Alertas
└── Busca
```

### 7.2 Bem-estar

```text
BEM-ESTAR
├── Saúde
├── Corpo & Esporte
├── Cuidados
├── Humor
├── Devocional
├── Espiritualidade
└── Alimentação & Cozinha
```

### 7.3 Casa

```text
CASA
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

### 7.4 Finanças

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

### 7.5 Crescer

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

### 7.6 Apoio

```text
APOIO
├── Pessoas da casa
├── Personalizar
└── Log do sistema
```

## 8. Estrutura de um módulo

Todo módulo deve seguir esta estrutura:

```text
MÓDULO
├── Cabeçalho
│   ├── Ícone
│   ├── Nome do módulo
│   ├── Descrição curta
│   ├── KPI principal
│   └── Botão “+”
│
├── Resumo
│   ├── Indicadores principais
│   ├── Gráfico principal
│   ├── Itens recentes
│   └── Insight da IA
│
├── Submódulos
│   ├── Submódulo 1
│   ├── Submódulo 2
│   ├── Submódulo 3
│   └── Submódulo N
│
├── Ações
│   ├── Adicionar
│   ├── Editar
│   ├── Filtrar
│   ├── Buscar
│   ├── Exportar
│   └── Compartilhar
│
├── Conexões
│   ├── Hiperlink para módulo relacionado 1
│   ├── Hiperlink para módulo relacionado 2
│   ├── Hiperlink para módulo relacionado 3
│   └── Hiperlink para módulo relacionado N
│
└── Rodapé
    ├── Histórico
    ├── Configurações
    └── Ajuda
```

## 9. Estrutura de um submódulo

Todo submódulo deve seguir esta estrutura:

```text
SUBMÓDULO
├── Cabeçalho
│   ├── Nome
│   ├── Descrição
│   ├── KPI principal
│   └── Botão “+”
│
├── Conteúdo
│   ├── Lista
│   ├── Filtros
│   ├── Gráficos
│   ├── Detalhes
│   └── Documentos
│
├── Ações
│   ├── Adicionar
│   ├── Editar
│   ├── Concluir
│   ├── Arquivar
│   ├── Excluir
│   └── Compartilhar
│
├── Conexões
│   ├── Hiperlink para módulo relacionado 1
│   ├── Hiperlink para módulo relacionado 2
│   └── Hiperlink para módulo relacionado N
│
└── IA
    ├── Insight
    ├── Evidências
    ├── Sugestão
    └── Ação recomendada
```

## 10. Inteligência artificial

A IA deve atuar em quatro níveis:

```text
IA
├── Organização
├── Classificação
├── Análise
└── Recomendação
```

### 10.1 Organização

A IA organiza informações recebidas por e-mail, mensagens do banco, recibos, fotos e entradas manuais.

Exemplos:

```text
E-mail do banco
└── Compra no cartão
    ├── Valor
    ├── Data
    ├── Estabelecimento
    ├── Categoria sugerida
    └── Conta relacionada
```

```text
E-mail de consulta
└── Consulta médica
    ├── Data
    ├── Local
    ├── Profissional
    ├── Módulo Saúde
    └── Módulo Agenda
```

### 10.2 Classificação

A IA classifica informações em categorias, pessoas, contas, projetos, metas e documentos.

Exemplo:

```text
Compra no iFood
├── Categoria: Alimentação fora de casa
├── Cartão: Cartão principal
├── Pessoa: Marcos
├── Centro de custo: Família
└── Módulo: Finanças
```

### 10.3 Análise

A IA analisa padrões, comparativos, riscos e oportunidades.

Exemplos:

```text
Padrão detectado
├── Gastos com delivery aumentaram 30%
├── Categoria: Lazer
├── Impacto no orçamento
├── Impacto nas metas
└── Impacto na aposentadoria
```

```text
Risco detectado
├── Reserva abaixo do ideal
├── Dívida de cartão alta
├── Dependência de uma única renda
└── Falta de seguro de vida
```

### 10.4 Recomendação

A IA recomenda ações apenas após analisar o contexto.

Exemplo:

```text
Insight
├── Você gastou R$ 780 em delivery nos últimos 30 dias
├── Isso equivale a R$ 130 do aporte da meta Viagem 2027
├── Se você reduzir R$ 400 por mês
├── Você pode aumentar o aporte da aposentadoria
└── Ação sugerida: revisar gastos de delivery
```

Toda recomendação deve mostrar:

```text
Recomendação
├── O que foi detectado
├── Por que importa
├── Quais dados foram usados
├── Qual módulo é afetado
├── Qual ação é sugerida
└── Qual é o impacto estimado
```

## 11. Hiperlinks internos

Os hiperlinks devem funcionar como conexões entre módulos.

Exemplo:

```text
Transação
├── Categoria
├── Conta
├── Cartão
├── Pessoa
├── Projeto
├── Meta
├── Documento
└── Insight
```

Exemplo:

```text
Consulta médica
├── Pessoa
├── Saúde
├── Agenda
├── Documento
├── Finanças
└── Família
```

Exemplo:

```text
Meta Viagem 2027
├── Finanças
├── Investir
├── Fluxo de caixa
├── Viagens
└── Consultor
```

## 12. Design system

O visual deve seguir o sistema Loma Editorial Design.

### 12.1 Cores

```text
Fundo principal: #FAF7F2
Superfície secundária: #F2ECE3
Card elevado: #FFFFFF
Ancora escura: #231B16
Espresso suave: #3A2E27
Texto primário: #231B16
Texto secundário: #6E6259
Texto suave: #9B8F85
Linha estrutural: #EAE2D6
Linha interativa: #DDD2C3
Rosa antigo: #C47882
Rosa hover: #B36670
Rosa suave: #F8ECEE
Verde saúde: #3B7A6B
Verde suave: #E9F3F0
Ocre mercado: #C27D38
Ocre suave: #FBF2E6
Azul casa: #5C6F82
Azul suave: #EDF1F5
Ameixa agenda: #8A6399
Ameixa suave: #F3EDF6
```

### 12.2 Tipografia

```text
Títulos e marca: DM Serif Display
Corpo e interface: Plus Jakarta Sans
Números, datas e valores: tabular-nums
```

### 12.3 Raios

```text
Checkbox: 7px
Ícones internos: 10px
Inputs e botões compactos: 12px
Linhas de lista e sub-blocos: 18px
Cards principais: 24px
Pílulas e botões principais: 9999px
```

### 12.4 Sombras

```text
Sombra xs: 0 2px 8px rgba(35, 27, 22, 0.04)
Sombra sm: 0 6px 20px rgba(35, 27, 22, 0.06)
Sombra md: 0 12px 32px rgba(35, 27, 22, 0.12)
Sombra do botão rosa: 0 8px 20px rgba(196, 120, 130, 0.32)
```

## 13. Medidas de interface

### 13.1 Barra inferior

```text
Altura: 72 a 80 dp
Número de abas: 5
Largura por aba: cerca de 20% da tela
Área de toque por aba: mínimo 48 x 48 dp
Ícone: 24 x 24 dp
Rótulo: 11 a 12 sp
Espaço entre ícone e rótulo: 4 dp
```

### 13.2 Botões

```text
Botão principal: altura mínima 48 dp
Botão secundário: altura mínima 40 dp
Botão de ação flutuante: 56 x 56 dp
Ícone dentro do botão flutuante: 24 x 24 dp
Raio dos botões: 9999 px
```

### 13.3 Cartões

```text
Padding interno: 16 dp
Raio dos cartões: 20 a 24 dp
Espaço entre cartões: 12 a 16 dp
Largura máxima do app: 540 px
```

## 14. Roadmap

### Fase 1 — Fundação

```text
FASE 1
├── Home
├── Agenda & Aniversários
├── Hábitos
├── Tarefas
├── Notas
├── Finanças
│   ├── Resumo
│   ├── Orçamento
│   ├── Contas
│   ├── Cartões
│   ├── Metas
│   ├── Investir
│   ├── Proteção
│   └── Consultor
├── Pessoas da casa
├── Personalizar
└── Log do sistema
```

Objetivo: provar que o app organiza rotina, compromissos e dinheiro.

### Fase 2 — Corpo e mente

```text
FASE 2
├── Saúde
├── Corpo & Esporte
├── Cuidados
├── Humor
├── Devocional
├── Espiritualidade
└── Alimentação & Cozinha
```

Objetivo: ativar a aba Bem-estar.

### Fase 3 — Casa e família

```text
FASE 3
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

Objetivo: ativar a aba Casa.

### Fase 4 — Crescimento e futuro

```text
FASE 4
├── Trabalho
├── Estudos
├── Livros
├── Projetos
├── Viagens
├── Documentos
├── Filmes & Séries
└── Música
```

Objetivo: ativar a aba Crescer.

### Fase 5 — Inteligência conectada

```text
FASE 5
├── IA transversal
│   ├── Insights entre módulos
│   ├── Alertas inteligentes
│   ├── Sugestões de ação
│   ├── Detecção de padrões
│   └── Consultor de vida
│
├── Automações
│   ├── Importação de e-mails
│   ├── Detecção de compras
│   ├── Detecção de receitas
│   ├── Criação automática de tarefas
│   └── Lembretes inteligentes
│
└── Relatórios de vida
    ├── Saúde
    ├── Casa
    ├── Finanças
    ├── Crescimento
    └── Visão 360°
```

Objetivo: a IA passa a conectar tudo e sugerir ações com contexto.

## 15. Regras finais

- A Home mostra o que exige atenção hoje.
- Cada módulo tem uma página própria.
- Cada submódulo tem conteúdo próprio.
- Cada dado tem um módulo dono.
- Outros módulos podem exibir o dado por hiperlink.
- A IA explica antes de recomendar.
- A IA mostra evidências.
- A navegação tem no máximo três níveis.
- A barra inferior tem cinco abas.
- Não há botão central de “Lançar”.
- A criação acontece dentro do módulo correspondente.
- O visual segue o sistema Loma Editorial Design.
- O app é mobile-first.
- O app deve permanecer calmo, organizado e modular.
