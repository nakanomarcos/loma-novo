import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { api, type ApiResponse } from "./api";
import { LomaRealMeta } from "./Financas";

type BemEstarData = ApiResponse<typeof api, "getBemEstarOverview">;

interface BemEstarProps {
  data?: BemEstarData;
  isLoading: boolean;
  onOpenAddModal: (type: "saude" | "treino" | "cuidado" | "humor" | "devocional" | "refeicao") => void;
}

// ========================================================
// COMPONENTE CANÔNICO: CARTÃO LOMA (PADRÃO REDUZIDO & EXPANSÍVEL)
// ========================================================
function LomaCard({
  id,
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
  id?: number | string;
  title: string;
  meta?: string | null;
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
      data-card-id={id}
      className={`rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] shadow-[0_1px_0_#E7DBC6] transition-all overflow-hidden ${
        isCompleted ? "opacity-60 bg-[#FAF4E8]" : ""
      }`}
    >
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
                    : "border-[#E7DBC6] bg-[#FFFDF8] hover:border-[#E8836B]"
                }`}
              >
                {isCompleted && "✓"}
              </div>
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h4
              className={`text-[16px] font-semibold leading-tight truncate ${
                isCompleted ? "line-through text-[#7A675A]/60" : "text-[#2E2019]"
              }`}
            >
              {title}
            </h4>
            {(meta || category) && (
              <div className="text-[13px] leading-[18px] text-[#7A675A] truncate mt-0.5 flex items-center gap-1.5">
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

      {!onClick && isExpanded && children && (
        <div className="border-t border-[#E7DBC6] bg-[#FAF4E8]/60 px-4 py-3 text-xs flex flex-col gap-2.5">
          {children}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7DBC6]">
            {onToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className="h-10 px-4 rounded-full border border-[#E7DBC6] bg-[#FFFDF8] text-[#2E2019] font-semibold text-xs hover:bg-[#F3E9D7] transition cursor-pointer"
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
                className="h-10 px-4 rounded-full border border-[#B3402E]/20 bg-[#B3402E]/10 text-[#B3402E] font-semibold text-xs hover:bg-[#B3402E]/20 transition cursor-pointer"
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

export function BemEstarView({ data, isLoading, onOpenAddModal }: BemEstarProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as any) || "resumo";
  const [subTab, setSubTab] = useState<
    "resumo" | "saude" | "treinos" | "cuidados" | "humor" | "devocional" | "espiritualidade" | "cozinha"
  >(initialSub);

  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["bemEstarOverview"] });
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const toggleHealth = useMutation({
    mutationFn: (id: number) => api.toggleHealthRecord({ id }),
    onSuccess: refresh,
  });

  const deleteHealth = useMutation({
    mutationFn: (id: number) => api.deleteHealthRecord({ id }),
    onSuccess: refresh,
  });

  const deleteWorkout = useMutation({
    mutationFn: (id: number) => api.deleteWorkout({ id }),
    onSuccess: refresh,
  });

  const toggleCare = useMutation({
    mutationFn: (id: number) => api.toggleCareRoutine({ id }),
    onSuccess: refresh,
  });

  const deleteCare = useMutation({
    mutationFn: (id: number) => api.deleteCareRoutine({ id }),
    onSuccess: refresh,
  });

  const deleteDevotional = useMutation({
    mutationFn: (id: number) => api.deleteDevotional({ id }),
    onSuccess: refresh,
  });

  const deleteMeal = useMutation({
    mutationFn: (id: number) => api.deleteMealPlan({ id }),
    onSuccess: refresh,
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#7A675A]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8836B] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando bem-estar...</span>
      </div>
    );
  }

  const { healthRecords, workouts, careRoutines, moodLogs, devotionals, mealPlans, summary } = data;

  const sortedHealth = healthRecords
    .slice()
    .sort((a, b) => (a.status === "realizado" ? 1 : 0) - (b.status === "realizado" ? 1 : 0));

  const sortedCare = careRoutines
    .slice()
    .sort((a, b) => a.completed - b.completed);

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* ======================================================== */}
      {/* 1. VISÃO GERAL (RESUMO BEM-ESTAR) */}
      {/* ======================================================== */}
      {subTab === "resumo" && (
        <div className="flex flex-col gap-4">
          {/* Herói com padding 16px e raio 24px */}
          <div
            className="relative overflow-hidden rounded-[24px] p-4 text-[#FFF7EA] shadow-md"
            style={{
              background: "radial-gradient(circle at top right, rgba(168, 93, 122, 0.20) 0%, transparent 60%), linear-gradient(135deg, #7E354F 0%, #653259 55%, #4C2B57 100%)",
            }}
          >
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-[#F3C6D2] uppercase">
                Saúde & Equilíbrio Integral
              </span>
              <h2 className="font-serif text-2xl text-[#FFF7EA] leading-tight">
                Cuidar do corpo, da mente e do espírito<span className="text-[#F3C6D2]">.</span>
              </h2>
              <p className="text-xs text-[#FFF7EA]/75">
                Rotina de saúde preventiva, atividades físicas regulares e momentos de oração.
              </p>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/12 pt-2.5 text-center">
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Saúde</span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#F3C6D2] tabular-nums truncate w-full">{summary.pendingHealthCount}</span>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Treinos</span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#F3C6D2] tabular-nums truncate w-full">{summary.workoutsCount}</span>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/12 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FFF7EA]/75 truncate w-full">Sono Médio</span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#FFF7EA] tabular-nums truncate w-full">{summary.avgSleepHours}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ÍNDICE DE MÓDULOS DE BEM-ESTAR (EMPILHADOS VERTICALMENTE) */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between mb-1 px-1">
              <div>
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                  Índice de Módulos (7)
                </h3>
                <p className="text-[13px] text-[#7A675A]">
                  Toque para gerenciar cada dimensão do seu bem-estar
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <LomaCard
                id="mod_saude"
                title="Saúde Preventiva"
                category="Prevenção & Exames"
                meta={`${healthRecords.length} registros cadastrados`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#2E2019] tabular-nums">{summary.pendingHealthCount} pendentes</span>}
                onClick={() => setSubTab("saude")}
              />
              <LomaCard
                id="mod_treinos"
                title="Corpo & Treinos"
                category="Esporte & Performance"
                meta={`${workouts.length} treinos realizados`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#7D8C6F] tabular-nums">{workouts.length} treinos</span>}
                onClick={() => setSubTab("treinos")}
              />
              <LomaCard
                id="mod_cuidados"
                title="Cuidados & Autocuidado"
                category="Rotina Pessoal"
                meta={`${careRoutines.length} hábitos de cuidado`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#C79A3B] tabular-nums">{careRoutines.length} rotinas</span>}
                onClick={() => setSubTab("cuidados")}
              />
              <LomaCard
                id="mod_humor"
                title="Humor & Sono"
                category="Recuperação Emocional"
                meta={`Média de ${summary.avgSleepHours}h de sono`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#653259] tabular-nums">{summary.avgSleepHours}h</span>}
                onClick={() => setSubTab("humor")}
              />
              <LomaCard
                id="mod_devocional"
                title="Devocional Bíblico"
                category="Leitura & Versículos"
                meta={`${devotionals.length} passagens salvas e reflexões`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#E8836B] tabular-nums">{devotionals.length} registros</span>}
                onClick={() => setSubTab("devocional")}
              />
              <LomaCard
                id="mod_espiritualidade"
                title="Espiritualidade & Vida de Oração"
                category="Práticas & Comunidade"
                meta="Oração, jejum, gratidão e vida comunitária"
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#7D8C6F] tabular-nums">Práticas</span>}
                onClick={() => setSubTab("espiritualidade")}
              />
              <LomaCard
                id="mod_cozinha"
                title="Alimentação & Cozinha"
                category="Nutrição Familiar"
                meta={`${mealPlans.length} refeições planejadas`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#C79A3B] tabular-nums">{mealPlans.length} planos</span>}
                onClick={() => setSubTab("cozinha")}
              />
            </div>
          </div>

          {/* Próximas Consultas e Exames (Saúde) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Saúde Preventiva</h3>
              <button
                onClick={() => onOpenAddModal("saude")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Registrar
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {sortedHealth.slice(0, 3).map((h) => (
                <LomaCard
                  key={h.id}
                  id={h.id}
                  title={h.title}
                  category={h.type}
                  meta={`${h.doctorOrClinic ? `${h.doctorOrClinic} • ` : ""}${h.date}`}
                  isCompleted={h.status === "realizado"}
                  onToggle={() => toggleHealth.mutate(h.id)}
                  onDelete={() => deleteHealth.mutate(h.id)}
                  badge={
                    <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#7D8C6F] capitalize">
                      {h.type}
                    </span>
                  }
                >
                  <p className="text-xs text-[#7A675A]">
                    Profissional: {h.doctorOrClinic || "Não informado"}. Data: {h.date}. {h.details ? `Observações: ${h.details}` : ""}
                  </p>
                </LomaCard>
              ))}
            </div>
          </div>

          {/* Treinos Recentes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Corpo & Atividade Física</h3>
              <button
                onClick={() => onOpenAddModal("treino")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Novo Treino
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {workouts.slice(0, 2).map((w) => (
                <LomaCard
                  key={w.id}
                  id={w.id}
                  title={w.title}
                  category={w.category}
                  meta={`Duração: ${w.durationMinutes} min • Data: ${w.date}`}
                  onDelete={() => deleteWorkout.mutate(w.id)}
                  badge={
                    <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#465768] capitalize">
                      {w.category}
                    </span>
                  }
                >
                  <p className="text-xs text-[#7A675A]">
                    Treino realizado em {w.date}. {w.notes ? `Notas: ${w.notes}` : ""}
                  </p>
                </LomaCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SAÚDE COMPLETA */}
      {/* ======================================================== */}
      {subTab === "saude" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Saúde & Consultas</h3>
              <p className="text-[13px] text-[#7A675A]">Consultas, exames periódicos e vacinas.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("saude")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Saúde
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedHealth.map((h) => (
              <LomaCard
                key={h.id}
                id={h.id}
                title={h.title}
                category={h.type}
                meta={`${h.doctorOrClinic ? `${h.doctorOrClinic} • ` : ""}${h.date}`}
                isCompleted={h.status === "realizado"}
                onToggle={() => toggleHealth.mutate(h.id)}
                onDelete={() => deleteHealth.mutate(h.id)}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#7D8C6F] capitalize">
                    {h.type}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
                  Profissional / Clínica: {h.doctorOrClinic || "Não informado"} • Data: {h.date}. {h.details ? `Detalhes: ${h.details}` : ""}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CORPO & TREINOS */}
      {/* ======================================================== */}
      {subTab === "treinos" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Corpo & Esporte</h3>
              <p className="text-[13px] text-[#7A675A]">Atividades físicas e treinos da família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("treino")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Treino
            </button>
          </div>

          {/* Padrão 1: Real × Meta de Treinos Semanais */}
          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-2">
            <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
              Meta Semanal de Treinos
            </h4>
            <LomaRealMeta
              label="Sessões Realizadas na Semana"
              real={workouts.length}
              meta={4}
              unit=" sessões"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {workouts.map((w) => (
              <LomaCard
                key={w.id}
                id={w.id}
                title={w.title}
                category={w.category}
                meta={`Duração: ${w.durationMinutes} min • Data: ${w.date}`}
                onDelete={() => deleteWorkout.mutate(w.id)}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#465768] uppercase">
                    {w.category}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
                  {w.notes ? `Observações do treino: ${w.notes}` : "Sem observações registradas."}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CUIDADOS & AUTOCUIDADO */}
      {/* ======================================================== */}
      {subTab === "cuidados" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Cuidados & Autocuidado</h3>
              <p className="text-[13px] text-[#7A675A]">Pele, cabelo, corpo, unhas e rotinas de relaxamento.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("cuidado")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Rotina
            </button>
          </div>

          {/* Padrão 1: Real × Meta de Cuidados Semanais */}
          {careRoutines.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-2">
              <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                Constância dos Cuidados
              </h4>
              <LomaRealMeta
                label="Rotinas Cumpridas"
                real={careRoutines.filter((c) => c.completed === 1).length}
                meta={careRoutines.length}
                unit=" rotinas"
              />
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {sortedCare.map((c) => (
              <LomaCard
                key={c.id}
                id={c.id}
                title={c.title}
                category={c.category}
                meta={`Frequência: ${c.frequency}`}
                isCompleted={c.completed === 1}
                onToggle={() => toggleCare.mutate(c.id)}
                onDelete={() => deleteCare.mutate(c.id)}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#CF6248] capitalize">
                    {c.category}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
                  Rotina de autocuidado categoria {c.category}. Frequência recomendada: {c.frequency}.
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. HUMOR, SONO & ENERGIA */}
      {/* ======================================================== */}
      {subTab === "humor" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Humor, Sono & Energia</h3>
              <p className="text-[13px] text-[#7A675A]">Acompanhamento emocional e qualidade de recuperação.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("humor")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Registrar
            </button>
          </div>

          {/* Padrão 4: Série simples (linha) de Sono & Energia ao longo do tempo */}
          {moodLogs.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                    Série Histórica: Sono & Energia
                  </h4>
                  <p className="text-[12px] text-[#7A675A]">Evolução diária de descanso e vitalidade</p>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1 text-[#653259] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#653259] inline-block" /> Sono (h)
                  </span>
                  <span className="flex items-center gap-1 text-[#C79A3B] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C79A3B] inline-block" /> Energia
                  </span>
                </div>
              </div>
              <div className="w-full h-[170px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodLogs.slice().reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7A675A" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#7A675A" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFDF8",
                        border: "1px solid #E7DBC6",
                        borderRadius: "16px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sleepHours"
                      name="Sono (h)"
                      stroke="#653259"
                      strokeWidth={2.5}
                      dot={{ fill: "#653259", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energyLevel"
                      name="Energia (1-5)"
                      stroke="#C79A3B"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ fill: "#C79A3B", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {moodLogs.map((m) => (
              <LomaCard
                key={m.id}
                id={m.id}
                title={
                  m.mood === "radiante"
                    ? "☀️ Radiante"
                    : m.mood === "calmo"
                    ? "🌿 Calmo"
                    : m.mood === "cansado"
                    ? "🌙 Cansado"
                    : m.mood === "ansioso"
                    ? "⚡ Ansioso"
                    : "🔥 Desafiador"
                }
                category="Humor & Sono"
                meta={`Data: ${m.date} • ${m.sleepHours}h de sono`}
                badge={
                  <span className="text-xs text-[#C79A3B] font-bold">
                    {"★".repeat(m.energyLevel)}
                  </span>
                }
              >
                <div className="text-xs text-[#7A675A] flex flex-col gap-1">
                  <p>Sono: <strong>{m.sleepHours} horas de descanso</strong> • Nível de energia: {m.energyLevel}/5.</p>
                  {m.notes && <p className="italic mt-1">"{m.notes}"</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. DEVOCIONAL DIÁRIO (MÓDULO SEPARADO) */}
      {/* ======================================================== */}
      {subTab === "devocional" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Devocional Diário</h3>
              <p className="text-[13px] text-[#7A675A]">Leituras bíblicas, versículos salvos e meditação na Palavra.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("devocional")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Devocional
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {devotionals.map((d) => (
              <LomaCard
                key={d.id}
                id={d.id}
                title={d.title}
                category={d.passageOrVerse || "Reflexão"}
                meta={`Data: ${d.date}`}
                onDelete={() => deleteDevotional.mutate(d.id)}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-bold text-[#6F4C7D] uppercase">
                    {d.passageOrVerse || "Palavra"}
                  </span>
                }
              >
                {d.reflection && (
                  <p className="whitespace-pre-wrap text-xs text-[#7A675A] leading-relaxed italic">
                    "{d.reflection}"
                  </p>
                )}
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ESPIRITUALIDADE & VIDA DE ORAÇÃO (MÓDULO SEPARADO) */}
      {/* ======================================================== */}
      {subTab === "espiritualidade" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Espiritualidade & Vida de Oração</h3>
            <p className="text-[13px] text-[#7A675A]">Perfil espiritual, orações, jejum, gratidão e vida comunitária.</p>
          </div>

          <div className="flex flex-col space-y-2">
            <LomaCard
              id="esp_oracao"
              title="Vida de Oração & Intercessão"
              category="Prática Diária"
              meta="Clamor pela família, filhos, projetos e decisões"
              badge={<span className="text-xs font-bold text-[#7D8C6F]">Constante</span>}
            >
              <p className="text-xs text-[#7A675A]">
                Momentos intencionais de conversa com Deus no início e ao fim de cada dia.
              </p>
            </LomaCard>

            <LomaCard
              id="esp_jejum"
              title="Prática do Jejum & Consagração"
              category="Disciplina"
              meta="Propósitos espirituais e clareza de discernimento"
              badge={<span className="text-xs font-bold text-[#C79A3B]">Semanal</span>}
            >
              <p className="text-xs text-[#7A675A]">
                Jejum periódico com foco em sabedoria, quebra de ansiedade e alinhamento com a vontade divina.
              </p>
            </LomaCard>

            <LomaCard
              id="esp_gratidao"
              title="Caderno de Gratidão Familiar"
              category="Louvor & Reconhecimento"
              meta="Memórias de bênçãos e respostas de oração"
              badge={<span className="text-xs font-bold text-[#E8836B]">Diário</span>}
            >
              <p className="text-xs text-[#7A675A]">
                Registrar 3 motivos de gratidão a cada noite com as pessoas da casa.
              </p>
            </LomaCard>

            <LomaCard
              id="esp_comunidade"
              title="Comunidade & Igreja Local"
              category="Comunhão"
              meta="Cultos, pequenos grupos e serviço ao próximo"
              badge={<span className="text-xs font-bold text-[#653259]">Domingo & Terça</span>}
            >
              <p className="text-xs text-[#7A675A]">
                Participação ativa no corpo comunitário para fortalecimento mútuo da fé.
              </p>
            </LomaCard>

            <LomaCard
              id="esp_metas"
              title="Metas Espirituais do Ano"
              category="Crescimento"
              meta="Leitura completa dos Provérbios e Salmos"
              badge={<span className="text-xs font-bold text-[#2E2019]">Em Andamento</span>}
            >
              <p className="text-xs text-[#7A675A]">
                Meta de 1 capítulo diário e memorização de passagens-chave para a liderança do lar.
              </p>
            </LomaCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. ALIMENTAÇÃO & COZINHA */}
      {/* ======================================================== */}
      {subTab === "cozinha" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Alimentação & Cozinha</h3>
              <p className="text-[13px] text-[#7A675A]">Cardápio semanal planejado e refeições favoritas.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("refeicao")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Refeição
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {mealPlans.map((m) => (
              <LomaCard
                key={m.id}
                id={m.id}
                title={m.title}
                category={m.mealType}
                meta={`Dia da semana: ${m.dayOfWeek}`}
                onDelete={() => deleteMeal.mutate(m.id)}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-bold text-[#C27D38] uppercase">
                    {m.mealType}
                  </span>
                }
              >
                {m.recipeOrIngredients && (
                  <p className="text-xs text-[#7A675A] leading-relaxed">
                    <strong>Ingredientes / Preparo: </strong>{m.recipeOrIngredients}
                  </p>
                )}
              </LomaCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
