import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type DashboardData = ApiResponse<typeof api, "getHomeDashboard">;

interface HomeProps {
  data?: DashboardData;
  isLoading: boolean;
  onOpenAddModal: (area: "agenda" | "habito" | "tarefa" | "nota") => void;
  onOpenDrawerTab?: (tab: string) => void;
}

// ========================================================
// COMPONENTE CANÔNICO: CARTÃO LOMA (PADRÃO REDUZIDO & EXPANSÍVEL)
// ========================================================
function LomaCard({
  title,
  meta,
  category,
  isCompleted,
  onToggle,
  onDelete,
  children,
  badge,
}: {
  id?: string | number;
  title: string;
  meta?: React.ReactNode;
  category?: string;
  isCompleted?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] transition-all overflow-hidden ${
        isCompleted ? "opacity-75 bg-[#FAF7F2]" : ""
      }`}
    >
      {/* Cabeçalho do Cartão Fechado (min-h ≈62-64px, py-3 px-4) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex min-h-[62px] items-center justify-between gap-3 py-3 px-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {onToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="min-w-[40px] min-h-[40px] -ml-1 flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Concluir"
            >
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-[#3B7A6B] border-[#3B7A6B] text-white"
                    : "border-[#DDD2C3] bg-white hover:border-[#C47882]"
                }`}
              >
                {isCompleted && "✓"}
              </div>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h4
              className={`text-[16px] font-semibold leading-tight truncate ${
                isCompleted ? "line-through text-[#9B8F85]" : "text-[#2C241E]"
              }`}
            >
              {title}
            </h4>
            {(meta || category) && (
              <div className="text-[13px] text-[#7C6E62] truncate mt-0.5 flex items-center gap-1.5">
                {category && <span className="font-medium text-[#9E6123]">{category} •</span>}
                {meta}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge}
          <span className={`text-[#A89A8E] text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Sanfona / Detalhe Expansível */}
      {isExpanded && (
        <div className="border-t border-[#F2ECE3] bg-[#FAF7F2]/60 px-4 py-3 text-xs flex flex-col gap-2.5">
          {children}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE5D5]">
            {onToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="h-10 px-4 rounded-full bg-[#EAE2D6] text-[#2C241E] font-medium text-xs hover:bg-[#DDD2C3] transition cursor-pointer"
              >
                {isCompleted ? "Reabrir" : "Marcar Concluído"}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-10 px-4 rounded-full bg-[#F8ECEE] text-[#B36670] font-medium text-xs hover:bg-[#F2D7DB] transition cursor-pointer"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function HomeView({ data, isLoading, onOpenAddModal, onOpenDrawerTab }: HomeProps) {
  const [subTab, setSubTab] = useState<"inicio" | "agenda" | "habitos" | "tarefas" | "notas">("inicio");
  const queryClient = useQueryClient();

  const { data: intelData } = useQuery({
    queryKey: ["inteligenciaOverview"],
    queryFn: () => api.getInteligenciaOverview({}),
  });

  const dismissAlert = useMutation({
    mutationFn: (id: number) => api.dismissSmartAlert({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inteligenciaOverview"] });
    },
  });

  const executeAlert = useMutation({
    mutationFn: (id: number) => api.executeSmartAlertAction({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inteligenciaOverview"] });
      refresh();
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
    queryClient.invalidateQueries({ queryKey: ["agendaEvents"] });
    queryClient.invalidateQueries({ queryKey: ["habits"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    queryClient.invalidateQueries({ queryKey: ["financeOverview"] });
  };

  const loadDemo = useMutation({
    mutationFn: () => api.loadDemoData({}),
    onSuccess: refresh,
  });

  const clearDemo = useMutation({
    mutationFn: () => api.clearDemoData({}),
    onSuccess: refresh,
  });

  const toggleEvent = useMutation({
    mutationFn: (id: number) => api.toggleAgendaEvent({ id }),
    onSuccess: refresh,
  });

  const deleteEvent = useMutation({
    mutationFn: (id: number) => api.deleteAgendaEvent({ id }),
    onSuccess: refresh,
  });

  const toggleHabit = useMutation({
    mutationFn: (id: number) => api.toggleHabitToday({ id }),
    onSuccess: refresh,
  });

  const deleteHabit = useMutation({
    mutationFn: (id: number) => api.deleteHabit({ id }),
    onSuccess: refresh,
  });

  const toggleTask = useMutation({
    mutationFn: (id: number) => api.toggleTask({ id }),
    onSuccess: refresh,
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.deleteTask({ id }),
    onSuccess: refresh,
  });

  const deleteNote = useMutation({
    mutationFn: (id: number) => api.deleteNote({ id }),
    onSuccess: refresh,
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando dia...</span>
      </div>
    );
  }

  const { upcomingEvents, habits, tasks, financeBrief, hasDemoData, todayDate } = data;

  const completedHabitsCount = habits.filter((h) => h.completedToday === 1).length;
  const pendingTasksCount = tasks.filter((t) => t.completed === 0).length;

  // Ordenação: não concluídos primeiro, concluídos ao fim da lista
  const sortedEvents = upcomingEvents
    .slice()
    .sort((a, b) => (a.status === "concluido" ? 1 : 0) - (b.status === "concluido" ? 1 : 0));

  const sortedHabits = habits
    .slice()
    .sort((a, b) => a.completedToday - b.completedToday);

  const sortedTasks = tasks
    .slice()
    .sort((a, b) => a.completed - b.completed);

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Banner de Demonstração */}
      <div className="rounded-[24px] border border-[#EFE5D5] bg-[#FFFDF8] p-3 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#C47882]" />
            <p className="text-xs font-medium text-[#6E6259]">
              {hasDemoData ? (
                <>
                  <strong className="text-[#231B16]">Dados de Exemplo Ativos:</strong> Família fictícia brasileira
                </>
              ) : (
                <>Base vazia para seus registros ou teste com dados simulados.</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {hasDemoData ? (
              <button
                onClick={() => clearDemo.mutate()}
                disabled={clearDemo.isPending}
                className="h-10 px-3 cursor-pointer rounded-full bg-[#F8ECEE] text-[11px] font-semibold text-[#B36670] transition hover:bg-[#C47882] hover:text-white"
              >
                {clearDemo.isPending ? "Limpando..." : "Limpar exemplo"}
              </button>
            ) : (
              <button
                onClick={() => loadDemo.mutate()}
                disabled={loadDemo.isPending}
                className="h-10 px-3 cursor-pointer rounded-full bg-[#E9F3F0] text-[11px] font-semibold text-[#3B7A6B] transition hover:bg-[#3B7A6B] hover:text-white"
              >
                {loadDemo.isPending ? "Carregando..." : "Carregar exemplo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navegação Secundária (Pills) */}
      <div className="flex gap-2 overflow-x-auto py-1 text-xs">
        {[
          { key: "inicio", label: "Início" },
          { key: "agenda", label: "Agenda & Aniversários" },
          { key: "habitos", label: "Hábitos" },
          { key: "tarefas", label: "Tarefas" },
          { key: "notas", label: "Notas" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSubTab(item.key as any)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 font-medium transition ${
              subTab === item.key
                ? "bg-[#231B16] text-[#FAF7F2] shadow-xs"
                : "bg-[#F2ECE3] text-[#6E6259] hover:bg-[#EAE2D6]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* SUB-ABA: INÍCIO (PAINEL DO DIA) */}
      {/* ======================================================== */}
      {subTab === "inicio" && (
        <div className="flex flex-col gap-4">
          {/* Herói com padding 16px e raio 24px */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#231B16] p-4 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.3) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#C47882] uppercase">Seu Dia no Loma</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#FAF7F2]/80 tabular-nums">
                  {todayDate}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2] leading-tight">
                  A vida organizada, com calma e propósito<span className="text-[#C47882]">.</span>
                </h2>
                <p className="mt-1 text-xs text-[#FAF7F2]/70">
                  {pendingTasksCount === 0 && completedHabitsCount === habits.length
                    ? "Tudo em dia por aqui hoje!"
                    : `${pendingTasksCount} tarefa(s) pendente(s) e ${completedHabitsCount}/${habits.length} hábito(s) concluído(s).`}
                </p>
              </div>

              {/* 3 Métricas Hero */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/10 pt-2.5 text-center">
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Agenda 14d</span>
                  <span className="text-base sm:text-lg font-bold text-[#FAF7F2] tabular-nums truncate w-full">{upcomingEvents.length}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Hábitos Hoje</span>
                  <span className="text-base sm:text-lg font-bold text-[#C47882] tabular-nums truncate w-full">
                    {completedHabitsCount}/{habits.length}
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Disponível</span>
                  <span className="text-base sm:text-lg font-bold text-[#E9F3F0] tabular-nums truncate w-full">
                    R$ {(financeBrief.availableBalance / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inteligência Conectada — Alertas Proativos */}
          {intelData && intelData.smartAlerts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Inteligência Conectada</h3>
                {onOpenDrawerTab && (
                  <button
                    onClick={() => onOpenDrawerTab("visao360")}
                    className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
                  >
                    Visão 360° →
                  </button>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                {intelData.smartAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            alert.severity === "urgente"
                              ? "bg-[#F8ECEE] text-[#B36670]"
                              : alert.severity === "aviso"
                              ? "bg-[#FFF4E5] text-[#9A6700]"
                              : "bg-[#E9F3F0] text-[#3B7A6B]"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">{alert.title}</h4>
                      </div>
                      <button
                        onClick={() => dismissAlert.mutate(alert.id)}
                        className="text-[#9B8F85] hover:text-[#231B16] text-xs px-2 cursor-pointer"
                        title="Dispensar alerta"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[13px] text-[#7C6E62] leading-relaxed">{alert.message}</p>

                    {alert.actionLabel && (
                      <div className="mt-1 flex items-center gap-2 pt-2 border-t border-[#EFE5D5]">
                        <button
                          onClick={() => executeAlert.mutate(alert.id)}
                          disabled={executeAlert.isPending}
                          className="h-11 px-4 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                        >
                          {alert.actionLabel}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Compromissos (Agenda) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Próximos Compromissos</h3>
              <button
                onClick={() => onOpenAddModal("agenda")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Adicionar
              </button>
            </div>

            {sortedEvents.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhum compromisso nos próximos 14 dias.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {sortedEvents.slice(0, 4).map((event) => (
                  <LomaCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    category={event.category}
                    meta={`${event.date}${event.time ? ` • ${event.time}` : ""}`}
                    isCompleted={event.status === "concluido"}
                    onToggle={() => toggleEvent.mutate(event.id)}
                    onDelete={() => deleteEvent.mutate(event.id)}
                  >
                    <p className="text-xs text-[#6E6259]">
                      Compromisso registrado na categoria {event.category}. Data: {event.date} {event.time ? `às ${event.time}` : ""}.
                    </p>
                  </LomaCard>
                ))}
              </div>
            )}
          </div>

          {/* Hábitos de Hoje */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Hábitos do Dia</h3>
              <button
                onClick={() => onOpenAddModal("habito")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Novo
              </button>
            </div>

            {sortedHabits.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhum hábito cadastrado para a rotina.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {sortedHabits.map((habit) => (
                  <LomaCard
                    key={habit.id}
                    id={habit.id}
                    title={habit.title}
                    category={habit.period}
                    meta={`🔥 ${habit.streak} dias seguidos`}
                    isCompleted={habit.completedToday === 1}
                    onToggle={() => toggleHabit.mutate(habit.id)}
                    onDelete={() => deleteHabit.mutate(habit.id)}
                    badge={
                      <span className="rounded-full bg-[#FBF2E6] px-2.5 py-1 text-[11px] font-semibold text-[#9E6123] tabular-nums">
                        🔥 {habit.streak}d
                      </span>
                    }
                  >
                    <p className="text-xs text-[#6E6259]">
                      Hábito programado para o período {habit.period}. Sequência atual mantida com constância.
                    </p>
                  </LomaCard>
                ))}
              </div>
            )}
          </div>

          {/* Tarefas Prioritárias */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Tarefas Prioritárias</h3>
              <button
                onClick={() => onOpenAddModal("tarefa")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Adicionar
              </button>
            </div>

            {sortedTasks.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhuma tarefa pendente no momento.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {sortedTasks.slice(0, 4).map((task) => (
                  <LomaCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    category={task.area}
                    meta={task.dueDate ? `Prazo: ${task.dueDate}` : undefined}
                    isCompleted={task.completed === 1}
                    onToggle={() => toggleTask.mutate(task.id)}
                    onDelete={() => deleteTask.mutate(task.id)}
                    badge={
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === "alta"
                            ? "bg-[#F8ECEE] text-[#B36670]"
                            : task.priority === "media"
                            ? "bg-[#FBF2E6] text-[#9E6123]"
                            : "bg-[#EDF1F5] text-[#465768]"
                        }`}
                      >
                        {task.priority}
                      </span>
                    }
                  >
                    <p className="text-xs text-[#6E6259]">
                      Área: {task.area} • Prioridade: {task.priority}. {task.dueDate ? `Prazo de conclusão: ${task.dueDate}.` : "Sem prazo fixo definido."}
                    </p>
                  </LomaCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: AGENDA COMPLETA */}
      {/* ======================================================== */}
      {subTab === "agenda" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Agenda & Aniversários</h3>
            <button
              onClick={() => onOpenAddModal("agenda")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27]"
            >
              + Compromisso
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#9B8F85]">Nenhum compromisso cadastrado.</p>
          ) : (
            <div className="flex flex-col space-y-2">
              {sortedEvents.map((event) => (
                <LomaCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  category={event.category}
                  meta={`Data: ${event.date} ${event.time ? `às ${event.time}` : ""}`}
                  isCompleted={event.status === "concluido"}
                  onToggle={() => toggleEvent.mutate(event.id)}
                  onDelete={() => deleteEvent.mutate(event.id)}
                >
                  <p className="text-xs text-[#6E6259]">
                    Compromisso familiar registrado para {event.date}.
                  </p>
                </LomaCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: HÁBITOS COMPLETA */}
      {/* ======================================================== */}
      {subTab === "habitos" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Hábitos & Rotina</h3>
            <button
              onClick={() => onOpenAddModal("habito")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27]"
            >
              + Hábito
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedHabits.map((habit) => (
              <LomaCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                category={habit.period}
                meta={`Sequência: 🔥 ${habit.streak} dias seguidos`}
                isCompleted={habit.completedToday === 1}
                onToggle={() => toggleHabit.mutate(habit.id)}
                onDelete={() => deleteHabit.mutate(habit.id)}
                badge={
                  <span className="rounded-full bg-[#FBF2E6] px-2.5 py-1 text-[11px] font-semibold text-[#9E6123] tabular-nums">
                    🔥 {habit.streak}d
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
                  Rotina configurada para o período: {habit.period}.
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: TAREFAS COMPLETA */}
      {/* ======================================================== */}
      {subTab === "tarefas" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Tarefas da Vida</h3>
            <button
              onClick={() => onOpenAddModal("tarefa")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27]"
            >
              + Tarefa
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedTasks.map((task) => (
              <LomaCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.area}
                meta={task.dueDate ? `Prazo: ${task.dueDate}` : undefined}
                isCompleted={task.completed === 1}
                onToggle={() => toggleTask.mutate(task.id)}
                onDelete={() => deleteTask.mutate(task.id)}
                badge={
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === "alta"
                        ? "bg-[#F8ECEE] text-[#B36670]"
                        : task.priority === "media"
                        ? "bg-[#FBF2E6] text-[#9E6123]"
                        : "bg-[#EDF1F5] text-[#465768]"
                    }`}
                  >
                    {task.priority}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
                  Área: {task.area} • Prioridade: {task.priority}. {task.dueDate ? `Prazo de conclusão: ${task.dueDate}.` : "Sem prazo fixo definido."}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: NOTAS AGREGADAS */}
      {/* ======================================================== */}
      {subTab === "notas" && (
        <NotasAgregadasView onOpenAddModal={() => onOpenAddModal("nota")} onDeleteNote={(id) => deleteNote.mutate(id)} />
      )}
    </div>
  );
}

function NotasAgregadasView({ onOpenAddModal, onDeleteNote }: { onOpenAddModal: () => void; onDeleteNote: (id: number) => void }) {
  const [filterModule, setFilterModule] = useState<string>("todos");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Notas Agregadas</h3>
          <p className="text-[13px] text-[#7C6E62]">
            Anotações reunidas de todas as áreas (Geral, Devocional, Treinos, etc.).
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="h-11 px-4 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
        >
          + Nota
        </button>
      </div>

      <NotasContent filterModule={filterModule} setFilterModule={setFilterModule} onDeleteNote={onDeleteNote} />
    </div>
  );
}

function NotasContent({
  filterModule,
  setFilterModule,
  onDeleteNote,
}: {
  filterModule: string;
  setFilterModule: (m: string) => void;
  onDeleteNote: (id: number) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => api.listNotes({}),
  });

  if (isLoading) {
    return <p className="py-6 text-center text-xs text-[#9B8F85]">Carregando notas...</p>;
  }

  const allNotes = data?.notes ?? [];
  const modules = Array.from(new Set(allNotes.map((n) => n.moduleOrigin)));

  const filtered = filterModule === "todos" ? allNotes : allNotes.filter((n) => n.moduleOrigin === filterModule);

  return (
    <div className="flex flex-col gap-3">
      {/* Filtro de Módulo de Origem */}
      <div className="flex gap-1.5 overflow-x-auto text-xs py-1">
        <button
          onClick={() => setFilterModule("todos")}
          className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition ${
            filterModule === "todos"
              ? "bg-[#231B16] text-white"
              : "bg-[#F2ECE3] text-[#6E6259] hover:bg-[#EAE2D6]"
          }`}
        >
          Todas ({allNotes.length})
        </button>
        {modules.map((m) => (
          <button
            key={m}
            onClick={() => setFilterModule(m)}
            className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition ${
              filterModule === m
                ? "bg-[#231B16] text-white"
                : "bg-[#F2ECE3] text-[#6E6259] hover:bg-[#EAE2D6]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-[#EFE5D5] bg-[#FFFDF8] p-8 text-center text-xs text-[#9B8F85]">
          Nenhuma nota encontrada neste módulo.
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {filtered.map((note) => (
            <LomaCard
              key={note.id}
              id={note.id}
              title={note.title}
              category={note.moduleOrigin}
              meta={note.content}
              onDelete={() => onDeleteNote(note.id)}
              badge={
                <span className="rounded-full bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-semibold text-[#6E6259] border border-[#EFE5D5]">
                  {note.moduleOrigin}
                </span>
              }
            >
              <p className="whitespace-pre-wrap text-xs text-[#6E6259] leading-relaxed">{note.content}</p>
              {note.tags && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-[#EFE5D5] pt-2">
                  {note.tags.split(",").map((t, idx) => (
                    <span key={idx} className="rounded-md bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-medium text-[#6E6259]">
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </LomaCard>
          ))}
        </div>
      )}
    </div>
  );
}
