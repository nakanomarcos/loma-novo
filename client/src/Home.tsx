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

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Banner de Demonstração (apenas se houver dados fictícios ou para carregar) */}
      <div className="rounded-2xl border border-[#EAE2D6] bg-[#FFFFFF] p-3 shadow-xs">
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
                className="cursor-pointer rounded-full bg-[#F8ECEE] px-2.5 py-1 text-[11px] font-semibold text-[#B36670] transition hover:bg-[#C47882] hover:text-white"
              >
                {clearDemo.isPending ? "Limpando..." : "Limpar exemplo"}
              </button>
            ) : (
              <button
                onClick={() => loadDemo.mutate()}
                disabled={loadDemo.isPending}
                className="cursor-pointer rounded-full bg-[#E9F3F0] px-2.5 py-1 text-[11px] font-semibold text-[#3B7A6B] transition hover:bg-[#3B7A6B] hover:text-white"
              >
                {loadDemo.isPending ? "Carregando..." : "Carregar exemplo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navegação da Home */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs max-w-full min-w-0">
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
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 font-medium transition ${
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
        <div className="flex flex-col gap-5">
          {/* Hero Card Espresso */}
          <div className="relative overflow-hidden rounded-3xl bg-[#231B16] p-6 text-[#FAF7F2] shadow-md">
            {/* Brilho radial no topo */}
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.3) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-[#C47882] uppercase">Seu Dia no Loma</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#FAF7F2]/80 tabular-nums">
                  {todayDate}
                </span>
              </div>

              <div>
                <h2 className="font-serif-loma text-2xl text-[#FAF7F2] leading-tight">
                  A vida organizada, com calma e propósito<span className="text-[#C47882]">.</span>
                </h2>
                <p className="mt-1 text-xs text-[#FAF7F2]/70">
                  {pendingTasksCount === 0 && completedHabitsCount === habits.length
                    ? "Tudo em dia por aqui hoje!"
                    : `${pendingTasksCount} tarefa(s) pendente(s) e ${completedHabitsCount}/${habits.length} hábito(s) concluído(s).`}
                </p>
              </div>

              {/* 3 Métricas Hero */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/10 pt-3 text-center">
                <div className="rounded-2xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Agenda 14d</span>
                  <span className="text-base sm:text-lg font-bold text-[#FAF7F2] tabular-nums truncate w-full">{upcomingEvents.length}</span>
                </div>
                <div className="rounded-2xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Hábitos Hoje</span>
                  <span className="text-base sm:text-lg font-bold text-[#C47882] tabular-nums truncate w-full">
                    {completedHabitsCount}/{habits.length}
                  </span>
                </div>
                <div className="rounded-2xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Disponível</span>
                  <span className="text-base sm:text-lg font-bold text-[#E9F3F0] tabular-nums truncate w-full">
                    R$ {(financeBrief.availableBalance / 100).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inteligência Conectada — Alertas & Sugestões da IA */}
          {intelData && intelData.smartAlerts.length > 0 && (
            <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-[#C47882] shrink-0 animate-pulse" />
                  <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Inteligência Conectada</h3>
                </div>
                {onOpenDrawerTab && (
                  <button
                    onClick={() => onOpenDrawerTab("visao360")}
                    className="shrink-0 cursor-pointer text-xs font-semibold text-[#6E6259] hover:text-[#231B16] whitespace-nowrap"
                  >
                    Visão 360° →
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {intelData.smartAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
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
                        <h4 className="font-bold text-[#231B16] truncate">{alert.title}</h4>
                      </div>
                      <button
                        onClick={() => dismissAlert.mutate(alert.id)}
                        className="text-[#9B8F85] hover:text-[#231B16] shrink-0 text-sm px-1 cursor-pointer"
                        title="Dispensar alerta"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-[#6E6259] leading-relaxed">{alert.message}</p>

                    {alert.actionLabel && (
                      <div className="mt-1 flex items-center gap-2 pt-1 border-t border-[#EAE2D6]/60">
                        <button
                          onClick={() => executeAlert.mutate(alert.id)}
                          disabled={executeAlert.isPending}
                          className="cursor-pointer rounded-xl bg-[#231B16] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                        >
                          {alert.actionLabel}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cruzamento entre Módulos (Insights da IA) */}
          {intelData && intelData.crossInsights.length > 0 && (
            <section className="rounded-3xl border border-[#EAE2D6] bg-gradient-to-br from-white to-[#FAF7F2] p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-[#3B7A6B] shrink-0" />
                  <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Cruzamento entre Módulos</h3>
                </div>
                <span className="text-[10px] font-medium text-[#9B8F85] uppercase tracking-wider">Loma IA</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {intelData.crossInsights.slice(0, 2).map((insight) => (
                  <div key={insight.id} className="rounded-2xl border border-[#EAE2D6] bg-white p-3.5 shadow-xs flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {insight.modules.map((m) => (
                          <span key={m} className="rounded-md bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#6E6259]">
                            {m}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-bold text-xs text-[#231B16] mt-2">{insight.title}</h4>
                      <p className="text-[11px] text-[#6E6259] mt-1 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Próximos 14 dias (Agenda) */}
          <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#8A6399] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Próximos Compromissos</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("agenda")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Adicionar
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhum compromisso nos próximos 14 dias.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[#EAE2D6]">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleEvent.mutate(event.id)}
                        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[7px] border transition ${
                          event.status === "concluido"
                            ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                            : "border-[#DDD2C3] bg-[#FAF7F2] hover:border-[#C47882]"
                        }`}
                      >
                        {event.status === "concluido" && <span className="text-xs">✓</span>}
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${event.status === "concluido" ? "text-[#9B8F85] line-through" : "text-[#231B16]"}`}>
                          {event.title}
                        </p>
                        <p className="text-[11px] text-[#6E6259] tabular-nums">
                          {event.date} {event.time ? `• ${event.time}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#F3EDF6] px-2 py-0.5 text-[10px] font-semibold text-[#6F4C7D]">
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Hábitos de Hoje */}
          <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#C47882] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Hábitos do Dia</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("habito")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Novo
              </button>
            </div>

            {habits.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhum hábito cadastrado para a rotina.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit.mutate(habit.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition ${
                      habit.completedToday === 1
                        ? "border-[#E9F3F0] bg-[#E9F3F0]/60"
                        : "border-[#EAE2D6] bg-[#FAF7F2] hover:border-[#DDD2C3]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-bold transition ${
                          habit.completedToday === 1
                            ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                            : "border-[#DDD2C3] bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                      <span className={`text-xs font-medium ${habit.completedToday === 1 ? "text-[#3B7A6B] line-through" : "text-[#231B16]"}`}>
                        {habit.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#9E6123] tabular-nums">
                      🔥 {habit.streak}d
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tarefas Prioritárias */}
          <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#3B7A6B] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Tarefas Prioritárias</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("tarefa")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Adicionar
              </button>
            </div>

            {tasks.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhuma tarefa pendente no momento.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[#EAE2D6]">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleTask.mutate(task.id)}
                        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[7px] border transition ${
                          task.completed === 1
                            ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                            : "border-[#DDD2C3] bg-[#FAF7F2] hover:border-[#C47882]"
                        }`}
                      >
                        {task.completed === 1 && <span className="text-xs">✓</span>}
                      </button>
                      <div>
                        <p className={`text-sm ${task.completed === 1 ? "text-[#9B8F85] line-through" : "font-medium text-[#231B16]"}`}>
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <span className="text-[10px] text-[#6E6259] tabular-nums">Prazo: {task.dueDate}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        task.priority === "alta"
                          ? "bg-[#F8ECEE] text-[#B36670]"
                          : task.priority === "media"
                          ? "bg-[#FBF2E6] text-[#9E6123]"
                          : "bg-[#EDF1F5] text-[#465768]"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: AGENDA & ANIVERSÁRIOS COMPLETA */}
      {/* ======================================================== */}
      {subTab === "agenda" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate min-w-0 flex-1">Agenda & Aniversários</h2>
            <button
              onClick={() => onOpenAddModal("agenda")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
            >
              + Compromisso
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[#EAE2D6] rounded-3xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
            {upcomingEvents.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#9B8F85]">Nenhum compromisso cadastrado.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleEvent.mutate(event.id)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[7px] border transition ${
                        event.status === "concluido"
                          ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                          : "border-[#DDD2C3] bg-[#FAF7F2] hover:border-[#C47882]"
                      }`}
                    >
                      {event.status === "concluido" && <span className="text-xs">✓</span>}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#231B16]">{event.title}</span>
                        <span className="rounded-full bg-[#F3EDF6] px-2 py-0.2 text-[10px] font-semibold text-[#6F4C7D]">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6259] tabular-nums">
                        Data: {event.date} {event.time ? `às ${event.time}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent.mutate(event.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#B36670]"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: HÁBITOS */}
      {/* ======================================================== */}
      {subTab === "habitos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate min-w-0 flex-1">Hábitos & Rotina</h2>
            <button
              onClick={() => onOpenAddModal("habito")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
            >
              + Hábito
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between rounded-3xl border border-[#EAE2D6] bg-white p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#231B16]">{habit.title}</span>
                    <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-medium text-[#6E6259]">
                      {habit.period}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#9E6123] font-semibold tabular-nums">
                    Sequência: 🔥 {habit.streak} dias seguidos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHabit.mutate(habit.id)}
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      habit.completedToday === 1
                        ? "bg-[#3B7A6B] text-white"
                        : "bg-[#F2ECE3] text-[#6E6259] hover:bg-[#EAE2D6]"
                    }`}
                  >
                    {habit.completedToday === 1 ? "Feito ✓" : "Fazer"}
                  </button>
                  <button
                    onClick={() => deleteHabit.mutate(habit.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#B36670]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-ABA: TAREFAS */}
      {/* ======================================================== */}
      {subTab === "tarefas" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate min-w-0 flex-1">Tarefas da Vida</h2>
            <button
              onClick={() => onOpenAddModal("tarefa")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
            >
              + Tarefa
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[#EAE2D6] rounded-3xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask.mutate(task.id)}
                    className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-[7px] border transition ${
                      task.completed === 1
                        ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                        : "border-[#DDD2C3] bg-[#FAF7F2] hover:border-[#C47882]"
                    }`}
                  >
                    {task.completed === 1 && <span className="text-xs">✓</span>}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${task.completed === 1 ? "text-[#9B8F85] line-through" : "font-semibold text-[#231B16]"}`}>
                        {task.title}
                      </span>
                      <span className="rounded-full bg-[#EDF1F5] px-2 py-0.2 text-[10px] font-semibold text-[#465768]">
                        {task.area}
                      </span>
                    </div>
                    {task.dueDate && (
                      <p className="text-xs text-[#6E6259] tabular-nums">Prazo: {task.dueDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      task.priority === "alta"
                        ? "bg-[#F8ECEE] text-[#B36670]"
                        : task.priority === "media"
                        ? "bg-[#FBF2E6] text-[#9E6123]"
                        : "bg-[#EDF1F5] text-[#465768]"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask.mutate(task.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#B36670]"
                  >
                    ✕
                  </button>
                </div>
              </div>
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate">Notas Agregadas</h2>
          <p className="text-xs text-[#6E6259] truncate">
            Anotações reunidas de todas as áreas (Geral, Devocional, Treinos, etc.).
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
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
      <div className="flex gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setFilterModule("todos")}
          className={`cursor-pointer rounded-full px-3 py-1 font-medium transition ${
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
            className={`cursor-pointer rounded-full px-3 py-1 font-medium transition ${
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
        <div className="rounded-3xl border border-[#EAE2D6] bg-white p-8 text-center text-xs text-[#9B8F85]">
          Nenhuma nota encontrada neste módulo.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="flex flex-col justify-between rounded-3xl border border-[#EAE2D6] bg-white p-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-semibold text-[#6E6259] border border-[#EAE2D6]">
                    Origem: {note.moduleOrigin}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#B36670]"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="mt-2 text-sm font-bold text-[#231B16]">{note.title}</h4>
                <p className="mt-1 whitespace-pre-wrap text-xs text-[#6E6259] leading-relaxed">{note.content}</p>
              </div>
              {note.tags && (
                <div className="mt-3 flex flex-wrap gap-1 border-t border-[#EAE2D6] pt-2">
                  {note.tags.split(",").map((t, idx) => (
                    <span key={idx} className="rounded-md bg-[#F2ECE3] px-1.5 py-0.5 text-[9px] font-medium text-[#6E6259]">
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
