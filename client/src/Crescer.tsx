import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type CrescerData = ApiResponse<typeof api, "getCrescerOverview">;

interface CrescerProps {
  data?: CrescerData;
  isLoading: boolean;
  onOpenAddModal: (type: "projeto_trabalho" | "curso_estudo" | "livro" | "projeto_pessoal" | "viagem" | "documento" | "filme_serie" | "musica") => void;
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
      <div className="flex flex-col items-center justify-center p-12 text-[#9B8F85]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C47882] border-t-transparent" />
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
    <div className="flex flex-col gap-5 pb-24">
      {/* Sub-navegação dos módulos de Crescer */}
      <div className="w-full max-w-full min-w-0 flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "resumo", label: "Visão Geral" },
          { key: "trabalho", label: "Trabalho & Carreira" },
          { key: "estudos", label: "Estudos & Cursos" },
          { key: "livros", label: "Livros & Leituras" },
          { key: "projetos", label: "Projetos Autorais" },
          { key: "viagens", label: "Viagens" },
          { key: "documentos", label: "Documentos" },
          { key: "filmes", label: "Filmes & Séries" },
          { key: "musica", label: "Música & Playlists" },
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
      {/* 1. VISÃO GERAL (RESUMO CRESCER) */}
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
                Crescimento & Futuro
              </span>
              <h2 className="font-serif-loma text-2xl text-[#FAF7F2] leading-tight">
                Construindo o amanhã, com clareza e dedicação<span className="text-[#C47882]">.</span>
              </h2>
              <p className="text-xs text-[#FAF7F2]/70">
                Carreira, estudos contínuos, leituras transformadoras e planos para expandir horizontes.
              </p>

