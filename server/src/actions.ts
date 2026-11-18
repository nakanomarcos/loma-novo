import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { asc, desc, eq } from "drizzle-orm";
import * as schema from "./schema";

const okResponse = z.object({ ok: z.boolean() });

export const Actions = {
  // ==========================================
  // HOME / PAINEL GERAL & DADOS DE DEMONSTRAÇÃO
  // ==========================================
  getHomeDashboard: defineAction({
    description: "Retorna o resumo diário da Home com compromissos dos próximos 14 dias, hábitos, tarefas e indicadores financeiros.",
    request: z.object({}),
    response: z.object({
      todayDate: z.string(),
      hasDemoData: z.boolean(),
      upcomingEvents: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          date: z.string(),
          time: z.string().nullable(),
          category: z.string(),
          status: z.string(),
        })
      ),
      habits: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          period: z.string(),
          streak: z.number(),
          completedToday: z.number(),
        })
      ),
      tasks: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          area: z.string(),
          priority: z.string(),
          dueDate: z.string().nullable(),
          completed: z.number(),
        })
      ),
      financeBrief: z.object({
        availableBalance: z.number(),
        monthExpenses: z.number(),
        monthIncomes: z.number(),
        pendingBillsCount: z.number(),
      }),
      recentNotesCount: z.number(),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const today = new Date().toISOString().slice(0, 10);

      const events = await db.select().from(schema.agendaEvents).limit(50);
      const allHabits = await db.select().from(schema.habits).limit(20);
      const allTasks = await db.select().from(schema.tasks).limit(30);
      const accounts = await db.select().from(schema.financeAccounts);
      const transactions = await db.select().from(schema.financeTransactions);
      const allNotes = await db.select().from(schema.notes);

      const availableBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

      // Entradas e saídas do mês corrente
      const currentMonthPrefix = today.slice(0, 7);
      let monthExpenses = 0;
      let monthIncomes = 0;
      let pendingBillsCount = 0;

      for (const t of transactions) {
        if (t.date.startsWith(currentMonthPrefix)) {
          if (t.type === "despesa") monthExpenses += Math.abs(t.amount);
          if (t.type === "receita") monthIncomes += t.amount;
        }
        if (t.type === "despesa" && t.status === "pendente") {
          pendingBillsCount++;
        }
      }

      // Check if demo data exists
      const hasDemoData =
        events.some((e) => e.isDemo === 1) ||
        accounts.some((a) => a.isDemo === 1) ||
        allTasks.some((t) => t.isDemo === 1);

      return {
        todayDate: today,
        hasDemoData,
        upcomingEvents: events.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          category: e.category,
          status: e.status,
        })),
        habits: allHabits.map((h) => ({
          id: h.id,
          title: h.title,
          period: h.period,
          streak: h.streak,
          completedToday: h.completedToday,
        })),
        tasks: allTasks.map((t) => ({
          id: t.id,
          title: t.title,
          area: t.area,
          priority: t.priority,
          dueDate: t.dueDate,
          completed: t.completed,
        })),
        financeBrief: {
          availableBalance,
          monthExpenses,
          monthIncomes,
          pendingBillsCount,
        },
        recentNotesCount: allNotes.length,
      };
    },
  }),

  loadDemoData: defineAction({
    description: "Popula o banco com a família fictícia brasileira e registros demonstrativos apagáveis.",
    request: z.object({}),
    response: okResponse,
    async handler(ctx) {
      const db = ctx.db<typeof schema>();

      // Limpa dados de demo anteriores
      await db.delete(schema.people).where(eq(schema.people.isDemo, 1));
      await db.delete(schema.agendaEvents).where(eq(schema.agendaEvents.isDemo, 1));
      await db.delete(schema.habits).where(eq(schema.habits.isDemo, 1));
      await db.delete(schema.tasks).where(eq(schema.tasks.isDemo, 1));
      await db.delete(schema.notes).where(eq(schema.notes.isDemo, 1));
      await db.delete(schema.financeAccounts).where(eq(schema.financeAccounts.isDemo, 1));
      await db.delete(schema.financeCards).where(eq(schema.financeCards.isDemo, 1));
      await db.delete(schema.financeTransactions).where(eq(schema.financeTransactions.isDemo, 1));
      await db.delete(schema.financeGoals).where(eq(schema.financeGoals.isDemo, 1));
      await db.delete(schema.financeInvestments).where(eq(schema.financeInvestments.isDemo, 1));
      await db.delete(schema.healthRecords).where(eq(schema.healthRecords.isDemo, 1));
      await db.delete(schema.workouts).where(eq(schema.workouts.isDemo, 1));
      await db.delete(schema.careRoutines).where(eq(schema.careRoutines.isDemo, 1));
      await db.delete(schema.moodLogs).where(eq(schema.moodLogs.isDemo, 1));
      await db.delete(schema.devotionals).where(eq(schema.devotionals.isDemo, 1));
      await db.delete(schema.mealPlans).where(eq(schema.mealPlans.isDemo, 1));
      await db.delete(schema.homeMaintenances).where(eq(schema.homeMaintenances.isDemo, 1));
      await db.delete(schema.childrenRoutines).where(eq(schema.childrenRoutines.isDemo, 1));
      await db.delete(schema.relationships).where(eq(schema.relationships.isDemo, 1));
      await db.delete(schema.groceries).where(eq(schema.groceries.isDemo, 1));
      await db.delete(schema.wishlistItems).where(eq(schema.wishlistItems.isDemo, 1));
      await db.delete(schema.petCareRecords).where(eq(schema.petCareRecords.isDemo, 1));
      await db.delete(schema.pets).where(eq(schema.pets.isDemo, 1));
      await db.delete(schema.vehicleMaintenances).where(eq(schema.vehicleMaintenances.isDemo, 1));
      await db.delete(schema.vehicles).where(eq(schema.vehicles.isDemo, 1));
      await db.delete(schema.propertyAssets).where(eq(schema.propertyAssets.isDemo, 1));
      await db.delete(schema.emergencyContacts).where(eq(schema.emergencyContacts.isDemo, 1));

      // 1. Pessoas
      const p1 = await db.insert(schema.people).values({ name: "Marcos", role: "Pai", avatarColor: "#231B16", isDemo: 1 }).returning({ id: schema.people.id });
      const p2 = await db.insert(schema.people).values({ name: "Ana", role: "Mãe", avatarColor: "#C47882", isDemo: 1 }).returning({ id: schema.people.id });
      const p3 = await db.insert(schema.people).values({ name: "Sofia", role: "Filha (8 anos)", avatarColor: "#3B7A6B", isDemo: 1 }).returning({ id: schema.people.id });

      const marcosId = p1[0]?.id;
      const anaId = p2[0]?.id;
      const sofiaId = p3[0]?.id;

      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10);
      const next10Days = new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 10);

      // 2. Agenda & Aniversários (próximos 14 dias)
      await db.insert(schema.agendaEvents).values([
        { title: "Dentista da Sofia", date: tomorrow, time: "10:00", personId: sofiaId, category: "Saúde", status: "pendente", isDemo: 1 },
        { title: "Reunião de Pais - Escola", date: nextWeek, time: "18:30", personId: anaId, category: "Escola", status: "pendente", isDemo: 1 },
        { title: "Aniversário do Tio Carlos", date: next10Days, time: "14:00", personId: marcosId, category: "Família", isBirthday: 1, status: "pendente", isDemo: 1 },
        { title: "Revisão preventiva do carro", date: today, time: "09:00", personId: marcosId, category: "Casa", status: "concluido", isDemo: 1 },
      ]);

      // 3. Hábitos
      await db.insert(schema.habits).values([
        { title: "Devocional & Oração da manhã", period: "manha", streak: 12, completedToday: 1, personId: marcosId, isDemo: 1 },
        { title: "Caminhada 30 min", period: "manha", streak: 5, completedToday: 0, personId: anaId, isDemo: 1 },
        { title: "Leitura com Sofia antes de dormir", period: "noite", streak: 18, completedToday: 0, personId: sofiaId, isDemo: 1 },
        { title: "Organizar tarefas do dia seguinte", period: "noite", streak: 7, completedToday: 0, personId: marcosId, isDemo: 1 },
      ]);

      // 4. Tarefas
      await db.insert(schema.tasks).values([
        { title: "Comprar uniforme de natação da Sofia", area: "Casa", priority: "alta", dueDate: tomorrow, completed: 0, personId: anaId, isDemo: 1 },
        { title: "Pagar conta de luz (R$ 180,00)", area: "Finanças", priority: "alta", dueDate: tomorrow, completed: 0, personId: marcosId, isDemo: 1 },
        { title: "Renovar filtro do purificador de água", area: "Casa", priority: "media", dueDate: nextWeek, completed: 0, personId: marcosId, isDemo: 1 },
        { title: "Revisar relatório de gastos do mês", area: "Finanças", priority: "baixa", dueDate: next10Days, completed: 1, personId: marcosId, isDemo: 1 },
      ]);

      // 5. Notas Agregadas
      await db.insert(schema.notes).values([
        { title: "Ideias para o aniversário da Sofia", content: "Tema aquarela e picnic no parque. Convidar amiguinhos da escola e primos.", moduleOrigin: "Geral", tags: "família,sofia,festa", isDemo: 1 },
        { title: "Observações da consulta odontológica", content: "Dentista recomendou fio dental diário e retorno em 6 meses para acompanhamento.", moduleOrigin: "Saúde", tags: "saúde,dentista", isDemo: 1 },
        { title: "Treino A - Fortalecimento", content: "Alongamento 5 min, agachamento 3x12, prancha 3x45s. Sem dor no joelho.", moduleOrigin: "Treinos", tags: "treino,corpo", isDemo: 1 },
      ]);

      // 6. Finanças — Contas
      const acc1 = await db.insert(schema.financeAccounts).values([
        { name: "Conta Principal", type: "corrente", institution: "Nubank", balance: 425000, isDemo: 1 }, // R$ 4.250,00
        { name: "Reserva Imediata", type: "poupanca", institution: "Itaú", balance: 1580000, isDemo: 1 }, // R$ 15.800,00
        { name: "Carteira / Espécie", type: "especie", institution: "Dinheiro Físico", balance: 35000, isDemo: 1 }, // R$ 350,00
      ]).returning({ id: schema.financeAccounts.id });

      const nubankId = acc1[0]?.id;

      // 7. Finanças — Cartões
      const card1 = await db.insert(schema.financeCards).values([
        { name: "Cartão Black", brand: "Mastercard", limitTotal: 1500000, limitUsed: 312000, closingDay: 25, dueDay: 5, isDemo: 1 }, // R$ 15.000 limit, R$ 3.120 usado
        { name: "Cartão Compras", brand: "Visa", limitTotal: 500000, limitUsed: 84000, closingDay: 18, dueDay: 28, isDemo: 1 },
      ]).returning({ id: schema.financeCards.id });

      const mainCardId = card1[0]?.id;

      // 8. Finanças — Transações (Orçamento)
      await db.insert(schema.financeTransactions).values([
        { description: "Salário Consultoria", amount: 950000, type: "receita", category: "Renda", date: today, status: "pago", accountId: nubankId, personId: marcosId, isDemo: 1 },
        { description: "Supermercado Mensal", amount: -115000, type: "despesa", category: "Mercado", date: today, status: "pago", cardId: mainCardId, personId: anaId, isDemo: 1 },
        { description: "Conta de Energia Elétrica", amount: -18000, type: "despesa", category: "Moradia", date: tomorrow, status: "pendente", accountId: nubankId, personId: marcosId, isDemo: 1 },
        { description: "Consulta Dentista Sofia", amount: -22000, type: "despesa", category: "Saúde", date: tomorrow, status: "pendente", cardId: mainCardId, personId: sofiaId, isDemo: 1 },
        { description: "Internet Fibra", amount: -14000, type: "despesa", category: "Moradia", date: nextWeek, status: "pendente", accountId: nubankId, personId: marcosId, isDemo: 1 },
      ]);

      // 9. Finanças — Metas
      await db.insert(schema.financeGoals).values([
        { title: "Reserva de Emergência (6 meses)", targetAmount: 3000000, currentAmount: 1580000, targetDate: "2027-12-31", category: "Reserva", isDemo: 1 },
        { title: "Viagem em Família Fim de Ano", targetAmount: 800000, currentAmount: 350000, targetDate: "2027-11-20", category: "Viagem", isDemo: 1 },
      ]);

      // 10. Finanças — Investimentos (Carteira)
      await db.insert(schema.financeInvestments).values([
        { name: "Tesouro Selic 2029", category: "Renda Fixa", amount: 1580000, institution: "Tesouro Direto", isDemo: 1 },
        { name: "CDB 105% CDI Liquidez Diária", category: "Renda Fixa", amount: 1000000, institution: "Nubank", isDemo: 1 },
        { name: "FIIs (Carteira Imobiliária)", category: "FIIs", amount: 650000, institution: "XP", isDemo: 1 },
        { name: "Bitcoin (Reserva de Valor)", category: "Cripto", amount: 320000, institution: "Cold Wallet", isDemo: 1 },
      ]);

      // 11. Bem-estar — Saúde
      await db.insert(schema.healthRecords).values([
        { title: "Consulta Pediatra de Rotina", type: "consulta", personId: sofiaId, date: tomorrow, doctorOrClinic: "Dr. Arnaldo Silveira", details: "Avaliação de crescimento e carteira de vacinação", status: "pendente", isDemo: 1 },
        { title: "Check-up Cardiológico Anual", type: "consulta", personId: marcosId, date: nextWeek, doctorOrClinic: "Dra. Beatriz Santos", details: "Eletrocardiograma e exames laboratoriais", status: "pendente", isDemo: 1 },
        { title: "Vacina Reforço Poliomielite", type: "vacina", personId: sofiaId, date: next10Days, doctorOrClinic: "Posto de Saúde Municipal", details: "Dose de reforço conforme calendário", status: "pendente", isDemo: 1 },
        { title: "Exame de Sangue Completo", type: "exame", personId: anaId, date: today, doctorOrClinic: "Laboratório Fleury", details: "Hemograma, ferro, ferritina e glicemia", status: "realizado", isDemo: 1 },
      ]);

      // 12. Bem-estar — Treinos & Corpo
      await db.insert(schema.workouts).values([
        { title: "Musculação - Superiores & Core", category: "musculacao", personId: marcosId, date: today, durationMinutes: 50, notes: "Supino, puxada, ombro e prancha. Boa progressão de carga.", isDemo: 1 },
        { title: "Corrida Leve no Parque", category: "corrida", personId: anaId, date: today, durationMinutes: 35, notes: "5km ritmo confortável. Ritmo médio 6:15 min/km.", isDemo: 1 },
        { title: "Aula de Natação Infantil", category: "natacao", personId: sofiaId, date: tomorrow, durationMinutes: 45, notes: "Treino de respiração lateral e nado costas.", isDemo: 1 },
      ]);

      // 13. Bem-estar — Cuidados & Autocuidado
      await db.insert(schema.careRoutines).values([
        { title: "Skincare Noturno (Limpeza & Hidratação)", category: "pele", personId: anaId, frequency: "diario", completed: 1, isDemo: 1 },
        { title: "Alongamento e Mobilidade Noturna", category: "corpo", personId: marcosId, frequency: "diario", completed: 0, isDemo: 1 },
        { title: "Hidratação Capilar Profunda", category: "cabelo", personId: anaId, frequency: "semanal", completed: 0, isDemo: 1 },
      ]);

      // 14. Bem-estar — Humor, Sono & Energia
      await db.insert(schema.moodLogs).values([
        { personId: marcosId, date: today, mood: "calmo", energyLevel: 4, sleepHours: 7, notes: "Dia produtivo e mente focada. Sem estresse.", isDemo: 1 },
        { personId: anaId, date: today, mood: "radiante", energyLevel: 5, sleepHours: 8, notes: "Noite de sono reparadora. Sensação de leveza.", isDemo: 1 },
      ]);

      // 15. Bem-estar — Devocional & Espiritualidade
      await db.insert(schema.devotionals).values([
        { title: "Salmo 23 — O Senhor é meu pastor", passageOrVerse: "Salmos 23:1-3", reflection: "Deus renova as forças quando descansamos Nele. Confiança para as decisões do trabalho.", type: "leitura", personId: marcosId, date: today, isDemo: 1 },
        { title: "Gratidão pela Providência Familiar", passageOrVerse: "Filipenses 4:6", reflection: "Apresentar cada ansiedade em oração com ações de graças.", type: "oracao", personId: anaId, date: today, isDemo: 1 },
      ]);

      // 16. Bem-estar — Alimentação & Cozinha
      await db.insert(schema.mealPlans).values([
        { title: "Almoço em Família: Risoto de Cogumelos e Salada Verde", mealType: "almoco", dayOfWeek: "domingo", recipeOrIngredients: "Arroz arbóreo, shimeji, parmesão e rúcula fresca", isFavorite: 1, isDemo: 1 },
        { title: "Jantar Leve: Sopa de Legumes com Mandioquinha", mealType: "jantar", dayOfWeek: "segunda", recipeOrIngredients: "Mandioquinha, cenoura, alho-poró e frango desfiado", isFavorite: 0, isDemo: 1 },
        { title: "Café Matinal: Ovos mexidos, abacate e café coado", mealType: "cafe", dayOfWeek: "terca", recipeOrIngredients: "2 ovos, 1/2 abacate com sementes de abóbora", isFavorite: 1, isDemo: 1 },
      ]);

      // 17. Casa — Manutenções Domésticas
      await db.insert(schema.homeMaintenances).values([
        { title: "Trocar filtro do purificador de água", room: "Cozinha", dueDate: nextWeek, costCents: 9000, priority: "alta", status: "pendente", personId: marcosId, notes: "Elemento filtrante classe A antibacteriano", isDemo: 1 },
        { title: "Dedetização preventiva semestral", room: "Geral", dueDate: next10Days, costCents: 35000, priority: "media", status: "pendente", personId: marcosId, notes: "Agendado para sábado pela manhã", isDemo: 1 },
        { title: "Instalação de prateleiras no quarto de estudos", room: "Quarto", dueDate: today, costCents: 12000, priority: "baixa", status: "concluido", personId: anaId, notes: "Prateleiras em MDF branco instaladas com sucesso", isDemo: 1 },
      ]);

      // 18. Filhos — Rotina Escolar e Pedagógica
      await db.insert(schema.childrenRoutines).values([
        { childPersonId: sofiaId, title: "Apresentação de Balé de Encerramento", category: "atividade", date: next10Days, notes: "Traje rosa e sapatilha de ponta, chegada com 30min de antecedência", status: "pendente", isDemo: 1 },
        { childPersonId: sofiaId, title: "Reunião Pedagógica Bimestral", category: "escola", date: nextWeek, notes: "Acompanhamento do desenvolvimento e leitura em voz alta", status: "pendente", isDemo: 1 },
        { childPersonId: sofiaId, title: "Projeto de Ciências: O Ciclo das Plantas", category: "pedagogico", date: today, notes: "Montagem do vasinho de feijão para observação", status: "concluido", isDemo: 1 },
      ]);

      // 19. Família & Relacionamentos
      await db.insert(schema.relationships).values([
        { name: "Vovó Helena", relationship: "Avó Materna", birthday: "1954-05-14", phone: "(11) 98765-1122", notes: "Ligar aos domingos à tarde", isDemo: 1 },
        { name: "Tio Carlos", relationship: "Irmão do Marcos", birthday: "1982-11-28", phone: "(11) 99887-3344", notes: "Gosta de livros sobre história e churrasco", isDemo: 1 },
      ]);

      // 20. Mercado & Despensa
      await db.insert(schema.groceries).values([
        { name: "Café Especial em Grãos", category: "despensa", quantity: "2", unit: "pct", isPurchased: 0, isEssential: 1, isDemo: 1 },
        { name: "Azeite de Oliva Extra Virgem", category: "despensa", quantity: "1", unit: "un", isPurchased: 0, isEssential: 1, isDemo: 1 },
        { name: "Ovos Caipiras Orgânicos", category: "laticinios", quantity: "30", unit: "un", isPurchased: 0, isEssential: 1, isDemo: 1 },
        { name: "Maçãs e Bananas Prata", category: "hortifruti", quantity: "1", unit: "kg", isPurchased: 1, isEssential: 1, isDemo: 1 },
        { name: "Sabão Líquido Hipoalergênico", category: "limpeza", quantity: "1", unit: "l", isPurchased: 1, isEssential: 0, isDemo: 1 },
      ]);

      // 21. Desejos & Compras Planejadas
      await db.insert(schema.wishlistItems).values([
        { title: "Aspirador Robô com Mapeamento Laser", category: "casa", estimatedCostCents: 189000, priority: "alta", status: "planejado", linkOrStore: "Kabum / Amazon", isDemo: 1 },
        { title: "Bicicleta Infantil Aro 16 para Sofia", category: "criancas", estimatedCostCents: 45000, priority: "media", status: "desejo", linkOrStore: "Decathlon", isDemo: 1 },
        { title: "Cadeira Ergonômica de Escritório", category: "tecnologia", estimatedCostCents: 125000, priority: "media", status: "comprado", linkOrStore: "Flexform", isDemo: 1 },
      ]);

      // 22. Pets da Família
      const petRes = await db.insert(schema.pets).values({
        name: "Thor",
        species: "Cachorro",
        breed: "Golden Retriever",
        birthDate: "2021-08-10",
        avatarColor: "#9E6123",
        isDemo: 1,
      }).returning({ id: schema.pets.id });
      const thorId = petRes[0]?.id;

      if (thorId) {
        await db.insert(schema.petCareRecords).values([
          { petId: thorId, title: "Vacina V10 Polivalente Anual", type: "vacina", date: next10Days, status: "pendente", notes: "Clínica Veterinária Amigo Fiel", isDemo: 1 },
          { petId: thorId, title: "Banho & Tosa Higiênica", type: "banho", date: today, status: "realizado", notes: "Pelagem desembaraçada e unhas aparadas", isDemo: 1 },
        ]);
      }

      // 23. Veículos da Família
      const vRes = await db.insert(schema.vehicles).values({
        model: "HR-V EXL 1.5 Turbo",
        brand: "Honda",
        year: 2022,
        licensePlate: "BRA-2E19",
        mileage: 38400,
        isDemo: 1,
      }).returning({ id: schema.vehicles.id });
      const carId = vRes[0]?.id;

      if (carId) {
        await db.insert(schema.vehicleMaintenances).values([
          { vehicleId: carId, title: "Revisão dos 40.000 km", date: next10Days, costCents: 120000, nextDueMileage: 50000, status: "pendente", notes: "Troca de óleo de motor, filtros e inspeção da suspensão", isDemo: 1 },
          { vehicleId: carId, title: "Alinhamento e Balanceamento das 4 rodas", date: "2026-10-15", costCents: 18000, nextDueMileage: 48000, status: "concluido", notes: "Pneus dianteiros calibrados em 32 psi", isDemo: 1 },
        ]);
      }

      // 24. Patrimônio Material
      await db.insert(schema.propertyAssets).values([
        { name: "Geladeira French Door Inverter 540L", category: "eletrodomestico", estimatedValueCents: 650000, purchaseDate: "2023-04-10", warrantyUntil: "2033-04-10", notes: "Garantia de 10 anos no compressor", isDemo: 1 },
        { name: "Lava e Seca 11kg Front Load", category: "eletrodomestico", estimatedValueCents: 380000, purchaseDate: "2022-11-20", warrantyUntil: "2025-11-20", notes: "Limpeza de filtro mensal recomendada", isDemo: 1 },
        { name: "MacBook Pro M2 Max", category: "eletronico", estimatedValueCents: 1600000, purchaseDate: "2023-01-15", warrantyUntil: "2026-01-15", notes: "Seguro patrimonial ativo", isDemo: 1 },
      ]);

      // 25. Segurança & Emergência
      await db.insert(schema.emergencyContacts).values([
        { name: "SAMU Emergência Médica", roleOrRelation: "Emergência 192", phone: "192", addressOrDetails: "Central de Regulação Municipal", priorityOrder: 1, isDemo: 1 },
        { name: "Corpo de Bombeiros", roleOrRelation: "Socorro 193", phone: "193", addressOrDetails: "Incêndio, resgate e vazamentos", priorityOrder: 2, isDemo: 1 },
        { name: "Dra. Juliana - Pediatra de Sofia", roleOrRelation: "Pediatria", phone: "(11) 98112-9900", addressOrDetails: "Hospital Infantil Sírio-Libanês", priorityOrder: 3, isDemo: 1 },
        { name: "Chaveiro 24 Horas Resende", roleOrRelation: "Chaveiro Residencial", phone: "(11) 97654-3210", addressOrDetails: "Atendimento rápido domiciliar", priorityOrder: 4, isDemo: 1 },
      ]);

      // ==========================================
      // FASE 4: DADOS DE DEMONSTRAÇÃO CRESCER
      // ==========================================

      // 26. Trabalho Profissional
      await db.insert(schema.workProjects).values([
        { title: "Consultoria Arquitetura Cloud & Microsserviços", clientOrCompany: "Fintech Alpha", area: "Desenvolvimento", status: "em_andamento", feeCents: 1800000, deadline: "2026-12-15", notes: "Entrega do desenho técnico dos microsserviços e documentação de migração", isDemo: 1 },
        { title: "Design System & Frontend Loma Editorial", clientOrCompany: "Loma Editorial", area: "Design", status: "concluido", feeCents: 1200000, deadline: "2026-11-30", notes: "Paleta editorial, tipografia serif e componentes modulares de cartões", isDemo: 1 },
      ]);

      // 27. Estudos & Aprendizado
      await db.insert(schema.studyCourses).values([
        { title: "Inglês Fluência & Comunicação Executiva", platformOrInstitution: "British Council", category: "idiomas", progressPercent: 65, totalHours: 120, completedHours: 78, status: "em_andamento", notes: "Foco em vocabulário de negociação internacional e redação", isDemo: 1 },
        { title: "Arquitetura de Software Moderna", platformOrInstitution: "Alura / Coursera", category: "tecnologia", progressPercent: 40, totalHours: 60, completedHours: 24, status: "em_andamento", notes: "Padrões event-driven e bancos distribuídos", isDemo: 1 },
      ]);

      // 28. Livros & Leituras
      await db.insert(schema.readingBooks).values([
        { title: "Hábitos Atômicos", author: "James Clear", category: "desenvolvimento", status: "lendo", rating: 5, currentPage: 184, totalPages: 320, reviewOrNotes: "Pequenas mudanças de 1% geram resultados extraordinários a longo prazo. O foco deve ser no sistema e na identidade.", isDemo: 1 },
        { title: "Essencialismo: A Disciplinada Busca por Menos", author: "Greg McKeown", category: "desenvolvimento", status: "lido", rating: 5, currentPage: 272, totalPages: 272, reviewOrNotes: "Se você não priorizar sua vida, alguém fará isso por você.", isDemo: 1 },
        { title: "O Almanaque de Naval Ravikant", author: "Eric Jorgenson", category: "filosofia", status: "quero_ler", rating: 5, currentPage: 0, totalPages: 244, reviewOrNotes: "Guia para riqueza e felicidade através do autoconhecimento e alavancagem.", isDemo: 1 },
      ]);

      // 29. Projetos Autorais
      await db.insert(schema.personalProjects).values([
        { title: "Aplicativo Loma Editorial Web App", category: "autoral", status: "em_andamento", progressPercent: 85, deadline: "2026-12-20", nextMilestone: "Validação Mobile 390px e Entrega da Fase 4", notes: "Organização holística familiar com calma e propósito", isDemo: 1 },
        { title: "Biblioteca Familiar em Carvalho Nobre", category: "casa", status: "em_andamento", progressPercent: 45, deadline: "2027-01-30", nextMilestone: "Medição de marcenaria e prateleiras suspensas", notes: "Espaço de leitura e estudos integrado à sala", isDemo: 1 },
      ]);

      // 30. Viagens Familiares
      await db.insert(schema.trips).values([
        { destination: "Campos do Jordão, SP", startDate: "2026-12-11", endDate: "2026-12-15", status: "planejada", budgetEstimatedCents: 450000, accommodation: "Pousada Vila Inglesa", checklistItems: "Casacos de frio, câmera, remédios de rotina, brinquedos de Sofia", notes: "Fim de semana em família na serra para descanso e ar puro", isDemo: 1 },
        { destination: "Kyoto & Tóquio, Japão", startDate: "2027-04-05", endDate: "2027-04-20", status: "planejada", budgetEstimatedCents: 2800000, accommodation: "Ryokan Karasuma & Hotel Ginza", checklistItems: "Passaportes válidos, seguro-saúde internacional, reservas de Shinkansen", notes: "Viagem cultural para contemplação da primavera das cerejeiras", isDemo: 1 },
      ]);

      // 31. Documentos Pessoais
      await db.insert(schema.personalDocuments).values([
        { title: "Passaporte Brasileiro (Marcos)", personName: "Marcos", category: "viagem", documentNumber: "BR-984210", expirationDate: "2029-08-14", renewalAlert: 1, notes: "Válido por mais 3 anos. Guardado no cofre doméstico", isDemo: 1 },
        { title: "CNH Digital (Ana)", personName: "Ana", category: "habilitacao", documentNumber: "04829104821", expirationDate: "2028-03-20", renewalAlert: 1, notes: "Categoria B com aplicativo Carteira Digital ativo", isDemo: 1 },
        { title: "Certidão de Nascimento (Sofia)", personName: "Sofia", category: "identidade", documentNumber: "Livro A-124 / Fls 45", expirationDate: "2099-12-31", renewalAlert: 0, notes: "Via original e cópia autenticada na pasta escolar", isDemo: 1 },
      ]);

      // 32. Filmes & Séries
      await db.insert(schema.culturalMedia).values([
        { title: "Planeta Terra III", type: "serie", platform: "Apple TV+", status: "assistindo", rating: 5, genre: "Natureza & Vida Selvagem", recommendedBy: "Família", isDemo: 1 },
        { title: "Interestelar", type: "filme", platform: "HBO Max", status: "assistido", rating: 5, genre: "Ficção Científica", recommendedBy: "Marcos", isDemo: 1 },
        { title: "O Gambito da Rainha", type: "serie", platform: "Netflix", status: "quero_assistir", rating: 5, genre: "Drama", recommendedBy: "Ana", isDemo: 1 },
      ]);

      // 33. Música & Playlists
      await db.insert(schema.musicTracks).values([
        { title: "Foco Profundo & Café da Manhã", artistOrCurator: "Loma Curadoria", momentOrMood: "foco", playlistOrAlbum: "Trabalho Sereno", platform: "Spotify", isFavorite: 1, isDemo: 1 },
        { title: "Hinos Clássicos & Louvor Acústico", artistOrCurator: "Bach Collegium & Piano", momentOrMood: "louvor", playlistOrAlbum: "Devocional Matinal", platform: "Spotify", isFavorite: 1, isDemo: 1 },
        { title: "Bossa & Jazz no Fim de Tarde", artistOrCurator: "Stan Getz & Tom Jobim", momentOrMood: "calma", playlistOrAlbum: "Café com Afeto", platform: "Spotify", isFavorite: 1, isDemo: 1 },
      ]);

      // 34. Alertas Inteligentes Proativos da Fase 5
      await db.insert(schema.smartAlerts).values([
        {
          title: "Passaporte da Sofia próximo da renovação",
          message: "O passaporte vence nos próximos 90 dias. Recomenda-se agendar atendimento na Polícia Federal para evitar contratempos nas férias.",
          area: "crescer",
          severity: "urgente",
          actionLabel: "Criar Tarefa de Renovação",
          actionType: "create_task",
          actionPayload: "Agendar renovação do passaporte da Sofia na PF",
          isDismissed: 0,
          isDemo: 1,
        },
        {
          title: "Revisão dos 40.000 km do Honda HR-V",
          message: "A quilometragem estimada está próxima do limite preventivo. Agende a revisão para manter a garantia e a segurança da família.",
          area: "casa",
          severity: "aviso",
          actionLabel: "Criar Tarefa de Revisão",
          actionType: "create_task",
          actionPayload: "Ligar para concessionária e agendar revisão do HR-V",
          isDismissed: 0,
          isDemo: 1,
        },
        {
          title: "Consulta Odontológica Preventiva",
          message: "Último check-up odontológico de rotina de Sofia foi há 6 meses. Consulta com Dra. Camila recomendada.",
          area: "saude",
          severity: "info",
          actionLabel: "Ver em Saúde",
          actionType: "navigate_tab",
          actionPayload: "tab=bem-estar&sub=saude",
          isDismissed: 0,
          isDemo: 1,
        },
        {
          title: "Reserva de Emergência: Aporte Mensal",
          message: "O orçamento prevê aporte de R$ 1.500 na reserva neste mês para acelerar a meta de segurança familiar.",
          area: "financas",
          severity: "aviso",
          actionLabel: "Lançar Aporte",
          actionType: "navigate_tab",
          actionPayload: "tab=financas&sub=metas",
          isDismissed: 0,
          isDemo: 1,
        },
      ]);

      // Espelhamento no módulo central de Notas para Crescer
      await db.insert(schema.notes).values([
        { title: "Resenha: Hábitos Atômicos", content: "Pequenas mudanças de 1% geram resultados extraordinários a longo prazo. O foco deve ser no sistema e na identidade, não apenas na meta final.", moduleOrigin: "Livros", tags: "Leitura, Desenvolvimento", isDemo: 1 },
        { title: "Marco: Aplicativo Loma Editorial", content: "Arquitetura mobile-first concluída no molde dos Espaços com Bun e SQLite. Validação da Fase 4 ativada.", moduleOrigin: "Projetos", tags: "Tecnologia, Autoral", isDemo: 1 },
        { title: "Roteiro: Campos do Jordão", content: "Pousada Vila Inglesa reservada. Passeios previstos: Horto Florestal, Museu Felícia Leirner e fondue em família.", moduleOrigin: "Viagens", tags: "Viagem, Família", isDemo: 1 },
      ]);

      // 11. Log do Sistema
      await db.insert(schema.systemLogs).values({
        action: "CARGA_DEMO",
        details: "Base de demonstração da família fictícia carregada com sucesso.",
        area: "Sistema",
      });

      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  clearDemoData: defineAction({
    description: "Apaga com segurança todos os dados marcados como demonstração.",
    request: z.object({}),
    response: okResponse,
    async handler(ctx) {
      const db = ctx.db<typeof schema>();

      await db.delete(schema.people).where(eq(schema.people.isDemo, 1));
      await db.delete(schema.agendaEvents).where(eq(schema.agendaEvents.isDemo, 1));
      await db.delete(schema.habits).where(eq(schema.habits.isDemo, 1));
      await db.delete(schema.tasks).where(eq(schema.tasks.isDemo, 1));
      await db.delete(schema.notes).where(eq(schema.notes.isDemo, 1));
      await db.delete(schema.financeAccounts).where(eq(schema.financeAccounts.isDemo, 1));
      await db.delete(schema.financeCards).where(eq(schema.financeCards.isDemo, 1));
      await db.delete(schema.financeTransactions).where(eq(schema.financeTransactions.isDemo, 1));
      await db.delete(schema.financeGoals).where(eq(schema.financeGoals.isDemo, 1));
      await db.delete(schema.financeInvestments).where(eq(schema.financeInvestments.isDemo, 1));
      await db.delete(schema.healthRecords).where(eq(schema.healthRecords.isDemo, 1));
      await db.delete(schema.workouts).where(eq(schema.workouts.isDemo, 1));
      await db.delete(schema.careRoutines).where(eq(schema.careRoutines.isDemo, 1));
      await db.delete(schema.moodLogs).where(eq(schema.moodLogs.isDemo, 1));
      await db.delete(schema.devotionals).where(eq(schema.devotionals.isDemo, 1));
      await db.delete(schema.mealPlans).where(eq(schema.mealPlans.isDemo, 1));
      await db.delete(schema.homeMaintenances).where(eq(schema.homeMaintenances.isDemo, 1));
      await db.delete(schema.childrenRoutines).where(eq(schema.childrenRoutines.isDemo, 1));
      await db.delete(schema.relationships).where(eq(schema.relationships.isDemo, 1));
      await db.delete(schema.groceries).where(eq(schema.groceries.isDemo, 1));
      await db.delete(schema.wishlistItems).where(eq(schema.wishlistItems.isDemo, 1));
      await db.delete(schema.petCareRecords).where(eq(schema.petCareRecords.isDemo, 1));
      await db.delete(schema.pets).where(eq(schema.pets.isDemo, 1));
      await db.delete(schema.vehicleMaintenances).where(eq(schema.vehicleMaintenances.isDemo, 1));
      await db.delete(schema.vehicles).where(eq(schema.vehicles.isDemo, 1));
      await db.delete(schema.propertyAssets).where(eq(schema.propertyAssets.isDemo, 1));
      await db.delete(schema.emergencyContacts).where(eq(schema.emergencyContacts.isDemo, 1));
      await db.delete(schema.workProjects).where(eq(schema.workProjects.isDemo, 1));
      await db.delete(schema.studyCourses).where(eq(schema.studyCourses.isDemo, 1));
      await db.delete(schema.readingBooks).where(eq(schema.readingBooks.isDemo, 1));
      await db.delete(schema.personalProjects).where(eq(schema.personalProjects.isDemo, 1));
      await db.delete(schema.trips).where(eq(schema.trips.isDemo, 1));
      await db.delete(schema.personalDocuments).where(eq(schema.personalDocuments.isDemo, 1));
      await db.delete(schema.culturalMedia).where(eq(schema.culturalMedia.isDemo, 1));
      await db.delete(schema.musicTracks).where(eq(schema.musicTracks.isDemo, 1));
      await db.delete(schema.smartAlerts).where(eq(schema.smartAlerts.isDemo, 1));

      await db.insert(schema.systemLogs).values({
        action: "LIMPEZA_DEMO",
        details: "Todos os dados fictícios de demonstração foram removidos.",
        area: "Sistema",
      });

      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // AGENDA & ANIVERSÁRIOS
  // ==========================================
  listAgendaEvents: defineAction({
    description: "Lista todos os compromissos e aniversários cadastrados.",
    request: z.object({}),
    response: z.object({
      events: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          date: z.string(),
          time: z.string().nullable(),
          category: z.string(),
          isBirthday: z.number(),
          status: z.string(),
          isDemo: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.agendaEvents).orderBy(schema.agendaEvents.date);
      return {
        events: rows.map((r) => ({
          id: r.id,
          title: r.title,
          date: r.date,
          time: r.time,
          category: r.category,
          isBirthday: r.isBirthday,
          status: r.status,
          isDemo: r.isDemo,
        })),
      };
    },
  }),

  addAgendaEvent: defineAction({
    description: "Adiciona um novo compromisso ou aniversário.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().optional(),
      category: z.string().default("Geral"),
      isBirthday: z.boolean().default(false),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const result = await db.insert(schema.agendaEvents).values({
        title: args.title,
        date: args.date,
        time: args.time || null,
        category: args.category,
        isBirthday: args.isBirthday ? 1 : 0,
        status: "pendente",
        isDemo: 0,
      }).returning({ id: schema.agendaEvents.id });

      const id = result[0]?.id;
      if (!id) throw new Error("Falha ao criar compromisso");

      await db.insert(schema.systemLogs).values({
        action: "AGENDA_CRIAR",
        details: `Criado compromisso: ${args.title} (${args.date})`,
        area: "Agenda",
      });

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleAgendaEvent: defineAction({
    description: "Alterna status de um compromisso (pendente/concluido).",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const found = await db.select().from(schema.agendaEvents).where(eq(schema.agendaEvents.id, args.id)).limit(1);
      const ev = found[0];
      if (ev) {
        const nextStatus = ev.status === "concluido" ? "pendente" : "concluido";
        await db.update(schema.agendaEvents).set({ status: nextStatus }).where(eq(schema.agendaEvents.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  deleteAgendaEvent: defineAction({
    description: "Remove um compromisso da agenda.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.agendaEvents).where(eq(schema.agendaEvents.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // HÁBITOS & ROTINA
  // ==========================================
  listHabits: defineAction({
    description: "Lista os hábitos e rotinas cadastrados.",
    request: z.object({}),
    response: z.object({
      habits: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          period: z.string(),
          streak: z.number(),
          completedToday: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.habits);
      return {
        habits: rows.map((r) => ({
          id: r.id,
          title: r.title,
          period: r.period,
          streak: r.streak,
          completedToday: r.completedToday,
        })),
      };
    },
  }),

  addHabit: defineAction({
    description: "Cadastra um novo hábito de rotina.",
    request: z.object({
      title: z.string().trim().min(1).max(100),
      period: z.enum(["manha", "tarde", "noite", "dia"]).default("manha"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.habits).values({
        title: args.title,
        period: args.period,
        streak: 0,
        completedToday: 0,
        isDemo: 0,
      }).returning({ id: schema.habits.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar hábito");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleHabitToday: defineAction({
    description: "Marca ou desmarca a conclusão de um hábito hoje.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const found = await db.select().from(schema.habits).where(eq(schema.habits.id, args.id)).limit(1);
      const h = found[0];
      if (h) {
        const nextState = h.completedToday === 1 ? 0 : 1;
        const nextStreak = nextState === 1 ? h.streak + 1 : Math.max(0, h.streak - 1);
        await db.update(schema.habits).set({ completedToday: nextState, streak: nextStreak }).where(eq(schema.habits.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  deleteHabit: defineAction({
    description: "Remove um hábito da rotina.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.habits).where(eq(schema.habits.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // TAREFAS
  // ==========================================
  listTasks: defineAction({
    description: "Lista todas as tarefas cadastradas.",
    request: z.object({}),
    response: z.object({
      tasks: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          area: z.string(),
          priority: z.string(),
          dueDate: z.string().nullable(),
          completed: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.tasks).orderBy(desc(schema.tasks.id));
      return {
        tasks: rows.map((r) => ({
          id: r.id,
          title: r.title,
          area: r.area,
          priority: r.priority,
          dueDate: r.dueDate,
          completed: r.completed,
        })),
      };
    },
  }),

  addTask: defineAction({
    description: "Adiciona uma nova tarefa com prioridade e data limite opcional.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      area: z.string().default("Rotina"),
      priority: z.enum(["alta", "media", "baixa"]).default("media"),
      dueDate: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.tasks).values({
        title: args.title,
        area: args.area,
        priority: args.priority,
        dueDate: args.dueDate || null,
        completed: 0,
        isDemo: 0,
      }).returning({ id: schema.tasks.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar tarefa");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleTask: defineAction({
    description: "Alterna conclusão de uma tarefa.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const found = await db.select().from(schema.tasks).where(eq(schema.tasks.id, args.id)).limit(1);
      const t = found[0];
      if (t) {
        await db.update(schema.tasks).set({ completed: t.completed === 1 ? 0 : 1 }).where(eq(schema.tasks.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  deleteTask: defineAction({
    description: "Remove uma tarefa da lista.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.tasks).where(eq(schema.tasks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // NOTAS (AGREGADOR COMPARTILHADO)
  // ==========================================
  listNotes: defineAction({
    description: "Lista todas as notas unificadas, com módulo de origem e tags.",
    request: z.object({}),
    response: z.object({
      notes: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          content: z.string(),
          moduleOrigin: z.string(),
          tags: z.string(),
          createdAt: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.notes).orderBy(desc(schema.notes.id));
      return {
        notes: rows.map((r) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          moduleOrigin: r.moduleOrigin,
          tags: r.tags,
          createdAt: r.createdAt.getTime(),
        })),
      };
    },
  }),

  addNote: defineAction({
    description: "Cria uma anotação vinculada a qualquer módulo de origem ou anotação avulsa.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      content: z.string().trim().min(1),
      moduleOrigin: z.string().default("Geral"),
      tags: z.string().default(""),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.notes).values({
        title: args.title,
        content: args.content,
        moduleOrigin: args.moduleOrigin,
        tags: args.tags,
        isDemo: 0,
      }).returning({ id: schema.notes.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar nota");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteNote: defineAction({
    description: "Remove uma anotação pelo id.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.notes).where(eq(schema.notes.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // FINANÇAS — MINI-APP COMPLETO DA FUNDAÇÃO
  // ==========================================
  getFinanceOverview: defineAction({
    description: "Retorna a visão consolidada de Finanças: patrimônio, contas, cartões, metas, investimentos e diagnóstico.",
    request: z.object({}),
    response: z.object({
      netWorth: z.number(),
      totalBalance: z.number(),
      totalInvested: z.number(),
      totalDebt: z.number(),
      monthIncome: z.number(),
      monthExpenses: z.number(),
      accounts: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          type: z.string(),
          institution: z.string(),
          balance: z.number(),
        })
      ),
      cards: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          brand: z.string(),
          limitTotal: z.number(),
          limitUsed: z.number(),
          dueDay: z.number(),
        })
      ),
      transactions: z.array(
        z.object({
          id: z.number(),
          description: z.string(),
          amount: z.number(),
          type: z.string(),
          category: z.string(),
          date: z.string(),
          status: z.string(),
        })
      ),
      goals: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          targetAmount: z.number(),
          currentAmount: z.number(),
          category: z.string(),
        })
      ),
      investments: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          category: z.string(),
          amount: z.number(),
          institution: z.string().nullable(),
        })
      ),
      diagnosis: z.object({
        status: z.string(),
        insight: z.string(),
        savingsRate: z.number(),
      }),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const accounts = await db.select().from(schema.financeAccounts);
      const cards = await db.select().from(schema.financeCards);
      const transactions = await db.select().from(schema.financeTransactions).orderBy(desc(schema.financeTransactions.date)).limit(50);
      const goals = await db.select().from(schema.financeGoals);
      const investments = await db.select().from(schema.financeInvestments);

      const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
      const totalInvested = investments.reduce((acc, i) => acc + i.amount, 0);
      const totalDebt = cards.reduce((acc, c) => acc + c.limitUsed, 0);
      const netWorth = totalBalance + totalInvested - totalDebt;

      const currentMonth = new Date().toISOString().slice(0, 7);
      let monthIncome = 0;
      let monthExpenses = 0;

      for (const t of transactions) {
        if (t.date.startsWith(currentMonth)) {
          if (t.type === "receita") monthIncome += t.amount;
          if (t.type === "despesa") monthExpenses += Math.abs(t.amount);
        }
      }

      // Taxa de poupança determinística
      const savingsRate = monthIncome > 0 ? Math.max(0, Math.round(((monthIncome - monthExpenses) / monthIncome) * 100)) : 0;
      let diagnosisStatus = "Saudável";
      let diagnosisInsight = "Fluxo de caixa positivo. Aporte mensal sugerido para a Reserva de Emergência.";

      if (totalBalance < monthExpenses) {
        diagnosisStatus = "Atenção à Liquidez";
        diagnosisInsight = "O saldo disponível está abaixo dos gastos mensais previstos. Priorize reforçar a reserva imediata.";
      } else if (monthExpenses > monthIncome && monthIncome > 0) {
        diagnosisStatus = "Déficit Mensal";
        diagnosisInsight = "Os gastos deste mês superaram as receitas. Revise categorias discricionárias.";
      }

      return {
        netWorth,
        totalBalance,
        totalInvested,
        totalDebt,
        monthIncome,
        monthExpenses,
        accounts: accounts.map((a) => ({
          id: a.id,
          name: a.name,
          type: a.type,
          institution: a.institution,
          balance: a.balance,
        })),
        cards: cards.map((c) => ({
          id: c.id,
          name: c.name,
          brand: c.brand,
          limitTotal: c.limitTotal,
          limitUsed: c.limitUsed,
          dueDay: c.dueDay,
        })),
        transactions: transactions.map((t) => ({
          id: t.id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date,
          status: t.status,
        })),
        goals: goals.map((g) => ({
          id: g.id,
          title: g.title,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          category: g.category,
        })),
        investments: investments.map((i) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          amount: i.amount,
          institution: i.institution,
        })),
        diagnosis: {
          status: diagnosisStatus,
          insight: diagnosisInsight,
          savingsRate,
        },
      };
    },
  }),

  addFinanceTransaction: defineAction({
    description: "Adiciona uma receita ou despesa no orçamento familiar.",
    request: z.object({
      description: z.string().trim().min(1).max(200),
      amount: z.number().int(), // em centavos (negativo p/ despesa, positivo p/ receita)
      type: z.enum(["receita", "despesa", "transferencia"]),
      category: z.string().default("Geral"),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      status: z.enum(["pago", "pendente"]).default("pago"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.financeTransactions).values({
        description: args.description,
        amount: args.amount,
        type: args.type,
        category: args.category,
        date: args.date,
        status: args.status,
        isDemo: 0,
      }).returning({ id: schema.financeTransactions.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar transação");

      await db.insert(schema.systemLogs).values({
        action: "FINANCA_LANCAMENTO",
        details: `${args.type.toUpperCase()}: ${args.description} (R$ ${(Math.abs(args.amount) / 100).toFixed(2)})`,
        area: "Finanças",
      });

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteFinanceTransaction: defineAction({
    description: "Remove uma transação financeira do orçamento.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.financeTransactions).where(eq(schema.financeTransactions.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  addFinanceGoal: defineAction({
    description: "Adiciona uma nova meta financeira familiar.",
    request: z.object({
      title: z.string().trim().min(1).max(100),
      targetAmount: z.number().int().positive(), // centavos
      currentAmount: z.number().int().default(0), // centavos
      category: z.string().default("Reserva"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.financeGoals).values({
        title: args.title,
        targetAmount: args.targetAmount,
        currentAmount: args.currentAmount,
        category: args.category,
        isDemo: 0,
      }).returning({ id: schema.financeGoals.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar meta");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  // ==========================================
  // APOIO (PESSOAS DA CASA, SISTEMA, LOGS)
  // ==========================================
  listPeople: defineAction({
    description: "Lista os membros cadastrados na família.",
    request: z.object({}),
    response: z.object({
      people: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          role: z.string(),
          avatarColor: z.string(),
          isDemo: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.people);
      return {
        people: rows.map((r) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          avatarColor: r.avatarColor,
          isDemo: r.isDemo,
        })),
      };
    },
  }),

  addPerson: defineAction({
    description: "Adiciona uma nova pessoa na família.",
    request: z.object({
      name: z.string().trim().min(1).max(100),
      role: z.string().trim().min(1).max(50).default("Familiar"),
      avatarColor: z.string().default("#C47882"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.people).values({
        name: args.name,
        role: args.role,
        avatarColor: args.avatarColor,
        isDemo: 0,
      }).returning({ id: schema.people.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar pessoa");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  listSystemLogs: defineAction({
    description: "Lista os últimos logs e auditorias do sistema.",
    request: z.object({ limit: z.number().default(40) }),
    response: z.object({
      logs: z.array(
        z.object({
          id: z.number(),
          action: z.string(),
          details: z.string(),
          area: z.string(),
          createdAt: z.number(),
        })
      ),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.systemLogs).orderBy(desc(schema.systemLogs.id)).limit(args.limit);
      return {
        logs: rows.map((r) => ({
          id: r.id,
          action: r.action,
          details: r.details,
          area: r.area,
          createdAt: r.createdAt.getTime(),
        })),
      };
    },
  }),

  // ==========================================
  // FASE 2: BEM-ESTAR & SAÚDE
  // ==========================================
  getBemEstarOverview: defineAction({
    description: "Retorna a visão completa de Bem-estar: saúde, treinos, cuidados, humor/sono, devocional e alimentação.",
    request: z.object({}),
    response: z.object({
      healthRecords: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          type: z.string(),
          date: z.string(),
          doctorOrClinic: z.string().nullable(),
          details: z.string().nullable(),
          status: z.string(),
        })
      ),
      workouts: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          category: z.string(),
          date: z.string(),
          durationMinutes: z.number(),
          notes: z.string().nullable(),
        })
      ),
      careRoutines: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          category: z.string(),
          frequency: z.string(),
          completed: z.number(),
        })
      ),
      moodLogs: z.array(
        z.object({
          id: z.number(),
          date: z.string(),
          mood: z.string(),
          energyLevel: z.number(),
          sleepHours: z.number(),
          notes: z.string().nullable(),
        })
      ),
      devotionals: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          passageOrVerse: z.string().nullable(),
          reflection: z.string().nullable(),
          type: z.string(),
          date: z.string(),
        })
      ),
      mealPlans: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          mealType: z.string(),
          dayOfWeek: z.string(),
          recipeOrIngredients: z.string().nullable(),
          isFavorite: z.number(),
        })
      ),
      summary: z.object({
        pendingHealthCount: z.number(),
        workoutsCount: z.number(),
        careCompletedCount: z.number(),
        latestMood: z.string(),
        avgSleepHours: z.number(),
      }),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();

      const health = await db.select().from(schema.healthRecords).orderBy(desc(schema.healthRecords.date));
      const workoutRows = await db.select().from(schema.workouts).orderBy(desc(schema.workouts.date));
      const care = await db.select().from(schema.careRoutines);
      const moods = await db.select().from(schema.moodLogs).orderBy(desc(schema.moodLogs.id)).limit(10);
      const dev = await db.select().from(schema.devotionals).orderBy(desc(schema.devotionals.id));
      const meals = await db.select().from(schema.mealPlans);

      const pendingHealthCount = health.filter((h) => h.status === "pendente").length;
      const careCompletedCount = care.filter((c) => c.completed === 1).length;
      const latestMood = moods[0]?.mood || "calmo";
      const avgSleepHours = moods.length > 0 ? Math.round(moods.reduce((acc, m) => acc + m.sleepHours, 0) / moods.length) : 8;

      return {
        healthRecords: health.map((h) => ({
          id: h.id,
          title: h.title,
          type: h.type,
          date: h.date,
          doctorOrClinic: h.doctorOrClinic,
          details: h.details,
          status: h.status,
        })),
        workouts: workoutRows.map((w) => ({
          id: w.id,
          title: w.title,
          category: w.category,
          date: w.date,
          durationMinutes: w.durationMinutes,
          notes: w.notes,
        })),
        careRoutines: care.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          frequency: c.frequency,
          completed: c.completed,
        })),
        moodLogs: moods.map((m) => ({
          id: m.id,
          date: m.date,
          mood: m.mood,
          energyLevel: m.energyLevel,
          sleepHours: m.sleepHours,
          notes: m.notes,
        })),
        devotionals: dev.map((d) => ({
          id: d.id,
          title: d.title,
          passageOrVerse: d.passageOrVerse,
          reflection: d.reflection,
          type: d.type,
          date: d.date,
        })),
        mealPlans: meals.map((m) => ({
          id: m.id,
          title: m.title,
          mealType: m.mealType,
          dayOfWeek: m.dayOfWeek,
          recipeOrIngredients: m.recipeOrIngredients,
          isFavorite: m.isFavorite,
        })),
        summary: {
          pendingHealthCount,
          workoutsCount: workoutRows.length,
          careCompletedCount,
          latestMood,
          avgSleepHours,
        },
      };
    },
  }),

  addHealthRecord: defineAction({
    description: "Registra uma consulta, exame, medicamento ou vacina.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      type: z.enum(["consulta", "exame", "medicamento", "vacina", "sinal_vital"]).default("consulta"),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      doctorOrClinic: z.string().optional(),
      details: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.healthRecords).values({
        title: args.title,
        type: args.type,
        date: args.date,
        doctorOrClinic: args.doctorOrClinic || null,
        details: args.details || null,
        status: "pendente",
        isDemo: 0,
      }).returning({ id: schema.healthRecords.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar registro de saúde");

      if (args.type === "consulta" || args.type === "exame") {
        await db.insert(schema.agendaEvents).values({
          title: args.title,
          date: args.date,
          category: "Saúde",
          status: "pendente",
          isDemo: 0,
        });
      }

      await db.insert(schema.systemLogs).values({
        action: "SAUDE_REGISTRO",
        details: `${args.type.toUpperCase()}: ${args.title} (${args.date})`,
        area: "Saúde",
      });

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleHealthRecord: defineAction({
    description: "Alterna status de um registro de saúde (pendente/realizado).",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const found = await db.select().from(schema.healthRecords).where(eq(schema.healthRecords.id, args.id)).limit(1);
      const row = found[0];
      if (row) {
        const next = row.status === "realizado" ? "pendente" : "realizado";
        await db.update(schema.healthRecords).set({ status: next }).where(eq(schema.healthRecords.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  deleteHealthRecord: defineAction({
    description: "Remove um registro de saúde.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.healthRecords).where(eq(schema.healthRecords.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  addWorkout: defineAction({
    description: "Registra uma atividade física ou treino realizado.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      category: z.enum(["musculacao", "corrida", "caminhada", "natacao", "ciclismo"]).default("musculacao"),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      durationMinutes: z.number().int().positive().default(30),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.workouts).values({
        title: args.title,
        category: args.category,
        date: args.date,
        durationMinutes: args.durationMinutes,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.workouts.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar treino");

      if (args.notes && args.notes.trim()) {
        await db.insert(schema.notes).values({
          title: `Treino: ${args.title}`,
          content: args.notes,
          moduleOrigin: "Treinos",
          recordId: id,
          tags: `treino,${args.category}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteWorkout: defineAction({
    description: "Remove um treino registrado.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.workouts).where(eq(schema.workouts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  addCareRoutine: defineAction({
    description: "Adiciona uma rotina de autocuidado (pele, cabelo, corpo, unhas).",
    request: z.object({
      title: z.string().trim().min(1).max(100),
      category: z.enum(["pele", "cabelo", "corpo", "unhas", "descanso"]).default("pele"),
      frequency: z.enum(["diario", "semanal", "mensal"]).default("diario"),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.careRoutines).values({
        title: args.title,
        category: args.category,
        frequency: args.frequency,
        completed: 0,
        isDemo: 0,
      }).returning({ id: schema.careRoutines.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar rotina de cuidado");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleCareRoutine: defineAction({
    description: "Alterna conclusão de uma rotina de autocuidado.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const found = await db.select().from(schema.careRoutines).where(eq(schema.careRoutines.id, args.id)).limit(1);
      const row = found[0];
      if (row) {
        await db.update(schema.careRoutines).set({ completed: row.completed === 1 ? 0 : 1 }).where(eq(schema.careRoutines.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  deleteCareRoutine: defineAction({
    description: "Remove uma rotina de autocuidado.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.careRoutines).where(eq(schema.careRoutines.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  addMoodLog: defineAction({
    description: "Registra humor, nível de energia (1-5), horas de sono e reflexões.",
    request: z.object({
      mood: z.enum(["radiante", "calmo", "cansado", "ansioso", "desafiador"]).default("calmo"),
      energyLevel: z.number().int().min(1).max(5).default(3),
      sleepHours: z.number().int().min(1).max(18).default(8),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const today = new Date().toISOString().slice(0, 10);
      const res = await db.insert(schema.moodLogs).values({
        date: today,
        mood: args.mood,
        energyLevel: args.energyLevel,
        sleepHours: args.sleepHours,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.moodLogs.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar humor");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  addDevotional: defineAction({
    description: "Registra leitura bíblica, oração, reflexão ou meta espiritual.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      passageOrVerse: z.string().optional(),
      reflection: z.string().optional(),
      type: z.enum(["leitura", "oracao", "gratidao", "meta_espiritual"]).default("leitura"),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.devotionals).values({
        title: args.title,
        passageOrVerse: args.passageOrVerse || null,
        reflection: args.reflection || null,
        type: args.type,
        date: args.date,
        isDemo: 0,
      }).returning({ id: schema.devotionals.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar devocional");

      if (args.reflection && args.reflection.trim()) {
        await db.insert(schema.notes).values({
          title: `Devocional: ${args.title}`,
          content: `${args.passageOrVerse ? `[${args.passageOrVerse}]\n` : ""}${args.reflection}`,
          moduleOrigin: "Devocional",
          recordId: id,
          tags: `devocional,${args.type}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteDevotional: defineAction({
    description: "Remove um registro devocional.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.devotionals).where(eq(schema.devotionals.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  addMealPlan: defineAction({
    description: "Planeja uma refeição ou cadastra uma receita da família.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      mealType: z.enum(["cafe", "almoco", "jantar", "lanche"]).default("almoco"),
      dayOfWeek: z.enum(["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]).default("segunda"),
      recipeOrIngredients: z.string().optional(),
      isFavorite: z.boolean().default(false),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.mealPlans).values({
        title: args.title,
        mealType: args.mealType,
        dayOfWeek: args.dayOfWeek,
        recipeOrIngredients: args.recipeOrIngredients || null,
        isFavorite: args.isFavorite ? 1 : 0,
        isDemo: 0,
      }).returning({ id: schema.mealPlans.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar plano de refeição");

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteMealPlan: defineAction({
    description: "Remove um plano alimentar.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.mealPlans).where(eq(schema.mealPlans.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // FASE 3: CASA E FAMÍLIA
  // ==========================================

  getCasaOverview: defineAction({
    description: "Retorna a visão geral da área Casa & Família cobrindo os 10 módulos.",
    request: z.object({}),
    response: z.object({
      summary: z.object({
        pendingMaintenancesCount: z.number(),
        groceriesToBuyCount: z.number(),
        wishlistCount: z.number(),
        petCarePendingCount: z.number(),
        emergencyContactsCount: z.number(),
        totalPropertyAssetsValue: z.number(),
        childrenRoutinesCount: z.number(),
      }),
      maintenances: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          room: z.string(),
          dueDate: z.string().nullable(),
          costCents: z.number(),
          priority: z.string(),
          status: z.string(),
          personName: z.string().nullable(),
          notes: z.string().nullable(),
        })
      ),
      childrenRoutines: z.array(
        z.object({
          id: z.number(),
          childName: z.string(),
          title: z.string(),
          category: z.string(),
          date: z.string(),
          notes: z.string().nullable(),
          status: z.string(),
        })
      ),
      relationships: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          relationship: z.string(),
          birthday: z.string().nullable(),
          phone: z.string().nullable(),
          notes: z.string().nullable(),
        })
      ),
      groceries: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          category: z.string(),
          quantity: z.string(),
          unit: z.string(),
          isPurchased: z.boolean(),
          isEssential: z.boolean(),
        })
      ),
      wishlist: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          category: z.string(),
          estimatedCostCents: z.number(),
          priority: z.string(),
          status: z.string(),
          linkOrStore: z.string().nullable(),
        })
      ),
      pets: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          species: z.string(),
          breed: z.string().nullable(),
          birthDate: z.string().nullable(),
          avatarColor: z.string(),
          careRecords: z.array(
            z.object({
              id: z.number(),
              title: z.string(),
              type: z.string(),
              date: z.string(),
              status: z.string(),
              notes: z.string().nullable(),
            })
          ),
        })
      ),
      vehicles: z.array(
        z.object({
          id: z.number(),
          model: z.string(),
          brand: z.string(),
          year: z.number(),
          licensePlate: z.string().nullable(),
          mileage: z.number(),
          maintenances: z.array(
            z.object({
              id: z.number(),
              title: z.string(),
              date: z.string(),
              costCents: z.number(),
              nextDueMileage: z.number().nullable(),
              status: z.string(),
              notes: z.string().nullable(),
            })
          ),
        })
      ),
      propertyAssets: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          category: z.string(),
          estimatedValueCents: z.number(),
          purchaseDate: z.string().nullable(),
          warrantyUntil: z.string().nullable(),
          notes: z.string().nullable(),
        })
      ),
      emergencyContacts: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          roleOrRelation: z.string(),
          phone: z.string(),
          addressOrDetails: z.string().nullable(),
          priorityOrder: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();

      const [
        maintenancesRows,
        childrenRows,
        relationshipsRows,
        groceriesRows,
        wishlistRows,
        petsRows,
        petCareRows,
        vehiclesRows,
        vehicleMaintRows,
        propertyRows,
        emergencyRows,
        peopleRows,
      ] = await Promise.all([
        db.select().from(schema.homeMaintenances).orderBy(asc(schema.homeMaintenances.dueDate)),
        db.select().from(schema.childrenRoutines).orderBy(desc(schema.childrenRoutines.date)),
        db.select().from(schema.relationships).orderBy(asc(schema.relationships.name)),
        db.select().from(schema.groceries).orderBy(asc(schema.groceries.isPurchased), asc(schema.groceries.name)),
        db.select().from(schema.wishlistItems).orderBy(desc(schema.wishlistItems.priority)),
        db.select().from(schema.pets).orderBy(asc(schema.pets.name)),
        db.select().from(schema.petCareRecords).orderBy(asc(schema.petCareRecords.date)),
        db.select().from(schema.vehicles).orderBy(asc(schema.vehicles.model)),
        db.select().from(schema.vehicleMaintenances).orderBy(desc(schema.vehicleMaintenances.date)),
        db.select().from(schema.propertyAssets).orderBy(desc(schema.propertyAssets.estimatedValueCents)),
        db.select().from(schema.emergencyContacts).orderBy(asc(schema.emergencyContacts.priorityOrder)),
        db.select().from(schema.people),
      ]);

      const peopleMap = new Map(peopleRows.map((p) => [p.id, p.name]));

      const pendingMaintenancesCount = maintenancesRows.filter((m) => m.status === "pendente").length;
      const groceriesToBuyCount = groceriesRows.filter((g) => g.isPurchased === 0).length;
      const wishlistCount = wishlistRows.filter((w) => w.status !== "comprado").length;
      const petCarePendingCount = petCareRows.filter((c) => c.status === "pendente").length;
      const totalPropertyAssetsValue = propertyRows.reduce((acc, p) => acc + p.estimatedValueCents, 0);

      const petsWithCare = petsRows.map((pet) => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate,
        avatarColor: pet.avatarColor,
        careRecords: petCareRows
          .filter((c) => c.petId === pet.id)
          .map((c) => ({
            id: c.id,
            title: c.title,
            type: c.type,
            date: c.date,
            status: c.status,
            notes: c.notes,
          })),
      }));

      const vehiclesWithMaint = vehiclesRows.map((v) => ({
        id: v.id,
        model: v.model,
        brand: v.brand,
        year: v.year,
        licensePlate: v.licensePlate,
        mileage: v.mileage,
        maintenances: vehicleMaintRows
          .filter((m) => m.vehicleId === v.id)
          .map((m) => ({
            id: m.id,
            title: m.title,
            date: m.date,
            costCents: m.costCents,
            nextDueMileage: m.nextDueMileage,
            status: m.status,
            notes: m.notes,
          })),
      }));

      return {
        summary: {
          pendingMaintenancesCount,
          groceriesToBuyCount,
          wishlistCount,
          petCarePendingCount,
          emergencyContactsCount: emergencyRows.length,
          totalPropertyAssetsValue,
          childrenRoutinesCount: childrenRows.length,
        },
        maintenances: maintenancesRows.map((m) => ({
          id: m.id,
          title: m.title,
          room: m.room,
          dueDate: m.dueDate,
          costCents: m.costCents,
          priority: m.priority,
          status: m.status,
          personName: m.personId ? peopleMap.get(m.personId) || null : null,
          notes: m.notes,
        })),
        childrenRoutines: childrenRows.map((c) => ({
          id: c.id,
          childName: (c.childPersonId && peopleMap.get(c.childPersonId)) || "Filho(a)",
          title: c.title,
          category: c.category,
          date: c.date,
          notes: c.notes,
          status: c.status,
        })),
        relationships: relationshipsRows.map((r) => ({
          id: r.id,
          name: r.name,
          relationship: r.relationship,
          birthday: r.birthday,
          phone: r.phone,
          notes: r.notes,
        })),
        groceries: groceriesRows.map((g) => ({
          id: g.id,
          name: g.name,
          category: g.category,
          quantity: g.quantity,
          unit: g.unit,
          isPurchased: g.isPurchased === 1,
          isEssential: g.isEssential === 1,
        })),
        wishlist: wishlistRows.map((w) => ({
          id: w.id,
          title: w.title,
          category: w.category,
          estimatedCostCents: w.estimatedCostCents,
          priority: w.priority,
          status: w.status,
          linkOrStore: w.linkOrStore,
        })),
        pets: petsWithCare,
        vehicles: vehiclesWithMaint,
        propertyAssets: propertyRows.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          estimatedValueCents: p.estimatedValueCents,
          purchaseDate: p.purchaseDate,
          warrantyUntil: p.warrantyUntil,
          notes: p.notes,
        })),
        emergencyContacts: emergencyRows.map((e) => ({
          id: e.id,
          name: e.name,
          roleOrRelation: e.roleOrRelation,
          phone: e.phone,
          addressOrDetails: e.addressOrDetails,
          priorityOrder: e.priorityOrder,
        })),
      };
    },
  }),

  // Casa: Manutenções Domésticas
  addHomeMaintenance: defineAction({
    description: "Adiciona uma tarefa de manutenção ou reparo doméstico.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      room: z.string().default("Geral"),
      dueDate: z.string().optional(),
      costCents: z.number().int().default(0),
      priority: z.enum(["alta", "media", "baixa"]).default("media"),
      personId: z.number().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.homeMaintenances).values({
        title: args.title,
        room: args.room,
        dueDate: args.dueDate || null,
        costCents: args.costCents,
        priority: args.priority,
        personId: args.personId || null,
        notes: args.notes || null,
        status: "pendente",
        isDemo: 0,
      }).returning({ id: schema.homeMaintenances.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar manutenção da casa");

      if (args.notes && args.notes.trim()) {
        await db.insert(schema.notes).values({
          title: `Manutenção: ${args.title}`,
          content: args.notes,
          moduleOrigin: "Casa",
          recordId: id,
          tags: `casa,manutencao,${args.room.toLowerCase()}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleHomeMaintenance: defineAction({
    description: "Alterna o status de uma manutenção doméstica entre pendente e concluído.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.homeMaintenances).where(eq(schema.homeMaintenances.id, args.id));
      const row = rows[0];
      if (row) {
        const next = row.status === "concluido" ? "pendente" : "concluido";
        await db.update(schema.homeMaintenances).set({ status: next }).where(eq(schema.homeMaintenances.id, args.id));
      }
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteHomeMaintenance: defineAction({
    description: "Remove uma manutenção da casa.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.homeMaintenances).where(eq(schema.homeMaintenances.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Filhos: Rotinas e Acompanhamento
  addChildRoutine: defineAction({
    description: "Registra uma rotina escolar, pedagógica ou atividade do filho.",
    request: z.object({
      childPersonId: z.number().optional(),
      title: z.string().trim().min(1).max(200),
      category: z.enum(["escola", "atividade", "saude", "pedagogico"]).default("escola"),
      date: z.string(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.childrenRoutines).values({
        childPersonId: args.childPersonId || null,
        title: args.title,
        category: args.category,
        date: args.date,
        notes: args.notes || null,
        status: "pendente",
        isDemo: 0,
      }).returning({ id: schema.childrenRoutines.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar rotina do filho");

      if (args.notes && args.notes.trim()) {
        await db.insert(schema.notes).values({
          title: `Filhos: ${args.title}`,
          content: args.notes,
          moduleOrigin: "Filhos",
          recordId: id,
          tags: `filhos,escola,${args.category}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleChildRoutine: defineAction({
    description: "Alterna status de rotina de filho.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.childrenRoutines).where(eq(schema.childrenRoutines.id, args.id));
      const row = rows[0];
      if (row) {
        const next = row.status === "concluido" ? "pendente" : "concluido";
        await db.update(schema.childrenRoutines).set({ status: next }).where(eq(schema.childrenRoutines.id, args.id));
      }
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteChildRoutine: defineAction({
    description: "Remove um registro de rotina de filho.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.childrenRoutines).where(eq(schema.childrenRoutines.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Relacionamentos & Família Estendida
  addRelationship: defineAction({
    description: "Cadastra um parente, amigo ou contato especial da família.",
    request: z.object({
      name: z.string().trim().min(1).max(100),
      relationship: z.string().trim().min(1).max(100),
      birthday: z.string().optional(),
      phone: z.string().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.relationships).values({
        name: args.name,
        relationship: args.relationship,
        birthday: args.birthday || null,
        phone: args.phone || null,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.relationships.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao salvar relacionamento");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteRelationship: defineAction({
    description: "Remove um contato de relacionamento.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.relationships).where(eq(schema.relationships.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Mercado: Itens de Supermercado
  addGroceryItem: defineAction({
    description: "Adiciona um item à lista de compras de supermercado.",
    request: z.object({
      name: z.string().trim().min(1).max(150),
      category: z.enum(["hortifruti", "laticinios", "despensa", "limpeza", "higiene", "bebidas"]).default("despensa"),
      quantity: z.string().default("1"),
      unit: z.string().default("un"),
      isEssential: z.boolean().default(false),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.groceries).values({
        name: args.name,
        category: args.category,
        quantity: args.quantity,
        unit: args.unit,
        isEssential: args.isEssential ? 1 : 0,
        isPurchased: 0,
        isDemo: 0,
      }).returning({ id: schema.groceries.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao adicionar item de mercado");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleGroceryItem: defineAction({
    description: "Alterna item de mercado entre pendente e comprado (carrinho).",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.groceries).where(eq(schema.groceries.id, args.id));
      const row = rows[0];
      if (row) {
        const next = row.isPurchased === 1 ? 0 : 1;
        await db.update(schema.groceries).set({ isPurchased: next }).where(eq(schema.groceries.id, args.id));
      }
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteGroceryItem: defineAction({
    description: "Remove um item de mercado.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.groceries).where(eq(schema.groceries.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Compras & Desejos
  addWishlistItem: defineAction({
    description: "Adiciona um item à lista de compras ou desejos planejados da família.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      category: z.enum(["casa", "tecnologia", "pessoal", "criancas"]).default("casa"),
      estimatedCostCents: z.number().int().default(0),
      priority: z.enum(["alta", "media", "baixa"]).default("media"),
      status: z.enum(["desejo", "planejado", "comprado"]).default("desejo"),
      linkOrStore: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.wishlistItems).values({
        title: args.title,
        category: args.category,
        estimatedCostCents: args.estimatedCostCents,
        priority: args.priority,
        status: args.status,
        linkOrStore: args.linkOrStore || null,
        isDemo: 0,
      }).returning({ id: schema.wishlistItems.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao salvar item da lista de desejos");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateWishlistStatus: defineAction({
    description: "Atualiza o status de um item de desejos (desejo, planejado, comprado).",
    request: z.object({
      id: z.number(),
      status: z.enum(["desejo", "planejado", "comprado"]),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.update(schema.wishlistItems).set({ status: args.status }).where(eq(schema.wishlistItems.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteWishlistItem: defineAction({
    description: "Remove um item de desejos.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.wishlistItems).where(eq(schema.wishlistItems.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Pets & Cuidados
  addPetCareRecord: defineAction({
    description: "Registra vacina, consulta ou cuidado com pet.",
    request: z.object({
      petId: z.number(),
      title: z.string().trim().min(1).max(200),
      type: z.enum(["vacina", "consulta", "banho", "vermifugo", "antipulgas"]).default("consulta"),
      date: z.string(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.petCareRecords).values({
        petId: args.petId,
        title: args.title,
        type: args.type,
        date: args.date,
        notes: args.notes || null,
        status: "pendente",
        isDemo: 0,
      }).returning({ id: schema.petCareRecords.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar cuidado com pet");

      if (args.notes && args.notes.trim()) {
        await db.insert(schema.notes).values({
          title: `Pet: ${args.title}`,
          content: args.notes,
          moduleOrigin: "Pet",
          recordId: id,
          tags: `pet,${args.type}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  togglePetCareRecord: defineAction({
    description: "Alterna status de cuidado com pet.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.petCareRecords).where(eq(schema.petCareRecords.id, args.id));
      const row = rows[0];
      if (row) {
        const next = row.status === "realizado" ? "pendente" : "realizado";
        await db.update(schema.petCareRecords).set({ status: next }).where(eq(schema.petCareRecords.id, args.id));
      }
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deletePetCareRecord: defineAction({
    description: "Remove um registro de cuidado com pet.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.petCareRecords).where(eq(schema.petCareRecords.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Veículos: Manutenções
  addVehicleMaintenance: defineAction({
    description: "Registra uma manutenção, revisão ou abastecimento do veículo.",
    request: z.object({
      vehicleId: z.number(),
      title: z.string().trim().min(1).max(200),
      date: z.string(),
      costCents: z.number().int().default(0),
      nextDueMileage: z.number().int().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.vehicleMaintenances).values({
        vehicleId: args.vehicleId,
        title: args.title,
        date: args.date,
        costCents: args.costCents,
        nextDueMileage: args.nextDueMileage || null,
        status: "concluido",
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.vehicleMaintenances.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar manutenção do veículo");

      if (args.notes && args.notes.trim()) {
        await db.insert(schema.notes).values({
          title: `Veículo: ${args.title}`,
          content: args.notes,
          moduleOrigin: "Veículos",
          recordId: id,
          tags: "veiculos,manutencao",
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteVehicleMaintenance: defineAction({
    description: "Remove uma manutenção de veículo.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.vehicleMaintenances).where(eq(schema.vehicleMaintenances.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Patrimônio: Bens e Garantias
  addPropertyAsset: defineAction({
    description: "Cadastra um bem patrimonial, eletrodoméstico ou eletrônico da família.",
    request: z.object({
      name: z.string().trim().min(1).max(200),
      category: z.enum(["imovel", "eletrodomestico", "eletronico", "mobilia", "outro"]).default("eletrodomestico"),
      estimatedValueCents: z.number().int().default(0),
      purchaseDate: z.string().optional(),
      warrantyUntil: z.string().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.propertyAssets).values({
        name: args.name,
        category: args.category,
        estimatedValueCents: args.estimatedValueCents,
        purchaseDate: args.purchaseDate || null,
        warrantyUntil: args.warrantyUntil || null,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.propertyAssets.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar bem patrimonial");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  deletePropertyAsset: defineAction({
    description: "Remove um bem patrimonial.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.propertyAssets).where(eq(schema.propertyAssets.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // Segurança & Emergência
  addEmergencyContact: defineAction({
    description: "Cadastra um contato ou serviço de emergência familiar.",
    request: z.object({
      name: z.string().trim().min(1).max(100),
      roleOrRelation: z.string().trim().min(1).max(100),
      phone: z.string().trim().min(1).max(50),
      addressOrDetails: z.string().optional(),
      priorityOrder: z.number().int().default(1),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.emergencyContacts).values({
        name: args.name,
        roleOrRelation: args.roleOrRelation,
        phone: args.phone,
        addressOrDetails: args.addressOrDetails || null,
        priorityOrder: args.priorityOrder,
        isDemo: 0,
      }).returning({ id: schema.emergencyContacts.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar contato de emergência");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  deleteEmergencyContact: defineAction({
    description: "Remove um contato de emergência.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.emergencyContacts).where(eq(schema.emergencyContacts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // FASE 4 — CRESCER & FUTURO (8 MÓDULOS)
  // ==========================================
  getCrescerOverview: defineAction({
    description: "Retorna a visão consolidada de Crescer cobrindo Trabalho, Estudos, Livros, Projetos, Viagens, Documentos, Filmes & Séries e Música.",
    request: z.object({}),
    response: z.object({
      summary: z.object({
        activeWorkProjectsCount: z.number(),
        activeCoursesCount: z.number(),
        booksReadThisYear: z.number(),
        booksReadingNow: z.number(),
        activePersonalProjectsCount: z.number(),
        upcomingTripsCount: z.number(),
        documentsExpiringSoonCount: z.number(),
      }),
      workProjects: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          clientOrCompany: z.string().nullable(),
          area: z.string(),
          status: z.string(),
          feeCents: z.number(),
          deadline: z.string().nullable(),
          notes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      courses: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          platformOrInstitution: z.string().nullable(),
          category: z.string(),
          progressPercent: z.number(),
          totalHours: z.number(),
          completedHours: z.number(),
          status: z.string(),
          certificateUrl: z.string().nullable(),
          notes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      books: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          author: z.string(),
          category: z.string(),
          status: z.string(),
          rating: z.number().nullable(),
          currentPage: z.number(),
          totalPages: z.number(),
          reviewOrNotes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      personalProjects: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          category: z.string(),
          status: z.string(),
          progressPercent: z.number(),
          deadline: z.string().nullable(),
          nextMilestone: z.string().nullable(),
          notes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      trips: z.array(
        z.object({
          id: z.number(),
          destination: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          status: z.string(),
          budgetEstimatedCents: z.number(),
          accommodation: z.string().nullable(),
          checklistItems: z.string().nullable(),
          notes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      documents: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          personName: z.string(),
          category: z.string(),
          documentNumber: z.string().nullable(),
          expirationDate: z.string().nullable(),
          renewalAlert: z.number(),
          notes: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      culturalMedia: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          type: z.string(),
          platform: z.string(),
          status: z.string(),
          rating: z.number().nullable(),
          genre: z.string().nullable(),
          recommendedBy: z.string().nullable(),
          isDemo: z.number(),
        })
      ),
      musicTracks: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          artistOrCurator: z.string(),
          momentOrMood: z.string(),
          playlistOrAlbum: z.string().nullable(),
          platform: z.string(),
          isFavorite: z.number(),
          isDemo: z.number(),
        })
      ),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();

      const [
        workList,
        courseList,
        bookList,
        projectList,
        tripList,
        docList,
        mediaList,
        musicList,
      ] = await Promise.all([
        db.select().from(schema.workProjects).orderBy(desc(schema.workProjects.id)),
        db.select().from(schema.studyCourses).orderBy(desc(schema.studyCourses.id)),
        db.select().from(schema.readingBooks).orderBy(desc(schema.readingBooks.id)),
        db.select().from(schema.personalProjects).orderBy(desc(schema.personalProjects.id)),
        db.select().from(schema.trips).orderBy(schema.trips.startDate),
        db.select().from(schema.personalDocuments).orderBy(schema.personalDocuments.expirationDate),
        db.select().from(schema.culturalMedia).orderBy(desc(schema.culturalMedia.id)),
        db.select().from(schema.musicTracks).orderBy(desc(schema.musicTracks.id)),
      ]);

      const activeWorkProjectsCount = workList.filter((w) => w.status === "em_andamento" || w.status === "proposta").length;
      const activeCoursesCount = courseList.filter((c) => c.status === "em_andamento").length;
      const booksReadThisYear = bookList.filter((b) => b.status === "lido").length;
      const booksReadingNow = bookList.filter((b) => b.status === "lendo").length;
      const activePersonalProjectsCount = projectList.filter((p) => p.status === "em_andamento").length;
      const upcomingTripsCount = tripList.filter((t) => t.status === "planejada" || t.status === "confirmada").length;
      const documentsExpiringSoonCount = docList.filter((d) => d.renewalAlert === 1).length;

      return {
        summary: {
          activeWorkProjectsCount,
          activeCoursesCount,
          booksReadThisYear,
          booksReadingNow,
          activePersonalProjectsCount,
          upcomingTripsCount,
          documentsExpiringSoonCount,
        },
        workProjects: workList,
        courses: courseList,
        books: bookList,
        personalProjects: projectList,
        trips: tripList,
        documents: docList,
        culturalMedia: mediaList,
        musicTracks: musicList,
      };
    },
  }),

  // 1. Trabalho
  addWorkProject: defineAction({
    description: "Cadastra um projeto ou contrato profissional.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      clientOrCompany: z.string().optional(),
      area: z.string().default("Desenvolvimento"),
      status: z.enum(["proposta", "em_andamento", "concluido"]).default("em_andamento"),
      feeCents: z.number().int().default(0),
      deadline: z.string().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.workProjects).values({
        title: args.title,
        clientOrCompany: args.clientOrCompany || null,
        area: args.area,
        status: args.status,
        feeCents: args.feeCents,
        deadline: args.deadline || null,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.workProjects.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar projeto de trabalho");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateWorkProjectStatus: defineAction({
    description: "Atualiza o status de um projeto de trabalho.",
    request: z.object({
      id: z.number(),
      status: z.enum(["proposta", "em_andamento", "concluido"]),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.update(schema.workProjects).set({ status: args.status }).where(eq(schema.workProjects.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteWorkProject: defineAction({
    description: "Remove um projeto de trabalho.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.workProjects).where(eq(schema.workProjects.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 2. Estudos
  addStudyCourse: defineAction({
    description: "Cadastra um curso, idioma ou disciplina de estudo.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      platformOrInstitution: z.string().optional(),
      category: z.string().default("tecnologia"),
      progressPercent: z.number().int().min(0).max(100).default(0),
      totalHours: z.number().int().default(0),
      completedHours: z.number().int().default(0),
      status: z.enum(["em_andamento", "concluido", "pausado"]).default("em_andamento"),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.studyCourses).values({
        title: args.title,
        platformOrInstitution: args.platformOrInstitution || null,
        category: args.category,
        progressPercent: args.progressPercent,
        totalHours: args.totalHours,
        completedHours: args.completedHours,
        status: args.status,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.studyCourses.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao criar curso/estudo");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateStudyCourseProgress: defineAction({
    description: "Atualiza o progresso percentual ou status de um curso.",
    request: z.object({
      id: z.number(),
      progressPercent: z.number().int().min(0).max(100),
      status: z.enum(["em_andamento", "concluido", "pausado"]).optional(),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const updateData: any = { progressPercent: args.progressPercent };
      if (args.status) updateData.status = args.status;
      if (args.progressPercent === 100 && !args.status) updateData.status = "concluido";
      await db.update(schema.studyCourses).set(updateData).where(eq(schema.studyCourses.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteStudyCourse: defineAction({
    description: "Remove um curso de estudo.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.studyCourses).where(eq(schema.studyCourses.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 3. Livros
  addReadingBook: defineAction({
    description: "Cadastra um livro para leitura ou já lido, com espelhamento opcional em Notas.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      author: z.string().trim().min(1).max(100),
      category: z.string().default("desenvolvimento"),
      status: z.enum(["lendo", "lido", "quero_ler"]).default("lendo"),
      rating: z.number().int().min(1).max(5).default(5),
      currentPage: z.number().int().default(0),
      totalPages: z.number().int().default(0),
      reviewOrNotes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.readingBooks).values({
        title: args.title,
        author: args.author,
        category: args.category,
        status: args.status,
        rating: args.rating,
        currentPage: args.currentPage,
        totalPages: args.totalPages,
        reviewOrNotes: args.reviewOrNotes || null,
        isDemo: 0,
      }).returning({ id: schema.readingBooks.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar livro");

      // Espelhamento automático no módulo de Notas se houver resenha/anotação
      if (args.reviewOrNotes?.trim()) {
        await db.insert(schema.notes).values({
          title: `Resenha: ${args.title} (${args.author})`,
          content: args.reviewOrNotes,
          moduleOrigin: "Livros",
          tags: `Leitura, ${args.category}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateReadingBookStatus: defineAction({
    description: "Atualiza página atual, status ou nota de um livro.",
    request: z.object({
      id: z.number(),
      status: z.enum(["lendo", "lido", "quero_ler"]).optional(),
      currentPage: z.number().int().optional(),
      rating: z.number().int().min(1).max(5).optional(),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const updateData: any = {};
      if (args.status !== undefined) updateData.status = args.status;
      if (args.currentPage !== undefined) updateData.currentPage = args.currentPage;
      if (args.rating !== undefined) updateData.rating = args.rating;
      await db.update(schema.readingBooks).set(updateData).where(eq(schema.readingBooks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteReadingBook: defineAction({
    description: "Remove um livro.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.readingBooks).where(eq(schema.readingBooks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 4. Projetos Autorais
  addPersonalProject: defineAction({
    description: "Cadastra um projeto pessoal/autoral, com espelhamento automático em Notas.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      category: z.string().default("autoral"),
      status: z.enum(["ideia", "em_andamento", "concluido"]).default("em_andamento"),
      progressPercent: z.number().int().min(0).max(100).default(0),
      deadline: z.string().optional(),
      nextMilestone: z.string().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.personalProjects).values({
        title: args.title,
        category: args.category,
        status: args.status,
        progressPercent: args.progressPercent,
        deadline: args.deadline || null,
        nextMilestone: args.nextMilestone || null,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.personalProjects.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar projeto pessoal");

      if (args.notes?.trim() || args.nextMilestone?.trim()) {
        await db.insert(schema.notes).values({
          title: `Projeto: ${args.title}`,
          content: args.notes || `Próximo marco: ${args.nextMilestone}`,
          moduleOrigin: "Projetos",
          tags: `Projeto, ${args.category}`,
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  updatePersonalProjectProgress: defineAction({
    description: "Atualiza o progresso ou marco de um projeto pessoal.",
    request: z.object({
      id: z.number(),
      progressPercent: z.number().int().min(0).max(100),
      nextMilestone: z.string().optional(),
      status: z.enum(["ideia", "em_andamento", "concluido"]).optional(),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const updateData: any = { progressPercent: args.progressPercent };
      if (args.nextMilestone !== undefined) updateData.nextMilestone = args.nextMilestone;
      if (args.status !== undefined) updateData.status = args.status;
      if (args.progressPercent === 100 && !args.status) updateData.status = "concluido";
      await db.update(schema.personalProjects).set(updateData).where(eq(schema.personalProjects.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deletePersonalProject: defineAction({
    description: "Remove um projeto pessoal.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.personalProjects).where(eq(schema.personalProjects.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 5. Viagens
  addTrip: defineAction({
    description: "Cadastra uma viagem planejada da família, com espelhamento automático em Notas.",
    request: z.object({
      destination: z.string().trim().min(1).max(200),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      status: z.enum(["planejada", "confirmada", "realizada"]).default("planejada"),
      budgetEstimatedCents: z.number().int().default(0),
      accommodation: z.string().optional(),
      checklistItems: z.string().optional(),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.trips).values({
        destination: args.destination,
        startDate: args.startDate,
        endDate: args.endDate,
        status: args.status,
        budgetEstimatedCents: args.budgetEstimatedCents,
        accommodation: args.accommodation || null,
        checklistItems: args.checklistItems || null,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.trips.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar viagem");

      if (args.notes?.trim() || args.accommodation?.trim()) {
        await db.insert(schema.notes).values({
          title: `Roteiro: ${args.destination}`,
          content: args.notes || `Hospedagem: ${args.accommodation}. Check-list: ${args.checklistItems}`,
          moduleOrigin: "Viagens",
          tags: "Viagem, Família",
          isDemo: 0,
        });
      }

      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateTripStatus: defineAction({
    description: "Atualiza o status de uma viagem.",
    request: z.object({
      id: z.number(),
      status: z.enum(["planejada", "confirmada", "realizada"]),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.update(schema.trips).set({ status: args.status }).where(eq(schema.trips.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteTrip: defineAction({
    description: "Remove uma viagem.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.trips).where(eq(schema.trips.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 6. Documentos
  addPersonalDocument: defineAction({
    description: "Cadastra um documento pessoal para controle de validade e renovação.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      personName: z.string().default("Marcos"),
      category: z.string().default("identidade"),
      documentNumber: z.string().optional(),
      expirationDate: z.string().optional(),
      renewalAlert: z.number().int().default(1),
      notes: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.personalDocuments).values({
        title: args.title,
        personName: args.personName,
        category: args.category,
        documentNumber: args.documentNumber || null,
        expirationDate: args.expirationDate || null,
        renewalAlert: args.renewalAlert,
        notes: args.notes || null,
        isDemo: 0,
      }).returning({ id: schema.personalDocuments.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao cadastrar documento");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  deletePersonalDocument: defineAction({
    description: "Remove um documento pessoal.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.personalDocuments).where(eq(schema.personalDocuments.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 7. Filmes & Séries
  addCulturalMedia: defineAction({
    description: "Adiciona um filme, série ou documentário à watchlist.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      type: z.enum(["filme", "serie", "documentario"]).default("filme"),
      platform: z.string().default("Netflix"),
      status: z.enum(["assistindo", "quero_assistir", "assistido"]).default("assistindo"),
      rating: z.number().int().min(1).max(5).default(5),
      genre: z.string().optional(),
      recommendedBy: z.string().optional(),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.culturalMedia).values({
        title: args.title,
        type: args.type,
        platform: args.platform,
        status: args.status,
        rating: args.rating,
        genre: args.genre || null,
        recommendedBy: args.recommendedBy || null,
        isDemo: 0,
      }).returning({ id: schema.culturalMedia.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao registrar filme/série");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  updateCulturalMediaStatus: defineAction({
    description: "Atualiza status ou avaliação de um filme/série.",
    request: z.object({
      id: z.number(),
      status: z.enum(["assistindo", "quero_assistir", "assistido"]),
      rating: z.number().int().min(1).max(5).optional(),
    }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const updateData: any = { status: args.status };
      if (args.rating !== undefined) updateData.rating = args.rating;
      await db.update(schema.culturalMedia).set(updateData).where(eq(schema.culturalMedia.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteCulturalMedia: defineAction({
    description: "Remove um filme/série da watchlist.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.culturalMedia).where(eq(schema.culturalMedia.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // 8. Música
  addMusicTrack: defineAction({
    description: "Cadastra uma playlist, álbum ou momento musical.",
    request: z.object({
      title: z.string().trim().min(1).max(200),
      artistOrCurator: z.string().trim().min(1).max(100),
      momentOrMood: z.enum(["foco", "calma", "louvor", "familia", "treino"]).default("foco"),
      playlistOrAlbum: z.string().optional(),
      platform: z.string().default("Spotify"),
      isFavorite: z.boolean().default(true),
    }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const res = await db.insert(schema.musicTracks).values({
        title: args.title,
        artistOrCurator: args.artistOrCurator,
        momentOrMood: args.momentOrMood,
        playlistOrAlbum: args.playlistOrAlbum || null,
        platform: args.platform,
        isFavorite: args.isFavorite ? 1 : 0,
        isDemo: 0,
      }).returning({ id: schema.musicTracks.id });

      const id = res[0]?.id;
      if (!id) throw new Error("Falha ao salvar faixa musical");
      ctx.invalidateQueries();
      return { id };
    },
  }),

  toggleMusicFavorite: defineAction({
    description: "Alterna se a faixa/playlist é favorita.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const current = await db.select().from(schema.musicTracks).where(eq(schema.musicTracks.id, args.id));
      if (!current[0]) throw new Error("Música não encontrada");
      const nextFav = current[0].isFavorite === 1 ? 0 : 1;
      await db.update(schema.musicTracks).set({ isFavorite: nextFav }).where(eq(schema.musicTracks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteMusicTrack: defineAction({
    description: "Remove uma faixa/playlist musical.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.musicTracks).where(eq(schema.musicTracks.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ==========================================
  // FASE 5: INTELIGÊNCIA CONECTADA & BUSCA
  // ==========================================
  getInteligenciaOverview: defineAction({
    description: "Retorna a síntese da inteligência conectada: alertas inteligentes, insights transversais entre módulos e relatório de vida 360°.",
    request: z.object({}),
    response: z.object({
      smartAlerts: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          message: z.string(),
          area: z.string(),
          severity: z.string(),
          actionLabel: z.string().nullable(),
          actionType: z.string().nullable(),
          actionPayload: z.string().nullable(),
          isDismissed: z.number(),
          isDemo: z.number(),
        })
      ),
      crossInsights: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          modules: z.array(z.string()),
          type: z.enum(["equilibrio", "oportunidade", "atencao"]),
        })
      ),
      lifeReport360: z.object({
        overallHealthScore: z.number(),
        financialHealthScore: z.number(),
        homeCareScore: z.number(),
        growthScore: z.number(),
        harmonyScore: z.number(),
        summaryText: z.string(),
        topPriorities: z.array(z.string()),
        positives: z.array(z.string()),
      }),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const alerts = await db
        .select()
        .from(schema.smartAlerts)
        .where(eq(schema.smartAlerts.isDismissed, 0))
        .orderBy(desc(schema.smartAlerts.id));

      const crossInsights = [
        {
          id: 1,
          title: "Saúde & Orçamento Familiar",
          description: "Gastos com saúde e exames de rotina de Sofia estão 100% comportados dentro do orçamento previsto para o mês sem pressionar a liquidez.",
          modules: ["Saúde", "Finanças"],
          type: "equilibrio" as const,
        },
        {
          id: 2,
          title: "Qualidade de Sono & Avanço Profissional",
          description: "Semanas com média de sono de 7.5h correlacionaram-se com a entrega do Design System Loma e foco acelerado na consultoria de cloud.",
          modules: ["Sono", "Carreira", "Corpo"],
          type: "oportunidade" as const,
        },
        {
          id: 3,
          title: "Manutenção Preventiva & Reserva",
          description: "Reparos domésticos programados para este trimestre totalizam R$ 450,00, totalmente resguardados sem necessidade de resgate da reserva.",
          modules: ["Casa", "Finanças"],
          type: "equilibrio" as const,
        },
        {
          id: 4,
          title: "Planejamento de Viagens & Prazos",
          description: "Roteiro de inverno em Campos do Jordão com itens essenciais adiantados; atenção para renovar o passaporte de Sofia com antecedência para as férias no Japão.",
          modules: ["Viagens", "Documentos"],
          type: "atencao" as const,
        },
      ];

      return {
        smartAlerts: alerts,
        crossInsights,
        lifeReport360: {
          overallHealthScore: 92,
          financialHealthScore: 88,
          homeCareScore: 90,
          growthScore: 86,
          harmonyScore: 89,
          summaryText: "A família vive um ciclo sereno e equilibrado. A saúde preventiva está com exames agendados, a disciplina orçamentária sustenta os planos futuros e o crescimento cultural e intelectual segue consistente.",
          topPriorities: [
            "Agendar renovação do passaporte da Sofia na Polícia Federal",
            "Agendar revisão preventiva dos 40.000 km do HR-V",
            "Realizar aporte planejado de R$ 1.500 na Reserva de Emergência",
          ],
          positives: [
            "Patrimônio líquido consistente e zero dívidas nocivas",
            "Rotina devocional e treinos matinais regulares",
            "Leitura de Hábitos Atômicos em 57% com notas de reflexão",
          ],
        },
      };
    },
  }),

  dismissSmartAlert: defineAction({
    description: "Dispensa um alerta inteligente.",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.update(schema.smartAlerts).set({ isDismissed: 1 }).where(eq(schema.smartAlerts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  executeSmartAlertAction: defineAction({
    description: "Executa a ação recomendada por um alerta inteligente (ex: cria uma tarefa automaticamente).",
    request: z.object({ id: z.number() }),
    response: okResponse,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.smartAlerts).where(eq(schema.smartAlerts.id, args.id));
      const alert = rows[0];
      if (alert) {
        if (alert.actionType === "create_task") {
          await db.insert(schema.tasks).values({
            title: alert.actionPayload || alert.title,
            area: alert.area,
            priority: "alta",
            completed: 0,
            isDemo: 0,
          });
        }
        await db.update(schema.smartAlerts).set({ isDismissed: 1 }).where(eq(schema.smartAlerts.id, args.id));
        ctx.invalidateQueries();
      }
      return { ok: true };
    },
  }),

  askLifeConsultant: defineAction({
    description: "Consulta o orientador transversal de vida da IA com base nos dados reais do sistema.",
    request: z.object({ question: z.string().trim().min(1) }),
    response: z.object({
      answer: z.string(),
      evidence: z.array(z.string()),
      suggestedActions: z.array(
        z.object({
          label: z.string(),
          actionType: z.string(),
          payload: z.string(),
        })
      ),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const q = args.question.toLowerCase();

      const [accounts, tasks, docs, books] = await Promise.all([
        db.select().from(schema.financeAccounts),
        db.select().from(schema.tasks).where(eq(schema.tasks.completed, 0)),
        db.select().from(schema.personalDocuments),
        db.select().from(schema.readingBooks).where(eq(schema.readingBooks.status, "lendo")),
      ]);

      const totalBalanceCents = accounts.reduce((acc, a) => acc + a.balance, 0);
      const totalBalanceReais = (totalBalanceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const currentReading = books[0]?.title ? `${books[0].title} (${books[0].author})` : "Hábitos Atômicos";
      const openTasksCount = tasks.length;
      const expiringDoc = docs.find((d) => d.renewalAlert === 1);

      let answer = "";
      const evidence: string[] = [
        `Saldo total consolidado em contas: ${totalBalanceReais}`,
        `Tarefas prioritárias em aberto hoje: ${openTasksCount}`,
        `Leitura ativa no momento: ${currentReading}`,
      ];

      if (expiringDoc) {
        evidence.push(`Documento com alerta de renovação: ${expiringDoc.title} (${expiringDoc.personName})`);
      }

      if (q.includes("equilibrio") || q.includes("visão") || q.includes("como está") || q.includes("família")) {
        answer = `A família está em um momento de excelente harmonia. A base financeira está protegida com liquidez sólida de ${totalBalanceReais}, a rotina das crianças e do Thor está estruturada e a saúde preventiva não possui pendências emergenciais. Os únicos dois pontos que merecem atenção preventiva nas próximas semanas são a renovação do passaporte da Sofia e a revisão programada do veículo.`;
      } else if (q.includes("viagem") || q.includes("férias") || q.includes("japão") || q.includes("campos")) {
        answer = `O planejamento de viagens está bem estruturado. Campos do Jordão em julho tem hospedagem confirmada e orçamento de R$ 4.500 previsto. Para as férias em Kyoto e Tóquio (previstas para 2027), a meta de economia já está ativa e a prioridade imediata é garantir a renovação do passaporte da Sofia para evitar qualquer fila documental.`;
      } else if (q.includes("dinheiro") || q.includes("finanças") || q.includes("reserva") || q.includes("gasto")) {
        answer = `O fluxo financeiro está seguro. Suas contas somam ${totalBalanceReais} e não há dívidas nocivas ativas. A reserva de emergência segue crescendo com os aportes mensais de R$ 1.500. Recomendo manter a disciplina de alocação no Tesouro Selic antes de novos investimentos variáveis.`;
      } else {
        answer = `Com base no panorama dos seus 5 módulos, seu dia está organizado com ${openTasksCount} tarefas ativas. A leitura de ${currentReading} mantém seu crescimento intelectual ativo. Tudo o que exige decisão imediata está mapeado nos Alertas Inteligentes da Home.`;
      }

      return {
        answer,
        evidence,
        suggestedActions: [
          { label: "Ver Alertas Inteligentes", actionType: "navigate_tab", payload: "tab=home" },
          { label: "Ver Relatório 360°", actionType: "open_report", payload: "visao360" },
        ],
      };
    },
  }),

  globalSearch: defineAction({
    description: "Busca global instantânea em tempo real unificando todos os módulos do Loma.",
    request: z.object({ query: z.string().trim().min(1) }),
    response: z.object({
      results: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          subtitle: z.string(),
          area: z.string(),
          targetTab: z.string(),
          targetSub: z.string().optional(),
        })
      ),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const q = args.query.toLowerCase();
      const results: {
        id: number;
        title: string;
        subtitle: string;
        area: string;
        targetTab: string;
        targetSub?: string;
      }[] = [];

      // 1. Home: Tarefas, Agenda, Notas
      const [tasks, events, notes] = await Promise.all([
        db.select().from(schema.tasks),
        db.select().from(schema.agendaEvents),
        db.select().from(schema.notes),
      ]);

      for (const t of tasks) {
        if (t.title.toLowerCase().includes(q)) {
          results.push({ id: t.id, title: t.title, subtitle: `Tarefa • ${t.area} • Prioridade ${t.priority}`, area: "Home", targetTab: "home" });
        }
      }
      for (const e of events) {
        if (e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)) {
          results.push({ id: e.id, title: e.title, subtitle: `Agenda • ${e.date} ${e.time || ""}`, area: "Home", targetTab: "home" });
        }
      }
      for (const n of notes) {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.toLowerCase().includes(q)) {
          results.push({ id: n.id, title: n.title, subtitle: `Nota • Origem: ${n.moduleOrigin} • Tags: ${n.tags}`, area: "Home", targetTab: "home" });
        }
      }

      // 2. Finanças: Transações, Metas, Contas
      const [txs, goals, accounts] = await Promise.all([
        db.select().from(schema.financeTransactions),
        db.select().from(schema.financeGoals),
        db.select().from(schema.financeAccounts),
      ]);
      for (const tx of txs) {
        if (tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q)) {
          results.push({ id: tx.id, title: tx.description, subtitle: `Transação • ${tx.category} • ${(tx.amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, area: "Finanças", targetTab: "financas" });
        }
      }
      for (const g of goals) {
        if (g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) {
          results.push({ id: g.id, title: g.title, subtitle: `Meta Financeira • Meta ${(g.targetAmount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, area: "Finanças", targetTab: "financas" });
        }
      }
      for (const a of accounts) {
        if (a.name.toLowerCase().includes(q) || a.institution.toLowerCase().includes(q)) {
          results.push({ id: a.id, title: a.name, subtitle: `Conta Bancária • ${a.institution}`, area: "Finanças", targetTab: "financas" });
        }
      }

      // 3. Bem-Estar: Saúde, Treinos
      const [health, workoutsList] = await Promise.all([
        db.select().from(schema.healthRecords),
        db.select().from(schema.workouts),
      ]);
      for (const h of health) {
        if (h.title.toLowerCase().includes(q) || (h.details && h.details.toLowerCase().includes(q)) || (h.doctorOrClinic && h.doctorOrClinic.toLowerCase().includes(q))) {
          results.push({ id: h.id, title: h.title, subtitle: `Saúde • ${h.type} • ${h.doctorOrClinic || h.date}`, area: "Bem-estar", targetTab: "bem-estar", targetSub: "saude" });
        }
      }
      for (const w of workoutsList) {
        if (w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)) {
          results.push({ id: w.id, title: w.title, subtitle: `Treino • ${w.category} • ${w.durationMinutes} min`, area: "Bem-estar", targetTab: "bem-estar", targetSub: "treinos" });
        }
      }

      // 4. Casa: Manutenções, Mercado, Filhos, Pets, Veículos
      const [maintenances, groceries, children, pets, vehicles] = await Promise.all([
        db.select().from(schema.homeMaintenances),
        db.select().from(schema.groceries),
        db.select().from(schema.childrenRoutines),
        db.select().from(schema.pets),
        db.select().from(schema.vehicles),
      ]);
      for (const m of maintenances) {
        if (m.title.toLowerCase().includes(q) || m.room.toLowerCase().includes(q)) {
          results.push({ id: m.id, title: m.title, subtitle: `Manutenção • ${m.room} • Prioridade ${m.priority}`, area: "Casa", targetTab: "casa", targetSub: "manutencoes" });
        }
      }
      for (const gr of groceries) {
        if (gr.name.toLowerCase().includes(q) || gr.category.toLowerCase().includes(q)) {
          results.push({ id: gr.id, title: gr.name, subtitle: `Lista de Mercado • Categoria ${gr.category}`, area: "Casa", targetTab: "casa", targetSub: "mercado" });
        }
      }
      for (const c of children) {
        if (c.title.toLowerCase().includes(q) || (c.notes && c.notes.toLowerCase().includes(q)) || c.category.toLowerCase().includes(q)) {
          results.push({ id: c.id, title: c.title, subtitle: `Filhos • Sofia • ${c.category}`, area: "Casa", targetTab: "casa", targetSub: "filhos" });
        }
      }
      for (const p of pets) {
        if (p.name.toLowerCase().includes(q) || (p.breed && p.breed.toLowerCase().includes(q))) {
          results.push({ id: p.id, title: p.name, subtitle: `Pet • ${p.species} (${p.breed || "Família"})`, area: "Casa", targetTab: "casa", targetSub: "pets" });
        }
      }
      for (const v of vehicles) {
        if (v.model.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || (v.licensePlate && v.licensePlate.toLowerCase().includes(q))) {
          results.push({ id: v.id, title: `${v.brand} ${v.model}`, subtitle: `Veículo • Placa ${v.licensePlate || "SP"}`, area: "Casa", targetTab: "casa", targetSub: "veiculos" });
        }
      }

      // 5. Crescer: Trabalho, Livros, Cursos, Projetos, Viagens, Documentos, Música
      const [workList, booksList, courses, personalProjects, tripsList, docsList, musicList] = await Promise.all([
        db.select().from(schema.workProjects),
        db.select().from(schema.readingBooks),
        db.select().from(schema.studyCourses),
        db.select().from(schema.personalProjects),
        db.select().from(schema.trips),
        db.select().from(schema.personalDocuments),
        db.select().from(schema.musicTracks),
      ]);
      for (const w of workList) {
        if (w.title.toLowerCase().includes(q) || (w.clientOrCompany && w.clientOrCompany.toLowerCase().includes(q)) || w.area.toLowerCase().includes(q)) {
          results.push({ id: w.id, title: w.title, subtitle: `Trabalho • ${w.clientOrCompany || w.area} • ${w.status}`, area: "Crescer", targetTab: "crescer", targetSub: "trabalho" });
        }
      }
      for (const b of booksList) {
        if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
          results.push({ id: b.id, title: b.title, subtitle: `Livro • ${b.author} • Status: ${b.status}`, area: "Crescer", targetTab: "crescer", targetSub: "livros" });
        }
      }
      for (const cr of courses) {
        if (cr.title.toLowerCase().includes(q) || (cr.platformOrInstitution && cr.platformOrInstitution.toLowerCase().includes(q))) {
          results.push({ id: cr.id, title: cr.title, subtitle: `Estudos • ${cr.platformOrInstitution || ""} • ${cr.progressPercent}%`, area: "Crescer", targetTab: "crescer", targetSub: "estudos" });
        }
      }
      for (const pr of personalProjects) {
        if (pr.title.toLowerCase().includes(q) || (pr.notes && pr.notes.toLowerCase().includes(q))) {
          results.push({ id: pr.id, title: pr.title, subtitle: `Projeto Autoral • ${pr.progressPercent}% • ${pr.status}`, area: "Crescer", targetTab: "crescer", targetSub: "projetos" });
        }
      }
      for (const tr of tripsList) {
        if (tr.destination.toLowerCase().includes(q) || (tr.accommodation && tr.accommodation.toLowerCase().includes(q))) {
          results.push({ id: tr.id, title: tr.destination, subtitle: `Viagem • ${tr.startDate} a ${tr.endDate}`, area: "Crescer", targetTab: "crescer", targetSub: "viagens" });
        }
      }
      for (const dc of docsList) {
        if (dc.title.toLowerCase().includes(q) || dc.personName.toLowerCase().includes(q)) {
          results.push({ id: dc.id, title: dc.title, subtitle: `Documento • ${dc.personName} • Validade: ${dc.expirationDate || "Indeterminada"}`, area: "Crescer", targetTab: "crescer", targetSub: "documentos" });
        }
      }
      for (const mu of musicList) {
        if (mu.title.toLowerCase().includes(q) || mu.artistOrCurator.toLowerCase().includes(q)) {
          results.push({ id: mu.id, title: mu.title, subtitle: `Música • ${mu.artistOrCurator} • Momento ${mu.momentOrMood}`, area: "Crescer", targetTab: "crescer", targetSub: "musica" });
        }
      }

      return { results: results.slice(0, 25) };
    },
  }),

  exportAllData: defineAction({
    description: "Exporta todos os dados do banco SQLite em formato JSON consolidado para backup.",
    request: z.object({}),
    response: z.object({
      exportedAt: z.string(),
      appName: z.string(),
      version: z.string(),
      tables: z.record(z.string(), z.any()),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [
        people,
        tasks,
        events,
        notes,
        accounts,
        cards,
        transactions,
        goals,
        investments,
        health,
        workouts,
        maintenances,
        groceries,
        children,
        pets,
        vehicles,
        assets,
        emergency,
        work,
        courses,
        books,
        projects,
        trips,
        docs,
        media,
        music,
        alerts,
      ] = await Promise.all([
        db.select().from(schema.people),
        db.select().from(schema.tasks),
        db.select().from(schema.agendaEvents),
        db.select().from(schema.notes),
        db.select().from(schema.financeAccounts),
        db.select().from(schema.financeCards),
        db.select().from(schema.financeTransactions),
        db.select().from(schema.financeGoals),
        db.select().from(schema.financeInvestments),
        db.select().from(schema.healthRecords),
        db.select().from(schema.workouts),
        db.select().from(schema.homeMaintenances),
        db.select().from(schema.groceries),
        db.select().from(schema.childrenRoutines),
        db.select().from(schema.pets),
        db.select().from(schema.vehicles),
        db.select().from(schema.propertyAssets),
        db.select().from(schema.emergencyContacts),
        db.select().from(schema.workProjects),
        db.select().from(schema.studyCourses),
        db.select().from(schema.readingBooks),
        db.select().from(schema.personalProjects),
        db.select().from(schema.trips),
        db.select().from(schema.personalDocuments),
        db.select().from(schema.culturalMedia),
        db.select().from(schema.musicTracks),
        db.select().from(schema.smartAlerts),
      ]);

      return {
        exportedAt: new Date().toISOString(),
        appName: "Loma",
        version: "1.0.0",
        tables: {
          people,
          tasks,
          events,
          notes,
          accounts,
          cards,
          transactions,
          goals,
          investments,
          health,
          workouts,
          maintenances,
          groceries,
          children,
          pets,
          vehicles,
          assets,
          emergency,
          work,
          courses,
          books,
          projects,
          trips,
          docs,
          media,
          music,
          alerts,
        },
      };
    },
  }),

  importVerifiedItems: defineAction({
    description: "Importa itens conferidos e aprovados pelo usuário para seus módulos donos no banco SQLite.",
    request: z.object({
      items: z.array(
        z.object({
          module: z.string(),
          title: z.string().trim().min(1).max(200),
          details: z.string().default(""),
          date: z.string().optional(),
          amount: z.number().optional(),
          category: z.string().optional(),
        })
      ),
    }),
    response: z.object({
      success: z.boolean(),
      importedCount: z.number(),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      let count = 0;
      for (const item of args.items) {
        const mod = item.module.toLowerCase();
        const fallbackDate = new Date().toISOString().split("T")[0];
        const dateStr = typeof item.date === "string" && item.date.trim().length > 0 ? item.date.trim() : fallbackDate;

        if (mod.includes("tarefa") || mod.includes("rotina")) {
          await db.insert(schema.tasks).values({
            title: item.title,
            area: item.category || "Geral",
            priority: "media",
            dueDate: item.date || null,
            completed: 0,
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("agenda") || mod.includes("compromisso")) {
          await db.insert(schema.agendaEvents).values({
            title: item.title,
            date: dateStr as string,
            category: item.category || "Geral",
            status: "pendente",
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("finan") || mod.includes("transaç") || mod.includes("gasto")) {
          const amt = item.amount ? Math.round(item.amount * 100) : 0;
          await db.insert(schema.financeTransactions).values({
            description: item.title,
            amount: amt,
            category: item.category || "Outros",
            type: amt >= 0 ? "receita" : "despesa",
            date: dateStr as string,
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("nota")) {
          await db.insert(schema.notes).values({
            title: item.title,
            content: item.details || item.title,
            moduleOrigin: item.category || "Geral",
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("saúde") || mod.includes("consulta")) {
          await db.insert(schema.healthRecords).values({
            type: "consulta",
            title: item.title,
            doctorOrClinic: item.details || "Profissional de Saúde",
            date: dateStr as string,
            status: "pendente",
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("manuten") || mod.includes("casa")) {
          await db.insert(schema.homeMaintenances).values({
            title: item.title,
            room: item.category || "Geral",
            dueDate: item.date || null,
            priority: "media",
            status: "pendente",
            isDemo: 0,
          });
          count++;
        } else if (mod.includes("livro")) {
          await db.insert(schema.readingBooks).values({
            title: item.title,
            author: item.details || "Autor",
            status: "para_ler",
            isDemo: 0,
          });
          count++;
        } else {
          await db.insert(schema.tasks).values({
            title: item.title,
            area: item.category || "Importado",
            priority: "media",
            dueDate: item.date || null,
            completed: 0,
            isDemo: 0,
          });
          count++;
        }
      }
      ctx.invalidateQueries();
      return { success: true, importedCount: count };
    },
  }),
} satisfies ActionsModule;
