import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type CrescerData = ApiResponse<typeof api, "getCrescerOverview">;

interface CrescerProps {
  data?: CrescerData;
  isLoading: boolean;
  onOpenAddModal: (type: "projeto_trabalho" | "curso_estudo" | "livro" | "projeto_pessoal" | "viagem" | "documento" | "filme_serie" | "musica") => void;
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

export function CrescerView({ data, isLoading, onOpenAddModal }: CrescerProps) {
  const initialSub = (new URLSearchParams(window.location.search).get("sub") as any) || "resumo";
  const [subTab, setSubTab] = useState<
    "resumo" | "trabalho" | "estudos" | "livros" | "projetos" | "viagens" | "documentos" | "filmes" | "musica"
  >(initialSub);

  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["crescerOverview"] });
    queryClient.invalidateQueries({ queryKey: ["homeDashboard"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const updateWork = useMutation({
    mutationFn: (args: { id: number; status: "proposta" | "em_andamento" | "concluido" }) =>
      api.updateWorkProjectStatus(args),
    onSuccess: refresh,
  });

  const deleteWork = useMutation({
    mutationFn: (id: number) => api.deleteWorkProject({ id }),
    onSuccess: refresh,
  });

  const updateCourse = useMutation({
    mutationFn: (args: { id: number; progressPercent: number; status?: "em_andamento" | "concluido" | "pausado" }) =>
      api.updateStudyCourseProgress(args),
    onSuccess: refresh,
  });

  const deleteCourse = useMutation({
    mutationFn: (id: number) => api.deleteStudyCourse({ id }),
    onSuccess: refresh,
  });

  const updateBook = useMutation({
    mutationFn: (args: { id: number; status?: "lendo" | "lido" | "quero_ler"; currentPage?: number; rating?: number }) =>
      api.updateReadingBookStatus(args),
    onSuccess: refresh,
  });

  const deleteBook = useMutation({
    mutationFn: (id: number) => api.deleteReadingBook({ id }),
    onSuccess: refresh,
  });

  const updateProject = useMutation({
    mutationFn: (args: { id: number; progressPercent: number; nextMilestone?: string; status?: "ideia" | "em_andamento" | "concluido" }) =>
      api.updatePersonalProjectProgress(args),
    onSuccess: refresh,
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => api.deletePersonalProject({ id }),
    onSuccess: refresh,
  });

  const updateTrip = useMutation({
    mutationFn: (args: { id: number; status: "planejada" | "confirmada" | "realizada" }) =>
      api.updateTripStatus(args),
    onSuccess: refresh,
  });

  const deleteTrip = useMutation({
    mutationFn: (id: number) => api.deleteTrip({ id }),
    onSuccess: refresh,
  });

  const deleteDocument = useMutation({
    mutationFn: (id: number) => api.deletePersonalDocument({ id }),
    onSuccess: refresh,
  });

  const updateMedia = useMutation({
    mutationFn: (args: { id: number; status: "assistindo" | "quero_assistir" | "assistido"; rating?: number }) =>
      api.updateCulturalMediaStatus(args),
    onSuccess: refresh,
  });

  const deleteMedia = useMutation({
    mutationFn: (id: number) => api.deleteCulturalMedia({ id }),
    onSuccess: refresh,
  });

  const toggleMusicFav = useMutation({
    mutationFn: (id: number) => api.toggleMusicFavorite({ id }),
    onSuccess: refresh,
  });

  const deleteMusic = useMutation({
    mutationFn: (id: number) => api.deleteMusicTrack({ id }),
    onSuccess: refresh,
  });

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#7A675A]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8836B] border-t-transparent" />
        <span className="mt-3 text-sm">Carregando crescimento & futuro...</span>
      </div>
    );
  }

  const {
    summary,
    workProjects,
    courses,
    books,
    personalProjects,
    trips,
    documents,
    culturalMedia,
    musicTracks,
  } = data;

  const formatMoney = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const currentBook = books.find((b) => b.status === "lendo") || books[0];
  const activeProject = personalProjects.find((p) => p.status === "em_andamento") || personalProjects[0];
  const nextTrip = trips.find((t) => t.status === "planejada" || t.status === "confirmada") || trips[0];

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* ======================================================== */}
      {/* 1. VISÃO GERAL (RESUMO CRESCER) */}
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
                Crescimento & Futuro
              </span>
              <h2 className="font-serif text-2xl text-[#FFF7EA] leading-tight">
                Construindo o amanhã, com clareza e dedicação<span className="text-[#F3C6D2]">.</span>
              </h2>
              <p className="text-xs text-[#FFF7EA]/75">
                Carreira, estudos contínuos, leituras transformadoras e planos para expandir horizontes.
              </p>

              {/* Indicadores Chave */}
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2 text-center border-t border-white/12">
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/10 border border-white/12 p-2">
                  <span className="text-[10px] text-[#FFF7EA]/75 truncate w-full">Livros Lidos</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#F3C6D2] tabular-nums truncate w-full">
                    {summary.booksReadThisYear} lidos
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/10 border border-white/12 p-2">
                  <span className="text-[10px] text-[#FFF7EA]/75 truncate w-full">Projetos Ativos</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#F3C6D2] tabular-nums truncate w-full">
                    {summary.activePersonalProjectsCount} projetos
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-xl bg-white/10 border border-white/12 p-2">
                  <span className="text-[10px] text-[#FFF7EA]/75 truncate w-full">Cursos</span>
                  <span className="font-serif text-base sm:text-xl font-bold text-[#FFF7EA] tabular-nums truncate w-full">
                    {summary.activeCoursesCount} ativos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ÍNDICE DE MÓDULOS DO CRESCER (8 MÓDULOS EMPILHADOS VERTICALMENTE) */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between mb-1 px-1">
              <div>
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">
                  Índice de Módulos (8)
                </h3>
                <p className="text-[13px] text-[#7A675A]">
                  Toque para gerenciar cada dimensão do seu desenvolvimento pessoal
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <LomaCard
                id="mod_trabalho"
                title="Trabalho & Carreira"
                category="Profissional"
                meta={`${workProjects.length} projetos de carreira`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#2E2019] tabular-nums">{workProjects.length} projetos</span>}
                onClick={() => setSubTab("trabalho")}
              />
              <LomaCard
                id="mod_estudos"
                title="Estudos & Cursos"
                category="Formação"
                meta={`${courses.length} cursos cadastrados`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#7D8C6F] tabular-nums">{summary.activeCoursesCount} ativos</span>}
                onClick={() => setSubTab("estudos")}
              />
              <LomaCard
                id="mod_livros"
                title="Livros & Leituras"
                category="Conhecimento"
                meta={`${books.length} livros na estante`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#C79A3B] tabular-nums">{summary.booksReadThisYear} lidos</span>}
                onClick={() => setSubTab("livros")}
              />
              <LomaCard
                id="mod_projetos"
                title="Projetos Autorais"
                category="Criação"
                meta={`${personalProjects.length} iniciativas pessoais`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#E8836B] tabular-nums">{summary.activePersonalProjectsCount} em andamento</span>}
                onClick={() => setSubTab("projetos")}
              />
              <LomaCard
                id="mod_viagens"
                title="Viagens & Experiências"
                category="Horizontes"
                meta={`${trips.length} viagens no histórico`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#653259] tabular-nums">{trips.length} roteiros</span>}
                onClick={() => setSubTab("viagens")}
              />
              <LomaCard
                id="mod_documentos"
                title="Documentos & Registros"
                category="Arquivo Seguro"
                meta={`${documents.length} documentos arquivados`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#2E2019] tabular-nums">{documents.length} docs</span>}
                onClick={() => setSubTab("documentos")}
              />
              <LomaCard
                id="mod_filmes"
                title="Filmes & Séries"
                category="Cultura & Lazer"
                meta={`${culturalMedia.length} títulos salvos`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#465768] tabular-nums">{culturalMedia.length} mídias</span>}
                onClick={() => setSubTab("filmes")}
              />
              <LomaCard
                id="mod_musica"
                title="Música & Playlists"
                category="Inspiração"
                meta={`${musicTracks.length} faixas e playlists familiares`}
                badge={<span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-semibold text-[#7D8C6F] tabular-nums">{musicTracks.length} faixas</span>}
                onClick={() => setSubTab("musica")}
              />
            </div>
          </div>

          {/* Destaque 1: Livro em Leitura Ativa */}
          {currentBook && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Leitura em Andamento</h3>
                <button
                  onClick={() => setSubTab("livros")}
                  className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
                >
                  Ver Estante →
                </button>
              </div>

              <LomaCard
                id={currentBook.id}
                title={currentBook.title}
                category={currentBook.author}
                meta={currentBook.category}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-semibold text-[#C79A3B] capitalize">
                    {currentBook.status}
                  </span>
                }
              >
                <div className="flex flex-col gap-2">
                  {currentBook.totalPages > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-[#7A675A] tabular-nums">
                        <span>Progresso: {Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%</span>
                        <span>{currentBook.currentPage} de {currentBook.totalPages} páginas</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                        <div
                          className="h-full rounded-full bg-[#C79A3B] transition-all"
                          style={{ width: `${Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {currentBook.reviewOrNotes && (
                    <p className="text-xs italic text-[#7A675A]">"{currentBook.reviewOrNotes}"</p>
                  )}
                </div>
              </LomaCard>
            </div>
          )}

          {/* Destaque 2: Projeto em Foco */}
          {activeProject && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Projeto em Foco</h3>
                <button
                  onClick={() => setSubTab("projetos")}
                  className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
                >
                  Ver Projetos →
                </button>
              </div>

              <LomaCard
                id={activeProject.id}
                title={activeProject.title}
                category={activeProject.category}
                meta={`Progresso: ${activeProject.progressPercent}%`}
                badge={
                  <span className="font-bold text-xs text-[#7D8C6F] tabular-nums">
                    {activeProject.progressPercent}%
                  </span>
                }
              >
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                    <div
                      className="h-full rounded-full bg-[#7D8C6F] transition-all"
                      style={{ width: `${activeProject.progressPercent}%` }}
                    />
                  </div>
                  {activeProject.nextMilestone && (
                    <p className="text-xs text-[#2E2019]">
                      <strong>Próximo marco: </strong>{activeProject.nextMilestone}
                    </p>
                  )}
                </div>
              </LomaCard>
            </div>
          )}

          {/* Destaque 3: Próxima Viagem */}
          {nextTrip && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Próxima Viagem</h3>
                <button
                  onClick={() => setSubTab("viagens")}
                  className="h-11 px-4 rounded-full bg-[#F3E9D7] text-[#2E2019] text-xs font-semibold hover:bg-[#E7DBC6] transition"
                >
                  Roteiros →
                </button>
              </div>

              <LomaCard
                id={nextTrip.id}
                title={`✈ ${nextTrip.destination}`}
                category={nextTrip.status}
                meta={`${nextTrip.startDate} a ${nextTrip.endDate}`}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-bold text-[#465768] capitalize">
                    {nextTrip.status}
                  </span>
                }
              >
                <div className="flex flex-col gap-1 text-xs text-[#7A675A]">
                  {nextTrip.accommodation && <p><strong>Hospedagem: </strong>{nextTrip.accommodation}</p>}
                  {nextTrip.budgetEstimatedCents > 0 && (
                    <p>Orçamento estimado: {formatMoney(nextTrip.budgetEstimatedCents)}</p>
                  )}
                </div>
              </LomaCard>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TRABALHO & CARREIRA */}
      {/* ======================================================== */}
      {subTab === "trabalho" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Trabalho & Carreira</h3>
              <p className="text-[13px] text-[#7A675A]">Projetos profissionais, consultorias e contratos ativos.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("projeto_trabalho")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Trabalho
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {workProjects.map((item) => (
              <LomaCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.area}
                meta={item.clientOrCompany ? `Cliente: ${item.clientOrCompany}` : undefined}
                badge={
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      item.status === "concluido"
                        ? "bg-[#F3E9D7] text-[#7D8C6F]"
                        : item.status === "em_andamento"
                        ? "bg-[#F3E9D7] text-[#C79A3B]"
                        : "bg-[#F3E9D7] text-[#465768]"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                }
                onDelete={() => deleteWork.mutate(item.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  <p>Prazo: {item.deadline || "Sem prazo fixo"}. {item.feeCents > 0 && `Honorários: ${formatMoney(item.feeCents)}.`}</p>
                  {item.notes && <p className="italic">{item.notes}</p>}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3E9D7]">
                    <span>Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => updateWork.mutate({ id: item.id, status: e.target.value as any })}
                      className="rounded-full border border-[#E7DBC6] bg-[#FAF4E8] px-3 py-1 text-xs text-[#2E2019]"
                    >
                      <option value="proposta">Proposta</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ESTUDOS & CURSOS */}
      {/* ======================================================== */}
      {subTab === "estudos" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Estudos & Cursos</h3>
              <p className="text-[13px] text-[#7A675A]">Idiomas, qualificações e desenvolvimento.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("curso_estudo")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Curso
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {courses.map((c) => (
              <LomaCard
                key={c.id}
                id={c.id}
                title={c.title}
                category={c.category.toUpperCase()}
                meta={c.platformOrInstitution}
                badge={
                  <span className="font-bold text-xs text-[#7D8C6F] tabular-nums">
                    {c.progressPercent}%
                  </span>
                }
                onDelete={() => deleteCourse.mutate(c.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                    <div className="h-full rounded-full bg-[#7D8C6F]" style={{ width: `${c.progressPercent}%` }} />
                  </div>
                  <p>Horas cumpridas: {c.completedHours}h de {c.totalHours}h.</p>
                  <button
                    onClick={() => updateCourse.mutate({ id: c.id, progressPercent: Math.min(100, c.progressPercent + 10) })}
                    className="self-start text-xs font-semibold text-[#7D8C6F] hover:underline cursor-pointer"
                  >
                    + 10% de Progresso
                  </button>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LIVROS & LEITURAS */}
      {/* ======================================================== */}
      {subTab === "livros" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Livros & Leituras</h3>
              <p className="text-[13px] text-[#7A675A]">Estante viva com leituras atuais, lidos e metas.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("livro")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Livro
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {books.map((b) => (
              <LomaCard
                key={b.id}
                id={b.id}
                title={b.title}
                category={b.author}
                meta={b.category}
                badge={
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      b.status === "lido"
                        ? "bg-[#F3E9D7] text-[#7D8C6F]"
                        : b.status === "lendo"
                        ? "bg-[#F3E9D7] text-[#C79A3B]"
                        : "bg-[#F3E9D7] text-[#7A675A]"
                    }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                }
                onDelete={() => deleteBook.mutate(b.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  {b.totalPages > 0 && (
                    <div>
                      <span>Página {b.currentPage} de {b.totalPages}</span>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                        <div
                          className="h-full rounded-full bg-[#C79A3B]"
                          style={{ width: `${Math.min(100, Math.round((b.currentPage / b.totalPages) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {b.reviewOrNotes && <p className="italic">"{b.reviewOrNotes}"</p>}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3E9D7]">
                    <span className="text-[#C79A3B]">
                      {"★".repeat(b.rating || 5)}{"☆".repeat(5 - (b.rating || 5))}
                    </span>
                    <select
                      value={b.status}
                      onChange={(e) => updateBook.mutate({ id: b.id, status: e.target.value as any })}
                      className="rounded-full border border-[#E7DBC6] bg-[#FAF4E8] px-3 py-1 text-xs text-[#2E2019]"
                    >
                      <option value="lendo">Lendo</option>
                      <option value="lido">Lido</option>
                      <option value="quero_ler">Quero Ler</option>
                    </select>
                  </div>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PROJETOS AUTORAIS */}
      {/* ======================================================== */}
      {subTab === "projetos" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Projetos Autorais</h3>
              <p className="text-[13px] text-[#7A675A]">Iniciativas pessoais e construções familiares.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("projeto_pessoal")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Projeto
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {personalProjects.map((p) => (
              <LomaCard
                key={p.id}
                id={p.id}
                title={p.title}
                category={p.category}
                meta={p.nextMilestone ? `Próximo: ${p.nextMilestone}` : undefined}
                badge={
                  <span className="font-bold text-xs text-[#7D8C6F] tabular-nums">
                    {p.progressPercent}%
                  </span>
                }
                onDelete={() => deleteProject.mutate(p.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7DBC6]">
                    <div className="h-full rounded-full bg-[#7D8C6F]" style={{ width: `${p.progressPercent}%` }} />
                  </div>
                  {p.notes && <p>{p.notes}</p>}
                  <button
                    onClick={() => updateProject.mutate({ id: p.id, progressPercent: Math.min(100, p.progressPercent + 10) })}
                    className="self-start text-xs font-semibold text-[#7D8C6F] hover:underline cursor-pointer"
                  >
                    + 10% Conclusão
                  </button>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. VIAGENS */}
      {/* ======================================================== */}
      {subTab === "viagens" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Viagens & Roteiros</h3>
              <p className="text-[13px] text-[#7A675A]">Destinos planejados, orçamentos e experiências.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("viagem")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Viagem
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {trips.map((t) => (
              <LomaCard
                key={t.id}
                id={t.id}
                title={`✈ ${t.destination}`}
                category={t.status}
                meta={`${t.startDate} a ${t.endDate}`}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-xs font-bold text-[#465768] capitalize">
                    {t.status}
                  </span>
                }
                onDelete={() => deleteTrip.mutate(t.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  {t.accommodation && <p><strong>Hospedagem: </strong>{t.accommodation}</p>}
                  {t.checklistItems && <p><strong>Checklist: </strong>{t.checklistItems}</p>}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3E9D7]">
                    <span className="font-semibold text-[#2E2019] tabular-nums">
                      {formatMoney(t.budgetEstimatedCents)}
                    </span>
                    <select
                      value={t.status}
                      onChange={(e) => updateTrip.mutate({ id: t.id, status: e.target.value as any })}
                      className="rounded-full border border-[#E7DBC6] bg-[#FAF4E8] px-3 py-1 text-xs text-[#2E2019]"
                    >
                      <option value="planejada">Planejada</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="realizada">Realizada</option>
                    </select>
                  </div>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. DOCUMENTOS */}
      {/* ======================================================== */}
      {subTab === "documentos" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Documentos & Validades</h3>
              <p className="text-[13px] text-[#7A675A]">Passaportes, CNH, certidões e alertas de renovação.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("documento")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Documento
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {documents.map((d) => (
              <LomaCard
                key={d.id}
                id={d.id}
                title={d.title}
                category={d.personName}
                meta={d.expirationDate ? `Validade: ${d.expirationDate}` : "Indeterminada"}
                onDelete={() => deleteDocument.mutate(d.id)}
              >
                <div className="text-xs text-[#7A675A]">
                  {d.documentNumber && <p>Número: {d.documentNumber}</p>}
                  {d.notes && <p>Observações: {d.notes}</p>}
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. FILMES & SÉRIES */}
      {/* ======================================================== */}
      {subTab === "filmes" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Filmes & Séries</h3>
              <p className="text-[13px] text-[#7A675A]">Watchlist cultural e conteúdos recomendados para a família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("filme_serie")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Conteúdo
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {culturalMedia.map((m) => (
              <LomaCard
                key={m.id}
                id={m.id}
                title={m.title}
                category={m.type.toUpperCase()}
                meta={m.platform}
                badge={
                  <span className="rounded-full bg-[#F3E9D7] px-2.5 py-1 text-[10px] font-bold text-[#7A675A] uppercase">
                    {m.status.replace("_", " ")}
                  </span>
                }
                onDelete={() => deleteMedia.mutate(m.id)}
              >
                <div className="flex flex-col gap-2 text-xs text-[#7A675A]">
                  {m.recommendedBy && <p>Indicado por: {m.recommendedBy}</p>}
                  {m.genre && <p>Gênero: {m.genre}</p>}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3E9D7]">
                    <span className="text-[#C79A3B]">
                      {"★".repeat(m.rating || 5)}{"☆".repeat(5 - (m.rating || 5))}
                    </span>
                    <select
                      value={m.status}
                      onChange={(e) => updateMedia.mutate({ id: m.id, status: e.target.value as any })}
                      className="rounded-full border border-[#E7DBC6] bg-[#FAF4E8] px-3 py-1 text-xs text-[#2E2019]"
                    >
                      <option value="quero_assistir">Quero Assistir</option>
                      <option value="assistindo">Assistindo</option>
                      <option value="assistido">Assistido</option>
                    </select>
                  </div>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MÚSICA & PLAYLISTS */}
      {/* ======================================================== */}
      {subTab === "musica" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setSubTab("resumo")}
            className="self-start text-xs font-semibold text-[#7A675A] hover:text-[#2E2019] flex items-center gap-1.5 py-1 px-2 rounded-full bg-[#F3E9D7] transition cursor-pointer"
          >
            ← Voltar ao Crescer
          </button>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[20px] font-medium text-[#2E2019]">Música & Memórias</h3>
              <p className="text-[13px] text-[#7A675A]">Trilhas sonoras que marcam a história da família.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("musica")}
              className="h-11 px-4 rounded-full bg-[#2E2019] text-xs font-semibold text-white shadow-xs transition hover:bg-[#4A382C] shrink-0"
            >
              + Música
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {musicTracks.map((tr) => (
              <LomaCard
                key={tr.id}
                id={tr.id}
                title={tr.title}
                category={tr.artistOrCurator}
                meta={tr.playlistOrAlbum || tr.momentOrMood}
                badge={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMusicFav.mutate(tr.id);
                    }}
                    className="text-base text-[#E8836B] cursor-pointer px-1"
                  >
                    {tr.isFavorite === 1 ? "♥" : "♡"}
                  </button>
                }
                onDelete={() => deleteMusic.mutate(tr.id)}
              >
                <div className="text-xs text-[#7A675A]">
                  <p>Momento: {tr.momentOrMood} • Plataforma: {tr.platform}</p>
                </div>
              </LomaCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
