import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

interface ApoioProps {
  initialTab?: "visao360" | "consultor" | "pessoas" | "personalizar" | "backup" | "logs";
  onClose: () => void;
}

export function ApoioDrawer({ initialTab = "visao360", onClose }: ApoioProps) {
  const [tab, setTab] = useState<"visao360" | "consultor" | "pessoas" | "personalizar" | "backup" | "logs">(initialTab);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Familiar");
  const [isExporting, setIsExporting] = useState(false);

  // Consultor IA
  const [question, setQuestion] = useState("");
  const [consultantResponse, setConsultantResponse] = useState<{
    answer: string;
    evidence: string[];
  } | null>(null);

  const queryClient = useQueryClient();

  const { data: peopleData } = useQuery({
    queryKey: ["people"],
    queryFn: () => api.listPeople({}),
  });

  const { data: logsData } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: () => api.listSystemLogs({ limit: 30 }),
  });

  const { data: intelData } = useQuery({
    queryKey: ["inteligenciaOverview"],
    queryFn: () => api.getInteligenciaOverview({}),
  });

  const askConsultant = useMutation({
    mutationFn: (q: string) => api.askLifeConsultant({ question: q }),
    onSuccess: (data) => {
      setConsultantResponse({
        answer: data.answer,
        evidence: data.evidence,
      });
    },
  });

  const addPerson = useMutation({
    mutationFn: () => api.addPerson({ name: newName, role: newRole }),
    onSuccess: () => {
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });

  const clearDemo = useMutation({
    mutationFn: () => api.clearDemoData({}),
    onSuccess: () => {
      queryClient.invalidateQueries();
      onClose();
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await api.exportAllData({});
      const jsonStr = JSON.stringify(res, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loma-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const people = peopleData?.people ?? [];
  const logs = logsData?.logs ?? [];
  const report = intelData?.lifeReport360;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-[#FAF7F2] p-5 shadow-2xl transition-all">
        {/* Header do Drawer */}
        <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#231B16] text-xs font-bold text-white">
              L
            </div>
            <div>
              <h3 className="font-serif-loma text-lg text-[#231B16]">Apoio & Inteligência</h3>
              <p className="text-[11px] text-[#6E6259]">Visão 360°, Consultor IA e gestão familiar.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2ECE3] text-sm text-[#231B16] hover:bg-[#EAE2D6]"
          >
            ✕
          </button>
        </div>

        {/* Abas internas do Apoio */}
        <div className="mt-4 flex gap-1 overflow-x-auto rounded-full bg-[#F2ECE3] p-1 text-xs">
          {[
            { key: "visao360", label: "Visão 360°" },
            { key: "consultor", label: "Consultor IA" },
            { key: "pessoas", label: "Pessoas" },
            { key: "backup", label: "Backup" },
            { key: "personalizar", label: "Ajustes" },
            { key: "logs", label: "Auditoria" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as any)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition ${
                tab === item.key ? "bg-[#231B16] text-white shadow-xs" : "text-[#6E6259] hover:text-[#231B16]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Conteúdo rolável */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {/* 1. VISÃO 360° */}
          {tab === "visao360" && (
            <div className="flex flex-col gap-4">
              {report ? (
                <>
                  <div className="rounded-3xl bg-[#231B16] p-5 text-white shadow-md">
                    <span className="text-[10px] font-bold tracking-wider text-[#C47882] uppercase">
                      Diagnóstico Transversal 360°
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <h4 className="font-serif-loma text-2xl text-[#FAF7F2]">Harmonia Geral</h4>
                      <span className="text-3xl font-bold text-[#C47882] tabular-nums">
                        {report.harmonyScore}
                        <span className="text-sm font-normal text-white/60">/100</span>
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-white/80 leading-relaxed">{report.summaryText}</p>

                    {/* 4 Pilares da Vida */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                      <div className="rounded-xl bg-white/5 p-2.5">
                        <span className="block text-[10px] text-white/60">Saúde & Bem-estar</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#E9F3F0]">{report.overallHealthScore}%</span>
                          <span className="text-[10px] text-[#3B7A6B]">Ótimo</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/5 p-2.5">
                        <span className="block text-[10px] text-white/60">Finanças & Reserva</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#E9F3F0]">{report.financialHealthScore}%</span>
                          <span className="text-[10px] text-[#3B7A6B]">Sólido</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/5 p-2.5">
                        <span className="block text-[10px] text-white/60">Casa & Família</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#E9F3F0]">{report.homeCareScore}%</span>
                          <span className="text-[10px] text-[#3B7A6B]">Ativo</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/5 p-2.5">
                        <span className="block text-[10px] text-white/60">Crescer & Estudos</span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#E9F3F0]">{report.growthScore}%</span>
                          <span className="text-[10px] text-[#3B7A6B]">Fluindo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prioridades Recomendadas pela IA */}
                  <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-bold text-[#231B16] uppercase tracking-wider">
                      Foco & Atenção Preventiva
                    </h4>
                    <div className="mt-2.5 flex flex-col gap-2">
                      {report.topPriorities.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#231B16]">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F8ECEE] text-[10px] font-bold text-[#B36670]">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pontos Fortes Consolidados */}
                  <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-bold text-[#3B7A6B] uppercase tracking-wider">
                      Pontos Fortes da Família
                    </h4>
                    <div className="mt-2.5 flex flex-col gap-2">
                      {report.positives.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#6E6259]">
                          <span className="text-[#3B7A6B] font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-6 text-center text-xs text-[#9B8F85]">Carregando visão 360°...</p>
              )}
            </div>
          )}

          {/* 2. CONSULTOR LOMA IA */}
          {tab === "consultor" && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C47882]" />
                  <h4 className="font-serif-loma text-base text-[#231B16]">Consultor Transversal de Vida</h4>
                </div>
                <p className="mt-1 text-[#6E6259] leading-relaxed">
                  A IA analisa dados reais de saúde, finanças, casa e crescimento para orientar sem inventar fatos.
                </p>

                {/* Perguntas rápidas sugeridas */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[
                    "Como está o equilíbrio da família este mês?",
                    "Como estão os planos para a viagem?",
                    "Qual a situação da nossa reserva financeira?",
                    "O que precisa da minha atenção hoje?",
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setQuestion(preset);
                        askConsultant.mutate(preset);
                      }}
                      className="cursor-pointer rounded-full border border-[#EAE2D6] bg-[#FAF7F2] px-2.5 py-1 text-[11px] text-[#6E6259] transition hover:bg-[#F2ECE3] hover:text-[#231B16]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Faça uma pergunta sobre sua vida ou família..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && question.trim()) {
                        askConsultant.mutate(question.trim());
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] p-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <button
                    onClick={() => question.trim() && askConsultant.mutate(question.trim())}
                    disabled={!question.trim() || askConsultant.isPending}
                    className="cursor-pointer rounded-xl bg-[#231B16] px-3 py-2 font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                  >
                    {askConsultant.isPending ? "..." : "Perguntar"}
                  </button>
                </div>
              </div>

              {/* Resposta do Consultor */}
              {consultantResponse && (
                <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-2">
                    <span className="font-bold text-[#231B16]">Parecer do Consultor</span>
                    <span className="text-[10px] text-[#3B7A6B] font-medium">Fundamentado no Banco</span>
                  </div>
                  <p className="mt-2.5 text-[#231B16] leading-relaxed">{consultantResponse.answer}</p>

                  {consultantResponse.evidence.length > 0 && (
                    <div className="mt-3 rounded-xl bg-[#FAF7F2] p-2.5 border border-[#EAE2D6]/60">
                      <span className="block text-[10px] font-bold text-[#6E6259] uppercase">
                        Evidências do Sistema:
                      </span>
                      <ul className="mt-1 list-inside list-disc text-[11px] text-[#6E6259] space-y-0.5">
                        {consultantResponse.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. PESSOAS DA CASA */}
          {tab === "pessoas" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#6E6259] uppercase">Membros da Família</span>
                <div className="flex flex-col divide-y divide-[#EAE2D6] rounded-2xl border border-[#EAE2D6] bg-white p-3 shadow-xs">
                  {people.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: p.avatarColor || "#231B16" }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#231B16]">{p.name}</p>
                          <span className="text-[10px] text-[#6E6259]">{p.role}</span>
                        </div>
                      </div>
                      {p.isDemo === 1 && (
                        <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[9px] font-medium text-[#6E6259]">
                          Exemplo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form adicionar pessoa */}
              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <h4 className="text-xs font-bold text-[#231B16]">Adicionar Familiar</h4>
                <div className="mt-2.5 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] p-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Papel (ex: Pai, Mãe, Filho, etc.)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] p-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <button
                    onClick={() => addPerson.mutate()}
                    disabled={!newName.trim() || addPerson.isPending}
                    className="cursor-pointer rounded-xl bg-[#231B16] py-2 text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                  >
                    Salvar Familiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. BACKUP & EXPORTAÇÃO */}
          {tab === "backup" && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <h4 className="font-bold text-[#231B16]">Backup & Soberania de Dados</h4>
                <p className="mt-1 text-[#6E6259] leading-relaxed">
                  Exporte instantaneamente todos os dados do banco SQLite local em formato JSON legível e portátil.
                </p>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="mt-3 w-full cursor-pointer rounded-xl bg-[#231B16] py-2.5 text-xs font-bold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                >
                  {isExporting ? "Gerando Backup..." : "Exportar Backup Completo (JSON)"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <h4 className="font-bold text-[#231B16]">Gestão da Base de Dados</h4>
                <p className="mt-1 text-[#6E6259] leading-relaxed">
                  Remova todos os registros marcados como demonstração para iniciar o uso do Loma com a base limpa.
                </p>
                <button
                  onClick={() => clearDemo.mutate()}
                  disabled={clearDemo.isPending}
                  className="mt-3 w-full cursor-pointer rounded-xl bg-[#F8ECEE] py-2.5 text-xs font-bold text-[#B36670] transition hover:bg-[#C47882] hover:text-white"
                >
                  {clearDemo.isPending ? "Removendo..." : "Limpar todos os dados de demonstração"}
                </button>
              </div>
            </div>
          )}

          {/* 5. PERSONALIZAR / AJUSTES */}
          {tab === "personalizar" && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <h4 className="font-bold text-[#231B16]">Sistema Visual</h4>
                <p className="mt-1 text-[#6E6259]">Identidade Loma Editorial Design com temperatura quente.</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full border border-[#EAE2D6] bg-[#FAF7F2]" title="Creme Base" />
                  <div className="h-6 w-6 rounded-full border border-[#EAE2D6] bg-[#F2ECE3]" title="Areia Suave" />
                  <div className="h-6 w-6 rounded-full bg-[#231B16]" title="Espresso Profundo" />
                  <div className="h-6 w-6 rounded-full bg-[#C47882]" title="Rosa Antigo Principal" />
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAE2D6] bg-white p-4 shadow-xs">
                <h4 className="font-bold text-[#231B16]">Preferências Regionais</h4>
                <div className="mt-2 flex flex-col gap-2 text-[#6E6259]">
                  <div className="flex justify-between border-b border-[#EAE2D6] pb-1.5">
                    <span>Moeda:</span>
                    <strong className="text-[#231B16]">Real Brasileiro (R$)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EAE2D6] pb-1.5">
                    <span>Formato de Data:</span>
                    <strong className="text-[#231B16]">DD/MM/AAAA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipografia:</span>
                    <strong className="text-[#231B16]">DM Serif + Plus Jakarta Sans</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. AUDITORIA / LOGS */}
          {tab === "logs" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#6E6259] uppercase">Trilha de Auditoria</span>
              <div className="flex flex-col divide-y divide-[#EAE2D6] rounded-2xl border border-[#EAE2D6] bg-white p-3 shadow-xs">
                {logs.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#9B8F85]">Nenhum log registrado.</p>
                ) : (
                  logs.map((l) => (
                    <div key={l.id} className="py-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#231B16]">{l.action}</span>
                        <span className="text-[10px] text-[#9B8F85] tabular-nums">
                          {new Date(l.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[#6E6259]">{l.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
