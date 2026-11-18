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
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
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
                ? "bg-[#231B16] text-[#FAF7F2] shadow-xs"
                : "bg-[#F2ECE3] text-[#6E6259] hover:bg-[#EAE2D6]"
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
          <div className="relative overflow-hidden rounded-[24px] bg-[#231B16] p-4 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.3) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-[#C47882] uppercase">Patrimônio Líquido Familiar</span>
              <h2 className="font-serif text-3xl font-normal text-[#FAF7F2] tabular-nums">
                {formatMoney(netWorth)}
              </h2>

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2.5">
                <div>
                  <span className="block text-[11px] text-[#FAF7F2]/60">Disponível em Contas</span>
                  <span className="text-sm font-semibold text-[#E9F3F0] tabular-nums">{formatMoney(totalBalance)}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#FAF7F2]/60">Total Investido</span>
                  <span className="text-sm font-semibold text-[#FAF7F2] tabular-nums">{formatMoney(totalInvested)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Últimos Lançamentos */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Últimos Lançamentos</h3>
              <button
                onClick={() => onOpenAddModal("transacao")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Lançamento
              </button>
            </div>

            {transactions.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhuma transação recente.</p>
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
                          t.type === "receita" ? "text-[#3B7A6B]" : "text-[#2C241E]"
                        }`}
                      >
                        {t.type === "receita" ? "+" : "-"} {formatMoney(Math.abs(t.amount))}
                      </span>
                    }
                    onDelete={() => deleteTransaction.mutate(t.id)}
                  >
                    <p className="text-xs text-[#6E6259]">
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
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Orçamento & Lançamentos</h3>
              <p className="text-[13px] text-[#7C6E62]">Receitas e despesas organizadas por categoria.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("transacao")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Lançamento
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#9B8F85]">Nenhum lançamento registrado.</p>
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
                        t.type === "receita" ? "text-[#3B7A6B]" : "text-[#2C241E]"
                      }`}
                    >
                      {t.type === "receita" ? "+" : "-"} {formatMoney(Math.abs(t.amount))}
                    </span>
                  }
                  onDelete={() => deleteTransaction.mutate(t.id)}
                >
                  <p className="text-xs text-[#6E6259]">
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
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Contas Bancárias & Dinheiro</h3>
            <p className="text-[13px] text-[#7C6E62]">Saldos e liquidez disponível para o dia a dia.</p>
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
                  <span className="text-base font-bold text-[#2C241E] tabular-nums">
                    {formatMoney(acc.balance)}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
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
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Cartões de Crédito</h3>
            <p className="text-[13px] text-[#7C6E62]">Faturas abertas, vencimentos e limites utilizados.</p>
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
                    <span className="rounded-full bg-[#F8ECEE] px-2.5 py-1 text-xs font-bold text-[#B36670] tabular-nums">
                      Vence dia {c.dueDay}
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6E6259]">Limite Utilizado ({usedPct}%)</span>
                      <span className="font-bold text-[#2C241E] tabular-nums">{formatMoney(c.limitUsed)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div className="h-full rounded-full bg-[#B36670]" style={{ width: `${usedPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#9B8F85] tabular-nums">
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
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Metas Familiares</h3>
              <p className="text-[13px] text-[#7C6E62]">Construção da reserva e objetivos de médio e longo prazo.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("meta")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
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
                    <span className="font-bold text-[#C47882] tabular-nums text-xs">
                      {pct}%
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div className="h-full rounded-full bg-[#C47882]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-[#6E6259] tabular-nums">
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
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Carteira & Alocação de Ativos</h3>
            <p className="text-[13px] text-[#7C6E62]">Visão consolidada por classes para liberdade financeira.</p>
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
                  <span className="text-sm font-bold text-[#2C241E] tabular-nums">
                    {formatMoney(inv.amount)}
                  </span>
                }
              >
                <p className="text-xs text-[#6E6259]">
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
