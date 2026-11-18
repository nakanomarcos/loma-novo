import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type CasaData = ApiResponse<typeof api, "getCasaOverview">;

interface CasaProps {
  data?: CasaData;
  isLoading: boolean;
  onOpenAddModal: (type: "item_mercado" | "manutencao_casa" | "rotina_filho" | "desejo_compra" | "cuidado_pet" | "contato_emergencia") => void;
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

  const sortedGroceries = groceries
    .slice()
    .sort((a, b) => (a.isPurchased ? 1 : 0) - (b.isPurchased ? 1 : 0));

  const sortedMaintenances = maintenances
    .slice()
    .sort((a, b) => (a.status === "concluido" ? 1 : 0) - (b.status === "concluido" ? 1 : 0));

  const sortedChildren = childrenRoutines
    .slice()
    .sort((a, b) => (a.status === "concluido" ? 1 : 0) - (b.status === "concluido" ? 1 : 0));

  return (
    <div className="flex flex-col gap-4 pb-24">
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
      {/* 1. VISÃO GERAL (RESUMO CASA & FAMÍLIA) */}
      {/* ======================================================== */}
      {subTab === "resumo" && (
        <div className="flex flex-col gap-4">
          {/* Herói com padding 16px e raio 24px */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#231B16] p-4 text-[#FAF7F2] shadow-md">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(196, 120, 130, 0.35) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-[#C47882] uppercase">
                Gestão Doméstica & Familiar
              </span>
              <h2 className="font-serif text-2xl text-[#FAF7F2] leading-tight">
                O lar em harmonia, com cuidado e zelo<span className="text-[#C47882]">.</span>
              </h2>
              <p className="text-xs text-[#FAF7F2]/70">
                Manutenções em dia, rotinas dos filhos acompanhadas e compras organizadas para a família.
              </p>

              {/* Indicadores Chave */}
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2 text-center border-t border-white/10">
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Mercado</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.groceriesToBuyCount}
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Manutenções</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.pendingMaintenancesCount}
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Bens</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {formatMoney(summary.totalPropertyAssetsValue).replace(",00", "")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque 1: Itens de Mercado */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Lista de Mercado Rápida</h3>
              <button
                onClick={() => onOpenAddModal("item_mercado")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Item
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {sortedGroceries.slice(0, 3).map((item) => (
                <LomaCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  category={item.category}
                  meta={`${item.quantity} ${item.unit}`}
                  isCompleted={item.isPurchased}
                  onToggle={() => toggleGrocery.mutate(item.id)}
                  onDelete={() => deleteGrocery.mutate(item.id)}
                  badge={
                    item.isEssential ? (
                      <span className="rounded-full bg-[#F2ECE3] px-2.5 py-1 text-[10px] font-semibold text-[#9E6123]">
                        Essencial
                      </span>
                    ) : null
                  }
                >
                  <p className="text-xs text-[#6E6259]">
                    Item da categoria {item.category}. Quantidade: {item.quantity} {item.unit}.
                  </p>
                </LomaCard>
              ))}
            </div>
          </div>

          {/* Destaque 2: Manutenções Domésticas */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Manutenções da Casa</h3>
              <button
                onClick={() => onOpenAddModal("manutencao_casa")}
                className="h-11 px-4 rounded-full bg-[#F5EFE6] text-[#2C241E] text-xs font-semibold hover:bg-[#EAE2D6] transition"
              >
                + Manutenção
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {sortedMaintenances.slice(0, 3).map((item) => (
                <LomaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.room}
                  meta={item.dueDate ? `Prazo: ${item.dueDate}` : undefined}
                  isCompleted={item.status === "concluido"}
                  onToggle={() => toggleMaint.mutate(item.id)}
                  onDelete={() => deleteMaint.mutate(item.id)}
                  badge={
                    item.costCents > 0 ? (
                      <span className="text-xs font-semibold text-[#2C241E] tabular-nums">
                        {formatMoney(item.costCents)}
                      </span>
                    ) : null
                  }
                >
                  <p className="text-xs text-[#6E6259]">
                    Cômodo: {item.room} • Prioridade: {item.priority}. {item.notes ? `Observações: ${item.notes}` : ""}
                  </p>
                </LomaCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MERCADO & DESPENSA COMPLETA */}
      {/* ======================================================== */}
      {subTab === "mercado" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Lista de Mercado</h3>
              <p className="text-[13px] text-[#7C6E62]">Itens para reposição na despensa e compras da semana.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("item_mercado")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Novo Item
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedGroceries.map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.name}
                category={item.category}
                meta={`${item.quantity} ${item.unit}`}
                isCompleted={item.isPurchased}
                onToggle={() => toggleGrocery.mutate(item.id)}
                onDelete={() => deleteGrocery.mutate(item.id)}
                badge={
                  item.isEssential ? (
                    <span className="rounded-full bg-[#F2ECE3] px-2.5 py-1 text-[10px] font-semibold text-[#9E6123]">
                      Essencial
                    </span>
                  ) : null
                }
              >
                <p className="text-xs text-[#6E6259]">
                  Item de mercado registrado para compra.
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MANUTENÇÕES DOMÉSTICAS COMPLETA */}
      {/* ======================================================== */}
      {subTab === "manutencoes" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Manutenções da Casa</h3>
              <p className="text-[13px] text-[#7C6E62]">Reparos preventivos, revisões de cômodos e melhorias no lar.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("manutencao_casa")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Manutenção
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedMaintenances.map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.room}
                meta={item.dueDate ? `Prazo: ${item.dueDate}` : undefined}
                isCompleted={item.status === "concluido"}
                onToggle={() => toggleMaint.mutate(item.id)}
                onDelete={() => deleteMaint.mutate(item.id)}
                badge={
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
                }
              >
                <div className="flex flex-col gap-1 text-xs text-[#6E6259]">
                  <p>Cômodo: <strong>{item.room}</strong> • Custo estimado: {formatMoney(item.costCents)}.</p>
                  {item.notes && <p className="italic">{item.notes}</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FILHOS & ESCOLA COMPLETA */}
      {/* ======================================================== */}
      {subTab === "filhos" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Rotina dos Filhos</h3>
              <p className="text-[13px] text-[#7C6E62]">Acompanhamento pedagógico, escolar e atividades.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("rotina_filho")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Registro
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {sortedChildren.map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.childName}
                meta={`Data: ${item.date}`}
                isCompleted={item.status === "concluido"}
                onToggle={() => toggleChild.mutate(item.id)}
                onDelete={() => deleteChild.mutate(item.id)}
                badge={
                  <span className="rounded-full bg-[#F2ECE3] px-2.5 py-0.5 text-[10px] text-[#465768] font-medium uppercase">
                    {item.category}
                  </span>
                }
              >
                <div className="text-xs text-[#6E6259]">
                  <p>Filho(a): <strong>{item.childName}</strong> • Categoria: {item.category}.</p>
                  {item.notes && <p className="mt-1 italic">{item.notes}</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DESEJOS & COMPRAS */}
      {/* ======================================================== */}
      {subTab === "compras" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Desejos & Compras</h3>
              <p className="text-[13px] text-[#7C6E62]">Aquisições planejadas para a casa e para a família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("desejo_compra")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Desejo
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {wishlist.map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.category}
                meta={`Estimado: ${formatMoney(item.estimatedCostCents)} • Prioridade: ${item.priority}`}
                onDelete={() => deleteWishlist.mutate(item.id)}
                badge={
                  <span className="rounded-full bg-[#F2ECE3] px-2.5 py-0.5 text-[10px] font-bold text-[#2C241E] uppercase">
                    {item.status}
                  </span>
                }
              >
                <div className="flex flex-col gap-2 text-xs text-[#6E6259]">
                  <div className="flex items-center justify-between">
                    <span>Status de Aquisição:</span>
                    <select
                      value={item.status}
                      onChange={(e) => updateWishlist.mutate({ id: item.id, status: e.target.value as any })}
                      className="rounded-full border border-[#D5CCC2] bg-[#FAF7F2] px-3 py-1 text-xs text-[#231B16]"
                    >
                      <option value="desejo">Desejo</option>
                      <option value="planejado">Planejado</option>
                      <option value="comprado">Comprado</option>
                    </select>
                  </div>
                  {item.linkOrStore && <p>Referência / Loja: {item.linkOrStore}</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PETS & CUIDADOS */}
      {/* ======================================================== */}
      {subTab === "pets" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Pets da Família</h3>
              <p className="text-[13px] text-[#7C6E62]">Vacinas, consultas veterinárias e cuidados.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("cuidado_pet")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Cuidado Pet
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            {pets.map((pet) => (
              <div key={pet.id} className="flex flex-col space-y-2">
                <div className="flex items-center gap-2.5 px-1">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: pet.avatarColor }}
                  >
                    🐾
                  </div>
                  <h4 className="font-semibold text-sm text-[#2C241E]">{pet.name} ({pet.species} • {pet.breed})</h4>
                </div>

                {pet.careRecords.map((care) => (
                  <LomaCard
                    key={care.id}
                    id={care.id}
                    title={care.title}
                    category={care.type.toUpperCase()}
                    meta={`Data: ${care.date}`}
                    isCompleted={care.status === "realizado"}
                    onToggle={() => togglePetCare.mutate(care.id)}
                    onDelete={() => deletePetCare.mutate(care.id)}
                  >
                    <p className="text-xs text-[#6E6259]">
                      Cuidado veterinário programado para {pet.name}.
                    </p>
                  </LomaCard>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. VEÍCULOS */}
      {/* ======================================================== */}
      {subTab === "veiculos" && (
        <div className="flex flex-col gap-3">
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Veículos da Família</h3>
            <p className="text-[13px] text-[#7C6E62]">Quilometragem, histórico de manutenções e revisões.</p>
          </div>

          <div className="flex flex-col space-y-3">
            {vehicles.map((v) => (
              <div key={v.id} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-semibold text-sm text-[#2C241E]">
                    🚗 {v.brand} {v.model} ({v.year})
                  </h4>
                  <span className="text-xs text-[#7C6E62] tabular-nums font-medium">{v.mileage.toLocaleString()} km</span>
                </div>

                {v.maintenances.map((m) => (
                  <LomaCard
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    category="Revisão"
                    meta={`Data: ${m.date} • Custo: ${formatMoney(m.costCents)}`}
                    onDelete={() => deleteVehicleMaint.mutate(m.id)}
                  >
                    <p className="text-xs text-[#6E6259]">
                      {m.nextDueMileage ? `Próxima revisão: ${m.nextDueMileage.toLocaleString()} km. ` : ""}
                      {m.notes ? `Observações: ${m.notes}` : ""}
                    </p>
                  </LomaCard>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. PATRIMÔNIO & BENS */}
      {/* ======================================================== */}
      {subTab === "patrimonio" && (
        <div className="flex flex-col gap-3">
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Patrimônio & Bens da Casa</h3>
            <p className="text-[13px] text-[#7C6E62]">Inventário doméstico, equipamentos e garantias.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {propertyAssets.map((asset) => (
              <LomaCard
                key={asset.id}
                id={asset.id}
                title={asset.name}
                category={asset.category}
                meta={asset.notes || undefined}
                badge={
                  <span className="text-sm font-bold text-[#2C241E] tabular-nums">
                    {formatMoney(asset.estimatedValueCents)}
                  </span>
                }
                onDelete={() => deleteProperty.mutate(asset.id)}
              >
                <p className="text-xs text-[#6E6259]">
                  {asset.purchaseDate && `Data de aquisição: ${asset.purchaseDate}. `}
                  {asset.warrantyUntil && `Garantia até: ${asset.warrantyUntil}. `}
                  {asset.notes && `Observações: ${asset.notes}`}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. SEGURANÇA & EMERGÊNCIA */}
      {/* ======================================================== */}
      {subTab === "seguranca" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Contatos de Emergência</h3>
              <p className="text-[13px] text-[#7C6E62]">Médicos, socorro e assistência técnica rápida.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("contato_emergencia")}
              className="h-11 px-4 rounded-full bg-[#231B16] text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A2E27] shrink-0"
            >
              + Contato
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {emergencyContacts.map((contact) => (
              <LomaCard
                key={contact.id}
                id={contact.id}
                title={contact.name}
                category={contact.roleOrRelation}
                meta={`Telefone: ${contact.phone}`}
                onDelete={() => deleteEmergency.mutate(contact.id)}
              >
                <p className="text-xs text-[#6E6259]">
                  {contact.addressOrDetails ? `Detalhes: ${contact.addressOrDetails}` : "Contato de socorro prioritário."}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. RELACIONAMENTOS */}
      {/* ======================================================== */}
      {subTab === "relacionamentos" && (
        <div className="flex flex-col gap-3">
          <div className="mb-1 px-1">
            <h3 className="font-serif text-[20px] font-medium text-[#2C241E]">Rede Familiar & Relacionamentos</h3>
            <p className="text-[13px] text-[#7C6E62]">Datas especiais e frequência de contato com pessoas queridas.</p>
          </div>

          <div className="flex flex-col space-y-2">
            {relationships.map((rel) => (
              <LomaCard
                key={rel.id}
                id={rel.id}
                title={rel.name}
                category={rel.relationship}
                meta={rel.birthday ? `Aniversário: ${rel.birthday}` : rel.phone ? `Tel: ${rel.phone}` : undefined}
                onDelete={() => deleteRel.mutate(rel.id)}
              >
                <p className="text-xs text-[#6E6259]">
                  Relação: {rel.relationship}. {rel.phone ? `Telefone: ${rel.phone}. ` : ""}
                  {rel.notes ? `Notas: ${rel.notes}` : ""}
                </p>
              </LomaCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
