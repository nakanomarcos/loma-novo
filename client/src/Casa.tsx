import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type CasaData = ApiResponse<typeof api, "getCasaOverview">;

interface CasaProps {
  data?: CasaData;
  isLoading: boolean;
  onOpenAddModal: (type: "item_mercado" | "manutencao_casa" | "rotina_filho" | "desejo_compra" | "cuidado_pet" | "contato_emergencia") => void;
}

export function CasaView({ data, isLoading, onOpenAddModal }: CasaProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as any) || "resumo";
  const [subTab, setSubTab] = useState<
    "resumo" | "manutencoes" | "filhos" | "mercado" | "compras" | "pets" | "veiculos" | "patrimonio" | "seguranca" | "relacionamentos"
  >(initialSub);

  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["casaOverview"] });
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const toggleMaint = useMutation({
    mutationFn: (id: number) => api.toggleHomeMaintenance({ id }),
    onSuccess: refresh,
  });

  const deleteMaint = useMutation({
    mutationFn: (id: number) => api.deleteHomeMaintenance({ id }),
    onSuccess: refresh,
  });

  const toggleChild = useMutation({
    mutationFn: (id: number) => api.toggleChildRoutine({ id }),
    onSuccess: refresh,
  });

  const deleteChild = useMutation({
    mutationFn: (id: number) => api.deleteChildRoutine({ id }),
    onSuccess: refresh,
  });

  const toggleGrocery = useMutation({
    mutationFn: (id: number) => api.toggleGroceryItem({ id }),
    onSuccess: refresh,
  });

  const deleteGrocery = useMutation({
    mutationFn: (id: number) => api.deleteGroceryItem({ id }),
    onSuccess: refresh,
  });

  const updateWishlist = useMutation({
    mutationFn: (args: { id: number; status: "desejo" | "planejado" | "comprado" }) => api.updateWishlistStatus(args),
    onSuccess: refresh,
  });

  const deleteWishlist = useMutation({
    mutationFn: (id: number) => api.deleteWishlistItem({ id }),
    onSuccess: refresh,
  });

  const togglePetCare = useMutation({
    mutationFn: (id: number) => api.togglePetCareRecord({ id }),
    onSuccess: refresh,
  });

  const deletePetCare = useMutation({
    mutationFn: (id: number) => api.deletePetCareRecord({ id }),
    onSuccess: refresh,
  });

  const deleteVehicleMaint = useMutation({
    mutationFn: (id: number) => api.deleteVehicleMaintenance({ id }),
    onSuccess: refresh,
  });

  const deleteProperty = useMutation({
    mutationFn: (id: number) => api.deletePropertyAsset({ id }),
    onSuccess: refresh,
  });

  const deleteEmergency = useMutation({
    mutationFn: (id: number) => api.deleteEmergencyContact({ id }),
    onSuccess: refresh,
  });

  const deleteRel = useMutation({
    mutationFn: (id: number) => api.deleteRelationship({ id }),
    onSuccess: refresh,
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando casa & família...</span>
      </div>
    );
  }

  const {
    summary,
    maintenances,
    childrenRoutines,
    relationships,
    groceries,
    wishlist,
    pets,
    vehicles,
    propertyAssets,
    emergencyContacts,
  } = data;

  const formatMoney = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Sub-navegação dos módulos de Casa & Família */}
      <div className="w-full max-w-full min-w-0 flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "resumo", label: "Visão Geral" },
          { key: "mercado", label: "Mercado & Despensa" },
          { key: "manutencoes", label: "Manutenções" },
          { key: "filhos", label: "Filhos & Escola" },
          { key: "compras", label: "Desejos & Compras" },
          { key: "pets", label: "Pets" },
          { key: "veiculos", label: "Veículos" },
          { key: "patrimonio", label: "Patrimônio" },
          { key: "seguranca", label: "Segurança" },
          { key: "relacionamentos", label: "Família & Rede" },
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
      {/* 1. VISÃO GERAL (RESUMO CASA & FAMÍLIA) */}
      {/* ======================================================== */}
      {subTab === "resumo" && (
        <div className="flex flex-col gap-5">
          {/* Hero Card Espresso */}
          <div className="relative overflow-hidden rounded-3xl bg-[#231B16] p-6 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.35) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-wider text-[#C47882] uppercase">
                Gestão Doméstica & Familiar
              </span>
              <h2 className="font-serif-loma text-2xl text-[#FAF7F2] leading-tight">
                O lar em harmonia, com cuidado e zelo<span className="text-[#C47882]">.</span>
              </h2>
              <p className="text-xs text-[#FAF7F2]/70">
                Manutenções em dia, rotinas dos filhos acompanhadas e compras organizadas para a família.
              </p>

              {/* Indicadores Chave */}
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2 text-center">
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Mercado</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.groceriesToBuyCount}
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Manutenções</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.pendingMaintenancesCount}
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Bens</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {formatMoney(summary.totalPropertyAssetsValue).replace(",00", "")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque 1: Itens de Mercado Pendentes */}
          <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#9E6123] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Lista de Mercado Rápida</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("item_mercado")}
                className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Item
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#F2ECE3]">
              {groceries.filter((g) => !g.isPurchased).slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleGrocery.mutate(item.id)}
                      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-[#D5CCC2] text-xs transition hover:border-[#9E6123]"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#231B16]">{item.name}</span>
                      <span className="text-[11px] text-[#9B8F85]">
                        {item.quantity} {item.unit} • {item.category}
                      </span>
                    </div>
                  </div>
                  {item.isEssential && (
                    <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#9E6123]">
                      Essencial
                    </span>
                  )}
                </div>
              ))}
              {groceries.filter((g) => !g.isPurchased).length === 0 && (
                <p className="py-3 text-center text-xs text-[#9B8F85]">Todos os itens já foram comprados!</p>
              )}
            </div>
          </div>

          {/* Destaque 2: Manutenções Domésticas Pendentes */}
          <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#C47882] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Manutenções da Casa</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("manutencao_casa")}
                className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Manutenção
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#F2ECE3]">
              {maintenances.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMaint.mutate(item.id)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border text-xs transition ${
                        item.status === "concluido"
                          ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                          : "border-[#D5CCC2] hover:border-[#C47882]"
                      }`}
                    >
                      {item.status === "concluido" && "✓"}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${item.status === "concluido" ? "line-through text-[#9B8F85]" : "text-[#231B16]"}`}>
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#9B8F85]">
                        {item.room} {item.dueDate && `• Prazo: ${item.dueDate}`}
                      </span>
                    </div>
                  </div>
                  {item.costCents > 0 && (
                    <span className="text-xs font-semibold text-[#231B16] tabular-nums">
                      {formatMoney(item.costCents)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Destaque 3: Rotina dos Filhos */}
          <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-[#465768] shrink-0" />
                <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Acompanhamento dos Filhos</h3>
              </div>
              <button
                onClick={() => onOpenAddModal("rotina_filho")}
                className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
              >
                + Registro
              </button>
            </div>
            <div className="flex flex-col divide-y divide-[#F2ECE3]">
              {childrenRoutines.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleChild.mutate(item.id)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border text-xs transition ${
                        item.status === "concluido"
                          ? "border-[#465768] bg-[#465768] text-white"
                          : "border-[#D5CCC2] hover:border-[#465768]"
                      }`}
                    >
                      {item.status === "concluido" && "✓"}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${item.status === "concluido" ? "line-through text-[#9B8F85]" : "text-[#231B16]"}`}>
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#9B8F85]">
                        {item.childName} • {item.category.toUpperCase()} • {item.date}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] text-[#465768] font-medium">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MERCADO & DESPENSA */}
      {/* ======================================================== */}
      {subTab === "mercado" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Lista de Mercado</h2>
              <p className="text-xs text-[#6E6259] truncate">Itens para reposição na despensa e compras da semana.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("item_mercado")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Item
            </button>
          </div>

          {/* Categorias de Mercado */}
          <div className="grid grid-cols-1 gap-3">
            {groceries.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                  item.isPurchased
                    ? "border-[#EAE2D6] bg-[#F7F3EE]/60 text-[#9B8F85]"
                    : "border-[#EAE2D6] bg-white shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => toggleGrocery.mutate(item.id)}
                    className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border text-xs font-bold transition ${
                      item.isPurchased
                        ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                        : "border-[#D5CCC2] hover:border-[#9E6123]"
                    }`}
                  >
                    {item.isPurchased ? "✓" : ""}
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${item.isPurchased ? "line-through" : "text-[#231B16]"}`}>
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#9B8F85]">
                      {item.quantity} {item.unit} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.isEssential && (
                    <span className="rounded-full bg-[#F2ECE3] px-2.5 py-0.5 text-[10px] font-semibold text-[#9E6123]">
                      Essencial
                    </span>
                  )}
                  <button
                    onClick={() => deleteGrocery.mutate(item.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
                    title="Excluir"
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
      {/* 3. MANUTENÇÕES DOMÉSTICAS */}
      {/* ======================================================== */}
      {subTab === "manutencoes" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Manutenções da Casa</h2>
              <p className="text-xs text-[#6E6259] truncate">Reparos preventivos, revisões de cômodos e melhorias no lar.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("manutencao_casa")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Nova Manutenção
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {maintenances.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleMaint.mutate(item.id)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border text-xs transition ${
                        item.status === "concluido"
                          ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                          : "border-[#D5CCC2] hover:border-[#C47882]"
                      }`}
                    >
                      {item.status === "concluido" && "✓"}
                    </button>
                    <span className="font-medium text-[#231B16]">{item.title}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      item.priority === "alta"
                        ? "bg-[#C47882]/15 text-[#C47882]"
                        : item.priority === "media"
                        ? "bg-[#9E6123]/15 text-[#9E6123]"
                        : "bg-[#465768]/15 text-[#465768]"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E6259] pt-1">
                  <span>
                    Cômodo: <strong className="text-[#231B16]">{item.room}</strong>
                    {item.dueDate && ` • Prazo: ${item.dueDate}`}
                  </span>
                  {item.costCents > 0 && (
                    <span className="font-semibold text-[#231B16] tabular-nums">
                      {formatMoney(item.costCents)}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-1 rounded-xl bg-[#FAF7F2] p-2.5 text-xs text-[#6E6259]">
                    {item.notes}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteMaint.mutate(item.id)}
                    className="cursor-pointer text-[11px] text-[#9B8F85] hover:text-[#C47882]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FILHOS & ESCOLA */}
      {/* ======================================================== */}
      {subTab === "filhos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Rotina dos Filhos</h2>
              <p className="text-xs text-[#6E6259] truncate">Acompanhamento pedagógico, escolar e atividades extracurriculares.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("rotina_filho")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Registro Escolar
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {childrenRoutines.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FAF7F2] px-2.5 py-0.5 text-xs font-semibold text-[#465768]">
                      {item.childName}
                    </span>
                    <span className="font-medium text-[#231B16]">{item.title}</span>
                  </div>
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] text-[#6E6259] font-medium uppercase">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9B8F85]">
                  <span>Data: {item.date}</span>
                  <button
                    onClick={() => toggleChild.mutate(item.id)}
                    className="cursor-pointer text-xs font-semibold text-[#3B7A6B] hover:underline"
                  >
                    Status: {item.status}
                  </button>
                </div>

                {item.notes && (
                  <p className="rounded-xl bg-[#FAF7F2] p-2.5 text-xs text-[#6E6259]">
                    {item.notes}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteChild.mutate(item.id)}
                    className="cursor-pointer text-[11px] text-[#9B8F85] hover:text-[#C47882]"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DESEJOS & COMPRAS */}
      {/* ======================================================== */}
      {subTab === "compras" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Desejos & Compras</h2>
              <p className="text-xs text-[#6E6259] truncate">Aquisições planejadas para a casa e para a família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("desejo_compra")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Desejo
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-medium text-[#231B16]">{item.title}</span>
                  <span className="font-semibold text-[#231B16] tabular-nums text-sm">
                    {formatMoney(item.estimatedCostCents)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E6259]">
                  <span>
                    Categoria: <strong>{item.category}</strong> • Prioridade: <strong>{item.priority}</strong>
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => updateWishlist.mutate({ id: item.id, status: e.target.value as any })}
                    className="rounded-lg border border-[#D5CCC2] bg-[#FAF7F2] px-2 py-0.5 text-xs text-[#231B16]"
                  >
                    <option value="desejo">Desejo</option>
                    <option value="planejado">Planejado</option>
                    <option value="comprado">Comprado</option>
                  </select>
                </div>

                {item.linkOrStore && (
                  <span className="text-[11px] text-[#9B8F85]">
                    Loja / Referência: {item.linkOrStore}
                  </span>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteWishlist.mutate(item.id)}
                    className="cursor-pointer text-[11px] text-[#9B8F85] hover:text-[#C47882]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PETS & CUIDADOS */}
      {/* ======================================================== */}
      {subTab === "pets" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Pets da Família</h2>
              <p className="text-xs text-[#6E6259] truncate">Vacinas, consultas veterinárias e banho & tosa.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("cuidado_pet")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Cuidado Pet
            </button>
          </div>

          {pets.map((pet) => (
            <div key={pet.id} className="flex flex-col gap-3 rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white shadow-xs"
                  style={{ backgroundColor: pet.avatarColor }}
                >
                  🐾
                </div>
                <div>
                  <h3 className="font-serif-loma text-lg text-[#231B16]">{pet.name}</h3>
                  <p className="text-xs text-[#6E6259]">
                    {pet.species} • {pet.breed}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-col divide-y divide-[#F2ECE3]">
                <h4 className="pb-1 text-xs font-bold text-[#6E6259] uppercase">Histórico e Próximos Cuidados</h4>
                {pet.careRecords.map((care) => (
                  <div key={care.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => togglePetCare.mutate(care.id)}
                        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border text-xs transition ${
                          care.status === "realizado"
                            ? "border-[#3B7A6B] bg-[#3B7A6B] text-white"
                            : "border-[#D5CCC2] hover:border-[#9E6123]"
                        }`}
                      >
                        {care.status === "realizado" && "✓"}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${care.status === "realizado" ? "line-through text-[#9B8F85]" : "text-[#231B16]"}`}>
                          {care.title}
                        </span>
                        <span className="text-[11px] text-[#9B8F85]">
                          {care.type.toUpperCase()} • {care.date}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePetCare.mutate(care.id)}
                      className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. VEÍCULOS */}
      {/* ======================================================== */}
      {subTab === "veiculos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Veículos da Família</h2>
              <p className="text-xs text-[#6E6259] truncate">Quilometragem, histórico de manutenções e revisões.</p>
            </div>
          </div>

          {vehicles.map((v) => (
            <div key={v.id} className="flex flex-col gap-3 rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-loma text-xl text-[#231B16]">{v.brand} {v.model}</h3>
                  <p className="text-xs text-[#6E6259]">
                    Ano {v.year} • Placa: {v.licensePlate} • {v.mileage.toLocaleString("pt-BR")} km rodados
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-col divide-y divide-[#F2ECE3]">
                <h4 className="pb-1 text-xs font-bold text-[#6E6259] uppercase">Histórico de Manutenções</h4>
                {v.maintenances.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#231B16]">{m.title}</span>
                      <span className="text-[11px] text-[#9B8F85]">
                        Data: {m.date} {m.nextDueMileage && `• Próx. aos ${m.nextDueMileage.toLocaleString("pt-BR")} km`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#231B16] tabular-nums">
                        {formatMoney(m.costCents)}
                      </span>
                      <button
                        onClick={() => deleteVehicleMaint.mutate(m.id)}
                        className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. PATRIMÔNIO & BENS */}
      {/* ======================================================== */}
      {subTab === "patrimonio" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Patrimônio da Casa</h2>
              <p className="text-xs text-[#6E6259] truncate">Bens duráveis, eletrodomésticos, eletrônicos e prazos de garantia.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {propertyAssets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <span className="font-medium text-[#231B16]">{asset.name}</span>
                  <span className="font-semibold text-[#231B16] tabular-nums text-sm">
                    {formatMoney(asset.estimatedValueCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#6E6259]">
                  <span>Categoria: {asset.category}</span>
                  {asset.warrantyUntil && <span>Garantia até: <strong>{asset.warrantyUntil}</strong></span>}
                </div>
                {asset.notes && <p className="text-xs text-[#9B8F85] bg-[#FAF7F2] p-2 rounded-lg">{asset.notes}</p>}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteProperty.mutate(asset.id)}
                    className="cursor-pointer text-[11px] text-[#9B8F85] hover:text-[#C47882]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. SEGURANÇA & EMERGÊNCIA */}
      {/* ======================================================== */}
      {subTab === "seguranca" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Segurança & Emergência</h2>
              <p className="text-xs text-[#6E6259] truncate">Telefones e contatos essenciais para situações de urgência.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("contato_emergencia")}
              className="shrink-0 cursor-pointer rounded-full bg-[#C47882] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#B36670] whitespace-nowrap"
            >
              + Contato Útil
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#231B16]">{contact.name}</span>
                  <span className="text-xs text-[#C47882] font-medium">{contact.roleOrRelation}</span>
                  {contact.addressOrDetails && (
                    <span className="text-[11px] text-[#9B8F85] mt-0.5">{contact.addressOrDetails}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, "")}`}
                    className="rounded-full bg-[#FAF7F2] border border-[#EAE2D6] px-3.5 py-1.5 text-xs font-bold text-[#231B16] tabular-nums transition hover:bg-[#EAE2D6]"
                  >
                    📞 {contact.phone}
                  </a>
                  <button
                    onClick={() => deleteEmergency.mutate(contact.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
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
      {/* 10. FAMÍLIA & REDE (RELACIONAMENTOS) */}
      {/* ======================================================== */}
      {subTab === "relacionamentos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Família & Rede</h2>
              <p className="text-xs text-[#6E6259] truncate">Parentes, padrinhos e datas especiais para manter contato.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {relationships.map((rel) => (
              <div key={rel.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[#231B16]">{rel.name}</h4>
                    <span className="text-xs text-[#9E6123] font-medium">{rel.relationship}</span>
                  </div>
                  {rel.phone && (
                    <span className="text-xs text-[#6E6259] tabular-nums font-medium">{rel.phone}</span>
                  )}
                </div>
                {rel.birthday && (
                  <span className="text-[11px] text-[#9B8F85]">
                    🎂 Aniversário: {rel.birthday}
                  </span>
                )}
                {rel.notes && (
                  <p className="text-xs text-[#6E6259] bg-[#FAF7F2] p-2 rounded-lg">{rel.notes}</p>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteRel.mutate(rel.id)}
                    className="cursor-pointer text-[11px] text-[#9B8F85] hover:text-[#C47882]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
