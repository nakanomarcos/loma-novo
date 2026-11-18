import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

interface ApoioProps {
  initialTab?: "visao360" | "consultor" | "pessoas" | "personalizar" | "backup" | "logs";
  onClose: () => void;
}

interface ParsedImportItem {
  id: string;
  module: string;
  title: string;
  details: string;
  date?: string;
  amount?: number;
  category?: string;
  isDuplicate: boolean;
  selected: boolean;
}

export function ApoioDrawer({ initialTab, onClose }: ApoioProps) {
  // Se initialTab foi passado explicitamente (ex: clique no botão da Home), abre direto a tela.
  // Caso contrário, abre o menu em cartões individuais.
  const [currentScreen, setCurrentScreen] = useState<
    "menu" | "visao360" | "consultor" | "pessoas" | "personalizar" | "backup" | "logs"
  >(initialTab ?? "menu");

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Familiar");
  const [isExporting, setIsExporting] = useState(false);
  const [csvModule, setCsvModule] = useState<"todas" | "financas" | "tarefas" | "agenda" | "casa" | "crescer">("todas");

  // Importação e Conferência
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFileName, setImportFileName] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedImportItem[] | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

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

  const { data: homeData } = useQuery({
    queryKey: ["homeDashboard"],
    queryFn: () => api.getHomeDashboard({}),
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

  const importMutation = useMutation({
    mutationFn: (items: Array<{ module: string; title: string; details: string; date?: string; amount?: number; category?: string }>) =>
      api.importVerifiedItems({ items }),
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      setParsedItems(null);
      setImportSuccessMsg(`${res.importedCount} item(ns) importado(s) com sucesso para o banco SQLite!`);
      setTimeout(() => setImportSuccessMsg(null), 5000);
    },
  });

  const people = peopleData?.people ?? [];
  const logs = logsData?.logs ?? [];
  const report = intelData?.lifeReport360;

  // ==========================================
  // EXPORTAÇÕES (JSON, CSV, MD, PDF)
  // ==========================================
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const res = await api.exportAllData({});
      const jsonStr = JSON.stringify(res, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loma-backup-completo-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await api.exportAllData({});
      const tables = res.tables;
      const rows: string[] = ["Data,Modulo,Titulo,Categoria,ValorCentavos,Status,Detalhes"];

      if (csvModule === "todas" || csvModule === "tarefas") {
        (tables.tasks || []).forEach((t: any) => {
          rows.push(`"${t.dueDate || ""}","Tarefas","${t.title.replace(/"/g, '""')}","${t.area || ""}","0","${t.completed ? "Concluída" : "Pendente"}","${t.priority || ""}"`);
        });
      }
      if (csvModule === "todas" || csvModule === "agenda") {
        (tables.events || []).forEach((e: any) => {
          rows.push(`"${e.date || ""}","Agenda","${e.title.replace(/"/g, '""')}","${e.category || ""}","0","${e.status || ""}","${e.time || ""}"`);
        });
      }
      if (csvModule === "todas" || csvModule === "financas") {
        (tables.transactions || []).forEach((tr: any) => {
          rows.push(`"${tr.date || ""}","Finanças","${tr.description.replace(/"/g, '""')}","${tr.category || ""}","${tr.amount || 0}","${tr.status || ""}","${tr.type || ""}"`);
        });
      }
      if (csvModule === "todas" || csvModule === "casa") {
        (tables.maintenances || []).forEach((m: any) => {
          rows.push(`"${m.dueDate || ""}","Casa","${m.title.replace(/"/g, '""')}","${m.room || ""}","${m.costCents || 0}","${m.status || ""}","${m.notes || ""}"`);
        });
      }
      if (csvModule === "todas" || csvModule === "crescer") {
        (tables.books || []).forEach((b: any) => {
          rows.push(`"","Crescer - Livros","${b.title.replace(/"/g, '""')}","${b.genre || ""}","0","${b.status || ""}","${b.author || ""}"`);
        });
      }

      const csvContent = "\uFEFF" + rows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loma-${csvModule}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = async () => {
    setIsExporting(true);
    try {
      const res = await api.exportAllData({});
      const t = res.tables;
      const today = new Date().toISOString().split("T")[0];

      let md = `# Loma — Relatório Consolidado de Vida\n`;
      md += `*Gerado em: ${today} | Sistema de Gestão Doméstica e Pessoal Loma*\n\n`;

      md += `## 1. Seu Dia & Rotina\n\n`;
      md += `### Compromissos da Agenda\n`;
      (t.events || []).forEach((e: any) => {
        md += `- [${e.status === "concluido" ? "x" : " "}] **${e.title}** (${e.date}${e.time ? ` ${e.time}` : ""}) — *${e.category}*\n`;
      });

      md += `\n### Tarefas Prioritárias\n`;
      (t.tasks || []).forEach((task: any) => {
        md += `- [${task.completed ? "x" : " "}] **${task.title}** [${task.priority}] — Área: ${task.area}${task.dueDate ? ` (Prazo: ${task.dueDate})` : ""}\n`;
      });

      md += `\n## 2. Finanças & Patrimônio\n\n`;
      md += `### Transações Recentes\n`;
      (t.transactions || []).forEach((tr: any) => {
        const val = (tr.amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        md += `- **${tr.date}**: ${tr.description} | ${tr.category} | **${val}** (${tr.type})\n`;
      });

      md += `\n## 3. Bem-Estar & Saúde\n\n`;
      (t.health || []).forEach((h: any) => {
        md += `- **${h.title}** (${h.date}) — ${h.doctorOrClinic || "Clínica"} [${h.status}]\n`;
      });

      md += `\n## 4. Casa & Família\n\n`;
      (t.maintenances || []).forEach((m: any) => {
        md += `- **${m.title}** — Cômodo: ${m.room} [Status: ${m.status}]\n`;
      });

      md += `\n## 5. Crescer & Futuro\n\n`;
      (t.books || []).forEach((b: any) => {
        md += `- Livro: *${b.title}* de ${b.author} [${b.status}]\n`;
      });

      const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loma-relatorio-${today}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const res = await api.exportAllData({});
      const t = res.tables;
      const today = new Date().toLocaleDateString("pt-BR");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Permita pop-ups no navegador para gerar a visualização de impressão/PDF.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>Loma — Relatório de Vida (${today})</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif; background: #FAF7F2; color: #2C241E; margin: 0; padding: 20px; line-height: 1.5; }
            h1 { font-family: "DM Serif Display", serif; font-size: 26px; color: #231B16; margin-bottom: 4px; }
            .meta { font-size: 12px; color: #7C6E62; margin-bottom: 24px; border-bottom: 1px solid #EFE5D5; padding-bottom: 12px; }
            h2 { font-family: "DM Serif Display", serif; font-size: 18px; color: #231B16; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #EFE5D5; padding-bottom: 4px; }
            .card { background: #FFFDF8; border: 1px solid #EFE5D5; border-radius: 12px; padding: 10px 14px; margin-bottom: 8px; }
            .card-title { font-size: 14px; font-weight: 600; color: #2C241E; }
            .card-sub { font-size: 12px; color: #7C6E62; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
            th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #EFE5D5; }
            th { background: #F2ECE3; font-weight: 600; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <h1>Loma — Relatório Consolidado de Vida</h1>
          <div class="meta">Exportado em: ${today} | Família Loma | Documento Oficial de Governança Doméstica</div>

          <h2>1. Agenda e Compromissos Recentes</h2>
          <table>
            <thead><tr><th>Data</th><th>Título</th><th>Categoria</th><th>Status</th></tr></thead>
            <tbody>
              ${(t.events || []).slice(0, 10).map((e: any) => `<tr><td>${e.date}</td><td><strong>${e.title}</strong></td><td>${e.category}</td><td>${e.status}</td></tr>`).join("")}
            </tbody>
          </table>

          <h2>2. Tarefas e Prioridades</h2>
          <table>
            <thead><tr><th>Título</th><th>Área</th><th>Prioridade</th><th>Status</th></tr></thead>
            <tbody>
              ${(t.tasks || []).slice(0, 10).map((task: any) => `<tr><td><strong>${task.title}</strong></td><td>${task.area}</td><td>${task.priority}</td><td>${task.completed ? "Concluída" : "Pendente"}</td></tr>`).join("")}
            </tbody>
          </table>

          <h2>3. Finanças & Transações</h2>
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead>
            <tbody>
              ${(t.transactions || []).slice(0, 10).map((tr: any) => `<tr><td>${tr.date}</td><td><strong>${tr.description}</strong></td><td>${tr.category}</td><td>R$ ${(tr.amount / 100).toFixed(2)}</td></tr>`).join("")}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // PARSER DE IMPORTAÇÃO COM CONFERÊNCIA
  // ==========================================
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const text = await file.text();
    const existingTitles = new Set([
      ...(homeData?.tasks || []).map((t) => t.title.toLowerCase().trim()),
      ...(homeData?.upcomingEvents || []).map((ev) => ev.title.toLowerCase().trim()),
      ...people.map((p) => p.name.toLowerCase().trim()),
    ]);

    const parsed: ParsedImportItem[] = [];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "json") {
      try {
        const json = JSON.parse(text);
        if (json.tables) {
          // Backup Loma completo
          (json.tables.tasks || []).forEach((t: any, i: number) => {
            const isDup = existingTitles.has((t.title || "").toLowerCase().trim());
            parsed.push({
              id: `task-${i}`,
              module: "Tarefas",
              title: t.title || "Tarefa",
              details: `Prioridade: ${t.priority || "media"}`,
              date: t.dueDate || undefined,
              category: t.area || "Geral",
              isDuplicate: isDup,
              selected: !isDup,
            });
          });
          (json.tables.events || []).forEach((ev: any, i: number) => {
            const isDup = existingTitles.has((ev.title || "").toLowerCase().trim());
            parsed.push({
              id: `ev-${i}`,
              module: "Agenda",
              title: ev.title || "Evento",
              details: ev.time ? `Horário: ${ev.time}` : "",
              date: ev.date || undefined,
              category: ev.category || "Geral",
              isDuplicate: isDup,
              selected: !isDup,
            });
          });
          (json.tables.transactions || []).forEach((tr: any, i: number) => {
            const isDup = existingTitles.has((tr.description || "").toLowerCase().trim());
            parsed.push({
              id: `tr-${i}`,
              module: "Finanças",
              title: tr.description || "Transação",
              details: tr.type || "despesa",
              date: tr.date || undefined,
              amount: tr.amount ? tr.amount / 100 : undefined,
              category: tr.category || "Outros",
              isDuplicate: isDup,
              selected: !isDup,
            });
          });
        } else if (Array.isArray(json)) {
          json.forEach((item: any, i: number) => {
            const title = item.title || item.nome || item.descricao || "Item Importado";
            const isDup = existingTitles.has(title.toLowerCase().trim());
            parsed.push({
              id: `item-${i}`,
              module: item.module || item.modulo || "Tarefas",
              title,
              details: item.details || item.detalhes || "",
              date: item.date || item.data || undefined,
              amount: item.amount || item.valor || undefined,
              category: item.category || item.categoria || "Geral",
              isDuplicate: isDup,
              selected: !isDup,
            });
          });
        }
      } catch {
        alert("Erro ao ler o arquivo JSON. Certifique-se de que é um JSON válido.");
      }
    } else if (ext === "csv") {
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length > 1) {
        // Ignora cabeçalho
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i];
          if (!currentLine) continue;
          const cols = currentLine.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
          if (cols.length >= 2) {
            const title = cols[2] || cols[1] || cols[0] || "Item sem título";
            const isDup = existingTitles.has(title.toLowerCase().trim());
            parsed.push({
              id: `csv-${i}`,
              module: cols[1] || "Tarefas",
              title,
              date: cols[0] || undefined,
              category: cols[3] || "Geral",
              details: cols[6] || cols[4] || "",
              isDuplicate: isDup,
              selected: !isDup,
            });
          }
        }
      }
    } else {
      // Markdown, PDF extraído ou TXT
      const lines = text.split(/\r?\n/);
      let currentSection = "Tarefas";
      let count = 0;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#")) {
          const heading = trimmed.replace(/^#+\s*/, "");
          if (heading.toLowerCase().includes("finan")) currentSection = "Finanças";
          else if (heading.toLowerCase().includes("agenda") || heading.toLowerCase().includes("compromisso")) currentSection = "Agenda";
          else if (heading.toLowerCase().includes("casa") || heading.toLowerCase().includes("manuten")) currentSection = "Casa";
          else if (heading.toLowerCase().includes("livro") || heading.toLowerCase().includes("crescer")) currentSection = "Crescer";
          else if (heading.toLowerCase().includes("saúde") || heading.toLowerCase().includes("bem-estar")) currentSection = "Saúde";
          else currentSection = "Tarefas";
        } else if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
          const cleanItem = trimmed.replace(/^[-*]\s*(\[[ xX]\]\s*)?/, "").replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim();
          if (cleanItem.length > 2) {
            count++;
            const isDup = existingTitles.has(cleanItem.toLowerCase().trim());
            parsed.push({
              id: `doc-${count}`,
              module: currentSection,
              title: cleanItem,
              details: `Importado de documento (${file.name})`,
              isDuplicate: isDup,
              selected: !isDup,
            });
          }
        }
      }
    }

    if (parsed.length === 0) {
      alert("Nenhum item reconhecido no arquivo selecionado.");
    } else {
      setParsedItems(parsed);
    }
  };

  const handleToggleSelectItem = (id: string) => {
    if (!parsedItems) return;
    setParsedItems(
      parsedItems.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleUpdateItemTitle = (id: string, newTitle: string) => {
    if (!parsedItems) return;
    setParsedItems(
      parsedItems.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleConfirmImport = () => {
    if (!parsedItems) return;
    const selectedItems = parsedItems
      .filter((i) => i.selected)
      .map((i) => ({
        module: i.module,
        title: i.title,
        details: i.details,
        date: i.date,
        amount: i.amount,
        category: i.category,
      }));

    if (selectedItems.length === 0) {
      alert("Selecione ao menos um item para importar.");
      return;
    }

    importMutation.mutate(selectedItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-[#FAF7F2] p-4 sm:p-5 shadow-2xl transition-all overflow-hidden">
        {/* ======================================================== */}
        {/* CABEÇALHO DO MENU / SUB-TELA */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between border-b border-[#EFE5D5] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {currentScreen !== "menu" ? (
              <button
                onClick={() => setCurrentScreen("menu")}
                className="h-10 px-3 rounded-full bg-[#F2ECE3] text-xs font-semibold text-[#2C241E] hover:bg-[#EAE2D6] transition flex items-center gap-1 cursor-pointer"
              >
                <span>←</span> Voltar ao Menu
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#231B16] text-xs font-bold text-white shadow-xs">
                  L
                </div>
                <div>
                  <h3 className="font-serif text-[20px] font-medium text-[#2C241E] leading-tight">Apoio & Mais</h3>
                  <p className="text-[13px] text-[#7C6E62]">Configurações, inteligência e governança.</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F2ECE3] text-sm text-[#231B16] hover:bg-[#EAE2D6] transition shrink-0"
            title="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* Notificação de sucesso de importação */}
        {importSuccessMsg && (
          <div className="my-2 rounded-2xl bg-[#E9F3F0] border border-[#3B7A6B]/20 p-3 text-xs font-semibold text-[#3B7A6B] shrink-0">
            ✓ {importSuccessMsg}
          </div>
        )}

        {/* ======================================================== */}
        {/* CONTEÚDO PRINCIPAL: MENU EM CARTÕES INDIVIDUAIS */}
        {/* ======================================================== */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {currentScreen === "menu" && (
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-bold text-[#7C6E62] uppercase tracking-wider px-1">
                Serviços & Inteligência
              </span>

              {/* 1. Visão 360° */}
              <div
                onClick={() => setCurrentScreen("visao360")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#231B16] text-white text-sm shrink-0">
                    🎯
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Visão 360° & Relatório de Vida</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Diagnóstico nos 4 pilares da vida familiar</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-[#F8ECEE] px-2 py-0.5 text-[11px] font-bold text-[#B36670] tabular-nums">
                    {report?.harmonyScore || 89}/100
                  </span>
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              {/* 2. Consultor Loma IA */}
              <div
                onClick={() => setCurrentScreen("consultor")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C47882] text-white text-sm shrink-0">
                    ✦
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Consultor Loma IA</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Perguntas com evidências reais do banco</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-[#E9F3F0] px-2 py-0.5 text-[11px] font-bold text-[#3B7A6B]">
                    Ativo
                  </span>
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              {/* 3. Pessoas da Casa */}
              <div
                onClick={() => setCurrentScreen("pessoas")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8A6399] text-white text-sm shrink-0">
                    👥
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Pessoas da Casa</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Membros da família e contatos de apoio</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[11px] font-bold text-[#6E6259] tabular-nums">
                    {people.length}
                  </span>
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#7C6E62] uppercase tracking-wider px-1 pt-2">
                Governança & Dados
              </span>

              {/* 4. Dados & Backup */}
              <div
                onClick={() => setCurrentScreen("backup")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B7A6B] text-white text-sm shrink-0">
                    💾
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Dados, Backup & Exportação</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">JSON, CSV, Markdown e PDF com importação conferida</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-[#E9F3F0] px-2 py-0.5 text-[11px] font-bold text-[#3B7A6B]">
                    Soberania
                  </span>
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              {/* 5. Personalizar */}
              <div
                onClick={() => setCurrentScreen("personalizar")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9E6123] text-white text-sm shrink-0">
                    🎨
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Personalizar</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Visual Loma Editorial, moedas e tipografia</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              {/* 6. Log do Sistema */}
              <div
                onClick={() => setCurrentScreen("logs")}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:border-[#DDD2C3] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6E6259] text-white text-sm shrink-0">
                    📋
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#2C241E] truncate">Log do Sistema</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Trilha de auditoria das ações e automações</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-[#F2ECE3] px-2 py-0.5 text-[11px] font-bold text-[#6E6259] tabular-nums">
                    {logs.length}
                  </span>
                  <span className="text-[#A89A8E] text-sm">→</span>
                </div>
              </div>

              {/* 7. Limpar dados demo */}
              <div
                onClick={() => clearDemo.mutate()}
                className="rounded-[24px] bg-[#FFFDF8] border border-[#F8ECEE] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FDF6F7] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8ECEE] text-[#B36670] text-sm shrink-0 font-bold">
                    🧹
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-[#B36670] truncate">Limpar Dados de Exemplo</h4>
                    <p className="text-[13px] text-[#7C6E62] truncate">Apaga registros fictícios e mantém dados reais</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={clearDemo.isPending}
                  className="h-10 px-3 rounded-full bg-[#F8ECEE] text-[#B36670] text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {clearDemo.isPending ? "Limpando..." : "Limpar"}
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TELA: 1. VISÃO 360° */}
          {/* ======================================================== */}
          {currentScreen === "visao360" && (
            <div className="flex flex-col space-y-3">
              {report ? (
                <>
                  <div className="rounded-[24px] bg-[#231B16] p-4 text-white shadow-sm">
                    <span className="text-[11px] font-bold tracking-wider text-[#C47882] uppercase">
                      Diagnóstico Transversal 360°
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <h4 className="font-serif text-[22px] text-[#FAF7F2]">Harmonia Geral</h4>
                      <span className="text-3xl font-bold text-[#C47882] tabular-nums">
                        {report.harmonyScore}
                        <span className="text-sm font-normal text-white/60">/100</span>
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-white/80 leading-relaxed">{report.summaryText}</p>

                    {/* 4 Pilares da Vida */}
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
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
                  <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                    <h4 className="text-[13px] font-bold text-[#2C241E] uppercase tracking-wider mb-2">
                      Foco & Atenção Preventiva
                    </h4>
                    <div className="flex flex-col space-y-2">
                      {report.topPriorities.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2C241E]">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F8ECEE] text-[10px] font-bold text-[#B36670]">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pontos Fortes Consolidados */}
                  <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                    <h4 className="text-[13px] font-bold text-[#3B7A6B] uppercase tracking-wider mb-2">
                      Pontos Fortes da Família
                    </h4>
                    <div className="flex flex-col space-y-2">
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

          {/* ======================================================== */}
          {/* TELA: 2. CONSULTOR LOMA IA */}
          {/* ======================================================== */}
          {currentScreen === "consultor" && (
            <div className="flex flex-col space-y-3">
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C47882]" />
                  <h4 className="font-serif text-[18px] text-[#2C241E]">Consultor Transversal de Vida</h4>
                </div>
                <p className="mt-1 text-[13px] text-[#7C6E62] leading-relaxed">
                  A IA analisa dados reais de saúde, finanças, casa e crescimento para orientar sem inventar fatos.
                </p>

                {/* Perguntas sugeridas */}
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
                      className="cursor-pointer rounded-full border border-[#EFE5D5] bg-[#FAF7F2] px-3 py-1.5 text-[11px] text-[#6E6259] transition hover:bg-[#F2ECE3] hover:text-[#231B16]"
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
                    className="flex-1 rounded-full border border-[#EFE5D5] bg-[#FAF7F2] px-4 py-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <button
                    onClick={() => question.trim() && askConsultant.mutate(question.trim())}
                    disabled={!question.trim() || askConsultant.isPending}
                    className="h-11 px-4 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50 shrink-0"
                  >
                    {askConsultant.isPending ? "..." : "Perguntar"}
                  </button>
                </div>
              </div>

              {/* Resposta do Consultor */}
              {consultantResponse && (
                <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                  <div className="flex items-center justify-between border-b border-[#EFE5D5] pb-2">
                    <span className="font-semibold text-sm text-[#2C241E]">Parecer do Consultor</span>
                    <span className="text-[10px] text-[#3B7A6B] font-semibold">Fundamentado no Banco</span>
                  </div>
                  <p className="mt-2.5 text-xs text-[#2C241E] leading-relaxed">{consultantResponse.answer}</p>

                  {consultantResponse.evidence.length > 0 && (
                    <div className="mt-3 rounded-2xl bg-[#FAF7F2] p-3 border border-[#EFE5D5]">
                      <span className="block text-[10px] font-bold text-[#7C6E62] uppercase">
                        Evidências do Sistema:
                      </span>
                      <ul className="mt-1 list-inside list-disc text-[11px] text-[#6E6259] space-y-1">
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

          {/* ======================================================== */}
          {/* TELA: 3. PESSOAS DA CASA */}
          {/* ======================================================== */}
          {currentScreen === "pessoas" && (
            <div className="flex flex-col space-y-3">
              <span className="text-[11px] font-bold text-[#7C6E62] uppercase tracking-wider px-1">
                Membros da Família ({people.length})
              </span>

              <div className="flex flex-col space-y-2">
                {people.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] shadow-[0_1px_0_rgba(223,213,196,0.5)] py-3 px-4 min-h-[62px] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: p.avatarColor || "#231B16" }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold text-[#2C241E]">{p.name}</h4>
                        <p className="text-[13px] text-[#7C6E62]">{p.role}</p>
                      </div>
                    </div>
                    {p.isDemo === 1 && (
                      <span className="rounded-full bg-[#F2ECE3] px-2.5 py-1 text-[10px] font-semibold text-[#6E6259]">
                        Exemplo
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Form adicionar familiar */}
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)] mt-2">
                <h4 className="text-[14px] font-semibold text-[#2C241E] mb-2.5">Adicionar Familiar</h4>
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-full border border-[#EFE5D5] bg-[#FAF7F2] px-4 py-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Papel (Pai, Mãe, Filho, etc.)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="rounded-full border border-[#EFE5D5] bg-[#FAF7F2] px-4 py-2 text-xs focus:border-[#C47882] focus:outline-hidden"
                  />
                  <button
                    onClick={() => addPerson.mutate()}
                    disabled={!newName.trim() || addPerson.isPending}
                    className="h-11 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                  >
                    Salvar Familiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TELA: 4. DADOS & BACKUP (EXPORTAR E IMPORTAR MULTI-FORMATO) */}
          {/* ======================================================== */}
          {currentScreen === "backup" && (
            <div className="flex flex-col space-y-4">
              {/* SEÇÃO 1: EXPORTAR */}
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                <h4 className="font-serif text-[18px] text-[#2C241E]">Exportação de Dados</h4>
                <p className="mt-1 text-[13px] text-[#7C6E62] leading-relaxed">
                  Gere cópias de segurança em formatos universais para backup, leitura, planilhas ou impressão.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportJSON}
                    disabled={isExporting}
                    className="h-11 px-3 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50 truncate"
                  >
                    💾 JSON (Backup)
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    disabled={isExporting}
                    className="h-11 px-3 cursor-pointer rounded-full bg-[#F2ECE3] text-xs font-semibold text-[#2C241E] transition hover:bg-[#EAE2D6] disabled:opacity-50 truncate"
                  >
                    📄 Markdown (Texto)
                  </button>

                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="h-11 px-3 cursor-pointer rounded-full bg-[#F2ECE3] text-xs font-semibold text-[#2C241E] transition hover:bg-[#EAE2D6] disabled:opacity-50 truncate"
                  >
                    🖨️ PDF (Impressão)
                  </button>

                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="h-11 px-3 cursor-pointer rounded-full bg-[#F2ECE3] text-xs font-semibold text-[#2C241E] transition hover:bg-[#EAE2D6] disabled:opacity-50 truncate"
                  >
                    📊 CSV (Planilha)
                  </button>
                </div>

                {/* Filtro do CSV */}
                <div className="mt-3 pt-3 border-t border-[#EFE5D5] flex items-center justify-between text-xs">
                  <span className="text-[#7C6E62]">Módulo do CSV:</span>
                  <select
                    value={csvModule}
                    onChange={(e) => setCsvModule(e.target.value as any)}
                    className="rounded-full border border-[#EFE5D5] bg-[#FAF7F2] px-3 py-1 text-xs text-[#2C241E] font-medium"
                  >
                    <option value="todas">Todos os Módulos</option>
                    <option value="financas">Finanças</option>
                    <option value="tarefas">Tarefas</option>
                    <option value="agenda">Agenda</option>
                    <option value="casa">Casa</option>
                    <option value="crescer">Crescer</option>
                  </select>
                </div>
              </div>

              {/* SEÇÃO 2: IMPORTAR */}
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                <h4 className="font-serif text-[18px] text-[#2C241E]">Importação de Arquivos</h4>
                <p className="mt-1 text-[13px] text-[#7C6E62] leading-relaxed">
                  Aceita arquivos <strong>JSON, CSV, Markdown (.md) e PDF</strong>. Todo dado passa por tela de conferência prévia com aviso de duplicados antes de gravar.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,.csv,.md,.markdown,.pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full h-12 cursor-pointer rounded-full border-2 border-dashed border-[#DDD2C3] bg-[#FAF7F2] text-xs font-semibold text-[#6E6259] hover:border-[#C47882] hover:text-[#2C241E] transition flex items-center justify-center gap-2"
                >
                  <span>📁</span> Selecionar Arquivo para Importar...
                </button>
              </div>

              {/* TELA DE CONFERÊNCIA COM PRÉVIA EDITÁVEL E AVISO DE DUPLICADOS */}
              {parsedItems && (
                <div className="rounded-[24px] bg-[#FFFDF8] border-2 border-[#C47882] p-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#EFE5D5] pb-2">
                    <div>
                      <h4 className="font-serif text-[18px] text-[#2C241E]">Conferência de Importação</h4>
                      <p className="text-[12px] text-[#7C6E62]">
                        {importFileName} ({parsedItems.length} itens detectados)
                      </p>
                    </div>
                    <button
                      onClick={() => setParsedItems(null)}
                      className="text-xs text-[#9B8F85] hover:text-[#231B16] cursor-pointer"
                    >
                      ✕ Cancelar
                    </button>
                  </div>

                  {/* Avisos de duplicados */}
                  {parsedItems.some((i) => i.isDuplicate) && (
                    <div className="my-2.5 rounded-xl bg-[#FFF4E5] border border-[#9A6700]/20 p-2.5 text-xs text-[#9A6700]">
                      ⚠️ <strong>Atenção:</strong> Itens marcados em amarelo já possuem similaridade com registros existentes no banco e vêm desmarcados por padrão.
                    </div>
                  )}

                  {/* Lista de itens para conferir */}
                  <div className="mt-3 flex flex-col space-y-2 max-h-72 overflow-y-auto pr-1">
                    {parsedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-[18px] border p-3 text-xs transition ${
                          item.isDuplicate
                            ? "border-[#FFE2B8] bg-[#FFFDF8]"
                            : item.selected
                            ? "border-[#3B7A6B]/30 bg-[#F4F9F8]"
                            : "border-[#EFE5D5] bg-[#FAF7F2] opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleSelectItem(item.id)}
                            className="mt-1 h-4 w-4 rounded-sm border-[#DDD2C3] text-[#3B7A6B] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="rounded-md bg-[#231B16] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                                {item.module}
                              </span>
                              {item.isDuplicate && (
                                <span className="rounded-md bg-[#FFF4E5] px-1.5 py-0.5 text-[9px] font-bold text-[#9A6700]">
                                  ⚠️ Possível Duplicado
                                </span>
                              )}
                              {item.date && (
                                <span className="text-[10px] text-[#7C6E62] tabular-nums">
                                  {item.date}
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateItemTitle(item.id, e.target.value)}
                              className="mt-1 w-full rounded-md border border-[#DDD2C3] bg-white px-2 py-1 text-xs font-semibold text-[#2C241E] focus:outline-hidden"
                            />
                            {item.details && (
                              <p className="mt-1 text-[11px] text-[#7C6E62] truncate">{item.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações da conferência */}
                  <div className="mt-3 pt-3 border-t border-[#EFE5D5] flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        setParsedItems(parsedItems.map((i) => ({ ...i, selected: !i.isDuplicate })))
                      }
                      className="text-xs text-[#6E6259] hover:underline cursor-pointer"
                    >
                      Desmarcar Duplicados
                    </button>

                    <button
                      onClick={handleConfirmImport}
                      disabled={importMutation.isPending || !parsedItems.some((i) => i.selected)}
                      className="h-11 px-4 cursor-pointer rounded-full bg-[#231B16] text-xs font-semibold text-white transition hover:bg-[#3A2E27] disabled:opacity-50"
                    >
                      {importMutation.isPending
                        ? "Gravando..."
                        : `Gravar no Banco (${parsedItems.filter((i) => i.selected).length})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TELA: 5. PERSONALIZAR / AJUSTES */}
          {/* ======================================================== */}
          {currentScreen === "personalizar" && (
            <div className="flex flex-col space-y-3">
              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                <h4 className="font-serif text-[18px] text-[#2C241E]">Identidade Visual Loma</h4>
                <p className="mt-1 text-[13px] text-[#7C6E62]">Design System Loma Editorial com temperatura quente e serena.</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full border border-[#EAE2D6] bg-[#FAF7F2]" title="Creme Base (#FAF7F2)" />
                  <div className="h-7 w-7 rounded-full border border-[#EAE2D6] bg-[#F2ECE3]" title="Areia Suave (#F2ECE3)" />
                  <div className="h-7 w-7 rounded-full bg-[#231B16]" title="Espresso Profundo (#231B16)" />
                  <div className="h-7 w-7 rounded-full bg-[#C47882]" title="Rosa Antigo Principal (#C47882)" />
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-4 shadow-[0_1px_0_rgba(223,213,196,0.5)]">
                <h4 className="font-semibold text-sm text-[#2C241E]">Preferências do App</h4>
                <div className="mt-2.5 flex flex-col space-y-2 text-xs text-[#7C6E62]">
                  <div className="flex justify-between border-b border-[#EFE5D5] pb-2">
                    <span>Moeda padrão:</span>
                    <strong className="text-[#2C241E]">Real Brasileiro (R$)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EFE5D5] pb-2">
                    <span>Formato de data:</span>
                    <strong className="text-[#2C241E]">DD/MM/AAAA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipografia:</span>
                    <strong className="text-[#2C241E]">DM Serif Display + Plus Jakarta Sans</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TELA: 6. LOGS / AUDITORIA */}
          {/* ======================================================== */}
          {currentScreen === "logs" && (
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-bold text-[#7C6E62] uppercase tracking-wider px-1">
                Trilha de Auditoria ({logs.length})
              </span>
              <div className="flex flex-col space-y-2">
                {logs.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#9B8F85]">Nenhum evento registrado.</p>
                ) : (
                  logs.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-[24px] bg-[#FFFDF8] border border-[#EFE5D5] p-3 shadow-[0_1px_0_rgba(223,213,196,0.5)] text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#2C241E]">{l.action}</span>
                        <span className="text-[10px] text-[#7C6E62] tabular-nums">
                          {new Date(l.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C6E62] mt-0.5">{l.details}</p>
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
