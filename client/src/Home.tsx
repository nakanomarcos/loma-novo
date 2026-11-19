import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";
import { LomaRealMeta } from "./Financas";

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
  onClick,
}: {
  id?: string | number;
  title: string;
  meta?: React.ReactNode;
  category?: string | null;
  isCompleted?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHeaderClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] shadow-[0_1px_0_#E7DBC6] transition-all overflow-hidden ${
        isCompleted ? "opacity-75 bg-[#FAF4E8]" : ""
      }`}
    >
      {/* Cabeçalho do Cartão Fechado (min-h ≈62-64px, py-3 px-4) */}
      <div
        onClick={handleHeaderClick}
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
                    ? "bg-[#7D8C6F] border-[#7D8C6F] text-white"
                    : "border-[#E7DBC6] bg-white hover:border-[#E8836B]"
                }`}
              >
                {isCompleted && "✓"}
              </div>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h4
              className={`text-[16px] font-semibold leading-tight truncate ${
                isCompleted ? "line-through text-[#7A675A]" : "text-[#2E2019]"
              }`}
            >
              {title}
            </h4>
            {(meta || category) && (
              <div className="text-[13px] text-[#7A675A] truncate mt-0.5 flex items-center gap-1.5">
                {category && <span className="font-medium text-[#C79A3B]">{category} •</span>}
                {meta}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {!onClick && children && (
            <span
              className={`text-[#7A675A] text-xs transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          )}
          {onClick && <span className="text-[#7A675A] text-xs">→</span>}
        </div>
      </div>

      {/* Sanfona / Detalhe Expansível */}
      {!onClick && isExpanded && children && (
        <div className="border-t border-[#F3E9D7] bg-[#FAF4E8]/60 px-4 py-3 text-xs flex flex-col gap-2.5">
          {children}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7DBC6]">
            {onToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="h-10 px-4 rounded-full bg-[#E7DBC6] text-[#2E2019] font-medium text-xs hover:bg-[#E7DBC6] transition cursor-pointer"
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
                className="h-10 px-4 rounded-full bg-[#F3E9D7] text-[#CF6248] font-medium text-xs hover:bg-[#F2D7DB] transition cursor-pointer"
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
      <div className="flex flex-col items-center justify-center p-12 text-[#7A675A]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8836B] border-t-transparent" />
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
      <div className="rounded-[24px] border border-[#E7DBC6] bg-[#FFFDF8] p-3 shadow-[0_1px_0_#E7DBC6]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#E8836B]" />
            <p className="text-xs font-medium text-[#7A675A]">
              {hasDemoData ? (
                <>
                  <strong className="text-[#2E2019]">Dados de Exemplo Ativos:</strong> Família fictícia brasileira
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
                className="h-10 px-3 cursor-pointer rounded-full bg-[#F3E9D7] text-[11px] font-semibold text-[#CF6248] transition hover:bg-[#E8836B] hover:text-white"
              >
                {clearDemo.isPending ? "Limpando..." : "Limpar exemplo"}
              </button>
            ) : (
              <button
                onClick={() => loadDemo.mutate()}
                disabled={loadDemo.isPending}
                className="h-10 px-3 cursor-pointer rounded-full bg-[#F3E9D7] text-[11px] font-semibold text-[#7D8C6F] transition hover:bg-[#7D8C6F] hover:text-white"
              >
                {loadDemo.isPending ? "Carregando..." : "Carregar exemplo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-ABA: INÍCIO (PAINEL DO DIA) */}
      {/* ======================================================== */}
      {subTab === "inicio" && (
        <div className="flex flex-col gap-4">
          {/* Herói com padding 16px e raio 24px */}
          <div
            className="relative overflow-hidden rounded-[24px] p-4 text-[#FFF7EA] shadow-md"
            style={{
              background: "radial-gradient(circle at top right, rgba(168, 93, 122, 0.20) 0%, transparent 60%), linear-gradient(135deg, #7E354F 0%, #653259 55%, #4C2B57 100%)",
            }}
          >
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#F3C6D2] uppercase">Seu Dia no Loma</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#FFF7EA]/80 tabular-nums">
                  {todayDate}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-[#FFF7EA] leading-tight">
                  A vida organizada, com calma e propósito<span className="text-[#F3C6D2]">.</span>
                </h2>
                <p className="mt-1 text-xs text-[#FFF7EA]/75">
                  {pendingTasksCount === 0 && completedHabitsCount === habits.length
                    ? "Tudo em dia por aqui hoje!"
                    : `${pendingTasksCount} tarefa(s) pendente(s) e ${completedHabitsCount}/${habits.length} hábito(s) concluído(s).`}
                </p>
              </div>

              {/* 3 Métricas Hero */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/12 pt-2.5 text-center">
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Agenda 14d</span>
                  <span className="text-base sm:text-lg font-bold text-[#F3C6D2] font-serif tabular-nums truncate w-full">{upcomingEvents.length}</span>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Hábitos Hoje</span>
                  <span className="text-base sm:text-lg font-bold text-[#F3C6D2] font-serif tabular-nums truncate w-full">
                    {completedHabitsCount}/{habits.length}
                  </span>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Disponível</span>
                  <span className="text-base sm:text-lg font-bold text-[#FFF7EA] font-serif tabular-nums truncate w-full">
                    R$ {(financeBrief.availableBalance / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ÍNDICE DE MÓDULOS DA HOME (EMPILHADOS VERTICALMENTE) */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between mb-1 px-1">
              <div>
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                  Índice de Módulos
                </h3>
                <p className="text-[13px] text-[#7A675A]">
                  Toque para gerenciar cada módulo em tela própria
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <LomaCard
                id="mod_agenda"
                title="Agenda & Aniversários"
                category="Tempo & Eventos"
                meta={`${upcomingEvents.length} compromissos nos próximos 14 dias`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#2E2019] tabular-nums">{upcomingEvents.length} eventos</span>}
                onClick={() => setSubTab("agenda")}
              />
              <LomaCard
                id="mod_habitos"
                title="Hábitos & Rotinas"
                category="Constância"
                meta={`${completedHabitsCount} de ${habits.length} concluídos hoje`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#7D8C6F] tabular-nums">{completedHabitsCount}/{habits.length}</span>}
                onClick={() => setSubTab("habitos")}
              />
              <LomaCard
                id="mod_tarefas"
                title="Tarefas Prioritárias"
                category="Execução"
                meta={`${pendingTasksCount} tarefas pendentes`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#E8836B] tabular-nums">{pendingTasksCount} pendentes</span>}
                onClick={() => setSubTab("tarefas")}
              />
              <LomaCard
                id="mod_notas"
                title="Notas & Reflexões"
                category="Pensamento"
                meta="Caderno rápido de anotações familiares"
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#C79A3B] tabular-nums">Notas</span>}
                onClick={() => setSubTab("notas")}
              />
            </div>
          </div>

          {/* Inteligência Conectada — Alertas Proativos */}
          {intelData && intelData.smartAlerts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Inteligência Conectada</h3>
                {onOpenDrawerTab && (
                  <button
                    onClick={() => onOpenDrawerTab("visao360")}
                    className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
                  >
                    Visão 360° →
                  </button>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                {intelData.smartAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] shadow-[0_1px_0_#E7DBC6] p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            alert.severity === "urgente"
                              ? "bg-[#F3E9D7] text-[#CF6248]"
                              : alert.severity === "aviso"
                              ? "bg-[#FFF4E5] text-[#9A6700]"
                              : "bg-[#F3E9D7] text-[#7D8C6F]"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <h4 className="text-[16px] font-semibold text-[#2E2019] truncate">{alert.title}</h4>
                      </div>
                      <button
                        onClick={() => dismissAlert.mutate(alert.id)}
                        className="text-[#7A675A] hover:text-[#2E2019] text-xs px-2 cursor-pointer"
                        title="Dispensar alerta"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[13px] text-[#7A675A] leading-relaxed">{alert.message}</p>

                    {alert.actionLabel && (
                      <div className="mt-1 flex items-center gap-2 pt-2 border-t border-[#E7DBC6]">
                        <button
                          onClick={() => executeAlert.mutate(alert.id)}
                          disabled={executeAlert.isPending}
                          className="h-11 px-4 cursor-pointer rounded-full bg-[#2E2019] text-xs font-semibold text-white transition hover:bg-[#4A382C] disabled:opacity-50"
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
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Próximos Compromissos</h3>
              <button
                onClick={() => onOpenAddModal("agenda")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Adicionar
              </button>
            </div>

            {sortedEvents.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#7A675A]">Nenhum compromisso nos próximos 14 dias.</p>
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
                    <p className="text-xs text-[#7A675A]">
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
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Hábitos do Dia</h3>
              <button
                onClick={() => onOpenAddModal("habito")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Novo
              </button>
            </div>

            {sortedHabits.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#7A675A]">Nenhum hábito cadastrado para a rotina.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {sortedHabits.map((habit) => {
                  const daysDoneThisWeek = habit.completedToday ? Math.min(Math.max(habit.streak % 7 || 5, 1), 7) : Math.min(habit.streak % 7 || 3, 6);
                  return (
                    <LomaCard
                      key={habit.id}
                      id={habit.id}
                      title={habit.title}
                      category={habit.period}
                      meta={`Real ${daysDoneThisWeek} × Meta 5 • 🔥 ${habit.streak} dias`}
                      isCompleted={habit.completedToday === 1}
                      onToggle={() => toggleHabit.mutate(habit.id)}
                      onDelete={() => deleteHabit.mutate(habit.id)}
                      badge={
                        <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[11px] font-semibold text-[#C79A3B] tabular-nums">
                          🔥 {habit.streak}d
                        </span>
                      }
                    >
                      <div className="flex flex-col gap-2">
                        {/* Padrão 1: Real × Meta (do Loma atual, Hábitos) */}
                        <LomaRealMeta
                          label="Meta Semanal"
                          real={daysDoneThisWeek}
                          meta={5}
                          unit="d"
                        />
                        <p className="text-[11px] text-[#7A675A]">
                          Hábito programado para o período {habit.period}. Sequência atual mantida com constância.
                        </p>
                      </div>
                    </LomaCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tarefas Prioritárias */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Tarefas Prioritárias</h3>
              <button
                onClick={() => onOpenAddModal("tarefa")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Adicionar
              </button>
            </div>

            {sortedTasks.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#7A675A]">Nenhuma tarefa pendente no momento.</p>
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
                            ? "bg-[#F3E9D7] text-[#CF6248]"
                            : task.priority === "media"
                            ? "bg-[#F3E9D7] text-[#C79A3B]"
                            : "bg-[#F3E9D7] text-[#465768]"
                        }`}
                      >
                        {task.priority}
                      </span>
                    }
                  >
                    <p className="text-xs text-[#7A675A]">
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
          <button
            onClick={() => setSubTab("inicio")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Início
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Agenda & Aniversários</h3>
            <button
              onClick={() => onOpenAddModal("agenda")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C]"
            >
              + Compromisso
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#7A675A]">Nenhum compromisso cadastrado.</p>
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
                  <p className="text-xs text-[#7A675A]">
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
          <button
            onClick={() => setSubTab("inicio")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Início
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Hábitos & Rotina</h3>
            <button
              onClick={() => onOpenAddModal("habito")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C]"
            >
              + Hábito
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedHabits.map((habit) => {
              const daysDoneThisWeek = habit.completedToday ? Math.min(Math.max(habit.streak % 7 || 5, 1), 7) : Math.min(habit.streak % 7 || 3, 6);
              return (
                <LomaCard
                  key={habit.id}
                  id={habit.id}
                  title={habit.title}
                  category={habit.period}
                  meta={`Real ${daysDoneThisWeek} × Meta 5 • 🔥 ${habit.streak} dias`}
                  isCompleted={habit.completedToday === 1}
                  onToggle={() => toggleHabit.mutate(habit.id)}
                  onDelete={() => deleteHabit.mutate(habit.id)}
                  badge={
                    <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[11px] font-semibold text-[#C79A3B] tabular-nums">
                      🔥 {habit.streak}d
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {/* Padrão 1: Real × Meta (do Loma atual, Hábitos) */}
                    <LomaRealMeta
                      label="Meta Semanal"
                      real={daysDoneThisWeek}
                      meta={5}
                      unit="d"
                    />
                    <p className="text-[11px] text-[#7A675A]">
                      Rotina configurada para o período: {habit.period}.
                    </p>
                  </div>
                </LomaCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: TAREFAS COMPLETA */}
      {/* ======================================================== */}
      {subTab === "tarefas" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("inicio")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Início
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Tarefas da Vida</h3>
            <button
              onClick={() => onOpenAddModal("tarefa")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C]"
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
                        ? "bg-[#F3E9D7] text-[#CF6248]"
                        : task.priority === "media"
                        ? "bg-[#F3E9D7] text-[#C79A3B]"
                        : "bg-[#F3E9D7] text-[#465768]"
                    }`}
                  >
                    {task.priority}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
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
        <NotasAgregadasView
          onBack={() => setSubTab("inicio")}
          onOpenAddModal={() => onOpenAddModal("nota")}
          onDeleteNote={(id) => deleteNote.mutate(id)}
        />
      )}
    </div>
  );
}

function NotasAgregadasView({
  onBack,
  onOpenAddModal,
  onDeleteNote,
}: {
  onBack: () => void;
  onOpenAddModal: () => void;
  onDeleteNote: (id: number) => void;
}) {
  const [filterModule, setFilterModule] = useState<string>("todos");

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onBack}
        className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
      >
        ← Voltar ao Início
      </button>
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Notas Agregadas</h3>
          <p className="text-[13px] text-[#7A675A]">
            Anotações reunidas de todas as áreas (Geral, Devocional, Treinos, etc.).
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="h-11 px-4 cursor-pointer rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
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
    return <p className="py-6 text-center text-xs text-[#7A675A]">Carregando notas...</p>;
  }

  const allNotes = data?.notes ?? [];
  const modules = Array.from(new Set(allNotes.map((n) => n.moduleOrigin)));

  const filtered = filterModule === "todos" ? allNotes : allNotes.filter((n) => n.moduleOrigin === filterModule);

  return (
    <div className="flex flex-col gap-3">
      {/* Filtro de Módulo de Origem (chips com quebra de linha) */}
      <div className="flex flex-wrap gap-1.5 text-xs py-1">
        <button
          onClick={() => setFilterModule("todos")}
          className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition ${
            filterModule === "todos"
              ? "bg-[#2E2019] text-white"
              : "bg-[#F3E9D7] text-[#7A675A] hover:bg-[#E7DBC6]"
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
                ? "bg-[#2E2019] text-white"
                : "bg-[#F3E9D7] text-[#7A675A] hover:bg-[#E7DBC6]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-[#E7DBC6] bg-[#FFFDF8] p-8 text-center text-xs text-[#7A675A]">
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
                <span className="rounded-full bg-[#FAF4E8] px-2.5 py-1 text-[10px] font-semibold text-[#7A675A] border border-[#E7DBC6]">
                  {note.moduleOrigin}
                </span>
              }
            >
              <p className="whitespace-pre-wrap text-xs text-[#7A675A] leading-relaxed">{note.content}</p>
              {note.tags && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-[#E7DBC6] pt-2">
                  {note.tags.split(",").map((t, idx) => (
                    <span key={idx} className="rounded-md bg-[#F3E9D7] px-2 py-0.5 text-[10px] font-medium text-[#7A675A]">
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
