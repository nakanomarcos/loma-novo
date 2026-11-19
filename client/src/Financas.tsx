import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type FinanceData = ApiResponse<typeof api, "getFinanceOverview">;

interface FinancasProps {
  data?: FinanceData;
  isLoading: boolean;
  onOpenAddModal: (type: "transacao" | "meta") => void;
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
}: {
  id: number;
  title: string;
  meta?: string | null;
  category?: string | null;
  isCompleted?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-card-id={id}
      className={`rounded-[24px] bg-[#FFFDF8] border border-[#E7DBC6] shadow-[0_1px_0_#E7DBC6] transition-all overflow-hidden ${
        isCompleted ? "opacity-60 bg-[#FAF4E8]" : ""
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
          <span className={`text-[#7A675A] text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
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

export function FinancasView({ data, isLoading, onOpenAddModal }: FinancasProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as any) || "resumo";
  const [subModule, setSubModule] = useState<"resumo" | "orcamento" | "contas" | "cartoes" | "metas" | "investir">(initialSub);
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["financeOverview"] });
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
  };

  const deleteTransaction = useMutation({
    mutationFn: (id: number) => api.deleteFinanceTransaction({ id }),
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

  const { accounts, cards, transactions, goals, investments, totalBalance, totalInvested, netWorth } = data;

  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Sub-navegação dos 8 módulos de Finanças */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs max-w-full min-w-0">
        {[
          { key: "resumo", label: "Visão Geral" },
          { key: "orcamento", label: "Orçamento" },
          { key: "contas", label: "Contas" },
          { key: "cartoes", label: "Cartões" },
          { key: "metas", label: "Metas" },
          { key: "investir", label: "Investir" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSubModule(item.key as any)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 font-medium transition ${
              subModule === item.key
                ? "bg-[#2E2019] text-[#FAF4E8] shadow-xs"
                : "bg-[#F3E9D7] text-[#7A675A] hover:bg-[#E7DBC6]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 1. VISÃO GERAL (RESUMO FINANCEIRO) */}
      {/* ======================================================== */}
      {subModule === "resumo" && (
        <div className="flex flex-col gap-4">
          {/* Card Patrimonial Herói (p-4, rounded-24px) */}
          <div
            className="relative overflow-hidden rounded-[24px] p-4 text-[#FFF7EA] shadow-md"
            style={{
              background: "radial-gradient(circle at top right, rgba(168, 93, 122, 0.20) 0%, transparent 60%), linear-gradient(135deg, #7E354F 0%, #653259 55%, #4C2B57 100%)",
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

          {/* Últimos Lançamentos */}
          <div className="flex flex-col gap-2">
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
      {/* 2. ORÇAMENTO & TRANSAÇÕES COMPLETO */}
      {/* ======================================================== */}
      {subModule === "orcamento" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Orçamento & Lançamentos</h3>
              <p className="text-[13px] text-[#7A675A]">Receitas e despesas organizadas por categoria.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("transacao")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Lançamento
            </button>
          </div>

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
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Cartões de Crédito</h3>
            <p className="text-[13px] text-[#7A675A]">Faturas abertas, vencimentos e limites utilizados.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {cards.map((c) => {
              const usedPct = Math.min(100, Math.round((c.limitUsed / c.limitTotal) * 100));
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
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7A675A]">Limite Utilizado ({usedPct}%)</span>
                      <span className="font-bold text-[#2E2019] tabular-nums">{formatMoney(c.limitUsed)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                      <div className="h-full rounded-full bg-[#CF6248]" style={{ width: `${usedPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#7A675A] tabular-nums">
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
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                      <div className="h-full rounded-full bg-[#E8836B]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-[#7A675A] tabular-nums">
                      <span>Acumulado: {formatMoney(g.currentAmount)}</span>
                      <span>Objetivo: {formatMoney(g.targetAmount)}</span>
                    </div>
                  </div>
                </LomaCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. INVESTIR (FUNDAÇÃO) */}
      {/* ======================================================== */}
      {subModule === "investir" && (
        <div className="flex flex-col gap-3">
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Carteira & Alocação de Ativos</h3>
            <p className="text-[13px] text-[#7A675A]">Visão consolidada por classes para liberdade financeira.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {investments.map((inv) => (
              <LomaCard
                key={inv.id}
                id={inv.id}
                title={inv.name}
                category={inv.institution || "Custódia"}
                meta={`Classe de Ativo: ${inv.category}`}
                badge={
                  <span className="text-sm font-bold text-[#2E2019] tabular-nums">
                    {formatMoney(inv.amount)}
                  </span>
                }
              >
                <p className="text-xs text-[#7A675A]">
                  Classe: {inv.category} • Instituição: {inv.institution || "Custódia Direta"}.
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
