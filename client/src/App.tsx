import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { HomeView } from "./Home";
import { FinancasView } from "./Financas";
import { BemEstarView } from "./BemEstar";
import { CasaView } from "./Casa";
import { CrescerView } from "./Crescer";
import { ApoioDrawer } from "./Apoio";

type TabType = "home" | "bem-estar" | "casa" | "financas" | "crescer";
type ModalType =
  | null
  | "agenda"
  | "habito"
  | "tarefa"
  | "nota"
  | "transacao"
  | "meta"
  | "saude"
  | "treino"
  | "cuidado"
  | "humor"
  | "devocional"
  | "refeicao"
  | "item_mercado"
  | "manutencao_casa"
  | "rotina_filho"
  | "desejo_compra"
  | "cuidado_pet"
  | "contato_emergencia"
  | "projeto_trabalho"
  | "curso_estudo"
  | "livro"
  | "projeto_pessoal"
  | "viagem"
  | "documento"
  | "filme_serie"
  | "musica";

export function App() {
  const initialTab = (new URLSearchParams(window.location.search).get("tab") as TabType) || "home";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerInitialTab, setDrawerInitialTab] = useState<
    "visao360" | "consultor" | "pessoas" | "personalizar" | "backup" | "logs" | undefined
  >(undefined);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Busca Global / Command Palette (Cmd+K)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const { data: searchResultsData, isLoading: isSearching } = useQuery({
    queryKey: ["globalSearch", searchQuery],
    queryFn: () => api.globalSearch({ query: searchQuery }),
    enabled: searchQuery.trim().length > 0,
  });

  // Queries das áreas
  const { data: homeData, isLoading: isHomeLoading } = useQuery({
    queryKey: ["homeDashboard"],
    queryFn: () => api.getHomeDashboard({}),
  });

  const { data: financeData, isLoading: isFinanceLoading } = useQuery({
    queryKey: ["financeOverview"],
    queryFn: () => api.getFinanceOverview({}),
  });

  const { data: bemEstarData, isLoading: isBemEstarLoading } = useQuery({
    queryKey: ["bemEstarOverview"],
    queryFn: () => api.getBemEstarOverview({}),
  });

  const { data: casaData, isLoading: isCasaLoading } = useQuery({
    queryKey: ["casaOverview"],
    queryFn: () => api.getCasaOverview({}),
  });

  const { data: crescerData, isLoading: isCrescerLoading } = useQuery({
    queryKey: ["crescerOverview"],
    queryFn: () => api.getCrescerOverview({}),
  });

  // Carga inicial automática de dados de demonstração caso esteja tudo vazio
  const loadDemo = useMutation({
    mutationFn: () => api.loadDemoData({}),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  useEffect(() => {
    if (homeData && !homeData.hasDemoData && homeData.upcomingEvents.length === 0 && homeData.habits.length === 0) {
      loadDemo.mutate();
    }
  }, [homeData]);

  const handleTopPlusClick = () => {
    if (activeTab === "home") setModalType("agenda");
    else if (activeTab === "financas") setModalType("transacao");
    else if (activeTab === "bem-estar") setModalType("saude");
    else if (activeTab === "casa") setModalType("item_mercado");
    else if (activeTab === "crescer") setModalType("livro");
    else setModalType("nota");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-full sm:max-w-xl flex-col bg-[#FAF4E8] text-[#2E2019] shadow-sm selection:bg-[#F3E9D7] selection:text-[#CF6248] overflow-x-hidden">
      {/* ======================================================== */}
      {/* BARRA SUPERIOR FIXA */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E7DBC6]/80 bg-[#FAF4E8]/90 px-3 sm:px-4 backdrop-blur-md">
        {/* Avatar / Menu Lateral */}
        <button
          onClick={() => {
            setDrawerInitialTab(undefined);
            setIsDrawerOpen(true);
          }}
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E7DBC6] bg-[#2E2019] text-sm font-bold text-[#FAF4E8] shadow-xs transition hover:opacity-90"
          title="Menu do Usuário & Apoio"
        >
          M
        </button>

        {/* Título da Área Atual */}
        <div className="flex min-w-0 flex-1 items-center justify-center px-2 text-center">
          <h1 className="font-serif truncate text-lg sm:text-xl font-normal tracking-tight text-[#2E2019]">
            {activeTab === "home" && "Loma"}
            {activeTab === "bem-estar" && "Bem-estar"}
            {activeTab === "casa" && "Casa & Família"}
            {activeTab === "financas" && "Finanças"}
            {activeTab === "crescer" && "Crescer"}
            <span className="text-[#E8836B]">.</span>
          </h1>
        </div>

        {/* Ações do Topo Direito: Busca (Cmd+K) e Criação [+] */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border border-[#E7DBC6] bg-[#FAF4E8] text-sm text-[#2E2019] shadow-xs transition hover:bg-[#F3E9D7] active:scale-95"
            title="Busca global em todo o Loma (Cmd+K)"
          >
            🔍
          </button>
          <button
            onClick={handleTopPlusClick}
            className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-[#E8836B] text-xl font-medium text-white shadow-sm transition hover:bg-[#CF6248] active:scale-95"
            title="Novo registro"
          >
            +
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CONTEÚDO PRINCIPAL ROLÁVEL */}
      {/* ======================================================== */}
      <main className="flex-1 w-full max-w-full min-w-0 px-3 sm:px-4 pt-4 pb-24">
        {activeTab === "home" && (
          <HomeView
            data={homeData}
            isLoading={isHomeLoading}
            onOpenAddModal={(type) => setModalType(type)}
            onOpenDrawerTab={(dTab) => {
              setDrawerInitialTab(dTab as any);
              setIsDrawerOpen(true);
            }}
          />
        )}

        {activeTab === "bem-estar" && (
          <BemEstarView
            data={bemEstarData}
            isLoading={isBemEstarLoading}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === "financas" && (
          <FinancasView
            data={financeData}
            isLoading={isFinanceLoading}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === "casa" && (
          <CasaView
            data={casaData}
            isLoading={isCasaLoading}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === "crescer" && (
          <CrescerView
            data={crescerData}
            isLoading={isCrescerLoading}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* BARRA INFERIOR FIXA (5 ABAS — EXATAMENTE 20% CADA) */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex h-16 w-full max-w-full sm:max-w-xl items-center border-t border-[#E7DBC6] bg-[#FFFFFF]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md shadow-lg">
        {[
          { key: "home", label: "Home", icon: "⌂" },
          { key: "bem-estar", label: "Bem-estar", icon: "♡" },
          { key: "casa", label: "Casa", icon: "⊞" },
          { key: "financas", label: "Finanças", icon: "◇" },
          { key: "crescer", label: "Crescer", icon: "↗" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              style={{ width: "20%", minWidth: 0 }}
              className={`flex h-full flex-1 w-1/5 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 px-0.5 transition ${
                isActive ? "text-[#E8836B]" : "text-[#7A675A] hover:text-[#7A675A]"
              }`}
            >
              <span className={`text-base sm:text-lg leading-none ${isActive ? "font-bold text-[#E8836B]" : ""}`}>{tab.icon}</span>
              <span className={`text-[10px] leading-tight truncate w-full text-center ${isActive ? "font-bold text-[#2E2019]" : "font-medium"}`}>
                {tab.label}
              </span>
              {isActive && <span className="h-1 w-1 rounded-full bg-[#E8836B]" />}
            </button>
          );
        })}
      </nav>

      {/* ======================================================== */}
      {/* MENU GAVETA (DRAWER) DE APOIO */}
      {/* ======================================================== */}
      {isDrawerOpen && (
        <ApoioDrawer
          initialTab={drawerInitialTab}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      {/* ======================================================== */}
      {/* BUSCA GLOBAL / COMMAND PALETTE (CMD+K) */}
      {/* ======================================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-16 sm:pt-24 backdrop-blur-xs">
          <div className="flex w-full max-w-lg flex-col rounded-3xl border border-[#E7DBC6] bg-[#FAF4E8] p-4 shadow-2xl">
            {/* Input de busca */}
            <div className="flex items-center gap-2.5 border-b border-[#E7DBC6] pb-3">
              <span className="text-base text-[#7A675A]">🔍</span>
              <input
                autoFocus
                type="text"
                placeholder="Buscar compromisso, tarefa, gasto, receita, livro, exame..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#2E2019] placeholder-[#7A675A] focus:outline-hidden"
              />
              <kbd className="hidden sm:inline-block rounded-md border border-[#E7DBC6] bg-white px-2 py-0.5 text-[10px] font-bold text-[#7A675A]">
                ESC
              </kbd>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-sm font-bold text-[#7A675A] hover:text-[#2E2019] px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Resultados */}
            <div className="mt-3 max-h-80 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {searchQuery.trim().length === 0 ? (
                <p className="py-6 text-center text-xs text-[#7A675A]">
                  Digite qualquer palavra para buscar em tempo real por todo o Loma.
                </p>
              ) : isSearching ? (
                <p className="py-6 text-center text-xs text-[#7A675A]">Buscando...</p>
              ) : searchResultsData?.results.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#7A675A]">
                  Nenhum resultado encontrado para "{searchQuery}".
                </p>
              ) : (
                searchResultsData?.results.map((item) => (
                  <div
                    key={`${item.area}-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.targetTab as TabType);
                      if (item.targetSub) {
                        const url = new URL(window.location.href);
                        url.searchParams.set("tab", item.targetTab);
                        url.searchParams.set("sub", item.targetSub);
                        window.history.pushState({}, "", url.toString());
                      }
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#E7DBC6] bg-white p-3 transition hover:border-[#E8836B] hover:bg-[#FAF4E8]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#F3E9D7] px-2 py-0.5 text-[9px] font-bold uppercase text-[#7A675A]">
                          {item.area}
                        </span>
                        <h4 className="text-xs font-bold text-[#2E2019] truncate">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#7A675A] mt-0.5 truncate">{item.subtitle}</p>
                    </div>
                    <span className="text-xs text-[#E8836B] shrink-0 font-bold ml-2">→</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE CRIAÇÃO RÁPIDA (CONEXÃO COM [+] DO TOPO) */}
      {/* ======================================================== */}
      {modalType && (
        <CreateItemModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            queryClient.invalidateQueries();
          }}
        />
      )}
    </div>
  );
}

function CreateItemModal({
  type,
  onClose,
  onSuccess,
}: {
  type: ModalType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Geral");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState<"manha" | "tarde" | "noite" | "dia">("manha");
  const [priority, setPriority] = useState<"alta" | "media" | "baixa">("media");
  const [amountStr, setAmountStr] = useState("");
  const [txType, setTxType] = useState<"despesa" | "receita">("despesa");
  const [duration, setDuration] = useState(30);
  const [notesText, setNotesText] = useState("");
  const [moodChoice, setMoodChoice] = useState<"radiante" | "calmo" | "cansado" | "ansioso" | "desafiador">("calmo");
  const [energyLevel, setEnergyLevel] = useState(4);
  const [sleepHours, setSleepHours] = useState(8);
  const [mealDay, setMealDay] = useState<"segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo">("segunda");
  const [mealKind, setMealKind] = useState<"cafe" | "almoco" | "jantar" | "lanche">("almoco");
  const [healthKind, setHealthKind] = useState<"consulta" | "exame" | "medicamento" | "vacina" | "sinal_vital">("consulta");
  const [careKind, setCareKind] = useState<"pele" | "cabelo" | "corpo" | "unhas" | "descanso">("pele");
  const [devotionalKind, setDevotionalKind] = useState<"leitura" | "oracao" | "gratidao" | "meta_espiritual">("leitura");

  const addEvent = useMutation({
    mutationFn: () => api.addAgendaEvent({ title, date, time: time || undefined, category }),
    onSuccess,
  });

  const addHabit = useMutation({
    mutationFn: () => api.addHabit({ title, period }),
    onSuccess,
  });

  const addTask = useMutation({
    mutationFn: () => api.addTask({ title, area: category, priority, dueDate: date || undefined }),
    onSuccess,
  });

  const addNote = useMutation({
    mutationFn: () => api.addNote({ title, content, moduleOrigin: category, tags: "" }),
    onSuccess,
  });

  const addTransaction = useMutation({
    mutationFn: () => {
      const cents = Math.round(parseFloat(amountStr.replace(",", ".")) * 100);
      const finalAmount = txType === "despesa" ? -Math.abs(cents) : Math.abs(cents);
      return api.addFinanceTransaction({
        description: title,
        amount: finalAmount,
        type: txType,
        category: category || "Geral",
        date,
      });
    },
    onSuccess,
  });

  const addGoal = useMutation({
    mutationFn: () => {
      const cents = Math.round(parseFloat(amountStr.replace(",", ".")) * 100);
      return api.addFinanceGoal({
        title,
        targetAmount: cents,
        category: category || "Reserva",
      });
    },
    onSuccess,
  });

  const addHealth = useMutation({
    mutationFn: () =>
      api.addHealthRecord({
        title,
        type: healthKind,
        date,
        doctorOrClinic: notesText || undefined,
        details: content || undefined,
      }),
    onSuccess,
  });

  const addWorkoutMutation = useMutation({
    mutationFn: () =>
      api.addWorkout({
        title,
        category: (category as any) || "musculacao",
        date,
        durationMinutes: duration,
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addCare = useMutation({
    mutationFn: () =>
      api.addCareRoutine({
        title,
        category: careKind,
        frequency: "diario",
      }),
    onSuccess,
  });

  const addMood = useMutation({
    mutationFn: () =>
      api.addMoodLog({
        mood: moodChoice,
        energyLevel,
        sleepHours,
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addDevotionalMutation = useMutation({
    mutationFn: () =>
      api.addDevotional({
        title,
        passageOrVerse: notesText || undefined,
        reflection: content || undefined,
        type: devotionalKind,
        date,
      }),
    onSuccess,
  });

  const addMeal = useMutation({
    mutationFn: () =>
      api.addMealPlan({
        title,
        mealType: mealKind,
        dayOfWeek: mealDay,
        recipeOrIngredients: content || undefined,
      }),
    onSuccess,
  });

  const addGroceryMutation = useMutation({
    mutationFn: () =>
      api.addGroceryItem({
        name: title,
        category: (category as any) || "despensa",
        quantity: amountStr || "1",
        unit: "un",
        isEssential: false,
      }),
    onSuccess,
  });

  const addHomeMaintMutation = useMutation({
    mutationFn: () =>
      api.addHomeMaintenance({
        title,
        room: category || "Geral",
        dueDate: date || undefined,
        costCents: Math.round(parseFloat(amountStr.replace(",", ".") || "0") * 100),
        priority: "media",
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addChildRoutineMutation = useMutation({
    mutationFn: () =>
      api.addChildRoutine({
        title,
        category: (category as any) || "escola",
        date: date || new Date().toISOString().slice(0, 10),
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addWishlistMutation = useMutation({
    mutationFn: () =>
      api.addWishlistItem({
        title,
        category: (category as any) || "casa",
        estimatedCostCents: Math.round(parseFloat(amountStr.replace(",", ".") || "0") * 100),
        priority: "media",
        status: "desejo",
        linkOrStore: notesText || undefined,
      }),
    onSuccess,
  });

  const addPetCareMutation = useMutation({
    mutationFn: () =>
      api.addPetCareRecord({
        petId: 1,
        title,
        type: (category as any) || "consulta",
        date: date || new Date().toISOString().slice(0, 10),
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addEmergencyContactMutation = useMutation({
    mutationFn: () =>
      api.addEmergencyContact({
        name: title,
        roleOrRelation: category || "Emergência",
        phone: notesText || "192",
        addressOrDetails: content || undefined,
      }),
    onSuccess,
  });

  const addWorkMutation = useMutation({
    mutationFn: () =>
      api.addWorkProject({
        title,
        clientOrCompany: notesText || undefined,
        area: category || "Desenvolvimento",
        status: "em_andamento",
        feeCents: Math.round(parseFloat(amountStr.replace(",", ".") || "0") * 100),
        deadline: date || undefined,
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addCourseMutation = useMutation({
    mutationFn: () =>
      api.addStudyCourse({
        title,
        platformOrInstitution: notesText || undefined,
        category: category || "tecnologia",
        progressPercent: 0,
        totalHours: parseInt(amountStr) || 40,
        completedHours: 0,
        status: "em_andamento",
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addBookMutation = useMutation({
    mutationFn: () =>
      api.addReadingBook({
        title,
        author: notesText || "Autor",
        category: category || "desenvolvimento",
        status: "lendo",
        rating: 5,
        currentPage: 0,
        totalPages: parseInt(amountStr) || 250,
        reviewOrNotes: content || undefined,
      }),
    onSuccess,
  });

  const addProjectMutation = useMutation({
    mutationFn: () =>
      api.addPersonalProject({
        title,
        category: category || "autoral",
        status: "em_andamento",
        progressPercent: 0,
        deadline: date || undefined,
        nextMilestone: notesText || undefined,
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addTripMutation = useMutation({
    mutationFn: () =>
      api.addTrip({
        destination: title,
        startDate: date || new Date().toISOString().slice(0, 10),
        endDate: notesText || date || new Date().toISOString().slice(0, 10),
        status: "planejada",
        budgetEstimatedCents: Math.round(parseFloat(amountStr.replace(",", ".") || "0") * 100),
        accommodation: category || undefined,
        checklistItems: content || undefined,
      }),
    onSuccess,
  });

  const addDocumentMutation = useMutation({
    mutationFn: () =>
      api.addPersonalDocument({
        title,
        personName: notesText || "Marcos",
        category: category || "identidade",
        documentNumber: amountStr || undefined,
        expirationDate: date || undefined,
        renewalAlert: 1,
        notes: content || undefined,
      }),
    onSuccess,
  });

  const addMediaMutation = useMutation({
    mutationFn: () =>
      api.addCulturalMedia({
        title,
        type: (category as any) || "filme",
        platform: notesText || "Netflix",
        status: "assistindo",
        rating: 5,
        genre: content || undefined,
      }),
    onSuccess,
  });

  const addMusicMutation = useMutation({
    mutationFn: () =>
      api.addMusicTrack({
        title,
        artistOrCurator: notesText || "Loma Curadoria",
        momentOrMood: (category as any) || "foco",
        playlistOrAlbum: content || undefined,
        platform: "Spotify",
        isFavorite: true,
      }),
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && type !== "humor") return;

    if (type === "agenda") addEvent.mutate();
    else if (type === "habito") addHabit.mutate();
    else if (type === "tarefa") addTask.mutate();
    else if (type === "nota") addNote.mutate();
    else if (type === "transacao") addTransaction.mutate();
    else if (type === "meta") addGoal.mutate();
    else if (type === "saude") addHealth.mutate();
    else if (type === "treino") addWorkoutMutation.mutate();
    else if (type === "cuidado") addCare.mutate();
    else if (type === "humor") addMood.mutate();
    else if (type === "devocional") addDevotionalMutation.mutate();
    else if (type === "refeicao") addMeal.mutate();
    else if (type === "item_mercado") addGroceryMutation.mutate();
    else if (type === "manutencao_casa") addHomeMaintMutation.mutate();
    else if (type === "rotina_filho") addChildRoutineMutation.mutate();
    else if (type === "desejo_compra") addWishlistMutation.mutate();
    else if (type === "cuidado_pet") addPetCareMutation.mutate();
    else if (type === "contato_emergencia") addEmergencyContactMutation.mutate();
    else if (type === "projeto_trabalho") addWorkMutation.mutate();
    else if (type === "curso_estudo") addCourseMutation.mutate();
    else if (type === "livro") addBookMutation.mutate();
    else if (type === "projeto_pessoal") addProjectMutation.mutate();
    else if (type === "viagem") addTripMutation.mutate();
    else if (type === "documento") addDocumentMutation.mutate();
    else if (type === "filme_serie") addMediaMutation.mutate();
    else if (type === "musica") addMusicMutation.mutate();
  };

  const getModalTitle = () => {
    switch (type) {
      case "agenda": return "Novo Compromisso na Agenda";
      case "habito": return "Novo Hábito de Rotina";
      case "tarefa": return "Nova Tarefa Prioritária";
      case "nota": return "Nova Nota Agregada";
      case "transacao": return "Novo Lançamento Financeiro";
      case "meta": return "Nova Meta Financeira";
      case "saude": return "Novo Registro de Saúde";
      case "treino": return "Novo Treino / Atividade";
      case "cuidado": return "Nova Rotina de Autocuidado";
      case "humor": return "Registrar Humor & Sono";
      case "devocional": return "Novo Devocional / Oração";
      case "refeicao": return "Nova Refeição / Receita";
      case "item_mercado": return "Novo Item de Mercado";
      case "manutencao_casa": return "Nova Manutenção da Casa";
      case "rotina_filho": return "Novo Registro do Filho";
      case "desejo_compra": return "Novo Desejo de Compra";
      case "cuidado_pet": return "Novo Cuidado com Pet";
      case "contato_emergencia": return "Novo Contato de Emergência";
      case "projeto_trabalho": return "Novo Trabalho / Contrato";
      case "curso_estudo": return "Novo Curso / Estudo";
      case "livro": return "Novo Livro na Estante";
      case "projeto_pessoal": return "Novo Projeto Autoral";
      case "viagem": return "Nova Viagem Familiar";
      case "documento": return "Novo Documento Pessoal";
      case "filme_serie": return "Novo Filme / Série";
      case "musica": return "Nova Faixa / Playlist";
      default: return "Criar Registro";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl border border-[#E7DBC6] bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E7DBC6] pb-3">
          <h3 className="font-serif text-base font-bold text-[#2E2019]">{getModalTitle()}</h3>
          <button onClick={onClose} className="cursor-pointer text-sm text-[#7A675A] hover:text-[#2E2019]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-xs">
          {type !== "humor" && (
            <div>
              <label className="block font-medium text-[#7A675A]">Título / Nome</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consulta, Treino, Salmo 23..."
                className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5 text-xs text-[#2E2019] focus:border-[#E8836B] focus:outline-hidden"
              />
            </div>
          )}

          {/* SAÚDE */}
          {type === "saude" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Tipo</label>
                  <select
                    value={healthKind}
                    onChange={(e) => setHealthKind(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="exame">Exame</option>
                    <option value="vacina">Vacina</option>
                    <option value="medicamento">Medicamento</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Médico / Clínica</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Arnaldo Silveira"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* TREINO */}
          {type === "treino" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Modalidade</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="musculacao">Musculação</option>
                    <option value="corrida">Corrida</option>
                    <option value="caminhada">Caminhada</option>
                    <option value="natacao">Natação</option>
                    <option value="ciclismo">Ciclismo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Duração (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Observações / Cargas (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ex: Supino 3x10, sensação de força..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* CUIDADO */}
          {type === "cuidado" && (
            <div>
              <label className="block font-medium text-[#7A675A]">Área de Cuidado</label>
              <select
                value={careKind}
                onChange={(e) => setCareKind(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
              >
                <option value="pele">Pele / Skincare</option>
                <option value="cabelo">Cabelo</option>
                <option value="corpo">Corpo / Alongamento</option>
                <option value="unhas">Unhas</option>
                <option value="descanso">Descanso & Massagem</option>
              </select>
            </div>
          )}

          {/* HUMOR */}
          {type === "humor" && (
            <>
              <div>
                <label className="block font-medium text-[#7A675A]">Como você está se sentindo?</label>
                <select
                  value={moodChoice}
                  onChange={(e) => setMoodChoice(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5 text-xs font-semibold"
                >
                  <option value="radiante">☀️ Radiante e entusiasmado</option>
                  <option value="calmo">🌿 Calmo e equilibrado</option>
                  <option value="cansado">🌙 Cansado com sono</option>
                  <option value="ansioso">⚡ Ansioso / agitado</option>
                  <option value="desafiador">🔥 Em dia desafiador</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Energia (1 a 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value) || 3)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Sono (horas)</label>
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseInt(e.target.value) || 8)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Reflexão do dia</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="O que influenciou seu humor hoje?"
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* DEVOCIONAL */}
          {type === "devocional" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Tipo</label>
                  <select
                    value={devotionalKind}
                    onChange={(e) => setDevotionalKind(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="leitura">Leitura Bíblica</option>
                    <option value="oracao">Oração</option>
                    <option value="gratidao">Motivo de Gratidão</option>
                    <option value="meta_espiritual">Meta Espiritual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Passagem / Versículo</label>
                  <input
                    type="text"
                    placeholder="Ex: Salmo 23:1"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Reflexão (vai para Notas Agregadas)</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="O que Deus falou ao seu coração hoje?"
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs focus:border-[#E8836B] focus:outline-hidden"
                />
              </div>
            </>
          )}

          {/* REFEIÇÃO / COZINHA */}
          {type === "refeicao" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Refeição</label>
                  <select
                    value={mealKind}
                    onChange={(e) => setMealKind(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="almoco">Almoço</option>
                    <option value="jantar">Jantar</option>
                    <option value="cafe">Café da Manhã</option>
                    <option value="lanche">Lanche</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Dia da Semana</label>
                  <select
                    value={mealDay}
                    onChange={(e) => setMealDay(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs capitalize"
                  >
                    {["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Ingredientes / Modo de Preparo</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ex: Arroz, salmão grelhado, brócolis ao vapor..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* CAMPOS DA FASE 3 (CASA E FAMÍLIA) */}
          {type === "item_mercado" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#7A675A]">Categoria</label>
                <select
                  value={category || "despensa"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                >
                  <option value="despensa">Despensa</option>
                  <option value="hortifruti">Hortifrúti</option>
                  <option value="laticinios">Laticínios</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="higiene">Higiene</option>
                  <option value="bebidas">Bebidas</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Quantidade</label>
                <input
                  type="text"
                  placeholder="Ex: 2 pct, 1 kg"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </div>
          )}

          {type === "manutencao_casa" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Cômodo</label>
                  <select
                    value={category || "Geral"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Cozinha">Cozinha</option>
                    <option value="Sala">Sala</option>
                    <option value="Quarto">Quarto</option>
                    <option value="Banheiro">Banheiro</option>
                    <option value="Quintal">Quintal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Prazo</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Custo Estimado (R$)</label>
                <input
                  type="text"
                  placeholder="Ex: 150,00"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Observações (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detalhes técnicos, peças ou profissional..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {type === "rotina_filho" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Categoria</label>
                  <select
                    value={category || "escola"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="escola">Escola</option>
                    <option value="atividade">Atividade</option>
                    <option value="saude">Saúde</option>
                    <option value="pedagogico">Pedagógico</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Notas Pedagógicas (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Observações do desenvolvimento, notas..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {type === "desejo_compra" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Categoria</label>
                  <select
                    value={category || "casa"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="casa">Casa</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="criancas">Crianças</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Preço Estimado (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 450,00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Loja ou Referência</label>
                <input
                  type="text"
                  placeholder="Ex: Amazon, Mercado Livre, Decathlon..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {type === "cuidado_pet" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Tipo de Cuidado</label>
                  <select
                    value={category || "consulta"}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="vacina">Vacina</option>
                    <option value="consulta">Veterinário</option>
                    <option value="banho">Banho & Tosa</option>
                    <option value="vermifugo">Vermífugo</option>
                    <option value="antipulgas">Antipulgas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Observações (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Clínica, peso, dosagem..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {type === "contato_emergencia" && (
            <>
              <div>
                <label className="block font-medium text-[#7A675A]">Relação / Função</label>
                <input
                  type="text"
                  placeholder="Ex: SAMU 192, Pediatra, Chaveiro 24h, Vizinho..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Telefone / Contato</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 98765-4321 ou 192"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Endereço / Observações</label>
                <input
                  type="text"
                  placeholder="Detalhes ou endereço..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* CAMPOS DA FASE 1 (AGENDA, HÁBITO, TAREFA, NOTA, FINANÇAS) */}
          {type === "agenda" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#7A675A]">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Horário</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </div>
          )}

          {type === "habito" && (
            <div>
              <label className="block font-medium text-[#7A675A]">Período do Dia</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
              >
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
                <option value="dia">O dia todo</option>
              </select>
            </div>
          )}

          {type === "tarefa" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#7A675A]">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Data Limite</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </div>
          )}

          {type === "nota" && (
            <>
              <div>
                <label className="block font-medium text-[#7A675A]">Módulo de Origem</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                >
                  <option value="Geral">Geral</option>
                  <option value="Devocional">Devocional</option>
                  <option value="Treinos">Treinos</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Finanças">Finanças</option>
                  <option value="Casa">Casa</option>
                  <option value="Livros">Livros</option>
                  <option value="Projetos">Projetos</option>
                  <option value="Viagens">Viagens</option>
                  <option value="Trabalho">Trabalho</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Conteúdo da Anotação</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva a anotação aqui..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs focus:border-[#E8836B] focus:outline-hidden"
                />
              </div>
            </>
          )}

          {/* TRABALHO */}
          {type === "projeto_trabalho" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Cliente / Empresa</label>
                  <input
                    type="text"
                    placeholder="Ex: Fintech Alpha"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Área</label>
                  <input
                    type="text"
                    placeholder="Ex: Desenvolvimento"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Honorários (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 5.000,00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Escopo / Anotações</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detalhes da entrega..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* ESTUDOS */}
          {type === "curso_estudo" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Plataforma / Instituição</label>
                  <input
                    type="text"
                    placeholder="Ex: Alura / Coursera"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Carga Horária (h)</label>
                  <input
                    type="number"
                    placeholder="Ex: 60"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                >
                  <option value="tecnologia">Tecnologia</option>
                  <option value="idiomas">Idiomas</option>
                  <option value="negocios">Negócios</option>
                  <option value="espiritual">Espiritual</option>
                  <option value="pessoal">Desenvolvimento Pessoal</option>
                </select>
              </div>
            </>
          )}

          {/* LIVROS */}
          {type === "livro" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Autor(a)</label>
                  <input
                    type="text"
                    placeholder="Ex: James Clear"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Total de Páginas</label>
                  <input
                    type="number"
                    placeholder="Ex: 320"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Resenha / Citação (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Trecho marcante ou aprendizado central..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* PROJETOS */}
          {type === "projeto_pessoal" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Próximo Marco</label>
                  <input
                    type="text"
                    placeholder="Ex: Lançamento v1.0"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Prazo Alvo</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Observações / Ideias (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escopo do projeto..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* VIAGEM */}
          {type === "viagem" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Data Início</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Data Término</label>
                  <input
                    type="date"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Hospedagem</label>
                  <input
                    type="text"
                    placeholder="Ex: Pousada Vila Inglesa"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Orçamento (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 4.500,00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Checklist de Bagagem / Roteiro (vai para Notas)</label>
                <textarea
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ex: Casacos de frio, documentos, passeios..."
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* DOCUMENTO */}
          {type === "documento" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Titular</label>
                  <select
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="Marcos">Marcos</option>
                    <option value="Ana">Ana</option>
                    <option value="Sofia">Sofia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Data de Validade</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Número / Registro</label>
                <input
                  type="text"
                  placeholder="Ex: BR-984210"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* FILMES & SÉRIES */}
          {type === "filme_serie" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Tipo</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="filme">Filme</option>
                    <option value="serie">Série</option>
                    <option value="documentario">Documentário</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Plataforma</label>
                  <input
                    type="text"
                    placeholder="Ex: Netflix, Apple TV+"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Gênero / Recomendação</label>
                <input
                  type="text"
                  placeholder="Ex: Ficção Científica • Recomendado por Ana"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {/* MÚSICA */}
          {type === "musica" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#7A675A]">Artista / Curador</label>
                  <input
                    type="text"
                    placeholder="Ex: Loma Curadoria"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A675A]">Momento / Humor</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                  >
                    <option value="foco">Foco</option>
                    <option value="calma">Calma</option>
                    <option value="louvor">Louvor</option>
                    <option value="familia">Família</option>
                    <option value="treino">Treino</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Álbum / Playlist</label>
                <input
                  type="text"
                  placeholder="Ex: Trabalho Sereno"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs"
                />
              </div>
            </>
          )}

          {(type === "transacao" || type === "meta") && (
            <>
              {type === "transacao" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType("despesa")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition ${
                      txType === "despesa" ? "bg-[#CF6248] text-white" : "bg-[#F3E9D7] text-[#7A675A]"
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType("receita")}
                    className={`flex-1 rounded-xl py-1.5 font-bold transition ${
                      txType === "receita" ? "bg-[#7D8C6F] text-white" : "bg-[#F3E9D7] text-[#7A675A]"
                    }`}
                  >
                    Receita
                  </button>
                </div>
              )}
              <div>
                <label className="block font-medium text-[#7A675A]">Valor (R$)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 150,00"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs tabular-nums focus:border-[#E8836B] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-[#7A675A]">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Moradia, Mercado, Saúde, Lazer..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2 text-xs focus:border-[#E8836B] focus:outline-hidden"
                />
              </div>
            </>
          )}

          <div className="mt-3 flex justify-end gap-2 border-t border-[#E7DBC6] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl bg-[#F3E9D7] px-3 py-2 font-medium text-[#7A675A] hover:bg-[#E7DBC6]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#E8836B] px-4 py-2 font-bold text-white shadow-xs transition hover:bg-[#CF6248]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
