import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type FinanceData = ApiResponse<typeof api, "getFinanceOverview">;

interface FinancasProps {
  data?: FinanceData;
  isLoading: boolean;
  onOpenAddModal: (type: "transacao" | "meta") => void;
}

export function FinancasView({ data, isLoading, onOpenAddModal }: FinancasProps) {
  const [subModule, setSubModule] = useState<
    "resumo" | "orcamento" | "contas" | "cartoes" | "metas" | "investir" | "protecao" | "consultor"
  >("resumo");

  const queryClient = useQueryClient();

  const deleteTransaction = useMutation({
    mutationFn: (id: number) => api.deleteFinanceTransaction({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeOverview"] });
      queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando finanças...</span>
      </div>
    );
  }

  const {
    netWorth,
    totalBalance,
    totalInvested,
    totalDebt,
    monthIncome,
    monthExpenses,
    accounts,
    cards,
    transactions,
    goals,
    investments,
    diagnosis,
  } = data;

  const formatMoney = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Sub-navegação dos 8 módulos canônicos de Finanças */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs max-w-full min-w-0">
        {[
          { key: "resumo", label: "Resumo" },
          { key: "orcamento", label: "Orçamento" },
          { key: "contas", label: "Contas" },
          { key: "cartoes", label: "Cartões" },
          { key: "metas", label: "Metas" },
          { key: "investir", label: "Investir" },
          { key: "protecao", label: "Proteção" },
          { key: "consultor", label: "Consultor" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSubModule(item.key as any)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 font-medium transition ${
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
      {/* 1. RESUMO GERAL */}
      {/* ======================================================== */}
      {subModule === "resumo" && (
        <div className="flex flex-col gap-5">
          {/* Hero Card Espresso */}
          <div className="relative overflow-hidden rounded-3xl bg-[#231B16] p-6 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.3) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-wider text-[#C47882] uppercase">
                Patrimônio Líquido Consolidado
              </span>
              <h2 className="font-serif-loma text-3xl font-normal text-[#FAF7F2] tabular-nums">
                {formatMoney(netWorth)}
              </h2>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-white/10 pt-3 text-center">
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Saldos</span>
                  <span className="text-xs sm:text-sm font-bold text-[#E9F3F0] tabular-nums truncate w-full">{formatMoney(totalBalance).replace(",00", "")}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Investido</span>
                  <span className="text-xs sm:text-sm font-bold text-[#FAF7F2] tabular-nums truncate w-full">{formatMoney(totalInvested).replace(",00", "")}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2 min-w-0 flex flex-col items-center">
                  <span className="block text-[10px] text-[#FAF7F2]/60 truncate w-full">Dívida</span>
                  <span className="text-xs sm:text-sm font-bold text-[#F8ECEE] tabular-nums truncate w-full">{formatMoney(totalDebt).replace(",00", "")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fluxo do Mês Corrente */}
          <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-2 min-w-0">
              <h3 className="font-serif-loma text-lg text-[#231B16] truncate min-w-0 flex-1">Fluxo do Mês</h3>
              <span className="shrink-0 rounded-full bg-[#E9F3F0] px-2.5 py-0.5 text-xs font-bold text-[#3B7A6B] tabular-nums whitespace-nowrap">
                Taxa de Poupança: {diagnosis.savingsRate}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-3">
                <span className="text-xs text-[#6E6259]">Entradas (Receitas)</span>
                <p className="mt-1 text-lg font-bold text-[#3B7A6B] tabular-nums">{formatMoney(monthIncome)}</p>
              </div>
              <div className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-3">
                <span className="text-xs text-[#6E6259]">Saídas (Despesas)</span>
                <p className="mt-1 text-lg font-bold text-[#B36670] tabular-nums">{formatMoney(monthExpenses)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#F8ECEE] p-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C47882]" />
                <span className="text-xs font-bold text-[#231B16]">Diagnóstico do Consultor:</span>
              </div>
              <p className="mt-1 text-xs text-[#6E6259] leading-relaxed">{diagnosis.insight}</p>
            </div>
          </section>

          {/* Acesso rápido às Metas Principais */}
          <section className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
              <h3 className="font-serif-loma text-lg text-[#231B16] truncate min-w-0 flex-1">Progresso das Metas</h3>
              <button
                onClick={() => onOpenAddModal("meta")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Nova Meta
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#231B16]">{g.title}</span>
                      <span className="text-[#C47882] tabular-nums">{pct}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div className="h-full rounded-full bg-[#C47882] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-[#6E6259] tabular-nums">
                      <span>Atual: {formatMoney(g.currentAmount)}</span>
                      <span>Alvo: {formatMoney(g.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ORÇAMENTO & TRANSAÇÕES */}
      {/* ======================================================== */}
      {subModule === "orcamento" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate">Orçamento & Lançamentos</h2>
              <p className="text-xs text-[#6E6259] truncate">Receitas e despesas organizadas por categoria.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("transacao")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
            >
              + Lançamento
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[#EAE2D6] rounded-3xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#9B8F85]">Nenhum lançamento registrado.</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                        t.type === "receita" ? "bg-[#E9F3F0] text-[#3B7A6B]" : "bg-[#F8ECEE] text-[#B36670]"
                      }`}
                    >
                      {t.type === "receita" ? "↓" : "↑"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#231B16]">{t.description}</span>
                        <span className="rounded-full bg-[#FAF7F2] px-2 py-0.2 text-[10px] font-semibold text-[#6E6259] border border-[#EAE2D6]">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#9B8F85] tabular-nums">
                        {t.date} • {t.status === "pago" ? "Pago" : "Pendente"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        t.type === "receita" ? "text-[#3B7A6B]" : "text-[#231B16]"
                      }`}
                    >
                      {t.type === "receita" ? "+" : "-"} {formatMoney(Math.abs(t.amount))}
                    </span>
                    <button
                      onClick={() => deleteTransaction.mutate(t.id)}
                      className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#B36670]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CONTAS */}
      {/* ======================================================== */}
      {subModule === "contas" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif-loma text-xl text-[#231B16]">Contas Bancárias & Dinheiro</h2>
            <p className="text-xs text-[#6E6259]">Saldos e liquidez disponível para o dia a dia.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs"
              >
                <div>
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#6E6259] uppercase">
                    {acc.type}
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-[#231B16]">{acc.name}</h4>
                  <p className="text-xs text-[#9B8F85]">{acc.institution}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6E6259]">Saldo</span>
                  <p className="text-base font-bold text-[#231B16] tabular-nums">{formatMoney(acc.balance)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CARTÕES */}
      {/* ======================================================== */}
      {subModule === "cartoes" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif-loma text-xl text-[#231B16]">Cartões de Crédito</h2>
            <p className="text-xs text-[#6E6259]">Faturas abertas, vencimentos e limites utilizados.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cards.map((c) => {
              const usedPct = Math.min(100, Math.round((c.limitUsed / c.limitTotal) * 100));
              return (
                <div key={c.id} className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#9B8F85]">{c.brand}</span>
                      <h4 className="text-sm font-bold text-[#231B16]">{c.name}</h4>
                    </div>
                    <span className="rounded-full bg-[#F8ECEE] px-2.5 py-0.5 text-xs font-bold text-[#B36670] tabular-nums">
                      Vence dia {c.dueDay}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6E6259]">Fatura Atual</span>
                      <span className="font-bold text-[#231B16] tabular-nums">{formatMoney(c.limitUsed)}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div className="h-full rounded-full bg-[#B36670]" style={{ width: `${usedPct}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[11px] text-[#9B8F85] tabular-nums">
                      <span>Limite: {formatMoney(c.limitTotal)}</span>
                      <span>Disponível: {formatMoney(c.limitTotal - c.limitUsed)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. METAS */}
      {/* ======================================================== */}
      {subModule === "metas" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-xl text-[#231B16] truncate">Metas Familiares</h2>
              <p className="text-xs text-[#6E6259] truncate">Construção da reserva e objetivos de médio e longo prazo.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("meta")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#B36670] whitespace-nowrap"
            >
              + Nova Meta
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#6E6259]">
                      {g.category}
                    </span>
                    <span className="font-bold text-[#C47882] tabular-nums text-xs">{pct}% concluído</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-[#231B16]">{g.title}</h4>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                    <div className="h-full rounded-full bg-[#C47882]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-[#6E6259] tabular-nums">
                    <span>Acumulado: {formatMoney(g.currentAmount)}</span>
                    <span>Objetivo: {formatMoney(g.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. INVESTIR (FUNDAÇÃO) */}
      {/* ======================================================== */}
      {subModule === "investir" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif-loma text-xl text-[#231B16]">Carteira & Alocação de Ativos</h2>
            <p className="text-xs text-[#6E6259]">Visão consolidada por classes para liberdade financeira.</p>
          </div>

          <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-[#9B8F85]">Total Investido</span>
            <p className="font-serif-loma text-2xl font-normal text-[#231B16] tabular-nums">
              {formatMoney(totalInvested)}
            </p>

            <div className="mt-4 flex flex-col divide-y divide-[#EAE2D6]">
              {investments.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-sm font-semibold text-[#231B16]">{inv.name}</span>
                    <p className="text-xs text-[#9B8F85]">{inv.institution || "Custodiante"}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-[#EDF1F5] px-2 py-0.5 text-[10px] font-semibold text-[#465768]">
                      {inv.category}
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-[#231B16] tabular-nums">{formatMoney(inv.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PROTEÇÃO */}
      {/* ======================================================== */}
      {subModule === "protecao" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif-loma text-xl text-[#231B16]">Proteção & Riscos Familiares</h2>
            <p className="text-xs text-[#6E6259]">Colchão de segurança e apólices essenciais.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-[#3B7A6B]">Reserva de Emergência</span>
              <h4 className="mt-1 text-sm font-bold text-[#231B16]">Liquidez Imediata</h4>
              <p className="mt-1 text-xs text-[#6E6259]">
                R$ 15.800 guardados no Itaú e R$ 4.250 em conta corrente. Cobre cerca de 6 a 8 meses de despesas básicas.
              </p>
              <div className="mt-3 inline-block rounded-full bg-[#E9F3F0] px-2.5 py-0.5 text-[11px] font-semibold text-[#3B7A6B]">
                ✓ Nível Seguro
              </div>
            </div>

            <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-[#465768]">Seguros Ativos</span>
              <h4 className="mt-1 text-sm font-bold text-[#231B16]">Plano de Saúde & Residencial</h4>
              <p className="mt-1 text-xs text-[#6E6259]">
                Cobertura hospitalar familiar ativa e seguro residencial com assistência 24h contratada.
              </p>
              <div className="mt-3 inline-block rounded-full bg-[#EDF1F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#465768]">
                ✓ Em vigência
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. CONSULTOR FINANCEIRO */}
      {/* ======================================================== */}
      {subModule === "consultor" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif-loma text-xl text-[#231B16]">Consultor Financeiro Loma</h2>
            <p className="text-xs text-[#6E6259]">Diagnósticos explicados com dados reais do seu orçamento.</p>
          </div>

          <div className="rounded-3xl border border-[#EAE2D6] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3B7A6B]" />
              <h3 className="font-serif-loma text-lg text-[#231B16]">Relatório Mensal de Saúde Financeira</h3>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs text-[#6E6259] leading-relaxed">
              <p>
                <strong>1. Balanço das Contas:</strong> Suas entradas neste mês somam {formatMoney(monthIncome)}, com saídas registradas de {formatMoney(monthExpenses)}. O saldo operacional líquido é positivo em {formatMoney(monthIncome - monthExpenses)}.
              </p>
              <p>
                <strong>2. Taxa de Poupança:</strong> Você está poupando aproximadamente {diagnosis.savingsRate}% da sua renda bruta. O patamar recomendado para aceleração patrimonial é de no mínimo 20%.
              </p>
              <p>
                <strong>3. Recomendação Estruturada:</strong> Mantenha a alocação de aportes automáticos para a meta da Reserva de Emergência antes do vencimento das faturas do dia 25.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
