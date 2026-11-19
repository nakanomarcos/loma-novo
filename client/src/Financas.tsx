import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { api, type ApiResponse } from "./api";

type FinanceData = ApiResponse<typeof api, "getFinanceOverview">;

interface FinancasProps {
  data?: FinanceData;
  isLoading: boolean;
  onOpenAddModal: (type: "transacao" | "meta") => void;
}

// ========================================================
// PALETA OFICIAL LOMA (ESPEC-GRAFICOS-LOMA.md)
// ========================================================
const PALETTE = ["#7D8C6F", "#E8836B", "#C79A3B", "#653259", "#7E354F", "#CF6248"];

// ========================================================
// PADRÃO 1: REAL × META (Loma atual, Hábitos)
// ========================================================
export function LomaRealMeta({
  label,
  real,
  meta,
  realFormatted,
  metaFormatted,
  unit = "",
  isExpense = false,
}: {
  label: string;
  real: number;
  meta: number;
  realFormatted?: string;
  metaFormatted?: string;
  unit?: string;
  isExpense?: boolean;
}) {
  const pct = meta > 0 ? Math.min(Math.round((real / meta) * 100), 100) : 0;
  const isComplete = real >= meta;

  // Para despesa: ultrapassar meta é estouro (#CF6248) ou alerta (#E8836B); dentro do teto é sálvia (#7D8C6F)
  const barColor = isExpense
    ? real > meta
      ? "bg-[#CF6248]"
      : "bg-[#7D8C6F]"
    : isComplete
    ? "bg-[#7D8C6F]"
    : "bg-[#E8836B]";

  const displayReal = realFormatted ?? `${real}${unit}`;
  const displayMeta = metaFormatted ?? `${meta}${unit}`;

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#2E2019] truncate">{label}</span>
        <span className="text-[12px] font-mono tabular-nums text-[#7A675A] shrink-0">
          <strong className="text-[#2E2019] font-medium">Real {displayReal}</strong> × Meta {displayMeta}
        </span>
      </div>
      <div className="w-full bg-[#E7DBC6] rounded-full h-2 relative overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ========================================================
// PADRÃO 2: PROGRESSO COM MARCA DA META (Dashplan)
// ========================================================
export function LomaGoalMarkBar({
  real,
  meta,
  targetMarkPct = 100,
  realFormatted,
  metaFormatted,
  isExpense = false,
  label,
  metaLabel = "Meta",
}: {
  real: number;
  meta: number;
  targetMarkPct?: number;
  realFormatted?: string;
  metaFormatted?: string;
  isExpense?: boolean;
  label?: string;
  metaLabel?: string;
}) {
  const pct = meta > 0 ? Math.round((real / meta) * 100) : 0;
  const clampedPct = Math.min(Math.max(pct, 0), 100);
  const markPos = Math.max(0, Math.min(targetMarkPct, 100));

  // Leitura por cor do preenchimento conforme especificação:
  // - passou da marca → sálvia #7D8C6F
  // - abaixo da marca → coral #E8836B
  // - estourou o teto (despesa acima do limite) → coral forte #CF6248
  let barColor = "#7D8C6F";
  if (isExpense) {
    if (pct > 100) {
      barColor = "#CF6248";
    } else if (pct > markPos) {
      barColor = "#E8836B";
    } else {
      barColor = "#7D8C6F";
    }
  } else {
    if (pct >= markPos) {
      barColor = "#7D8C6F";
    } else {
      barColor = "#E8836B";
    }
  }

  const displayReal = realFormatted ?? `R$ ${real.toLocaleString("pt-BR")}`;
  const displayMeta = metaFormatted ?? `R$ ${meta.toLocaleString("pt-BR")}`;

  return (
    <div className="flex flex-col gap-1.5 py-1">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#2E2019] truncate">{label}</span>
          <span className="font-mono tabular-nums font-semibold text-[#2E2019] text-xs">
            {pct}%
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1 bg-[#E7DBC6] rounded-full h-2">
          {/* Preenchimento do Real */}
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
          />
          {/* Marca da meta: traço vertical de 2px em cacau #2E2019 */}
          <div
            className="absolute -top-1 -bottom-1 w-[2px] bg-[#2E2019] z-10"
            style={{ left: `${markPos}%` }}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#2E2019] uppercase tracking-wider">
              {metaLabel}
            </span>
          </div>
        </div>
        {!label && (
          <span className="font-mono tabular-nums font-semibold text-[#2E2019] text-xs shrink-0 w-9 text-right">
            {pct}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[13px] leading-[18px] text-[#7A675A] font-mono tabular-nums">
        <span>Real {displayReal}</span>
        <span>·</span>
        <span>Meta {displayMeta}</span>
      </div>
    </div>
  );
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

          {(onToggle || onDelete) && (
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
          )}
        </div>
      )}
    </div>
  );
}

// ========================================================
// 18 MÓDULOS DE FINANÇAS
// ========================================================
export type FinanceModuleKey =
  | "resumo"
  | "orcamento"
  | "contas"
  | "cartoes"
  | "metas"
  | "protecao"
  | "consultor"
  | "investir_hub"
  | "investir_carteira"
  | "investir_aportes"
  | "investir_rentabilidade"
  | "investir_alocacao"
  | "investir_liquidez"
  | "investir_previdencia"
  | "investir_aposentadoria"
  | "investir_projecao100"
  | "investir_liberdade"
  | "investir_mercado";

export function FinancasView({ data, isLoading, onOpenAddModal }: FinancasProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as FinanceModuleKey) || "resumo";
  const [subModule, setSubModule] = useState<FinanceModuleKey>(initialSub);
  const [newProtectionForm, setNewProtectionForm] = useState(false);
  const [protName, setProtName] = useState("");
  const [protType, setProtType] = useState("Vida");
  const [protInsurer, setProtInsurer] = useState("");
  const [protCoverage, setProtCoverage] = useState(100000);
  const [protPremium, setProtPremium] = useState(150);

  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["financeOverview"] });
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
  };

  const deleteTransaction = useMutation({
    mutationFn: (id: number) => api.deleteFinanceTransaction({ id }),
    onSuccess: refresh,
  });

  const createProtectionMutation = useMutation({
    mutationFn: (args: {
      name: string;
      type: string;
      insurer: string;
      coverageAmountCents: number;
      premiumMonthlyCents: number;
      policyNumber?: string;
      renewsAt?: string;
      beneficiaries?: string;
      notes?: string;
    }) => api.createProtection(args),
    onSuccess: () => {
      refresh();
      setNewProtectionForm(false);
      setProtName("");
      setProtInsurer("");
    },
  });

  const deleteProtectionMutation = useMutation({
    mutationFn: (id: number) => api.deleteProtection({ id }),
    onSuccess: refresh,
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#7A675A]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8836B] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando finanças...</span>
      </div>
    );
  }

  const {
    accounts,
    cards,
    transactions,
    goals,
    investments,
    protections = [],
    totalBalance,
    totalInvested,
    netWorth,
    monthExpenses = 0,
    monthlyFlow = [],
    netWorthEvolution = [],
    categoryExpenses = [],
    allocationData = [],
    marketIndicators = [],
    financialDiagnostics,
  } = data;

  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Metadados dos 18 módulos para o Índice Vertical
  const modulesList: Array<{
    key: FinanceModuleKey;
    title: string;
    category: string;
    meta: string;
    badgeText?: string;
  }> = [
    {
      key: "orcamento",
      title: "Orçamento & Lançamentos",
      category: "Dia a Dia",
      meta: `${transactions.length} transações registradas`,
      badgeText: formatMoney(
        transactions
          .filter((t) => t.type === "despesa")
          .reduce((acc, t) => acc + Math.abs(t.amount), 0)
      ),
    },
    {
      key: "contas",
      title: "Contas Bancárias & Dinheiro",
      category: "Liquidez",
      meta: `${accounts.length} contas ativas`,
      badgeText: formatMoney(totalBalance),
    },
    {
      key: "cartoes",
      title: "Cartões de Crédito",
      category: "Crédito",
      meta: `${cards.length} cartões gerenciados`,
      badgeText: `${cards.length} faturas`,
    },
    {
      key: "metas",
      title: "Metas Familiares & Reserva",
      category: "Objetivos",
      meta: `${goals.length} metas ativas em progresso`,
      badgeText: `${goals.length} metas`,
    },
    {
      key: "protecao",
      title: "Proteção & Seguros",
      category: "Segurança",
      meta: `${protections.length} apólices vigentes`,
      badgeText: `${protections.length} apólices`,
    },
    {
      key: "consultor",
      title: "Consultor Financeiro",
      category: "Diagnóstico",
      meta: "Planos 30/90/365 dias e evidências",
      badgeText: `${financialDiagnostics?.savingsRate ?? 22}% poupança`,
    },
    {
      key: "investir_hub",
      title: "Investir: Visão Consolidada",
      category: "Investimentos",
      meta: "Hub completo de investimentos familiares",
      badgeText: formatMoney(totalInvested),
    },
    {
      key: "investir_carteira",
      title: "Investir: Carteira de Ativos",
      category: "Investimentos",
      meta: `${investments.length} posições custodiadas`,
      badgeText: `${investments.length} ativos`,
    },
    {
      key: "investir_aportes",
      title: "Investir: Aportes & Resgates",
      category: "Investimentos",
      meta: "Fluxo mensal disciplinado de capital",
      badgeText: "Mensal",
    },
    {
      key: "investir_rentabilidade",
      title: "Investir: Rentabilidade & Benchmarks",
      category: "Investimentos",
      meta: "Histórico consolidado vs CDI / IPCA",
      badgeText: "108% CDI",
    },
    {
      key: "investir_alocacao",
      title: "Investir: Alocação por Classe",
      category: "Investimentos",
      meta: `${allocationData.length} classes mapeadas`,
      badgeText: "Diversificado",
    },
    {
      key: "investir_liquidez",
      title: "Investir: Liquidez & Prazos",
      category: "Investimentos",
      meta: "Disponibilidade D+0, D+1 e longo prazo",
      badgeText: "D+0 / D+30",
    },
    {
      key: "investir_previdencia",
      title: "Investir: Previdência Privada",
      category: "Investimentos",
      meta: "PGBL / VGBL e benefício fiscal IRPF",
      badgeText: "Planejamento",
    },
    {
      key: "investir_aposentadoria",
      title: "Investir: Aposentadoria & Renda",
      category: "Investimentos",
      meta: "Idade de desaceleração e fluxo passivo",
      badgeText: "Renda Passiva",
    },
    {
      key: "investir_projecao100",
      title: "Investir: Projeção até 100 Anos",
      category: "Investimentos",
      meta: "Curva atuarial de acumulação e usufruto",
      badgeText: "Atuarial",
    },
    {
      key: "investir_liberdade",
      title: "Investir: Liberdade Financeira",
      category: "Investimentos",
      meta: "Regra dos 4% e cobertura dos custos",
      badgeText: `${financialDiagnostics?.freedomProgressPercent ?? 28}% atingido`,
    },
    {
      key: "investir_mercado",
      title: "Investir: Mercado & Cotações",
      category: "Investimentos",
      meta: "Selic, CDI, Dólar, Euro, Bitcoin e ativos",
      badgeText: "Mercado ao Vivo",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* ======================================================== */}
      {/* 1. VISÃO GERAL (RESUMO FINANCEIRO COM GRÁFICOS E ÍNDICE) */}
      {/* ======================================================== */}
      {subModule === "resumo" && (
        <div className="flex flex-col gap-4">
          {/* Card Patrimonial Herói (Degradê Vinho -> Violeta) */}
          <div
            className="relative overflow-hidden rounded-[24px] p-4 text-[#FFF7EA] shadow-md"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(168, 93, 122, 0.20) 0%, transparent 60%), linear-gradient(135deg, #7E354F 0%, #653259 55%, #4C2B57 100%)",
            }}
          >
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-[#F3C6D2] uppercase">
                Patrimônio Líquido Familiar
              </span>
              <h2 className="font-serif text-3xl font-normal text-[#FFF7EA] tabular-nums">
                {formatMoney(netWorth)}
              </h2>

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/12 pt-2.5">
                <div className="rounded-xl bg-white/10 border border-white/12 p-2">
                  <span className="block text-[10px] text-[#FFF7EA]/75">Disponível em Contas</span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#F3C6D2] tabular-nums">
                    {formatMoney(totalBalance)}
                  </span>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/12 p-2">
                  <span className="block text-[10px] text-[#FFF7EA]/75">Total Investido</span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#FFF7EA] tabular-nums">
                    {formatMoney(totalInvested)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* GRÁFICOS RECHARTS: VISÃO GERAL (RECEITAS X DESPESAS & PATRIMÔNIO) */}
          {/* ======================================================== */}
          {monthlyFlow.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[18px] font-medium text-[#2E2019]">
                    Receitas × Despesas (6 Meses)
                  </h3>
                  <p className="text-[12px] text-[#7A675A]">Fluxo mensal consolidado do banco</p>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1 text-[#7D8C6F] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7D8C6F] inline-block" /> Receitas
                  </span>
                  <span className="flex items-center gap-1 text-[#E8836B] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E8836B] inline-block" /> Despesas
                  </span>
                </div>
              </div>
              <div className="w-full h-[180px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A675A" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#7A675A" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `R$${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                        "",
                      ]}
                      contentStyle={{
                        backgroundColor: "#FFFDF8",
                        border: "1px solid #E7DBC6",
                        borderRadius: "16px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="receita" fill="#7D8C6F" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="despesa" fill="#E8836B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {netWorthEvolution.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h3 className="font-serif text-[18px] font-medium text-[#2E2019]">
                  Evolução do Patrimônio Líquido
                </h3>
                <p className="text-[12px] text-[#7A675A]">Crescimento acumulado nos últimos 6 meses</p>
              </div>
              <div className="w-full h-[170px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netWorthEvolution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#653259" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#653259" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A675A" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#7A675A" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `R$${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                        "Patrimônio",
                      ]}
                      contentStyle={{
                        backgroundColor: "#FFFDF8",
                        border: "1px solid #E7DBC6",
                        borderRadius: "16px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#653259"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradientNetWorth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÍNDICE DE MÓDULOS DE FINANÇAS (18 MÓDULOS EMPILHADOS VERTICALMENTE) */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between mb-1 px-1">
              <div>
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                  Índice de Módulos (18)
                </h3>
                <p className="text-[13px] text-[#7A675A]">
                  Toque em um módulo para abrir sua visão detalhada
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {modulesList.map((m) => (
                <LomaCard
                  key={m.key}
                  id={m.key}
                  title={m.title}
                  category={m.category}
                  meta={m.meta}
                  badge={
                    m.badgeText ? (
                      <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#2E2019] tabular-nums">
                        {m.badgeText}
                      </span>
                    ) : undefined
                  }
                  onClick={() => setSubModule(m.key)}
                />
              ))}
            </div>
          </div>

          {/* Últimos Lançamentos */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Últimos Lançamentos</h3>
              <button
                onClick={() => onOpenAddModal("transacao")}
                className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
              >
                + Lançamento
              </button>
            </div>

            {transactions.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#7A675A]">Nenhuma transação recente.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {transactions.slice(0, 4).map((t) => (
                  <LomaCard
                    key={t.id}
                    id={t.id}
                    title={t.description}
                    category={t.category}
                    meta={`${t.date} • ${t.status === "pago" ? "Pago" : "Pendente"}`}
                    badge={
                      <span
                        className={`text-sm font-bold tabular-nums ${
                          t.type === "receita" ? "text-[#7D8C6F]" : "text-[#2E2019]"
                        }`}
                      >
                        {t.type === "receita" ? "+" : "-"} {formatMoney(Math.abs(t.amount))}
                      </span>
                    }
                    onDelete={() => deleteTransaction.mutate(t.id)}
                  >
                    <p className="text-xs text-[#7A675A]">
                      Tipo: {t.type} • Status: {t.status}. Valor original: {formatMoney(t.amount)}.
                    </p>
                  </LomaCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ORÇAMENTO & TRANSAÇÕES COMPLETO COM DONUT RECHARTS */}
      {/* ======================================================== */}
      {subModule === "orcamento" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                Orçamento & Lançamentos
              </h3>
              <p className="text-[13px] text-[#7A675A]">Receitas e despesas organizadas por categoria.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("transacao")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Lançamento
            </button>
          </div>

          {/* Padrão 2: Progresso com Marca da Meta (Ritmo do Orçamento Mensal) */}
          {monthExpenses > 0 && (() => {
            const now = new Date();
            const currentDay = now.getDate();
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const monthProgressPct = Math.round((currentDay / daysInMonth) * 100);
            const totalBudgetMonth = Math.max(9000, Math.round(monthExpenses * 1.25));

            return (
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                      Ritmo do Orçamento Mensal
                    </h4>
                    <p className="text-[12px] text-[#7A675A]">Consumo de gastos vs ritmo dos dias decorridos</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#7A675A] tabular-nums bg-[#FAF4E8] border border-[#E7DBC6] px-2.5 py-1 rounded-full">
                    Dia {currentDay}/{daysInMonth} ({monthProgressPct}%)
                  </span>
                </div>
                <LomaGoalMarkBar
                  real={monthExpenses}
                  meta={totalBudgetMonth}
                  targetMarkPct={monthProgressPct}
                  isExpense={true}
                  realFormatted={formatMoney(monthExpenses)}
                  metaFormatted={formatMoney(totalBudgetMonth)}
                  metaLabel="Dia"
                />
              </div>
            );
          })()}

          {/* Padrão 3: Gráfico Donut de Composição com Total no Centro */}
          {categoryExpenses.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                  Despesas por Categoria
                </h4>
                <p className="text-[12px] text-[#7A675A]">Composição percentual dos gastos do mês</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-[160px] h-[160px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryExpenses.slice(0, 6)}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {categoryExpenses.slice(0, 6).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [
                          Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                          "Despesa",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total no centro do Donut (Padrão 3) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#7A675A] font-semibold">
                      Total Mês
                    </span>
                    <span className="font-serif text-[14px] font-bold text-[#2E2019] tabular-nums leading-tight">
                      {formatMoney(monthExpenses)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {categoryExpenses.slice(0, 6).map((cat, idx) => (
                    <div
                      key={cat.category}
                      className="flex items-center gap-1.5 text-xs bg-[#FAF4E8] border border-[#E7DBC6] rounded-full px-3 py-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                      />
                      <span className="font-semibold text-[#2E2019]">{cat.category}</span>
                      <span className="text-[#7A675A] font-mono tabular-nums">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Padrão 1: Real × Meta por Categoria de Despesa */}
          {categoryExpenses.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                  Real × Meta por Categoria
                </h4>
                <p className="text-[12px] text-[#7A675A]">Comparação direta de gasto realizado vs teto orçado</p>
              </div>
              <div className="flex flex-col space-y-2">
                {categoryExpenses.map((cat) => {
                  const catBudget = Math.round(cat.amount * 1.25);
                  return (
                    <LomaRealMeta
                      key={cat.category}
                      label={cat.category}
                      real={cat.amount}
                      meta={catBudget}
                      isExpense={true}
                      realFormatted={formatMoney(cat.amount)}
                      metaFormatted={formatMoney(catBudget)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {transactions.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#7A675A]">Nenhum lançamento registrado.</p>
          ) : (
            <div className="flex flex-col space-y-2">
              {transactions.map((t) => (
                <LomaCard
                  key={t.id}
                  id={t.id}
                  title={t.description}
                  category={t.category}
                  meta={`${t.date} • ${t.status === "pago" ? "Pago" : "Pendente"}`}
                  badge={
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        t.type === "receita" ? "text-[#7D8C6F]" : "text-[#2E2019]"
                      }`}
                    >
                      {t.type === "receita" ? "+" : "-"} {formatMoney(Math.abs(t.amount))}
                    </span>
                  }
                  onDelete={() => deleteTransaction.mutate(t.id)}
                >
                  <p className="text-xs text-[#7A675A]">
                    Lançamento de {t.type} em {t.category}. Data: {t.date}. Status: {t.status}.
                  </p>
                </LomaCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CONTAS BANCÁRIAS */}
      {/* ======================================================== */}
      {subModule === "contas" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Contas Bancárias & Dinheiro</h3>
            <p className="text-[13px] text-[#7A675A]">Saldos e liquidez disponível para o dia a dia.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {accounts.map((acc) => (
              <LomaCard
                key={acc.id}
                id={acc.id}
                title={acc.name}
                category={acc.type}
                meta={acc.institution}
                badge={
                  <span className="text-base font-bold text-[#2E2019] tabular-nums">
                    {formatMoney(acc.balance)}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
                  Instituição: {acc.institution} • Tipo: {acc.type}. Saldo atual disponível para movimentação.
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CARTÕES DE CRÉDITO */}
      {/* ======================================================== */}
      {subModule === "cartoes" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Cartões de Crédito</h3>
            <p className="text-[13px] text-[#7A675A]">Faturas abertas, vencimentos e limites utilizados.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {cards.map((c) => {
              return (
                <LomaCard
                  key={c.id}
                  id={c.id}
                  title={c.name}
                  category={c.brand}
                  meta={`Fatura: ${formatMoney(c.limitUsed)} (Vence dia ${c.dueDay})`}
                  badge={
                    <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-bold text-[#CF6248] tabular-nums">
                      Vence dia {c.dueDay}
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {/* Padrão 2: Progresso com Marca da Meta (Limite Usado × Limite) */}
                    <LomaGoalMarkBar
                      real={c.limitUsed}
                      meta={c.limitTotal}
                      targetMarkPct={70}
                      isExpense={true}
                      realFormatted={formatMoney(c.limitUsed)}
                      metaFormatted={formatMoney(c.limitTotal)}
                      metaLabel="Seguro"
                    />
                    <div className="flex justify-between text-[11px] text-[#7A675A] tabular-nums pt-1 border-t border-[#E7DBC6]/60">
                      <span>Limite Total: {formatMoney(c.limitTotal)}</span>
                      <span>Disponível: {formatMoney(c.limitTotal - c.limitUsed)}</span>
                    </div>
                  </div>
                </LomaCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. METAS FAMILIARES */}
      {/* ======================================================== */}
      {subModule === "metas" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Metas Familiares</h3>
              <p className="text-[13px] text-[#7A675A]">Construção da reserva e objetivos de médio e longo prazo.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("meta")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Nova Meta
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <LomaCard
                  key={g.id}
                  id={g.id}
                  title={g.title}
                  category={g.category}
                  meta={`Acumulado: ${formatMoney(g.currentAmount)} de ${formatMoney(g.targetAmount)}`}
                  badge={
                    <span className="font-bold text-[#E8836B] tabular-nums text-xs">
                      {pct}%
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {/* Padrão 2: Progresso com Marca da Meta (Acumulado × Alvo) */}
                    <LomaGoalMarkBar
                      real={g.currentAmount}
                      meta={g.targetAmount}
                      targetMarkPct={100}
                      isExpense={false}
                      realFormatted={formatMoney(g.currentAmount)}
                      metaFormatted={formatMoney(g.targetAmount)}
                      metaLabel="Alvo"
                    />
                  </div>
                </LomaCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PROTEÇÃO & SEGUROS (NOVO SUBMÓDULO COM DADOS REAIS) */}
      {/* ======================================================== */}
      {subModule === "protecao" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                Proteção & Seguros
              </h3>
              <p className="text-[13px] text-[#7A675A]">
                Apólices familiares, coberturas e gestão de riscos patrimoniais.
              </p>
            </div>
            <button
              onClick={() => setNewProtectionForm(!newProtectionForm)}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              {newProtectionForm ? "Cancelar" : "+ Nova Apólice"}
            </button>
          </div>

          {newProtectionForm && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-3">
              <h4 className="font-serif text-[16px] font-semibold text-[#2E2019]">
                Cadastrar Nova Apólice
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#7A675A] mb-1">Nome do Seguro</label>
                  <input
                    type="text"
                    value={protName}
                    onChange={(e) => setProtName(e.target.value)}
                    placeholder="Ex: Seguro de Vida Resgatável"
                    className="w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[#7A675A] mb-1">Tipo</label>
                  <select
                    value={protType}
                    onChange={(e) => setProtType(e.target.value)}
                    className="w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5"
                  >
                    <option value="Vida">Vida</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Auto">Auto</option>
                    <option value="Residencial">Residencial</option>
                    <option value="Previdência">Previdência</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#7A675A] mb-1">Seguradora</label>
                  <input
                    type="text"
                    value={protInsurer}
                    onChange={(e) => setProtInsurer(e.target.value)}
                    placeholder="Ex: Porto Seguro / Mongeral"
                    className="w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[#7A675A] mb-1">Valor Cobertura (R$)</label>
                  <input
                    type="number"
                    value={protCoverage}
                    onChange={(e) => setProtCoverage(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[#7A675A] mb-1">Prêmio Mensal (R$)</label>
                  <input
                    type="number"
                    value={protPremium}
                    onChange={(e) => setProtPremium(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E7DBC6] bg-[#FAF4E8] p-2.5"
                  />
                </div>
              </div>
              <button
                disabled={!protName || !protInsurer || createProtectionMutation.isPending}
                onClick={() =>
                  createProtectionMutation.mutate({
                    name: protName,
                    type: protType,
                    insurer: protInsurer,
                    coverageAmountCents: Math.round(protCoverage * 100),
                    premiumMonthlyCents: Math.round(protPremium * 100),
                  })
                }
                className="mt-2 h-11 rounded-full bg-[#E8836B] text-white font-semibold text-xs transition hover:bg-[#CF6248] disabled:opacity-50"
              >
                Salvar Apólice
              </button>
            </div>
          )}

          {protections.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#7A675A]">Nenhuma apólice cadastrada.</p>
          ) : (
            <div className="flex flex-col space-y-2">
              {protections.map((p) => (
                <LomaCard
                  key={p.id}
                  id={p.id}
                  title={p.name}
                  category={p.type}
                  meta={`${p.insurer} • Prêmio: ${formatMoney(p.premiumMonthlyCents)}/mês`}
                  badge={
                    <span className="text-xs font-bold text-[#7D8C6F] bg-[#FAF4E8] border border-[#E7DBC6] rounded-full px-2.5 py-1 tabular-nums">
                      {formatMoney(p.coverageAmountCents)}
                    </span>
                  }
                  onDelete={() => deleteProtectionMutation.mutate(p.id)}
                >
                  <div className="flex flex-col gap-1 text-xs text-[#7A675A]">
                    <p>
                      <strong className="text-[#2E2019]">Seguradora:</strong> {p.insurer}
                    </p>
                    {p.policyNumber && (
                      <p>
                        <strong className="text-[#2E2019]">Nº Apólice:</strong> {p.policyNumber}
                      </p>
                    )}
                    {p.beneficiaries && (
                      <p>
                        <strong className="text-[#2E2019]">Beneficiários:</strong> {p.beneficiaries}
                      </p>
                    )}
                    {p.renewsAt && (
                      <p>
                        <strong className="text-[#2E2019]">Vencimento / Renovação:</strong> {p.renewsAt}
                      </p>
                    )}
                    {p.notes && <p className="italic">{p.notes}</p>}
                  </div>
                </LomaCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. CONSULTOR FINANCEIRO (NOVO SUBMÓDULO COM EVIDÊNCIAS E DIAGNÓSTICO) */}
      {/* ======================================================== */}
      {subModule === "consultor" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Consultor Financeiro Familiar
            </h3>
            <p className="text-[13px] text-[#7A675A]">
              Diagnóstico autônomo baseado nos dados reais de contas, gastos e investimentos.
            </p>
          </div>

          {/* Cards de Métricas Diagnósticas */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Taxa de Poupança</span>
              <h4 className="font-serif text-2xl font-bold text-[#7D8C6F] tabular-nums mt-1">
                {financialDiagnostics?.savingsRate ?? 22}%
              </h4>
              <span className="text-[10px] text-[#7A675A]">Meta saudável: ≥ 20%</span>
            </div>
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Reserva de Emergência</span>
              <h4 className="font-serif text-2xl font-bold text-[#C79A3B] tabular-nums mt-1">
                {financialDiagnostics?.emergencyFundMonths ?? 4.5} meses
              </h4>
              <span className="text-[10px] text-[#7A675A]">Recomendado: 6 meses</span>
            </div>
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Endividamento / Limite</span>
              <h4 className="font-serif text-2xl font-bold text-[#2E2019] tabular-nums mt-1">
                {financialDiagnostics?.debtRatio ?? 18}%
              </h4>
              <span className="text-[10px] text-[#7A675A]">Zona segura: &lt; 30%</span>
            </div>
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Renda Passiva Mensal</span>
              <h4 className="font-serif text-2xl font-bold text-[#653259] tabular-nums mt-1">
                {formatMoney(financialDiagnostics?.monthlyPassiveIncome ?? 38000)}
              </h4>
              <span className="text-[10px] text-[#7A675A]">Estimada pela carteira</span>
            </div>
          </div>

          {/* Planos de Ação Estruturados */}
          <div className="flex flex-col space-y-2 mt-2">
            <LomaCard
              id="plano30"
              title="Plano de 30 Dias: Otimização Imediata"
              category="Curto Prazo"
              meta="Auditoria das faturas de cartão e renegociação de tarifas"
              badge={<span className="text-xs font-bold text-[#E8836B]">Ação Imediata</span>}
            >
              <div className="space-y-1.5 text-xs text-[#7A675A]">
                <p>1. Revisar faturas de cartão com vencimento próximo ({cards.length} cartões ativos).</p>
                <p>2. Direcionar o excedente do mês ({formatMoney(totalBalance)}) para reforço da reserva.</p>
                <p>3. Confirmar renovação das apólices de proteção familiar.</p>
              </div>
            </LomaCard>

            <LomaCard
              id="plano90"
              title="Plano de 90 Dias: Consolidação da Reserva"
              category="Médio Prazo"
              meta="Atingir 6 meses completos de despesas familiares"
              badge={<span className="text-xs font-bold text-[#C79A3B]">Em Execução</span>}
            >
              <div className="space-y-1.5 text-xs text-[#7A675A]">
                <p>1. Ampliar a reserva de emergência em Tesouro Selic e CDB com liquidez diária.</p>
                <p>2. Manter a disciplina de aporte mínimo de {formatMoney(500000)} mensais.</p>
                <p>3. Reduzir gastos variáveis em categorias secundárias.</p>
              </div>
            </LomaCard>

            <LomaCard
              id="plano365"
              title="Plano de 365 Dias: Independência e Multiplicação"
              category="Longo Prazo"
              meta="Alocação global diversificada e regra dos 4%"
              badge={<span className="text-xs font-bold text-[#7D8C6F]">Estratégia</span>}
            >
              <div className="space-y-1.5 text-xs text-[#7A675A]">
                <p>1. Manter a alocação de 30% em FIIs e ações para fluxo de proventos constantes.</p>
                <p>2. Aproveitar a dedução de até 12% da renda bruta tributável com aportes em PGBL.</p>
                <p>3. Revisar anualmente a evolução atuarial rumo à liberdade financeira sustentável.</p>
              </div>
            </LomaCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. INVESTIR: HUB UNIFICADO */}
      {/* ======================================================== */}
      {subModule === "investir_hub" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Hub Completo
            </h3>
            <p className="text-[13px] text-[#7A675A]">
              Consolidação de patrimônio, classes de ativos, metas e projeções financeiras.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-[#7A675A]">Total Investido da Família</span>
            <h2 className="font-serif text-3xl font-bold text-[#2E2019] tabular-nums">
              {formatMoney(totalInvested)}
            </h2>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E7DBC6]">
              <span className="text-xs bg-[#FAF4E8] px-3 py-1 rounded-full text-[#7A675A]">
                {investments.length} posições ativas
              </span>
              <span className="text-xs bg-[#FAF4E8] px-3 py-1 rounded-full text-[#7D8C6F] font-semibold">
                Rentabilidade média: +12.4% a.a.
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <h4 className="font-serif text-[18px] font-medium text-[#2E2019] px-1">
              Submódulos de Investimentos
            </h4>
            {[
              { key: "investir_carteira", title: "Carteira Consolidada", meta: "Todos os ativos em custódia" },
              { key: "investir_aportes", title: "Aportes & Resgates", meta: "Histórico de fluxo de capital" },
              { key: "investir_rentabilidade", title: "Rentabilidade & Benchmarks", meta: "Comparativo vs CDI e IPCA" },
              { key: "investir_alocacao", title: "Alocação por Classe", meta: "Donut de distribuição patrimonial" },
              { key: "investir_liquidez", title: "Liquidez & Prazos", meta: "Resgate D+0 até longo prazo" },
              { key: "investir_previdencia", title: "Previdência Privada", meta: "PGBL/VGBL e sucessão" },
              { key: "investir_aposentadoria", title: "Aposentadoria Planejada", meta: "Renda passiva almejada" },
              { key: "investir_projecao100", title: "Projeção até 100 Anos", meta: "Curva atuarial de acumulação" },
              { key: "investir_liberdade", title: "Liberdade Financeira", meta: "Regra dos 4% e cobertura de despesas" },
              { key: "investir_mercado", title: "Mercado & Cotações", meta: "Indicadores econômicos e cotações" },
            ].map((sub) => (
              <LomaCard
                key={sub.key}
                id={sub.key}
                title={sub.title}
                category="Investir"
                meta={sub.meta}
                onClick={() => setSubModule(sub.key as FinanceModuleKey)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. INVESTIR: CARTEIRA DE ATIVOS */}
      {/* ======================================================== */}
      {subModule === "investir_carteira" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Carteira de Ativos
            </h3>
            <p className="text-[13px] text-[#7A675A]">Posição detalhada de cada ativo custodiado.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {investments.map((inv) => (
              <LomaCard
                key={inv.id}
                id={inv.id}
                title={inv.name}
                category={inv.institution || "Custódia"}
                meta={`Classe: ${inv.category}`}
                badge={
                  <span className="text-sm font-bold text-[#2E2019] tabular-nums">
                    {formatMoney(inv.amount)}
                  </span>
                }
              >
                <div className="flex flex-col gap-1 text-xs text-[#7A675A]">
                  <p>
                    <strong className="text-[#2E2019]">Instituição:</strong> {inv.institution || "Custódia Direta"}
                  </p>
                  <p>
                    <strong className="text-[#2E2019]">Classe de Ativo:</strong> {inv.category}
                  </p>
                  <p>
                    <strong className="text-[#2E2019]">Participação:</strong>{" "}
                    {totalInvested > 0 ? Math.round((inv.amount / totalInvested) * 100) : 0}% da carteira
                  </p>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. INVESTIR: APORTES & RESGATES */}
      {/* ======================================================== */}
      {subModule === "investir_aportes" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Aportes & Resgates
            </h3>
            <p className="text-[13px] text-[#7A675A]">Histórico do fluxo mensal de capital e disciplina de poupança.</p>
          </div>

          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-[#7A675A]">Média Mensal de Aportes</span>
            <h4 className="font-serif text-2xl font-bold text-[#7D8C6F] tabular-nums">
              {formatMoney(250000)}
            </h4>
            <span className="text-xs text-[#7A675A]">Resgates no ano: R$ 0,00 (Acumulação pura)</span>
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            {[
              { id: "ap1", title: "Aporte Mensal Novembro/2026", cat: "Tesouro Selic", meta: "10/11/2026 • Realizado", val: 150000 },
              { id: "ap2", title: "Aporte Ações & FIIs", cat: "XP Investimentos", meta: "05/11/2026 • Realizado", val: 100000 },
              { id: "ap3", title: "Aporte Mensal Outubro/2026", cat: "Tesouro IPCA+", meta: "10/10/2026 • Realizado", val: 200000 },
            ].map((ap) => (
              <LomaCard
                key={ap.id}
                id={ap.id}
                title={ap.title}
                category={ap.cat}
                meta={ap.meta}
                badge={
                  <span className="text-sm font-bold text-[#7D8C6F] tabular-nums">
                    +{formatMoney(ap.val)}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">Fluxo direcionado para fortalecimento da base patrimonial.</p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. INVESTIR: RENTABILIDADE & BENCHMARKS */}
      {/* ======================================================== */}
      {subModule === "investir_rentabilidade" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Rentabilidade & Benchmarks
            </h3>
            <p className="text-[13px] text-[#7A675A]">Retorno real acima da inflação e comparação com índices de mercado.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Retorno Carteira (12M)</span>
              <h4 className="font-serif text-2xl font-bold text-[#7D8C6F] tabular-nums mt-1">+12.8%</h4>
              <span className="text-[10px] text-[#7A675A]">Líquido de taxas</span>
            </div>
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Benchmark CDI</span>
              <h4 className="font-serif text-2xl font-bold text-[#2E2019] tabular-nums mt-1">108.5%</h4>
              <span className="text-[10px] text-[#7A675A]">Meta: &gt; 100% CDI</span>
            </div>
          </div>

          {/* Padrão 4: Área de Evolução dos Investimentos ao Longo do Tempo */}
          {netWorthEvolution.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                  Evolução do Patrimônio Investido
                </h4>
                <p className="text-[12px] text-[#7A675A]">Curva de valorização acumulada nos últimos 6 meses</p>
              </div>
              <div className="w-full h-[170px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netWorthEvolution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientInvestRent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#653259" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#653259" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A675A" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#7A675A" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `R$${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                        "Patrimônio",
                      ]}
                      contentStyle={{
                        backgroundColor: "#FFFDF8",
                        border: "1px solid #E7DBC6",
                        borderRadius: "16px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#653259"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#gradientInvestRent)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 mt-2">
            {[
              { id: "r1", title: "Renda Fixa & Pós-Fixados", cat: "Tesouro / CDB", meta: "Retorno anual: +11.2% (104% CDI)" },
              { id: "r2", title: "Fundos Imobiliários (FIIs)", cat: "Proventos", meta: "Dividend Yield médio: 9.8% a.a. isento" },
              { id: "r3", title: "Ações de Valor", cat: "B3", meta: "Retorno total: +14.6% a.a." },
            ].map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.cat}
                meta={item.meta}
                badge={<span className="text-xs font-bold text-[#7D8C6F]">✓ Superando</span>}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. INVESTIR: ALOCAÇÃO POR CLASSE DE ATIVO COM DONUT RECHARTS */}
      {/* ======================================================== */}
      {subModule === "investir_alocacao" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Alocação por Classe
            </h3>
            <p className="text-[13px] text-[#7A675A]">Distribuição estratégica entre as grandes classes de patrimônio.</p>
          </div>

          {/* Padrão 3: Gráfico Donut de Alocação com Total Investido no Centro */}
          {allocationData.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                  Distribuição da Carteira
                </h4>
                <p className="text-[12px] text-[#7A675A]">Alocação percentual por categoria de investimento</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-[160px] h-[160px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData.slice(0, 6)}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {allocationData.slice(0, 6).map((_, index) => (
                          <Cell key={`cell-alloc-${index}`} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [
                          Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                          "Total",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total investido no centro do Donut (Padrão 3) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#7A675A] font-semibold">
                      Total Investido
                    </span>
                    <span className="font-serif text-[14px] font-bold text-[#2E2019] tabular-nums leading-tight">
                      {formatMoney(totalInvested)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {allocationData.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs bg-[#FAF4E8] border border-[#E7DBC6] rounded-full px-3 py-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                      />
                      <span className="font-semibold text-[#2E2019]">{item.name}</span>
                      <span className="text-[#7A675A] font-mono tabular-nums">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Padrão 1: Real × Meta de Alocação por Classe de Ativo */}
          {allocationData.length > 0 && (
            <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-[0_1px_0_#E7DBC6] flex flex-col gap-3">
              <div>
                <h4 className="font-serif text-[16px] font-medium text-[#2E2019]">
                  Real × Meta de Alocação
                </h4>
                <p className="text-[12px] text-[#7A675A]">Alocação atual realizada vs alvo estratégico</p>
              </div>
              <div className="flex flex-col space-y-2">
                {allocationData.map((item) => {
                  const targetPct = item.name.includes("Renda Fixa")
                    ? 40
                    : item.name.includes("Imobili")
                    ? 25
                    : item.name.includes("Ações")
                    ? 20
                    : 15;
                  return (
                    <LomaRealMeta
                      key={item.name}
                      label={item.name}
                      real={item.percentage}
                      meta={targetPct}
                      unit="%"
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 mt-2">
            {allocationData.map((item) => (
              <LomaCard
                key={item.name}
                id={item.name}
                title={item.name}
                category="Classe de Ativo"
                meta={`Volume alocado: ${formatMoney(item.value)}`}
                badge={
                  <span className="text-xs font-bold text-[#2E2019] bg-[#F3E9D7] px-2.5 py-1 rounded-full tabular-nums">
                    {item.percentage}%
                  </span>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 13. INVESTIR: LIQUIDEZ & PRAZOS */}
      {/* ======================================================== */}
      {subModule === "investir_liquidez" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Liquidez & Prazos
            </h3>
            <p className="text-[13px] text-[#7A675A]">Disponibilidade do capital dividida por janelas temporais de resgate.</p>
          </div>

          <div className="flex flex-col space-y-2">
            <LomaCard
              id="liq_d0"
              title="Liquidez Imediata (D+0 / D+1)"
              category="Reserva"
              meta="Disponível para emergências e gastos imprevistos"
              badge={<span className="text-sm font-bold text-[#7D8C6F]">{formatMoney(totalBalance)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Saldos em contas correntes, contas digitais e Tesouro Selic.</p>
            </LomaCard>

            <LomaCard
              id="liq_d30"
              title="Curto Prazo (D+2 a D+30)"
              category="Oportunidade"
              meta="Fundos de renda fixa e ações com liquidação padrão"
              badge={<span className="text-sm font-bold text-[#C79A3B]">{formatMoney(1500000)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Ativos com prazo curto para rebalanceamento ou compras programadas.</p>
            </LomaCard>

            <LomaCard
              id="liq_longo"
              title="Longo Prazo (&gt; 1 Ano)"
              category="Liberdade"
              meta="FIIs, Previdência e títulos com vencimento em prazo estendido"
              badge={<span className="text-sm font-bold text-[#653259]">{formatMoney(totalInvested - 1500000)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Foco em renda passiva, valorização patrimonial e sucessão familiar.</p>
            </LomaCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 14. INVESTIR: PREVIDÊNCIA PRIVADA */}
      {/* ======================================================== */}
      {subModule === "investir_previdencia" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Previdência Privada
            </h3>
            <p className="text-[13px] text-[#7A675A]">Planejamento fiscal de longo prazo, PGBL/VGBL e sucessão sem inventário.</p>
          </div>

          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-2">
            <span className="text-xs text-[#7A675A]">Benefício Fiscal Máximo (PGBL)</span>
            <h4 className="font-serif text-2xl font-bold text-[#7D8C6F] tabular-nums">
              Até 12% da Renda Bruta
            </h4>
            <span className="text-xs text-[#7A675A]">Dedução legal na declaração completa do IRPF</span>
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <LomaCard
              id="prev1"
              title="PGBL Previdência Familiar"
              category="Regime Regressivo"
              meta="Alíquota mínima de 10% após 10 anos • Sem come-cotas"
              badge={<span className="text-sm font-bold text-[#2E2019]">{formatMoney(1200000)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Indicado para dedução de IRPF no modelo completo de tributação.</p>
            </LomaCard>
            <LomaCard
              id="prev2"
              title="VGBL Sucessão Direta"
              category="Livre de Inventário"
              meta="Transferência direta para os beneficiários designados"
              badge={<span className="text-sm font-bold text-[#2E2019]">{formatMoney(800000)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Tributação apenas sobre os rendimentos gerados na apólice.</p>
            </LomaCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 15. INVESTIR: APOSENTADORIA PLANEJADA */}
      {/* ======================================================== */}
      {subModule === "investir_aposentadoria" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Aposentadoria Planejada
            </h3>
            <p className="text-[13px] text-[#7A675A]">Renda passiva almejada para a fase de desaceleração profissional.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Idade Alvo Desaceleração</span>
              <h4 className="font-serif text-2xl font-bold text-[#653259] tabular-nums mt-1">55 anos</h4>
              <span className="text-[10px] text-[#7A675A]">Transição suave</span>
            </div>
            <div className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
              <span className="text-[11px] text-[#7A675A]">Renda Mensal Desejada</span>
              <h4 className="font-serif text-2xl font-bold text-[#7D8C6F] tabular-nums mt-1">{formatMoney(1500000)}</h4>
              <span className="text-[10px] text-[#7A675A]">Corrigida pela inflação</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            <LomaCard
              id="apos_proj"
              title="Patrimônio Necessário para a Renda Alvo"
              category="Cálculo Atuarial"
              meta="Considerando taxa de retirada segura de 4% a.a."
              badge={<span className="text-sm font-bold text-[#2E2019]">{formatMoney(450000000)}</span>}
            >
              <p className="text-xs text-[#7A675A]">Garante sustentabilidade perpétua sem consumir o principal investido.</p>
            </LomaCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 16. INVESTIR: PROJEÇÃO ATÉ 100 ANOS */}
      {/* ======================================================== */}
      {subModule === "investir_projecao100" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Projeção até 100 Anos
            </h3>
            <p className="text-[13px] text-[#7A675A]">Modelo atuarial completo simulando acumulação, usufruto e legado.</p>
          </div>

          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-2">
            <h4 className="font-serif text-[16px] font-semibold text-[#2E2019]">Premissas Atuariais</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#7A675A] pt-2 border-t border-[#E7DBC6]">
              <div>Retorno Real Acima Inflação: <strong className="text-[#2E2019]">4.5% a.a.</strong></div>
              <div>Taxa Segura de Retirada (SWR): <strong className="text-[#2E2019]">3.8% a.a.</strong></div>
              <div>Horizonte Temporal: <strong className="text-[#2E2019]">Até os 100 anos</strong></div>
              <div>Patrimônio Residual: <strong className="text-[#7D8C6F]">Legado positivo</strong></div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-2">
            {[
              { id: "p1", title: "Fase 1: Acumulação Acelerada (Atual)", meta: "Aportes consistentes com reinvestimento de 100% dos proventos" },
              { id: "p2", title: "Fase 2: Transição e Independência (50-65 anos)", meta: "Cobertura total dos custos fixos através de dividendos e juros" },
              { id: "p3", title: "Fase 3: Usufruto & Longevidade (65-100 anos)", meta: "Preservação patrimonial com blindagem contra inflação e custos médicos" },
            ].map((fase) => (
              <LomaCard
                key={fase.id}
                id={fase.id}
                title={fase.title}
                category="Fase de Vida"
                meta={fase.meta}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 17. INVESTIR: LIBERDADE FINANCEIRA */}
      {/* ======================================================== */}
      {subModule === "investir_liberdade" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Liberdade Financeira
            </h3>
            <p className="text-[13px] text-[#7A675A]">Progresso rumo à independência pelo método dos 4%.</p>
          </div>

          <div className="rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#7A675A]">Grau de Liberdade Financeira</span>
              <span className="text-lg font-bold text-[#E8836B] tabular-nums">
                {financialDiagnostics?.freedomProgressPercent ?? 28}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
              <div
                className="h-full rounded-full bg-[#E8836B]"
                style={{ width: `${financialDiagnostics?.freedomProgressPercent ?? 28}%` }}
              />
            </div>
            <p className="text-xs text-[#7A675A]">
              Sua renda passiva mensal estimada ({formatMoney(financialDiagnostics?.monthlyPassiveIncome ?? 38000)}) já cobre {financialDiagnostics?.freedomProgressPercent ?? 28}% do custo de vida básico familiar.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 18. INVESTIR: MERCADO & COTAÇÕES */}
      {/* ======================================================== */}
      {subModule === "investir_mercado" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubModule("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Índice
          </button>

          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
              Investir: Mercado & Cotações
            </h3>
            <p className="text-[13px] text-[#7A675A]">Taxas oficiais de juros, inflação e moedas de referência.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {marketIndicators.map((ind) => (
              <div key={ind.symbol} className="rounded-[20px] bg-[#FFFDF8] border border-[#E7DBC6] p-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#7A675A]">{ind.symbol}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      ind.isPositive ? "text-[#7D8C6F]" : "text-[#B3402E]"
                    }`}
                  >
                    {ind.variation}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2E2019] tabular-nums mt-1">
                  {ind.value}
                </h4>
                <span className="text-[10px] text-[#7A675A] truncate block">{ind.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
