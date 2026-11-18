import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

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

export function BemEstarView({ data, isLoading, onOpenAddModal }: BemEstarProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as any) || "resumo";
  const [subTab, setSubTab] = useState<
    "resumo" | "saude" | "treinos" | "cuidados" | "humor" | "devocional" | "cozinha"
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
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
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
      {/* Sub-navegação dos módulos de Bem-estar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs max-w-full min-w-0">
        {[
          { key: "resumo", label: "Visão Geral" },
          { key: "saude", label: "Saúde" },
          { key: "treinos", label: "Corpo & Treinos" },
          { key: "cuidados", label: "Cuidados" },
          { key: "humor", label: "Humor & Sono" },
          { key: "devocional", label: "Devocional" },
          { key: "cozinha", label: "Alimentação" },
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
      {/* 1. VISÃO GERAL (RESUMO BEM-ESTAR) */}
      {/* ======================================================== */}
      {subTab === "resumo" && (
        <div className="flex flex-col gap-4">
          {/* Herói com padding 16px e raio 24px */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#231B16] p-4 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59, 122, 107, 0.35) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-[#3B7A6B] uppercase">
                Saúde & Equilíbrio Integral
              </span>
              <h2 className="font-serif text-2xl text-[#FAF7F2] leading-tight">
                Cuidar do corpo, da mente e do espírito<span className="text-[#3B7A6B]">.</span>
              </h2>
              <p className="text-xs text-[#FAF7F2]/70">
                Rotina de saúde preventiva, atividades físicas regulares e momentos de oração.
              </p>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/10 pt-2.5 text-center">
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Saúde</span>
                  <span className="text-base sm:text-lg font-bold text-[#FAF7F2] tabular-nums truncate w-full">{summary.pendingHealthCount}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Treinos</span>
                  <span className="text-base sm:text-lg font-bold text-[#E9F3F0] tabular-nums truncate w-full">{summary.workoutsCount}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Sono Médio</span>
                  <span className="text-base sm:text-lg font-bold text-[#F3EDF6] tabular-nums truncate w-full">{summary.avgSleepHours}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximas Consultas e Exames (Saúde) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Saúde Preventiva</h3>
              <button
                onClick={() => onOpenAddModal("saude")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
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
                    <span className="rounded-full bg-[#E9F3F0] px-2.5 py-1 text-[10px] font-semibold text-[#3B7A6B] capitalize">
                      {h.type}
                    </span>
                  }
                >
                  <p className="text-xs text-[#6E6259]">
                    Profissional: {h.doctorOrClinic || "Não informado"}. Data: {h.date}. {h.details ? `Observações: ${h.details}` : ""}
                  </p>
                </LomaCard>
              ))}
            </div>
          </div>

          {/* Treinos Recentes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Corpo & Atividade Física</h3>
              <button
                onClick={() => onOpenAddModal("treino")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
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
                    <span className="rounded-full bg-[#EDF1F5] px-2.5 py-1 text-[10px] font-semibold text-[#465768] capitalize">
                      {w.category}
                    </span>
                  }
                >
                  <p className="text-xs text-[#6E6259]">
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
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Saúde & Consultas</h3>
              <p className="text-[13px] text-[#7C6E62]">Consultas, exames periódicos e vacinas.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("saude")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
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
                  <span className="rounded-full bg-[#E9F3F0] px-2.5 py-1 text-[10px] font-semibold text-[#3B7A6B] capitalize">
                    {h.type}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
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
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Corpo & Esporte</h3>
              <p className="text-[13px] text-[#7C6E62]">Atividades físicas e treinos da família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("treino")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Treino
            </button>
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
                  <span className="rounded-full bg-[#EDF1F5] px-2.5 py-1 text-[10px] font-semibold text-[#465768] uppercase">
                    {w.category}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
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
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Cuidados & Autocuidado</h3>
              <p className="text-[13px] text-[#7C6E62]">Pele, cabelo, corpo, unhas e rotinas de relaxamento.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("cuidado")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Rotina
            </button>
          </div>

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
                  <span className="rounded-full bg-[#F8ECEE] px-2.5 py-1 text-[10px] font-semibold text-[#B36670] capitalize">
                    {c.category}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
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
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Humor, Sono & Energia</h3>
              <p className="text-[13px] text-[#7C6E62]">Acompanhamento emocional e qualidade de recuperação.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("humor")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Registrar
            </button>
          </div>

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
                  <span className="text-xs text-[#9E6123] font-bold">
                    {"★".repeat(m.energyLevel)}
                  </span>
                }
              >
                <div className="text-xs text-[#6E6259] flex flex-col gap-1">
                  <p>Sono: <strong>{m.sleepHours} horas de descanso</strong> • Nível de energia: {m.energyLevel}/5.</p>
                  {m.notes && <p className="italic mt-1">"{m.notes}"</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. DEVOCIONAL & ESPIRITUALIDADE */}
      {/* ======================================================== */}
      {subTab === "devocional" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Devocional & Vida Espiritual</h3>
              <p className="text-[13px] text-[#7C6E62]">Leituras bíblicas, orações e motivos de gratidão.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("devocional")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
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
                  <span className="rounded-full bg-[#F3EDF6] px-2.5 py-1 text-[10px] font-bold text-[#6F4C7D] uppercase">
                    {d.passageOrVerse || "Palavra"}
                  </span>
                }
              >
                {d.reflection && (
                  <p className="whitespace-pre-wrap text-xs text-[#6E6259] leading-relaxed italic">
                    "{d.reflection}"
                  </p>
                )}
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. ALIMENTAÇÃO & COZINHA */}
      {/* ======================================================== */}
      {subTab === "cozinha" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Alimentação & Cozinha</h3>
              <p className="text-[13px] text-[#7C6E62]">Cardápio semanal planejado e refeições favoritas.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("refeicao")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
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
                  <span className="rounded-full bg-[#FBF2E6] px-2.5 py-1 text-[10px] font-bold text-[#C27D38] uppercase">
                    {m.mealType}
                  </span>
                }
              >
                {m.recipeOrIngredients && (
                  <p className="text-xs text-[#6E6259] leading-relaxed">
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
