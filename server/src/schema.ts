import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Pessoas da Casa (membros da família fictícia)
export const people = sqliteTable("people", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(), // Pai, Mãe, Filha, Filho, Pet, etc.
  avatarColor: text("avatar_color").notNull(), // Hex color for avatar tag
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Agenda & Aniversários (próximos 14 dias e eventos familiares)
export const agendaEvents = sqliteTable("agenda_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time"), // HH:mm
  personId: integer("person_id").references(() => people.id),
  category: text("category").notNull().default("Geral"), // Saúde, Escola, Família, Casa, Trabalho
  isBirthday: integer("is_birthday").notNull().default(0),
  status: text("status").notNull().default("pendente"), // pendente, concluido
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Hábitos & Rotina
export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  period: text("period").notNull(), // manha, tarde, noite, dia
  streak: integer("streak").notNull().default(0),
  completedToday: integer("completed_today").notNull().default(0),
  personId: integer("person_id").references(() => people.id),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Histórico de conclusão de hábitos
export const habitLogs = sqliteTable("habit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id),
  date: text("date").notNull(), // YYYY-MM-DD
  completed: integer("completed").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Tarefas da vida
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  area: text("area").notNull().default("Rotina"), // Rotina, Finanças, Casa, Trabalho, Saúde
  priority: text("priority").notNull().default("media"), // alta, media, baixa
  dueDate: text("due_date"), // YYYY-MM-DD
  completed: integer("completed").notNull().default(0),
  personId: integer("person_id").references(() => people.id),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Notas Compartilhadas / Agregador Central
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  moduleOrigin: text("module_origin").notNull().default("Geral"), // Geral, Devocional, Treinos, Finanças, Casa
  recordId: integer("record_id"), // ID opcional do registro no módulo de origem
  tags: text("tags").notNull().default(""), // separado por vírgula
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Finanças — Contas bancárias e dinheiro
export const financeAccounts = sqliteTable("finance_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull().default("corrente"), // corrente, poupanca, carteira, especie
  institution: text("institution").notNull(), // Nubank, Itaú, Banco do Brasil, Espécie
  balance: integer("balance").notNull().default(0), // em centavos (ex: 150000 = R$ 1.500,00)
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Finanças — Cartões de Crédito
export const financeCards = sqliteTable("finance_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  brand: text("brand").notNull().default("Mastercard"),
  limitTotal: integer("limit_total").notNull().default(0), // em centavos
  limitUsed: integer("limit_used").notNull().default(0), // em centavos
  closingDay: integer("closing_day").notNull().default(25),
  dueDay: integer("due_day").notNull().default(5),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Finanças — Transações (Receitas e Despesas do Orçamento)
export const financeTransactions = sqliteTable("finance_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // centavos (positivo = receita, negativo = despesa)
  type: text("type").notNull(), // receita, despesa, transferencia
  category: text("category").notNull(), // Moradia, Mercado, Saúde, Transporte, Lazer, Educação, Renda, etc.
  date: text("date").notNull(), // YYYY-MM-DD
  status: text("status").notNull().default("pago"), // pago, pendente
  accountId: integer("account_id").references(() => financeAccounts.id),
  cardId: integer("card_id").references(() => financeCards.id),
  personId: integer("person_id").references(() => people.id),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Finanças — Metas Financeiras (Reserva, Objetivos)
export const financeGoals = sqliteTable("finance_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  targetAmount: integer("target_amount").notNull(), // centavos
  currentAmount: integer("current_amount").notNull().default(0), // centavos
  targetDate: text("target_date"), // YYYY-MM-DD
  category: text("category").notNull().default("Reserva"), // Reserva, Viagem, Casa, Carro, Educação
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Finanças — Investimentos (Carteira e Alocação Inicial)
export const financeInvestments = sqliteTable("finance_investments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // Renda Fixa, Ações, FIIs, Cripto, Previdência
  amount: integer("amount").notNull(), // centavos
  institution: text("institution").notNull().default("Corretora"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Logs do Sistema e Auditoria
export const systemLogs = sqliteTable("system_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  details: text("details").notNull(),
  area: text("area").notNull().default("Geral"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ==========================================
// FASE 2: BEM-ESTAR & SAÚDE
// ==========================================

// Saúde: Consultas, Exames, Medicamentos, Vacinas, Sinais Vitais
export const healthRecords = sqliteTable("health_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type").notNull().default("consulta"), // consulta, exame, medicamento, vacina, sinal_vital
  personId: integer("person_id").references(() => people.id),
  date: text("date").notNull(), // YYYY-MM-DD
  doctorOrClinic: text("doctor_or_clinic"),
  details: text("details"),
  status: text("status").notNull().default("pendente"), // pendente, realizado, ativo
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Corpo & Esporte: Treinos, Atividades Físicas, Desempenho
export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("musculacao"), // musculacao, corrida, caminhada, natacao, ciclismo
  personId: integer("person_id").references(() => people.id),
  date: text("date").notNull(), // YYYY-MM-DD
  durationMinutes: integer("duration_minutes").notNull().default(30),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Cuidados & Autocuidado: Pele, Cabelo, Corpo, Unhas
export const careRoutines = sqliteTable("care_routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("pele"), // pele, cabelo, corpo, unhas, descanso
  personId: integer("person_id").references(() => people.id),
  frequency: text("frequency").notNull().default("diario"), // diario, semanal, mensal
  completed: integer("completed").notNull().default(0),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Humor, Sono & Energia (Sub-item unificado de Humor/Corpo)
export const moodLogs = sqliteTable("mood_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  personId: integer("person_id").references(() => people.id),
  date: text("date").notNull(), // YYYY-MM-DD
  mood: text("mood").notNull().default("calmo"), // radiante, calmo, cansado, ansioso, desafiador
  energyLevel: integer("energy_level").notNull().default(3), // 1 a 5
  sleepHours: integer("sleep_hours").notNull().default(8),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Devocional & Espiritualidade
export const devotionals = sqliteTable("devotionals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  passageOrVerse: text("passage_or_verse"),
  reflection: text("reflection"),
  type: text("type").notNull().default("leitura"), // leitura, oracao, gratidao, meta_espiritual
  personId: integer("person_id").references(() => people.id),
  date: text("date").notNull(), // YYYY-MM-DD
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Alimentação & Cozinha: Cardápio semanal, receitas e hábitos alimentares
export const mealPlans = sqliteTable("meal_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  mealType: text("meal_type").notNull().default("almoco"), // cafe, almoco, jantar, lanche
  dayOfWeek: text("day_of_week").notNull().default("segunda"), // segunda a domingo
  recipeOrIngredients: text("recipe_or_ingredients"),
  isFavorite: integer("is_favorite").notNull().default(0),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ==========================================
// FASE 3: CASA E FAMÍLIA
// ==========================================

// Casa: Manutenções, reparos e rotinas domésticas
export const homeMaintenances = sqliteTable("home_maintenances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  room: text("room").notNull().default("Geral"), // Sala, Cozinha, Quarto, Banheiro, Quintal, Geral
  dueDate: text("due_date"), // YYYY-MM-DD
  costCents: integer("cost_cents").notNull().default(0),
  priority: text("priority").notNull().default("media"), // alta, media, baixa
  status: text("status").notNull().default("pendente"), // pendente, concluido
  personId: integer("person_id").references(() => people.id),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Filhos: Rotinas pedagógicas, escolares e atividades
export const childrenRoutines = sqliteTable("children_routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  childPersonId: integer("child_person_id").references(() => people.id),
  title: text("title").notNull(),
  category: text("category").notNull().default("escola"), // escola, atividade, saude, pedagogico
  date: text("date").notNull(), // YYYY-MM-DD
  notes: text("notes"),
  status: text("status").notNull().default("pendente"), // pendente, concluido
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relacionamentos & Família Estendida: Parentes, amigos e datas especiais
export const relationships = sqliteTable("relationships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(), // Avós, Tios, Padrinhos, Amigos
  birthday: text("birthday"), // YYYY-MM-DD
  phone: text("phone"),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Mercado: Itens de supermercado e despensa
export const groceries = sqliteTable("groceries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull().default("despensa"), // hortifruti, laticinios, despensa, limpeza, higiene, bebidas
  quantity: text("quantity").notNull().default("1"),
  unit: text("unit").notNull().default("un"), // un, kg, g, l, pct
  isPurchased: integer("is_purchased").notNull().default(0), // 0: na lista, 1: no carrinho/comprado
  isEssential: integer("is_essential").notNull().default(0), // item recorrente de despensa
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Compras & Desejos: Lista de desejos da família
export const wishlistItems = sqliteTable("wishlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("casa"), // casa, tecnologia, pessoal, criancas
  estimatedCostCents: integer("estimated_cost_cents").notNull().default(0),
  priority: text("priority").notNull().default("media"), // alta, media, baixa
  status: text("status").notNull().default("desejo"), // desejo, planejado, comprado
  linkOrStore: text("link_or_store"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Pets da família
export const pets = sqliteTable("pets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  species: text("species").notNull().default("Cachorro"), // Cachorro, Gato, Pássaro, etc.
  breed: text("breed"),
  birthDate: text("birth_date"),
  avatarColor: text("avatar_color").notNull().default("#9E6123"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Cuidados com Pets: Vacinas, banhos, veterinário
export const petCareRecords = sqliteTable("pet_care_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  petId: integer("pet_id").references(() => pets.id),
  title: text("title").notNull(),
  type: text("type").notNull().default("consulta"), // vacina, consulta, banho, vermifugo, antipulgas
  date: text("date").notNull(), // YYYY-MM-DD
  status: text("status").notNull().default("pendente"), // pendente, realizado
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Veículos da Família
export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  model: text("model").notNull(),
  brand: text("brand").notNull(),
  year: integer("year").notNull().default(2022),
  licensePlate: text("license_plate"),
  mileage: integer("mileage").notNull().default(0),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Manutenções e Despesas de Veículos
export const vehicleMaintenances = sqliteTable("vehicle_maintenances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  title: text("title").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  costCents: integer("cost_cents").notNull().default(0),
  nextDueMileage: integer("next_due_mileage"),
  status: text("status").notNull().default("concluido"), // pendente, concluido
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Patrimônio Material: Bens, eletros, móveis e garantias
export const propertyAssets = sqliteTable("property_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull().default("eletrodomestico"), // imovel, eletrodomestico, eletronico, mobilia, outro
  estimatedValueCents: integer("estimated_value_cents").notNull().default(0),
  purchaseDate: text("purchase_date"), // YYYY-MM-DD
  warrantyUntil: text("warranty_until"), // YYYY-MM-DD
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Segurança & Emergência: Contatos e telefones essenciais
export const emergencyContacts = sqliteTable("emergency_contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  roleOrRelation: text("role_or_relation").notNull(), // SAMU, Bombeiros, Pediatra, Chaveiro, Vizinho, Eletricista
  phone: text("phone").notNull(),
  addressOrDetails: text("address_or_details"),
  priorityOrder: integer("priority_order").notNull().default(1),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================================================
// FASE 4 — CRESCER & FUTURO (Trabalho, Estudos, Livros, Projetos, Viagens,
// Documentos, Filmes & Séries, Música)
// ============================================================================

// 1. Trabalho: Projetos profissionais, clientes, contratos e desenvolvimento
export const workProjects = sqliteTable("work_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  clientOrCompany: text("client_or_company"),
  area: text("area").notNull().default("Desenvolvimento"), // Desenvolvimento, Consultoria, Design, Gestao
  status: text("status").notNull().default("em_andamento"), // proposta, em_andamento, concluido
  feeCents: integer("fee_cents").notNull().default(0),
  deadline: text("deadline"), // YYYY-MM-DD
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 2. Estudos: Cursos, idiomas, matérias e certificações
export const studyCourses = sqliteTable("study_courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  platformOrInstitution: text("platform_or_institution"),
  category: text("category").notNull().default("tecnologia"), // idiomas, tecnologia, negocios, espiritual, pessoal
  progressPercent: integer("progress_percent").notNull().default(0),
  totalHours: integer("total_hours").notNull().default(0),
  completedHours: integer("completed_hours").notNull().default(0),
  status: text("status").notNull().default("em_andamento"), // em_andamento, concluido, pausado
  certificateUrl: text("certificate_url"),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 3. Livros: Leituras atuais, lidos, quero ler, resenhas e citações
export const readingBooks = sqliteTable("reading_books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull().default("desenvolvimento"), // desenvolvimento, espiritualidade, negocios, biografia, ficcao
  status: text("status").notNull().default("lendo"), // lendo, lido, quero_ler
  rating: integer("rating").default(5), // 1 a 5
  currentPage: integer("current_page").notNull().default(0),
  totalPages: integer("total_pages").notNull().default(0),
  reviewOrNotes: text("review_or_notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 4. Projetos: Projetos autorais e pessoais, metas e marcos
export const personalProjects = sqliteTable("personal_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("autoral"), // autoral, tecnologia, casa, criativo, familia
  status: text("status").notNull().default("em_andamento"), // ideia, em_andamento, concluido
  progressPercent: integer("progress_percent").notNull().default(0),
  deadline: text("deadline"), // YYYY-MM-DD
  nextMilestone: text("next_milestone"),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 5. Viagens: Destinos, datas, roteiros, reservas e checklists
export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(), // YYYY-MM-DD
  endDate: text("end_date").notNull(), // YYYY-MM-DD
  status: text("status").notNull().default("planejada"), // planejada, confirmada, realizada
  budgetEstimatedCents: integer("budget_estimated_cents").notNull().default(0),
  accommodation: text("accommodation"),
  checklistItems: text("checklist_items"), // itens separados por vírgula ou JSON
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 6. Documentos: Registro, validade e renovação de documentos pessoais
export const personalDocuments = sqliteTable("personal_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  personName: text("person_name").notNull().default("Marcos"),
  category: text("category").notNull().default("identidade"), // identidade, viagem, habilitacao, contrato, saude
  documentNumber: text("document_number"),
  expirationDate: text("expiration_date"), // YYYY-MM-DD
  renewalAlert: integer("renewal_alert").notNull().default(1),
  notes: text("notes"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 7. Filmes & Séries: Cultura, watchlist familiar e avaliações
export const culturalMedia = sqliteTable("cultural_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type").notNull().default("filme"), // filme, serie, documentario
  platform: text("platform").notNull().default("Netflix"), // Netflix, Apple TV+, Cinema, HBO Max, Prime
  status: text("status").notNull().default("assistindo"), // assistindo, quero_assistir, assistido
  rating: integer("rating").default(5), // 1 a 5
  genre: text("genre"),
  recommendedBy: text("recommended_by"),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 8. Música: Playlists, álbuns e momentos (foco, calma, louvor, família)
export const musicTracks = sqliteTable("music_tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artistOrCurator: text("artist_or_curator").notNull(),
  momentOrMood: text("moment_or_mood").notNull().default("foco"), // foco, calma, louvor, familia, treino
  playlistOrAlbum: text("playlist_or_album"),
  platform: text("platform").notNull().default("Spotify"),
  isFavorite: integer("is_favorite").notNull().default(1),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ==========================================
// FASE 5: INTELIGÊNCIA CONECTADA & ALERTAS
// ==========================================

export const smartAlerts = sqliteTable("smart_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  area: text("area").notNull().default("Geral"), // saude, casa, financas, crescer, geral
  severity: text("severity").notNull().default("aviso"), // info, aviso, urgente
  actionLabel: text("action_label"), // ex: "Criar Tarefa", "Ver Detalhes"
  actionType: text("action_type"), // create_task, navigate_tab
  actionPayload: text("action_payload"), // payload or destination
  isDismissed: integer("is_dismissed").notNull().default(0),
  isDemo: integer("is_demo").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