              {/* Indicadores Chave */}
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-2 text-center">
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Livros Lidos</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.booksReadThisYear} lidos
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Projetos Ativos</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.activePersonalProjectsCount} projetos
                  </span>
                </div>
                <div className="min-w-0 flex flex-col items-center rounded-2xl bg-white/5 p-2 sm:p-3 backdrop-blur-xs">
                  <span className="text-[10px] text-[#FAF7F2]/60 truncate w-full">Cursos</span>
                  <span className="font-serif-loma mt-1 text-base sm:text-xl font-bold text-[#FAF7F2] tabular-nums truncate w-full">
                    {summary.activeCoursesCount} ativos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque 1: Livro em Leitura Ativa */}
          {currentBook && (
            <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-[#9E6123] shrink-0" />
                  <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Leitura em Andamento</h3>
                </div>
                <button
                  onClick={() => setSubTab("livros")}
                  className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
                >
                  Ver Estante →
                </button>
              </div>

              <div className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif-loma text-base font-bold text-[#231B16]">{currentBook.title}</h4>
                    <p className="text-xs text-[#6E6259]">por {currentBook.author} • {currentBook.category}</p>
                  </div>
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#9E6123] capitalize">
                    {currentBook.status}
                  </span>
                </div>

                {currentBook.totalPages > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#6E6259] tabular-nums">
                      <span>Progresso: {Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%</span>
                      <span>{currentBook.currentPage} de {currentBook.totalPages} páginas</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div
                        className="h-full rounded-full bg-[#9E6123] transition-all"
                        style={{ width: `${Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {currentBook.reviewOrNotes && (
                  <p className="mt-3 text-xs italic text-[#6E6259] border-t border-[#EAE2D6] pt-2.5">
                    "{currentBook.reviewOrNotes}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Destaque 2: Projeto Prioritário */}
          {activeProject && (
            <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-[#3B7A6B] shrink-0" />
                  <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Projeto em Foco</h3>
                </div>
                <button
                  onClick={() => setSubTab("projetos")}
                  className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
                >
                  Ver Projetos →
                </button>
              </div>

              <div className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#231B16]">{activeProject.title}</h4>
                    <p className="text-xs text-[#6E6259] capitalize">Categoria: {activeProject.category}</p>
                  </div>
                  <span className="font-bold text-xs text-[#3B7A6B] tabular-nums">
                    {activeProject.progressPercent}%
                  </span>
                </div>

                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                  <div
                    className="h-full rounded-full bg-[#3B7A6B] transition-all"
                    style={{ width: `${activeProject.progressPercent}%` }}
                  />
                </div>

                {activeProject.nextMilestone && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-white p-2.5 text-xs text-[#231B16] border border-[#EAE2D6]">
                    <span className="font-semibold text-[#3B7A6B]">Próximo marco:</span>
                    <span className="text-[#6E6259] truncate">{activeProject.nextMilestone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destaque 3: Próxima Viagem */}
          {nextTrip && (
            <div className="rounded-3xl border border-[#EAE2D6] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 min-w-0 pb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-[#465768] shrink-0" />
                  <h3 className="font-serif-loma text-lg text-[#231B16] truncate">Próxima Viagem</h3>
                </div>
                <button
                  onClick={() => setSubTab("viagens")}
                  className="shrink-0 cursor-pointer text-xs font-medium text-[#C47882] hover:underline whitespace-nowrap"
                >
                  Roteiros →
                </button>
              </div>

              <div className="rounded-2xl border border-[#EAE2D6] bg-[#FAF7F2] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-loma text-base font-bold text-[#231B16]">✈ {nextTrip.destination}</h4>
                    <p className="text-xs text-[#6E6259] tabular-nums">
                      {nextTrip.startDate} até {nextTrip.endDate}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EDF1F5] px-2.5 py-0.5 text-xs font-bold text-[#465768] capitalize">
                    {nextTrip.status}
                  </span>
                </div>

                {nextTrip.accommodation && (
                  <p className="mt-2 text-xs text-[#6E6259]">
                    <strong>Hospedagem:</strong> {nextTrip.accommodation}
                  </p>
                )}

                {nextTrip.budgetEstimatedCents > 0 && (
                  <p className="mt-1 text-xs text-[#9B8F85] tabular-nums">
                    Orçamento estimado: {formatMoney(nextTrip.budgetEstimatedCents)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TRABALHO & CARREIRA */}
      {/* ======================================================== */}
      {subTab === "trabalho" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Trabalho & Carreira</h2>
              <p className="text-xs text-[#6E6259] truncate">Projetos profissionais, consultorias e contratos ativos.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("projeto_trabalho")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Trabalho
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {workProjects.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm text-[#231B16] truncate">{item.title}</h4>
                    <p className="text-xs text-[#9B8F85]">
                      {item.clientOrCompany ? `${item.clientOrCompany} • ` : ""}{item.area}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      item.status === "concluido"
                        ? "bg-[#E9F3F0] text-[#3B7A6B]"
                        : item.status === "em_andamento"
                        ? "bg-[#FBF2E6] text-[#9E6123]"
                        : "bg-[#EDF1F5] text-[#465768]"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E6259] pt-1">
                  <span>
                    {item.deadline ? `Prazo: ${item.deadline}` : "Sem prazo fixado"}
                  </span>
                  {item.feeCents > 0 && (
                    <span className="font-semibold text-[#231B16] tabular-nums">
                      {formatMoney(item.feeCents)}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-1 rounded-xl bg-[#FAF7F2] p-2.5 text-xs text-[#6E6259]">
                    {item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE3]">
                  <select
                    value={item.status}
                    onChange={(e) => updateWork.mutate({ id: item.id, status: e.target.value as any })}
                    className="rounded-lg border border-[#D5CCC2] bg-[#FAF7F2] px-2 py-0.5 text-xs text-[#231B16]"
                  >
                    <option value="proposta">Proposta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                  </select>
                  <button
                    onClick={() => deleteWork.mutate(item.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
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
      {/* 3. ESTUDOS & CURSOS */}
      {/* ======================================================== */}
      {subTab === "estudos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Estudos & Cursos</h2>
              <p className="text-xs text-[#6E6259] truncate">Idiomas, qualificações técnicas e desenvolvimento intelectual.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("curso_estudo")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Curso
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {courses.map((c) => (
              <div key={c.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#231B16]">{c.title}</h4>
                    <p className="text-xs text-[#6E6259]">
                      {c.platformOrInstitution ? `${c.platformOrInstitution} • ` : ""}{c.category.toUpperCase()}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-[#3B7A6B] tabular-nums">{c.progressPercent}%</span>
                </div>

                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                  <div className="h-full rounded-full bg-[#3B7A6B] transition-all" style={{ width: `${c.progressPercent}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs text-[#9B8F85] pt-1">
                  <span>Horas: {c.completedHours}h de {c.totalHours}h</span>
                  <span className="capitalize text-[#231B16] font-medium">{c.status}</span>
                </div>

                {c.notes && (
                  <p className="rounded-xl bg-[#FAF7F2] p-2 text-xs text-[#6E6259]">{c.notes}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => updateCourse.mutate({ id: c.id, progressPercent: Math.min(100, c.progressPercent + 10) })}
                    className="cursor-pointer text-xs font-semibold text-[#3B7A6B] hover:underline"
                  >
                    + 10% Progresso
                  </button>
                  <button
                    onClick={() => deleteCourse.mutate(c.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
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
      {/* 4. LIVROS & LEITURAS */}
      {/* ======================================================== */}
      {subTab === "livros" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Livros & Leituras</h2>
              <p className="text-xs text-[#6E6259] truncate">Estante viva com leituras atuais, lidos e metas do ano.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("livro")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Livro
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {books.map((b) => (
              <div key={b.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif-loma text-base font-bold text-[#231B16]">{b.title}</h4>
                    <p className="text-xs text-[#6E6259]">por {b.author} • {b.category}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      b.status === "lido"
                        ? "bg-[#E9F3F0] text-[#3B7A6B]"
                        : b.status === "lendo"
                        ? "bg-[#FBF2E6] text-[#9E6123]"
                        : "bg-[#F2ECE3] text-[#6E6259]"
                    }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </div>

                {b.totalPages > 0 && b.status === "lendo" && (
                  <div className="mt-1">
                    <div className="flex justify-between text-xs text-[#6E6259] tabular-nums">
                      <span>Página {b.currentPage} de {b.totalPages}</span>
                      <span>{Math.round((b.currentPage / b.totalPages) * 100)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                      <div
                        className="h-full rounded-full bg-[#9E6123]"
                        style={{ width: `${Math.min(100, Math.round((b.currentPage / b.totalPages) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {b.reviewOrNotes && (
                  <p className="mt-1 rounded-xl bg-[#FAF7F2] p-2.5 text-xs text-[#6E6259] italic">
                    "{b.reviewOrNotes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3]">
                  <span className="text-xs text-[#9E6123]">
                    {"★".repeat(b.rating || 5)}{"☆".repeat(5 - (b.rating || 5))}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      onChange={(e) => updateBook.mutate({ id: b.id, status: e.target.value as any })}
                      className="rounded-lg border border-[#D5CCC2] bg-[#FAF7F2] px-2 py-0.5 text-xs text-[#231B16]"
                    >
                      <option value="lendo">Lendo</option>
                      <option value="lido">Lido</option>
                      <option value="quero_ler">Quero Ler</option>
                    </select>
                    <button
                      onClick={() => deleteBook.mutate(b.id)}
                      className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PROJETOS AUTORAIS */}
      {/* ======================================================== */}
      {subTab === "projetos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Projetos Autorais</h2>
              <p className="text-xs text-[#6E6259] truncate">Iniciativas pessoais, criações e construções familiares.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("projeto_pessoal")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Projeto
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {personalProjects.map((p) => (
              <div key={p.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#231B16]">{p.title}</h4>
                    <span className="text-xs text-[#6E6259] capitalize">Categoria: {p.category}</span>
                  </div>
                  <span className="font-bold text-xs text-[#3B7A6B] tabular-nums">{p.progressPercent}%</span>
                </div>

                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6]">
                  <div className="h-full rounded-full bg-[#3B7A6B] transition-all" style={{ width: `${p.progressPercent}%` }} />
                </div>

                {p.nextMilestone && (
                  <p className="text-xs text-[#231B16] bg-[#FAF7F2] p-2 rounded-lg border border-[#EAE2D6]">
                    <strong>Próximo Marco: </strong>{p.nextMilestone}
                  </p>
                )}

                {p.notes && <p className="text-xs text-[#6E6259]">{p.notes}</p>}

                <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3]">
                  <button
                    onClick={() => updateProject.mutate({ id: p.id, progressPercent: Math.min(100, p.progressPercent + 10) })}
                    className="cursor-pointer text-xs font-semibold text-[#3B7A6B] hover:underline"
                  >
                    + 10% Conclusão
                  </button>
                  <button
                    onClick={() => deleteProject.mutate(p.id)}
                    className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
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
      {/* 6. VIAGENS */}
      {/* ======================================================== */}
      {subTab === "viagens" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Viagens & Férias</h2>
              <p className="text-xs text-[#6E6259] truncate">Destinos planejados, orçamentos e listas de bagagem.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("viagem")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Nova Viagem
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {trips.map((t) => (
              <div key={t.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif-loma text-base font-bold text-[#231B16]">✈ {t.destination}</h4>
                    <p className="text-xs text-[#6E6259] tabular-nums">
                      {t.startDate} a {t.endDate}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EDF1F5] px-2.5 py-0.5 text-xs font-bold text-[#465768] capitalize">
                    {t.status}
                  </span>
                </div>

                {t.accommodation && (
                  <p className="text-xs text-[#6E6259]">
                    <strong>Hospedagem: </strong>{t.accommodation}
                  </p>
                )}

                {t.checklistItems && (
                  <p className="text-xs text-[#6E6259] bg-[#FAF7F2] p-2 rounded-lg">
                    <strong>Checklist: </strong>{t.checklistItems}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3]">
                  <span className="text-xs font-semibold text-[#231B16] tabular-nums">
                    {formatMoney(t.budgetEstimatedCents)}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={t.status}
                      onChange={(e) => updateTrip.mutate({ id: t.id, status: e.target.value as any })}
                      className="rounded-lg border border-[#D5CCC2] bg-[#FAF7F2] px-2 py-0.5 text-xs text-[#231B16]"
                    >
                      <option value="planejada">Planejada</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="realizada">Realizada</option>
                    </select>
                    <button
                      onClick={() => deleteTrip.mutate(t.id)}
                      className="cursor-pointer text-xs text-[#9B8F85] hover:text-[#C47882]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. DOCUMENTOS */}
      {/* ======================================================== */}
      {subTab === "documentos" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Documentos & Validades</h2>
              <p className="text-xs text-[#6E6259] truncate">Passaportes, CNH, certidões e alertas de renovação.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("documento")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Documento
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#231B16]">{d.title}</span>
                    <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[10px] font-semibold text-[#6E6259]">
                      {d.personName}
                    </span>
                  </div>
                  <p className="text-xs text-[#9B8F85] mt-0.5">
                    {d.documentNumber ? `Nº ${d.documentNumber} • ` : ""}
                    Validade: <strong className="text-[#231B16]">{d.expirationDate || "Indeterminada"}</strong>
                  </p>
                  {d.notes && <p className="text-[11px] text-[#6E6259] mt-1">{d.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {d.renewalAlert === 1 && (
                    <span className="rounded-full bg-[#E9F3F0] px-2 py-0.5 text-[10px] font-semibold text-[#3B7A6B]">
                      Vigente
                    </span>
                  )}
                  <button
                    onClick={() => deleteDocument.mutate(d.id)}
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
      {/* 8. FILMES & SÉRIES */}
      {/* ======================================================== */}
      {subTab === "filmes" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Filmes & Séries</h2>
              <p className="text-xs text-[#6E6259] truncate">Watchlist cultural e momentos de lazer cinematográfico.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("filme_serie")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Novo Título
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {culturalMedia.map((m) => (
              <div key={m.id} className="flex flex-col gap-2 rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif-loma text-base font-bold text-[#231B16]">{m.title}</h4>
                    <p className="text-xs text-[#6E6259]">
                      {m.type.toUpperCase()} • {m.platform}
                    </p>
                  </div>
                  <span className="text-xs text-[#C47882] font-bold">
                    {"★".repeat(m.rating || 5)}
                  </span>
                </div>

                {m.genre && <span className="text-[11px] text-[#9B8F85]">Gênero: {m.genre}</span>}
                {m.recommendedBy && (
                  <span className="text-[11px] text-[#6E6259]">Recomendado por: {m.recommendedBy}</span>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3]">
                  <select
                    value={m.status}
                    onChange={(e) => updateMedia.mutate({ id: m.id, status: e.target.value as any })}
                    className="rounded-lg border border-[#D5CCC2] bg-[#FAF7F2] px-2 py-0.5 text-xs text-[#231B16]"
                  >
                    <option value="assistindo">Assistindo</option>
                    <option value="quero_assistir">Quero Assistir</option>
                    <option value="assistido">Assistido</option>
                  </select>
                  <button
                    onClick={() => deleteMedia.mutate(m.id)}
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
      {/* 9. MÚSICA & MOMENTOS */}
      {/* ======================================================== */}
      {subTab === "musica" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif-loma text-lg sm:text-2xl text-[#231B16] truncate">Música & Playlists</h2>
              <p className="text-xs text-[#6E6259] truncate">Trilhas sonoras para foco, oração, paz e encontros.</p>
            </div>
            <button
              onClick={() => onOpenAddModal("musica")}
              className="shrink-0 cursor-pointer rounded-full bg-[#231B16] px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] shadow-xs hover:bg-[#3D312A] whitespace-nowrap"
            >
              + Nova Faixa
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {musicTracks.map((trk) => (
              <div key={trk.id} className="flex items-center justify-between rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-base font-bold text-[#231B16]">
                    ♫
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#231B16]">{trk.title}</h4>
                    <p className="text-xs text-[#6E6259]">
                      {trk.artistOrCurator} {trk.playlistOrAlbum ? `• ${trk.playlistOrAlbum}` : ""}
                    </p>
                    <span className="inline-block mt-0.5 rounded-full bg-[#F2ECE3] px-2 py-0.2 text-[10px] font-semibold text-[#465768] capitalize">
                      {trk.momentOrMood}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMusicFav.mutate(trk.id)}
                    className={`cursor-pointer text-base ${trk.isFavorite === 1 ? "text-[#C47882]" : "text-[#DDD2C3] hover:text-[#C47882]"}`}
                    title="Favoritar"
                  >
                    ★
                  </button>
                  <button
                    onClick={() => deleteMusic.mutate(trk.id)}
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
    </div>
  );
}
