import { useEffect, useState } from "react";
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ActionMenu,
  AgentCard,
  Badge,
  Breadcrumb,
  Button,
  CheckboxField,
  CollapsibleAgentCard,
  ConfidenceIndicator,
  DataTable,
  DocumentPreview,
  Drawer,
  EmptyState,
  Field,
  FieldSourceBadge,
  Input,
  MenuBar,
  Modal,
  PageHeader,
  Panel,
  PendingIssueCard,
  PlanCard,
  QuotationSummary,
  RadioField,
  RequiredFieldState,
  ReportPreview,
  ReviewPanel,
  RiskBadge,
  SamplingCard,
  SearchAndFilters,
  Select,
  StatCard,
  StatusBadge,
  Stepper,
  SwitchField,
  TabRow,
  TechnicalBadge,
  Textarea,
  Timeline,
  Toast,
  UploadArea,
  UsageMeter,
  ApprovalChecklistItem,
  buttonStyles,
  cn,
} from "./components/ui";
import {
  agents,
  costs,
  customers,
  documents,
  equipments,
  labImports,
  plans,
  preQuotations,
  prhoAnalyses,
  prhoBudgetItems,
  prhoPendingItems,
  prhoReviewAgents,
  quotationItems,
  quotations,
  reportSections,
  reports,
  samplingPlans,
  services,
  usageMetrics,
  users,
} from "./mockData";

const navItems = [
  { label: "Dashboard", path: "/app/dashboard", icon: "dashboard" },
  { label: "Clientes", path: "/app/customers", icon: "customers" },
  { label: "Analisador PRHO", path: "/app/prho", icon: "prho" },
  { label: "Pré-orçamentos", path: "/app/pre-quotations", icon: "clipboard" },
  { label: "Orçamentos", path: "/app/quotations", icon: "document" },
  { label: "Amostragens", path: "/app/sampling", icon: "sampling" },
  { label: "Importar Laudos", path: "/app/lab-imports", icon: "upload" },
  { label: "Relatórios Finais", path: "/app/reports", icon: "report" },
  { label: "Agentes", path: "/app/agents", icon: "molecule" },
  { label: "Serviços", path: "/app/services", icon: "briefcase" },
  { label: "Custos", path: "/app/costs", icon: "coins" },
  { label: "Equipamentos", path: "/app/equipments", icon: "toolbox" },
  { label: "Usuários", path: "/app/users", icon: "users" },
  { label: "Configurações", path: "/app/settings/company", icon: "settings" },
  { label: "Planos e Assinatura", path: "/app/billing/plans", icon: "layers" },
];

const flowSteps = [
  "Criar análise + documentos",
  "Processamento técnico",
  "Revisão técnica",
  "Aprovação",
];

const prhoIntakeModes = [
  {
    id: "system-identifies",
    label: "Sistema identifica os blocos",
  },
  {
    id: "upload-by-block",
    label: "Enviar documentos por bloco",
  },
];

const prhoDocumentLinkModes = [
  "Documento geral",
  "Bloco existente",
  "Novo bloco operacional",
];

const prhoBlockStatusOptions = [
  "Pendente",
  "Em revisão",
  "Aprovado",
  "Aprovado com ressalva",
  "Fora de escopo",
];

const prhoBlockApprovalOptions = [
  "Pendente",
  "Validado",
  "Validado com ressalva",
  "Bloqueado",
];

const prhoAgentLifecycleOptions = [
  "Pendente",
  "Aprovado",
  "Corrigido",
  "Não aplicável",
  "Solicitar complemento",
  "Bloqueado",
];

const prhoReviewFilterOptions = {
  status: ["Todos", "Com pendência", "Sem pendência", "Aprovados", "Bloqueados"],
  type: ["Todos", "Químico", "Físico", "Biológico", "Sem agente"],
};

const prhoPendingTypeLabels = {
  industrial_secret: "Segredo industrial",
  missing_cas: "CAS ausente",
  normative_conflict: "Conflito normativo",
  manual_review_required: "Complemento operacional",
  block_without_agent: "Bloco sem agente",
  missing_context: "Agente sem setor/função/atividade",
  missing_method: "Agente sem norma/método",
};

const prhoProcessingSequence = [
  {
    label: "Lendo documentos",
    description: "Arquivos recebidos, normalizados e preparados para OCR, parse e triagem.",
    tone: "positive",
  },
  {
    label: "Classificando documentos",
    description: "Separação entre FDS/FISPQ, laudos, planilhas APR e anexos de apoio.",
    tone: "positive",
  },
  {
    label: "Extraindo dados da empresa",
    description: "Cliente, unidade, contexto operacional e evidências mínimas de rastreabilidade.",
    tone: "positive",
  },
  {
    label: "Extraindo blocos operacionais",
    description: "Setor/local, GHE, cargo, função e atividade/operação agrupados antes dos agentes.",
    tone: "positive",
  },
  {
    label: "Filtrando escopo de higiene",
    description: "Somente químicos, físicos e biológicos entram na revisão principal do mockup.",
    tone: "positive",
  },
  {
    label: "Identificando agentes por bloco",
    description: "Os agentes passam a nascer dentro do bloco operacional correto.",
    tone: "positive",
  },
  {
    label: "Detectando necessidade de FDS/FISPQ",
    description: "Agentes genéricos e produtos sem ficha técnica são separados para pendência.",
    tone: "current",
  },
  {
    label: "Extraindo CAS e composição",
    description: "CAS, composição, concentração e unidade ficam vinculados ao documento rastreável.",
    tone: "idle",
  },
  {
    label: "Enriquecendo base técnica",
    description: "NR-15, NHO, ACGIH, eSocial, Decreto 3048 e LINACH são consultados.",
    tone: "idle",
  },
  {
    label: "Preparando revisão humana",
    description: "Blocos, agentes, pendências e ações de correção ficam prontos para o técnico.",
    tone: "idle",
  },
];

const prhoLearningModules = [
  {
    id: "module-01",
    title: "Leitura orientada do documento",
    description: "Explica como o sistema reconhece bloco operacional, fonte geradora e contexto mínimo.",
  },
  {
    id: "module-02",
    title: "Matriz AIHA e criticidade",
    description: "Resume severidade, probabilidade, GES e quando a decisão técnica pede quantificação.",
  },
  {
    id: "module-03",
    title: "Rastro normativo",
    description: "Mostra como NR-15, NHO, eSocial, Decreto 3048/99 e LINACH sustentam a linha revisada.",
  },
];

const prhoNhoMethodLibrary = [
  {
    id: "nho-01",
    label: "NHO-01",
    title: "Ruído ocupacional",
    summary: "Critérios de dosimetria, jornada e comparação com NR-15 Anexo 1.",
    appliesTo: ["Ruído contínuo", "Ruído intermitente"],
  },
  {
    id: "nho-06",
    label: "NHO-06",
    title: "Calor ocupacional",
    summary: "IBUTG, atividade metabólica e regime trabalho/descanso para fechamento térmico.",
    appliesTo: ["Calor IBUTG"],
  },
  {
    id: "niosh-1501",
    label: "NIOSH 1501",
    title: "Hidrocarbonetos aromáticos",
    summary: "Método analítico sugerido para solventes aromáticos e frações voláteis.",
    appliesTo: ["Tolueno", "Xileno", "Benzeno"],
  },
];

const prhoConformityGuide = [
  {
    id: "nr15",
    label: "NR-15",
    description: "Confere anexo aplicável, limite e coerência com a atividade descrita.",
  },
  {
    id: "nho",
    label: "NHO / método",
    description: "Valida se o método técnico escolhido sustenta a quantificação ou a dispensa.",
  },
  {
    id: "esocial",
    label: "eSocial / Decreto",
    description: "Mantém cruzamento trabalhista e previdenciário na mesma linha da APR HO.",
  },
  {
    id: "linach",
    label: "LINACH / carcinogenicidade",
    description: "Destaca agentes com potencial carcinogênico ou exigência de cuidado reforçado.",
  },
];

const prhoBlockWorkspaceTabs = [
  { id: "block-info", label: "Informações do bloco" },
  { id: "block-agents", label: "Agentes do bloco" },
];

const prhoReviewBlocksSeed = [
  {
    id: "block-01",
    label: "Bloco 01",
    title: "Cabine de pintura e retoque",
    sectorLocation: "Cabine de pintura 01 / acabamento",
    gheCode: "GHE-07",
    role: "Pintor industrial",
    workerFunction: "Aplicação de primer e tinta PU",
    activityOperation: "Preparar peças, aplicar tinta e limpar pistola no fim do lote.",
    sourceGenerator: "Tintas, thinner, desengraxantes e limpeza final do equipamento.",
    exposureFrequency: "Intermitente",
    exposureTime: "4h por turno",
    operationalObservation:
      "Há uso recorrente de thinner na limpeza da pistola e mistura manual de componentes.",
    documentOrigin: "FISPQ_TOLUENO_ATLAS.pdf, inventario_agentes.xlsx e FDS_SOLVENTE_PREMIUM.docx",
    extractionConfidence: 91,
    blockReviewStatus: "Em revisão",
    approvalStatus: "Pendente",
    linkedDocuments: ["doc-01", "doc-03", "doc-04"],
    pendencyIds: ["pen-02", "pen-03", "pen-06"],
    agents: [
      {
        id: "block-01-agent-01",
        name: "Tolueno",
        agentType: "Químico",
        cas: "108-88-3",
        sourceProduct: "Thinner Atlas Solv",
        concentration: "20",
        unit: "ppm",
        physicalState: "Líquido volátil",
        originSummary: "Detectado na FISPQ vinculada à limpeza de pistola e preparação da tinta.",
        validatedMethod: "NIOSH 1501",
        twa: "20 ppm",
        stel: "Não aplicável",
        ceiling: "Não aplicável",
        nr15Annex: "Anexo 11",
        nr15Limit: "78 ppm",
        nhoReference: "Não aplicável",
        esocialCode: "01.01.001",
        decreeCode: "1.0.19",
        retirementSpecial: "Pendente de validação",
        linachStatus: "Não listado",
        carcinogenicity: "Não aplicável",
        mutagenicity: "Não avaliada",
        targetOrgan: "Sistema nervoso central",
        effects: "Tontura, narcose e irritação de vias aéreas.",
        aihaCategory: "Categoria 2",
        criticality: "Alta",
        suggestedFrequency: "Semestral",
        technicalDecision: "Quantificar",
        reviewStatus: "Aprovado",
        technicalJustification:
          "Há fonte rastreável, contexto operacional válido e cenário compatível com amostragem ocupacional.",
        technicalRecommendation:
          "Manter o agente no pré-orçamento com cadeia de custódia e plano amostral semestral.",
        sourceDocumentId: "doc-01",
        sourceExcerpt: "Limite de exposição ocupacional TWA: 20 ppm. Produto inflamável.",
        confidence: 86,
        pendingIds: [],
      },
      {
        id: "block-01-agent-02",
        name: "Benzeno",
        agentType: "Químico",
        cas: "",
        sourceProduct: "Solvente Premium",
        concentration: "Segredo industrial",
        unit: "%",
        physicalState: "Vapor orgânico",
        originSummary:
          "O produto menciona hidrocarbonetos aromáticos, mas sem composição aberta suficiente.",
        validatedMethod: "",
        twa: "0,5 ppm",
        stel: "2,5 ppm",
        ceiling: "Não aplicável",
        nr15Annex: "Anexo 13-A",
        nr15Limit: "Conforme atividade",
        nhoReference: "Não aplicável",
        esocialCode: "01.01.002",
        decreeCode: "1.0.01",
        retirementSpecial: "Pendente de validação",
        linachStatus: "Grupo 1 / carcinogênico",
        carcinogenicity: "Carcinogênico reconhecido",
        mutagenicity: "Suspeita",
        targetOrgan: "Medula óssea",
        effects: "Efeitos hematológicos e necessidade de justificativa reforçada.",
        aihaCategory: "Categoria 1",
        criticality: "Crítica",
        suggestedFrequency: "Trimestral",
        technicalDecision: "Solicitar informação complementar",
        reviewStatus: "Bloqueado",
        technicalJustification:
          "Segredo industrial e ausência de CAS impedem aprovação automática do agente químico.",
        technicalRecommendation:
          "Solicitar FDS/FISPQ completa, justificar tecnicamente ou remover do escopo até nova evidência.",
        sourceDocumentId: "doc-04",
        sourceExcerpt:
          "Composição protegida por segredo industrial. Hidrocarbonetos aromáticos presentes.",
        confidence: 49,
        pendingIds: ["pen-02", "pen-03"],
      },
    ],
  },
  {
    id: "block-02",
    label: "Bloco 02",
    title: "Corte e serra circular",
    sectorLocation: "Linha de corte / serra principal",
    gheCode: "GHE-03",
    role: "Operador de serra",
    workerFunction: "Corte de perfis metálicos",
    activityOperation: "Alimentar serra, posicionar peças e descarregar material cortado.",
    sourceGenerator: "Serra circular e impacto entre perfis durante o corte.",
    exposureFrequency: "Contínua",
    exposureTime: "6h por turno",
    operationalObservation:
      "Layout mudou desde o último laudo; a jornada atual precisa ser confirmada na revisão.",
    documentOrigin: "laudo_pintura_2024.pdf e inventario_agentes.xlsx",
    extractionConfidence: 78,
    blockReviewStatus: "Em revisão",
    approvalStatus: "Pendente",
    linkedDocuments: ["doc-02", "doc-03"],
    pendencyIds: ["pen-01"],
    agents: [
      {
        id: "block-02-agent-01",
        name: "Ruído contínuo",
        agentType: "Físico",
        cas: "NHO-01",
        sourceProduct: "Não aplicável",
        concentration: "85",
        unit: "dB(A)",
        physicalState: "Onda sonora contínua",
        originSummary: "Laudo histórico indica faixas de 82 a 88 dB(A) na operação de corte.",
        validatedMethod: "NHO-01",
        twa: "Não aplicável",
        stel: "Não aplicável",
        ceiling: "Não aplicável",
        nr15Annex: "Anexo 1",
        nr15Limit: "85 dB(A)",
        nhoReference: "NHO-01",
        esocialCode: "02.01.014",
        decreeCode: "2.0.01",
        retirementSpecial: "Pendente de validação",
        linachStatus: "Não aplicável",
        carcinogenicity: "Não aplicável",
        mutagenicity: "Não aplicável",
        targetOrgan: "Sistema auditivo",
        effects: "Perda auditiva induzida por ruído e fadiga operacional.",
        aihaCategory: "Categoria 2",
        criticality: "Alta",
        suggestedFrequency: "Semestral",
        technicalDecision: "Quantificar",
        reviewStatus: "Corrigido",
        technicalJustification:
          "O agente é válido, mas a amarração normativa e a jornada atual ainda exigem conferência técnica.",
        technicalRecommendation:
          "Atualizar dose/jornada e confirmar o cenário atual antes da liberação da classificação.",
        sourceDocumentId: "doc-02",
        sourceExcerpt: "Ruído contínuo entre 82 e 88 dB(A). Recomenda-se nova campanha.",
        confidence: 73,
        pendingIds: ["pen-01"],
      },
    ],
  },
  {
    id: "block-03",
    label: "Bloco 03",
    title: "Forno principal e retirada de peças",
    sectorLocation: "Área térmica / forno principal",
    gheCode: "GHE-09",
    role: "Operador de forno",
    workerFunction: "Abastecer forno e retirar peças aquecidas",
    activityOperation: "Controlar ciclo térmico, abrir porta e transferir peças para esteira.",
    sourceGenerator: "Carga térmica do forno e radiação no momento de abertura.",
    exposureFrequency: "Intermitente",
    exposureTime: "2h30 por turno",
    operationalObservation:
      "Ainda falta detalhar atividade metabólica e regime de descanso para fechar IBUTG.",
    documentOrigin: "relatorio_termico_forno.pdf",
    extractionConfidence: 74,
    blockReviewStatus: "Em revisão",
    approvalStatus: "Pendente",
    linkedDocuments: ["doc-05"],
    pendencyIds: ["pen-04"],
    agents: [
      {
        id: "block-03-agent-01",
        name: "Calor IBUTG",
        agentType: "Físico",
        cas: "NHO-06",
        sourceProduct: "Não aplicável",
        concentration: "26,8",
        unit: "°C IBUTG",
        physicalState: "Energia térmica",
        originSummary:
          "Leitura do laudo histórico do forno principal com ausência de jornada detalhada.",
        validatedMethod: "NHO-06",
        twa: "Não aplicável",
        stel: "Não aplicável",
        ceiling: "Não aplicável",
        nr15Annex: "Anexo 3",
        nr15Limit: "Depende da atividade metabólica",
        nhoReference: "NHO-06",
        esocialCode: "02.01.016",
        decreeCode: "2.0.07",
        retirementSpecial: "Pendente de validação",
        linachStatus: "Não aplicável",
        carcinogenicity: "Não aplicável",
        mutagenicity: "Não aplicável",
        targetOrgan: "Sistema termorregulador",
        effects: "Sobrecarga térmica e necessidade de definir regime trabalho/descanso.",
        aihaCategory: "Categoria 2",
        criticality: "Alta",
        suggestedFrequency: "Semestral",
        technicalDecision: "Solicitar informação complementar",
        reviewStatus: "Pendente",
        technicalJustification:
          "O método está correto, porém faltam atividade metabólica e descanso para a conclusão normativa.",
        technicalRecommendation:
          "Coletar atividade leve/moderada/pesada, pausa e local de descanso antes da aprovação.",
        sourceDocumentId: "doc-05",
        sourceExcerpt: "IBUTG 26,8. Atividade e pausas não identificadas no corpo do laudo.",
        confidence: 68,
        pendingIds: ["pen-04"],
      },
    ],
  },
  {
    id: "block-04",
    label: "Bloco 04",
    title: "Fracionamento e apoio logístico",
    sectorLocation: "Almoxarifado químico e expedição",
    gheCode: "GHE-11",
    role: "Auxiliar de apoio",
    workerFunction: "Fracionamento e movimentação interna",
    activityOperation: "Separar embalagens, transferir insumos e movimentar pallets internamente.",
    sourceGenerator: "Operação descrita genericamente em planilha interna, sem evidência de agente definido.",
    exposureFrequency: "Eventual",
    exposureTime: "1h por turno",
    operationalObservation:
      "Bloco extraído da planilha, mas ainda sem agente de higiene mapeado nem evidência suficiente.",
    documentOrigin: "inventario_agentes.xlsx",
    extractionConfidence: 59,
    blockReviewStatus: "Pendente",
    approvalStatus: "Bloqueado",
    linkedDocuments: ["doc-03"],
    pendencyIds: ["pen-05"],
    agents: [],
  },
];

const prhoReviewPendenciesSeed = [
  {
    id: "pen-01",
    blockId: "block-02",
    agentId: "block-02-agent-01",
    type: "normative_conflict",
    severity: "Alta",
    title: "Ruído sem amarração normativa completa",
    description:
      "Cruzar NR-15 Anexo 1, NHO-01, Decreto 3048/99 e eSocial antes da classificação final.",
    recommendedAction: "Atualizar jornada, método validado e referência documental antes de validar o bloco.",
    status: "Aberta",
    sourceDocumentId: "doc-02",
  },
  {
    id: "pen-02",
    blockId: "block-01",
    agentId: "block-01-agent-02",
    type: "industrial_secret",
    severity: "Crítica",
    title: "Segredo industrial encontrado",
    description:
      "Composição protegida por segredo industrial. Solicitar complemento do fabricante ou justificar tecnicamente o avanço.",
    recommendedAction: "Não aprovar o bloco enquanto a composição do produto permanecer fechada.",
    status: "Aberta",
    sourceDocumentId: "doc-04",
  },
  {
    id: "pen-03",
    blockId: "block-01",
    agentId: "block-01-agent-02",
    type: "missing_cas",
    severity: "Alta",
    title: "CAS ausente para agente químico",
    description: "Não inventar CAS. Manter a pendência até encontrar fonte válida e rastreável.",
    recommendedAction: "Manter como pendência técnica ou converter o agente em genérico com justificativa explícita.",
    status: "Aberta",
    sourceDocumentId: "doc-04",
  },
  {
    id: "pen-04",
    blockId: "block-03",
    agentId: "block-03-agent-01",
    type: "manual_review_required",
    severity: "Média",
    title: "Calor sem regime de trabalho/descanso",
    description:
      "Registrar atividade leve/moderada/pesada, regime de pausa e local de descanso para a validação térmica.",
    recommendedAction: "Completar o dado operacional antes de aprovar o bloco térmico.",
    status: "Aberta",
    sourceDocumentId: "doc-05",
  },
  {
    id: "pen-05",
    blockId: "block-04",
    agentId: "",
    type: "block_without_agent",
    severity: "Alta",
    title: "Bloco operacional sem agente de higiene mapeado",
    description:
      "O bloco foi extraído da planilha, mas ainda não existe agente químico, físico ou biológico vinculado a ele.",
    recommendedAction: "Adicionar agente manualmente ou marcar o bloco como fora de escopo.",
    status: "Aberta",
    sourceDocumentId: "doc-03",
  },
  {
    id: "pen-06",
    blockId: "block-01",
    agentId: "block-01-agent-02",
    type: "missing_method",
    severity: "Alta",
    title: "Agente sem método validado",
    description:
      "O agente foi identificado apenas de forma parcial e não possui método validado para seguir na recomendação.",
    recommendedAction: "Completar base técnica ou marcar o agente como não aplicável até nova evidência.",
    status: "Aberta",
    sourceDocumentId: "doc-04",
  },
];

const prhoDocumentAssignmentSeed = [
  {
    documentId: "doc-01",
    linkMode: "Bloco existente",
    blockId: "block-01",
    newBlock: null,
  },
  {
    documentId: "doc-02",
    linkMode: "Bloco existente",
    blockId: "block-02",
    newBlock: null,
  },
  {
    documentId: "doc-03",
    linkMode: "Novo bloco operacional",
    blockId: "",
    newBlock: {
      sectorLocation: "Almoxarifado químico e expedição",
      gheCode: "GHE-11",
      workerFunction: "Auxiliar de apoio",
      activityOperation: "Fracionamento e movimentação interna",
    },
  },
  {
    documentId: "doc-04",
    linkMode: "Documento geral",
    blockId: "",
    newBlock: null,
  },
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPrhoReviewBlocksSeed() {
  return deepClone(prhoReviewBlocksSeed);
}

function getPrhoReviewPendenciesSeed() {
  return deepClone(prhoReviewPendenciesSeed);
}

function getPrhoDocumentAssignmentsSeed() {
  return deepClone(prhoDocumentAssignmentSeed);
}

function getDocumentById(documentId) {
  return documents.find((item) => item.id === documentId) || null;
}

function getPendencyTone(severity) {
  if (severity === "Crítica") {
    return "critical";
  }
  if (severity === "Alta") {
    return "review";
  }
  return "status";
}

function flattenPrhoBlockAgents(blocks) {
  return blocks.flatMap((block) =>
    (block.agents || []).map((agent) => ({
      ...agent,
      blockId: block.id,
      blockTitle: block.title,
      sectorLocation: block.sectorLocation,
      gheCode: block.gheCode,
      workerFunction: block.workerFunction,
      activityOperation: block.activityOperation,
    })),
  );
}

function findBlockById(blocks, blockId) {
  return blocks.find((block) => block.id === blockId) || blocks[0] || null;
}

function getPrhoOperationalMetrics(blocks, pendencies = []) {
  const agents = flattenPrhoBlockAgents(blocks);
  const openPendencies = pendencies.filter((item) => item.status !== "Resolvida");
  const criticalPendencies = openPendencies.filter((item) => item.severity === "Crítica");
  const blocksWithoutAgent = blocks.filter((block) => !block.agents?.length).length;
  const agentsWithoutMethod = agents.filter((agent) => !agent.validatedMethod?.trim()).length;
  const agentsWithoutContext = agents.filter(
    (agent) =>
      !agent.sectorLocation?.trim() ||
      !agent.workerFunction?.trim() ||
      !agent.activityOperation?.trim(),
  ).length;
  const approvedBlocks = blocks.filter((block) =>
    ["Aprovado", "Aprovado com ressalva", "Validado", "Validado com ressalva"].includes(
      block.blockReviewStatus || block.approvalStatus,
    ),
  ).length;
  const approvedAgents = agents.filter((agent) =>
    ["Aprovado", "Corrigido", "Não aplicável"].includes(agent.reviewStatus),
  ).length;
  const quantifiableAgents = agents.filter(
    (agent) => agent.technicalDecision === "Quantificar",
  ).length;

  return {
    agents,
    openPendencies,
    criticalPendencies,
    blocksWithoutAgent,
    agentsWithoutMethod,
    agentsWithoutContext,
    approvedBlocks,
    approvedAgents,
    quantifiableAgents,
  };
}

const prhoAnalysisDiagnostics = {
  "prho-2026-041": {
    industrialSecret: true,
    blocksWithoutAgent: 1,
    agentsWithoutMethod: 2,
    agentsWithoutContext: 1,
    activeBlocks: 4,
  },
  "prho-2026-038": {
    industrialSecret: false,
    blocksWithoutAgent: 0,
    agentsWithoutMethod: 1,
    agentsWithoutContext: 0,
    activeBlocks: 3,
  },
  "prho-2026-033": {
    industrialSecret: false,
    blocksWithoutAgent: 0,
    agentsWithoutMethod: 0,
    agentsWithoutContext: 0,
    activeBlocks: 5,
  },
};

const prhoDecisionOptions = [
  "Quantificar",
  "Não quantificar",
  "Avaliação manual necessária",
  "Dados insuficientes",
  "Solicitar informação complementar",
  "Ignorar com justificativa",
];

const prhoClassificationDecisionOptions = [
  "Quantificar",
  "Não quantificar",
  "Solicitar informação complementar",
  "Aprovar com ressalva",
  "Bloquear aprovação",
];

const prhoCategoryOptions = [
  "Categoria 1",
  "Categoria 2",
  "Categoria 3",
  "Categoria 4",
];

const prhoCriticalityOptions = ["Crítica", "Alta", "Média", "Baixa"];
const prhoFrequencyOptions = ["Trimestral", "Semestral", "Anual", "Sob demanda"];
const prhoReviewStatusOptions = ["Pendente", "Corrigido", "Aprovado", "Reprovado"];
const prhoExtendedReviewStatusOptions = [
  "Pendente",
  "Aprovado",
  "Corrigido",
  "Reprovado",
  "Dados insuficientes",
  "Segredo industrial",
  "Aguardando informação externa",
  "Aprovado com ressalva",
  "Não aplicável",
];
const prhoExposureFrequencyOptions = ["Contínua", "Intermitente", "Eventual", "Sob demanda"];
const prhoEsocialOptions = ["Aplicável", "Não aplicável", "Pendente de validação"];
const prhoRetirementOptions = [
  "Pendente de validação",
  "Não aplicável",
  "Elegível",
  "Elegível com ressalva",
];
const prhoCarcinogenicityOptions = [
  "Não aplicável",
  "Não listado",
  "Suspeito",
  "Carcinogênico reconhecido",
];
const prhoMutagenicityOptions = ["Não avaliada", "Não aplicável", "Suspeita", "Confirmada"];
const prhoApplicabilityOptions = ["Aplicável", "Não aplicável", "Pendente de validação"];
const pendingStatusOptions = [
  "Aberta",
  "Em análise",
  "Justificada",
  "Evidência anexada",
  "Aguardando cliente",
  "Aguardando fabricante",
  "Aguardando responsável técnico",
  "Resolvida",
  "Resolvida com ressalva",
  "Cancelada",
  "Bloqueante",
];
const technicalBasesCatalog = [
  {
    id: "tb-01",
    name: "NR-15",
    version: "2026.1",
    effectiveDate: "01 Jan 2026",
    source: "Ministério do Trabalho",
    status: "Ativa",
    updatedAt: "18 Jun 2026 10:30",
    owner: "Reginaldo Melo",
    reference: "nr15_2026.pdf",
  },
  {
    id: "tb-02",
    name: "Anexos NR-15",
    version: "Anexos consolidados",
    effectiveDate: "01 Jan 2026",
    source: "Ministério do Trabalho",
    status: "Ativa",
    updatedAt: "18 Jun 2026 10:32",
    owner: "Reginaldo Melo",
    reference: "nr15_anexos_2026.pdf",
  },
  {
    id: "tb-03",
    name: "NHO",
    version: "Coleção Fundacentro 2025",
    effectiveDate: "15 Dec 2025",
    source: "Fundacentro",
    status: "Ativa",
    updatedAt: "17 Jun 2026 16:05",
    owner: "Vitor Almeida",
    reference: "nho_fundacentro_2025.pdf",
  },
  {
    id: "tb-04",
    name: "ACGIH",
    version: "TLV 2026",
    effectiveDate: "01 Jan 2026",
    source: "ACGIH",
    status: "Ativa",
    updatedAt: "17 Jun 2026 15:20",
    owner: "Davi Vanadio",
    reference: "acgih_tlv_2026.xlsx",
  },
  {
    id: "tb-05",
    name: "NIOSH",
    version: "Pocket Guide 2026",
    effectiveDate: "01 Feb 2026",
    source: "NIOSH",
    status: "Ativa",
    updatedAt: "17 Jun 2026 15:44",
    owner: "Vitor Almeida",
    reference: "niosh_pg_2026.pdf",
  },
  {
    id: "tb-06",
    name: "eSocial Tabela 24",
    version: "S-1.3",
    effectiveDate: "01 Mar 2026",
    source: "eSocial",
    status: "Ativa",
    updatedAt: "16 Jun 2026 11:10",
    owner: "Reginaldo Melo",
    reference: "esocial_tabela_24_v13.csv",
  },
  {
    id: "tb-07",
    name: "Decreto 3048/99",
    version: "Atualização 2026",
    effectiveDate: "20 Jan 2026",
    source: "Previdência",
    status: "Ativa",
    updatedAt: "16 Jun 2026 11:26",
    owner: "Reginaldo Melo",
    reference: "decreto_3048_2026.pdf",
  },
  {
    id: "tb-08",
    name: "LINACH",
    version: "Lista 2026",
    effectiveDate: "05 Jan 2026",
    source: "Fundacentro / LINACH",
    status: "Ativa",
    updatedAt: "16 Jun 2026 14:12",
    owner: "Davi Vanadio",
    reference: "linach_2026.xlsx",
  },
  {
    id: "tb-09",
    name: "Matriz AIHA",
    version: "Matriz PRHO v2",
    effectiveDate: "10 Jun 2026",
    source: "Configuração interna",
    status: "Em revisão",
    updatedAt: "19 Jun 2026 08:20",
    owner: "Reginaldo Melo",
    reference: "matriz_aiha_prho_v2.json",
  },
  {
    id: "tb-10",
    name: "Métodos analíticos",
    version: "Catálogo 2026",
    effectiveDate: "12 Jun 2026",
    source: "Base interna",
    status: "Ativa",
    updatedAt: "19 Jun 2026 07:55",
    owner: "Vitor Almeida",
    reference: "metodos_analiticos_2026.xlsx",
  },
  {
    id: "tb-11",
    name: "Tabela de preços por avaliação",
    version: "Comercial 2026.2",
    effectiveDate: "15 Jun 2026",
    source: "Comercial CHO",
    status: "Em revisão",
    updatedAt: "19 Jun 2026 09:05",
    owner: "Davi Vanadio",
    reference: "tabela_precos_avaliacao_2026.xlsx",
  },
];

const technicalBaseReferenceDetails = {
  "tb-01": {
    summary:
      "Norma-base usada para enquadramento ocupacional, leitura de limites de tolerância e decisão de continuidade técnica na APR HO.",
    points: [
      "Confirma enquadramento por agente e a necessidade de medição quantitativa.",
      "É lida em conjunto com os anexos específicos para ruído, calor, vibração e agentes químicos.",
      "Sustenta o texto técnico final e a validação ocupacional na revisão.",
    ],
  },
  "tb-02": {
    summary:
      "Consolida os anexos operacionais da NR-15 que efetivamente entram na revisão humana de cada linha da análise.",
    points: [
      "Anexos 1 e 2 para ruído.",
      "Anexo 3 para calor (IBUTG).",
      "Anexo 8 para vibração.",
      "Anexos 11, 12 e 13-A para agentes químicos conforme aplicabilidade.",
      "Anexo 14 para avaliação qualitativa de agentes biológicos.",
    ],
  },
  "tb-04": {
    summary:
      "Base internacional de limites ocupacionais usada para comparação complementar e sustentação técnica da decisão humana.",
    points: [
      "Consulta de TWA e STEL quando aplicável.",
      "Ajuda a calibrar criticidade e exposição acima do limite.",
      "Não substitui o enquadramento legal brasileiro, mas reforça a justificativa técnica.",
    ],
  },
  "tb-05": {
    summary:
      "Guia técnico e operacional para métodos de avaliação e referência de agentes ocupacionais.",
    points: [
      "Suporta escolha de método analítico e estratégia de amostragem.",
      "É usado no mockup para sugerir método e leitura complementar da linha.",
      "Serve de apoio quando a base principal é insuficiente ou ambígua.",
    ],
  },
  "tb-06": {
    summary:
      "Tabela usada para cruzamento trabalhista e previdenciário quando a linha precisa de codificação no fluxo final.",
    points: [
      "Valida compatibilidade com tabelas ocupacionais do eSocial.",
      "Apoia preenchimento do código quando exigido.",
      "Fica visível como referência de consistência, não como decisão isolada.",
    ],
  },
  "tb-07": {
    summary:
      "Base previdenciária consultada para verificar repercussão em aposentadoria especial e enquadramentos correlatos.",
    points: [
      "É lida em conjunto com a natureza do agente e exposição consolidada.",
      "Complementa a revisão final com visão previdenciária.",
      "Ajuda a sustentar ressalvas e pontos de atenção na aprovação.",
    ],
  },
  "tb-09": {
    summary:
      "Matriz interna de risco AIHA aplicada na APR HO para relacionar severidade, probabilidade, GES e necessidade de medição.",
    points: [
      "Usa tabela de severidade, probabilidade e matriz de risco.",
      "Conecta GES com necessidade de monitoramento.",
      "Define quando a medição é obrigatória ou pode permanecer qualitativa.",
    ],
  },
  "tb-10": {
    summary:
      "Catálogo de métodos analíticos internos usado para reforçar a escolha de técnica e instrumentação na linha revisada.",
    points: [
      "Relaciona agente, tipo de amostragem e método recomendado.",
      "Dá suporte ao fechamento operacional da revisão.",
      "É complemento prático à leitura NIOSH e às exigências normativas.",
    ],
  },
};

const aihaMatrixSeverityRows = [
  ["Insignificante", "1", "Lesões leves sem necessidade de atenção médica, incômodos ou mal-estar temporário."],
  ["Menor", "2", "Lesões ou doenças sérias, porém reversíveis com tratamento médico."],
  ["Moderada", "3", "Lesões ou doenças críticas irreversíveis que podem limitar a capacidade funcional."],
  ["Maior", "4", "Lesão ou doença grave incapacitante ou que resulte em morte (fatalidade isolada)."],
  ["Catastrófica", "5", "Mortes múltiplas ou incapacidades múltiplas (>10 trabalhadores)."],
];

const aihaMatrixProbabilityRows = [
  ["Quase Impossível", "1", "Exposições < 10% do LEO"],
  ["Raro", "2", "Exposições > 10% LEO e < 50% LEO"],
  ["Improvável", "3", "Exposições > 50% LEO e < 100% LEO"],
  ["Provável", "4", "Exposições > 100% LEO e < 500% LEO"],
  ["Quase Certo", "5", "Exposições > 5x LEO"],
];

const aihaMatrixRiskRows = [
  ["5", "5 (Baixo)", "10 (Médio)", "15 (Alto)", "20 (Crítico)", "25 (Crítico)"],
  ["4", "4 (Baixo)", "8 (Médio)", "12 (Alto)", "16 (Alto)", "20 (Crítico)"],
  ["3", "3 (Baixo)", "6 (Baixo)", "9 (Médio)", "12 (Alto)", "15 (Alto)"],
  ["2", "2 (Trivial)", "4 (Baixo)", "6 (Baixo)", "8 (Médio)", "10 (Médio)"],
  ["1", "1 (Trivial)", "2 (Trivial)", "3 (Baixo)", "4 (Baixo)", "5 (Baixo)"],
];

const aihaMatrixGesRows = [
  ["0", "< 1% LEO", "Nenhuma ação necessária"],
  ["1", "1-10% LEO", "Procedimentos e formação"],
  ["2", "10-50% LEO", "Monitoração periódica"],
  ["3", "50-100% LEO", "Monitoração quantitativa obrigatória"],
  ["4", "> 100% LEO", "Medição obrigatória e controles rigorosos"],
];

const aihaMatrixAgentProfiles = [
  {
    name: "Ruído Contínuo",
    type: "Físico",
    riskLevel: "9 (Médio)",
    nr15: "Anexos 1 e 2",
    decree: "Anexo IV (Agentes Físicos)",
    linach: "Não aplicável",
    carcinogenic: "Não",
    ges: "3 (50-100% LEO)",
    measurement: "SIM",
    method: "Dosimetria pessoal ou medição de nível de pressão sonora",
    monitoring: "Anual ou quando houver mudança de processo",
    notes: "83 dB(A), severidade 3 e probabilidade 3.",
  },
  {
    name: "Benzeno",
    type: "Químico (Carcinogênico)",
    riskLevel: "8 (Médio)",
    nr15: "Anexo 13-A",
    decree: "Anexo II (Agentes Químicos)",
    linach: "Grupo 1 (Cancerígeno confirmado)",
    carcinogenic: "Sim",
    ges: "2 (10-50% LEO)",
    measurement: "SIM",
    method: "Amostragem pessoal com carvão ativado (VRT-MPT)",
    monitoring: "Semestral ou conforme risco",
    notes: "30% do LEO, monitoramento biológico recomendado.",
  },
  {
    name: "Sílica Livre Cristalizada",
    type: "Químico (Poeira Mineral - Carcinogênico)",
    riskLevel: "16 (Alto)",
    nr15: "Anexos 12 e 13",
    decree: "Anexo II (Agentes Químicos)",
    linach: "Grupo 1 (Cancerígeno confirmado)",
    carcinogenic: "Sim",
    ges: "4 (>100% LEO)",
    measurement: "SIM",
    method: "Amostragem pessoal com filtro (fração respirável)",
    monitoring: "Trimestral ou conforme risco",
    notes: "10 mg/m³ = 200% LEO e vigilância médica obrigatória.",
  },
  {
    name: "Calor (IBUTG)",
    type: "Físico",
    riskLevel: "9 (Médio)",
    nr15: "Anexo 3",
    decree: "Anexo IV (Agentes Físicos)",
    linach: "Não aplicável",
    carcinogenic: "Não",
    ges: "2 (10-50% do limite)",
    measurement: "SIM",
    method: "IBUTG (Índice de Bulbo Úmido Termômetro de Globo)",
    monitoring: "Semestral ou quando houver mudança de processo",
    notes: "IBUTG 26°C e leitura varia conforme regime de trabalho/descanso.",
  },
  {
    name: "Vibração de Corpo Inteiro",
    type: "Físico",
    riskLevel: "6 (Baixo)",
    nr15: "Anexo 8",
    decree: "Anexo IV (Agentes Físicos)",
    linach: "Não aplicável",
    carcinogenic: "Não",
    ges: "1 (1-10% do limite)",
    measurement: "SIM",
    method: "Acelerômetro triaxial (eixos X, Y, Z)",
    monitoring: "Anual ou quando houver mudança de equipamento",
    notes: "Aplicável a operadores de máquinas pesadas e motoristas.",
  },
  {
    name: "Vibração de Mãos e Braços",
    type: "Físico",
    riskLevel: "9 (Médio)",
    nr15: "Anexo 8",
    decree: "Anexo IV (Agentes Físicos)",
    linach: "Não aplicável",
    carcinogenic: "Não",
    ges: "3 (50-100% do limite)",
    measurement: "SIM",
    method: "Acelerômetro triaxial acoplado ao equipamento (eixos X, Y, Z)",
    monitoring: "Semestral ou quando houver mudança de ferramentas",
    notes: "Associada a síndrome do dedo branco e neuropatia periférica.",
  },
  {
    name: "Vírus em Ambiente Hospitalar",
    type: "Biológico",
    riskLevel: "9 (Médio)",
    nr15: "Anexo 14",
    decree: "Anexo III (Agentes Biológicos)",
    linach: "Variável",
    carcinogenic: "Depende do vírus",
    ges: "N/A (Avaliação qualitativa)",
    measurement: "NÃO",
    method: "Análise de processos, protocolos de biossegurança e histórico de exposição",
    monitoring: "Contínua (vigilância de processos)",
    notes: "Vacinação e vigilância médica recomendadas; fluxo qualitativo.",
  },
];

const aihaMatrixMeasurementRules = {
  required: [
    "Agente consta em NR-15 com Limite de Tolerância definido nos Anexos 1, 2, 3, 5, 8, 11 e 12.",
    "Agente é cancerígeno em LINACH Grupo 1, exigindo medição mesmo com exposição baixa.",
    "Nível de risco AIHA é Alto ou Crítico (risco ≥ 12).",
    "Categoria GES é 3 ou 4 (exposição ≥ 50% do LEO).",
    "Agente está no Decreto 3048/99 Anexo II ou III para fins de aposentadoria especial.",
    "Há indicação de efeito à saúde já diagnosticado pela vigilância médica.",
  ],
  notRequired: [
    "Agente é avaliado qualitativamente pelo Anexo 14 (Biológicos).",
    "Exposição é < 1% do LEO e classificada como GES 0.",
    "Risco é Trivial ou Baixo (≤ 6) sem indicadores de carcinogenicidade.",
  ],
};

const aihaMatrixReferenceList = [
  "[1] Ministério do Trabalho e Emprego / Fundacentro. Higiene Ocupacional no contexto da revisão das NR 01 e 09. 2020.",
  "[2] ESST Soluções. Matriz de Riscos: AIHA. 2024.",
  "[3] Ministério do Trabalho e Emprego. Norma Regulamentadora No. 15 (NR-15). 2025.",
  "[4] Presidência da República. Decreto nº 3.048, de 6 de maio de 1999.",
  "[5] Instituto de Estudos Previdenciários. Aposentadoria Especial - exposição a agentes cancerígenos (LINACH).",
];

const sampleTabs = [
  { id: "caracterizacao", label: "Caracterização" },
  { id: "memoria", label: "Memória de campo" },
  { id: "resultado", label: "Resultado" },
  { id: "classificacao", label: "Risco" },
  { id: "validacao", label: "Validação" },
];

const sampleTabCopy = {
  caracterizacao:
    "Contexto do posto, jornada, GHE, atividade, fonte geradora e condições operacionais da amostra.",
  memoria:
    "Registro de campo, observações do higienista, intercorrências e pontos de controle durante a coleta.",
  resultado:
    "Resultados laboratoriais e leitura consolidada para uso em orçamento, classificação e relatório final.",
  classificacao:
    "Interpretação de risco com base em critério, criticidade operacional e necessidade de ação corretiva.",
  validacao:
    "Aprovação final do responsável com bloqueios de consistência e trilha de auditoria.",
};

function NavIcon({ name, className = "" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "customers":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M20 8v6" />
          <path d="M23 11h-6" />
        </svg>
      );
    case "prho":
      return (
        <svg {...common}>
          <path d="M5 4h11l3 3v13H5z" />
          <path d="M16 4v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="17" rx="2" />
          <path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5Z" />
          <path d="M9 10h6" />
          <path d="M9 14h6" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5" />
          <path d="M10 13h6" />
          <path d="M10 17h6" />
        </svg>
      );
    case "sampling":
      return (
        <svg {...common}>
          <path d="M9 3v7" />
          <path d="M15 3v7" />
          <path d="M7 10h10" />
          <path d="M8 10v7a4 4 0 0 0 8 0v-7" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M4 20h16" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M6 20h12" />
          <path d="M9 16V8" />
          <path d="M15 16V4" />
          <path d="M12 16v-5" />
        </svg>
      );
    case "molecule":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="12" cy="17" r="3" />
          <path d="M9.5 9.5 10.8 13" />
          <path d="M14.5 9.5 13.2 13" />
          <path d="M10 7h4" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      );
    case "coins":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="6.5" ry="3" />
          <path d="M5.5 6v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" />
          <path d="M5.5 11v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-5" />
        </svg>
      );
    case "toolbox":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="11" rx="2" />
          <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
          <path d="M11 13h2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 1-2 0 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 1 0-2 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 1 2 0 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.23.33.4.7.6 1a1.7 1.7 0 0 1 0 2c-.2.3-.37.67-.6 1Z" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="m12 3 9 4.5-9 4.5-9-4.5Z" />
          <path d="m3 12 9 4.5 9-4.5" />
          <path d="m3 16.5 9 4.5 9-4.5" />
        </svg>
      );
    case "collapse":
      return (
        <svg {...common}>
          <path d="M15 18 9 12l6-6" />
          <path d="M19 18 13 12l6-6" />
        </svg>
      );
    case "expand":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
          <path d="m5 18 6-6-6-6" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="M10 14 19 5" />
          <path d="M19 13v5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1h5" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5" />
          <path d="M12 19.5V22" />
          <path d="m4.93 4.93 1.77 1.77" />
          <path d="m17.3 17.3 1.77 1.77" />
          <path d="M2 12h2.5" />
          <path d="M19.5 12H22" />
          <path d="m4.93 19.07 1.77-1.77" />
          <path d="m17.3 6.7 1.77-1.77" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20.5 14.5A7.5 7.5 0 1 1 9.5 3.5 6.5 6.5 0 0 0 20.5 14.5Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function ThemeModeSwitch({ theme, onChange, compact = false }) {
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={() => onChange(dark ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center rounded-full border border-white/12 bg-white/8 shadow-[var(--shadow-soft)] transition focus:outline-none",
        compact ? "h-10 w-[58px] p-1" : "h-11 w-[154px] p-1",
      )}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={dark ? "Modo escuro ativo" : "Modo claro ativo"}
    >
      <span
        className={cn(
          "absolute top-1 rounded-full bg-white shadow-[0_6px_16px_rgba(16,42,58,0.16)] transition-all duration-200",
          compact ? "left-1 size-8" : "left-1 h-9 w-[69px]",
          dark
            ? compact
              ? "left-[17px]"
              : "left-[81px]"
            : "",
        )}
      />
      <span
        className={cn(
          "relative z-10 grid w-full grid-cols-2 items-center",
          compact ? "gap-0" : "gap-2",
        )}
      >
        <span
          className={cn(
            "grid place-items-center transition",
            compact ? "text-[11px]" : "grid-cols-[auto_auto] gap-1.5 px-3 text-[11px]",
            dark ? "text-white/82" : "text-[#16384a]",
          )}
        >
          <NavIcon name="sun" className={compact ? "size-4" : "size-[15px]"} />
          {compact ? null : <span className="font-semibold">Light</span>}
        </span>
        <span
          className={cn(
            "grid place-items-center transition",
            compact ? "text-[11px]" : "grid-cols-[auto_auto] gap-1.5 px-3 text-[11px]",
            dark ? "text-[#16384a]" : "text-white/82",
          )}
        >
          <NavIcon name="moon" className={compact ? "size-4" : "size-[15px]"} />
          {compact ? null : <span className="font-semibold">Dark</span>}
        </span>
      </span>
    </button>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("cho-theme") || "light";
  });
  const AppRouter = import.meta.env.BASE_URL === "/" ? BrowserRouter : HashRouter;

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("cho-theme", theme);
  }, [theme]);

  return (
    <AppRouter>
      <div
        data-theme={theme}
        className="surface-app min-h-screen text-[var(--color-text-default)] transition-colors duration-300"
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={<AuthPage theme={theme} setTheme={setTheme} mode="login" />}
          />
          <Route
            path="/forgot-password"
            element={<AuthPage theme={theme} setTheme={setTheme} mode="forgot" />}
          />
          <Route
            path="/reset-password"
            element={<AuthPage theme={theme} setTheme={setTheme} mode="reset" />}
          />
          <Route
            path="/app"
            element={<AuthenticatedLayout theme={theme} setTheme={setTheme} />}
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="customers" element={<CustomersListPage />} />
            <Route path="customers/new" element={<CustomerFormPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="prho" element={<PrhoListPage />} />
            <Route path="prho/pending" element={<PrhoPendingPage />} />
            <Route path="prho/new" element={<PrhoNewPage />} />
            <Route path="prho/:id" element={<PrhoSummaryEntryPage />} />
            <Route path="prho/:id/upload" element={<PrhoUploadPage />} />
            <Route path="prho/:id/processing" element={<PrhoProcessingPage />} />
            <Route path="prho/:id/review" element={<PrhoReviewBlocksPage />} />
            <Route
              path="prho/:id/classification"
              element={<PrhoClassificationRedirectPage />}
            />
            <Route path="prho/:id/summary" element={<PrhoSummaryBlocksPage />} />
            <Route path="pre-quotations" element={<PreQuotationListPage />} />
            <Route path="pre-quotations/:id" element={<PreQuotationDetailPage />} />
            <Route path="quotations" element={<QuotationListPage />} />
            <Route path="quotations/new" element={<QuotationEditorPage />} />
            <Route path="quotations/:id" element={<QuotationEditorPage />} />
            <Route path="quotations/:id/edit" element={<QuotationEditorPage />} />
            <Route path="quotations/:id/preview" element={<QuotationPreviewPage />} />
            <Route path="sampling" element={<SamplingListPage />} />
            <Route path="sampling/:quotationId" element={<SamplingQuotationPage />} />
            <Route path="sampling/sample/:sampleId" element={<SamplingSamplePage />} />
            <Route path="lab-imports" element={<LabImportsListPage />} />
            <Route path="lab-imports/new" element={<LabImportNewPage />} />
            <Route path="lab-imports/:id/review" element={<LabImportReviewPage />} />
            <Route path="reports" element={<ReportsListPage />} />
            <Route path="reports/new" element={<ReportNewPage />} />
            <Route path="reports/:id" element={<ReportDetailPage />} />
            <Route path="reports/:id/preview" element={<ReportPreviewPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/new" element={<AgentFormPage />} />
            <Route path="agents/:id/edit" element={<AgentFormPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="costs" element={<CostsPage />} />
            <Route path="equipments" element={<EquipmentsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/new" element={<UserFormPage />} />
            <Route path="users/:id/edit" element={<UserFormPage />} />
            <Route path="settings" element={<Navigate to="/app/settings/company" replace />} />
            <Route path="settings/:section" element={<SettingsPage />} />
            <Route path="billing" element={<Navigate to="/app/billing/plans" replace />} />
            <Route path="billing/:section" element={<BillingPage />} />
          </Route>
        </Routes>
      </div>
    </AppRouter>
  );
}

function AuthPage({ theme, setTheme, mode }) {
  const navigate = useNavigate();
  const configs = {
    login: {
      eyebrow: "Acesso CHO 2.0",
      title: "Entrar no cockpit de higiene ocupacional",
      description:
        "Fluxo assistido para PRHO, orçamento, amostragem, laudos e relatório final.",
      primary: "Entrar",
      action: () => navigate("/app/dashboard"),
      fields: (
        <div className="grid gap-4">
          <Field label="E-mail">
            <Input value="davi@canalho.com.br" />
          </Field>
          <Field label="Senha">
            <Input value="••••••••••••" />
          </Field>
          <div className="flex items-center justify-between gap-3">
            <CheckboxField label="Lembrar acesso" checked onChange={() => {}} />
            <NavLink
              to="/forgot-password"
              className="text-[14px] font-semibold text-[var(--color-brand-blue-700)] no-underline"
            >
              Esqueci minha senha
            </NavLink>
          </div>
        </div>
      ),
    },
    forgot: {
      eyebrow: "Recuperação",
      title: "Enviar instruções de redefinição",
      description:
        "Simulação de fluxo institucional com confirmação por e-mail e rastreabilidade.",
      primary: "Enviar instruções",
      action: () => navigate("/reset-password"),
      fields: (
        <Field label="E-mail corporativo">
          <Input value="reginaldo@canalho.com.br" />
        </Field>
      ),
    },
    reset: {
      eyebrow: "Redefinição",
      title: "Criar nova senha de acesso",
      description:
        "Fluxo simulado de sucesso com retorno para a tela principal de login.",
      primary: "Redefinir senha",
      action: () => navigate("/login"),
      fields: (
        <div className="grid gap-4">
          <Field label="Nova senha">
            <Input value="••••••••••••" />
          </Field>
          <Field label="Confirmar senha">
            <Input value="••••••••••••" />
          </Field>
        </div>
      ),
    },
  };

  const current = configs[mode];

  return (
    <div className="mx-auto grid min-h-screen max-w-[1440px] gap-6 px-4 py-4 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-6">
      <Panel className="grid content-between gap-8 lg:min-h-[calc(100vh-2rem)]">
        <div className="grid gap-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#ff6d00,#ff9348)] text-[15px] font-semibold tracking-[0.08em] text-white shadow-[var(--shadow-elevated)]">
                CHO
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Canal HO Inspired
                </p>
                <h1 className="text-[30px] font-semibold tracking-[-0.05em] text-[var(--color-text-strong)]">
                  CHO 2.0
                </h1>
              </div>
            </div>
            <div className="flex rounded-full border border-[var(--color-border-subtle)] bg-[var(--toggle-bg)] p-1 shadow-[var(--shadow-soft)]">
              {[
                ["light", "Claro"],
                ["dark", "Dark"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[13px] font-semibold transition",
                    theme === value
                      ? "bg-[var(--toggle-active-bg)] text-[var(--toggle-active-text)]"
                      : "text-[var(--color-text-soft)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              {current.eyebrow}
            </p>
            <h2 className="text-[36px] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--color-text-strong)]">
              {current.title}
            </h2>
            <p className="text-[15px] leading-7 text-[var(--color-text-soft)]">
              {current.description}
            </p>
          </div>

          <div className="grid gap-5">
            {current.fields}
            <Button className="w-full" onClick={current.action}>
              {current.primary}
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Direção
            </p>
            <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
              Camada assistiva discreta, revisão humana obrigatória e decisões
              técnicas sempre explícitas.
            </p>
          </div>
          <Toast
            title="Ambiente mockado"
            description="Sem backend real. Tudo nesta etapa usa dados locais para validação visual e de fluxo."
          />
        </div>
      </Panel>

      <Panel className="surface-hero grid gap-6 text-white lg:min-h-[calc(100vh-2rem)] lg:content-between">
        <div className="grid gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">
            Mockup navegável
          </p>
          <h3 className="max-w-3xl text-[34px] font-semibold leading-[1.04] tracking-[-0.05em] text-white">
            PRHO, orçamento, amostragem, importação de laudo e relatório final
            no mesmo cockpit.
          </h3>
          <p className="max-w-2xl text-[16px] leading-8 text-white/86">
            A navegação foi pensada para reduzir retrabalho, deixar a IA como
            apoio e manter a decisão do responsável técnico no centro da
            experiência.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/14 bg-white/8 p-5">
            <span className="text-[42px] font-semibold leading-none">7</span>
            <p className="mt-2 text-[15px] text-white/74">fluxos navegáveis</p>
          </div>
          <div className="rounded-[24px] border border-white/14 bg-white/8 p-5">
            <span className="text-[42px] font-semibold leading-none">30+</span>
            <p className="mt-2 text-[15px] text-white/74">rotas mockadas</p>
          </div>
          <div className="rounded-[24px] border border-white/14 bg-white/8 p-5">
            <span className="text-[42px] font-semibold leading-none">100%</span>
            <p className="mt-2 text-[15px] text-white/74">dados locais</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function AuthenticatedLayout({ theme, setTheme }) {
  const location = useLocation();
  const currentUser = users[0];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("cho-sidebar-collapsed") === "true";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      "cho-sidebar-collapsed",
      sidebarCollapsed ? "true" : "false",
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "grid min-h-screen",
        sidebarCollapsed
          ? "lg:grid-cols-[112px_minmax(0,1fr)]"
          : "lg:grid-cols-[292px_minmax(0,1fr)]",
      )}
    >
      <aside className="px-4 pt-4 lg:px-4 lg:py-4">
        <div
          className={cn(
            "surface-sidebar mx-auto flex max-w-[760px] flex-col gap-5 rounded-[24px] px-5 py-5 text-white shadow-[var(--shadow-elevated)] lg:max-w-none lg:sticky lg:top-4",
            sidebarCollapsed ? "lg:px-3 lg:py-4" : "lg:px-6 lg:py-6",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              sidebarCollapsed ? "lg:flex-col lg:items-center lg:gap-3" : "",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 items-center gap-4",
                sidebarCollapsed ? "lg:flex-col lg:gap-3" : "",
              )}
            >
              <div
                className={cn(
                  "grid shrink-0 place-items-center bg-[linear-gradient(135deg,#ff6d00,#ff9348)] text-[15px] font-semibold tracking-[0.08em] text-white shadow-[var(--shadow-elevated)]",
                  sidebarCollapsed
                    ? "size-16 rounded-[22px] lg:text-[13px]"
                    : "size-14 rounded-[18px]",
                )}
              >
                CHO
              </div>
              <div className={cn("min-w-0", sidebarCollapsed ? "lg:hidden" : "")}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Workspace
                </p>
                <h1 className="text-[24px] font-semibold leading-none tracking-[-0.05em] text-white">
                  Canal HO
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((value) => !value)}
              className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/8 text-white/86 transition hover:bg-white/12 lg:hidden"
              aria-label={mobileSidebarOpen ? "Fechar menu" : "Abrir menu"}
              title={mobileSidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              <NavIcon
                name={mobileSidebarOpen ? "collapse" : "expand"}
                className="size-5"
              />
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className={cn(
                "hidden shrink-0 place-items-center border border-white/12 bg-white/8 text-white/86 transition hover:bg-white/12 lg:grid",
                sidebarCollapsed
                  ? "size-9 rounded-full"
                  : "size-10 rounded-2xl",
              )}
              aria-label={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
              title={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              <NavIcon
                name={sidebarCollapsed ? "expand" : "collapse"}
                className="size-5"
              />
            </button>
          </div>

          <nav className={cn("gap-2", mobileSidebarOpen ? "grid" : "hidden", "lg:grid")}>
            <div
              className={cn(
                "grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-1",
                sidebarCollapsed ? "lg:grid-cols-1 lg:justify-items-center" : "",
              )}
            >
              {navItems.map((item) => {
                const active =
                  location.pathname === item.path ||
                  (item.path !== "/app/dashboard" &&
                    location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={cn(
                      "group flex min-h-[56px] items-center rounded-2xl border py-3 text-[14px] no-underline transition",
                      sidebarCollapsed
                        ? "px-4 lg:size-[56px] lg:min-h-0 lg:justify-center lg:rounded-[18px] lg:px-0 lg:py-0"
                        : "px-4 md:min-h-[64px]",
                      active
                        ? "border-white/12 bg-white/14 text-white"
                        : "border-white/10 bg-white/6 text-white/84 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center text-white/72 transition group-hover:text-white",
                        sidebarCollapsed ? "lg:size-10" : "",
                        active ? "text-white" : "",
                      )}
                    >
                      <NavIcon name={item.icon} className="size-[18px]" />
                    </span>
                    <span
                      className={cn(
                        "truncate pl-3 text-[14px] leading-5 md:text-[13px]",
                        sidebarCollapsed ? "lg:hidden" : "",
                      )}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {sidebarCollapsed ? (
            <div
              className={cn(
                "mt-auto shrink-0 flex-col items-center gap-3",
                mobileSidebarOpen ? "flex" : "hidden",
                "lg:flex",
              )}
            >
              <div className="grid size-14 place-items-center rounded-[20px] border border-white/12 bg-white/12 text-[14px] font-semibold text-white">
                {currentUser.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div className="grid gap-2">
                <span className="grid min-h-10 min-w-10 place-items-center rounded-full bg-white px-3 text-[13px] font-semibold text-[var(--color-brand-foreground)]">
                  WS
                </span>
                <span className="grid min-h-10 min-w-10 place-items-center rounded-full bg-[#d9efff] px-3 text-[13px] font-semibold text-[var(--color-brand-blue-700)]">
                  IA
                </span>
              </div>
              <ThemeModeSwitch
                theme={theme}
                onChange={setTheme}
                compact
              />
            </div>
          ) : (
            <div
              className={cn(
                "mt-2 shrink-0 gap-4 rounded-[24px] border border-white/12 bg-white/8 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-3 lg:mt-auto lg:grid-cols-1 lg:items-start lg:gap-4 lg:p-5",
                mobileSidebarOpen ? "grid" : "hidden",
                "lg:grid",
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#73a9d0] md:col-span-2 lg:col-span-1">
                Responsável logado
              </p>
              <div className="grid gap-1">
                <strong className="text-[16px] font-semibold text-white">
                  {currentUser.name}
                </strong>
                <span className="text-[14px] text-white/70">{currentUser.role}</span>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end lg:justify-start">
                <Badge tone="status">Workspace principal</Badge>
                <Badge tone="processing">IA assistiva ativa</Badge>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <ThemeModeSwitch theme={theme} onChange={setTheme} />
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="mx-auto grid w-full max-w-[1720px] content-start gap-6 px-4 pb-8 pt-4 md:px-6 lg:px-8 xl:py-6">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

function Topbar() {
  const location = useLocation();
  const onCustomersPage = location.pathname === "/app/customers";
  const compactPrhoTopbar = location.pathname.startsWith("/app/prho");

  return (
    <Panel className="grid gap-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="grid gap-2">
          <Breadcrumb items={buildBreadcrumbs(location.pathname)} />
          {!compactPrhoTopbar ? (
            <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
              {resolvePageTitle(location.pathname)}
            </h2>
          ) : null}
        </div>

        {onCustomersPage ? (
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <NavLink
              to="/app/customers/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Novo cliente
            </NavLink>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-center">
            <Input value="Buscar cliente, PRHO, orçamento ou amostra" />
            <NavLink
              to="/app/prho/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Nova análise
            </NavLink>
          </div>
        )}
      </div>
    </Panel>
  );
}

function DashboardPage() {
  const latestAnalysis = prhoAnalyses[0];

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Visão geral"
        title="Operação técnica do dia"
        description="Atalhos para as jornadas críticas, leitura de fila e pontos que exigem validação humana."
        meta={[
          <Badge key="workspace" tone="status">
            Workspace Canal HO
          </Badge>,
          <Badge key="review" tone="review">
            3 revisões prioritárias
          </Badge>,
          <Badge key="billing" tone="quantify">
            Plano Professional
          </Badge>,
        ]}
        actions={[
          <NavLink
            key="prho"
            to="/app/prho/new"
            className={buttonStyles({ variant: "primary" })}
          >
            Nova análise PRHO
          </NavLink>,
          <NavLink
            key="quote"
            to="/app/quotations/new"
            className={buttonStyles({ variant: "secondary" })}
          >
            Novo orçamento
          </NavLink>,
        ]}
      >
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-6">
          <StatCard label="PRHOs em andamento" value="12" hint="4 com revisão pendente" />
          <StatCard label="Aguardando revisão" value="3" hint="2 com prioridade alta" tone="info" />
          <StatCard label="Orçamentos enviados" value="7" hint="3 aguardando retorno" />
          <StatCard label="Orçamentos aprovados" value="4" hint="1 pronto para campo" tone="positive" />
          <StatCard label="Amostragens em campo" value="5" hint="Equipe HO escalada" />
          <StatCard label="Relatórios pendentes" value="2" hint="1 aguardando laudo" tone="critical" />
        </div>
      </PageHeader>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <Panel className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
              Próxima ação recomendada
            </h3>
            <NavLink
              to={`/app/prho/${latestAnalysis.id}/review`}
              className={buttonStyles({ variant: "secondary" })}
            >
              Abrir revisão
            </NavLink>
          </div>
          <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-1">
                <strong className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  {latestAnalysis.code}
                </strong>
                <span className="text-[15px] text-[var(--color-text-default)]">
                  {latestAnalysis.customer}
                </span>
              </div>
              <StatusBadge status={latestAnalysis.status} />
            </div>
            <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
              {latestAnalysis.objective}
            </p>
            <ConfidenceIndicator value={latestAnalysis.confidence} />
          </div>
        </Panel>

        <Drawer
          title="Pendências técnicas"
          description="Itens que impedem avanço sem validação humana explícita."
        >
          <div className="grid gap-3">
            <Toast
              title="Ruído em corte"
              description="Divergência entre jornada atual e laudo histórico. Requer confirmação."
            />
            <Toast
              title="Benzeno em relatório antigo"
              description="Conferir se agente permanece no processo atual antes de gerar orçamento."
            />
          </div>
        </Drawer>
      </div>

      <div className="grid gap-4 2xl:grid-cols-3">
        <DashboardTable />
        <DashboardTable
          title="Últimos orçamentos"
          columns={[
            { key: "number", label: "Número" },
            { key: "customer", label: "Cliente" },
            { key: "status", label: "Status" },
            { key: "total", label: "Valor" },
          ]}
          rows={quotations.slice(0, 3).map((quotation) => ({
            id: quotation.id,
            number: quotation.number,
            customer: quotation.customer,
            status: <StatusBadge status={quotation.status} />,
            total: quotation.total,
          }))}
        />
        <DashboardTable
          title="Amostragens recentes"
          columns={[
            { key: "agent", label: "Agente" },
            { key: "customer", label: "Cliente" },
            { key: "status", label: "Status" },
            { key: "due", label: "Data" },
          ]}
          rows={samplingPlans.map((sample) => ({
            id: sample.id,
            agent: sample.agent,
            customer: sample.customer,
            status: <StatusBadge status={sample.status} />,
            due: sample.dueDate,
          }))}
        />
      </div>
    </div>
  );
}

function UnifiedPagePanel({
  header,
  children,
  bodyClassName = "",
  bodyPadded = true,
}) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="px-6 py-6 lg:px-7">{header}</div>
      <div
        className={cn(
          "border-t border-[var(--color-border-subtle)]",
          bodyPadded ? "p-6 lg:p-7" : "",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </Panel>
  );
}

function EditableInput({
  value,
  onChange,
  className = "",
  rows = 1,
  onBlur,
  placeholder = "",
}) {
  if (rows > 1) {
    return (
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={(event) => onBlur?.(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 py-2 text-[13px] leading-5 text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]",
          className,
        )}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      onBlur={(event) => onBlur?.(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]",
        className,
      )}
    />
  );
}

function EditableSelect({ value, options, onChange, className = "", onBlur }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      onBlur={(event) => onBlur?.(event.target.value)}
      className={cn(
        "min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

const prhoFieldLabels = {
  name: "Agente",
  agentType: "Tipo do agente",
  cas: "CAS",
  reference: "Referência técnica",
  physicalState: "Estado físico / natureza",
  concentration: "Concentração / intensidade",
  unit: "Unidade",
  sector: "Setor",
  workerFunction: "Função",
  ghe: "GHE",
  processActivity: "Processo / atividade",
  exposureFrequency: "Frequência de uso ou exposição",
  exposureTime: "Tempo de exposição",
  suggestedMethod: "Método sugerido",
  validatedMethod: "Método validado",
  nr15Annex: "NR-15 anexo",
  nr15Limit: "NR-15 limite",
  nhoReference: "NHO aplicável",
  acgihTwa: "ACGIH TWA",
  acgihStel: "ACGIH STEL",
  nioshTwa: "NIOSH TWA",
  actionLimit: "Limite de ação",
  limitUnit: "Unidade do limite",
  esocialStatus: "eSocial",
  esocialCode: "Código eSocial / Tabela 24",
  decretoCode: "Decreto 3048/99",
  retirementSpecial: "Aposentadoria especial",
  previdentiaryObservation: "Observação previdenciária",
  linachStatus: "LINACH",
  carcinogenicGroup: "Grupo carcinogênico",
  carcinogenicity: "Carcinogenicidade",
  mutagenicity: "Mutagenicidade",
  carcinogenicJustification: "Justificativa carcinogenicidade",
  targetOrgan: "Órgão alvo",
  aihaCategory: "Categoria AIHA",
  risk: "Criticidade preliminar",
  criticalityBasis: "Base da criticidade",
  frequency: "Frequência sugerida",
  technicalDecision: "Decisão técnica",
  reviewStatus: "Status da revisão",
  technicalJustification: "Justificativa técnica",
  technicalRecommendation: "Recomendação técnica",
  observation: "Observação operacional",
  sourceExcerpt: "Trecho rastreável",
  source: "Fonte da informação",
  manualJustification: "Justificativa da inclusão manual",
  attachmentEvidence: "Anexo comprobatório",
};

function formatAuditDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function getDefaultFieldTrace(row, field) {
  return {
    document: row.source || "Preenchimento manual",
    location: row.sourcePage || "Sem página definida",
    excerpt: row.sourceExcerpt || "Trecho não informado.",
    originalValue: row[field] || "Sem valor capturado",
    extractedValue: row[field] || "Sem valor capturado",
    confidence: row.confidence,
    extractedAt: row.extractedAt || "19/06/2026 08:42",
  };
}

function buildReviewRow(item, overrides = {}) {
  const baseRow = {
    ...item,
    processActivity: item.processActivity || item.sector || "",
    exposureFrequency: item.exposureFrequency || "Intermitente",
    exposureTime: item.exposureTime || "",
    suggestedMethod: item.suggestedMethod || item.method || "",
    validatedMethod: item.validatedMethod || "",
    actionLimit: item.actionLimit || item.nr15Limit || "",
    limitUnit: item.limitUnit || item.unit || "",
    esocialStatus: item.esocialStatus || (item.esocialCode ? "Aplicável" : "Pendente de validação"),
    retirementSpecial: item.retirementSpecial || "Pendente de validação",
    previdentiaryObservation: item.previdentiaryObservation || "",
    carcinogenicGroup: item.carcinogenicGroup || "",
    carcinogenicity:
      item.carcinogenicity ||
      (item.linachStatus?.includes("carcinog") ? "Carcinogênico reconhecido" : "Não aplicável"),
    mutagenicity: item.mutagenicity || "Não avaliada",
    carcinogenicJustification: item.carcinogenicJustification || "",
    criticalityBasis: item.criticalityBasis || item.justification || "",
    technicalJustification: item.technicalJustification || item.justification || "",
    technicalRecommendation: item.technicalRecommendation || item.observation || "",
    manual: item.manual || false,
    manualJustification: item.manualJustification || "",
    attachmentEvidence: item.attachmentEvidence || "",
    extractedAt: item.extractedAt || "19/06/2026 08:42",
  };

  const traceability = Object.fromEntries(
    Object.keys(prhoFieldLabels).map((field) => [
      field,
      getDefaultFieldTrace(baseRow, field),
    ]),
  );

  return {
    ...baseRow,
    traceability,
    ...overrides,
  };
}

function createManualAgentDraft() {
  return {
    stage: "search",
    searchQuery: "",
    searchStatus: "idle",
    searchResults: [],
    searchMessage: "",
    selectedSearchResultId: "",
    prefilledFromSearch: false,
    confidence: 0,
    name: "",
    standardizedName: "",
    agentType: "Químico",
    cas: "",
    synonyms: "",
    concentration: "",
    unit: "",
    physicalState: "",
    sector: "",
    workerFunction: "",
    ghe: "",
    processActivity: "",
    exposureFrequency: "Intermitente",
    environmentNotes: "",
    nr15Applicable: "",
    nr15Annex: "",
    nr15Limit: "",
    acgihTwa: "",
    suggestedMethod: "",
    esocialCode: "",
    decretoCode: "",
    linachStatus: "",
    targetOrgan: "",
    aihaCategory: "",
    technicalDecision: "Avaliação manual necessária",
    technicalRecommendation: "",
    technicalObservation: "",
    inclusionOrigin: "Correção humana",
    confidenceLevel: "Médio",
    source: "Complementação manual do responsável técnico",
    evidenceSource: "Base técnica interna / decisão humana",
    manualJustification: "",
    attachmentEvidence: "",
    industrialSecret: false,
    relatedPendingId: "",
    relatedProduct: "",
    hiddenComponent: "",
  };
}

const prhoWorksheetLegend = [
  "NR-15 / anexos aplicáveis",
  "ACGIH TWA e STEL",
  "NIOSH / método analítico",
  "eSocial Tabela 24",
  "Decreto 3048/99",
  "Matriz AIHA e criticidade",
];

const prhoWorksheetReferenceItems = [
  {
    id: "nr15",
    label: "NR-15 / anexos aplicáveis",
    description: "Consulta de norma base e anexos consolidados usados na leitura ocupacional.",
    baseIds: ["tb-01", "tb-02"],
  },
  {
    id: "acgih",
    label: "ACGIH TWA e STEL",
    description: "Limites ocupacionais internacionais usados para comparação e validação.",
    baseIds: ["tb-04"],
  },
  {
    id: "niosh",
    label: "NIOSH / método analítico",
    description: "Método sugerido e guia técnico de referência para fechamento da linha.",
    baseIds: ["tb-05", "tb-10"],
  },
  {
    id: "esocial",
    label: "eSocial Tabela 24",
    description: "Tabela usada no cruzamento trabalhista mantido dentro da revisão técnica.",
    baseIds: ["tb-06"],
  },
  {
    id: "decreto",
    label: "Decreto 3048/99",
    description: "Base previdenciária consultada em conjunto com o enquadramento técnico.",
    baseIds: ["tb-07"],
  },
  {
    id: "aiha",
    label: "Matriz AIHA e criticidade",
    description: "Matriz interna usada para categoria, criticidade e decisão técnica.",
    baseIds: ["tb-09"],
  },
];

function getWorksheetMissingPoints(row) {
  const issues = [];

  if (!row.name?.trim()) issues.push("Agente");
  if (!(row.cas?.trim() || row.reference?.trim())) issues.push("CAS / referência");
  if (!((row.validatedMethod || row.suggestedMethod)?.trim())) issues.push("Método");
  if (!row.physicalState?.trim()) issues.push("Estado físico");
  if (!row.sector?.trim()) issues.push("Setor");
  if (!row.workerFunction?.trim()) issues.push("Função do trabalhador");
  if (
    !row.nr15Limit?.trim() &&
    !row.acgihTwa?.trim() &&
    !row.acgihStel?.trim() &&
    !row.nioshTwa?.trim()
  ) {
    issues.push("Limites ocupacionais");
  }
  if (!(row.esocialCode?.trim() || row.decretoCode?.trim())) issues.push("eSocial / Decreto");
  if (!row.aihaCategory?.trim()) issues.push("Categoria AIHA");
  if (!row.risk?.trim()) issues.push("Criticidade");
  if (!row.frequency?.trim()) issues.push("Frequência");
  if (!row.technicalDecision?.trim()) issues.push("Decisão técnica");
  if (!(row.observation?.trim() || row.technicalJustification?.trim())) {
    issues.push("Observação / justificativa");
  }

  return issues;
}

function getWorksheetIssueTone(issueCount) {
  if (issueCount >= 4) return "critical";
  if (issueCount > 0) return "review";
  return "positive";
}

function buildPrhoApprovalChecklist(rows, pendings, analysis) {
  const blockingStatuses = new Set(["Pendente", "Reprovado", "Bloqueado"]);

  return [
    {
      id: "all-reviewed",
      label: "Todas as linhas foram tratadas na revisão?",
      detail: "A tela de revisão deve sair sem linhas pendentes ou bloqueadas.",
      status: rows.every((row) => !blockingStatuses.has(row.reviewStatus)) ? "OK" : "Bloqueado",
    },
    {
      id: "required-fields",
      label: "Os campos centrais do Excel estão preenchidos?",
      detail: "Agente, método, contexto operacional, limites, AIHA e decisão técnica precisam existir.",
      status: rows.every((row) => getWorksheetMissingPoints(row).length === 0)
        ? "OK"
        : "Bloqueado",
    },
    {
      id: "critical-pendings",
      label: "Existem pendências críticas em aberto?",
      detail: "Pendências críticas precisam ser resolvidas ou justificadas antes da aprovação.",
      status: pendings.some((item) => item.severity === "Crítica" && item.status !== "Resolvida")
        ? "Bloqueado"
        : "OK",
    },
    {
      id: "industrial-secret",
      label: "Segredo industrial está tratado?",
      detail: "Composição protegida precisa permanecer visível como ressalva técnica quando aplicável.",
      status: pendings.some((item) => item.type === "industrial_secret" && item.status !== "Resolvida")
        ? "Atenção"
        : "OK",
    },
    {
      id: "technical-owner",
      label: "Existe responsável técnico definido?",
      detail: analysis.responsible
        ? `${analysis.responsible} responde pela versão final desta APR HO.`
        : "Defina o responsável técnico antes de aprovar.",
      status: analysis.responsible ? "OK" : "Bloqueado",
    },
  ];
}

const manualAgentSearchCatalog = [
  {
    id: "search-toluene",
    trigger: ["tolueno", "108-88-3"],
    status: "success",
    confidenceLevel: "Alto",
    confidence: 92,
    name: "Tolueno",
    standardizedName: "Tolueno",
    agentType: "Químico",
    cas: "108-88-3",
    synonyms: "Metilbenzeno",
    unit: "ppm",
    physicalState: "Líquido volátil",
    suggestedMethod: "NIOSH 1501",
    nr15Applicable: "Sim",
    nr15Annex: "Anexo 11",
    nr15Limit: "78 ppm",
    acgihTwa: "20 ppm",
    esocialCode: "01.01.001",
    decretoCode: "1.0.19",
    linachStatus: "Não listado",
    targetOrgan: "Sistema nervoso central",
    aihaCategory: "Categoria 2",
    technicalDecision: "Quantificar",
    technicalRecommendation: "Agente conhecido com limite ocupacional e exposição relevante.",
    technicalObservation: "Dados sugeridos a partir da base técnica interna.",
    evidenceSource: "Base técnica interna",
    source: "Base técnica interna / FDS consolidada",
  },
  {
    id: "search-xylene-group",
    trigger: ["xileno", "xylene"],
    status: "multiple",
    confidenceLevel: "Médio",
    options: [
      {
        id: "xileno-mix",
        label: "Xileno — CAS 1330-20-7",
        name: "Xileno",
        standardizedName: "Xileno (mistura de isômeros)",
        agentType: "Químico",
        cas: "1330-20-7",
        synonyms: "Dimetilbenzeno",
        unit: "ppm",
        physicalState: "Líquido volátil",
        suggestedMethod: "NIOSH 1501",
        nr15Applicable: "Sim",
        nr15Annex: "Anexo 11",
        nr15Limit: "78 ppm",
        acgihTwa: "100 ppm",
        esocialCode: "01.01.004",
        decretoCode: "1.0.19",
        linachStatus: "Não listado",
        targetOrgan: "Sistema nervoso central",
        aihaCategory: "Categoria 2",
        technicalDecision: "Quantificar",
        technicalRecommendation: "Selecionar isômero correto conforme FDS do cliente.",
        technicalObservation: "Resultado sugerido com ambiguidade entre isômeros.",
        evidenceSource: "Base técnica interna",
        source: "Base técnica interna / referências consolidadas",
      },
      {
        id: "o-xileno",
        label: "o-Xileno — CAS 95-47-6",
        name: "o-Xileno",
        standardizedName: "o-Xileno",
        agentType: "Químico",
        cas: "95-47-6",
        synonyms: "1,2-dimetilbenzeno",
        unit: "ppm",
        physicalState: "Líquido volátil",
        suggestedMethod: "NIOSH 1501",
        nr15Applicable: "Sim",
        nr15Annex: "Anexo 11",
        nr15Limit: "78 ppm",
        acgihTwa: "100 ppm",
        esocialCode: "01.01.004",
        decretoCode: "1.0.19",
        linachStatus: "Não listado",
        targetOrgan: "Sistema nervoso central",
        aihaCategory: "Categoria 2",
        technicalDecision: "Quantificar",
        technicalRecommendation: "Usar quando a fonte indicar isômero específico.",
        technicalObservation: "Resultado específico de isômero.",
        evidenceSource: "Base técnica interna",
        source: "Base técnica interna / referências consolidadas",
      },
      {
        id: "m-xileno",
        label: "m-Xileno — CAS 108-38-3",
        name: "m-Xileno",
        standardizedName: "m-Xileno",
        agentType: "Químico",
        cas: "108-38-3",
        synonyms: "1,3-dimetilbenzeno",
        unit: "ppm",
        physicalState: "Líquido volátil",
        suggestedMethod: "NIOSH 1501",
        nr15Applicable: "Sim",
        nr15Annex: "Anexo 11",
        nr15Limit: "78 ppm",
        acgihTwa: "100 ppm",
        esocialCode: "01.01.004",
        decretoCode: "1.0.19",
        linachStatus: "Não listado",
        targetOrgan: "Sistema nervoso central",
        aihaCategory: "Categoria 2",
        technicalDecision: "Quantificar",
        technicalRecommendation: "Usar quando a fonte indicar isômero específico.",
        technicalObservation: "Resultado específico de isômero.",
        evidenceSource: "Base técnica interna",
        source: "Base técnica interna / referências consolidadas",
      },
      {
        id: "p-xileno",
        label: "p-Xileno — CAS 106-42-3",
        name: "p-Xileno",
        standardizedName: "p-Xileno",
        agentType: "Químico",
        cas: "106-42-3",
        synonyms: "1,4-dimetilbenzeno",
        unit: "ppm",
        physicalState: "Líquido volátil",
        suggestedMethod: "NIOSH 1501",
        nr15Applicable: "Sim",
        nr15Annex: "Anexo 11",
        nr15Limit: "78 ppm",
        acgihTwa: "100 ppm",
        esocialCode: "01.01.004",
        decretoCode: "1.0.19",
        linachStatus: "Não listado",
        targetOrgan: "Sistema nervoso central",
        aihaCategory: "Categoria 2",
        technicalDecision: "Quantificar",
        technicalRecommendation: "Usar quando a fonte indicar isômero específico.",
        technicalObservation: "Resultado específico de isômero.",
        evidenceSource: "Base técnica interna",
        source: "Base técnica interna / referências consolidadas",
      },
    ],
  },
  {
    id: "search-benzene",
    trigger: ["benzeno", "71-43-2"],
    status: "partial",
    confidenceLevel: "Baixo",
    confidence: 58,
    name: "Benzeno",
    standardizedName: "Benzeno",
    agentType: "Químico",
    cas: "71-43-2",
    unit: "ppm",
    physicalState: "Vapor orgânico",
    suggestedMethod: "Método sugerido pela IA",
    nr15Applicable: "Sim",
    nr15Annex: "Anexo 13-A",
    nr15Limit: "Conforme atividade",
    acgihTwa: "0,5 ppm",
    esocialCode: "01.01.002",
    decretoCode: "1.0.01",
    linachStatus: "Grupo 1 / carcinogênico",
    targetOrgan: "Medula óssea",
    aihaCategory: "Categoria 1",
    technicalDecision: "Solicitar informação complementar",
    technicalRecommendation: "Encontramos dados parciais; revisar antes de salvar.",
    technicalObservation: "Busca parcial por segredo industrial e ausência de composição fechada.",
    evidenceSource: "Base técnica interna / resultado parcial",
    source: "Base técnica interna / referências normativas",
  },
  {
    id: "search-noise",
    trigger: ["ruído contínuo", "nho-01", "ruido continuo"],
    status: "success",
    confidenceLevel: "Alto",
    confidence: 89,
    name: "Ruído contínuo",
    standardizedName: "Ruído ocupacional contínuo ou intermitente",
    agentType: "Físico",
    cas: "NHO-01",
    unit: "dB(A)",
    physicalState: "Onda sonora contínua",
    suggestedMethod: "NHO-01",
    nr15Applicable: "Sim",
    nr15Annex: "Anexo 1",
    nr15Limit: "85 dB(A)",
    acgihTwa: "Não aplicável",
    esocialCode: "02.01.014",
    decretoCode: "2.0.01",
    linachStatus: "Não aplicável",
    targetOrgan: "Sistema auditivo",
    aihaCategory: "Categoria 2",
    technicalDecision: "Quantificar",
    technicalRecommendation: "Avaliação dosimétrica recomendada para confirmar dose.",
    technicalObservation: "Agente físico conhecido com referência consolidada.",
    evidenceSource: "Base técnica interna / NHO-01",
    source: "Base técnica interna / NHO-01",
  },
  {
    id: "search-heat",
    trigger: ["calor ibutg", "nho-06", "calor"],
    status: "success",
    confidenceLevel: "Médio",
    confidence: 81,
    name: "Calor IBUTG",
    standardizedName: "Calor ocupacional por IBUTG",
    agentType: "Físico",
    cas: "NHO-06",
    unit: "°C IBUTG",
    physicalState: "Energia térmica",
    suggestedMethod: "NHO-06",
    nr15Applicable: "Sim",
    nr15Annex: "Anexo 3",
    nr15Limit: "Depende de atividade metabólica",
    acgihTwa: "Não aplicável",
    esocialCode: "02.01.016",
    decretoCode: "2.0.07",
    linachStatus: "Não aplicável",
    targetOrgan: "Sistema termorregulador",
    aihaCategory: "Categoria 2",
    technicalDecision: "Solicitar informação complementar",
    technicalRecommendation: "Validar atividade, pausa e local de descanso antes de classificar.",
    technicalObservation: "Método identificado; contexto ocupacional ainda depende da planta.",
    evidenceSource: "Base técnica interna / NHO-06",
    source: "Base técnica interna / NHO-06",
  },
];

function normalizeSearchValue(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function findManualAgentSearchMatch(query) {
  const normalized = normalizeSearchValue(query);
  if (!normalized) {
    return null;
  }

  return manualAgentSearchCatalog.find((entry) =>
    entry.trigger.some((trigger) => normalized.includes(normalizeSearchValue(trigger))),
  );
}

function getPendingRecommendedAction(type) {
  const actionMap = {
    normative_conflict: "Cruzar base normativa antes da classificação.",
    industrial_secret: "Solicitar complemento do fabricante e justificar avanço.",
    missing_cas: "Localizar CAS válido em fonte rastreável ou manter pendência.",
    manual_review_required: "Completar dado operacional obrigatório antes da aprovação.",
  };

  return actionMap[type] || "Revisar tecnicamente antes de seguir.";
}

function getPendingSourceDocument(agentId) {
  const row = prhoReviewAgents.find((item) => item.id === agentId);
  const sourceDocument = documents.find((file) => file.id === row?.sourceDocumentId);
  return {
    relatedTo: row?.name || "Agente",
    sourceDocument: sourceDocument?.name || row?.source || "Documento rastreado",
  };
}

function TraceabilityButton({ active = false, onClick, sourceType = "IA", confidence = 0 }) {
  return (
    <FieldSourceBadge
      sourceType={active ? "Editado" : sourceType}
      confidence={confidence}
      onOpenSource={onClick}
    />
  );
}

function ReviewField({
  label,
  children,
  helper,
  full = false,
  traceActive = false,
  onTraceToggle,
  sourceType = "IA",
  confidence,
  validationState,
}) {
  return (
    <Field
      full={full}
      helper={helper}
      label={
        <span className="flex items-center justify-between gap-2">
          <span>{label}</span>
          <span className="flex items-center gap-2">
            {validationState ? <RequiredFieldState {...validationState} /> : null}
            {onTraceToggle ? (
              <TraceabilityButton
                active={traceActive}
                onClick={onTraceToggle}
                sourceType={sourceType}
                confidence={confidence}
              />
            ) : null}
          </span>
        </span>
      }
    >
      {children}
    </Field>
  );
}

function PrhoFileCard({ file, selected = false, onSelect, mode = "detailed" }) {
  const compact = mode === "upload";
  const metadata = [
    file.type,
    file.pages ? `${file.pages} páginas` : null,
    file.sheets ? `${file.sheets} abas` : null,
    file.detectedType || "Documento não classificado",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid gap-3 rounded-[22px] border p-4 text-left transition",
        selected
          ? "border-[#b9d8eb] bg-[var(--tab-active-bg)]"
          : "border-[var(--color-border-subtle)] bg-[var(--surface-muted)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
            {file.name}
          </strong>
          <span className="text-[12px] text-[var(--color-text-soft)]">
            {compact ? metadata : `${file.extension} • ${file.detectedType}`}
          </span>
        </div>
        {!compact ? <StatusBadge status={file.status} /> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {!compact ? <TechnicalBadge label={file.kind} /> : null}
        {file.pages ? <TechnicalBadge label={`${file.pages} páginas`} tone="review" /> : null}
        {file.sheets ? <TechnicalBadge label={`${file.sheets} abas`} tone="review" /> : null}
      </div>
      {!compact ? (
        <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">{file.note}</p>
      ) : null}
      {!compact && file.alert ? (
        <div className="rounded-[18px] border border-[#f3c4c4] bg-[var(--color-critical-100)] px-3 py-2 text-[12px] font-medium text-[var(--color-critical-700)]">
          {file.alert}
        </div>
      ) : null}
      {!compact ? <ConfidenceIndicator value={file.confidence} /> : null}
      <div className="flex flex-wrap gap-2">
        <span className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[12px]" })}>
          Visualizar
        </span>
        <span className={buttonStyles({ variant: "ghost", className: "min-h-9 px-3 text-[12px]" })}>
          Alterar tipo
        </span>
        {!compact ? (
          <span className={buttonStyles({ variant: "ghost", className: "min-h-9 px-3 text-[12px]" })}>
            Reprocessar
          </span>
        ) : null}
        <span className={buttonStyles({ variant: "destructive", className: "min-h-9 px-3 text-[12px]" })}>
          Remover
        </span>
      </div>
    </button>
  );
}

function buildBudgetRowsFromAgents(reviewRows) {
  const allowedStatuses = new Set(["Aprovado", "Corrigido", "Aprovado com ressalva"]);
  const reviewRowsById = new Map(reviewRows.map((item) => [item.id, item]));

  return prhoBudgetItems
    .filter((item) => {
      const sourceRow = reviewRowsById.get(item.agentId);
      return (
        sourceRow &&
        sourceRow.technicalDecision === "Quantificar" &&
        allowedStatuses.has(sourceRow.reviewStatus)
      );
    })
    .map((item) => {
      const sourceRow = reviewRowsById.get(item.agentId);
      return {
        ...item,
        description: `Amostragem de ${sourceRow.name} - setor ${sourceRow.sector || item.sector}`,
        agentName: sourceRow.name,
        sector: sourceRow.sector || item.sector,
        role: sourceRow.workerFunction || item.role,
        ghe: sourceRow.ghe || item.ghe,
        method: sourceRow.validatedMethod || sourceRow.suggestedMethod || item.method,
        frequency: sourceRow.frequency || item.frequency,
        risk: sourceRow.risk,
        recommendationReason:
          sourceRow.technicalJustification || sourceRow.criticalityBasis || item.observation,
        reviewStatus: sourceRow.reviewStatus,
      };
    });
}

const prhoStageLabels = {
  approval_pending: "Aprovação",
  classification_pending: "Classificação",
  budget_generated: "Pré-orçamento",
};

function getAnalysisContinuePath(analysis) {
  const pathMap = {
    approval_pending: `/app/prho/${analysis.id}/summary`,
    classification_pending: `/app/prho/${analysis.id}/classification`,
    budget_generated: "/app/pre-quotations/pre-041",
  };

  return pathMap[analysis.statusCode] || `/app/prho/${analysis.id}/review`;
}

function formatPendingSummary(analysis) {
  if (!analysis.pendingItems) {
    return {
      primary: "Sem pendências",
      secondary: "",
    };
  }

  return {
    primary: `${analysis.pendingItems} abertas`,
    secondary: `${analysis.criticalPendingItems} ${analysis.criticalPendingItems === 1 ? "crítica" : "críticas"}`,
  };
}

function getReviewFieldState(row, field) {
  const value = row?.[field];
  const missing = value === undefined || value === null || String(value).trim() === "";
  const blockedFields = new Set([
    "name",
    "agentType",
    "cas",
    "sector",
    "workerFunction",
    "validatedMethod",
    "technicalDecision",
    "technicalJustification",
    "reviewStatus",
  ]);

  if (row?.manual) {
    return { status: "edited", message: "Editado" };
  }

  if (missing && blockedFields.has(field)) {
    return { status: "blocked", message: "Bloqueia aprovação" };
  }

  if (missing) {
    return { status: "attention", message: "Atenção" };
  }

  return null;
}

const reviewCriticalFields = new Set([
  "cas",
  "reference",
  "nr15Applicable",
  "nr15Annex",
  "nr15Limit",
  "esocialStatus",
  "esocialCode",
  "decretoCode",
  "linachStatus",
  "carcinogenicity",
  "suggestedMethod",
  "technicalDecision",
  "aihaCategory",
  "risk",
]);

const reviewReprovalReasons = [
  "Agente identificado incorretamente",
  "Agente duplicado",
  "Agente não aplicável ao processo",
  "Documento sem evidência suficiente",
  "Baixa confiança da extração",
  "Informação fora do escopo da análise",
  "Outro",
];

function requiresReviewChangeJustification(field) {
  return reviewCriticalFields.has(field);
}

function getReviewApprovalIssues(row) {
  const issues = [];
  const hasContextJustification = row.technicalJustification?.trim();
  const hasEvidence =
    row.source?.trim() || row.attachmentEvidence?.trim() || row.sourceExcerpt?.trim();
  const hasCasOrReference =
    row.cas?.trim() && row.cas !== "Não informado"
      ? true
      : Boolean(row.reference?.trim());

  if (!row.name?.trim()) {
    issues.push("Nome do agente");
  }
  if (!row.agentType?.trim()) {
    issues.push("Tipo do agente");
  }
  if (!hasCasOrReference) {
    issues.push("CAS ou referência técnica");
  }
  if (!row.sector?.trim() && !hasContextJustification) {
    issues.push("Setor ou justificativa de ausência");
  }
  if (!row.workerFunction?.trim() && !hasContextJustification) {
    issues.push("Função ou justificativa de ausência");
  }
  if (!row.ghe?.trim() && !hasContextJustification) {
    issues.push("GHE ou justificativa de ausência");
  }
  if (!row.technicalDecision?.trim()) {
    issues.push("Decisão técnica preliminar");
  }
  if (!hasEvidence) {
    issues.push("Fonte/evidência rastreável");
  }
  if (row.manual && !row.manualJustification?.trim()) {
    issues.push("Justificativa da inclusão manual");
  }

  return issues;
}

function getApprovalPrimaryAction({ approvalState, canApprove, canApproveWithNotes, criticalPendingItems }) {
  if (isReleasedApprovalState(approvalState)) {
    return {
      label: "Ir para pré-orçamento",
      variant: "primary",
      disabled: false,
      reason: "",
      mode: "prequote",
    };
  }

  if (criticalPendingItems.length) {
    return {
      label: "Resolver pendências",
      variant: "destructive",
      disabled: false,
      reason: "Existem pendências críticas sem justificativa.",
      mode: "resolve",
    };
  }

  if (canApprove) {
    return {
      label: "Aprovar análise",
      variant: "primary",
      disabled: false,
      reason: "",
      mode: "approve",
    };
  }

  if (canApproveWithNotes) {
    return {
      label: "Aprovar com ressalvas",
      variant: "secondary",
      disabled: false,
      reason: "",
      mode: "approve_with_notes",
    };
  }

  return {
    label: "Aprovar análise",
    variant: "tertiary",
    disabled: true,
    reason: "Existem pendências críticas sem justificativa.",
    mode: "blocked",
  };
}

function buildTechnicalPendingRows() {
  return prhoPendingItems.map((item, index) => {
    const linkedAnalysis = prhoAnalyses[0];
    const linkedAgent = prhoReviewAgents.find((agent) => agent.id === item.agentId);
    const linkedDocument = documents.find((file) => file.id === linkedAgent?.sourceDocumentId);
    const pendingStatusMap = {
      industrial_secret: "Aguardando fabricante",
      missing_cas: "Em andamento",
      normative_conflict: "Aberta",
      manual_review_required: "Aguardando cliente",
    };
    const dueDateMap = {
      Crítica: "20 Jun 2026",
      Alta: "21 Jun 2026",
      Média: "24 Jun 2026",
      Baixa: "26 Jun 2026",
    };

    return {
      ...item,
      customer: linkedAnalysis.customer,
      analysisCode: linkedAnalysis.code,
      agentName: linkedAgent?.name || "Agente não identificado",
      documentName: linkedDocument?.name || linkedAgent?.source || "Documento rastreado",
      owner: linkedAnalysis.responsible,
      dueDate: dueDateMap[item.severity] || "27 Jun 2026",
      status: pendingStatusMap[item.type] || item.status,
      actionRecommended: getPendingRecommendedAction(item.type),
      attachments:
        item.type === "industrial_secret"
          ? "Solicitação_fabricante_041.pdf"
          : item.type === "manual_review_required"
            ? "Memória_de_campo_forno.docx"
            : "Sem anexo",
      history:
        index === 0
          ? "Criada pela IA • encaminhada para Reginaldo Melo"
          : index === 1
            ? "Criada na revisão • aguardando retorno do fabricante"
            : "Criada pela extração técnica • sem encerramento",
    };
  });
}

const workflowStorageKey = "cho-prho-workflow";

function readWorkflowProgress() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(workflowStorageKey) || "{}");
  } catch {
    return {};
  }
}

function readAnalysisApprovalState(analysisId, fallback = "draft") {
  const workflow = readWorkflowProgress();
  return workflow[analysisId]?.approvalState || fallback;
}

function saveAnalysisApprovalState(analysisId, approvalState) {
  if (typeof window === "undefined") {
    return;
  }

  const workflow = readWorkflowProgress();
  window.localStorage.setItem(
    workflowStorageKey,
    JSON.stringify({
      ...workflow,
      [analysisId]: {
        ...(workflow[analysisId] || {}),
        approvalState,
        updatedAt: formatAuditDate(new Date()),
      },
    }),
  );
}

function readAnalysisReviewRows(analysisId) {
  const workflow = readWorkflowProgress();
  const rows = workflow[analysisId]?.reviewRows;
  return Array.isArray(rows) && rows.length ? rows : null;
}

function saveAnalysisReviewRows(analysisId, reviewRows) {
  if (typeof window === "undefined") {
    return;
  }

  const workflow = readWorkflowProgress();
  window.localStorage.setItem(
    workflowStorageKey,
    JSON.stringify({
      ...workflow,
      [analysisId]: {
        ...(workflow[analysisId] || {}),
        reviewRows,
        updatedAt: formatAuditDate(new Date()),
      },
    }),
  );
}

function isReleasedApprovalState(approvalState) {
  return approvalState === "approved" || approvalState === "approved_with_notes";
}

function findAnalysisByCode(code) {
  return prhoAnalyses.find((item) => item.code === code) || null;
}

function resolveAnalysisRelease(analysis) {
  if (!analysis) {
    return {
      approvalState: "draft",
      released: false,
    };
  }

  const fallbackState = analysis.statusCode === "budget_generated" ? "approved" : "draft";
  const approvalState = readAnalysisApprovalState(analysis.id, fallbackState);

  return {
    approvalState,
    released: isReleasedApprovalState(approvalState),
  };
}

function normalizeLooseText(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildPrhoAssistantInsights(query = "") {
  const normalizedQuery = normalizeLooseText(query);
  const sourceItems = manualAgentSearchCatalog.flatMap((entry) =>
    entry.options?.length ? entry.options : [entry],
  );

  return sourceItems
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
    .filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return normalizeLooseText(
        [
          item.name,
          item.standardizedName,
          item.cas,
          item.agentType,
          item.suggestedMethod,
          item.technicalDecision,
          item.technicalRecommendation,
        ]
          .filter(Boolean)
          .join(" "),
      ).includes(normalizedQuery);
    })
    .slice(0, normalizedQuery ? 6 : 4);
}

function resolveWorksheetBlockContext(row, blocks = getPrhoReviewBlocksSeed()) {
  const rowSector = normalizeLooseText(row.sector);
  const rowFunction = normalizeLooseText(row.workerFunction);
  const rowGhe = normalizeLooseText(row.ghe);

  const match =
    blocks.find((block) => normalizeLooseText(block.gheCode) === rowGhe) ||
    blocks.find((block) => rowSector && normalizeLooseText(block.sectorLocation).includes(rowSector)) ||
    blocks.find((block) => rowFunction && normalizeLooseText(block.workerFunction).includes(rowFunction));

  if (!match) {
    return {
      blockId: "block-manual",
      blockLabel: "Bloco manual",
      blockTitle: row.sector || "Bloco sem contexto fechado",
      blockSummary: [row.sector, row.workerFunction, row.ghe].filter(Boolean).join(" • "),
    };
  }

  return {
    blockId: match.id,
    blockLabel: match.label,
    blockTitle: match.title,
    blockSummary: [match.sectorLocation, match.workerFunction, match.gheCode]
      .filter(Boolean)
      .join(" • "),
  };
}

function buildAnalysisReviewRowsSeed(analysisId) {
  return (readAnalysisReviewRows(analysisId) || prhoReviewAgents.map((item) => buildReviewRow(item))).map(
    (row) => ({
      ...buildReviewRow(row),
      ...resolveWorksheetBlockContext(row),
    }),
  );
}

function WorksheetCell({ title, children, className = "" }) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function WorksheetMeta({ label, value, strong = false }) {
  return (
    <div className="grid gap-1">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </span>
      <span
        className={cn(
          "text-[13px] leading-5 text-[var(--color-text-default)]",
          strong ? "font-semibold text-[var(--color-text-strong)]" : "",
        )}
      >
        {value || "Não informado"}
      </span>
    </div>
  );
}

function WorksheetGroupHeader({ children }) {
  return (
    <div className="hidden gap-3 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3 xl:grid xl:grid-cols-[1.15fr_0.9fr_1fr_1.2fr_1fr_1.1fr]">
      {children}
    </div>
  );
}

function resolveQuotationWorkflowSource(quotation) {
  const sourcePreQuotation =
    preQuotations.find((item) => item.customer === quotation.customer) || null;
  const sourceAnalysis =
    (sourcePreQuotation ? findAnalysisByCode(sourcePreQuotation.origin) : null) ||
    prhoAnalyses.find((item) => item.customer === quotation.customer) ||
    null;

  return {
    sourcePreQuotation,
    sourceAnalysis,
    ...resolveAnalysisRelease(sourceAnalysis),
  };
}

function DashboardTable({ title = "Últimas análises", columns, rows }) {
  const defaultColumns = [
    { key: "code", label: "Análise" },
    { key: "customer", label: "Cliente" },
    { key: "status", label: "Status" },
    { key: "updatedAt", label: "Atualização" },
  ];
  const defaultRows = prhoAnalyses.map((analysis) => ({
    id: analysis.id,
    code: analysis.code,
    customer: analysis.customer,
    status: <StatusBadge status={analysis.status} />,
    updatedAt: analysis.updatedAt,
  }));

  return (
    <div className="grid gap-3">
      <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
        {title}
      </h3>
      <DataTable columns={columns || defaultColumns} rows={rows || defaultRows} />
    </div>
  );
}

function ProfilePage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Perfil"
          title="Preferências do usuário"
          description="Dados cadastrais, registro técnico e preferências de notificação mockadas."
          actions={[
            <Button key="save">Salvar alterações</Button>,
            <Button key="avatar" variant="tertiary">
              Trocar avatar
            </Button>,
          ]}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome">
              <Input value={users[0].name} />
            </Field>
            <Field label="Cargo">
              <Input value={users[0].role} />
            </Field>
            <Field label="Registro">
              <Input value={users[0].registry} />
            </Field>
            <Field label="Telefone">
              <Input value={users[0].phone} />
            </Field>
            <Field label="E-mail" full>
              <Input value={users[0].email} />
            </Field>
            <Field label="Nova senha" full>
              <Input value="••••••••••••" />
            </Field>
          </div>
        </Panel>
        <Panel className="grid gap-4">
          <CheckboxField label="Receber alertas de revisão técnica" checked onChange={() => {}} />
          <CheckboxField label="Receber aviso de orçamento aprovado" checked onChange={() => {}} />
          <SwitchField
            label="Ativar dark mode por padrão"
            checked={false}
            onChange={() => {}}
          />
          <Toast
            title="Estado mockado"
            description="Ao salvar, exiba um toast de sucesso e mantenha o fluxo visual pronto para validação."
          />
        </Panel>
      </div>
    </UnifiedPagePanel>
  );
}

function CustomersListPage() {
  const columns = [
    { key: "name", label: "Nome" },
    { key: "document", label: "Documento" },
    { key: "contact", label: "Contato" },
    { key: "phone", label: "Telefone" },
    { key: "city", label: "Cidade/UF" },
    { key: "actions", label: "Ações" },
  ];

  const rows = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    document: customer.document,
    contact: customer.contact,
    phone: customer.phone,
    city: customer.city,
    actions: (
      <div className="flex flex-wrap gap-2">
        <NavLink
          to={`/app/customers/${customer.id}`}
          className={buttonStyles({
            variant: "tertiary",
            className: "min-h-9 px-3 text-[13px]",
          })}
        >
          Ver
        </NavLink>
        <NavLink
          to={`/app/prho/new?customer=${customer.id}`}
          className={buttonStyles({
            variant: "ghost",
            className: "min-h-9 px-3 text-[13px]",
          })}
        >
          Nova análise
        </NavLink>
      </div>
    ),
  }));

  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-6 lg:px-7">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,0.95fr)_minmax(0,0.75fr)]">
          <Field label="Busca">
            <Input value="Metalúrgica, CNPJ ou contato" />
          </Field>
          <Field label="Tipo">
            <Select value="Todos" />
          </Field>
          <Field label="Cidade / UF">
            <Select value="Todas" />
          </Field>
          <Field label="Status">
            <Select value="Ativo" />
          </Field>
        </div>
      </div>
      <DataTable columns={columns} rows={rows} framed={false} />
    </Panel>
  );
}

function CustomerFormPage() {
  const { id } = useParams();
  const customer = customers.find((item) => item.id === id) || customers[1];
  const editing = Boolean(id);

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Clientes"
          title={editing ? `Editar ${customer.name}` : "Cadastrar novo cliente"}
          description="Cadastro mockado com endereço, observações e bloco preparado para busca de CEP simulada."
          actions={[
            <Button key="save">Salvar cliente</Button>,
            <Button key="cep" variant="tertiary">
              Buscar CEP simulado
            </Button>,
          ]}
        />
      }
    >
      <Panel className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tipo">
            <Select value={customer.type} />
          </Field>
          <Field label="Razão social">
            <Input value={customer.name} />
          </Field>
          <Field label="Documento">
            <Input value={customer.document} />
          </Field>
          <Field label="Contato principal">
            <Input value={customer.contact} />
          </Field>
          <Field label="E-mail">
            <Input value={customer.email} />
          </Field>
          <Field label="Telefone">
            <Input value={customer.phone} />
          </Field>
          <Field label="Observações" full>
            <Textarea value={customer.notes} />
          </Field>
        </div>
        <Panel className="grid gap-4 bg-[var(--surface-muted)] p-5 lg:p-5">
          <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
            Endereço principal
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Label">
              <Input value={customer.addresses[0].label} />
            </Field>
            <Field label="CEP">
              <Input value={customer.addresses[0].zip} />
            </Field>
            <Field label="Endereço" full>
              <Input value={customer.addresses[0].street} />
            </Field>
            <Field label="Bairro">
              <Input value={customer.addresses[0].district} />
            </Field>
            <Field label="Cidade">
              <Input value={customer.addresses[0].city} />
            </Field>
            <Field label="Estado">
              <Input value={customer.addresses[0].state} />
            </Field>
          </div>
        </Panel>
      </Panel>
    </UnifiedPagePanel>
  );
}

function CustomerDetailPage() {
  const { id } = useParams();
  const customer = customers.find((item) => item.id === id) || customers[0];
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Visão geral" },
    { id: "addresses", label: "Endereços" },
    { id: "attachments", label: "Anexos" },
    { id: "prho", label: "Análises PRHO" },
    { id: "quotations", label: "Orçamentos" },
    { id: "sampling", label: "Amostragens" },
    { id: "reports", label: "Relatórios" },
  ];

  const tabContent = {
    overview: (
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Análises PRHO" value={customer.analyses} />
        <StatCard label="Orçamentos" value={customer.quotations} />
        <StatCard label="Amostragens" value={customer.samplings} />
      </div>
    ),
    addresses: (
      <Panel className="grid gap-3 bg-[var(--surface-muted)] p-5 lg:p-5">
        {customer.addresses.map((address) => (
          <div key={address.label} className="grid gap-1">
            <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
              {address.label}
            </strong>
            <span className="text-[15px] text-[var(--color-text-default)]">
              {address.street}
            </span>
            <span className="text-[14px] text-[var(--color-text-soft)]">
              {address.city}/{address.state}
            </span>
          </div>
        ))}
      </Panel>
    ),
    attachments: (
      <EmptyState
        title="Nenhum anexo adicional"
        description="Mantenha certificados, contratos ou documentos do cliente aqui quando necessário."
      />
    ),
    prho: (
      <DataTable
        columns={[
          { key: "code", label: "Código" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Atualização" },
        ]}
        rows={prhoAnalyses
          .filter((item) => item.customerId === customer.id)
          .map((item) => ({
            id: item.id,
            code: item.code,
            status: <StatusBadge status={item.status} />,
            updatedAt: item.updatedAt,
          }))}
      />
    ),
    quotations: (
      <DataTable
        columns={[
          { key: "number", label: "Número" },
          { key: "status", label: "Status" },
          { key: "total", label: "Valor" },
        ]}
        rows={quotations
          .filter((item) => item.customer === customer.name)
          .map((item) => ({
            id: item.id,
            number: item.number,
            status: <StatusBadge status={item.status} />,
            total: item.total,
          }))}
      />
    ),
    sampling: (
      <DataTable
        columns={[
          { key: "agent", label: "Agente" },
          { key: "status", label: "Status" },
          { key: "owner", label: "Responsável" },
        ]}
        rows={samplingPlans
          .filter((item) => item.customer === customer.name)
          .map((item) => ({
            id: item.id,
            agent: item.agent,
            status: <StatusBadge status={item.status} />,
            owner: item.owner,
          }))}
      />
    ),
    reports: (
      <DataTable
        columns={[
          { key: "code", label: "Relatório" },
          { key: "status", label: "Status" },
          { key: "version", label: "Versão" },
        ]}
        rows={reports
          .filter((item) => item.customer === customer.name)
          .map((item) => ({
            id: item.id,
            code: item.code,
            status: <StatusBadge status={item.status} />,
            version: item.version,
          }))}
      />
    ),
  };

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Cliente"
          title={customer.name}
          description={customer.notes}
          meta={[
            <Badge key="doc" tone="status">
              {customer.document}
            </Badge>,
            <Badge key="city" tone="review">
              {customer.city}
            </Badge>,
          ]}
          actions={[
            <NavLink
              key="edit"
              to={`/app/customers/${customer.id}/edit`}
              className={buttonStyles({ variant: "secondary" })}
            >
              Editar cliente
            </NavLink>,
            <NavLink
              key="analysis"
              to={`/app/prho/new?customer=${customer.id}`}
              className={buttonStyles({ variant: "primary" })}
            >
              Nova análise PRHO
            </NavLink>,
          ]}
        />
      }
    >
      <Panel className="grid gap-4">
        <TabRow items={tabs} activeId={tab} onChange={setTab} />
        {tabContent[tab]}
      </Panel>
    </UnifiedPagePanel>
  );
}

function PrhoListPage() {
  const [showFilters, setShowFilters] = useState(false);
  const totalCriticalPendings = prhoAnalyses.reduce(
    (sum, analysis) => sum + analysis.criticalPendingItems,
    0,
  );
  const analysesWithIndustrialSecret = prhoAnalyses.filter(
    (analysis) => prhoAnalysisDiagnostics[analysis.id]?.industrialSecret,
  ).length;
  const totalBlocksWithoutAgent = prhoAnalyses.reduce(
    (sum, analysis) => sum + (prhoAnalysisDiagnostics[analysis.id]?.blocksWithoutAgent || 0),
    0,
  );
  const totalAgentsWithoutMethod = prhoAnalyses.reduce(
    (sum, analysis) => sum + (prhoAnalysisDiagnostics[analysis.id]?.agentsWithoutMethod || 0),
    0,
  );

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Análises PRHO/APRHO"
          description="Listagem central para localizar, acompanhar e continuar análises ao longo das etapas técnicas."
          actions={[
            <NavLink
              key="pending"
              to="/app/prho/pending"
              className={buttonStyles({ variant: "tertiary" })}
            >
              Pendências técnicas
            </NavLink>,
            <NavLink
              key="new"
              to="/app/prho/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Nova análise
            </NavLink>,
          ]}
          meta={[
            <Badge key="analyses" tone="status">
              {prhoAnalyses.length} análises ativas
            </Badge>,
            <Badge key="critical" tone={totalCriticalPendings ? "critical" : "review"}>
              {totalCriticalPendings} pendências críticas
            </Badge>,
            <Badge
              key="industrial-secret"
              tone={analysesWithIndustrialSecret ? "critical" : "review"}
            >
              {analysesWithIndustrialSecret} com segredo industrial
            </Badge>,
            <Badge
              key="blocks-without-agent"
              tone={totalBlocksWithoutAgent ? "review" : "status"}
            >
              {totalBlocksWithoutAgent} blocos sem agente
            </Badge>,
            <Badge
              key="missing-method"
              tone={totalAgentsWithoutMethod ? "review" : "status"}
            >
              {totalAgentsWithoutMethod} sem norma/método
            </Badge>,
          ]}
        />
      }
      bodyClassName="grid gap-6"
      bodyPadded={false}
    >
      <div className="px-6 pt-6 lg:px-7">
        <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <Field label="Busca">
              <Input value="PRHO 2026-041, cliente, título ou responsável" />
            </Field>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Button
                variant="tertiary"
                onClick={() => setShowFilters((value) => !value)}
              >
                {showFilters ? "Ocultar filtros" : "Filtros"}
              </Button>
            </div>
          </div>

          {showFilters ? (
            <div className="grid gap-3 border-t border-[var(--color-border-subtle)] pt-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Cliente">
                <Select value="Todos" />
              </Field>
              <Field label="Responsável">
                <Select value="Todos" />
              </Field>
              <Field label="Status">
                <Select value="Todos" />
              </Field>
              <Field label="Etapa">
                <Select value="Todas" />
              </Field>
              <Field label="Data">
                <Select value="Últimos 30 dias" />
              </Field>
              <Field label="Pendências críticas">
                <Select value="Todas" />
              </Field>
              <Field label="Segredo industrial">
                <Select value="Todos" />
              </Field>
              <Field label="Bloco sem agente">
                <Select value="Todos" />
              </Field>
              <Field label="Agente sem setor/função/atividade">
                <Select value="Todos" />
              </Field>
            </div>
          ) : null}
        </div>
      </div>
      <DataTable
        framed={false}
        density="compact"
        columns={[
          { key: "code", label: "Código" },
          { key: "customer", label: "Cliente" },
          { key: "analysis", label: "Análise" },
          { key: "progress", label: "Etapa / status" },
          { key: "pendings", label: "Pendências" },
        ]}
        rows={prhoAnalyses.map((analysis) => {
          const pendingSummary = formatPendingSummary(analysis);
          const diagnostics = prhoAnalysisDiagnostics[analysis.id] || {};
          const continueLabel = ["Pré-orçamento gerado", "Orçamento gerado", "Aprovada", "Aprovada com ressalvas"].includes(analysis.status)
            ? "Abrir análise"
            : "Continuar análise";
          return {
            id: analysis.id,
            code: (
              <div className="grid gap-1">
                <span className="font-semibold text-[var(--color-text-strong)]">
                  {analysis.code}
                </span>
                <NavLink
                  to={getAnalysisContinuePath(analysis)}
                  className="pt-1 text-[12px] font-semibold text-[var(--color-brand-blue-700)] no-underline"
                >
                  <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[var(--badge-review-bg)] p-1 pl-3 text-[12px] font-semibold text-[var(--color-brand-blue-700)] transition hover:bg-[var(--color-brand-cyan-100)] hover:text-[var(--color-brand-foreground)]">
                    <span>{continueLabel}</span>
                    <span className="grid size-6 place-items-center rounded-full bg-white/80 text-[var(--color-brand-blue-700)] shadow-[inset_0_0_0_1px_rgba(45,130,183,0.12)]">
                      <NavIcon name="link" className="size-3.5" />
                    </span>
                  </span>
                </NavLink>
              </div>
            ),
            customer: (
              <div className="grid gap-1">
                <span className="font-medium text-[var(--color-text-default)]">
                  {analysis.customer}
                </span>
                <span className="text-[12px] text-[var(--color-text-soft)]">
                  Atualizado em {analysis.updatedAt}
                </span>
              </div>
            ),
            analysis: (
              <div className="grid gap-1">
                <span className="font-medium text-[var(--color-text-default)]">
                  {analysis.title}
                </span>
                <span className="text-[12px] text-[var(--color-text-soft)]">
                  Responsável: {analysis.owner}
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <TechnicalBadge
                    label={`${diagnostics.activeBlocks || 0} blocos`}
                    tone="review"
                  />
                  {diagnostics.blocksWithoutAgent ? (
                    <TechnicalBadge
                      label={`${diagnostics.blocksWithoutAgent} sem agente`}
                      tone="status"
                    />
                  ) : null}
                  {diagnostics.agentsWithoutMethod ? (
                    <TechnicalBadge
                      label={`${diagnostics.agentsWithoutMethod} sem método`}
                      tone="status"
                    />
                  ) : null}
                </div>
              </div>
            ),
            progress: (
              <div className="grid gap-2">
                <span className="font-medium text-[var(--color-text-default)]">
                  {prhoStageLabels[analysis.statusCode] || "Revisão"}
                </span>
                <StatusBadge status={analysis.status} />
              </div>
            ),
            pendings: (
              <div className="grid gap-1">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  {pendingSummary.primary}
                </span>
                {pendingSummary.secondary ? (
                  <span className="text-[13px] text-[var(--color-text-soft)]">
                    {pendingSummary.secondary}
                  </span>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  {diagnostics.industrialSecret ? (
                    <Badge tone="critical">Segredo industrial</Badge>
                  ) : null}
                  {diagnostics.agentsWithoutContext ? (
                    <Badge tone="review">Contexto incompleto</Badge>
                  ) : null}
                </div>
              </div>
            ),
          };
        })}
      />
    </UnifiedPagePanel>
  );
}

function PrhoPendingPage() {
  const navigate = useNavigate();
  const [technicalPendingRows, setTechnicalPendingRows] = useState(() =>
    buildTechnicalPendingRows(),
  );
  const criticalItems = technicalPendingRows.filter((item) => item.severity === "Crítica");
  const blockingItems = technicalPendingRows.filter(
    (item) => item.status === "Bloqueante" || item.severity === "Crítica",
  );
  const awaitingClient = technicalPendingRows.filter(
    (item) => item.status === "Aguardando cliente",
  ).length;
  const awaitingManufacturer = technicalPendingRows.filter(
    (item) => item.status === "Aguardando fabricante",
  ).length;
  const resolvedItems = technicalPendingRows.filter((item) =>
    ["Resolvida", "Resolvida com ressalva"].includes(item.status),
  ).length;

  function updateTechnicalPendingRow(pendingId, patch) {
    setTechnicalPendingRows((current) =>
      current.map((item) => (item.id === pendingId ? { ...item, ...patch } : item)),
    );
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Pendências técnicas"
          description="Centralização das pendências geradas pela IA e pela revisão humana, com foco em segredo industrial e dados insuficientes."
          actions={[
            <NavLink
              key="back-list"
              to="/app/prho"
              className={buttonStyles({ variant: "tertiary" })}
            >
              Voltar para análises
            </NavLink>,
          ]}
          meta={[
            <Badge key="total" tone="status">
              {technicalPendingRows.length} pendências monitoradas
            </Badge>,
            <Badge
              key="critical"
              tone={
                technicalPendingRows.some((item) => item.severity === "Crítica")
                  ? "critical"
                  : "review"
              }
            >
              {
                technicalPendingRows.filter((item) => item.severity === "Crítica").length
              } críticas
            </Badge>,
          ]}
        />
      }
      bodyClassName="grid gap-6"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Pendências monitoradas"
          value={technicalPendingRows.length}
          hint="Fila consolidada do analisador"
          tone="info"
        />
        <StatCard
          label="Bloqueantes"
          value={blockingItems.length}
          hint="Impeditivas para classificação ou aprovação"
          tone={blockingItems.length ? "critical" : "positive"}
        />
        <StatCard
          label="Aguardando cliente"
          value={awaitingClient}
          hint="Dependem de retorno operacional"
          tone={awaitingClient ? "info" : "positive"}
        />
        <StatCard
          label="Aguardando fabricante"
          value={awaitingManufacturer}
          hint="Normalmente ligadas a segredo industrial"
          tone={awaitingManufacturer ? "critical" : "positive"}
        />
        <StatCard
          label="Resolvidas"
          value={resolvedItems}
          hint="Itens tratados ou encerrados com ressalva"
          tone="positive"
        />
      </div>

      {blockingItems.length ? (
        <Toast
          title="Existem pendências técnicas bloqueantes"
          description="Segredo industrial, divergência normativa e campos obrigatórios ausentes precisam aparecer claramente antes da aprovação final."
        />
      ) : null}

      <SearchAndFilters
        framed={false}
        search="Segredo industrial, CAS, cliente ou análise"
        filters={[
          <Field key="type" label="Tipo da pendência">
            <Select value="Todos" />
          </Field>,
          <Field key="severity" label="Gravidade">
            <Select value="Todas" />
          </Field>,
          <Field key="status" label="Status">
            <Select value="Todos" />
          </Field>,
          <Field key="responsible" label="Responsável">
            <Select value="Todos" />
          </Field>,
        ]}
      />

      <div className="grid gap-4">
        {technicalPendingRows.map((item) => (
          <Panel key={item.id} className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  {item.type.replaceAll("_", " ")}
                </p>
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  {item.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <RiskBadge level={item.severity} />
                <StatusBadge status={item.status} />
                {item.type === "industrial_secret" ? (
                  <Badge tone="critical">Segredo industrial</Badge>
                ) : null}
                {item.type === "normative_conflict" ? (
                  <Badge tone="review">Divergência normativa</Badge>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Agente relacionado
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {item.agentName}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Documento de origem
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {item.documentName}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Cliente / análise
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {item.customer} • {item.analysisCode}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Responsável / prazo
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {item.owner} • {item.dueDate}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Status da pendência">
                <EditableSelect
                  value={item.status}
                  options={pendingStatusOptions}
                  onChange={(value) => updateTechnicalPendingRow(item.id, { status: value })}
                />
              </Field>
              <Field label="Responsável técnico">
                <EditableInput
                  value={item.owner}
                  onChange={(value) => updateTechnicalPendingRow(item.id, { owner: value })}
                />
              </Field>
              <Field label="Ação recomendada">
                <EditableInput
                  value={item.actionRecommended}
                  onChange={(value) =>
                    updateTechnicalPendingRow(item.id, { actionRecommended: value })
                  }
                />
              </Field>
            </div>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Descrição
                </span>
                <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-default)]">
                  {item.description}
                </p>
                <p className="mt-3 text-[13px] leading-5 text-[var(--color-text-soft)]">
                  Ação recomendada: {item.actionRecommended}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Anexos / histórico
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {item.attachments}
                </p>
                <p className="mt-3 text-[13px] leading-5 text-[var(--color-text-soft)]">
                  {item.history}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="tertiary"
                className="min-h-9 px-3 text-[12px]"
                onClick={() => navigate(`/app/prho/${prhoAnalyses[0].id}/review`)}
              >
                Resolver pendência
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, { status: "Aguardando cliente" })
                }
              >
                Solicitar informação complementar
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() => navigate(`/app/prho/${prhoAnalyses[0].id}/review`)}
              >
                Adicionar agente manual
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, {
                    attachments:
                      item.attachments === "Sem anexo"
                        ? "evidencia_tecnica_mock.pdf"
                        : item.attachments,
                    status: "Evidência anexada",
                  })
                }
              >
                Vincular documento
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, {
                    history: `${item.history} • justificativa registrada`,
                    status: "Justificada",
                  })
                }
              >
                Adicionar justificativa
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, { owner: "Davi Vanadio" })
                }
              >
                Reatribuir responsável
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, {
                    status: "Cancelada",
                    history: `${item.history} • marcada como não aplicável`,
                  })
                }
              >
                Marcar como não aplicável
              </Button>
              <Button
                variant="secondary"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, { status: "Resolvida com ressalva" })
                }
              >
                Aprovar com ressalva
              </Button>
              <Button
                variant="destructive"
                className="min-h-9 px-3 text-[12px]"
                onClick={() =>
                  updateTechnicalPendingRow(item.id, { status: "Bloqueante" })
                }
              >
                Bloquear análise
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </UnifiedPagePanel>
  );
}

function PrhoNewPage() {
  const navigate = useNavigate();
  const analysis = prhoAnalyses[0];
  const stagedDocuments = documents.slice(0, 4);
  const [intakeMode, setIntakeMode] = useState(prhoIntakeModes[0].id);
  const [learningMode, setLearningMode] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [showNhoLibraryModal, setShowNhoLibraryModal] = useState(false);
  const [documentAssignments, setDocumentAssignments] = useState(() =>
    getPrhoDocumentAssignmentsSeed(),
  );
  const canStartProcessing = stagedDocuments.length > 0;
  const assistantInsights = buildPrhoAssistantInsights(assistantQuery);

  function updateDocumentAssignment(documentId, patch) {
    setDocumentAssignments((current) =>
      current.map((item) =>
        item.documentId === documentId
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Criar análise PRHO/APR HO"
          description="Cadastro enxuto da análise com definição da estratégia de entrada e upload dos documentos técnicos."
          actions={[
            <NavLink
              key="customer"
              to="/app/customers/new"
              className={buttonStyles({ variant: "tertiary" })}
            >
              Novo cliente
            </NavLink>,
            <Button
              key="create"
              disabled={!canStartProcessing}
              onClick={() => navigate(`/app/prho/${analysis.id}/processing`)}
            >
              Iniciar processamento técnico
            </Button>,
          ]}
        >
          <Stepper steps={flowSteps} current={0} />
        </PageHeader>
      }
      bodyClassName="grid gap-6"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="grid gap-6">
          <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Estratégia da análise
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Escolha como os blocos operacionais entram no fluxo
                </h3>
                <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Bloco operacional = setor/local + função + atividade + agentes ligados ao mesmo cenário de exposição. Aqui o usuário só decide a porta de entrada do material.
                </p>
              </div>
              <Button variant="tertiary" onClick={() => setShowNhoLibraryModal(true)}>
                Consultar biblioteca NHO
              </Button>
            </div>
            <TabRow items={prhoIntakeModes} activeId={intakeMode} onChange={setIntakeMode} />
            <div className="grid gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
              <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
                {intakeMode === "system-identifies"
                  ? "O sistema recebe os arquivos, identifica os blocos operacionais durante o processamento e distribui os agentes automaticamente na revisão."
                  : "O usuário pode subir os arquivos já vinculando o documento a um bloco existente, a um novo bloco operacional ou deixando como documento geral da análise."}
              </p>
              <div className="flex flex-wrap gap-2">
                <TechnicalBadge
                  label={
                    intakeMode === "system-identifies"
                      ? "Leitura automática por bloco"
                      : "Vínculo manual opcional por bloco"
                  }
                  tone="review"
                />
                <TechnicalBadge label="Sem revisão técnica antecipada" tone="status" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <Select value={analysis.customer} />
            </Field>
            <Field label="Responsável técnico">
              <Select value={analysis.responsible} />
            </Field>
            <Field label="Título da análise" full>
              <Input value={analysis.title} />
            </Field>
          </div>

          <div className="grid gap-4 rounded-[24px] border border-dashed border-[var(--color-border-strong)] bg-[var(--surface-muted)] p-6 text-center">
            <strong className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Upload de documentos da análise
            </strong>
            <p className="mx-auto max-w-3xl text-[15px] leading-7 text-[var(--color-text-soft)]">
              {intakeMode === "system-identifies"
                ? "Nesta etapa o usuário apenas anexa os arquivos. O reconhecimento técnico acontece no processamento, sem antecipar revisão."
                : "Nesta etapa o usuário anexa os arquivos e, se quiser, já organiza o material por bloco operacional para ganhar velocidade no processamento técnico."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["PDF", "XLSX", "XLS", "DOCX", "DOC", "RTF", "TXT", "PNG", "JPG"].map((type) => (
                <TechnicalBadge key={type} label={type} tone="review" />
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Lote anexado
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Prévia dos arquivos selecionados
                </h3>
                <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
                  {intakeMode === "system-identifies"
                    ? "O pacote abaixo segue direto para leitura automática. Nenhum passo técnico é exigido do usuário aqui."
                    : "O pacote abaixo permite orientar o vínculo operacional do documento sem forçar instruções técnicas complexas."}
                </p>
              </div>
              <Badge tone="review">{documents.length} arquivos anexados</Badge>
            </div>
            <div className="grid gap-4">
              {stagedDocuments.map((file) => {
                const assignment =
                  documentAssignments.find((item) => item.documentId === file.id) || null;

                return (
                  <div
                    key={file.id}
                    className="grid gap-4 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
                  >
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                          {file.name}
                        </strong>
                        <TechnicalBadge label={file.detectedType} tone="review" />
                      </div>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        {file.pages
                          ? `${file.pages} páginas preparadas para leitura`
                          : file.sheets
                            ? `${file.sheets} abas preparadas para leitura`
                            : "Arquivo preparado para leitura técnica"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        {file.preview}
                      </p>
                    </div>
                    {intakeMode === "upload-by-block" ? (
                      <div className="grid gap-3">
                        <Field label="Destino do documento">
                          <EditableSelect
                            value={assignment?.linkMode || prhoDocumentLinkModes[0]}
                            options={prhoDocumentLinkModes}
                            onChange={(value) =>
                              updateDocumentAssignment(file.id, {
                                linkMode: value,
                                blockId: value === "Bloco existente" ? "block-01" : "",
                                newBlock:
                                  value === "Novo bloco operacional"
                                    ? {
                                        sectorLocation: "",
                                        gheCode: "",
                                        workerFunction: "",
                                        activityOperation: "",
                                      }
                                    : null,
                              })
                            }
                          />
                        </Field>

                        {assignment?.linkMode === "Bloco existente" ? (
                          <Field label="Selecionar bloco existente">
                            <select
                              value={assignment.blockId}
                              onChange={(event) =>
                                updateDocumentAssignment(file.id, {
                                  blockId: event.target.value,
                                })
                              }
                              className="min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]"
                            >
                              {prhoReviewBlocksSeed.map((block) => (
                                <option key={block.id} value={block.id}>
                                  {block.label} • {block.title}
                                </option>
                              ))}
                            </select>
                          </Field>
                        ) : null}

                        {assignment?.linkMode === "Novo bloco operacional" ? (
                          <div className="grid gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-2">
                            <Field label="Setor / local">
                              <EditableInput
                                value={assignment.newBlock?.sectorLocation || ""}
                                onChange={(value) =>
                                  updateDocumentAssignment(file.id, {
                                    newBlock: {
                                      ...assignment.newBlock,
                                      sectorLocation: value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="GHE / código">
                              <EditableInput
                                value={assignment.newBlock?.gheCode || ""}
                                onChange={(value) =>
                                  updateDocumentAssignment(file.id, {
                                    newBlock: {
                                      ...assignment.newBlock,
                                      gheCode: value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Função">
                              <EditableInput
                                value={assignment.newBlock?.workerFunction || ""}
                                onChange={(value) =>
                                  updateDocumentAssignment(file.id, {
                                    newBlock: {
                                      ...assignment.newBlock,
                                      workerFunction: value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Atividade / operação">
                              <EditableInput
                                value={assignment.newBlock?.activityOperation || ""}
                                onChange={(value) =>
                                  updateDocumentAssignment(file.id, {
                                    newBlock: {
                                      ...assignment.newBlock,
                                      activityOperation: value,
                                    },
                                  })
                                }
                              />
                            </Field>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="grid content-start gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-blue-500)]">
                          Organização automática
                        </p>
                        <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                          O sistema vai identificar setor/local, função, atividade e agentes automaticamente durante o processamento.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <TechnicalBadge label="Bloco identificado pela IA" tone="review" />
                          <TechnicalBadge label="Sem ação manual agora" tone="status" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
            <Button variant="ghost">Adicionar mais documentos</Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="tertiary">Salvar rascunho</Button>
              <Button
                disabled={!canStartProcessing}
                onClick={() => navigate(`/app/prho/${analysis.id}/processing`)}
              >
                Iniciar processamento técnico
              </Button>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel className="grid gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Assistente técnico
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Base de apoio para montar a análise
                </h3>
              </div>
              <span className="grid size-10 place-items-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] text-[var(--color-brand-blue-700)]">
                <NavIcon name="link" className="size-4" />
              </span>
            </div>
            <Field label="Buscar agente, CAS ou método">
              <EditableInput
                value={assistantQuery}
                onChange={setAssistantQuery}
                placeholder="Tolueno, ruído, NHO-01, 108-88-3..."
              />
            </Field>
            <div className="grid gap-3">
              {assistantInsights.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="grid gap-1">
                      <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                        {item.name}
                      </strong>
                      <span className="text-[12px] text-[var(--color-text-soft)]">
                        {item.agentType} • {item.cas || "Sem CAS"}
                      </span>
                    </div>
                    <Badge tone="review">{item.confidence || 0}% confiança</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TechnicalBadge label={item.suggestedMethod || "Método a validar"} tone="status" />
                    <TechnicalBadge label={item.aihaCategory || "Categoria AIHA pendente"} tone="review" />
                  </div>
                  <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                    {item.technicalRecommendation || item.technicalObservation || "Sem recomendação complementar."}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="grid gap-4">
            <div className="grid gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Modo aprendizado
              </p>
              <SwitchField
                label="Exibir explicações operacionais durante o mockup"
                checked={learningMode}
                onChange={setLearningMode}
                helper="Útil para treinamento interno sem poluir a jornada principal do usuário."
              />
            </div>
            {learningMode ? (
              <div className="grid gap-3">
                {prhoLearningModules.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3"
                  >
                    <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                      {item.title}
                    </strong>
                    <p className="mt-1 text-[13px] leading-6 text-[var(--color-text-soft)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Toast
                title="Interface limpa para o cliente final"
                description="As explicações ficam escondidas até o modo aprendizado ser ativado."
              />
            )}
          </Panel>
        </div>
      </div>

      <Modal
        open={showNhoLibraryModal}
        title="Biblioteca técnica NHO"
        description="Consulta rápida dos métodos mais usados no mockup para orientar leitura, quantificação e revisão."
        onClose={() => setShowNhoLibraryModal(false)}
        actions={[
          <Button key="close-nho-library" variant="ghost" onClick={() => setShowNhoLibraryModal(false)}>
            Fechar
          </Button>,
        ]}
      >
        <div className="grid gap-3">
          {prhoNhoMethodLibrary.map((method) => (
            <div
              key={method.id}
              className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    {method.label} • {method.title}
                  </strong>
                  <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                    {method.summary}
                  </p>
                </div>
                <Badge tone="status">{method.appliesTo.length} usos</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {method.appliesTo.map((item) => (
                  <TechnicalBadge key={item} label={item} tone="review" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoSummaryEntryPage() {
  const { id } = useParams();
  return <Navigate to={`/app/prho/${id}/summary`} replace />;
}

function PrhoUploadPage() {
  const { id } = useParams();
  return <Navigate to={`/app/prho/${id}/processing`} replace />;
}

function PrhoProcessingPage() {
  const { id } = useParams();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const blocks = getPrhoReviewBlocksSeed();
  const pendencies = getPrhoReviewPendenciesSeed();
  const metrics = getPrhoOperationalMetrics(blocks, prhoReviewPendenciesSeed);
  const outOfScopeDocuments = ["fotos_area_pintura.zip", "mapa_ergonomico_2025.pdf"];
  const processingProgress = 68;
  const [showNhoLibraryModal, setShowNhoLibraryModal] = useState(false);
  const criticalPendencies = pendencies.filter((item) => item.severity === "Crítica");
  const highPendencies = pendencies.filter((item) => item.severity === "Alta");
  const mediumPendencies = pendencies.filter((item) => item.severity === "Média");

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Processamento técnico da análise"
          description="Leitura técnica organizada por blocos operacionais, separando escopo de higiene, agentes detectados e pendências previstas antes da revisão por blocos."
          actions={[
            <Button key="nho-library" variant="tertiary" onClick={() => setShowNhoLibraryModal(true)}>
              Biblioteca NHO
            </Button>,
            <NavLink
              key="review"
              to={`/app/prho/${id}/review`}
              className={buttonStyles({ variant: "primary" })}
            >
              Ir para revisão por blocos
            </NavLink>,
          ]}
        >
          <Stepper steps={flowSteps} current={1} />
        </PageHeader>
      }
      bodyClassName="grid gap-4"
    >
      <Panel className="grid gap-6">
        <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5 xl:grid-cols-[minmax(0,1.1fr)_300px] xl:items-center">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Progresso do processamento
                </p>
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  A análise está organizando blocos, agentes e pendências
                </h3>
              </div>
              <Badge tone="processing">{processingProgress}% concluído</Badge>
            </div>
            <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
              O usuário já consegue entender quanto da leitura técnica foi concluído antes de seguir para a revisão por blocos.
            </p>
            <div className="grid gap-2">
              <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-base)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0fa47a_0%,#2d82b7_100%)] transition-all"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--color-text-soft)]">
                <span>Leitura documental, identificação de blocos e isolamento de pendências</span>
                <span>Próxima entrega: revisão por blocos</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Visão rápida
            </span>
            <div className="grid gap-2 text-[14px] text-[var(--color-text-default)]">
              <div className="flex items-center justify-between gap-3">
                <span>Blocos encontrados</span>
                <strong>{blocks.length}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Agentes mapeados</span>
                <strong>{metrics.agents.length}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Pendências previstas</span>
                <strong>{metrics.openPendencies.length}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label="Documentos lidos"
            value={analysis.documents}
            hint="Arquivos lidos e classificados"
            tone="positive"
          />
          <StatCard
            label="Blocos operacionais"
            value={blocks.length}
            hint="Setor/local + GHE + função + operação"
            tone="info"
          />
          <StatCard
            label="Agentes detectados"
            value={metrics.agents.length}
            hint="Agentes de higiene dentro dos blocos"
            tone="info"
          />
          <StatCard
            label="Agentes genéricos / pendentes"
            value={metrics.agentsWithoutMethod}
            hint="Precisam de complemento técnico"
            tone="critical"
          />
          <StatCard
            label="Pendências críticas"
            value={metrics.criticalPendencies.length}
            hint="Bloqueiam a evolução automática"
            tone={metrics.criticalPendencies.length ? "critical" : "positive"}
          />
          <StatCard
            label="Documentos fora do escopo"
            value={outOfScopeDocuments.length}
            hint="Ergonômicos, acidentes ou anexos sem uso"
            tone="status"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_340px]">
          <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Sequência técnica
            </p>
            <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Processamento orientado a blocos
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
              A extração agora encontra primeiro o bloco operacional e só então identifica os agentes de higiene dentro dele.
            </p>
            <div className="mt-5">
              <Timeline items={prhoProcessingSequence} />
            </div>
          </div>

          <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Painel lateral
            </p>
            <div className="grid gap-3">
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Blocos encontrados
                  </strong>
                  <Badge tone="processing">{blocks.length}</Badge>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Cabine de pintura, corte, forno e fracionamento já foram separados como blocos independentes.
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Agentes químicos mapeados
                  </strong>
                  <Badge tone="review">
                    {
                      metrics.agents.filter((agent) => agent.agentType === "Químico").length
                    }
                  </Badge>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Tolueno e benzeno ficaram vinculados ao bloco de pintura, com alerta para segredo industrial.
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Agentes físicos mapeados
                  </strong>
                  <Badge tone="status">
                    {
                      metrics.agents.filter((agent) => agent.agentType === "Físico").length
                    }
                  </Badge>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Ruído contínuo e calor IBUTG seguem com contexto operacional já separado por bloco.
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Pendências previstas
                  </strong>
                  <Badge tone={metrics.criticalPendencies.length ? "critical" : "review"}>
                    {metrics.openPendencies.length}
                  </Badge>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Segredo industrial, CAS ausente, bloco sem agente e dados operacionais incompletos já ficam isolados para a revisão.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <Panel className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Painel de pendências
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Priorização automática para a próxima revisão
                </h3>
                <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
                  O mockup já separa o que bloqueia a continuidade, o que exige complemento e o que pode seguir apenas com observação técnica.
                </p>
              </div>
              <Badge tone="processing">{processingProgress}% do fluxo lido</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-[#efcdcd] bg-[rgba(255,243,243,0.72)] p-4">
                <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  Críticas
                </strong>
                <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-soft)]">
                  {criticalPendencies.length} bloqueio imediato relacionado a segredo industrial ou ausência de dado essencial.
                </p>
              </div>
              <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  Altas
                </strong>
                <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-soft)]">
                  {highPendencies.length} pontos que pedem confirmação normativa ou complemento rastreável.
                </p>
              </div>
              <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                  Médias
                </strong>
                <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-soft)]">
                  {mediumPendencies.length} observação operacional para fechar jornada, pausa ou detalhe de cenário.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              {pendencies.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 md:grid-cols-[auto_minmax(0,1fr)_auto]"
                >
                  <Badge tone={getPendencyTone(item.severity)}>{item.severity}</Badge>
                  <div className="grid gap-1">
                    <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                      {item.title}
                    </strong>
                    <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                      {item.description}
                    </p>
                  </div>
                  <TechnicalBadge label={prhoPendingTypeLabels[item.type] || item.type} tone="status" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Base técnica integrada
              </p>
              <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Métodos que entram no enriquecimento
              </h3>
            </div>
            <div className="grid gap-3">
              {prhoNhoMethodLibrary.map((method) => (
                <div
                  key={method.id}
                  className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                        {method.label}
                      </strong>
                      <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                        {method.title}
                      </p>
                    </div>
                    <Badge tone="review">{method.appliesTo.length} agentes</Badge>
                  </div>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-soft)]">
                    {method.summary}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Panel>

      <Modal
        open={showNhoLibraryModal}
        title="Biblioteca NHO"
        description="Métodos disponíveis para apoiar o enriquecimento técnico durante o processamento."
        onClose={() => setShowNhoLibraryModal(false)}
        actions={[
          <Button key="close-processing-nho" variant="ghost" onClick={() => setShowNhoLibraryModal(false)}>
            Fechar
          </Button>,
        ]}
      >
        <div className="grid gap-3">
          {prhoNhoMethodLibrary.map((method) => (
            <div
              key={method.id}
              className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    {method.label} • {method.title}
                  </strong>
                  <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                    {method.summary}
                  </p>
                </div>
                <Badge tone="status">{method.appliesTo.length} aplicações</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {method.appliesTo.map((item) => (
                  <TechnicalBadge key={item} label={item} tone="review" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id);
  const [reviewRows, setReviewRows] = useState(() => prhoReviewAgents.map((item) => buildReviewRow(item)));
  const [reviewSnapshot, setReviewSnapshot] = useState(() =>
    Object.fromEntries(
      prhoReviewAgents.map((item) => {
        const row = buildReviewRow(item);
        return [row.id, row];
      }),
    ),
  );
  const [traceView, setTraceView] = useState({
    rowId: prhoReviewAgents[0]?.id,
    field: "cas",
  });
  const [showManualAgentForm, setShowManualAgentForm] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState([prhoReviewAgents[0]?.id]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewTypeFilter, setReviewTypeFilter] = useState("Todos");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("Todos");
  const [reviewPendingFilter, setReviewPendingFilter] = useState("Todas");
  const [activePendingModalId, setActivePendingModalId] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [manualAgentDraft, setManualAgentDraft] = useState(createManualAgentDraft);
  const [pendingReviewChange, setPendingReviewChange] = useState(null);
  const [pendingReviewChangeReason, setPendingReviewChangeReason] = useState("");
  const [reviewActionFeedback, setReviewActionFeedback] = useState(null);
  const [reviewRejectionDraft, setReviewRejectionDraft] = useState({
    rowId: "",
    reason: "Agente identificado incorretamente",
    details: "",
  });
  const [changeHistory, setChangeHistory] = useState([
    {
      id: "history-seed-01",
      agentId: "rv-02",
      agentName: "Ruído contínuo",
      field: "nr15Limit",
      label: prhoFieldLabels.nr15Limit,
      previousValue: "82 dB(A)",
      nextValue: "85 dB(A)",
      author: "Reginaldo Melo",
      at: "19/06/2026 08:47",
    },
    {
      id: "history-seed-02",
      agentId: "rv-03",
      agentName: "Benzeno",
      field: "reviewStatus",
      label: prhoFieldLabels.reviewStatus,
      previousValue: "Pendente",
      nextValue: "Segredo industrial",
      author: "Reginaldo Melo",
      at: "19/06/2026 08:53",
    },
  ]);
  const [reviewPendingItems, setReviewPendingItems] = useState(() =>
    prhoPendingItems.map((item) => {
      const link = getPendingSourceDocument(item.agentId);
      return {
        ...item,
        ...link,
        assignee: "Reginaldo Melo",
        recommendedAction: getPendingRecommendedAction(item.type),
        justification: "",
        evidenceName: "",
      };
    }),
  );

  const selectedDocument =
    documents.find((item) => item.id === selectedDocumentId) || documents[0];
  const pendingItems = reviewPendingItems.filter((item) => item.status !== "Resolvida");
  const criticalPendingItems = pendingItems.filter(
    (item) => item.severity === "Crítica" && item.status !== "Justificada",
  );
  const industrialSecretPending = reviewPendingItems.find(
    (item) => item.type === "industrial_secret" && item.status !== "Resolvida",
  );
  const normativeConflictPending = reviewPendingItems.find(
    (item) => item.type === "normative_conflict" && item.status !== "Resolvida",
  );
  const industrialSecretRows = reviewRows.filter(
    (row) =>
      row.pendingTypes?.includes("industrial_secret") ||
      row.reviewStatus === "Segredo industrial",
  ).length;
  const lowConfidenceReviewRows = reviewRows.filter((row) => (row.confidence || 0) < 70).length;
  const reviewedRows = reviewRows.filter(
    (row) => row.reviewStatus === "Aprovado" || row.reviewStatus === "Corrigido",
  ).length;
  const reviewedSources = new Set(reviewRows.map((row) => row.sourceDocumentId).filter(Boolean)).size;
  const incompleteReviewRows = reviewRows.filter((row) => getReviewApprovalIssues(row).length > 0).length;
  const activeTraceRow = reviewRows.find((row) => row.id === traceView.rowId) || reviewRows[0];
  const activeTrace =
    activeTraceRow?.traceability?.[traceView.field] ||
    getDefaultFieldTrace(activeTraceRow || {}, traceView.field);
  const filteredReviewRows = reviewRows.filter((row) => {
    const matchesSearch = !reviewSearch || row.name.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesType = reviewTypeFilter === "Todos" || row.agentType === reviewTypeFilter;
    const matchesStatus = reviewStatusFilter === "Todos" || row.reviewStatus === reviewStatusFilter;
    const matchesPending =
      reviewPendingFilter === "Todas" ||
      (reviewPendingFilter === "Críticas" && row.risk === "Crítica") ||
      (reviewPendingFilter === "Segredo industrial" && row.pendingTypes?.includes("industrial_secret")) ||
      (reviewPendingFilter === "Dados insuficientes" && row.technicalDecision === "Dados insuficientes");

    return matchesSearch && matchesType && matchesStatus && matchesPending;
  });
  const activePendingModal =
    reviewPendingItems.find((item) => item.id === activePendingModalId) || null;
  const canAdvanceToClassification =
    criticalPendingItems.length === 0 &&
    reviewRows.every((row) =>
      ["Aprovado", "Corrigido", "Reprovado", "Não aplicável"].includes(row.reviewStatus),
    );

  function updateReviewRow(agentId, field, value) {
    setReviewRows((current) =>
      current.map((row) => (row.id === agentId ? { ...row, [field]: value } : row)),
    );
  }

  function finalizeReviewRowCommit(agentId, field, value, justification = "") {
    const snapshotRow = reviewSnapshot[agentId];
    const previousValue = snapshotRow?.[field] ?? "";

    if (previousValue === value) {
      return;
    }

    const row = reviewRows.find((item) => item.id === agentId);
    if (!row) {
      return;
    }

    const nextTrace = {
      ...(row.traceability?.[field] || getDefaultFieldTrace(row, field)),
      document: row.manual ? row.source || "Inclusão manual" : row.source,
      location: row.manual ? "Responsável técnico" : row.sourcePage,
      excerpt:
        field === "manualJustification"
          ? value
          : row.traceability?.[field]?.excerpt || row.sourceExcerpt || "Trecho não informado.",
      extractedValue: value || "Sem valor informado",
      confidence: row.manual ? 100 : row.confidence,
      extractedAt: formatAuditDate(new Date()),
    };

    setReviewRows((current) =>
      current.map((item) =>
        item.id === agentId
          ? {
              ...item,
              traceability: {
                ...item.traceability,
                [field]: nextTrace,
              },
            }
          : item,
      ),
    );

    setReviewSnapshot((current) => ({
      ...current,
      [agentId]: {
        ...snapshotRow,
        [field]: value,
      },
    }));

    setChangeHistory((current) => [
      {
        id: `${agentId}-${field}-${Date.now()}`,
        agentId,
        agentName: row.name,
        field,
        label: prhoFieldLabels[field] || field,
        previousValue: previousValue || "Vazio",
        nextValue: value || "Vazio",
        author: "Reginaldo Melo",
        at: formatAuditDate(new Date()),
        justification,
      },
      ...current,
    ]);
  }

  function commitReviewRow(agentId, field, value) {
    const snapshotRow = reviewSnapshot[agentId];
    const previousValue = snapshotRow?.[field] ?? "";

    if (previousValue === value) {
      return;
    }

    if (requiresReviewChangeJustification(field)) {
      setPendingReviewChange({
        agentId,
        field,
        previousValue,
        nextValue: value,
      });
      setPendingReviewChangeReason("");
      return;
    }

    finalizeReviewRowCommit(agentId, field, value);
  }

  function cancelPendingReviewChange() {
    if (!pendingReviewChange) {
      return;
    }

    updateReviewRow(
      pendingReviewChange.agentId,
      pendingReviewChange.field,
      pendingReviewChange.previousValue,
    );
    setPendingReviewChange(null);
    setPendingReviewChangeReason("");
  }

  function confirmPendingReviewChange() {
    if (!pendingReviewChange || !pendingReviewChangeReason.trim()) {
      return;
    }

    finalizeReviewRowCommit(
      pendingReviewChange.agentId,
      pendingReviewChange.field,
      pendingReviewChange.nextValue,
      pendingReviewChangeReason,
    );
    setPendingReviewChange(null);
    setPendingReviewChangeReason("");
  }

  function toggleTrace(rowId, field) {
    setTraceView((current) =>
      current.rowId === rowId && current.field === field ? current : { rowId, field },
    );
    setShowSourceModal(true);
  }

  function toggleReviewExpansion(rowId) {
    setExpandedReviewIds((current) =>
      current.includes(rowId)
        ? current.filter((item) => item !== rowId)
        : [...current, rowId],
    );
  }

  function focusReviewAgent(rowId) {
    setExpandedReviewIds((current) =>
      current.includes(rowId) ? current : [...current, rowId],
    );
    setTimeout(() => {
      document.getElementById(`review-agent-${rowId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 10);
  }

  function updateManualAgentDraft(field, value) {
    setManualAgentDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetManualAgentModal() {
    setShowManualAgentForm(false);
    setManualAgentDraft(createManualAgentDraft());
  }

  function openManualAgentForm() {
    setManualAgentDraft(createManualAgentDraft());
    setShowManualAgentForm(true);
  }

  function applyManualAgentSuggestion(result, config = {}) {
    const {
      searchStatus = "success",
      searchMessage = "Dados técnicos encontrados. Revise as informações antes de salvar o agente.",
      inclusionOrigin = "Busca técnica automática",
    } = config;

    if (!result) {
      return;
    }

    setManualAgentDraft((current) => ({
      ...current,
      stage: "details",
      searchStatus,
      searchMessage,
      selectedSearchResultId: result.id || "",
      prefilledFromSearch: true,
      confidence: result.confidence || 0,
      confidenceLevel: result.confidenceLevel || "Médio",
      inclusionOrigin,
      name: result.name || current.searchQuery || current.name,
      standardizedName: result.standardizedName || "",
      agentType: result.agentType || current.agentType,
      cas: result.cas || "",
      synonyms: result.synonyms || "",
      unit: result.unit || "",
      physicalState: result.physicalState || "",
      suggestedMethod: result.suggestedMethod || "",
      nr15Applicable: result.nr15Applicable || "",
      nr15Annex: result.nr15Annex || "",
      nr15Limit: result.nr15Limit || "",
      acgihTwa: result.acgihTwa || "",
      esocialCode: result.esocialCode || "",
      decretoCode: result.decretoCode || "",
      linachStatus: result.linachStatus || "",
      targetOrgan: result.targetOrgan || "",
      aihaCategory: result.aihaCategory || "",
      technicalDecision: result.technicalDecision || current.technicalDecision,
      technicalRecommendation: result.technicalRecommendation || "",
      technicalObservation: result.technicalObservation || "",
      source: result.source || current.source,
      evidenceSource: result.evidenceSource || current.evidenceSource,
    }));
  }

  function runManualAgentSearch() {
    const query = manualAgentDraft.searchQuery.trim();
    if (!query) {
      setManualAgentDraft((current) => ({
        ...current,
        searchStatus: "idle",
        searchMessage: "Informe o nome do agente, CAS ou referência técnica antes de buscar.",
      }));
      return;
    }

    const match = findManualAgentSearchMatch(query);

    if (!match) {
      setManualAgentDraft((current) => ({
        ...current,
        searchStatus: "none",
        searchResults: [],
        selectedSearchResultId: "",
        prefilledFromSearch: false,
        confidence: 0,
        confidenceLevel: "Manual",
        name: "",
        standardizedName: "",
        cas: "",
        synonyms: "",
        unit: "",
        physicalState: "",
        suggestedMethod: "",
        nr15Applicable: "",
        nr15Annex: "",
        nr15Limit: "",
        acgihTwa: "",
        esocialCode: "",
        decretoCode: "",
        linachStatus: "",
        targetOrgan: "",
        aihaCategory: "",
        technicalDecision: "Avaliação manual necessária",
        technicalRecommendation: "",
        technicalObservation: "",
        source: "Complementação manual do responsável técnico",
        evidenceSource: "Base técnica interna / decisão humana",
        searchMessage:
          "Nenhum dado técnico foi encontrado para esta busca. Você pode continuar com preenchimento manual.",
      }));
      return;
    }

    if (match.status === "multiple") {
      setManualAgentDraft((current) => ({
        ...current,
        searchStatus: "multiple",
        searchResults: match.options || [],
        selectedSearchResultId: "",
        prefilledFromSearch: false,
        confidence: 0,
        confidenceLevel: "Médio",
        name: "",
        standardizedName: "",
        cas: "",
        synonyms: "",
        unit: "",
        physicalState: "",
        suggestedMethod: "",
        nr15Applicable: "",
        nr15Annex: "",
        nr15Limit: "",
        acgihTwa: "",
        esocialCode: "",
        decretoCode: "",
        linachStatus: "",
        targetOrgan: "",
        aihaCategory: "",
        technicalDecision: "Avaliação manual necessária",
        technicalRecommendation: "",
        technicalObservation: "",
        source: "Complementação manual do responsável técnico",
        evidenceSource: "Base técnica interna / decisão humana",
        searchMessage:
          "Encontramos agentes semelhantes. Selecione a opção correta para preencher o formulário.",
      }));
      return;
    }

    if (match.status === "partial") {
      applyManualAgentSuggestion(match, {
        searchStatus: "partial",
        searchMessage:
          "Encontramos dados parciais para este agente. Revise cuidadosamente antes de salvar.",
        inclusionOrigin: "Busca técnica com baixa confiança",
      });
      return;
    }

    applyManualAgentSuggestion(match);
  }

  function startManualWithoutSearch() {
    setManualAgentDraft((current) => ({
      ...current,
      stage: "details",
      searchStatus: current.searchStatus === "none" ? "none" : "manual",
      searchResults: [],
      selectedSearchResultId: "",
      prefilledFromSearch: false,
      confidence: 0,
      confidenceLevel: "Manual",
      inclusionOrigin: "Inclusão manual sem busca",
      name: current.searchQuery || current.name,
      standardizedName: "",
      source: "Complementação manual do responsável técnico",
      evidenceSource: "Base técnica interna / decisão humana",
      technicalDecision:
        current.technicalDecision === "Quantificar"
          ? "Avaliação manual necessária"
          : current.technicalDecision,
      searchMessage:
        current.searchStatus === "none"
          ? "A busca não encontrou correspondência. Continue com preenchimento manual completo."
          : "Você optou por adicionar o agente sem busca técnica automática.",
    }));
  }

  function addManualAgent() {
    if (!manualAgentDraft.name || !manualAgentDraft.manualJustification) {
      return;
    }

    const manualId = `manual-${Date.now()}`;
    const linkedPending = reviewPendingItems.find((item) => item.id === manualAgentDraft.relatedPendingId);
    const isLowConfidence =
      manualAgentDraft.confidenceLevel === "Baixo" ||
      (manualAgentDraft.prefilledFromSearch && manualAgentDraft.confidence < 70);
    const pendingTypes = [
      "manual_review_required",
      manualAgentDraft.industrialSecret ? "industrial_secret" : null,
      !manualAgentDraft.cas ? "missing_cas" : null,
    ].filter(Boolean);
    const sourceLabel = manualAgentDraft.prefilledFromSearch
      ? manualAgentDraft.source || "Busca técnica automática"
      : manualAgentDraft.source || "Complementação manual do responsável técnico";
    const confidenceValue = manualAgentDraft.prefilledFromSearch ? manualAgentDraft.confidence : 0;
    const riskValue =
      manualAgentDraft.aihaCategory === "Categoria 1"
        ? "Crítica"
        : manualAgentDraft.aihaCategory === "Categoria 2"
          ? "Alta"
          : manualAgentDraft.aihaCategory === "Categoria 4"
            ? "Baixa"
            : "Média";
    const referenceValue =
      manualAgentDraft.agentType === "Físico"
        ? manualAgentDraft.cas || manualAgentDraft.suggestedMethod || "Referência manual"
        : manualAgentDraft.cas || "";
    const manualRow = buildReviewRow(
      {
        id: manualId,
        name: manualAgentDraft.name,
        standardizedName: manualAgentDraft.standardizedName || manualAgentDraft.name,
        agentType: manualAgentDraft.agentType,
        cas: manualAgentDraft.cas || "Não informado",
        reference: referenceValue,
        synonyms: manualAgentDraft.synonyms,
        concentration: manualAgentDraft.concentration || "Não informado",
        unit: manualAgentDraft.unit || "A definir",
        physicalState: manualAgentDraft.physicalState || "A definir",
        sector: manualAgentDraft.sector || "",
        workerFunction: manualAgentDraft.workerFunction || "",
        ghe: manualAgentDraft.ghe || "",
        processActivity: manualAgentDraft.processActivity || manualAgentDraft.sector || "",
        exposureFrequency: manualAgentDraft.exposureFrequency,
        source: sourceLabel,
        evidenceSource: manualAgentDraft.evidenceSource,
        sourceDocumentId: selectedDocument?.id,
        sourcePage: "Inclusão manual",
        sourceExcerpt: manualAgentDraft.manualJustification,
        confidence: confidenceValue,
        confidenceLevel: manualAgentDraft.confidenceLevel,
        suggestedMethod: manualAgentDraft.suggestedMethod || "",
        nr15Applicable: manualAgentDraft.nr15Applicable || "Pendente de validação",
        nr15Annex: manualAgentDraft.nr15Annex || "",
        nr15Limit: manualAgentDraft.nr15Limit || "",
        acgihTwa: manualAgentDraft.acgihTwa || "",
        esocialCode: manualAgentDraft.esocialCode || "",
        decretoCode: manualAgentDraft.decretoCode || "",
        linachStatus: manualAgentDraft.linachStatus || "",
        targetOrgan: manualAgentDraft.targetOrgan || "",
        aihaCategory: manualAgentDraft.aihaCategory || "Categoria 3",
        risk: riskValue,
        technicalDecision: manualAgentDraft.technicalDecision || "Avaliação manual necessária",
        technicalRecommendation: manualAgentDraft.technicalRecommendation || "",
        technicalObservation: manualAgentDraft.technicalObservation || "",
        technicalJustification: manualAgentDraft.manualJustification,
        reviewStatus: manualAgentDraft.industrialSecret ? "Segredo industrial" : "Pendente",
        manual: true,
        prefilledFromSearch: manualAgentDraft.prefilledFromSearch,
        manualSearchStatus: manualAgentDraft.searchStatus,
        inclusionOrigin: manualAgentDraft.inclusionOrigin,
        manualJustification: manualAgentDraft.manualJustification,
        attachmentEvidence: manualAgentDraft.attachmentEvidence,
        relatedPendingId: manualAgentDraft.relatedPendingId,
        relatedProduct: manualAgentDraft.relatedProduct,
        hiddenComponent: manualAgentDraft.hiddenComponent,
        pendingTypes,
      },
      {
        traceability: Object.fromEntries(
          Object.keys(prhoFieldLabels).map((field) => [
            field,
            {
              document:
                manualAgentDraft.attachmentEvidence ||
                manualAgentDraft.evidenceSource ||
                sourceLabel,
              location: manualAgentDraft.prefilledFromSearch
                ? "Busca técnica assistida + revisão humana"
                : "Responsável técnico",
              excerpt: manualAgentDraft.manualJustification,
              originalValue: manualAgentDraft[field] || "Informação manual",
              extractedValue: manualAgentDraft[field] || "Informação manual",
              confidence: confidenceValue,
              extractedAt: formatAuditDate(new Date()),
            },
          ]),
        ),
      },
    );

    setReviewRows((current) => [manualRow, ...current]);
    setReviewSnapshot((current) => ({
      ...current,
      [manualId]: manualRow,
    }));
    setChangeHistory((current) => [
      {
        id: `${manualId}-created`,
        agentId: manualId,
        agentName: manualRow.name,
        field: "manual",
        label: "Inclusão manual",
        previousValue: "Sem agente",
        nextValue: manualAgentDraft.prefilledFromSearch
          ? isLowConfidence
            ? "Manual + dados sugeridos · baixa confiança"
            : "Manual + dados técnicos sugeridos"
          : manualAgentDraft.industrialSecret
            ? "Manual · Segredo industrial"
            : "Manual",
        author: "Reginaldo Melo",
        at: formatAuditDate(new Date()),
      },
      ...current,
    ]);
    if (linkedPending) {
      updatePendingItem(linkedPending.id, { status: "Em análise" });
    }
    setTraceView({ rowId: manualId, field: "manualJustification" });
    resetManualAgentModal();
  }

  function updatePendingItem(pendingId, patch) {
    setReviewPendingItems((current) =>
      current.map((item) => (item.id === pendingId ? { ...item, ...patch } : item)),
    );
  }

  function markPendingResolved(pendingId) {
    updatePendingItem(pendingId, { status: "Resolvida" });
  }

  function justifyPending(pendingId) {
    const item = reviewPendingItems.find((entry) => entry.id === pendingId);
    if (!item?.justification?.trim()) {
      return;
    }

    updatePendingItem(pendingId, { status: "Justificada" });
  }

  function attachPendingEvidence(pendingId) {
    const item = reviewPendingItems.find((entry) => entry.id === pendingId);
    if (!item?.evidenceName?.trim()) {
      return;
    }

    updatePendingItem(pendingId, { status: "Evidência anexada" });
  }

  function applyReviewStatus(row, nextStatus) {
    const approvalIssues =
      nextStatus === "Aprovado" ? getReviewApprovalIssues(row) : [];

    if (approvalIssues.length) {
      setReviewActionFeedback({
        title: "Este agente ainda possui pendências obrigatórias",
        description: `Corrija ou justifique antes de aprovar: ${approvalIssues.join(", ")}.`,
      });
      return;
    }

    if (nextStatus === "Corrigido" && !row.technicalJustification?.trim()) {
      setReviewActionFeedback({
        title: "Falta justificativa técnica",
        description:
          "Ao marcar como corrigido, registre a justificativa técnica para preservar a auditoria da revisão.",
      });
      return;
    }

    updateReviewRow(row.id, "reviewStatus", nextStatus);
    finalizeReviewRowCommit(row.id, "reviewStatus", nextStatus);
  }

  function openRejectionModal(row) {
    setReviewRejectionDraft({
      rowId: row.id,
      reason: "Agente identificado incorretamente",
      details: "",
    });
  }

  function confirmRejection() {
    const row = reviewRows.find((item) => item.id === reviewRejectionDraft.rowId);
    if (!row || !reviewRejectionDraft.reason.trim()) {
      return;
    }

    const rejectionNote =
      reviewRejectionDraft.reason === "Outro" && reviewRejectionDraft.details.trim()
        ? reviewRejectionDraft.details.trim()
        : reviewRejectionDraft.reason;
    const nextJustification = row.technicalJustification?.trim()
      ? `${row.technicalJustification}\nMotivo da reprovação: ${rejectionNote}.`
      : `Motivo da reprovação: ${rejectionNote}.`;

    updateReviewRow(row.id, "technicalJustification", nextJustification);
    finalizeReviewRowCommit(
      row.id,
      "technicalJustification",
      nextJustification,
      "Reprovação do agente registrada pelo responsável técnico.",
    );
    updateReviewRow(row.id, "reviewStatus", "Reprovado");
    finalizeReviewRowCommit(row.id, "reviewStatus", "Reprovado");
    setReviewRejectionDraft({
      rowId: "",
      reason: "Agente identificado incorretamente",
      details: "",
    });
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Revisão dos dados extraídos • ${analysis.code}`}
          description="Tabela APR HO editável, revisão humana obrigatória, rastreabilidade documental e bloqueio por pendências críticas."
          actions={[
            <Button
              key="classification"
              variant={canAdvanceToClassification ? "primary" : "tertiary"}
              className={canAdvanceToClassification ? "" : "opacity-60"}
              disabled={!canAdvanceToClassification}
              title="A revisão só libera a classificação quando não houver pendência crítica e todas as linhas estiverem tratadas."
              onClick={() => navigate(`/app/prho/${analysis.id}/classification`)}
            >
              Seguir para classificação
            </Button>,
          ]}
          meta={[
            <Badge key="rows" tone="status">
              {reviewRows.length} linhas APR HO
            </Badge>,
            <Badge key="pendings" tone={criticalPendingItems.length ? "critical" : "review"}>
              {pendingItems.length} pendências abertas
            </Badge>,
            <Badge key="reviewed" tone="processing">
              {reviewedRows} linhas revisadas
            </Badge>,
            <Badge key="sources" tone="review">
              {reviewedSources} fontes rastreadas
            </Badge>,
            <Badge key="industrial-secret" tone={industrialSecretRows ? "critical" : "status"}>
              {industrialSecretRows} segredo industrial
            </Badge>,
          ]}
        >
          <Stepper steps={flowSteps} current={2} />
        </PageHeader>
      }
      bodyClassName="grid gap-4"
    >
      <Panel className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <StatCard
            label="Documentos processados"
            value={documents.length}
            hint="Fontes carregadas na revisão"
            tone="info"
          />
          <StatCard
            label="Agentes identificados"
            value={reviewRows.length}
            hint="Linhas disponíveis para validação"
            tone="positive"
          />
          <StatCard
            label="Pendências críticas"
            value={criticalPendingItems.length}
            hint="Bloqueiam o avanço para classificação"
            tone={criticalPendingItems.length ? "critical" : "positive"}
          />
          <StatCard
            label="Baixa confiança"
            value={lowConfidenceReviewRows}
            hint="Agentes com extração sensível"
            tone={lowConfidenceReviewRows ? "critical" : "info"}
          />
          <StatCard
            label="Campos incompletos"
            value={incompleteReviewRows}
            hint="Ainda exigem correção ou justificativa"
            tone={incompleteReviewRows ? "critical" : "positive"}
          />
        </div>

        {lowConfidenceReviewRows ? (
          <Toast
            title="Extração com baixa confiança"
            description="Alguns agentes foram identificados com confiança reduzida. Revise campos técnicos e evidências antes de seguir."
          />
        ) : null}

        {normativeConflictPending ? (
          <Toast
            title="Divergência normativa identificada"
            description="O sistema encontrou conflito entre referências consultadas. Revise NR-15, eSocial, Decreto 3048/99 e LINACH antes da classificação."
          />
        ) : null}

        <Panel className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
            <div className="grid gap-1">
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Tabela APR HO para revisão
              </h3>
              <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
                Todos os campos ficam editáveis nesta etapa. A estrutura abaixo mantém a revisão humana como foco principal, com grupos completos da PRHO e sem scroll horizontal.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="review">
                {reviewedRows}/{reviewRows.length} revisadas
              </Badge>
              <Button
                variant="tertiary"
                onClick={openManualAgentForm}
              >
                Adicionar agente manualmente
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Buscar agente">
                <EditableInput
                  value={reviewSearch}
                  placeholder="Benzeno, ruído, tolueno..."
                  onChange={setReviewSearch}
                />
              </Field>
              <Field label="Tipo">
                <EditableSelect
                  value={reviewTypeFilter}
                  options={["Todos", "Químico", "Físico", "Biológico", "Ergonômico", "Acidente", "Outro"]}
                  onChange={setReviewTypeFilter}
                />
              </Field>
              <Field label="Status">
                <EditableSelect
                  value={reviewStatusFilter}
                  options={["Todos", ...prhoExtendedReviewStatusOptions]}
                  onChange={setReviewStatusFilter}
                />
              </Field>
              <Field label="Pendência">
                <EditableSelect
                  value={reviewPendingFilter}
                  options={["Todas", "Críticas", "Segredo industrial", "Dados insuficientes"]}
                  onChange={setReviewPendingFilter}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() => setExpandedReviewIds(filteredReviewRows.map((row) => row.id))}
              >
                Expandir todos
              </Button>
              <Button
                variant="ghost"
                className="min-h-9 px-3 text-[12px]"
                onClick={() => setExpandedReviewIds([])}
              >
                Recolher todos
              </Button>
            </div>
          </div>

          {industrialSecretPending ? (
            <div className="grid gap-4 rounded-[22px] border border-[#f3c4c4] bg-[var(--color-danger-100)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-danger-700)]">
                    Fluxo de segredo industrial
                  </p>
                  <h4 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                    {industrialSecretPending.title}
                  </h4>
                  <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    {industrialSecretPending.description}
                  </p>
                </div>
                <StatusBadge status={industrialSecretPending.status} />
              </div>
              <div className="grid gap-2 rounded-[18px] border border-[rgba(194,76,76,0.16)] bg-[var(--surface-base)] p-4 text-[13px] leading-6 text-[var(--color-text-soft)]">
                <p>
                  1. Solicite resposta do fabricante, FDS complementar ou justificativa técnica formal.
                </p>
                <p>
                  2. Se a composição vier fora da extração, complemente o agente manualmente preservando a origem.
                </p>
                <p>
                  3. Sem evidência ou justificativa, a análise continua bloqueada para classificação e aprovação.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="tertiary"
                  onClick={openManualAgentForm}
                >
                  Adicionar agente manualmente
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updatePendingItem(industrialSecretPending.id, { status: "Em análise" })
                  }
                >
                  Solicitar informação complementar
                </Button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3">
            {filteredReviewRows.map((row) => {
              const rowPendingList = reviewPendingItems.filter((item) => item.agentId === row.id);
              const isExpanded = expandedReviewIds.includes(row.id);
              const manualSummaryBadges = row.manual
                ? [
                    "Incluído manualmente",
                    row.prefilledFromSearch ? "Manual + dados técnicos sugeridos" : null,
                    row.reviewStatus !== "Aprovado" ? "Revisão obrigatória" : null,
                    row.pendingTypes?.includes("industrial_secret") || row.hiddenComponent
                      ? "Relacionado a segredo industrial"
                      : null,
                    row.confidenceLevel === "Baixo" ||
                    (row.prefilledFromSearch && row.confidence < 70)
                      ? "Baixa confiança"
                      : null,
                  ].filter(Boolean)
                : [];
              return (
              <div key={row.id} id={`review-agent-${row.id}`}>
                <CollapsibleAgentCard
                  isExpanded={isExpanded}
                  onToggle={() => toggleReviewExpansion(row.id)}
                  actions={[
                    <Badge key="confidence" tone="status">
                      {row.manual
                        ? row.prefilledFromSearch
                          ? `${row.confidenceLevel} · ${row.confidence}%`
                          : "Entrada manual"
                        : `IA ${row.confidence}%`}
                    </Badge>,
                  ]}
                  summary={(
                    <div className="grid gap-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={row.agentType === "Químico" ? "processing" : "status"}>
                          {row.agentType}
                        </Badge>
                        <StatusBadge status={row.reviewStatus} />
                        <RiskBadge level={row.risk} />
                        {manualSummaryBadges.map((badge) => (
                          <Badge
                            key={`${row.id}-${badge}`}
                            tone={
                              badge === "Baixa confiança" ||
                              badge === "Relacionado a segredo industrial"
                                ? "critical"
                                : "review"
                            }
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid gap-1">
                        <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                          {row.name}
                        </h4>
                        <p className="text-[14px] leading-6 text-[var(--color-text-default)]">
                          {row.agentType} · {row.reviewStatus} · {row.risk}
                        </p>
                        <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                          Decisão preliminar: {row.technicalDecision}
                        </p>
                        <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                          Pendências: {rowPendingList.length ? rowPendingList.map((item) => item.title).join(", ") : "Sem pendências"}.
                        </p>
                        <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                          Fonte: {row.source} ·{" "}
                          {row.manual
                            ? row.prefilledFromSearch
                              ? `confiança ${row.confidence}%`
                              : "inclusão manual"
                            : `IA ${row.confidence}%`}
                        </p>
                      </div>
                    </div>
                  )}
                >

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 1 · Identificação do agente
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
                    <ReviewField
                      label="Agente"
                      traceActive={traceView.rowId === row.id && traceView.field === "name"}
                      onTraceToggle={() => toggleTrace(row.id, "name")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "name")}
                    >
                      <EditableInput
                        value={row.name}
                        onChange={(value) => updateReviewRow(row.id, "name", value)}
                        onBlur={(value) => commitReviewRow(row.id, "name", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Tipo do agente"
                      traceActive={traceView.rowId === row.id && traceView.field === "agentType"}
                      onTraceToggle={() => toggleTrace(row.id, "agentType")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "agentType")}
                    >
                      <EditableSelect
                        value={row.agentType}
                        options={["Químico", "Físico", "Biológico", "Ergonômico", "Acidente", "Outro"]}
                        onChange={(value) => updateReviewRow(row.id, "agentType", value)}
                        onBlur={(value) => commitReviewRow(row.id, "agentType", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="CAS"
                      traceActive={traceView.rowId === row.id && traceView.field === "cas"}
                      onTraceToggle={() => toggleTrace(row.id, "cas")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "cas")}
                    >
                      <EditableInput
                        value={row.cas}
                        onChange={(value) => updateReviewRow(row.id, "cas", value)}
                        onBlur={(value) => commitReviewRow(row.id, "cas", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Referência técnica"
                      traceActive={traceView.rowId === row.id && traceView.field === "reference"}
                      onTraceToggle={() => toggleTrace(row.id, "reference")}
                    >
                      <EditableInput
                        value={row.reference}
                        onChange={(value) => updateReviewRow(row.id, "reference", value)}
                        onBlur={(value) => commitReviewRow(row.id, "reference", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Estado físico / natureza"
                      traceActive={traceView.rowId === row.id && traceView.field === "physicalState"}
                      onTraceToggle={() => toggleTrace(row.id, "physicalState")}
                    >
                      <EditableInput
                        value={row.physicalState}
                        onChange={(value) => updateReviewRow(row.id, "physicalState", value)}
                        onBlur={(value) => commitReviewRow(row.id, "physicalState", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Concentração / intensidade"
                      traceActive={traceView.rowId === row.id && traceView.field === "concentration"}
                      onTraceToggle={() => toggleTrace(row.id, "concentration")}
                    >
                      <EditableInput
                        value={row.concentration}
                        onChange={(value) => updateReviewRow(row.id, "concentration", value)}
                        onBlur={(value) => commitReviewRow(row.id, "concentration", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Unidade"
                      traceActive={traceView.rowId === row.id && traceView.field === "unit"}
                      onTraceToggle={() => toggleTrace(row.id, "unit")}
                    >
                      <EditableInput
                        value={row.unit}
                        onChange={(value) => updateReviewRow(row.id, "unit", value)}
                        onBlur={(value) => commitReviewRow(row.id, "unit", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 2 · Origem operacional
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
                    <ReviewField
                      label="Setor"
                      traceActive={traceView.rowId === row.id && traceView.field === "sector"}
                      onTraceToggle={() => toggleTrace(row.id, "sector")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "sector")}
                    >
                      <EditableInput
                        value={row.sector}
                        onChange={(value) => updateReviewRow(row.id, "sector", value)}
                        onBlur={(value) => commitReviewRow(row.id, "sector", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Função"
                      traceActive={traceView.rowId === row.id && traceView.field === "workerFunction"}
                      onTraceToggle={() => toggleTrace(row.id, "workerFunction")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "workerFunction")}
                    >
                      <EditableInput
                        value={row.workerFunction}
                        onChange={(value) => updateReviewRow(row.id, "workerFunction", value)}
                        onBlur={(value) => commitReviewRow(row.id, "workerFunction", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="GHE"
                      traceActive={traceView.rowId === row.id && traceView.field === "ghe"}
                      onTraceToggle={() => toggleTrace(row.id, "ghe")}
                    >
                      <EditableInput
                        value={row.ghe}
                        onChange={(value) => updateReviewRow(row.id, "ghe", value)}
                        onBlur={(value) => commitReviewRow(row.id, "ghe", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Processo / atividade"
                      traceActive={traceView.rowId === row.id && traceView.field === "processActivity"}
                      onTraceToggle={() => toggleTrace(row.id, "processActivity")}
                    >
                      <EditableInput
                        value={row.processActivity}
                        onChange={(value) => updateReviewRow(row.id, "processActivity", value)}
                        onBlur={(value) => commitReviewRow(row.id, "processActivity", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Frequência de uso ou exposição"
                      traceActive={traceView.rowId === row.id && traceView.field === "exposureFrequency"}
                      onTraceToggle={() => toggleTrace(row.id, "exposureFrequency")}
                    >
                      <EditableSelect
                        value={row.exposureFrequency}
                        options={prhoExposureFrequencyOptions}
                        onChange={(value) => updateReviewRow(row.id, "exposureFrequency", value)}
                        onBlur={(value) => commitReviewRow(row.id, "exposureFrequency", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Tempo de exposição"
                      traceActive={traceView.rowId === row.id && traceView.field === "exposureTime"}
                      onTraceToggle={() => toggleTrace(row.id, "exposureTime")}
                    >
                      <EditableInput
                        value={row.exposureTime}
                        placeholder="Ex.: 4h por turno"
                        onChange={(value) => updateReviewRow(row.id, "exposureTime", value)}
                        onBlur={(value) => commitReviewRow(row.id, "exposureTime", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 3 · Método e referências técnicas
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <ReviewField
                      label="Método sugerido"
                      traceActive={traceView.rowId === row.id && traceView.field === "suggestedMethod"}
                      onTraceToggle={() => toggleTrace(row.id, "suggestedMethod")}
                    >
                      <EditableInput
                        value={row.suggestedMethod}
                        onChange={(value) => updateReviewRow(row.id, "suggestedMethod", value)}
                        onBlur={(value) => commitReviewRow(row.id, "suggestedMethod", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Método validado"
                      traceActive={traceView.rowId === row.id && traceView.field === "validatedMethod"}
                      onTraceToggle={() => toggleTrace(row.id, "validatedMethod")}
                    >
                      <EditableInput
                        value={row.validatedMethod}
                        onChange={(value) => updateReviewRow(row.id, "validatedMethod", value)}
                        onBlur={(value) => commitReviewRow(row.id, "validatedMethod", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="NR-15 anexo"
                      traceActive={traceView.rowId === row.id && traceView.field === "nr15Annex"}
                      onTraceToggle={() => toggleTrace(row.id, "nr15Annex")}
                    >
                      <EditableInput
                        value={row.nr15Annex}
                        onChange={(value) => updateReviewRow(row.id, "nr15Annex", value)}
                        onBlur={(value) => commitReviewRow(row.id, "nr15Annex", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="NR-15 limite"
                      traceActive={traceView.rowId === row.id && traceView.field === "nr15Limit"}
                      onTraceToggle={() => toggleTrace(row.id, "nr15Limit")}
                    >
                      <EditableInput
                        value={row.nr15Limit}
                        onChange={(value) => updateReviewRow(row.id, "nr15Limit", value)}
                        onBlur={(value) => commitReviewRow(row.id, "nr15Limit", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="NHO aplicável"
                      traceActive={traceView.rowId === row.id && traceView.field === "nhoReference"}
                      onTraceToggle={() => toggleTrace(row.id, "nhoReference")}
                    >
                      <EditableInput
                        value={row.nhoReference}
                        onChange={(value) => updateReviewRow(row.id, "nhoReference", value)}
                        onBlur={(value) => commitReviewRow(row.id, "nhoReference", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="ACGIH TWA"
                      traceActive={traceView.rowId === row.id && traceView.field === "acgihTwa"}
                      onTraceToggle={() => toggleTrace(row.id, "acgihTwa")}
                    >
                      <EditableInput
                        value={row.acgihTwa}
                        onChange={(value) => updateReviewRow(row.id, "acgihTwa", value)}
                        onBlur={(value) => commitReviewRow(row.id, "acgihTwa", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="ACGIH STEL"
                      traceActive={traceView.rowId === row.id && traceView.field === "acgihStel"}
                      onTraceToggle={() => toggleTrace(row.id, "acgihStel")}
                    >
                      <EditableInput
                        value={row.acgihStel}
                        onChange={(value) => updateReviewRow(row.id, "acgihStel", value)}
                        onBlur={(value) => commitReviewRow(row.id, "acgihStel", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="NIOSH TWA"
                      traceActive={traceView.rowId === row.id && traceView.field === "nioshTwa"}
                      onTraceToggle={() => toggleTrace(row.id, "nioshTwa")}
                    >
                      <EditableInput
                        value={row.nioshTwa}
                        onChange={(value) => updateReviewRow(row.id, "nioshTwa", value)}
                        onBlur={(value) => commitReviewRow(row.id, "nioshTwa", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Limite de ação"
                      traceActive={traceView.rowId === row.id && traceView.field === "actionLimit"}
                      onTraceToggle={() => toggleTrace(row.id, "actionLimit")}
                    >
                      <EditableInput
                        value={row.actionLimit}
                        onChange={(value) => updateReviewRow(row.id, "actionLimit", value)}
                        onBlur={(value) => commitReviewRow(row.id, "actionLimit", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Unidade do limite"
                      traceActive={traceView.rowId === row.id && traceView.field === "limitUnit"}
                      onTraceToggle={() => toggleTrace(row.id, "limitUnit")}
                    >
                      <EditableInput
                        value={row.limitUnit}
                        onChange={(value) => updateReviewRow(row.id, "limitUnit", value)}
                        onBlur={(value) => commitReviewRow(row.id, "limitUnit", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 4 · Trabalhista / previdenciário
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <ReviewField
                      label="eSocial"
                      traceActive={traceView.rowId === row.id && traceView.field === "esocialStatus"}
                      onTraceToggle={() => toggleTrace(row.id, "esocialStatus")}
                    >
                      <EditableSelect
                        value={row.esocialStatus}
                        options={prhoEsocialOptions}
                        onChange={(value) => updateReviewRow(row.id, "esocialStatus", value)}
                        onBlur={(value) => commitReviewRow(row.id, "esocialStatus", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Código eSocial / Tabela 24"
                      traceActive={traceView.rowId === row.id && traceView.field === "esocialCode"}
                      onTraceToggle={() => toggleTrace(row.id, "esocialCode")}
                    >
                      <EditableInput
                        value={row.esocialCode}
                        onChange={(value) => updateReviewRow(row.id, "esocialCode", value)}
                        onBlur={(value) => commitReviewRow(row.id, "esocialCode", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Decreto 3048/99"
                      traceActive={traceView.rowId === row.id && traceView.field === "decretoCode"}
                      onTraceToggle={() => toggleTrace(row.id, "decretoCode")}
                    >
                      <EditableInput
                        value={row.decretoCode}
                        onChange={(value) => updateReviewRow(row.id, "decretoCode", value)}
                        onBlur={(value) => commitReviewRow(row.id, "decretoCode", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Aposentadoria especial"
                      traceActive={traceView.rowId === row.id && traceView.field === "retirementSpecial"}
                      onTraceToggle={() => toggleTrace(row.id, "retirementSpecial")}
                    >
                      <EditableSelect
                        value={row.retirementSpecial}
                        options={prhoRetirementOptions}
                        onChange={(value) => updateReviewRow(row.id, "retirementSpecial", value)}
                        onBlur={(value) => commitReviewRow(row.id, "retirementSpecial", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Observação previdenciária"
                      full
                      traceActive={
                        traceView.rowId === row.id &&
                        traceView.field === "previdentiaryObservation"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "previdentiaryObservation")}
                    >
                      <EditableInput
                        rows={2}
                        value={row.previdentiaryObservation}
                        onChange={(value) =>
                          updateReviewRow(row.id, "previdentiaryObservation", value)
                        }
                        onBlur={(value) =>
                          commitReviewRow(row.id, "previdentiaryObservation", value)
                        }
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 5 · Carcinogenicidade
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <ReviewField
                      label="LINACH"
                      traceActive={traceView.rowId === row.id && traceView.field === "linachStatus"}
                      onTraceToggle={() => toggleTrace(row.id, "linachStatus")}
                    >
                      <EditableInput
                        value={row.linachStatus}
                        onChange={(value) => updateReviewRow(row.id, "linachStatus", value)}
                        onBlur={(value) => commitReviewRow(row.id, "linachStatus", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Grupo carcinogênico"
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "carcinogenicGroup"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "carcinogenicGroup")}
                    >
                      <EditableInput
                        value={row.carcinogenicGroup}
                        onChange={(value) => updateReviewRow(row.id, "carcinogenicGroup", value)}
                        onBlur={(value) => commitReviewRow(row.id, "carcinogenicGroup", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Carcinogenicidade"
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "carcinogenicity"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "carcinogenicity")}
                    >
                      <EditableSelect
                        value={row.carcinogenicity}
                        options={prhoCarcinogenicityOptions}
                        onChange={(value) => updateReviewRow(row.id, "carcinogenicity", value)}
                        onBlur={(value) => commitReviewRow(row.id, "carcinogenicity", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Mutagenicidade"
                      traceActive={traceView.rowId === row.id && traceView.field === "mutagenicity"}
                      onTraceToggle={() => toggleTrace(row.id, "mutagenicity")}
                    >
                      <EditableSelect
                        value={row.mutagenicity}
                        options={prhoMutagenicityOptions}
                        onChange={(value) => updateReviewRow(row.id, "mutagenicity", value)}
                        onBlur={(value) => commitReviewRow(row.id, "mutagenicity", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Justificativa carcinogenicidade"
                      full
                      traceActive={
                        traceView.rowId === row.id &&
                        traceView.field === "carcinogenicJustification"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "carcinogenicJustification")}
                    >
                      <EditableInput
                        rows={2}
                        value={row.carcinogenicJustification}
                        onChange={(value) =>
                          updateReviewRow(row.id, "carcinogenicJustification", value)
                        }
                        onBlur={(value) =>
                          commitReviewRow(row.id, "carcinogenicJustification", value)
                        }
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 6 · Órgão alvo
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <ReviewField
                      label="Órgão alvo"
                      traceActive={traceView.rowId === row.id && traceView.field === "targetOrgan"}
                      onTraceToggle={() => toggleTrace(row.id, "targetOrgan")}
                    >
                      <EditableInput
                        value={row.targetOrgan}
                        onChange={(value) => updateReviewRow(row.id, "targetOrgan", value)}
                        onBlur={(value) => commitReviewRow(row.id, "targetOrgan", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 7 · AIHA / criticidade preliminar
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <ReviewField
                      label="Categoria AIHA"
                      traceActive={traceView.rowId === row.id && traceView.field === "aihaCategory"}
                      onTraceToggle={() => toggleTrace(row.id, "aihaCategory")}
                    >
                      <EditableSelect
                        value={row.aihaCategory}
                        options={prhoCategoryOptions}
                        onChange={(value) => updateReviewRow(row.id, "aihaCategory", value)}
                        onBlur={(value) => commitReviewRow(row.id, "aihaCategory", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Criticidade preliminar"
                      traceActive={traceView.rowId === row.id && traceView.field === "risk"}
                      onTraceToggle={() => toggleTrace(row.id, "risk")}
                    >
                      <EditableSelect
                        value={row.risk}
                        options={prhoCriticalityOptions}
                        onChange={(value) => updateReviewRow(row.id, "risk", value)}
                        onBlur={(value) => commitReviewRow(row.id, "risk", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Base da criticidade"
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "criticalityBasis"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "criticalityBasis")}
                    >
                      <EditableInput
                        value={row.criticalityBasis}
                        onChange={(value) => updateReviewRow(row.id, "criticalityBasis", value)}
                        onBlur={(value) => commitReviewRow(row.id, "criticalityBasis", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Frequência sugerida"
                      traceActive={traceView.rowId === row.id && traceView.field === "frequency"}
                      onTraceToggle={() => toggleTrace(row.id, "frequency")}
                    >
                      <EditableSelect
                        value={row.frequency}
                        options={prhoFrequencyOptions}
                        onChange={(value) => updateReviewRow(row.id, "frequency", value)}
                        onBlur={(value) => commitReviewRow(row.id, "frequency", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 8 · Decisão técnica preliminar
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <ReviewField
                      label="Decisão técnica"
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "technicalDecision"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "technicalDecision")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "technicalDecision")}
                    >
                      <EditableSelect
                        value={row.technicalDecision}
                        options={[
                          "Quantificar",
                          "Não quantificar",
                          "Solicitar informação complementar",
                          "Aguardar FDS/FISPQ",
                          "Aguardar setor/função/GHE",
                          "Avaliação manual necessária",
                          "Dados insuficientes",
                          "Não aplicável",
                        ]}
                        onChange={(value) => updateReviewRow(row.id, "technicalDecision", value)}
                        onBlur={(value) => commitReviewRow(row.id, "technicalDecision", value)}
                      />
                    </ReviewField>
                    <ReviewField
                      label="Status da revisão"
                      traceActive={traceView.rowId === row.id && traceView.field === "reviewStatus"}
                      onTraceToggle={() => toggleTrace(row.id, "reviewStatus")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "reviewStatus")}
                    >
                      <EditableSelect
                        value={row.reviewStatus}
                        options={prhoExtendedReviewStatusOptions}
                        onChange={(value) => updateReviewRow(row.id, "reviewStatus", value)}
                        onBlur={(value) => commitReviewRow(row.id, "reviewStatus", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Grupo 9 · Justificativa e recomendação
                  </p>
                  <div className="grid gap-3 xl:grid-cols-3">
                    <ReviewField
                      label="Justificativa técnica"
                      full
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "technicalJustification"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "technicalJustification")}
                      sourceType={row.manual ? "Manual" : "IA"}
                      confidence={row.manual ? 100 : row.confidence}
                      validationState={getReviewFieldState(row, "technicalJustification")}
                    >
                      <EditableInput
                        rows={3}
                        value={row.technicalJustification}
                        onChange={(value) =>
                          updateReviewRow(row.id, "technicalJustification", value)
                        }
                        onBlur={(value) =>
                          commitReviewRow(row.id, "technicalJustification", value)
                        }
                      />
                    </ReviewField>
                    <ReviewField
                      label="Recomendação técnica"
                      full
                      traceActive={
                        traceView.rowId === row.id && traceView.field === "technicalRecommendation"
                      }
                      onTraceToggle={() => toggleTrace(row.id, "technicalRecommendation")}
                    >
                      <EditableInput
                        rows={3}
                        value={row.technicalRecommendation}
                        onChange={(value) =>
                          updateReviewRow(row.id, "technicalRecommendation", value)
                        }
                        onBlur={(value) =>
                          commitReviewRow(row.id, "technicalRecommendation", value)
                        }
                      />
                    </ReviewField>
                    <ReviewField
                      label="Observação operacional"
                      full
                      traceActive={traceView.rowId === row.id && traceView.field === "observation"}
                      onTraceToggle={() => toggleTrace(row.id, "observation")}
                    >
                      <EditableInput
                        rows={3}
                        value={row.observation}
                        onChange={(value) => updateReviewRow(row.id, "observation", value)}
                        onBlur={(value) => commitReviewRow(row.id, "observation", value)}
                      />
                    </ReviewField>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <ReviewField
                    label="Trecho rastreável"
                    full
                    traceActive={traceView.rowId === row.id && traceView.field === "sourceExcerpt"}
                    onTraceToggle={() => toggleTrace(row.id, "sourceExcerpt")}
                  >
                    <EditableInput
                      rows={3}
                      value={row.sourceExcerpt}
                      onChange={(value) => updateReviewRow(row.id, "sourceExcerpt", value)}
                      onBlur={(value) => commitReviewRow(row.id, "sourceExcerpt", value)}
                    />
                  </ReviewField>

                  <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                      Rastreabilidade por campo
                    </p>
                    <div className="grid gap-2">
                      <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                        {traceView.rowId === row.id
                          ? prhoFieldLabels[traceView.field] || traceView.field
                          : "Selecione um campo deste card"}
                      </strong>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Documento: {traceView.rowId === row.id ? activeTrace?.document : "Clique em “Fonte IA” para abrir a origem deste agente."}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Página / origem: {traceView.rowId === row.id ? activeTrace?.location : "—"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Trecho: {traceView.rowId === row.id ? activeTrace?.excerpt : "—"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Valor original: {traceView.rowId === row.id ? activeTrace?.originalValue : "—"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Valor atual: {traceView.rowId === row.id ? activeTrace?.extractedValue : "—"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Confiança: {traceView.rowId === row.id ? `${activeTrace?.confidence}%` : "—"}
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Data da extração: {traceView.rowId === row.id ? activeTrace?.extractedAt : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--color-border-subtle)] pt-3">
                  <Button
                    variant="tertiary"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => applyReviewStatus(row, "Aprovado")}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant="secondary"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => applyReviewStatus(row, "Corrigido")}
                  >
                    Corrigir
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => setActivePendingModalId(rowPendingList[0]?.id || null)}
                  >
                    Criar / resolver pendência
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={openManualAgentForm}
                  >
                    Adicionar agente manual
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => setShowSourceModal(true)}
                  >
                    Visualizar fonte
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => {
                      updateReviewRow(row.id, "reviewStatus", "Não aplicável");
                      finalizeReviewRowCommit(row.id, "reviewStatus", "Não aplicável");
                    }}
                  >
                    Não aplicável
                  </Button>
                  <Button
                    variant="destructive"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => openRejectionModal(row)}
                  >
                    Reprovar
                  </Button>
                </div>
                </CollapsibleAgentCard>
              </div>
            )})}
          </div>
        </Panel>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start">
          {pendingItems.length ? (
            <Panel className="grid gap-3 self-start">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Pendências da revisão
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Itens que exigem atenção
                </h3>
              </div>
              <div className="grid gap-3">
                {pendingItems.map((item) => (
                  <PendingIssueCard
                    key={item.id}
                    type={item.title}
                    severity={item.severity}
                    agent={item.relatedTo || "Agente"}
                    document={item.sourceDocument || "Documento rastreado"}
                    status={item.status}
                    description={item.description}
                    actions={[
                      <Button
                        key="view-agent"
                        variant="ghost"
                        className="min-h-9 px-3 text-[12px]"
                        onClick={() => focusReviewAgent(item.agentId)}
                      >
                        Ver agente relacionado
                      </Button>,
                      <Button
                        key="resolve-pending"
                        variant="primary"
                        className="min-h-9 px-3 text-[12px]"
                        onClick={() => setActivePendingModalId(item.id)}
                      >
                        Resolver pendência
                      </Button>,
                    ]}
                  >
                    <div className="grid gap-2">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                        Ação recomendada
                      </p>
                      <p className="text-[13px] leading-5 text-[var(--color-text-default)]">
                        {item.recommendedAction}
                      </p>
                    </div>
                  </PendingIssueCard>
                ))}
              </div>
            </Panel>
          ) : null}

          <Panel className="grid gap-3 self-start">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Fontes da análise
              </p>
              <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Documentos processados
              </h3>
            </div>
            <div className="grid gap-3">
              {documents.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedDocumentId(file.id)}
                  className={cn(
                    "grid gap-2.5 rounded-[18px] border p-3.5 text-left transition",
                    file.id === selectedDocumentId
                      ? "border-[#b9d8eb] bg-[var(--tab-active-bg)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--surface-muted)]",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                      {file.name}
                    </strong>
                    <StatusBadge status={file.status} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TechnicalBadge label={file.detectedType} tone="review" />
                    {file.pages ? <TechnicalBadge label={`${file.pages} páginas`} tone="review" /> : null}
                    {file.sheets ? <TechnicalBadge label={`${file.sheets} abas`} tone="review" /> : null}
                    {file.agentCount ? <TechnicalBadge label={`${file.agentCount} agentes`} tone="status" /> : null}
                  </div>
                  <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    {file.preview}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[12px] font-semibold text-[var(--color-brand-blue-700)]">
                    <span>Visualizar</span>
                    <span>Reprocessar</span>
                    <span>Marcar revisado</span>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="grid gap-3">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Histórico de alterações
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Ajustes manuais salvos com auditoria
            </h3>
          </div>
          <div className="grid gap-3">
            {changeHistory.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="grid gap-2 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="grid gap-1">
                  <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                    {entry.agentName} · {entry.label}
                  </strong>
                  <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    {entry.previousValue} → {entry.nextValue}
                  </p>
                  {entry.justification ? (
                    <p className="text-[12px] leading-5 text-[var(--color-text-default)]">
                      Justificativa: {entry.justification}
                    </p>
                  ) : null}
                </div>
                <div className="grid justify-start gap-1 text-[12px] text-[var(--color-text-soft)] md:justify-end md:text-right">
                  <span>{entry.author}</span>
                  <span>{entry.at}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Panel>

      <Modal
        open={showManualAgentForm}
        title="Adicionar agente manual"
        description={
          manualAgentDraft.stage === "search"
            ? "Inclua um agente não identificado automaticamente ou complemente informações obtidas após revisão técnica. Informe o nome, CAS ou referência técnica para que o sistema tente buscar os dados automaticamente."
            : "Revise os dados técnicos sugeridos e complete as informações contextuais antes de salvar o agente manual."
        }
        actions={
          manualAgentDraft.stage === "search"
            ? [
                <Button key="cancel" variant="ghost" onClick={resetManualAgentModal}>
                  Cancelar
                </Button>,
                <Button key="manual" variant="tertiary" onClick={startManualWithoutSearch}>
                  Adicionar sem buscar
                </Button>,
                <Button key="search" onClick={runManualAgentSearch}>
                  Buscar dados técnicos
                </Button>,
              ]
            : [
                <Button
                  key="back"
                  variant="ghost"
                  onClick={() =>
                    setManualAgentDraft((current) => ({
                      ...current,
                      stage: "search",
                    }))
                  }
                >
                  Voltar
                </Button>,
                <Button key="cancel" variant="ghost" onClick={resetManualAgentModal}>
                  Cancelar
                </Button>,
                <Button key="save" onClick={addManualAgent}>
                  Salvar agente manual
                </Button>,
              ]
        }
      >
        {manualAgentDraft.stage === "search" ? (
          <div className="grid gap-5">
            <Field label="Nome do agente, CAS ou referência técnica">
              <EditableInput
                value={manualAgentDraft.searchQuery}
                placeholder="Ex.: Xileno, Tolueno, 108-88-3, Ruído contínuo, Calor IBUTG"
                onChange={(value) => updateManualAgentDraft("searchQuery", value)}
              />
            </Field>

            {manualAgentDraft.searchMessage ? (
              <div
                className={cn(
                  "grid gap-2 rounded-[20px] border px-4 py-3",
                  manualAgentDraft.searchStatus === "none"
                    ? "border-[#f3c4c4] bg-[var(--color-danger-100)]"
                    : manualAgentDraft.searchStatus === "multiple"
                      ? "border-[var(--color-border-subtle)] bg-[var(--surface-muted)]"
                      : manualAgentDraft.searchStatus === "partial"
                        ? "border-[#f2d9b4] bg-[var(--color-warning-100)]"
                        : "border-[#b9d8eb] bg-[var(--tab-active-bg)]",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      manualAgentDraft.searchStatus === "none"
                        ? "critical"
                        : manualAgentDraft.searchStatus === "partial"
                          ? "noQuantify"
                          : "review"
                    }
                  >
                    {manualAgentDraft.searchStatus === "multiple"
                      ? "Múltiplos resultados"
                      : manualAgentDraft.searchStatus === "partial"
                        ? "Baixa confiança"
                        : manualAgentDraft.searchStatus === "none"
                          ? "Sem correspondência"
                          : "Busca técnica"}
                  </Badge>
                  <span className="text-[13px] font-medium text-[var(--color-text-strong)]">
                    {manualAgentDraft.searchMessage}
                  </span>
                </div>
              </div>
            ) : null}

            {manualAgentDraft.searchStatus === "multiple" ? (
              <div className="grid gap-3">
                {(manualAgentDraft.searchResults || []).map((option) => (
                  <div
                    key={option.id}
                    className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div className="grid gap-1">
                      <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                        {option.label}
                      </strong>
                      <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        {option.agentType} · {option.suggestedMethod} · {option.nr15Annex || "Sem anexo"}
                      </p>
                    </div>
                    <Button
                      variant="tertiary"
                      onClick={() =>
                        applyManualAgentSuggestion(option, {
                          searchStatus: "success",
                          searchMessage:
                            "Dados técnicos encontrados. Revise as informações antes de salvar o agente.",
                          inclusionOrigin: "Busca técnica com seleção manual",
                        })
                      }
                    >
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="review">
                {manualAgentDraft.prefilledFromSearch
                  ? "Preenchido automaticamente"
                  : "Preenchimento manual"}
              </Badge>
              {manualAgentDraft.prefilledFromSearch ? (
                <Badge tone={manualAgentDraft.confidenceLevel === "Baixo" ? "critical" : "status"}>
                  {manualAgentDraft.confidenceLevel} {manualAgentDraft.confidence ? `· ${manualAgentDraft.confidence}%` : ""}
                </Badge>
              ) : null}
              <Badge tone="status">{manualAgentDraft.inclusionOrigin}</Badge>
              {manualAgentDraft.evidenceSource ? (
                <Badge tone="processing">{manualAgentDraft.evidenceSource}</Badge>
              ) : null}
            </div>

            {manualAgentDraft.searchMessage ? (
              <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-soft)]">
                {manualAgentDraft.searchMessage}
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Nome do agente">
                <EditableInput
                  value={manualAgentDraft.name}
                  placeholder="Ex.: Xileno"
                  onChange={(value) => updateManualAgentDraft("name", value)}
                />
              </Field>
              <Field label="Nome padronizado">
                <EditableInput
                  value={manualAgentDraft.standardizedName}
                  onChange={(value) => updateManualAgentDraft("standardizedName", value)}
                />
              </Field>
              <Field label="Tipo do agente">
                <EditableSelect
                  value={manualAgentDraft.agentType}
                  options={["Químico", "Físico", "Biológico", "Ergonômico", "Acidente", "Outro"]}
                  onChange={(value) => updateManualAgentDraft("agentType", value)}
                />
              </Field>
              <Field label="CAS / referência técnica">
                <EditableInput
                  value={manualAgentDraft.cas}
                  onChange={(value) => updateManualAgentDraft("cas", value)}
                />
              </Field>
              <Field label="Sinônimos">
                <EditableInput
                  value={manualAgentDraft.synonyms}
                  onChange={(value) => updateManualAgentDraft("synonyms", value)}
                />
              </Field>
              <Field label="Estado físico / natureza">
                <EditableInput
                  value={manualAgentDraft.physicalState}
                  onChange={(value) => updateManualAgentDraft("physicalState", value)}
                />
              </Field>
              <Field label="Concentração / intensidade">
                <EditableInput
                  value={manualAgentDraft.concentration}
                  onChange={(value) => updateManualAgentDraft("concentration", value)}
                />
              </Field>
              <Field label="Unidade">
                <EditableInput
                  value={manualAgentDraft.unit}
                  onChange={(value) => updateManualAgentDraft("unit", value)}
                />
              </Field>
              <Field label="Setor">
                <EditableInput
                  value={manualAgentDraft.sector}
                  onChange={(value) => updateManualAgentDraft("sector", value)}
                />
              </Field>
              <Field label="Função">
                <EditableInput
                  value={manualAgentDraft.workerFunction}
                  onChange={(value) => updateManualAgentDraft("workerFunction", value)}
                />
              </Field>
              <Field label="GHE">
                <EditableInput
                  value={manualAgentDraft.ghe}
                  onChange={(value) => updateManualAgentDraft("ghe", value)}
                />
              </Field>
              <Field label="Frequência de uso ou exposição">
                <EditableSelect
                  value={manualAgentDraft.exposureFrequency}
                  options={prhoExposureFrequencyOptions}
                  onChange={(value) => updateManualAgentDraft("exposureFrequency", value)}
                />
              </Field>
              <Field label="Processo / atividade">
                <EditableInput
                  value={manualAgentDraft.processActivity}
                  onChange={(value) => updateManualAgentDraft("processActivity", value)}
                />
              </Field>
              <Field label="Método sugerido">
                <EditableInput
                  value={manualAgentDraft.suggestedMethod}
                  onChange={(value) => updateManualAgentDraft("suggestedMethod", value)}
                />
              </Field>
              <Field label="NR15 aplicável">
                <EditableInput
                  value={manualAgentDraft.nr15Applicable}
                  onChange={(value) => updateManualAgentDraft("nr15Applicable", value)}
                />
              </Field>
              <Field label="Anexo NR15">
                <EditableInput
                  value={manualAgentDraft.nr15Annex}
                  onChange={(value) => updateManualAgentDraft("nr15Annex", value)}
                />
              </Field>
              <Field label="Limite NR15">
                <EditableInput
                  value={manualAgentDraft.nr15Limit}
                  onChange={(value) => updateManualAgentDraft("nr15Limit", value)}
                />
              </Field>
              <Field label="ACGIH / TWA">
                <EditableInput
                  value={manualAgentDraft.acgihTwa}
                  onChange={(value) => updateManualAgentDraft("acgihTwa", value)}
                />
              </Field>
              <Field label="eSocial / Tabela 24">
                <EditableInput
                  value={manualAgentDraft.esocialCode}
                  onChange={(value) => updateManualAgentDraft("esocialCode", value)}
                />
              </Field>
              <Field label="Decreto 3048/99">
                <EditableInput
                  value={manualAgentDraft.decretoCode}
                  onChange={(value) => updateManualAgentDraft("decretoCode", value)}
                />
              </Field>
              <Field label="LINACH / carcinogenicidade">
                <EditableInput
                  value={manualAgentDraft.linachStatus}
                  onChange={(value) => updateManualAgentDraft("linachStatus", value)}
                />
              </Field>
              <Field label="Órgão alvo">
                <EditableInput
                  value={manualAgentDraft.targetOrgan}
                  onChange={(value) => updateManualAgentDraft("targetOrgan", value)}
                />
              </Field>
              <Field label="Categoria preliminar">
                <EditableSelect
                  value={manualAgentDraft.aihaCategory || "Categoria 3"}
                  options={prhoCategoryOptions}
                  onChange={(value) => updateManualAgentDraft("aihaCategory", value)}
                />
              </Field>
              <Field label="Decisão técnica sugerida">
                <EditableSelect
                  value={manualAgentDraft.technicalDecision}
                  options={prhoDecisionOptions}
                  onChange={(value) => updateManualAgentDraft("technicalDecision", value)}
                />
              </Field>
              <Field label="Origem da inclusão">
                <EditableSelect
                  value={manualAgentDraft.inclusionOrigin}
                  options={[
                    "Busca técnica automática",
                    "Busca técnica com seleção manual",
                    "Busca técnica com baixa confiança",
                    "Inclusão manual sem busca",
                    "Correção humana",
                    "Informação do fabricante",
                    "Agente não identificado pela IA",
                    "Complemento de PGR/LTCAT",
                    "Complemento de planilha",
                    "Outra fonte",
                  ]}
                  onChange={(value) => updateManualAgentDraft("inclusionOrigin", value)}
                />
              </Field>
              <Field label="Fonte da informação">
                <EditableInput
                  value={manualAgentDraft.source}
                  onChange={(value) => updateManualAgentDraft("source", value)}
                />
              </Field>
              <Field label="Fontes consultadas">
                <EditableInput
                  value={manualAgentDraft.evidenceSource}
                  onChange={(value) => updateManualAgentDraft("evidenceSource", value)}
                />
              </Field>
              <Field label="Pendência relacionada">
                <EditableSelect
                  value={manualAgentDraft.relatedPendingId || "none"}
                  options={[
                    "none",
                    ...reviewPendingItems.map((item) => item.id),
                  ]}
                  onChange={(value) =>
                    updateManualAgentDraft("relatedPendingId", value === "none" ? "" : value)
                  }
                />
              </Field>
              <Field label="Produto / mistura relacionada">
                <EditableInput
                  value={manualAgentDraft.relatedProduct}
                  onChange={(value) => updateManualAgentDraft("relatedProduct", value)}
                />
              </Field>
              <Field label="Componente oculto / segredo industrial">
                <EditableInput
                  value={manualAgentDraft.hiddenComponent}
                  placeholder="Opcional"
                  onChange={(value) => updateManualAgentDraft("hiddenComponent", value)}
                />
              </Field>
              <Field label="Anexo / evidência">
                <EditableInput
                  value={manualAgentDraft.attachmentEvidence}
                  placeholder="Ex.: resposta_fabricante_2026.pdf"
                  onChange={(value) => updateManualAgentDraft("attachmentEvidence", value)}
                />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Observações técnicas" full>
                <EditableInput
                  rows={3}
                  value={manualAgentDraft.technicalObservation}
                  onChange={(value) => updateManualAgentDraft("technicalObservation", value)}
                />
              </Field>
              <Field label="Recomendação técnica" full>
                <EditableInput
                  rows={3}
                  value={manualAgentDraft.technicalRecommendation}
                  onChange={(value) => updateManualAgentDraft("technicalRecommendation", value)}
                />
              </Field>
            </div>

            <label className="flex items-start gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
              <input
                type="checkbox"
                checked={manualAgentDraft.industrialSecret}
                onChange={(event) => updateManualAgentDraft("industrialSecret", event.target.checked)}
                className="mt-1 size-4 rounded border-[var(--color-border-subtle)]"
              />
              <span className="grid gap-1">
                <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                  Relacionado a segredo industrial
                </span>
                <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
                  Marque quando o agente tiver vínculo com componente oculto, composição protegida ou pendência crítica de rastreabilidade.
                </span>
              </span>
            </label>

            <Field label="Justificativa da inclusão manual" full>
              <EditableInput
                rows={3}
                value={manualAgentDraft.manualJustification}
                placeholder="Explique por que este agente está sendo inserido manualmente."
                onChange={(value) => updateManualAgentDraft("manualJustification", value)}
              />
            </Field>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(activePendingModal)}
        title="Resolver pendência"
        description="Registre a ação tomada, justificativa técnica e evidências relacionadas à pendência."
        actions={[
          <Button key="close" variant="ghost" onClick={() => setActivePendingModalId(null)}>
            Cancelar
          </Button>,
          <Button
            key="save"
            variant="tertiary"
            onClick={() => activePendingModal && justifyPending(activePendingModal.id)}
          >
            Salvar tratamento
          </Button>,
          <Button
            key="resolve"
            onClick={() => {
              if (activePendingModal) {
                markPendingResolved(activePendingModal.id);
                setActivePendingModalId(null);
              }
            }}
          >
            Salvar e resolver
          </Button>,
        ]}
      >
        {activePendingModal ? (
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Tipo da pendência">
                <Input value={activePendingModal.title} />
              </Field>
              <Field label="Agente relacionado">
                <Input value={activePendingModal.relatedTo || "Agente"} />
              </Field>
              <Field label="Documento de origem">
                <Input value={activePendingModal.sourceDocument || "Documento rastreado"} />
              </Field>
              <Field label="Gravidade">
                <Input value={activePendingModal.severity} />
              </Field>
              <Field label="Status atual">
                <EditableSelect
                  value={activePendingModal.status}
                  options={["Aberta", "Em andamento", "Aguardando cliente", "Aguardando fabricante", "Resolvida", "Cancelada", "Aprovada com ressalva"]}
                  onChange={(value) => updatePendingItem(activePendingModal.id, { status: value })}
                />
              </Field>
              <Field label="Responsável">
                <Input value={activePendingModal.assignee || "Reginaldo Melo"} />
              </Field>
            </div>
            <Field label="Ação tomada">
              <EditableSelect
                value="Informação complementada"
                options={[
                  "Informação complementada",
                  "Agente adicionado manualmente",
                  "Campo corrigido",
                  "Documento anexado",
                  "Contato com fabricante realizado",
                  "Aprovado com ressalva",
                  "Marcado como não aplicável",
                  "Reprovado",
                ]}
              />
            </Field>
            <Field label="Justificativa técnica">
              <EditableInput
                rows={3}
                value={activePendingModal.justification}
                onChange={(value) => updatePendingItem(activePendingModal.id, { justification: value })}
              />
            </Field>
            <Field label="Anexo / evidência">
              <EditableInput
                value={activePendingModal.evidenceName}
                onChange={(value) => updatePendingItem(activePendingModal.id, { evidenceName: value })}
              />
            </Field>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={showSourceModal}
        title="Visualizar fonte"
        description="Confira de onde veio a informação extraída pela IA e preserve a rastreabilidade."
        actions={[
          <Button key="close-source" variant="ghost" onClick={() => setShowSourceModal(false)}>
            Fechar
          </Button>,
          <Button key="correct-source" variant="tertiary" onClick={() => setShowSourceModal(false)}>
            Corrigir valor
          </Button>,
          <Button key="confirm-source" onClick={() => setShowSourceModal(false)}>
            Confirmar fonte
          </Button>,
        ]}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5 font-mono text-[13px] leading-6 text-[var(--color-text-soft)]">
            {activeTrace?.excerpt}
          </div>
          <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
            <div className="grid gap-1">
              <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                {prhoFieldLabels[traceView.field] || traceView.field}
              </strong>
              <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                {activeTraceRow?.name}
              </p>
            </div>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Documento: {activeTrace?.document}
            </p>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Página / aba: {activeTrace?.location}
            </p>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Valor extraído: {activeTrace?.originalValue}
            </p>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Valor atual: {activeTrace?.extractedValue}
            </p>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Confiança da IA: {activeTrace?.confidence}%
            </p>
            <p className="text-[14px] text-[var(--color-text-default)]">
              Data da extração: {activeTrace?.extractedAt}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(pendingReviewChange)}
        title="Informe a justificativa para alterar este campo técnico"
        description="CAS, referência técnica, enquadramentos normativos, método sugerido, criticidade e decisão técnica exigem justificativa explícita ao serem alterados."
        actions={[
          <Button key="cancel-review-change" variant="ghost" onClick={cancelPendingReviewChange}>
            Cancelar alteração
          </Button>,
          <Button
            key="save-review-change"
            variant="secondary"
            disabled={!pendingReviewChangeReason.trim()}
            onClick={confirmPendingReviewChange}
          >
            Salvar alteração
          </Button>,
        ]}
      >
        <div className="grid gap-4">
          <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
            <p className="text-[13px] leading-6 text-[var(--color-text-default)]">
              Campo:{" "}
              <strong className="text-[var(--color-text-strong)]">
                {pendingReviewChange
                  ? prhoFieldLabels[pendingReviewChange.field] || pendingReviewChange.field
                  : "Campo técnico"}
              </strong>
            </p>
            <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-soft)]">
              Valor anterior: {pendingReviewChange?.previousValue || "Vazio"}
            </p>
            <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
              Valor novo: {pendingReviewChange?.nextValue || "Vazio"}
            </p>
          </div>
          <Field label="Justificativa da alteração">
            <EditableInput
              rows={3}
              value={pendingReviewChangeReason}
              placeholder="Explique a base técnica para alterar este campo."
              onChange={setPendingReviewChangeReason}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={Boolean(reviewRejectionDraft.rowId)}
        title="Informe o motivo da reprovação deste agente"
        description="Agentes reprovados não seguem para classificação, mas permanecem no histórico da análise."
        actions={[
          <Button
            key="cancel-rejection"
            variant="ghost"
            onClick={() =>
              setReviewRejectionDraft({
                rowId: "",
                reason: "Agente identificado incorretamente",
                details: "",
              })
            }
          >
            Cancelar
          </Button>,
          <Button
            key="confirm-rejection"
            variant="destructive"
            disabled={
              !reviewRejectionDraft.reason.trim() ||
              (reviewRejectionDraft.reason === "Outro" && !reviewRejectionDraft.details.trim())
            }
            onClick={confirmRejection}
          >
            Confirmar reprovação
          </Button>,
        ]}
      >
        <div className="grid gap-4">
          <Field label="Motivo da reprovação">
            <EditableSelect
              value={reviewRejectionDraft.reason}
              options={reviewReprovalReasons}
              onChange={(value) =>
                setReviewRejectionDraft((current) => ({ ...current, reason: value }))
              }
            />
          </Field>
          <Field label="Detalhamento" helper="Use este campo para contextualizar a reprovação.">
            <EditableInput
              rows={3}
              value={reviewRejectionDraft.details}
              placeholder="Explique por que este agente foi reprovado."
              onChange={(value) =>
                setReviewRejectionDraft((current) => ({ ...current, details: value }))
              }
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={Boolean(reviewActionFeedback)}
        title={reviewActionFeedback?.title || "Ação indisponível"}
        description={reviewActionFeedback?.description || ""}
        actions={[
          <Button
            key="close-review-feedback"
            variant="secondary"
            onClick={() => setReviewActionFeedback(null)}
          >
            Entendi
          </Button>,
        ]}
      >
        <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 text-[14px] leading-6 text-[var(--color-text-default)]">
          A revisão humana exige correção ou justificativa antes de seguir para a próxima etapa.
        </div>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoClassificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classificationRows, setClassificationRows] = useState(() =>
    prhoReviewAgents.map((item) => buildReviewRow(item)),
  );
  const [classificationPendingItems, setClassificationPendingItems] = useState(() =>
    prhoPendingItems.map((item) => ({
      ...item,
      ...getPendingSourceDocument(item.agentId),
      recommendedAction: getPendingRecommendedAction(item.type),
      justification: item.severity === "Crítica" ? "" : "Pendência mantida para histórico da análise.",
    })),
  );
  const [classificationDecision, setClassificationDecision] = useState("Quantificar");
  const [classificationJustification, setClassificationJustification] = useState(
    "Classificação técnica em preparação para aprovação final.",
  );
  const [classificationResponsible, setClassificationResponsible] = useState("Reginaldo Melo");
  const completedRows = classificationRows.filter(
    (row) =>
      row.technicalDecision?.trim() &&
      row.technicalJustification?.trim() &&
      row.aihaCategory?.trim() &&
      row.risk?.trim() &&
      row.frequency?.trim(),
  ).length;
  const lowConfidenceRows = classificationRows.filter((row) => (row.confidence || 0) < 70).length;
  const industrialSecretRows = classificationRows.filter((row) =>
    row.pendingTypes?.includes("industrial_secret"),
  ).length;
  const rowsWithComplementRequest = classificationRows.filter(
    (row) => row.technicalDecision === "Solicitar informação complementar",
  ).length;
  const remainingPendingItems = classificationPendingItems.filter(
    (item) => item.status !== "Resolvida",
  );
  const blockingPendingItems = classificationPendingItems.filter(
    (item) =>
      item.severity === "Crítica" &&
      !["Resolvida", "Justificada"].includes(item.status),
  );
  const canAdvance =
    completedRows === classificationRows.length && blockingPendingItems.length === 0;
  const blockedAgents = classificationRows.filter(
    (row) =>
      row.technicalDecision === "Bloquear aprovação" ||
      row.reviewStatus === "Reprovado",
  ).length;
  const classificationStatus =
    blockingPendingItems.length || blockedAgents
      ? "Bloqueado"
      : rowsWithComplementRequest
        ? "Pendente"
        : classificationDecision === "Aprovar com ressalva"
          ? "Aprovado com ressalva"
          : classificationDecision === "Não quantificar"
            ? "Não recomendado para quantificação"
            : classificationDecision === "Solicitar informação complementar"
              ? "Pendente"
              : classificationDecision === "Quantificar"
                ? "Recomendado para quantificação"
                : "Classificado";

  function updateClassificationRow(agentId, field, value) {
    setClassificationRows((current) =>
      current.map((row) => (row.id === agentId ? { ...row, [field]: value } : row)),
    );
  }

  function updateClassificationPending(pendingId, patch) {
    setClassificationPendingItems((current) =>
      current.map((item) => (item.id === pendingId ? { ...item, ...patch } : item)),
    );
  }

  function resolveClassificationPending(pendingId) {
    updateClassificationPending(pendingId, { status: "Resolvida" });
  }

  function justifyClassificationPending(pendingId) {
    const item = classificationPendingItems.find((entry) => entry.id === pendingId);
    if (!item?.justification?.trim()) {
      return;
    }

    updateClassificationPending(pendingId, { status: "Justificada" });
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Classificação técnica dos agentes"
          description="Matriz configurável por agente com separação normativa, decisão técnica obrigatória e justificativa rastreável."
          actions={[
            <Button
              key="summary"
              variant={canAdvance ? "primary" : "tertiary"}
              className={canAdvance ? "" : "opacity-60"}
              onClick={() => {
                if (canAdvance) {
                  navigate(`/app/prho/${id}/summary`);
                }
              }}
            >
              {canAdvance ? "Ir para aprovação" : "Aguardando liberação técnica"}
            </Button>,
          ]}
          meta={[
            <Badge
              key="progress"
              tone={completedRows === classificationRows.length ? "processing" : "review"}
            >
              {completedRows}/{classificationRows.length} agentes completos
            </Badge>,
            <Badge
              key="remaining-pendings"
              tone={blockingPendingItems.length ? "critical" : "review"}
            >
              {remainingPendingItems.length} pendências restantes
            </Badge>,
            <Badge key="decision-status" tone={classificationStatus === "Bloqueado" ? "critical" : "status"}>
              {classificationStatus}
            </Badge>,
          ]}
        >
          <Stepper steps={flowSteps} current={3} />
        </PageHeader>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label="Agentes em classificação"
            value={classificationRows.length}
            hint="Linhas vindas da revisão"
            tone="info"
          />
          <StatCard
            label="Agentes completos"
            value={completedRows}
            hint="Já prontos para aprovação"
            tone="positive"
          />
          <StatCard
            label="Quantificáveis"
            value={
              classificationRows.filter((row) => row.technicalDecision === "Quantificar").length
            }
            hint="Base do pré-orçamento"
            tone="positive"
          />
          <StatCard
            label="Baixa confiança"
            value={lowConfidenceRows}
            hint="Linhas que exigem decisão cuidadosa"
            tone={lowConfidenceRows ? "critical" : "info"}
          />
          <StatCard
            label="Segredo industrial"
            value={industrialSecretRows}
            hint="Afeta a decisão final"
            tone={industrialSecretRows ? "critical" : "info"}
          />
          <StatCard
            label="Solicitam complemento"
            value={rowsWithComplementRequest}
            hint="Podem manter a análise pendente"
            tone={rowsWithComplementRequest ? "critical" : "positive"}
          />
        </div>

        {!canAdvance ? (
          <Toast
            title="Avanço bloqueado para aprovação"
            description="Ainda existem agentes sem justificativa técnica completa ou pendências críticas sem justificativa/resolução."
          />
        ) : null}

        <Panel className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Fechamento da classificação
              </p>
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Decisão final desta etapa
              </h3>
              <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
                Esta tela precisa produzir uma decisão técnica clara antes da aprovação final.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={classificationStatus} />
              <Badge tone={canAdvance ? "processing" : "critical"}>
                {canAdvance ? "Liberada para aprovação" : "Ainda bloqueada"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <Field label="Decisão final da classificação">
                <EditableSelect
                  value={classificationDecision}
                  options={prhoClassificationDecisionOptions}
                  onChange={setClassificationDecision}
                />
              </Field>
              <Field label="Justificativa consolidada">
                <EditableInput
                  rows={3}
                  value={classificationJustification}
                  onChange={setClassificationJustification}
                />
              </Field>
            </div>

            <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <Field label="Responsável técnico">
                <EditableInput
                  value={classificationResponsible}
                  onChange={setClassificationResponsible}
                />
              </Field>
              <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Resultado esperado
                </span>
                <p className="text-[14px] leading-6 text-[var(--color-text-default)]">
                  {classificationDecision === "Quantificar" &&
                    "A análise segue com recomendação explícita para quantificação e preparação comercial."}
                  {classificationDecision === "Não quantificar" &&
                    "A análise é fechada sem recomendação de quantificação, exigindo justificativa sólida."}
                  {classificationDecision === "Solicitar informação complementar" &&
                    "A análise deve permanecer pendente até recebimento das informações complementares."}
                  {classificationDecision === "Aprovar com ressalva" &&
                    "A análise pode avançar, mas a aprovação final deve registrar ressalvas e impactos."}
                  {classificationDecision === "Bloquear aprovação" &&
                    "A análise não pode seguir para aprovação enquanto os bloqueios técnicos permanecerem."}
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Gate de pendências
              </p>
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Pendências que impactam a classificação
              </h3>
            </div>
            <Badge tone={blockingPendingItems.length ? "critical" : "processing"}>
              {blockingPendingItems.length
                ? `${blockingPendingItems.length} críticas bloqueando`
                : "Sem bloqueios críticos"}
            </Badge>
          </div>
          <div className="grid gap-3">
            {classificationPendingItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="grid gap-1">
                    <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                      {item.title}
                    </strong>
                    <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RiskBadge level={item.severity} />
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <TechnicalBadge label={item.relatedTo} tone="review" />
                  <TechnicalBadge label={item.sourceDocument} tone="status" />
                </div>
                <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
                  <Field label="Status da pendência">
                    <EditableSelect
                      value={item.status}
                      options={pendingStatusOptions}
                      onChange={(value) => updateClassificationPending(item.id, { status: value })}
                    />
                  </Field>
                  <Field label="Justificativa da classificação">
                    <EditableInput
                      rows={2}
                      value={item.justification}
                      placeholder="Explique a base técnica para manter, justificar ou resolver esta pendência."
                      onChange={(value) =>
                        updateClassificationPending(item.id, { justification: value })
                      }
                    />
                  </Field>
                </div>
                <p className="text-[13px] leading-5 text-[var(--color-text-default)]">
                  Ação recomendada: {item.recommendedAction}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => navigate(`/app/prho/${id}/review`)}
                  >
                    Ver agente
                  </Button>
                  <Button
                    variant="secondary"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => justifyClassificationPending(item.id)}
                  >
                    Justificar
                  </Button>
                  <Button
                    variant="primary"
                    className="min-h-9 px-3 text-[12px]"
                    onClick={() => resolveClassificationPending(item.id)}
                  >
                    Resolver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {classificationRows.map((agent) => (
          <Panel key={agent.id} className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Agente classificado
                </p>
                <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
                  {agent.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={agent.agentType === "Químico" ? "processing" : "status"}>
                  {agent.agentType}
                </Badge>
                <RiskBadge level={agent.risk} />
                <StatusBadge status={agent.reviewStatus} />
                {agent.pendingTypes?.includes("industrial_secret") ? (
                  <Badge tone="critical">Segredo industrial</Badge>
                ) : null}
                {(agent.confidence || 0) < 70 ? <Badge tone="critical">Baixa confiança</Badge> : null}
              </div>
            </div>

            <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Decisão técnica
                </span>
                <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                  {agent.technicalDecision}
                </strong>
              </div>
              <div className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Criticidade
                </span>
                <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                  {agent.risk}
                </strong>
              </div>
              <div className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Categoria AIHA
                </span>
                <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                  {agent.aihaCategory}
                </strong>
              </div>
              <div className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Frequência sugerida
                </span>
                <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                  {agent.frequency}
                </strong>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Carcinogenicidade
                </span>
                <Field label="LINACH">
                  <EditableInput
                    value={agent.linachStatus}
                    onChange={(value) => updateClassificationRow(agent.id, "linachStatus", value)}
                  />
                </Field>
                <Field label="Grupo carcinogênico">
                  <EditableInput
                    value={agent.carcinogenicGroup}
                    onChange={(value) =>
                      updateClassificationRow(agent.id, "carcinogenicGroup", value)
                    }
                  />
                </Field>
                <Field label="Mutagênico">
                  <EditableSelect
                    value={agent.mutagenicity}
                    options={prhoMutagenicityOptions}
                    onChange={(value) => updateClassificationRow(agent.id, "mutagenicity", value)}
                  />
                </Field>
                <Field label="Órgão alvo">
                  <EditableInput
                    value={agent.targetOrgan}
                    onChange={(value) => updateClassificationRow(agent.id, "targetOrgan", value)}
                  />
                </Field>
              </div>
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Trabalhista / previdenciário
                </span>
                <Field label="eSocial">
                  <EditableSelect
                    value={agent.esocialStatus}
                    options={prhoEsocialOptions}
                    onChange={(value) => updateClassificationRow(agent.id, "esocialStatus", value)}
                  />
                </Field>
                <Field label="Código eSocial">
                  <EditableInput
                    value={agent.esocialCode}
                    onChange={(value) => updateClassificationRow(agent.id, "esocialCode", value)}
                  />
                </Field>
                <Field label="Decreto 3048/99">
                  <EditableInput
                    value={agent.decretoCode}
                    onChange={(value) => updateClassificationRow(agent.id, "decretoCode", value)}
                  />
                </Field>
                <Field label="Aposentadoria especial">
                  <EditableSelect
                    value={agent.retirementSpecial}
                    options={prhoRetirementOptions}
                    onChange={(value) =>
                      updateClassificationRow(agent.id, "retirementSpecial", value)
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Insalubridade / NR-15
                </span>
                <Field label="NR-15 anexo">
                  <EditableInput
                    value={agent.nr15Annex}
                    onChange={(value) => updateClassificationRow(agent.id, "nr15Annex", value)}
                  />
                </Field>
                <Field label="Limite NR-15">
                  <EditableInput
                    value={agent.nr15Limit}
                    onChange={(value) => updateClassificationRow(agent.id, "nr15Limit", value)}
                  />
                </Field>
                <Field label="Enquadramento de insalubridade">
                  <EditableInput
                    value={agent.risk}
                    onChange={(value) => updateClassificationRow(agent.id, "risk", value)}
                  />
                </Field>
                <Field label="Observação">
                  <EditableInput
                    rows={2}
                    value={agent.observation}
                    onChange={(value) => updateClassificationRow(agent.id, "observation", value)}
                  />
                </Field>
              </div>
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Referências técnicas
                </span>
                <Field label="Método">
                  <EditableInput
                    value={agent.validatedMethod || agent.suggestedMethod}
                    onChange={(value) => updateClassificationRow(agent.id, "validatedMethod", value)}
                  />
                </Field>
                <Field label="NHO">
                  <EditableInput
                    value={agent.nhoReference}
                    onChange={(value) => updateClassificationRow(agent.id, "nhoReference", value)}
                  />
                </Field>
                <Field label="ACGIH TWA">
                  <EditableInput
                    value={agent.acgihTwa}
                    onChange={(value) => updateClassificationRow(agent.id, "acgihTwa", value)}
                  />
                </Field>
                <Field label="ACGIH STEL">
                  <EditableInput
                    value={agent.acgihStel}
                    onChange={(value) => updateClassificationRow(agent.id, "acgihStel", value)}
                  />
                </Field>
                <Field label="NIOSH TWA">
                  <EditableInput
                    value={agent.nioshTwa}
                    onChange={(value) => updateClassificationRow(agent.id, "nioshTwa", value)}
                  />
                </Field>
                <Field label="Limite de ação">
                  <EditableInput
                    value={agent.actionLimit}
                    onChange={(value) => updateClassificationRow(agent.id, "actionLimit", value)}
                  />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  AIHA / criticidade
                </span>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Categoria AIHA">
                    <EditableSelect
                      value={agent.aihaCategory}
                      options={[...prhoCategoryOptions, "Não definida"]}
                      onChange={(value) => updateClassificationRow(agent.id, "aihaCategory", value)}
                    />
                  </Field>
                  <Field label="Criticidade">
                    <EditableSelect
                      value={agent.risk}
                      options={[...prhoCriticalityOptions, "Não definida"]}
                      onChange={(value) => updateClassificationRow(agent.id, "risk", value)}
                    />
                  </Field>
                  <Field label="Frequência sugerida">
                    <EditableSelect
                      value={agent.frequency}
                      options={prhoFrequencyOptions}
                      onChange={(value) => updateClassificationRow(agent.id, "frequency", value)}
                    />
                  </Field>
                  <Field label="Base da classificação">
                    <EditableInput
                      rows={2}
                      value={agent.criticalityBasis}
                      onChange={(value) =>
                        updateClassificationRow(agent.id, "criticalityBasis", value)
                      }
                    />
                  </Field>
                </div>
              </div>

              <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Decisão técnica
                </span>
                <div className="grid gap-4">
                  <Field label="Decisão técnica">
                    <EditableSelect
                      value={agent.technicalDecision}
                      options={prhoClassificationDecisionOptions}
                      onChange={(value) =>
                        updateClassificationRow(agent.id, "technicalDecision", value)
                      }
                    />
                  </Field>
                  <Field
                    label="Justificativa técnica"
                    helper="Campo obrigatório para liberar a aprovação."
                  >
                    <EditableInput
                      rows={3}
                      value={agent.technicalJustification}
                      onChange={(value) =>
                        updateClassificationRow(agent.id, "technicalJustification", value)
                      }
                    />
                  </Field>
                  <Field label="Recomendação técnica">
                    <EditableInput
                      rows={2}
                      value={agent.technicalRecommendation}
                      onChange={(value) =>
                        updateClassificationRow(agent.id, "technicalRecommendation", value)
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </UnifiedPagePanel>
  );
}

function PrhoSummaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const classifiedRows = prhoReviewAgents.map((item) => buildReviewRow(item));
  const budgetRows = buildBudgetRowsFromAgents(classifiedRows);
  const criticalPendingItems = prhoPendingItems.filter(
    (item) => item.status === "Aberta" && item.severity === "Crítica",
  );
  const openPendingItems = prhoPendingItems.filter((item) => item.status === "Aberta");
  const [approvalState, setApprovalState] = useState(() =>
    readAnalysisApprovalState(analysis.id, "draft"),
  );
  const [showApprovalNotesModal, setShowApprovalNotesModal] = useState(false);
  const [approvalNotesDraft, setApprovalNotesDraft] = useState({
    justification: "Aprovação com ressalvas por pendências não bloqueantes devidamente registradas.",
    responsible: analysis.responsible || "Reginaldo Melo",
    maintainedPending: openPendingItems[0]?.title || "",
    expectedImpact: "A análise pode seguir, mas a próxima etapa deve preservar as ressalvas técnicas no histórico.",
    confirmation: false,
  });
  const approvedRows = classifiedRows.filter((item) =>
    ["Aprovado", "Aprovado com ressalva"].includes(item.reviewStatus),
  ).length;
  const correctedRows = classifiedRows.filter((item) => item.reviewStatus === "Corrigido").length;
  const industrialSecretRows = classifiedRows.filter((item) =>
    item.pendingTypes.includes("industrial_secret"),
  ).length;
  const allowedApprovalStatuses = ["Aprovado", "Corrigido", "Aprovado com ressalva"];
  const approvalChecklist = [
    {
      id: "documents-processed",
      label: "Todos os documentos foram processados?",
      status: documents.every((item) =>
        ["Extração concluída", "Revisão necessária", "Aguardando processamento", "Lendo arquivo", "Documento não reconhecido", "Documento ilegível"].includes(item.status),
      )
        ? "OK"
        : "Atenção",
      detail: "Documentos com leitura parcial ou necessidade de revisão devem permanecer visíveis antes da aprovação.",
    },
    {
      id: "all-reviewed",
      label: "Todos os agentes foram revisados?",
      status: classifiedRows.every((item) => allowedApprovalStatuses.includes(item.reviewStatus))
        ? "OK"
        : "Bloqueado",
      detail: "Linhas pendentes, reprovadas ou com informação externa ainda não liberam o fechamento.",
    },
    {
      id: "required-fields",
      label: "Todos os campos obrigatórios estão preenchidos?",
      status: classifiedRows.every(
        (item) =>
          item.technicalDecision?.trim() &&
          item.technicalJustification?.trim() &&
          item.aihaCategory?.trim() &&
          item.frequency?.trim(),
      )
        ? "OK"
        : "Bloqueado",
      detail: "Decisão técnica, justificativa, categoria AIHA e frequência precisam estar presentes.",
    },
    {
      id: "industrial-secret",
      label: "Existe agente com segredo industrial?",
      status: openPendingItems.some((item) => item.type === "industrial_secret")
        ? "Bloqueado"
        : industrialSecretRows
          ? "Atenção"
          : "OK",
      detail: industrialSecretRows
        ? "Há agentes com segredo industrial e a justificativa deve seguir preservada."
        : "Nenhum segredo industrial aberto nesta análise.",
    },
    {
      id: "insufficient-data",
      label: "Existe agente com dados insuficientes?",
      status: classifiedRows.some((item) => item.technicalDecision === "Dados insuficientes")
        ? "Atenção"
        : "OK",
      detail: "Agentes com dados insuficientes exigem decisão explícita antes da liberação comercial.",
    },
    {
      id: "normative-conflict",
      label: "Existe divergência normativa?",
      status: openPendingItems.some((item) => item.type === "normative_conflict")
        ? "Bloqueado"
        : "OK",
      detail: "Divergências normativas podem seguir apenas com ressalva técnica registrada.",
    },
    {
      id: "non-quantify-justification",
      label: "Todo agente não quantificado possui justificativa?",
      status: classifiedRows.every(
        (item) =>
          item.technicalDecision === "Quantificar" || item.technicalJustification?.trim(),
      )
        ? "OK"
        : "Bloqueado",
      detail: "Não quantificar, dados insuficientes e solicitações complementares exigem justificativa.",
    },
    {
      id: "notes-justification",
      label: "Todo agente aprovado com ressalva possui justificativa?",
      status: classifiedRows.every(
        (item) =>
          item.reviewStatus !== "Aprovado com ressalva" || item.technicalJustification?.trim(),
      )
        ? "OK"
        : "Bloqueado",
      detail: "Ressalvas precisam ficar explicitamente justificadas para permanecer na aprovação.",
    },
    {
      id: "validated-method",
      label: "Todos os métodos foram validados?",
      status: classifiedRows.every((item) => (item.validatedMethod || item.suggestedMethod)?.trim())
        ? "OK"
        : "Atenção",
      detail: "Método sugerido sem validação explícita deve permanecer como ressalva.",
    },
    {
      id: "responsible",
      label: "Existe responsável técnico definido?",
      status: analysis.responsible ? "OK" : "Bloqueado",
      detail: analysis.responsible
        ? `${analysis.responsible} está definido para a versão ${analysis.version}.`
        : "A análise precisa de responsável técnico definido.",
    },
    {
      id: "history",
      label: "O histórico de alterações foi salvo?",
      status: "OK",
      detail: "Rastreabilidade, justificativas e histórico estão preservados no mockup.",
    },
    {
      id: "critical-open",
      label: "Há pendência crítica em aberto?",
      status: criticalPendingItems.length ? "Bloqueado" : "OK",
      detail: criticalPendingItems.length
        ? "Existem pendências críticas abertas impedindo o fechamento total da análise."
        : "Nenhuma pendência crítica permanece aberta.",
    },
  ];
  const hasBlockingChecklist = approvalChecklist.some((item) => item.status === "Bloqueado");
  const canApprove = !hasBlockingChecklist && criticalPendingItems.length === 0;
  const canApproveWithNotes = !hasBlockingChecklist;
  const preQuoteReleased = isReleasedApprovalState(approvalState);

  function persistApprovalState(nextState) {
    setApprovalState(nextState);
    saveAnalysisApprovalState(analysis.id, nextState);
  }

  function submitApprovalWithNotes() {
    if (
      !approvalNotesDraft.justification.trim() ||
      !approvalNotesDraft.responsible.trim() ||
      !approvalNotesDraft.expectedImpact.trim() ||
      !approvalNotesDraft.confirmation
    ) {
      return;
    }

    persistApprovalState("approved_with_notes");
    setShowApprovalNotesModal(false);
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Resumo e aprovação da análise • ${analysis.code}`}
          description="Consolidação final da APR HO com bloqueios, auditoria e liberação do pré-orçamento apenas para agentes aprovados."
          actions={[
            <Button
              key="back-review"
              variant="ghost"
              onClick={() => navigate(`/app/prho/${id}/review`)}
            >
              Voltar para revisão
            </Button>,
            <Button
              key="draft"
              variant="tertiary"
              onClick={() => persistApprovalState("draft")}
            >
              Salvar rascunho
            </Button>,
            <Button
              key="approve"
              variant={canApprove ? "primary" : "tertiary"}
              className={canApprove ? "" : "opacity-60"}
              disabled={!canApprove}
              title="Existem pendências críticas sem justificativa."
              onClick={() => {
                if (canApprove) {
                  persistApprovalState("approved");
                }
              }}
            >
              Aprovar análise
            </Button>,
            <Button
              key="approve-with-notes"
              variant={canApproveWithNotes ? "secondary" : "tertiary"}
              className={canApproveWithNotes ? "" : "opacity-60"}
              disabled={!canApproveWithNotes}
              title="A aprovação com ressalvas exige que todas as justificativas obrigatórias estejam preenchidas."
              onClick={() => {
                if (canApproveWithNotes) {
                  setShowApprovalNotesModal(true);
                }
              }}
            >
              Aprovar com ressalvas
            </Button>,
            preQuoteReleased ? (
              <NavLink
                key="prequote"
                to="/app/pre-quotations/pre-041"
                className={buttonStyles({ variant: "primary" })}
              >
                Ir para pré-orçamento
              </NavLink>
            ) : null,
          ]}
        >
          <Stepper steps={flowSteps} current={4} />
        </PageHeader>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard label="Documentos analisados" value={analysis.documents} hint="Arquivos usados na aprovação" />
        <StatCard label="Agentes identificados" value={classifiedRows.length} hint="Químicos e físicos consolidados" />
        <StatCard label="Recomendados para quantificação" value={budgetRows.length} hint="Base do pré-orçamento" tone="positive" />
        <StatCard label="Pendências abertas" value={openPendingItems.length} hint="Bloqueios antes da aprovação" tone={criticalPendingItems.length ? "critical" : "info"} />
        <StatCard label="Segredo industrial" value={industrialSecretRows} hint="Linhas com justificativa obrigatória" tone="critical" />
      </div>

      {criticalPendingItems.length ? (
        <Toast
          className="my-5 py-5"
          title="Pendências críticas ainda bloqueiam a aprovação"
          description="Enquanto houver pendência crítica aberta sem justificativa, a aprovação final e a liberação do pré-orçamento devem permanecer bloqueadas."
        />
      ) : null}

      <Panel className="grid gap-5">
        <div className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Auditoria e aprovação
            </p>
            <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Snapshot da análise
            </h3>
            <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
              {approvedRows} aprovadas • {correctedRows} corrigidas • {openPendingItems.length} pendências ainda abertas.
            </p>
          </div>
          <div className="grid gap-2">
            <StatusBadge
              status={
                approvalState === "approved"
                  ? "Aprovado"
                  : approvalState === "approved_with_notes"
                    ? "Atenção"
                    : criticalPendingItems.length
                      ? "Bloqueado"
                      : "Pendente"
              }
            />
            <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
              {analysis.responsible} • 18 Jun 2026 18:42 • versão {analysis.version}
            </p>
            <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
              Rastreabilidade preservada com fontes, justificativas e histórico de alteração.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Checklist de aprovação
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Validação técnica antes do pré-orçamento
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
            {approvalChecklist.map((item) => (
              <ApprovalChecklistItem
                key={item.id}
                label={item.label}
                description={item.detail}
                status={
                  item.status === "OK"
                    ? "ok"
                    : item.status === "Atenção"
                      ? "attention"
                      : "blocked"
                }
                onViewProblem={
                  item.status === "OK"
                    ? undefined
                    : () => navigate(`/app/prho/${analysis.id}/review`)
                }
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {classifiedRows.map((agent) => (
            <div
              key={agent.id}
              className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={agent.agentType === "Químico" ? "processing" : "status"}>
                      {agent.agentType}
                    </Badge>
                    <StatusBadge status={agent.reviewStatus} />
                  </div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                    {agent.name}
                  </h3>
                </div>
                <RiskBadge level={agent.risk} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    CAS / referência
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {agent.cas || agent.reference}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Método
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {agent.validatedMethod || agent.suggestedMethod}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Decisão técnica
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {agent.technicalDecision}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Categoria / frequência
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {agent.aihaCategory} • {agent.frequency}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-default)]">
                {agent.technicalJustification}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={showApprovalNotesModal}
        title="Aprovar com ressalvas"
        description="Registre a justificativa geral, o responsável e os impactos mantidos para liberar a análise com ressalvas."
        actions={[
          <Button key="cancel-approval-notes" variant="ghost" onClick={() => setShowApprovalNotesModal(false)}>
            Cancelar
          </Button>,
          <Button
            key="save-approval-notes"
            variant="secondary"
            disabled={
              !approvalNotesDraft.justification.trim() ||
              !approvalNotesDraft.responsible.trim() ||
              !approvalNotesDraft.expectedImpact.trim() ||
              !approvalNotesDraft.confirmation
            }
            onClick={submitApprovalWithNotes}
          >
            Confirmar aprovação com ressalvas
          </Button>,
        ]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Justificativa geral">
            <EditableInput
              rows={3}
              value={approvalNotesDraft.justification}
              onChange={(value) =>
                setApprovalNotesDraft((current) => ({ ...current, justification: value }))
              }
            />
          </Field>
          <Field label="Responsável técnico">
            <EditableInput
              value={approvalNotesDraft.responsible}
              onChange={(value) =>
                setApprovalNotesDraft((current) => ({ ...current, responsible: value }))
              }
            />
          </Field>
          <Field label="Pendência mantida">
            <EditableInput
              value={approvalNotesDraft.maintainedPending}
              placeholder="Ex.: divergência normativa não bloqueante"
              onChange={(value) =>
                setApprovalNotesDraft((current) => ({ ...current, maintainedPending: value }))
              }
            />
          </Field>
          <Field label="Impacto esperado">
            <EditableInput
              rows={3}
              value={approvalNotesDraft.expectedImpact}
              onChange={(value) =>
                setApprovalNotesDraft((current) => ({ ...current, expectedImpact: value }))
              }
            />
          </Field>
        </div>

        <label className="flex items-start gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
          <input
            type="checkbox"
            checked={approvalNotesDraft.confirmation}
            onChange={(event) =>
              setApprovalNotesDraft((current) => ({
                ...current,
                confirmation: event.target.checked,
              }))
            }
            className="mt-1 size-4 rounded border-[var(--color-border-subtle)]"
          />
          <span className="grid gap-1">
            <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
              Confirmo que as ressalvas foram avaliadas e devem permanecer visíveis na aprovação final
            </span>
            <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
              O mockup deve deixar explícito que a aprovação com ressalvas não elimina pendências mantidas nem substitui a rastreabilidade técnica.
            </span>
          </span>
        </label>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoReviewBlocksPageLegacy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const [blocks, setBlocks] = useState(() => getPrhoReviewBlocksSeed());
  const [pendencies, setPendencies] = useState(() => getPrhoReviewPendenciesSeed());
  const [selectedBlockId, setSelectedBlockId] = useState(prhoReviewBlocksSeed[0]?.id);
  const [activeBlockTab, setActiveBlockTab] = useState("block-info");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [feedback, setFeedback] = useState(null);
  const [showManualAgentModal, setShowManualAgentModal] = useState(false);
  const [manualAgentDraft, setManualAgentDraft] = useState({
    blockId: prhoReviewBlocksSeed[0]?.id || "",
    linkedPendingId: "",
    searchQuery: "",
    selectedAgentId: "",
    searchMessage: "",
    sourceProduct: "",
    concentration: "",
    unit: "ppm",
    justification: "",
    infoOrigin: "Base técnica interna / inclusão manual",
  });

  const metrics = getPrhoOperationalMetrics(blocks, pendencies);
  const selectedBlock = findBlockById(blocks, selectedBlockId);
  const blockTabs = blocks.map((block) => ({
    id: block.id,
    label: block.label,
  }));
  const blockContentTabs = [
    { id: "block-info", label: "Informações do bloco" },
    { id: "block-agents", label: "Agentes do bloco" },
  ];
  const selectedPendencies = pendencies.filter(
    (item) => item.blockId === selectedBlock?.id && item.status !== "Resolvida",
  );
  const filteredAgents = (selectedBlock?.agents || []).filter((agent) => {
    const matchesSearch = !search || agent.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "Todos" || agent.agentType === typeFilter;
    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Com pendência" && (agent.pendingIds || []).length > 0) ||
      (statusFilter === "Sem pendência" && !(agent.pendingIds || []).length) ||
      (statusFilter === "Aprovados" && agent.reviewStatus === "Aprovado") ||
      (statusFilter === "Bloqueados" && agent.reviewStatus === "Bloqueado");

    return matchesSearch && matchesType && matchesStatus;
  });
  const canAdvance =
    metrics.criticalPendencies.length === 0 &&
    blocks.every((block) => block.blockReviewStatus !== "Pendente");

  function updateBlock(blockId, patch) {
    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
    );
  }

  function updateAgent(blockId, agentId, patch) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              agents: block.agents.map((agent) =>
                agent.id === agentId ? { ...agent, ...patch } : agent,
              ),
            }
          : block,
      ),
    );
  }

  function resolvePending(pendingId, status = "Resolvida") {
    setPendencies((current) =>
      current.map((item) => (item.id === pendingId ? { ...item, status } : item)),
    );
  }

  function addBlockPendency(blockId) {
    const block = blocks.find((item) => item.id === blockId);
    setPendencies((current) => [
      {
        id: `pen-extra-${Date.now()}`,
        blockId,
        agentId: "",
        type: "missing_context",
        severity: "Média",
        title: `Contexto operacional complementar em ${block?.label || "bloco"}`,
        description:
          "O responsável técnico abriu uma pendência adicional para complementar setor, função ou atividade.",
        recommendedAction: "Completar o bloco antes da classificação.",
        status: "Aberta",
        sourceDocumentId: block?.linkedDocuments?.[0] || "doc-03",
      },
      ...current,
    ]);
    setFeedback({
      title: "Pendência criada",
      description: "O bloco recebeu uma nova pendência operacional para revisão.",
    });
  }

  function approveBlock(blockId) {
    const hasCritical = pendencies.some(
      (item) => item.blockId === blockId && item.status !== "Resolvida" && item.severity === "Crítica",
    );
    updateBlock(blockId, {
      blockReviewStatus: hasCritical ? "Em revisão" : "Aprovado",
      approvalStatus: hasCritical ? "Bloqueado" : "Validado",
    });
    setFeedback({
      title: hasCritical ? "Bloco ainda bloqueado" : "Bloco aprovado",
      description: hasCritical
        ? "Ainda existe pendência crítica aberta neste bloco."
        : "O bloco foi validado e pode seguir à classificação.",
    });
  }

  function markOutOfScope(blockId) {
    updateBlock(blockId, {
      blockReviewStatus: "Fora de escopo",
      approvalStatus: "Validado com ressalva",
    });
    setFeedback({
      title: "Bloco marcado como fora de escopo",
      description: "O bloco permanece visível no histórico, mas não segue como principal no fluxo.",
    });
  }

  function runManualSearch() {
    const match = findManualAgentSearchMatch(manualAgentDraft.searchQuery);
    if (!match) {
      setManualAgentDraft((current) => ({
        ...current,
        selectedAgentId: "",
        searchMessage:
          "Nenhuma correspondência automática encontrada. Você ainda pode seguir com inclusão manual justificada.",
      }));
      return;
    }

    if (match.status === "multiple") {
      setManualAgentDraft((current) => ({
        ...current,
        selectedAgentId: match.options[0]?.id || "",
        searchMessage: "Múltiplas opções encontradas. Selecione a opção correta abaixo.",
      }));
      return;
    }

    setManualAgentDraft((current) => ({
      ...current,
      selectedAgentId: match.id,
      sourceProduct: current.sourceProduct || match.name,
      unit: match.unit || current.unit,
      searchMessage:
        match.status === "partial"
          ? "Correspondência parcial encontrada. Revise os campos antes de salvar."
          : "Correspondência encontrada na base técnica interna.",
    }));
  }

  function saveManualAgent() {
    if (!manualAgentDraft.blockId || !manualAgentDraft.justification.trim()) {
      return;
    }

    const directMatch = manualAgentSearchCatalog.find(
      (item) => item.id === manualAgentDraft.selectedAgentId,
    );
    const optionMatch = manualAgentSearchCatalog
      .filter((item) => item.status === "multiple")
      .flatMap((item) => item.options || [])
      .find((item) => item.id === manualAgentDraft.selectedAgentId);
    const source = directMatch || optionMatch;

    const nextAgent = {
      id: `manual-agent-${Date.now()}`,
      name: source?.name || manualAgentDraft.searchQuery || "Agente manual",
      agentType: source?.agentType || "Químico",
      cas: source?.cas || "",
      sourceProduct: manualAgentDraft.sourceProduct || source?.name || "",
      concentration: manualAgentDraft.concentration || "",
      unit: manualAgentDraft.unit,
      physicalState: source?.physicalState || "",
      originSummary: manualAgentDraft.infoOrigin,
      validatedMethod: source?.suggestedMethod || "",
      twa: source?.acgihTwa || "",
      stel: "",
      ceiling: "",
      nr15Annex: source?.nr15Annex || "",
      nr15Limit: source?.nr15Limit || "",
      nhoReference: source?.suggestedMethod?.startsWith("NHO") ? source.suggestedMethod : "",
      esocialCode: source?.esocialCode || "",
      decreeCode: source?.decretoCode || "",
      retirementSpecial: "Pendente de validação",
      linachStatus: source?.linachStatus || "",
      carcinogenicity: source?.linachStatus?.includes("carcinog")
        ? "Carcinogênico reconhecido"
        : "Não aplicável",
      mutagenicity: "Não avaliada",
      targetOrgan: source?.targetOrgan || "",
      effects: "Inclusão manual fundamentada pelo responsável técnico.",
      aihaCategory: source?.aihaCategory || "Categoria 2",
      criticality: source?.aihaCategory === "Categoria 1" ? "Crítica" : "Média",
      suggestedFrequency: "Semestral",
      technicalDecision: source?.technicalDecision || "Solicitar informação complementar",
      reviewStatus: "Corrigido",
      technicalJustification: manualAgentDraft.justification,
      technicalRecommendation:
        source?.technicalRecommendation || "Revisar este agente na classificação.",
      sourceDocumentId: selectedBlock?.linkedDocuments?.[0] || "doc-03",
      sourceExcerpt: manualAgentDraft.infoOrigin,
      confidence: source?.confidence || 72,
      pendingIds: manualAgentDraft.linkedPendingId ? [manualAgentDraft.linkedPendingId] : [],
    };

    setBlocks((current) =>
      current.map((block) =>
        block.id === manualAgentDraft.blockId
          ? {
              ...block,
              blockReviewStatus:
                block.blockReviewStatus === "Pendente" ? "Em revisão" : block.blockReviewStatus,
              agents: [...block.agents, nextAgent],
            }
          : block,
      ),
    );

    if (manualAgentDraft.linkedPendingId) {
      resolvePending(manualAgentDraft.linkedPendingId, "Justificada");
    }

    setShowManualAgentModal(false);
    setFeedback({
      title: "Agente manual adicionado",
      description: "O agente foi vinculado ao bloco e ficou pronto para seguir à classificação.",
    });
    setManualAgentDraft({
      blockId: selectedBlock?.id || "",
      linkedPendingId: "",
      searchQuery: "",
      selectedAgentId: "",
      searchMessage: "",
      sourceProduct: "",
      concentration: "",
      unit: "ppm",
      justification: "",
      infoOrigin: "Base técnica interna / inclusão manual",
    });
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Revisão por blocos operacionais • ${analysis.code}`}
          description="A revisão humana passa a validar primeiro o bloco operacional e só depois os agentes de higiene vinculados."
          actions={[
            <Button
              key="classification"
              variant={canAdvance ? "primary" : "tertiary"}
              disabled={!canAdvance}
              onClick={() => navigate(`/app/prho/${id}/classification`)}
            >
              {canAdvance ? "Seguir para classificação" : "Revisão ainda bloqueada"}
            </Button>,
          ]}
          meta={[
            <Badge key="blocks" tone="review">
              {blocks.length} blocos
            </Badge>,
            <Badge key="agents" tone="status">
              {metrics.agents.length} agentes
            </Badge>,
            <Badge key="pendings" tone={metrics.criticalPendencies.length ? "critical" : "review"}>
              {metrics.openPendencies.length} pendências
            </Badge>,
          ]}
        >
          <Stepper steps={flowSteps} current={2} />
        </PageHeader>
      }
      bodyClassName="grid gap-5"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Blocos encontrados" value={blocks.length} hint="Estrutura-base da revisão" tone="info" />
        <StatCard label="Blocos sem agente" value={metrics.blocksWithoutAgent} hint="Exigem inclusão ou exclusão" tone={metrics.blocksWithoutAgent ? "review" : "positive"} />
        <StatCard label="Agentes sem método" value={metrics.agentsWithoutMethod} hint="Precisam de complemento técnico" tone={metrics.agentsWithoutMethod ? "critical" : "positive"} />
        <StatCard label="Agentes revisados" value={metrics.approvedAgents} hint="Aprovados, corrigidos ou N/A" tone="positive" />
        <StatCard label="Pendências críticas" value={metrics.criticalPendencies.length} hint="Bloqueiam o avanço" tone={metrics.criticalPendencies.length ? "critical" : "positive"} />
      </div>

      {feedback ? <Toast title={feedback.title} description={feedback.description} /> : null}

      <Panel className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Navegação por bloco
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Revisão organizada por abas
            </h3>
          </div>
        </div>

        <TabRow items={blockTabs} activeId={selectedBlockId} onChange={setSelectedBlockId} />

        {selectedBlock ? (
          <div className="grid gap-4">
            <Panel className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    {selectedBlock.label}
                  </p>
                  <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
                    {selectedBlock.title}
                  </h3>
                  <p className="text-[14px] leading-6 text-[var(--color-text-soft)]">
                    Valide primeiro o bloco e depois os agentes de higiene vinculados.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedBlock.blockReviewStatus} />
                  <Badge tone="status">{selectedBlock.extractionConfidence}% confiança</Badge>
                </div>
              </div>

              <TabRow items={blockContentTabs} activeId={activeBlockTab} onChange={setActiveBlockTab} />

              {activeBlockTab === "block-info" ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      label="Documentos do bloco"
                      value={selectedBlock.linkedDocuments.length}
                      hint="Arquivos vinculados ao contexto operacional"
                      tone="info"
                    />
                    <StatCard
                      label="Agentes no bloco"
                      value={selectedBlock.agents.length}
                      hint="Itens já atribuídos ao bloco"
                      tone="status"
                    />
                    <StatCard
                      label="Pendências abertas"
                      value={selectedPendencies.length}
                      hint="Pontos que ainda precisam de decisão"
                      tone={selectedPendencies.length ? "critical" : "positive"}
                    />
                    <StatCard
                      label="Gate de aprovação"
                      value={selectedBlock.approvalStatus}
                      hint="Situação do bloco dentro do fluxo"
                      tone={selectedBlock.approvalStatus === "Bloqueado" ? "critical" : "positive"}
                    />
                  </div>

                  <div className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Setor / local">
                      <EditableInput value={selectedBlock.sectorLocation} onChange={(value) => updateBlock(selectedBlock.id, { sectorLocation: value })} />
                    </Field>
                    <Field label="Código GHE / GSE">
                      <EditableInput value={selectedBlock.gheCode} onChange={(value) => updateBlock(selectedBlock.id, { gheCode: value })} />
                    </Field>
                    <Field label="Cargo">
                      <EditableInput value={selectedBlock.role} onChange={(value) => updateBlock(selectedBlock.id, { role: value })} />
                    </Field>
                    <Field label="Função">
                      <EditableInput value={selectedBlock.workerFunction} onChange={(value) => updateBlock(selectedBlock.id, { workerFunction: value })} />
                    </Field>
                    <Field label="Atividade / operação" full>
                      <EditableInput rows={2} value={selectedBlock.activityOperation} onChange={(value) => updateBlock(selectedBlock.id, { activityOperation: value })} />
                    </Field>
                    <Field label="Fonte geradora" full>
                      <EditableInput rows={2} value={selectedBlock.sourceGenerator} onChange={(value) => updateBlock(selectedBlock.id, { sourceGenerator: value })} />
                    </Field>
                    <Field label="Frequência de exposição">
                      <EditableSelect value={selectedBlock.exposureFrequency} options={prhoExposureFrequencyOptions} onChange={(value) => updateBlock(selectedBlock.id, { exposureFrequency: value })} />
                    </Field>
                    <Field label="Tempo de exposição">
                      <EditableInput value={selectedBlock.exposureTime} onChange={(value) => updateBlock(selectedBlock.id, { exposureTime: value })} />
                    </Field>
                    <Field label="Status do bloco">
                      <EditableSelect value={selectedBlock.blockReviewStatus} options={prhoBlockStatusOptions} onChange={(value) => updateBlock(selectedBlock.id, { blockReviewStatus: value })} />
                    </Field>
                    <Field label="Observação operacional" full>
                      <EditableInput rows={3} value={selectedBlock.operationalObservation} onChange={(value) => updateBlock(selectedBlock.id, { operationalObservation: value })} />
                    </Field>
                    <Field label="Origem documental" full>
                      <EditableInput rows={3} value={selectedBlock.documentOrigin} onChange={(value) => updateBlock(selectedBlock.id, { documentOrigin: value })} />
                    </Field>
                    <Field label="Gate de aprovação">
                      <EditableSelect value={selectedBlock.approvalStatus} options={prhoBlockApprovalOptions} onChange={(value) => updateBlock(selectedBlock.id, { approvalStatus: value })} />
                    </Field>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" className="min-h-9 px-3 text-[12px]">Editar bloco</Button>
                    <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => addBlockPendency(selectedBlock.id)}>
                      Criar pendência
                    </Button>
                    <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => markOutOfScope(selectedBlock.id)}>
                      Marcar fora do escopo
                    </Button>
                    <Button variant="primary" className="min-h-9 px-3 text-[12px]" onClick={() => approveBlock(selectedBlock.id)}>
                      Aprovar bloco
                    </Button>
                  </div>

                  {selectedPendencies.length ? (
                    <div className="grid gap-3 xl:grid-cols-2">
                      {selectedPendencies.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4",
                            selectedPendencies.length === 1 ? "max-w-[560px]" : "",
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="grid gap-1">
                              <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                                {item.title}
                              </strong>
                              <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge tone={getPendencyTone(item.severity)}>{item.severity}</Badge>
                              <StatusBadge status={item.status} />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <TechnicalBadge label={prhoPendingTypeLabels[item.type] || item.type} tone="review" />
                            <TechnicalBadge label={getDocumentById(item.sourceDocumentId)?.name || "Documento"} tone="status" />
                          </div>
                          <p className="text-[13px] leading-5 text-[var(--color-text-default)]">
                            Ação recomendada: {item.recommendedAction}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="secondary" className="min-h-9 px-3 text-[12px]" onClick={() => resolvePending(item.id, "Justificada")}>
                              Justificar
                            </Button>
                            <Button variant="primary" className="min-h-9 px-3 text-[12px]" onClick={() => resolvePending(item.id)}>
                              Resolver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Toast title="Nenhuma pendência aberta neste bloco" description="O bloco está limpo e pronto para seguir para os agentes ou avançar de etapa." />
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="grid gap-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                        Agentes do bloco
                      </p>
                      <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                        Revisão técnica completa
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="status">{filteredAgents.length} agentes visíveis</Badge>
                      <Button variant="tertiary" onClick={() => setShowFilters((value) => !value)}>
                        {showFilters ? "Ocultar filtros" : "Filtros"}
                      </Button>
                    </div>
                  </div>

                  {showFilters ? (
                    <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field label="Buscar agente">
                        <EditableInput value={search} onChange={setSearch} />
                      </Field>
                      <Field label="Tipo">
                        <EditableSelect value={typeFilter} options={prhoReviewFilterOptions.type} onChange={setTypeFilter} />
                      </Field>
                      <Field label="Status">
                        <EditableSelect value={statusFilter} options={prhoReviewFilterOptions.status} onChange={setStatusFilter} />
                      </Field>
                      <Field label="Bloco ativo">
                        <Input value={`${selectedBlock.label} • ${selectedBlock.title}`} readOnly />
                      </Field>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="min-h-9 px-3 text-[12px]"
                      onClick={() => {
                        setManualAgentDraft((current) => ({ ...current, blockId: selectedBlock.id }));
                        setShowManualAgentModal(true);
                      }}
                    >
                      Adicionar agente manual
                    </Button>
                    <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => addBlockPendency(selectedBlock.id)}>
                      Criar pendência
                    </Button>
                  </div>

                  {filteredAgents.length ? (
                    filteredAgents.map((agent) => (
                      <div key={agent.id} className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="grid gap-1">
                            <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                              {agent.name}
                            </h4>
                            <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                              {agent.originSummary}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge tone={agent.agentType === "Químico" ? "processing" : "status"}>{agent.agentType}</Badge>
                            <Badge tone={getPendencyTone(agent.criticality)}>{agent.criticality}</Badge>
                            <StatusBadge status={agent.reviewStatus} />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G1 • Identificação</span>
                            <Field label="Agente">
                              <EditableInput value={agent.name} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { name: value })} />
                            </Field>
                            <Field label="Tipo">
                              <EditableSelect value={agent.agentType} options={["Químico", "Físico", "Biológico"]} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { agentType: value })} />
                            </Field>
                            <Field label="CAS / referência">
                              <EditableInput value={agent.cas} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { cas: value })} />
                            </Field>
                            <Field label="Produto / fonte">
                              <EditableInput value={agent.sourceProduct} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { sourceProduct: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G2 • Origem operacional</span>
                            <Field label="Resumo de origem">
                              <EditableInput rows={3} value={agent.originSummary} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { originSummary: value })} />
                            </Field>
                            <div className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-3 text-[13px] text-[var(--color-text-soft)]">
                              <span>{selectedBlock.sectorLocation}</span>
                              <span>{selectedBlock.workerFunction}</span>
                              <span>{selectedBlock.activityOperation}</span>
                            </div>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G3 • Método e limites</span>
                            <Field label="Método validado">
                              <EditableInput value={agent.validatedMethod} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { validatedMethod: value })} />
                            </Field>
                            <Field label="TWA">
                              <EditableInput value={agent.twa} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { twa: value })} />
                            </Field>
                            <Field label="STEL">
                              <EditableInput value={agent.stel} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { stel: value })} />
                            </Field>
                            <Field label="Ceiling">
                              <EditableInput value={agent.ceiling} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { ceiling: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G4 • Trabalhista / previdenciário</span>
                            <Field label="NR-15 / anexo">
                              <EditableInput value={agent.nr15Annex} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { nr15Annex: value })} />
                            </Field>
                            <Field label="Limite NR-15">
                              <EditableInput value={agent.nr15Limit} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { nr15Limit: value })} />
                            </Field>
                            <Field label="eSocial">
                              <EditableInput value={agent.esocialCode} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { esocialCode: value })} />
                            </Field>
                            <Field label="Decreto 3048">
                              <EditableInput value={agent.decreeCode} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { decreeCode: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G5 • LINACH / carcinogenicidade</span>
                            <Field label="LINACH">
                              <EditableInput value={agent.linachStatus} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { linachStatus: value })} />
                            </Field>
                            <Field label="Carcinogenicidade">
                              <EditableInput value={agent.carcinogenicity} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { carcinogenicity: value })} />
                            </Field>
                            <Field label="Mutagenicidade">
                              <EditableInput value={agent.mutagenicity} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { mutagenicity: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G6 • Órgão alvo / efeitos</span>
                            <Field label="Órgão alvo">
                              <EditableInput value={agent.targetOrgan} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { targetOrgan: value })} />
                            </Field>
                            <Field label="Efeitos">
                              <EditableInput rows={3} value={agent.effects} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { effects: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G7 • Matriz de criticidade</span>
                            <Field label="Categoria AIHA">
                              <EditableSelect value={agent.aihaCategory} options={prhoCategoryOptions} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { aihaCategory: value })} />
                            </Field>
                            <Field label="Criticidade">
                              <EditableSelect value={agent.criticality} options={prhoCriticalityOptions} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { criticality: value })} />
                            </Field>
                            <Field label="Frequência sugerida">
                              <EditableSelect value={agent.suggestedFrequency} options={prhoFrequencyOptions} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { suggestedFrequency: value })} />
                            </Field>
                          </div>

                          <div className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">G8 • Decisão técnica</span>
                            <Field label="Decisão técnica">
                              <EditableSelect value={agent.technicalDecision} options={prhoDecisionOptions} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { technicalDecision: value })} />
                            </Field>
                            <Field label="Status do agente">
                              <EditableSelect value={agent.reviewStatus} options={prhoAgentLifecycleOptions} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { reviewStatus: value })} />
                            </Field>
                            <Field label="Justificativa técnica">
                              <EditableInput rows={3} value={agent.technicalJustification} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { technicalJustification: value })} />
                            </Field>
                            <Field label="Recomendação">
                              <EditableInput rows={3} value={agent.technicalRecommendation} onChange={(value) => updateAgent(selectedBlock.id, agent.id, { technicalRecommendation: value })} />
                            </Field>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => updateAgent(selectedBlock.id, agent.id, { reviewStatus: "Aprovado" })}>Aprovar</Button>
                          <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => updateAgent(selectedBlock.id, agent.id, { reviewStatus: "Corrigido" })}>Editar / corrigir</Button>
                          <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => updateAgent(selectedBlock.id, agent.id, { reviewStatus: "Não aplicável" })}>Marcar N/A</Button>
                          <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => addBlockPendency(selectedBlock.id)}>Criar pendência</Button>
                          <Button
                            variant="ghost"
                            className="min-h-9 px-3 text-[12px]"
                            onClick={() => (agent.pendingIds || []).forEach((pendingId) => resolvePending(pendingId))}
                          >
                            Resolver pendência
                          </Button>
                          <Button
                            variant="ghost"
                            className="min-h-9 px-3 text-[12px]"
                            onClick={() =>
                              setFeedback({
                                title: "Fonte rastreável",
                                description: `${getDocumentById(agent.sourceDocumentId)?.name || "Documento"} • ${agent.sourceExcerpt}`,
                              })
                            }
                          >
                            Ver fonte
                          </Button>
                          <Button
                            variant="destructive"
                            className="min-h-9 px-3 text-[12px]"
                            onClick={() =>
                              setBlocks((current) =>
                                current.map((block) =>
                                  block.id === selectedBlock.id
                                    ? {
                                        ...block,
                                        agents: block.agents.filter((item) => item.id !== agent.id),
                                      }
                                    : block,
                                ),
                              )
                            }
                          >
                            Remover da análise
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Nenhum agente visível neste bloco"
                      description="Adicione manualmente um agente, ajuste os filtros ou marque o bloco como fora de escopo."
                      action={(
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setManualAgentDraft((current) => ({ ...current, blockId: selectedBlock.id }));
                            setShowManualAgentModal(true);
                          }}
                        >
                          Adicionar agente manual
                        </Button>
                      )}
                    />
                  )}
                </div>
              )}
            </Panel>
          </div>
        ) : null}
      </Panel>

      <Modal
        open={showManualAgentModal}
        title="Adicionar agente manual"
        description="Inclusão de um agente por vez, no nível do bloco operacional, com busca técnica automática."
        actions={[
          <Button key="cancel-manual-block" variant="ghost" onClick={() => setShowManualAgentModal(false)}>
            Cancelar
          </Button>,
          <Button
            key="save-manual-block"
            variant="secondary"
            disabled={!manualAgentDraft.blockId || !manualAgentDraft.justification.trim()}
            onClick={saveManualAgent}
          >
            Salvar agente manual
          </Button>,
        ]}
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <Field label="Buscar agente na base interna">
              <EditableInput value={manualAgentDraft.searchQuery} placeholder="Ex.: tolueno, benzeno, ruído, calor" onChange={(value) => setManualAgentDraft((current) => ({ ...current, searchQuery: value }))} />
            </Field>
            <div className="flex items-end">
              <Button variant="tertiary" className="w-full" onClick={runManualSearch}>
                Buscar
              </Button>
            </div>
          </div>

          {manualAgentDraft.searchMessage ? <Toast title="Busca técnica automática" description={manualAgentDraft.searchMessage} /> : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Bloco vinculado">
              <select
                value={manualAgentDraft.blockId}
                onChange={(event) => setManualAgentDraft((current) => ({ ...current, blockId: event.target.value }))}
                className="min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]"
              >
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.label} • {block.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pendência vinculada">
              <select
                value={manualAgentDraft.linkedPendingId}
                onChange={(event) => setManualAgentDraft((current) => ({ ...current, linkedPendingId: event.target.value }))}
                className="min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]"
              >
                <option value="">Nenhuma pendência vinculada</option>
                {pendencies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Agente selecionado">
              <select
                value={manualAgentDraft.selectedAgentId}
                onChange={(event) => setManualAgentDraft((current) => ({ ...current, selectedAgentId: event.target.value }))}
                className="min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]"
              >
                <option value="">Selecionar resultado</option>
                {manualAgentSearchCatalog.flatMap((item) =>
                  item.status === "multiple"
                    ? item.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))
                    : [
                        <option key={item.id} value={item.id}>
                          {item.name} {item.cas ? `• ${item.cas}` : ""}
                        </option>,
                      ],
                )}
              </select>
            </Field>
            <Field label="Produto / mistura">
              <EditableInput value={manualAgentDraft.sourceProduct} onChange={(value) => setManualAgentDraft((current) => ({ ...current, sourceProduct: value }))} />
            </Field>
            <Field label="Concentração">
              <EditableInput value={manualAgentDraft.concentration} onChange={(value) => setManualAgentDraft((current) => ({ ...current, concentration: value }))} />
            </Field>
            <Field label="Unidade">
              <EditableInput value={manualAgentDraft.unit} onChange={(value) => setManualAgentDraft((current) => ({ ...current, unit: value }))} />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Justificativa da inclusão">
              <EditableInput rows={3} value={manualAgentDraft.justification} onChange={(value) => setManualAgentDraft((current) => ({ ...current, justification: value }))} />
            </Field>
            <Field label="Origem da informação">
              <EditableInput rows={3} value={manualAgentDraft.infoOrigin} onChange={(value) => setManualAgentDraft((current) => ({ ...current, infoOrigin: value }))} />
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(selectedWorksheetReference)}
        onClose={closeWorksheetReferenceModal}
        title={
          selectedWorksheetReference
            ? `Referência consultada • ${selectedWorksheetReference.label}`
            : "Referência consultada"
        }
        description={
          selectedWorksheetReference?.description ||
          "Bases técnicas vinculadas a este item da revisão."
        }
        actions={[
          <Button
            key="close-reference-modal"
            variant="ghost"
            onClick={() => setSelectedWorksheetReferenceId(null)}
          >
            Fechar
          </Button>,
        ]}
      >
        <div className="grid gap-3">
          {selectedWorksheetBases.map((base) => (
            <div
              key={base.id}
              className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    {base.name}
                  </strong>
                  <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    Versão {base.version} • vigência em {base.effectiveDate}
                  </span>
                </div>
                <StatusBadge status={base.status} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    Fonte
                  </span>
                  <span className="text-[13px] text-[var(--color-text-default)]">{base.source}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    Referência
                  </span>
                  <span className="text-[13px] text-[var(--color-text-default)]">{base.reference}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    Atualização
                  </span>
                  <span className="text-[13px] text-[var(--color-text-default)]">{base.updatedAt}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    Responsável
                  </span>
                  <span className="text-[13px] text-[var(--color-text-default)]">{base.owner}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <NavLink
                  to={`/app/settings/technical-bases#${base.id}`}
                  onClick={() => setSelectedWorksheetReferenceId(null)}
                  className={buttonStyles({
                    variant: "tertiary",
                    className: "min-h-9 gap-2 px-3 text-[13px]",
                  })}
                >
                  Abrir base técnica
                  <NavIcon name="link" className="size-3.5" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoClassificationBlocksPageLegacy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState(() => getPrhoReviewBlocksSeed());
  const [pendencies, setPendencies] = useState(() => getPrhoReviewPendenciesSeed());
  const metrics = getPrhoOperationalMetrics(blocks, pendencies);
  const [classificationDecision, setClassificationDecision] = useState("Quantificar");
  const [classificationNotes, setClassificationNotes] = useState(
    "Classificação consolidada por blocos operacionais, sem repetir a revisão linha a linha.",
  );

  function updateBlock(blockId, patch) {
    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
    );
  }

  function updateAgent(blockId, agentId, patch) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              agents: block.agents.map((agent) =>
                agent.id === agentId ? { ...agent, ...patch } : agent,
              ),
            }
          : block,
      ),
    );
  }

  const canAdvance = metrics.criticalPendencies.length === 0;

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title="Classificação por blocos operacionais"
          description="Aqui a validação é mais enxuta: decisão técnica, criticidade e bloqueios por bloco, sem reabrir toda a revisão."
          actions={[
            <Button
              key="summary"
              variant={canAdvance ? "primary" : "tertiary"}
              disabled={!canAdvance}
              onClick={() => navigate(`/app/prho/${id}/summary`)}
            >
              {canAdvance ? "Ir para aprovação" : "Pendências críticas impedem avanço"}
            </Button>,
          ]}
        >
          <Stepper steps={flowSteps} current={3} />
        </PageHeader>
      }
      bodyClassName="grid gap-5"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Blocos em classificação" value={blocks.length} hint="Validação por lote operacional" tone="info" />
        <StatCard label="Agentes aprováveis" value={metrics.approvedAgents} hint="Prontos para fechamento" tone="positive" />
        <StatCard label="Quantificáveis" value={metrics.quantifiableAgents} hint="Base do pré-orçamento" tone="positive" />
        <StatCard label="Pendências abertas" value={metrics.openPendencies.length} hint="Ainda visíveis nesta etapa" tone={metrics.criticalPendencies.length ? "critical" : "review"} />
        <StatCard label="Blocos sem agente" value={metrics.blocksWithoutAgent} hint="Podem ser validados como fora de escopo" tone={metrics.blocksWithoutAgent ? "review" : "positive"} />
        <StatCard label="Segredos industriais" value={metrics.openPendencies.filter((item) => item.type === "industrial_secret").length} hint="Afetam liberação final" tone="critical" />
      </div>

      {!canAdvance ? <Toast title="Classificação ainda bloqueada" description="Pendências críticas continuam impedindo a aprovação final da análise." /> : null}

      <Panel className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          {blocks.map((block) => {
            const blockPendings = pendencies.filter(
              (item) => item.blockId === block.id && item.status !== "Resolvida",
            );
            const blockHasCritical = blockPendings.some((item) => item.severity === "Crítica");
            return (
              <div key={block.id} className="grid gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                      {block.label}
                    </p>
                    <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                      {block.title}
                    </h3>
                    <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                      {block.sectorLocation} • {block.workerFunction}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={block.blockReviewStatus} />
                    <Badge tone={blockHasCritical ? "critical" : "processing"}>
                      {blockHasCritical ? "Bloqueado" : "Pronto para validar"}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Bloco</span>
                    <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.gheCode}</p>
                  </div>
                  <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Agentes</span>
                    <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.agents.length}</p>
                  </div>
                  <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Pendências</span>
                    <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{blockPendings.length}</p>
                  </div>
                  <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Aprovação do bloco</span>
                    <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.approvalStatus}</p>
                  </div>
                  <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Confiança</span>
                    <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.extractionConfidence}%</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {block.agents.length ? (
                    block.agents.map((agent) => (
                      <div key={agent.id} className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 xl:grid-cols-[1.2fr_0.85fr_0.95fr_0.85fr_0.8fr]">
                        <div className="grid gap-1">
                          <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">{agent.name}</strong>
                          <span className="text-[13px] text-[var(--color-text-soft)]">{agent.agentType} • {agent.cas || agent.sourceProduct}</span>
                        </div>
                        <Field label="Método">
                          <EditableInput value={agent.validatedMethod} onChange={(value) => updateAgent(block.id, agent.id, { validatedMethod: value })} />
                        </Field>
                        <Field label="Limite / base">
                          <EditableInput value={agent.nr15Limit || agent.twa} onChange={(value) => updateAgent(block.id, agent.id, { nr15Limit: value })} />
                        </Field>
                        <Field label="Decisão">
                          <EditableSelect value={agent.technicalDecision} options={prhoClassificationDecisionOptions} onChange={(value) => updateAgent(block.id, agent.id, { technicalDecision: value })} />
                        </Field>
                        <Field label="Categoria / criticidade">
                          <EditableInput value={`${agent.aihaCategory} • ${agent.criticality}`} onChange={() => {}} className="pointer-events-none opacity-80" />
                        </Field>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4 text-[14px] leading-6 text-[var(--color-text-soft)]">
                      Este bloco não possui agentes de higiene válidos e pode ser validado como fora de escopo ou complementado manualmente.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="min-h-9 px-3 text-[12px]" onClick={() => updateBlock(block.id, { approvalStatus: blockHasCritical ? "Bloqueado" : "Validado" })}>
                    Validar bloco
                  </Button>
                  <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => updateBlock(block.id, { approvalStatus: "Validado com ressalva" })}>
                    Validar com ressalva
                  </Button>
                  <Button variant="ghost" className="min-h-9 px-3 text-[12px]" onClick={() => navigate(`/app/prho/${id}/review`)}>
                    Voltar para revisão
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4">
          <Panel className="grid gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Fechamento da classificação
            </p>
            <Field label="Decisão consolidada">
              <EditableSelect value={classificationDecision} options={prhoClassificationDecisionOptions} onChange={setClassificationDecision} />
            </Field>
            <Field label="Justificativa consolidada">
              <EditableInput rows={4} value={classificationNotes} onChange={setClassificationNotes} />
            </Field>
          </Panel>

          <Panel className="grid gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Bloqueios remanescentes
            </p>
            {metrics.openPendencies.map((item) => (
              <div key={item.id} className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">{item.title}</strong>
                  <Badge tone={getPendencyTone(item.severity)}>{item.severity}</Badge>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-soft)]">{item.description}</p>
              </div>
            ))}
          </Panel>
        </div>
      </Panel>
    </UnifiedPagePanel>
  );
}

function PrhoSummaryBlocksPageLegacy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const blocks = getPrhoReviewBlocksSeed();
  const pendencies = getPrhoReviewPendenciesSeed();
  const metrics = getPrhoOperationalMetrics(blocks, pendencies);
  const [approvalState, setApprovalState] = useState(() =>
    readAnalysisApprovalState(analysis.id, "draft"),
  );
  const [showApprovalNotesModal, setShowApprovalNotesModal] = useState(false);
  const [approvalNotesDraft, setApprovalNotesDraft] = useState({
    justification: "Aprovação com ressalvas limitada a pendências não críticas já registradas por bloco.",
    responsible: analysis.responsible || "Reginaldo Melo",
    maintainedPending: metrics.openPendencies[0]?.title || "",
    expectedImpact: "A análise pode seguir, mantendo visível a pendência não bloqueante no histórico técnico.",
    confirmation: false,
  });

  const approvalChecklist = [
    {
      id: "blocks-reviewed",
      label: "Todos os blocos operacionais foram revisados?",
      detail: "Cada bloco precisa ter status claro antes da aprovação final.",
      status: blocks.every((block) => block.blockReviewStatus !== "Pendente") ? "OK" : "Bloqueado",
    },
    {
      id: "agents-decided",
      label: "Todos os agentes possuem decisão técnica?",
      detail: "Aprovação depende de decisão e recomendação técnica por agente.",
      status: metrics.agents.every((agent) => agent.technicalDecision?.trim()) ? "OK" : "Bloqueado",
    },
    {
      id: "block-without-agent",
      label: "Blocos sem agente foram tratados?",
      detail: "Blocos vazios precisam estar fora de escopo ou complementados manualmente.",
      status: metrics.blocksWithoutAgent ? "Atenção" : "OK",
    },
    {
      id: "industrial-secret",
      label: "Existe segredo industrial em aberto?",
      detail: "Segredo industrial aberto bloqueia a aprovação final do mockup.",
      status: metrics.openPendencies.some((item) => item.type === "industrial_secret") ? "Bloqueado" : "OK",
    },
    {
      id: "generic-without-fds",
      label: "Agente genérico sem FDS/FISPQ ou justificativa?",
      detail: "Agentes genéricos exigem fonte técnica ou justificativa explícita.",
      status: metrics.agentsWithoutMethod ? "Atenção" : "OK",
    },
    {
      id: "quantify-method",
      label: "Todo agente a quantificar tem método avaliado?",
      detail: "A recomendação comercial só nasce de agente quantificável com método validado.",
      status: metrics.agents.every((agent) => agent.technicalDecision !== "Quantificar" || agent.validatedMethod?.trim()) ? "OK" : "Bloqueado",
    },
  ];
  const hasBlockingChecklist = approvalChecklist.some((item) => item.status === "Bloqueado");
  const canApprove = !hasBlockingChecklist && metrics.criticalPendencies.length === 0;
  const canApproveWithNotes = !hasBlockingChecklist;
  const preQuoteReleased = isReleasedApprovalState(approvalState);

  function persistApprovalState(nextState) {
    setApprovalState(nextState);
    saveAnalysisApprovalState(analysis.id, nextState);
  }

  function submitApprovalWithNotes() {
    if (
      !approvalNotesDraft.justification.trim() ||
      !approvalNotesDraft.responsible.trim() ||
      !approvalNotesDraft.expectedImpact.trim() ||
      !approvalNotesDraft.confirmation
    ) {
      return;
    }

    persistApprovalState("approved_with_notes");
    setShowApprovalNotesModal(false);
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Resumo e aprovação da análise • ${analysis.code}`}
          description="Fechamento final por blocos operacionais, com checklist, bloqueios e liberação do pré-orçamento apenas para agentes aprovados."
          actions={preQuoteReleased ? [
            <NavLink key="prequote" to="/app/pre-quotations/pre-041" className={buttonStyles({ variant: "primary" })}>
              Ir para pré-orçamento
            </NavLink>,
          ] : []}
        >
          <Stepper steps={flowSteps} current={4} />
        </PageHeader>
      }
      bodyClassName="grid gap-5"
    >
      <Panel className="flex flex-wrap justify-end gap-2">
        <Button key="back-review-inline" variant="ghost" onClick={() => navigate(`/app/prho/${id}/review`)}>
          Voltar para revisão
        </Button>
        <Button key="draft-inline" variant="tertiary" onClick={() => persistApprovalState("draft")}>
          Salvar rascunho
        </Button>
        <Button key="approve-inline" variant={canApprove ? "primary" : "tertiary"} disabled={!canApprove} onClick={() => canApprove && persistApprovalState("approved")}>
          Aprovar análise
        </Button>
        <Button
          key="approve-with-notes-inline"
          variant={canApproveWithNotes ? "secondary" : "tertiary"}
          disabled={!canApproveWithNotes}
          onClick={() => canApproveWithNotes && setShowApprovalNotesModal(true)}
        >
          Aprovar com ressalvas
        </Button>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Documentos analisados" value={analysis.documents} hint="Arquivos usados na aprovação" />
        <StatCard label="Blocos aprovados" value={metrics.approvedBlocks} hint="Validados ou com ressalva" tone="positive" />
        <StatCard label="Agentes aprovados" value={metrics.approvedAgents} hint="Prontos para histórico final" tone="positive" />
        <StatCard label="Agentes para quantificar" value={metrics.quantifiableAgents} hint="Base do pré-orçamento" tone="positive" />
        <StatCard label="Pendências abertas" value={metrics.openPendencies.length} hint="Permanecem visíveis no fechamento" tone={metrics.criticalPendencies.length ? "critical" : "review"} />
        <StatCard label="Bloqueios críticos" value={metrics.criticalPendencies.length} hint="Impedem aprovação total" tone={metrics.criticalPendencies.length ? "critical" : "positive"} />
      </div>

      {metrics.criticalPendencies.length ? (
        <Toast
          className="py-7"
          title="Pendências críticas ainda bloqueiam a aprovação"
          description="Enquanto houver pendência crítica aberta sem justificativa, a aprovação final e a liberação do pré-orçamento devem permanecer bloqueadas."
        />
      ) : null}

      <Panel className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {blocks.slice(0, 2).map((block) => (
            <div key={block.id} className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                {block.label}
              </p>
              <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                {block.title}
              </h3>
              <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                {block.sectorLocation} • {block.workerFunction}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusBadge status={block.blockReviewStatus} />
                <Badge tone="status">{block.agents.length} agentes</Badge>
                <Badge tone="review">{block.pendencyIds.length} pendências</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Checklist de aprovação
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Validação final antes do pré-orçamento
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {approvalChecklist.map((item) => (
              <ApprovalChecklistItem
                key={item.id}
                label={item.label}
                description={item.detail}
                status={
                  item.status === "OK"
                    ? "ok"
                    : item.status === "Atenção"
                      ? "attention"
                      : "blocked"
                }
                onViewProblem={item.status === "OK" ? undefined : () => navigate(`/app/prho/${analysis.id}/review`)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                    Snapshot do bloco
                  </p>
                  <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                    {block.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={block.blockReviewStatus} />
                  <Badge tone="status">{block.approvalStatus}</Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Setor / local</span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.sectorLocation}</p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Agentes</span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.agents.length}</p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Pendências abertas</span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{pendencies.filter((item) => item.blockId === block.id && item.status !== "Resolvida").length}</p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">Agentes para quantificar</span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">{block.agents.filter((agent) => agent.technicalDecision === "Quantificar").length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={showApprovalNotesModal}
        title="Aprovar com ressalvas"
        description="Registre a justificativa geral, o responsável e o impacto técnico mantido na aprovação."
        actions={[
          <Button key="cancel-approval-with-notes" variant="ghost" onClick={() => setShowApprovalNotesModal(false)}>
            Cancelar
          </Button>,
          <Button
            key="save-approval-with-notes"
            variant="secondary"
            disabled={
              !approvalNotesDraft.justification.trim() ||
              !approvalNotesDraft.responsible.trim() ||
              !approvalNotesDraft.expectedImpact.trim() ||
              !approvalNotesDraft.confirmation
            }
            onClick={submitApprovalWithNotes}
          >
            Confirmar aprovação com ressalvas
          </Button>,
        ]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Justificativa geral">
            <EditableInput rows={3} value={approvalNotesDraft.justification} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, justification: value }))} />
          </Field>
          <Field label="Responsável técnico">
            <EditableInput value={approvalNotesDraft.responsible} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, responsible: value }))} />
          </Field>
          <Field label="Pendência mantida">
            <EditableInput value={approvalNotesDraft.maintainedPending} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, maintainedPending: value }))} />
          </Field>
          <Field label="Impacto esperado">
            <EditableInput rows={3} value={approvalNotesDraft.expectedImpact} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, expectedImpact: value }))} />
          </Field>
        </div>

        <label className="flex items-start gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
          <input
            type="checkbox"
            checked={approvalNotesDraft.confirmation}
            onChange={(event) =>
              setApprovalNotesDraft((current) => ({
                ...current,
                confirmation: event.target.checked,
              }))
            }
            className="mt-1 size-4 rounded border-[var(--color-border-subtle)]"
          />
          <span className="grid gap-1">
            <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
              Confirmo que as ressalvas foram avaliadas e continuarão visíveis na aprovação final
            </span>
            <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
              A aprovação com ressalvas não elimina pendências nem substitui a rastreabilidade técnica do mockup.
            </span>
          </span>
        </label>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoReviewBlocksPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const blocks = getPrhoReviewBlocksSeed();
  const [reviewRows, setReviewRows] = useState(() => buildAnalysisReviewRowsSeed(analysis.id));
  const [showFilters, setShowFilters] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showNhoLibraryModal, setShowNhoLibraryModal] = useState(false);
  const [showLearningMode, setShowLearningMode] = useState(false);
  const [selectedWorksheetReferenceId, setSelectedWorksheetReferenceId] = useState(null);
  const [worksheetReferenceQuery, setWorksheetReferenceQuery] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id || "");
  const [workspaceTab, setWorkspaceTab] = useState(prhoBlockWorkspaceTabs[0].id);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [manualAgentDraft, setManualAgentDraft] = useState(() => ({
    ...createManualAgentDraft(),
    blockId: blocks[0]?.id || "",
    sourceDocumentId: documents[0]?.id || "",
    reviewStatus: "Pendente",
    frequency: "Semestral",
  }));
  const blockOptions = ["Todos", ...new Set(reviewRows.map((row) => row.blockLabel).filter(Boolean))];
  const readyStatuses = new Set(["Aprovado", "Corrigido", "Aprovado com ressalva", "Não aplicável"]);
  const blockedStatuses = new Set(["Pendente", "Reprovado", "Bloqueado", "Dados insuficientes"]);

  useEffect(() => {
    saveAnalysisReviewRows(analysis.id, reviewRows);
  }, [analysis.id, reviewRows]);

  const filteredRows = reviewRows.filter((row) => {
    const haystack = [
      row.name,
      row.cas,
      row.reference,
      row.blockLabel,
      row.blockTitle,
      row.source,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || haystack.includes(search.toLowerCase());
    const matchesBlock = blockFilter === "Todos" || row.blockLabel === blockFilter;
    const matchesType = typeFilter === "Todos" || row.agentType === typeFilter;
    const matchesStatus = statusFilter === "Todos" || row.reviewStatus === statusFilter;

    return matchesSearch && matchesBlock && matchesType && matchesStatus;
  });

  const rowsMissingWorksheetData = reviewRows.filter((row) => getWorksheetMissingPoints(row).length > 0).length;
  const rowsBlocked = reviewRows.filter((row) => blockedStatuses.has(row.reviewStatus)).length;
  const readyForBudget = reviewRows.filter(
    (row) => row.technicalDecision === "Quantificar" && readyStatuses.has(row.reviewStatus),
  ).length;
  const readyForApproval = reviewRows.filter(
    (row) => getWorksheetMissingPoints(row).length === 0 && readyStatuses.has(row.reviewStatus),
  ).length;
  const selectedWorksheetReference = prhoWorksheetReferenceItems.find(
    (item) => item.id === selectedWorksheetReferenceId,
  );
  const selectedBlock =
    blocks.find((block) => block.id === selectedBlockId) || blocks[0] || null;
  const selectedBlockRows = reviewRows.filter((row) => row.blockId === selectedBlock?.id);
  const selectedBlockPendencies = prhoReviewPendenciesSeed.filter(
    (item) => item.blockId === selectedBlock?.id,
  );
  const assistantInsights = buildPrhoAssistantInsights(assistantQuery);
  const conformityItems = [
    {
      ...prhoConformityGuide[0],
      pending: reviewRows.filter((row) => !row.nr15Annex?.trim() || !row.nr15Limit?.trim()).length,
    },
    {
      ...prhoConformityGuide[1],
      pending: reviewRows.filter((row) => !(row.validatedMethod || row.suggestedMethod)?.trim()).length,
    },
    {
      ...prhoConformityGuide[2],
      pending: reviewRows.filter((row) => !row.esocialCode?.trim() || !row.decretoCode?.trim()).length,
    },
    {
      ...prhoConformityGuide[3],
      pending: reviewRows.filter((row) => !row.linachStatus?.trim() || !row.carcinogenicity?.trim()).length,
    },
  ];
  const selectedWorksheetBases = technicalBasesCatalog.filter((base) =>
    selectedWorksheetReference?.baseIds?.includes(base.id),
  );
  const normalizedWorksheetReferenceQuery = normalizeLooseText(worksheetReferenceQuery);
  const filteredAihaProfiles = aihaMatrixAgentProfiles.filter((profile) =>
    !normalizedWorksheetReferenceQuery ||
    normalizeLooseText(
      [
        profile.name,
        profile.type,
        profile.riskLevel,
        profile.nr15,
        profile.decree,
        profile.linach,
        profile.carcinogenic,
        profile.ges,
        profile.measurement,
        profile.method,
        profile.monitoring,
        profile.notes,
      ].join(" "),
    ).includes(normalizedWorksheetReferenceQuery),
  );
  const filteredAihaRequiredRules = aihaMatrixMeasurementRules.required.filter((item) =>
    !normalizedWorksheetReferenceQuery ||
    normalizeLooseText(item).includes(normalizedWorksheetReferenceQuery),
  );
  const filteredAihaNotRequiredRules = aihaMatrixMeasurementRules.notRequired.filter((item) =>
    !normalizedWorksheetReferenceQuery ||
    normalizeLooseText(item).includes(normalizedWorksheetReferenceQuery),
  );
  const filteredAihaReferences = aihaMatrixReferenceList.filter((item) =>
    !normalizedWorksheetReferenceQuery ||
    normalizeLooseText(item).includes(normalizedWorksheetReferenceQuery),
  );
  const industrialSecretSignals = [
    ...reviewRows
      .filter(
        (row) =>
          row.pendingTypes?.includes("industrial_secret") ||
          row.reviewStatus === "Segredo industrial" ||
          String(row.concentration || "").toLowerCase().includes("segredo industrial") ||
          String(row.sourceExcerpt || "").toLowerCase().includes("segredo industrial") ||
          Boolean(row.hiddenComponent),
      )
      .map((row) => {
        const sourceDocument = documents.find((item) => item.id === row.sourceDocumentId);
        return {
          id: `row-secret-${row.id}`,
          type: "row",
          title: row.name,
          block: `${row.blockLabel} • ${row.blockTitle}`,
          document: sourceDocument?.name || row.source || "Documento não identificado",
          point:
            row.hiddenComponent ||
            row.sourceExcerpt ||
            row.observation ||
            "Composição protegida ou componente não revelado.",
          status: row.reviewStatus || "Pendente",
        };
      }),
    ...documents
      .filter(
        (document) =>
          /segredo industrial/i.test(document.alert || "") ||
          /segredo industrial/i.test(document.note || "") ||
          /segredo industrial/i.test(document.preview || ""),
      )
      .map((document) => ({
        id: `doc-secret-${document.id}`,
        type: "document",
        title: "Documento com restrição de composição",
        block: "Exige leitura humana",
        document: document.name,
        point: document.preview || document.note || document.alert,
        status: document.status,
      })),
  ].filter(
    (item, index, array) =>
      array.findIndex((candidate) => candidate.document === item.document && candidate.point === item.point) ===
      index,
  );

  function updateReviewRow(rowId, patch) {
    setReviewRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              ...patch,
              ...resolveWorksheetBlockContext({ ...row, ...patch }, blocks),
            }
          : row,
      ),
    );
  }

  function closeWorksheetReferenceModal() {
    setSelectedWorksheetReferenceId(null);
    setWorksheetReferenceQuery("");
  }

  function resetManualAgentDraft() {
    setManualAgentDraft({
      ...createManualAgentDraft(),
      blockId: blocks[0]?.id || "",
      sourceDocumentId: documents[0]?.id || "",
      reviewStatus: "Pendente",
      frequency: "Semestral",
    });
  }

  function applyManualSearchSuggestion(result, overrides = {}) {
    if (!result) {
      return;
    }

    setManualAgentDraft((current) => ({
      ...current,
      ...overrides,
      selectedSearchResultId: result.id || "",
      searchResults: [],
      prefilledFromSearch: true,
      confidence: result.confidence || 0,
      confidenceLevel: result.confidenceLevel || current.confidenceLevel,
      name: result.name || current.name,
      standardizedName: result.standardizedName || current.standardizedName,
      agentType: result.agentType || current.agentType,
      cas: result.cas || current.cas,
      physicalState: result.physicalState || current.physicalState,
      unit: result.unit || current.unit,
      suggestedMethod: result.suggestedMethod || current.suggestedMethod,
      nr15Annex: result.nr15Annex || current.nr15Annex,
      nr15Limit: result.nr15Limit || current.nr15Limit,
      acgihTwa: result.acgihTwa || current.acgihTwa,
      esocialCode: result.esocialCode || current.esocialCode,
      decretoCode: result.decretoCode || current.decretoCode,
      linachStatus: result.linachStatus || current.linachStatus,
      targetOrgan: result.targetOrgan || current.targetOrgan,
      aihaCategory: result.aihaCategory || current.aihaCategory,
      technicalDecision: result.technicalDecision || current.technicalDecision,
      technicalRecommendation: result.technicalRecommendation || current.technicalRecommendation,
      technicalObservation: result.technicalObservation || current.technicalObservation,
      source: result.source || current.source,
      evidenceSource: result.evidenceSource || current.evidenceSource,
    }));
  }

  function runManualSearch() {
    const query = manualAgentDraft.searchQuery?.trim();
    if (!query) {
      setManualAgentDraft((current) => ({
        ...current,
        searchMessage: "Informe o nome do agente ou o CAS antes de buscar.",
        searchStatus: "idle",
      }));
      return;
    }

    const match = findManualAgentSearchMatch(query);

    if (!match) {
      setManualAgentDraft((current) => ({
        ...current,
        searchStatus: "none",
        searchResults: [],
        selectedSearchResultId: "",
        searchMessage:
          "Nenhuma correspondência automática encontrada. Você pode continuar preenchendo o agente manualmente.",
      }));
      return;
    }

    if (match.status === "multiple") {
      setManualAgentDraft((current) => ({
        ...current,
        searchStatus: "multiple",
        searchResults: match.options || [],
        selectedSearchResultId: match.options?.[0]?.id || "",
        searchMessage: "Foram encontradas múltiplas opções. Escolha a mais adequada antes de salvar.",
      }));
      return;
    }

    applyManualSearchSuggestion(match, {
      searchStatus: match.status,
      searchMessage:
        match.status === "partial"
          ? "Base técnica encontrou uma referência parcial. O fechamento deve continuar manualmente."
          : "Dados técnicos sugeridos encontrados. Revise antes de salvar.",
    });
  }

  function selectManualSearchOption(optionId) {
    const option = manualAgentDraft.searchResults.find((item) => item.id === optionId);
    if (!option) {
      return;
    }

    applyManualSearchSuggestion(option, {
      selectedSearchResultId: optionId,
      searchStatus: "success",
      searchMessage: "Opção aplicada no formulário. Continue a validação manual.",
    });
  }

  function saveManualAgent() {
    if (!manualAgentDraft.name?.trim() || !manualAgentDraft.manualJustification?.trim()) {
      return;
    }

    const linkedBlock = blocks.find((item) => item.id === manualAgentDraft.blockId) || blocks[0];
    const linkedDocument = documents.find((item) => item.id === manualAgentDraft.sourceDocumentId);
    const hasIndustrialSecret = Boolean(
      manualAgentDraft.industrialSecret ||
        /segredo industrial/i.test(
          [
            manualAgentDraft.hiddenComponent,
            manualAgentDraft.manualJustification,
            manualAgentDraft.technicalObservation,
          ]
            .filter(Boolean)
            .join(" "),
        ),
    );

    const nextRow = buildReviewRow({
      id: `manual-row-${Date.now()}`,
      manual: true,
      pendingTypes: hasIndustrialSecret ? ["industrial_secret"] : [],
      name: manualAgentDraft.name,
      standardizedName: manualAgentDraft.standardizedName || manualAgentDraft.name,
      agentType: manualAgentDraft.agentType || "Químico",
      cas: manualAgentDraft.cas || "",
      reference: manualAgentDraft.cas || "Inclusão manual",
      concentration:
        manualAgentDraft.concentration || (hasIndustrialSecret ? "Segredo industrial" : ""),
      unit: manualAgentDraft.unit || "",
      physicalState: manualAgentDraft.physicalState || "",
      sector: manualAgentDraft.sector || linkedBlock?.sectorLocation || "",
      workerFunction: manualAgentDraft.workerFunction || linkedBlock?.workerFunction || "",
      ghe: manualAgentDraft.ghe || linkedBlock?.gheCode || "",
      frequency: manualAgentDraft.frequency || "Semestral",
      suggestedMethod: manualAgentDraft.suggestedMethod || "",
      validatedMethod: manualAgentDraft.suggestedMethod || "",
      nr15Annex: manualAgentDraft.nr15Annex || "",
      nr15Limit: manualAgentDraft.nr15Limit || "",
      acgihTwa: manualAgentDraft.acgihTwa || "",
      esocialCode: manualAgentDraft.esocialCode || "",
      decretoCode: manualAgentDraft.decretoCode || "",
      linachStatus: manualAgentDraft.linachStatus || "",
      targetOrgan: manualAgentDraft.targetOrgan || "",
      aihaCategory: manualAgentDraft.aihaCategory || "Categoria 3",
      risk: hasIndustrialSecret ? "Crítica" : "Média",
      technicalDecision:
        manualAgentDraft.technicalDecision ||
        (hasIndustrialSecret ? "Solicitar informação complementar" : "Avaliação manual necessária"),
      reviewStatus: hasIndustrialSecret ? "Segredo industrial" : manualAgentDraft.reviewStatus || "Pendente",
      technicalJustification: manualAgentDraft.manualJustification,
      technicalRecommendation:
        manualAgentDraft.technicalRecommendation ||
        (hasIndustrialSecret
          ? "Seguir somente com tratamento manual e justificativa explícita."
          : "Completar validação humana antes de aprovar."),
      observation: manualAgentDraft.technicalObservation || "",
      source: linkedDocument?.name || manualAgentDraft.source || "Inclusão manual",
      sourceDocumentId: linkedDocument?.id,
      sourceExcerpt:
        manualAgentDraft.hiddenComponent ||
        manualAgentDraft.technicalObservation ||
        manualAgentDraft.manualJustification,
      hiddenComponent: hasIndustrialSecret ? manualAgentDraft.hiddenComponent || "Componente protegido pelo fabricante" : "",
      confidence: manualAgentDraft.prefilledFromSearch ? manualAgentDraft.confidence || 78 : 100,
      manualJustification: manualAgentDraft.manualJustification,
      attachmentEvidence: linkedDocument?.name || manualAgentDraft.attachmentEvidence || "",
    });

    setReviewRows((current) => [
      {
        ...nextRow,
        ...resolveWorksheetBlockContext(nextRow, blocks),
      },
      ...current,
    ]);
    setShowAddAgentModal(false);
    resetManualAgentDraft();
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Revisão técnica consolidada • ${analysis.code}`}
          description="A revisão agora segue a estrutura da APR HO: uma linha por agente, com contexto do bloco, limites ocupacionais, AIHA, decisão técnica e rastreabilidade na mesma tela."
          actions={[
            <Button
              key="nho-library"
              variant="tertiary"
              onClick={() => setShowNhoLibraryModal(true)}
            >
              Biblioteca NHO
            </Button>,
            <Button
              key="back-processing"
              variant="ghost"
              onClick={() => navigate(`/app/prho/${id}/processing`)}
            >
              Voltar ao processamento
            </Button>,
            <Button
              key="summary"
              variant="primary"
              onClick={() => navigate(`/app/prho/${id}/summary`)}
            >
              Seguir para aprovação
            </Button>,
          ]}
          meta={[
            <Badge key="rows" tone="review">
              {reviewRows.length} linhas APR HO
            </Badge>,
            <Badge key="blocks" tone="status">
              {blockOptions.length - 1} blocos
            </Badge>,
            <Badge
              key="issues"
              tone={rowsMissingWorksheetData || rowsBlocked ? "critical" : "positive"}
            >
              {rowsMissingWorksheetData + rowsBlocked} pontos de atenção
            </Badge>,
          ]}
        >
          <Stepper steps={flowSteps} current={2} />
        </PageHeader>
      }
      bodyClassName="grid gap-5"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Linhas da planilha"
          value={reviewRows.length}
          hint="Base consolidada da APR HO"
        />
        <StatCard
          label="Prontas para aprovação"
          value={readyForApproval}
          hint="Linhas sem lacunas centrais do Excel"
          tone={readyForApproval === reviewRows.length ? "positive" : "review"}
        />
        <StatCard
          label="Pontos pendentes"
          value={rowsMissingWorksheetData}
          hint="Campos obrigatórios ainda incompletos"
          tone={rowsMissingWorksheetData ? "critical" : "positive"}
        />
        <StatCard
          label="Indicadas ao orçamento"
          value={readyForBudget}
          hint="Linhas com decisão de quantificar"
          tone="positive"
        />
      </div>

      {rowsMissingWorksheetData || rowsBlocked ? (
        <Toast
          title="A classificação separada foi removida"
          description="Agora o fechamento depende apenas da tabela de revisão e da aprovação final, sem uma etapa intermediária adicional."
        />
      ) : null}

      <Panel className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Revisão operacional
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Contexto mínimo antes do fechamento da APR HO
            </h3>
            <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
              O foco aqui é decidir rápido: qual bloco está sendo revisado, quais agentes ainda exigem ação e o que já pode seguir para aprovação.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="tertiary" onClick={() => setShowNhoLibraryModal(true)}>
              Biblioteca NHO
            </Button>
            <Button variant="secondary" onClick={() => setShowAddAgentModal(true)}>
              Adicionar novo agente
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,260px)_repeat(3,minmax(0,1fr))]">
          <Field label="Bloco em foco">
            <select
              value={selectedBlockId}
              onChange={(event) => setSelectedBlockId(event.target.value)}
              className="min-h-10 w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--input-bg)] px-3 text-[13px] text-[var(--color-text-default)] outline-none transition focus:ring-4 focus:ring-[rgba(45,130,183,0.16)]"
            >
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.label} • {block.title}
                </option>
              ))}
            </select>
          </Field>
          <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Contexto
            </p>
            <strong className="mt-2 block text-[14px] font-semibold text-[var(--color-text-strong)]">
              {selectedBlock?.sectorLocation || "Sem setor"}
            </strong>
            <span className="mt-1 block text-[13px] leading-5 text-[var(--color-text-soft)]">
              {selectedBlock?.workerFunction || "Sem função"} • {selectedBlock?.gheCode || "Sem GHE"}
            </span>
          </div>
          <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Agentes do bloco
            </p>
            <strong className="mt-2 block text-[22px] font-semibold leading-none text-[var(--color-text-strong)]">
              {selectedBlockRows.length}
            </strong>
            <span className="mt-1 block text-[13px] leading-5 text-[var(--color-text-soft)]">
              {selectedBlockRows.filter((row) => blockedStatuses.has(row.reviewStatus)).length} ainda exigem ação
            </span>
          </div>
          <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Pendências do bloco
            </p>
            <strong className="mt-2 block text-[22px] font-semibold leading-none text-[var(--color-text-strong)]">
              {selectedBlockPendencies.length}
            </strong>
            <span className="mt-1 block text-[13px] leading-5 text-[var(--color-text-soft)]">
              {selectedBlock?.blockReviewStatus || "Em revisão"}
            </span>
          </div>
        </div>

        {selectedBlock ? (
          <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <TechnicalBadge label={selectedBlock.exposureFrequency || "Sem frequência"} tone="status" />
              <TechnicalBadge label={selectedBlock.exposureTime || "Sem tempo"} tone="review" />
              <TechnicalBadge label={`${selectedBlock.extractionConfidence}% confiança`} tone="review" />
              <StatusBadge status={selectedBlock.blockReviewStatus} />
            </div>
            <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-soft)]">
              {selectedBlock.activityOperation}
            </p>
          </div>
        ) : null}
      </Panel>

      <Panel className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Base do Excel
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Revisão única em tabela operacional
            </h3>
            <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
              A tabela foi reduzida para o essencial do fechamento técnico: quem é o agente, onde ele está, qual a base técnica, qual a decisão e o que ainda pede ação humana.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="tertiary" onClick={() => setShowFilters((current) => !current)}>
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {prhoWorksheetReferenceItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedWorksheetReferenceId(item.id)}
              className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 text-left text-[12px] font-semibold text-[var(--color-brand-foreground)] transition hover:border-[var(--color-brand-blue-300)] hover:bg-[var(--menu-item-active-bg)]"
              title={`Consultar referência: ${item.label}`}
            >
              <span>{item.label}</span>
              <span className="grid size-5 place-items-center rounded-full bg-[var(--surface-base)] text-[var(--color-brand-blue-700)]">
                <NavIcon name="link" className="size-3.5" />
              </span>
            </button>
          ))}
        </div>

        {industrialSecretSignals.length ? (
          <div className="grid gap-3 rounded-[22px] border border-[#f0c9c9] bg-[rgba(255,243,243,0.74)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-critical-700)]">
                  Segredo industrial identificado
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Pontos que exigem continuidade manual
                </h3>
                <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Sempre que houver composição protegida, componente oculto ou CAS ausente por restrição do fabricante, o fluxo deve seguir manualmente.
                </p>
              </div>
              <Badge tone="critical">{industrialSecretSignals.length} ocorrências</Badge>
            </div>

            <div className="grid gap-3">
              {industrialSecretSignals.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[18px] border border-[#efcdcd] bg-[var(--surface-base)] p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_minmax(0,1.6fr)_auto]"
                >
                  <div className="grid gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      Agente / origem
                    </span>
                    <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                      {item.title}
                    </strong>
                    <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
                      {item.block}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      Documento
                    </span>
                    <span className="text-[13px] font-medium text-[var(--color-text-default)]">
                      {item.document}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="grid gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      Ponto identificado
                    </span>
                    <span className="text-[13px] leading-6 text-[var(--color-text-default)]">
                      {item.point}
                    </span>
                  </div>
                  <div className="flex items-end">
                    <Badge tone="critical" className="min-h-8 px-3 text-[12px]">
                      Tratar manualmente
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showFilters ? (
          <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Busca">
              <EditableInput
                value={search}
                onChange={setSearch}
                placeholder="Agente, CAS, bloco ou fonte"
              />
            </Field>
            <Field label="Bloco">
              <EditableSelect value={blockFilter} options={blockOptions} onChange={setBlockFilter} />
            </Field>
            <Field label="Status da revisão">
              <EditableSelect
                value={statusFilter}
                options={["Todos", ...prhoExtendedReviewStatusOptions]}
                onChange={setStatusFilter}
              />
            </Field>
          </div>
        ) : null}

        {filteredRows.length ? (
          <div className="overflow-hidden rounded-[24px] border border-[var(--color-border-subtle)]">
            <div className="overflow-x-auto">
              <table className="min-w-[1240px] border-collapse">
                <thead className="bg-[var(--surface-muted)]">
                  <tr className="border-b border-[var(--color-border-subtle)] text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {[
                      "Agente",
                      "Contexto",
                      "Exposição",
                      "Base técnica",
                      "Decisão",
                      "Observações",
                    ].map((label) => (
                      <th key={label} className="px-3 py-3 align-top first:pl-5 last:pr-5">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-[var(--surface-base)] text-[13px] text-[var(--color-text-default)]">
                  {filteredRows.map((row) => {
                    const issues = getWorksheetMissingPoints(row);
                    const tone = getWorksheetIssueTone(issues.length);
                    const issueLabel = issues.length
                      ? `Faltando: ${issues.slice(0, 2).join(" • ")}${issues.length > 2 ? ` +${issues.length - 2}` : ""}`
                      : "Linha completa";

                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "border-b border-[var(--color-border-subtle)] align-top last:border-b-0",
                          tone === "critical" ? "bg-[rgba(255,243,243,0.78)]" : "",
                        )}
                      >
                        <td className="px-3 py-3 first:pl-5">
                          <div className="grid gap-2 min-w-[190px]">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="grid gap-1">
                                <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                                  {row.name}
                                </strong>
                                <span className="text-[12px] text-[var(--color-text-soft)]">
                                  {row.agentType}
                                </span>
                              </div>
                              <StatusBadge status={row.reviewStatus} />
                            </div>
                            <Badge
                              tone={issues.length ? (tone === "critical" ? "critical" : "review") : "positive"}
                              className="min-h-7 justify-self-start px-2.5 text-[11px]"
                            >
                              {issueLabel}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="grid min-w-[220px] gap-2">
                            <span className="font-semibold text-[var(--color-text-strong)]">
                              {row.blockLabel} • {row.blockTitle}
                            </span>
                            <EditableInput
                              value={row.sector}
                              onChange={(value) => updateReviewRow(row.id, { sector: value })}
                              placeholder="Setor"
                            />
                            <EditableInput
                              value={row.workerFunction}
                              onChange={(value) => updateReviewRow(row.id, { workerFunction: value })}
                              placeholder="Função do trabalhador"
                            />
                            <EditableInput
                              value={row.ghe}
                              onChange={(value) => updateReviewRow(row.id, { ghe: value })}
                              placeholder="GHE"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="grid min-w-[180px] gap-2">
                            <EditableInput
                              value={row.cas || row.reference}
                              onChange={(value) => updateReviewRow(row.id, { cas: value, reference: value })}
                              placeholder="CAS ou referência"
                            />
                            <EditableInput
                              value={row.concentration}
                              onChange={(value) => updateReviewRow(row.id, { concentration: value })}
                              placeholder="Concentração / intensidade"
                            />
                            <EditableInput
                              value={row.unit}
                              onChange={(value) => updateReviewRow(row.id, { unit: value })}
                              placeholder="Unidade"
                            />
                            <EditableInput
                              value={row.physicalState}
                              onChange={(value) => updateReviewRow(row.id, { physicalState: value })}
                              placeholder="Estado físico / natureza"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="grid min-w-[220px] gap-2">
                            <EditableInput
                              value={row.validatedMethod || row.suggestedMethod}
                              onChange={(value) =>
                                updateReviewRow(row.id, {
                                  validatedMethod: value,
                                  suggestedMethod: value,
                                })
                              }
                              placeholder="Método validado"
                            />
                            <EditableInput
                              value={row.nr15Annex}
                              onChange={(value) => updateReviewRow(row.id, { nr15Annex: value })}
                              placeholder="NR-15 anexo"
                            />
                            <EditableInput
                              value={row.nr15Limit}
                              onChange={(value) => updateReviewRow(row.id, { nr15Limit: value })}
                              placeholder="NR-15 limite"
                            />
                            <div className="grid gap-2 md:grid-cols-2">
                              <EditableInput
                                value={row.acgihTwa}
                                onChange={(value) => updateReviewRow(row.id, { acgihTwa: value })}
                                placeholder="ACGIH"
                              />
                              <EditableInput
                                value={row.nioshTwa}
                                onChange={(value) => updateReviewRow(row.id, { nioshTwa: value })}
                                placeholder="NIOSH"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="grid min-w-[220px] gap-2">
                            <EditableSelect
                              value={row.aihaCategory}
                              options={prhoCategoryOptions}
                              onChange={(value) => updateReviewRow(row.id, { aihaCategory: value })}
                            />
                            <EditableSelect
                              value={row.risk}
                              options={prhoCriticalityOptions}
                              onChange={(value) => updateReviewRow(row.id, { risk: value })}
                            />
                            <EditableSelect
                              value={row.technicalDecision}
                              options={prhoClassificationDecisionOptions}
                              onChange={(value) => updateReviewRow(row.id, { technicalDecision: value })}
                            />
                            <div className="grid gap-2 md:grid-cols-2">
                              <EditableInput
                                value={row.esocialCode}
                                onChange={(value) => updateReviewRow(row.id, { esocialCode: value })}
                                placeholder="eSocial"
                              />
                              <EditableInput
                                value={row.decretoCode}
                                onChange={(value) => updateReviewRow(row.id, { decretoCode: value })}
                                placeholder="Decreto"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 last:pr-5">
                          <div className="grid min-w-[280px] gap-2">
                            <EditableInput
                              rows={2}
                              value={row.technicalJustification}
                              onChange={(value) =>
                                updateReviewRow(row.id, { technicalJustification: value })
                              }
                              placeholder="Justificativa técnica"
                            />
                            <EditableInput
                              rows={2}
                              value={row.observation}
                              onChange={(value) => updateReviewRow(row.id, { observation: value })}
                              placeholder="Observação operacional"
                            />
                            <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
                              {row.source || "Sem fonte"} • {row.sourceExcerpt || "Sem trecho rastreável"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Nenhuma linha encontrada"
            description="Ajuste os filtros para voltar a enxergar os agentes da APR HO."
          />
        )}
      </Panel>

      <Modal
        open={showAddAgentModal}
        title="Adicionar novo agente"
        description="Inclua um agente manualmente durante a revisão. Se houver segredo industrial, o registro já fica marcado para continuidade humana."
        onClose={() => {
          setShowAddAgentModal(false);
          resetManualAgentDraft();
        }}
        actions={[
          <Button
            key="cancel-add-agent"
            variant="ghost"
            onClick={() => {
              setShowAddAgentModal(false);
              resetManualAgentDraft();
            }}
          >
            Cancelar
          </Button>,
          <Button key="search-agent" variant="tertiary" onClick={runManualSearch}>
            Buscar base técnica
          </Button>,
          <Button
            key="save-agent"
            variant="primary"
            disabled={!manualAgentDraft.name?.trim() || !manualAgentDraft.manualJustification?.trim()}
            onClick={saveManualAgent}
          >
            Salvar agente
          </Button>,
        ]}
      >
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Buscar por nome ou CAS">
              <EditableInput
                value={manualAgentDraft.searchQuery}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, searchQuery: value }))
                }
                placeholder="Benzeno, Tolueno, 108-88-3..."
              />
            </Field>
            <Field label="Bloco operacional">
              <EditableSelect
                value={manualAgentDraft.blockId}
                options={blocks.map((block) => block.id)}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, blockId: value }))
                }
              />
            </Field>
          </div>

          {manualAgentDraft.searchMessage ? (
            <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-[13px] leading-6 text-[var(--color-text-default)]">
              {manualAgentDraft.searchMessage}
            </div>
          ) : null}

          {manualAgentDraft.searchResults?.length ? (
            <Field label="Opções encontradas">
              <EditableSelect
                value={manualAgentDraft.selectedSearchResultId || manualAgentDraft.searchResults[0]?.id}
                options={manualAgentDraft.searchResults.map((item) => item.id)}
                onChange={selectManualSearchOption}
              />
            </Field>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Nome do agente">
              <EditableInput
                value={manualAgentDraft.name}
                onChange={(value) => setManualAgentDraft((current) => ({ ...current, name: value }))}
              />
            </Field>
            <Field label="Tipo">
              <EditableSelect
                value={manualAgentDraft.agentType}
                options={prhoReviewFilterOptions.type.filter((item) => item !== "Todos")}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, agentType: value }))
                }
              />
            </Field>
            <Field label="CAS / referência">
              <EditableInput
                value={manualAgentDraft.cas}
                onChange={(value) => setManualAgentDraft((current) => ({ ...current, cas: value }))}
              />
            </Field>
            <Field label="Método">
              <EditableInput
                value={manualAgentDraft.suggestedMethod}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, suggestedMethod: value }))
                }
              />
            </Field>
            <Field label="Concentração">
              <EditableInput
                value={manualAgentDraft.concentration}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, concentration: value }))
                }
              />
            </Field>
            <Field label="Unidade">
              <EditableInput
                value={manualAgentDraft.unit}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, unit: value }))
                }
              />
            </Field>
            <Field label="Estado físico">
              <EditableInput
                value={manualAgentDraft.physicalState}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, physicalState: value }))
                }
              />
            </Field>
            <Field label="Documento base">
              <EditableSelect
                value={manualAgentDraft.sourceDocumentId}
                options={documents.map((document) => document.id)}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, sourceDocumentId: value }))
                }
              />
            </Field>
            <Field label="Categoria AIHA">
              <EditableSelect
                value={manualAgentDraft.aihaCategory || "Categoria 3"}
                options={prhoCategoryOptions}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, aihaCategory: value }))
                }
              />
            </Field>
            <Field label="Decisão técnica">
              <EditableSelect
                value={manualAgentDraft.technicalDecision || "Avaliação manual necessária"}
                options={[
                  "Avaliação manual necessária",
                  ...prhoClassificationDecisionOptions,
                ]}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, technicalDecision: value }))
                }
              />
            </Field>
            <Field label="NR-15 anexo">
              <EditableInput
                value={manualAgentDraft.nr15Annex}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, nr15Annex: value }))
                }
              />
            </Field>
            <Field label="NR-15 limite">
              <EditableInput
                value={manualAgentDraft.nr15Limit}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, nr15Limit: value }))
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Setor">
              <EditableInput
                value={manualAgentDraft.sector}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, sector: value }))
                }
              />
            </Field>
            <Field label="Função do trabalhador">
              <EditableInput
                value={manualAgentDraft.workerFunction}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, workerFunction: value }))
                }
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 rounded-[20px] border border-[#efcdcd] bg-[rgba(255,243,243,0.72)] px-4 py-3">
            <input
              type="checkbox"
              checked={manualAgentDraft.industrialSecret}
              onChange={(event) =>
                setManualAgentDraft((current) => ({
                  ...current,
                  industrialSecret: event.target.checked,
                }))
              }
              className="mt-1 size-4 rounded border-[var(--color-border-subtle)]"
            />
            <span className="grid gap-1">
              <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                O agente envolve segredo industrial
              </span>
              <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
                Marque quando a composição, CAS ou componente relevante estiver oculto e exigir continuidade manual.
              </span>
            </span>
          </label>

          {manualAgentDraft.industrialSecret ? (
            <Field label="Ponto identificado / trecho restrito">
              <EditableInput
                rows={3}
                value={manualAgentDraft.hiddenComponent}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, hiddenComponent: value }))
                }
                placeholder="Ex.: composição protegida por segredo industrial no item 3.2 da FDS."
              />
            </Field>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Justificativa técnica obrigatória">
              <EditableInput
                rows={4}
                value={manualAgentDraft.manualJustification}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, manualJustification: value }))
                }
              />
            </Field>
            <Field label="Observação complementar">
              <EditableInput
                rows={4}
                value={manualAgentDraft.technicalObservation}
                onChange={(value) =>
                  setManualAgentDraft((current) => ({ ...current, technicalObservation: value }))
                }
              />
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={showNhoLibraryModal}
        title="Biblioteca NHO da revisão"
        description="Consulta rápida dos métodos usados para completar a linha da APR HO durante a validação humana."
        onClose={() => setShowNhoLibraryModal(false)}
        actions={[
          <Button key="close-review-nho" variant="ghost" onClick={() => setShowNhoLibraryModal(false)}>
            Fechar
          </Button>,
        ]}
      >
        <div className="grid gap-3">
          {prhoNhoMethodLibrary.map((method) => (
            <div
              key={method.id}
              className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    {method.label} • {method.title}
                  </strong>
                  <p className="text-[13px] leading-6 text-[var(--color-text-soft)]">
                    {method.summary}
                  </p>
                </div>
                <Badge tone="review">{method.appliesTo.length} cenários</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {method.appliesTo.map((item) => (
                  <TechnicalBadge key={item} label={item} tone="status" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={Boolean(selectedWorksheetReference)}
        title={
          selectedWorksheetReference
            ? `Referência consultada • ${selectedWorksheetReference.label}`
            : "Referência consultada"
        }
        description={
          selectedWorksheetReference?.id === "aiha"
            ? "Consulta da matriz AIHA usada na APR HO, com critérios, perfis de agentes, regras de medição e filtro rápido."
            : selectedWorksheetReference?.description ||
              "Bases técnicas vinculadas a este item da revisão."
        }
        onClose={closeWorksheetReferenceModal}
        actions={[
          <Button
            key="close-reference-modal"
            variant="ghost"
            onClick={closeWorksheetReferenceModal}
          >
            Fechar
          </Button>,
        ]}
      >
        {selectedWorksheetReference?.id === "aiha" ? (
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <div className="grid gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-blue-500)]">
                  Documento consultado
                </span>
                <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Matriz_Risco_AIHA_APRH_HO_Final (1).docx
                </strong>
                <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                  Critérios de severidade, probabilidade, matriz de risco, categorias GES e necessidade de medição usados no mockup de revisão.
                </span>
              </div>
              <Field label="Filtrar conteúdo da matriz">
                <EditableInput
                  value={worksheetReferenceQuery}
                  onChange={setWorksheetReferenceQuery}
                  placeholder="Buscar por agente, NR-15, LINACH, GES, método ou regra..."
                />
              </Field>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Critérios de severidade
                </h4>
                <div className="overflow-hidden rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)]">
                  <table className="w-full border-collapse text-left text-[12px]">
                    <thead className="bg-[var(--surface-muted)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      <tr>
                        <th className="px-3 py-2">Categoria</th>
                        <th className="px-3 py-2">Peso</th>
                        <th className="px-3 py-2">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aihaMatrixSeverityRows.map((row) => (
                        <tr key={row[0]} className="border-t border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 font-semibold text-[var(--color-text-strong)]">{row[0]}</td>
                          <td className="px-3 py-2 text-[var(--color-text-default)]">{row[1]}</td>
                          <td className="px-3 py-2 text-[var(--color-text-soft)]">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Critérios de probabilidade
                </h4>
                <div className="overflow-hidden rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)]">
                  <table className="w-full border-collapse text-left text-[12px]">
                    <thead className="bg-[var(--surface-muted)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      <tr>
                        <th className="px-3 py-2">Categoria</th>
                        <th className="px-3 py-2">Peso</th>
                        <th className="px-3 py-2">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aihaMatrixProbabilityRows.map((row) => (
                        <tr key={row[0]} className="border-t border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 font-semibold text-[var(--color-text-strong)]">{row[0]}</td>
                          <td className="px-3 py-2 text-[var(--color-text-default)]">{row[1]}</td>
                          <td className="px-3 py-2 text-[var(--color-text-soft)]">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Matriz de classificação de risco
                </h4>
                <div className="overflow-hidden rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)]">
                  <table className="w-full border-collapse text-center text-[12px]">
                    <thead className="bg-[var(--surface-muted)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      <tr>
                        <th className="px-3 py-2 text-left">Prob. / Sev.</th>
                        <th className="px-3 py-2">1</th>
                        <th className="px-3 py-2">2</th>
                        <th className="px-3 py-2">3</th>
                        <th className="px-3 py-2">4</th>
                        <th className="px-3 py-2">5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aihaMatrixRiskRows.map((row) => (
                        <tr key={row[0]} className="border-t border-[var(--color-border-subtle)]">
                          <td className="px-3 py-2 text-left font-semibold text-[var(--color-text-strong)]">{row[0]}</td>
                          {row.slice(1).map((value) => (
                            <td key={value} className="px-3 py-2 text-[var(--color-text-default)]">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Categorias de controle por exposição (GES)
                </h4>
                <div className="grid gap-2">
                  {aihaMatrixGesRows.map((row) => (
                    <div
                      key={row[0]}
                      className="grid gap-1 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                          Categoria {row[0]}
                        </strong>
                        <Badge tone="status">{row[1]}</Badge>
                      </div>
                      <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        {row[2]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Caracterização básica de agentes ocupacionais
                </h4>
                <Badge tone="review">{filteredAihaProfiles.length} perfis visíveis</Badge>
              </div>
              {filteredAihaProfiles.length ? (
                <div className="grid gap-3 xl:grid-cols-2">
                  {filteredAihaProfiles.map((profile) => (
                    <div
                      key={profile.name}
                      className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="grid gap-1">
                          <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                            {profile.name}
                          </strong>
                          <span className="text-[13px] text-[var(--color-text-soft)]">
                            {profile.type}
                          </span>
                        </div>
                        <Badge tone={profile.measurement === "SIM" ? "critical" : "status"}>
                          Medição {profile.measurement}
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Risco AIHA</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.riskLevel}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Categoria GES</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.ges}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">NR-15</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.nr15}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">LINACH</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.linach}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Decreto 3048/99</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.decree}</span>
                        </div>
                        <div className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Carcinogenicidade</span>
                          <span className="text-[13px] text-[var(--color-text-default)]">{profile.carcinogenic}</span>
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Método / frequência</span>
                        <span className="text-[13px] leading-5 text-[var(--color-text-default)]">
                          {profile.method} • {profile.monitoring}
                        </span>
                      </div>
                      <div className="rounded-[16px] bg-[var(--menu-item-active-bg)] px-3 py-2 text-[13px] leading-5 text-[var(--color-brand-foreground)]">
                        {profile.notes}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Nenhum trecho da matriz encontrado"
                  description="Ajuste o filtro para consultar outro agente, anexo, método ou critério."
                />
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Quando a medição é obrigatória
                  </h4>
                  <Badge tone="critical">{filteredAihaRequiredRules.length} regras</Badge>
                </div>
                <div className="grid gap-2">
                  {filteredAihaRequiredRules.map((rule) => (
                    <div
                      key={rule}
                      className="rounded-[18px] border border-[#f0c9c9] bg-[rgba(255,243,243,0.72)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-default)]"
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                    Quando a medição não é obrigatória
                  </h4>
                  <Badge tone="status">{filteredAihaNotRequiredRules.length} regras</Badge>
                </div>
                <div className="grid gap-2">
                  {filteredAihaNotRequiredRules.map((rule) => (
                    <div
                      key={rule}
                      className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-default)]"
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Referências do documento
                </h4>
                <Badge tone="status">{filteredAihaReferences.length} referências</Badge>
              </div>
              <div className="grid gap-2">
                {filteredAihaReferences.map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-default)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {selectedWorksheetBases.map((base) => {
              const detail = technicalBaseReferenceDetails[base.id];

              return (
                <div
                  key={base.id}
                  className="grid gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                        {base.name}
                      </strong>
                      <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                        Versão {base.version} • vigência em {base.effectiveDate}
                      </span>
                    </div>
                    <StatusBadge status={base.status} />
                  </div>
                  {detail?.summary ? (
                    <p className="text-[13px] leading-6 text-[var(--color-text-default)]">
                      {detail.summary}
                    </p>
                  ) : null}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="grid gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                        Fonte
                      </span>
                      <span className="text-[13px] text-[var(--color-text-default)]">{base.source}</span>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                        Referência
                      </span>
                      <span className="text-[13px] text-[var(--color-text-default)]">{base.reference}</span>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                        Atualização
                      </span>
                      <span className="text-[13px] text-[var(--color-text-default)]">{base.updatedAt}</span>
                    </div>
                    <div className="grid gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                        Responsável
                      </span>
                      <span className="text-[13px] text-[var(--color-text-default)]">{base.owner}</span>
                    </div>
                  </div>
                  {detail?.points?.length ? (
                    <div className="grid gap-2">
                      {detail.points.map((point) => (
                        <div
                          key={point}
                          className="rounded-[16px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] px-4 py-3 text-[13px] leading-5 text-[var(--color-text-default)]"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex justify-end">
                    <NavLink
                      to={`/app/settings/technical-bases#${base.id}`}
                      onClick={closeWorksheetReferenceModal}
                      className={buttonStyles({
                        variant: "tertiary",
                        className: "min-h-9 gap-2 px-3 text-[13px]",
                      })}
                    >
                      Abrir base técnica
                      <NavIcon name="link" className="size-3.5" />
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </UnifiedPagePanel>
  );
}

function PrhoClassificationRedirectPage() {
  const { id } = useParams();
  return <Navigate to={`/app/prho/${id}/summary`} replace />;
}

function PrhoSummaryBlocksPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = prhoAnalyses.find((item) => item.id === id) || prhoAnalyses[0];
  const reviewRows = buildAnalysisReviewRowsSeed(analysis.id);
  const blocks = getPrhoReviewBlocksSeed();
  const pendencies = getPrhoReviewPendenciesSeed();
  const readyStatuses = new Set(["Aprovado", "Corrigido", "Aprovado com ressalva", "Não aplicável"]);
  const groupedBlocks = [...new Set(reviewRows.map((row) => row.blockLabel))].length;
  const rowsMissingWorksheetData = reviewRows.filter((row) => getWorksheetMissingPoints(row).length > 0).length;
  const rowsReadyForBudget = reviewRows.filter(
    (row) => row.technicalDecision === "Quantificar" && readyStatuses.has(row.reviewStatus),
  ).length;
  const approvalChecklist = buildPrhoApprovalChecklist(reviewRows, pendencies, analysis);
  const blockingChecklistItems = approvalChecklist.filter((item) => item.status === "Bloqueado").length;
  const attentionChecklistItems = approvalChecklist.filter((item) => item.status === "Atenção").length;
  const [approvalState, setApprovalState] = useState(() =>
    readAnalysisApprovalState(analysis.id, "draft"),
  );
  const [showApprovalNotesModal, setShowApprovalNotesModal] = useState(false);
  const [approvalNotesDraft, setApprovalNotesDraft] = useState({
    justification: "Aprovação com ressalvas mantendo visíveis apenas observações não bloqueantes da APR HO.",
    responsible: analysis.responsible || "Reginaldo Melo",
    maintainedPending: pendencies.find((item) => item.status !== "Resolvida")?.title || "",
    expectedImpact: "A análise pode seguir para o pré-orçamento mantendo a rastreabilidade das ressalvas técnicas no documento final.",
    confirmation: false,
  });
  const canApprove = approvalChecklist.every((item) => item.status === "OK");
  const canApproveWithNotes = !approvalChecklist.some((item) => item.status === "Bloqueado");
  const preQuoteReleased = isReleasedApprovalState(approvalState);

  function persistApprovalState(nextState) {
    setApprovalState(nextState);
    saveAnalysisApprovalState(analysis.id, nextState);
  }

  function submitApprovalWithNotes() {
    if (
      !approvalNotesDraft.justification.trim() ||
      !approvalNotesDraft.responsible.trim() ||
      !approvalNotesDraft.expectedImpact.trim() ||
      !approvalNotesDraft.confirmation
    ) {
      return;
    }

    persistApprovalState("approved_with_notes");
    setShowApprovalNotesModal(false);
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo A"
          title={`Aprovação final da APR HO • ${analysis.code}`}
          description="A classificação separada foi removida. Aqui você revisa o documento consolidado, valida a checklist final e decide se a análise pode liberar o pré-orçamento."
          actions={[
            <Button key="back-review-header" variant="ghost" onClick={() => navigate(`/app/prho/${id}/review`)}>
              Voltar para revisão
            </Button>,
            ...(preQuoteReleased
              ? [
                  <NavLink
                    key="prequote"
                    to="/app/pre-quotations/pre-041"
                    className={buttonStyles({ variant: "primary" })}
                  >
                    Gerar pré-orçamento
                  </NavLink>,
                ]
              : []),
          ]}
        >
          <Stepper steps={flowSteps} current={3} />
        </PageHeader>
      }
      bodyClassName="grid gap-5"
    >
      <Panel className="flex flex-wrap justify-end gap-2">
        <Button key="back-review-inline" variant="ghost" onClick={() => navigate(`/app/prho/${id}/review`)}>
          Voltar para revisão
        </Button>
        <Button key="draft-inline" variant="tertiary" onClick={() => persistApprovalState("draft")}>
          Salvar rascunho
        </Button>
        <Button key="approve-inline" variant={canApprove ? "primary" : "tertiary"} disabled={!canApprove} onClick={() => canApprove && persistApprovalState("approved")}>
          Aprovar análise
        </Button>
        <Button
          key="approve-with-notes-inline"
          variant={canApproveWithNotes ? "secondary" : "tertiary"}
          disabled={!canApproveWithNotes}
          onClick={() => canApproveWithNotes && setShowApprovalNotesModal(true)}
        >
          Aprovar com ressalvas
        </Button>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Linhas consolidadas" value={reviewRows.length} hint="Itens mantidos no documento final" />
        <StatCard label="Blocos operacionais" value={groupedBlocks} hint="Contextos preservados na APR HO" />
        <StatCard label="Prontas para orçamento" value={rowsReadyForBudget} hint="Linhas aprovadas com decisão de quantificar" tone="positive" />
        <StatCard label="Checklist em atenção" value={attentionChecklistItems} hint="Ressalvas ainda visíveis" tone={attentionChecklistItems ? "review" : "positive"} />
        <StatCard label="Bloqueios finais" value={blockingChecklistItems || rowsMissingWorksheetData} hint="Impedem aprovação direta" tone={blockingChecklistItems || rowsMissingWorksheetData ? "critical" : "positive"} />
      </div>

      {blockingChecklistItems || rowsMissingWorksheetData ? (
        <Toast
          title="Aprovação ainda depende do fechamento da revisão"
          description="A liberação do pré-orçamento só acontece quando os campos centrais da planilha e a checklist final estiverem consistentes."
        />
      ) : null}

      <Panel className="grid gap-5">
        <div className="grid gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
            Documento consolidado
          </p>
          <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
            Visualização final da APR HO antes da liberação comercial
          </h3>
        </div>

        <div className="rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
          <div className="mx-auto grid max-w-[1320px] gap-5 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
              <div className="grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  APR HO consolidada
                </p>
                <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-strong)]">
                  {analysis.title || "Análise ocupacional consolidada"}
                </h3>
                <p className="max-w-3xl text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Cliente: {analysis.customer} • Responsável técnico: {analysis.responsible || "Reginaldo Melo"}
                </p>
              </div>
              <div className="grid gap-2 text-right">
                <Badge tone="status" className="justify-self-end">
                  {analysis.code}
                </Badge>
                <span className="text-[13px] text-[var(--color-text-soft)]">
                  {reviewRows.length} linhas • {blocks.length} blocos base
                </span>
                <span className="text-[13px] text-[var(--color-text-soft)]">
                  {analysis.documents} documentos considerados
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <WorksheetCell title="Cobertura">
                <WorksheetMeta label="Blocos operacionais" value={`${groupedBlocks}`} strong />
                <WorksheetMeta label="Linhas prontas" value={`${reviewRows.length - rowsMissingWorksheetData}/${reviewRows.length}`} />
              </WorksheetCell>
              <WorksheetCell title="Base normativa">
                <div className="flex flex-wrap gap-2">
                  {prhoWorksheetLegend.map((item) => (
                    <Badge key={item} tone="status" className="min-h-8 px-3 text-[12px]">
                      {item}
                    </Badge>
                  ))}
                </div>
              </WorksheetCell>
              <WorksheetCell title="Aprovação">
                <WorksheetMeta label="Checklist bloqueante" value={`${blockingChecklistItems}`} strong />
                <WorksheetMeta label="Ressalvas visíveis" value={`${attentionChecklistItems}`} />
              </WorksheetCell>
              <WorksheetCell title="Comercial">
                <WorksheetMeta label="Linhas quantificáveis" value={`${rowsReadyForBudget}`} strong />
                <WorksheetMeta label="Liberação" value={preQuoteReleased ? "Pré-orçamento liberado" : "Aguardando aprovação"} />
              </WorksheetCell>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Corpo da análise
                </p>
                <h4 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Tabela final pronta para leitura e exportação
                </h4>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[var(--color-border-subtle)]">
                <DataTable
                  framed={false}
                  density="compact"
                  columns={[
                    { key: "agent", label: "Agente" },
                    { key: "context", label: "Bloco / contexto" },
                    { key: "limits", label: "Limites / normas" },
                    { key: "decision", label: "AIHA / decisão" },
                    { key: "notes", label: "Observações / rastreabilidade" },
                  ]}
                  rows={reviewRows.map((row) => ({
                    id: row.id,
                    agent: (
                      <div className="grid gap-2">
                        <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                          {row.name}
                        </strong>
                        <div className="flex flex-wrap gap-2">
                          <Badge tone={row.agentType === "Químico" ? "processing" : "status"} className="min-h-8 px-3 text-[12px]">
                            {row.agentType}
                          </Badge>
                          <StatusBadge status={row.reviewStatus} />
                        </div>
                        <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
                          {row.cas || row.reference}
                        </span>
                      </div>
                    ),
                    context: (
                      <div className="grid gap-2 text-[13px] leading-5 text-[var(--color-text-default)]">
                        <strong className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                          {row.blockLabel} • {row.blockTitle}
                        </strong>
                        <span>{row.sector || "Sem setor"} • {row.workerFunction || "Sem função"}</span>
                        <span>{row.ghe || "Sem GHE"} • {row.frequency || "Sem frequência"}</span>
                      </div>
                    ),
                    limits: (
                      <div className="grid gap-2 text-[13px] leading-5 text-[var(--color-text-default)]">
                        <span><strong>Método:</strong> {row.validatedMethod || row.suggestedMethod || "Não informado"}</span>
                        <span><strong>NR-15:</strong> {row.nr15Annex || "N/A"} • {row.nr15Limit || "N/A"}</span>
                        <span><strong>ACGIH / NIOSH:</strong> {row.acgihTwa || "N/A"} • {row.nioshTwa || "N/A"}</span>
                        <span><strong>eSocial / Decreto:</strong> {row.esocialCode || "N/A"} • {row.decretoCode || "N/A"}</span>
                      </div>
                    ),
                    decision: (
                      <div className="grid gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="review" className="min-h-8 px-3 text-[12px]">
                            {row.aihaCategory}
                          </Badge>
                          <RiskBadge level={row.risk} />
                        </div>
                        <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
                          {row.technicalDecision}
                        </span>
                      </div>
                    ),
                    notes: (
                      <div className="grid gap-2 text-[13px] leading-5 text-[var(--color-text-default)]">
                        <span>{row.technicalJustification || row.observation || "Sem observação registrada."}</span>
                        <span className="text-[12px] text-[var(--color-text-soft)]">
                          {row.source || "Sem fonte"} • confiança {row.confidence || 0}%
                        </span>
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
              <div className="grid gap-1">
                <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Liberação comercial
                </strong>
                <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                  O pré-orçamento nasce daqui, sem nova etapa intermediária.
                </span>
              </div>
              {preQuoteReleased ? (
                <NavLink
                  to="/app/pre-quotations/pre-041"
                  className={buttonStyles({ variant: "primary" })}
                >
                  Gerar pré-orçamento
                </NavLink>
              ) : (
                <Button variant="tertiary" disabled>
                  Aprovação necessária para liberar orçamento
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Checklist final
            </p>
            <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Validação obrigatória antes do fechamento
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {approvalChecklist.map((item) => (
              <ApprovalChecklistItem
                key={item.id}
                label={item.label}
                description={item.detail}
                status={
                  item.status === "OK"
                    ? "ok"
                    : item.status === "Atenção"
                      ? "attention"
                      : "blocked"
                }
                onViewProblem={item.status === "OK" ? undefined : () => navigate(`/app/prho/${analysis.id}/review`)}
              />
            ))}
          </div>
        </div>
      </Panel>

      <Modal
        open={showApprovalNotesModal}
        title="Aprovar com ressalvas"
        description="Registre a justificativa geral, o responsável e o impacto técnico mantido na liberação desta APR HO."
        actions={[
          <Button key="cancel-approval-with-notes" variant="ghost" onClick={() => setShowApprovalNotesModal(false)}>
            Cancelar
          </Button>,
          <Button
            key="save-approval-with-notes"
            variant="secondary"
            disabled={
              !approvalNotesDraft.justification.trim() ||
              !approvalNotesDraft.responsible.trim() ||
              !approvalNotesDraft.expectedImpact.trim() ||
              !approvalNotesDraft.confirmation
            }
            onClick={submitApprovalWithNotes}
          >
            Confirmar aprovação com ressalvas
          </Button>,
        ]}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Justificativa geral">
            <EditableInput rows={3} value={approvalNotesDraft.justification} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, justification: value }))} />
          </Field>
          <Field label="Responsável técnico">
            <EditableInput value={approvalNotesDraft.responsible} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, responsible: value }))} />
          </Field>
          <Field label="Pendência mantida">
            <EditableInput value={approvalNotesDraft.maintainedPending} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, maintainedPending: value }))} />
          </Field>
          <Field label="Impacto esperado">
            <EditableInput rows={3} value={approvalNotesDraft.expectedImpact} onChange={(value) => setApprovalNotesDraft((current) => ({ ...current, expectedImpact: value }))} />
          </Field>
        </div>

        <label className="flex items-start gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
          <input
            type="checkbox"
            checked={approvalNotesDraft.confirmation}
            onChange={(event) =>
              setApprovalNotesDraft((current) => ({
                ...current,
                confirmation: event.target.checked,
              }))
            }
            className="mt-1 size-4 rounded border-[var(--color-border-subtle)]"
          />
          <span className="grid gap-1">
            <span className="text-[13px] font-semibold text-[var(--color-text-strong)]">
              Confirmo que as ressalvas foram avaliadas e continuarão visíveis no documento final
            </span>
            <span className="text-[12px] leading-5 text-[var(--color-text-soft)]">
              A aprovação com ressalvas não elimina pendências nem substitui a rastreabilidade técnica da APR HO.
            </span>
          </span>
        </label>
      </Modal>
    </UnifiedPagePanel>
  );
}

function PreQuotationListPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo B"
          title="Pré-orçamentos derivados de PRHO"
          description="Seleção de agentes, ajuste de quantidades e preparação comercial."
        />
      }
      bodyPadded={false}
    >
      <DataTable
        framed={false}
        columns={[
          { key: "customer", label: "Cliente" },
          { key: "origin", label: "Origem" },
          { key: "status", label: "Status" },
          { key: "totals", label: "Agentes" },
          { key: "date", label: "Data" },
          { key: "value", label: "Valor" },
          { key: "actions", label: "Ações" },
        ]}
        rows={preQuotations.map((item) => ({
          id: item.id,
          customer: item.customer,
          origin: item.origin,
          status: <StatusBadge status={item.status} />,
          totals: `${item.selectedAgents}/${item.totalAgents}`,
          date: item.date,
          value: item.value,
          actions: (
            <NavLink
              to={`/app/pre-quotations/${item.id}`}
              className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[13px]" })}
            >
              Abrir
            </NavLink>
          ),
        }))}
      />
    </UnifiedPagePanel>
  );
}

function PreQuotationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const preQuotation = preQuotations.find((item) => item.id === id) || preQuotations[0];
  const sourceAnalysis = findAnalysisByCode(preQuotation.origin);
  const { released: preQuotationReleased } = resolveAnalysisRelease(sourceAnalysis);
  const classifiedRows = prhoReviewAgents.map((item) => buildReviewRow(item));
  const budgetRows = buildBudgetRowsFromAgents(classifiedRows);
  const nonRecommendedRows = classifiedRows.filter(
    (item) =>
      item.technicalDecision !== "Quantificar" ||
      !["Aprovado", "Corrigido", "Aprovado com ressalva"].includes(item.reviewStatus),
  );
  const [selectedIds, setSelectedIds] = useState(
    budgetRows.filter((item) => item.status === "Selecionado").map((item) => item.id),
  );
  const selectedRows = budgetRows.filter((item) => selectedIds.includes(item.id));
  const selectedEstimatedValue = selectedRows.reduce(
    (total, item) => total + Number(item.totalPrice.replace(/[^\d]/g, "")),
    0,
  );
  const selectedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(selectedEstimatedValue / 100);

  function toggleSelection(itemId, checked) {
    setSelectedIds((current) =>
      checked ? [...current, itemId] : current.filter((idValue) => idValue !== itemId),
    );
  }

  if (!preQuotationReleased) {
    return (
      <UnifiedPagePanel
        header={
          <PageHeader
            framed={false}
            eyebrow="Fluxo B"
            title={`Pré-orçamento • ${preQuotation.origin}`}
            description="Seleção de itens recomendados a partir da análise aprovada."
            actions={[
              <Button
                key="back-summary"
                variant="ghost"
                onClick={() => navigate(`/app/prho/${sourceAnalysis?.id || "prho-2026-041"}/summary`)}
              >
                Voltar para aprovação
              </Button>,
            ]}
          />
        }
      >
        <EmptyState
          title="Pré-orçamento bloqueado até a aprovação final"
          description="Esta etapa só pode ser liberada depois que a análise PRHO for aprovada ou aprovada com ressalvas pelo responsável técnico."
          action={(
            <Button onClick={() => navigate(`/app/prho/${sourceAnalysis?.id || "prho-2026-041"}/summary`)}>
              Ir para aprovação da análise
            </Button>
          )}
        />
      </UnifiedPagePanel>
    );
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo B"
          title={`Pré-orçamento • ${preQuotation.origin}`}
          description="Seleção de itens recomendados a partir da análise aprovada."
          actions={[
            <Button
              key="back-summary"
              variant="ghost"
              onClick={() => navigate("/app/prho/prho-2026-041/summary")}
            >
              Voltar para aprovação
            </Button>,
            <Button
              key="save-prequote"
              variant="tertiary"
            >
              Salvar pré-orçamento
            </Button>,
            <NavLink
              key="quotation"
              to="/app/quotations/orc-2061"
              className={buttonStyles({ variant: "primary" })}
            >
              Gerar orçamento
            </NavLink>,
          ]}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="grid gap-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
              Itens recomendados
            </p>
            <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              Somente agentes aprovados e recomendados para quantificação
            </h3>
          </div>
          {budgetRows.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckboxField
                    label=""
                    checked={selectedIds.includes(item.id)}
                    onChange={(checked) => toggleSelection(item.id, checked)}
                  />
                  <div className="grid gap-1">
                    <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                      {item.description}
                    </strong>
                    <span className="text-[14px] text-[var(--color-text-soft)]">
                      Agente: {item.agentName}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={item.reviewStatus} />
                  <RiskBadge level={item.risk} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Setor
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {item.sector}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Função / GHE
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {item.role} • {item.ghe}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Método
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {item.method}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Frequência / criticidade
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {item.frequency} • {item.risk}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                    Qtd. / valores
                  </span>
                  <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                    {item.quantity} • {item.unitPrice} • {item.totalPrice}
                  </p>
                </div>
              </div>

              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Motivo da recomendação
                </span>
                <p className="mt-1 text-[14px] leading-6 text-[var(--color-text-default)]">
                  {item.recommendationReason}
                </p>
              </div>
            </div>
          ))}

          {nonRecommendedRows.length ? (
            <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Itens não recomendados / pendentes
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Linhas fora da entrada automática do orçamento
                </h3>
              </div>
              <div className="grid gap-3">
                {nonRecommendedRows.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-[14px] font-semibold text-[var(--color-text-strong)]">
                        {item.name}
                      </strong>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={item.reviewStatus} />
                        <TechnicalBadge label={item.technicalDecision} tone="review" />
                      </div>
                    </div>
                    <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                      {item.technicalJustification}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
        <QuotationSummary
          totals={[
            { label: "Agentes selecionados", value: `${selectedRows.length}` },
            { label: "Serviços selecionados", value: `${selectedRows.length}` },
            { label: "Custos estimados", value: selectedValue },
            { label: "Origem", value: preQuotation.origin },
            { label: "Valor sugerido", value: selectedValue },
          ]}
        />
      </div>
    </UnifiedPagePanel>
  );
}

function QuotationListPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo C"
          title="Orçamentos comerciais"
          description="Rascunho, envio e aprovação de propostas derivadas da jornada técnica."
          actions={[
            <NavLink
              key="new"
              to="/app/quotations/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Novo orçamento
            </NavLink>,
          ]}
        />
      }
      bodyClassName="grid gap-6"
      bodyPadded={false}
    >
      <div className="px-6 pt-6 lg:px-7">
        <SearchAndFilters
          framed={false}
          search="ORC-2061, cliente ou status"
          filters={[
            <Field key="status" label="Status">
              <Select value="Todos" />
            </Field>,
            <Field key="customer" label="Cliente">
              <Select value="Todos" />
            </Field>,
            <Field key="period" label="Período">
              <Select value="Últimos 30 dias" />
            </Field>,
          ]}
        />
      </div>
      <DataTable
        framed={false}
        columns={[
          { key: "number", label: "Número" },
          { key: "customer", label: "Cliente" },
          { key: "status", label: "Status" },
          { key: "total", label: "Valor total" },
          { key: "validity", label: "Validade" },
          { key: "email", label: "E-mail" },
          { key: "actions", label: "Ações" },
        ]}
        rows={quotations.map((quotation) => ({
          id: quotation.id,
          number: quotation.number,
          customer: quotation.customer,
          status: <StatusBadge status={quotation.status} />,
          total: quotation.total,
          validity: quotation.validity,
          email: quotation.email,
          actions: (
            <div className="flex flex-wrap gap-2">
              <NavLink
                to={`/app/quotations/${quotation.id}`}
                className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[13px]" })}
              >
                Editar
              </NavLink>
              <NavLink
                to={`/app/quotations/${quotation.id}/preview`}
                className={buttonStyles({ variant: "ghost", className: "min-h-9 px-3 text-[13px]" })}
              >
                Preview
              </NavLink>
            </div>
          ),
        }))}
      />
    </UnifiedPagePanel>
  );
}

function QuotationEditorPage() {
  const { id } = useParams();
  const quotation = quotations.find((item) => item.id === id) || quotations[0];
  const { sourcePreQuotation, sourceAnalysis, released: quotationReleased } =
    resolveQuotationWorkflowSource(quotation);
  const sourceBudgetRows = buildBudgetRowsFromAgents(prhoReviewAgents.map((item) => buildReviewRow(item)));
  const backPreQuotationPath = sourcePreQuotation
    ? `/app/pre-quotations/${sourcePreQuotation.id}`
    : sourceAnalysis
      ? `/app/prho/${sourceAnalysis.id}/summary`
      : "/app/pre-quotations";
  const sourceCode = sourceAnalysis?.code || sourcePreQuotation?.origin || "Análise não vinculada";
  const sourceResponsible = sourceAnalysis?.responsible || "Responsável técnico";

  if (!quotationReleased) {
    return (
      <UnifiedPagePanel
        header={
          <PageHeader
            framed={false}
            eyebrow="Fluxo C"
            title={id ? `Editar ${quotation.number}` : "Novo orçamento manual"}
            description="Blocos de agentes, serviços, custos e condições comerciais preparados a partir da análise aprovada."
            actions={[
              <NavLink
                key="back-prequote"
                to={backPreQuotationPath}
                className={buttonStyles({ variant: "ghost" })}
              >
                Voltar para pré-orçamento
              </NavLink>,
            ]}
          />
        }
      >
        <EmptyState
          title="Orçamento indisponível antes da liberação comercial"
          description="O orçamento deve nascer de um pré-orçamento liberado a partir de uma análise PRHO já aprovada. Conclua a aprovação e a seleção técnica antes de seguir."
          action={(
            <NavLink
              to={backPreQuotationPath}
              className={buttonStyles({ variant: "primary" })}
            >
              {sourcePreQuotation ? "Abrir pré-orçamento" : "Voltar para a análise"}
            </NavLink>
          )}
        />
      </UnifiedPagePanel>
    );
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo C"
          title={id ? `Editar ${quotation.number}` : "Novo orçamento manual"}
          description="Blocos de agentes, serviços, custos e condições comerciais preparados a partir da análise aprovada."
          actions={[
            <NavLink
              key="back-prequote"
              to={backPreQuotationPath}
              className={buttonStyles({ variant: "ghost" })}
            >
              Voltar para pré-orçamento
            </NavLink>,
            <Button key="draft" variant="secondary">
              Salvar rascunho
            </Button>,
            <NavLink
              key="preview"
              to={`/app/quotations/${quotation.id}/preview`}
              className={buttonStyles({ variant: "primary" })}
            >
              Visualizar PDF
            </NavLink>,
            <Button key="generate-pdf" variant="tertiary">
              Gerar PDF
            </Button>,
            <Button key="send-customer">
              Enviar para cliente
            </Button>,
          ]}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <Select value={quotation.customer} />
            </Field>
            <Field label="Origem da análise">
              <Input value={sourceCode} />
            </Field>
            <Field label="Validade">
              <Select value={quotation.validity} />
            </Field>
            <Field label="Endereço de serviço">
              <Input value="Planta industrial principal" />
            </Field>
            <Field label="Status">
              <Select value={quotation.status} />
            </Field>
            <Field label="Prazo de execução">
              <Input value="15 dias úteis após aprovação" />
            </Field>
            <Field label="Forma de pagamento">
              <Input value="28 dias • boleto / PIX" />
            </Field>
            <Field label="Observações comerciais" full>
              <Textarea
                value="Proposta derivada da análise aprovada, com vínculo técnico preservado por agente, método e justificativa."
                rows={3}
              />
            </Field>
          </div>

          <div className="grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Vínculo com a análise
              </p>
              <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Origem técnica preservada por item
              </h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  PRHO de origem
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {sourceCode}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Responsável pela aprovação
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  {sourceResponsible}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Decisão técnica
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  Quantificar
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                  Justificativa consolidada
                </span>
                <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                  Exposição relevante com base técnica preservada no fluxo PRHO.
                </p>
              </div>
            </div>
          </div>

          <DataTable
            columns={[
              { key: "evaluation", label: "Avaliação" },
              { key: "agent", label: "Agente" },
              { key: "sector", label: "Setor" },
              { key: "role", label: "Função / GHE" },
              { key: "quantity", label: "Qtd." },
              { key: "unitPrice", label: "Valor unitário" },
              { key: "total", label: "Total" },
              { key: "origin", label: "Origem" },
            ]}
            rows={(sourceBudgetRows.length ? sourceBudgetRows : quotationItems).map((item) => ({
              id: item.id,
              evaluation: item.evaluation || item.description,
              agent: item.agent || item.agentName,
              sector: item.sector,
              role: `${item.role} • ${item.ghe || "GHE"}`,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total || item.totalPrice,
              origin: sourceCode,
            }))}
          />
        </Panel>
        <QuotationSummary
          totals={[
            { label: "Agentes", value: "R$ 2.460" },
            { label: "Serviços", value: "R$ 3.120" },
            { label: "Custos", value: "R$ 1.180" },
            { label: "Descontos", value: "R$ 0,00" },
            { label: "Acréscimos", value: "R$ 0,00" },
            { label: "Total", value: quotation.total },
          ]}
        />
      </div>
    </UnifiedPagePanel>
  );
}

function QuotationPreviewPage() {
  const { id } = useParams();
  const quotation = quotations.find((item) => item.id === id) || quotations[0];
  const [showToast, setShowToast] = useState(false);
  const { sourcePreQuotation, sourceAnalysis, released: quotationReleased } =
    resolveQuotationWorkflowSource(quotation);
  const returnPath = sourcePreQuotation
    ? `/app/pre-quotations/${sourcePreQuotation.id}`
    : sourceAnalysis
      ? `/app/prho/${sourceAnalysis.id}/summary`
      : "/app/quotations";

  if (!quotationReleased) {
    return (
      <UnifiedPagePanel
        header={
          <PageHeader
            framed={false}
            eyebrow="Fluxo C"
            title={`Preview comercial • ${quotation.number}`}
            description="Visualização estilo PDF com simulação de envio e aprovação."
            actions={[
              <NavLink
                key="return"
                to={returnPath}
                className={buttonStyles({ variant: "ghost" })}
              >
                Voltar para etapa anterior
              </NavLink>,
            ]}
          />
        }
      >
        <EmptyState
          title="Preview indisponível antes da liberação comercial"
          description="A visualização comercial só aparece depois que o orçamento for gerado a partir de um pré-orçamento liberado."
          action={(
            <NavLink to={returnPath} className={buttonStyles({ variant: "primary" })}>
              {sourcePreQuotation ? "Abrir pré-orçamento" : "Voltar para a análise"}
            </NavLink>
          )}
        />
      </UnifiedPagePanel>
    );
  }

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo C"
          title={`Preview comercial • ${quotation.number}`}
          description="Visualização estilo PDF com simulação de envio e aprovação."
          actions={[
            <Button key="email" onClick={() => setShowToast(true)}>
              Simular envio por e-mail
            </Button>,
            <NavLink
              key="sampling"
              to="/app/sampling/orc-2061"
              className={buttonStyles({ variant: "secondary" })}
            >
              Gerar plano de amostragem
            </NavLink>,
          ]}
        />
      }
      bodyClassName="grid gap-4"
    >
      {showToast ? (
        <Toast
          title="Envio simulado"
          description="O orçamento foi marcado como enviado ao cliente e entrou em acompanhamento comercial."
        />
      ) : null}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ReportPreview
          sections={[
            {
              title: "Escopo",
              copy:
                "Avaliação de agentes químicos e físicos com memória de campo e relatório final integrado.",
            },
            {
              title: "Itens e valores",
              copy:
                "Linhas derivadas da PRHO com quantidades ajustáveis, serviços de apoio e condições comerciais.",
            },
            {
              title: "Condições",
              copy:
                "Validade, prazo de entrega, critérios laboratoriais, anexos e textos institucionais.",
            },
          ]}
        />
        <Drawer
          title="Resumo da proposta"
          description="Acompanhe envio, aceite e próximo passo operacional."
        >
          <div className="grid gap-3">
            <StatusBadge status={quotation.status} />
            <Toast title="WhatsApp" description="Canal disponível para disparo mockado." />
            <Toast title="Próxima ação" description="Ao aprovar, liberar geração de amostras." />
          </div>
        </Drawer>
      </div>
    </UnifiedPagePanel>
  );
}

function SamplingListPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo D"
          title="Planos de amostragem"
          description="Organize amostras por orçamento, agente, status e responsável técnico."
        />
      }
      bodyPadded={false}
    >
      <DataTable
        framed={false}
        columns={[
          { key: "agent", label: "Agente" },
          { key: "customer", label: "Cliente" },
          { key: "type", label: "Tipo" },
          { key: "status", label: "Status" },
          { key: "owner", label: "Responsável" },
          { key: "actions", label: "Ações" },
        ]}
        rows={samplingPlans.map((sample) => ({
          id: sample.id,
          agent: sample.agent,
          customer: sample.customer,
          type: sample.type,
          status: <StatusBadge status={sample.status} />,
          owner: sample.owner,
          actions: (
            <div className="flex flex-wrap gap-2">
              <NavLink
                to={`/app/sampling/${sample.quotationId}`}
                className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[13px]" })}
              >
                Plano
              </NavLink>
              <NavLink
                to={`/app/sampling/sample/${sample.id}`}
                className={buttonStyles({ variant: "ghost", className: "min-h-9 px-3 text-[13px]" })}
              >
                Amostra
              </NavLink>
            </div>
          ),
        }))}
      />
    </UnifiedPagePanel>
  );
}

function SamplingQuotationPage() {
  const { quotationId } = useParams();
  const quote = quotations.find((item) => item.id === quotationId) || quotations[1];
  const items = samplingPlans.filter((item) => item.quotationId === quotationId);

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo D"
          title={`Amostras do orçamento ${quote.number}`}
          description="Visão consolidada das amostras derivadas do orçamento aprovado."
          actions={[
            <NavLink
              key="manual"
              to="/app/sampling/sample/sam-9002"
              className={buttonStyles({ variant: "primary" })}
            >
              Nova amostra manual
            </NavLink>,
          ]}
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((sample) => (
          <SamplingCard key={sample.id} sample={sample} />
        ))}
      </div>
    </UnifiedPagePanel>
  );
}

function SamplingSamplePage() {
  const { sampleId } = useParams();
  const sample = samplingPlans.find((item) => item.id === sampleId) || samplingPlans[0];
  const [tab, setTab] = useState("caracterizacao");

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo D"
          title={`Amostra ${sample.id}`}
          description="Edição de memória de campo, resultado e validação da medição."
          actions={[
            <NavLink
              key="import"
              to="/app/lab-imports/new"
              className={buttonStyles({ variant: "secondary" })}
            >
              Importar laudo
            </NavLink>,
            <NavLink
              key="save"
              to="/app/reports/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Gerar relatório
            </NavLink>,
          ]}
        />
      }
    >
      <Panel className="grid gap-4">
        <TabRow items={sampleTabs} activeId={tab} onChange={setTab} />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Panel className="grid gap-4 bg-[var(--surface-muted)] p-5 lg:p-5">
            <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
              {sample.agent} • {sample.sector}
            </h3>
            <p className="text-[15px] leading-7 text-[var(--color-text-default)]">
              {sampleTabCopy[tab]}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Funcionário">
                <Input value={sample.employee} />
              </Field>
              <Field label="Responsável">
                <Input value={sample.owner} />
              </Field>
              <Field label="Data prevista">
                <Input value={sample.dueDate} />
              </Field>
              <Field label="Status">
                <Select value={sample.status} />
              </Field>
            </div>
          </Panel>
          <Drawer
            title="Impressão da amostra"
            description="Resumo pronto para ficha de campo e validação posterior."
          >
            <StatusBadge status={sample.status} />
            <Toast
              title="Validação da medição"
              description="Campo preparado para aceitar resultado laboratorial e registrar parecer."
            />
          </Drawer>
        </div>
      </Panel>
    </UnifiedPagePanel>
  );
}

function LabImportsListPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo E"
          title="Importação de laudos"
          description="Receba resultados laboratoriais, revise o parsing e aplique na amostra correta."
          actions={[
            <NavLink
              key="new"
              to="/app/lab-imports/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Nova importação
            </NavLink>,
          ]}
        />
      }
      bodyPadded={false}
    >
      <DataTable
        framed={false}
        columns={[
          { key: "laboratory", label: "Laboratório" },
          { key: "customer", label: "Cliente" },
          { key: "detected", label: "Resultado" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Atualização" },
          { key: "actions", label: "Ações" },
        ]}
        rows={labImports.map((item) => ({
          id: item.id,
          laboratory: item.laboratory,
          customer: item.customer,
          detected: item.detected,
          status: <StatusBadge status={item.status} />,
          updatedAt: item.updatedAt,
          actions: (
            <NavLink
              to={`/app/lab-imports/${item.id}/review`}
              className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[13px]" })}
            >
              Revisar
            </NavLink>
          ),
        }))}
      />
    </UnifiedPagePanel>
  );
}

function LabImportNewPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo E"
          title="Nova importação de laudo"
          description="Upload do PDF laboratorial e preparo para revisão aplicada à amostra."
          actions={[
            <NavLink
              key="review"
              to="/app/lab-imports/lab-210/review"
              className={buttonStyles({ variant: "primary" })}
            >
              Processar e revisar
            </NavLink>,
          ]}
        />
      }
    >
      <UploadArea
        title="Enviar laudo laboratorial"
        description="Layout preparado para reconhecer laboratório, amostra, resultado e unidade."
        files={[
          {
            name: "laudo_lab_210.pdf",
            kind: "Relatório laboratorial",
            type: "PDF",
            status: "Processando",
            note: "Upload concluído • aguardando parsing",
          },
        ]}
      />
    </UnifiedPagePanel>
  );
}

function LabImportReviewPage() {
  const { id } = useParams();
  const current = labImports.find((item) => item.id === id) || labImports[0];

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo E"
          title={`Revisão da importação ${current.id}`}
          description="Aplicação do resultado laboratorial na amostra correta com revisão humana."
          actions={[
            <NavLink
              key="apply"
              to="/app/sampling/sample/sam-9003"
              className={buttonStyles({ variant: "primary" })}
            >
              Aplicar em amostra
            </NavLink>,
          ]}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DocumentPreview
          documents={[
            {
              name: `${current.id}.pdf`,
              kind: current.laboratory,
              status: current.status,
              preview: `"${current.detected}". Resultado interpretado e pronto para associação.`,
            },
          ]}
        />
        <ReviewPanel
          title="Resultado lido"
          rows={[
            { label: "Amostra", value: current.sample },
            { label: "Cliente", value: current.customer },
            { label: "Resultado", value: current.detected },
            { label: "Atualização", value: current.updatedAt },
          ]}
          footer={<StatusBadge status={current.status} />}
        />
      </div>
    </UnifiedPagePanel>
  );
}

function ReportsListPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo F"
          title="Relatórios finais"
          description="Consolidação da jornada técnica com preview, versão e exportação simulada."
          actions={[
            <NavLink
              key="new"
              to="/app/reports/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Novo relatório
            </NavLink>,
          ]}
        />
      }
      bodyPadded={false}
    >
      <DataTable
        framed={false}
        columns={[
          { key: "code", label: "Relatório" },
          { key: "customer", label: "Cliente" },
          { key: "status", label: "Status" },
          { key: "version", label: "Versão" },
          { key: "updatedAt", label: "Atualização" },
          { key: "actions", label: "Ações" },
        ]}
        rows={reports.map((report) => ({
          id: report.id,
          code: report.code,
          customer: report.customer,
          status: <StatusBadge status={report.status} />,
          version: report.version,
          updatedAt: report.updatedAt,
          actions: (
            <div className="flex flex-wrap gap-2">
              <NavLink
                to={`/app/reports/${report.id}`}
                className={buttonStyles({ variant: "tertiary", className: "min-h-9 px-3 text-[13px]" })}
              >
                Revisar
              </NavLink>
              <NavLink
                to={`/app/reports/${report.id}/preview`}
                className={buttonStyles({ variant: "ghost", className: "min-h-9 px-3 text-[13px]" })}
              >
                Preview
              </NavLink>
            </div>
          ),
        }))}
      />
    </UnifiedPagePanel>
  );
}

function ReportNewPage() {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo F"
          title="Novo relatório final"
          description="Seleção de cliente, orçamento e amostras consolidadas para edição do relatório."
          actions={[
            <NavLink
              key="build"
              to="/app/reports/rel-013"
              className={buttonStyles({ variant: "primary" })}
            >
              Consolidar dados
            </NavLink>,
          ]}
        />
      }
    >
      <Panel className="grid gap-4 md:grid-cols-2">
        <Field label="Cliente">
          <Select value="Metalúrgica São Bento" />
        </Field>
        <Field label="Orçamento">
          <Select value="ORC-2061" />
        </Field>
        <Field label="Amostras selecionadas" full>
          <Textarea value="sam-9002 • Ruído / Corte\nsam-9003 • Tolueno / Pintura" rows={3} />
        </Field>
      </Panel>
    </UnifiedPagePanel>
  );
}

function ReportDetailPage() {
  const { id } = useParams();
  const report = reports.find((item) => item.id === id) || reports[0];
  const [humanApproval, setHumanApproval] = useState(true);

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo F"
          title={`Editor de relatório • ${report.code}`}
          description="Blocos revisáveis para caracterização, resultados e conclusão técnica."
          actions={[
            <Button key="save" variant="secondary">
              Salvar versão
            </Button>,
            <NavLink
              key="preview"
              to={`/app/reports/${report.id}/preview`}
              className={buttonStyles({ variant: "primary" })}
            >
              Preview PDF
            </NavLink>,
          ]}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="grid gap-4">
          {reportSections.map((section) => (
            <div
              key={section.title}
              className="grid gap-2 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
            >
              <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                {section.title}
              </strong>
              <Textarea value={section.copy} rows={4} />
            </div>
          ))}
        </Panel>
        <Panel className="grid gap-4 bg-[var(--surface-muted)] p-5 lg:p-5">
          <SwitchField
            label="Revisão final obrigatória do responsável"
            checked={humanApproval}
            onChange={setHumanApproval}
          />
          <Toast
            title="Versão atual"
            description={`${report.version} • ${report.updatedAt}`}
          />
          <Toast
            title="Envio final"
            description="A exportação e envio são simulados nesta etapa, sem geração real de PDF."
          />
        </Panel>
      </div>
    </UnifiedPagePanel>
  );
}

function ReportPreviewPage() {
  const { id } = useParams();
  const report = reports.find((item) => item.id === id) || reports[0];
  const [sent, setSent] = useState(false);

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo F"
          title={`Preview final • ${report.code}`}
          description="Visualização consolidada do relatório pronto para exportação simulada."
          actions={[
            <Button key="export" onClick={() => setSent(true)}>
              Simular exportação
            </Button>,
          ]}
        />
      }
      bodyClassName="grid gap-4"
    >
      {sent ? (
        <Toast
          title="Exportação simulada"
          description="Relatório marcado como pronto para envio por e-mail e WhatsApp."
        />
      ) : null}
      <ReportPreview sections={reportSections} />
    </UnifiedPagePanel>
  );
}

function AgentsPage() {
  return (
    <ModuleGridPage
      eyebrow="Base técnica"
      title="Cadastro de agentes ocupacionais"
      description="Agentes reutilizados em PRHO, orçamento, amostragem e relatório."
      actionLabel="Novo agente"
      actionPath="/app/agents/new"
      cards={agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
    />
  );
}

function AgentFormPage() {
  const { id } = useParams();
  const agent = agents.find((item) => item.id === id) || agents[0];
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Base técnica"
          title={id ? `Editar ${agent.name}` : "Cadastrar novo agente"}
          description="Campos mockados para preço base, criticidade, método e recomendação."
          actions={[<Button key="save">Salvar agente</Button>]}
        />
      }
    >
      <Panel className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <Input value={agent.name} />
        </Field>
        <Field label="Tipo">
          <Select value={agent.type} />
        </Field>
        <Field label="CAS">
          <Input value={agent.cas || "Não aplicável"} />
        </Field>
        <Field label="Método">
          <Input value={agent.method} />
        </Field>
        <Field label="Criticidade">
          <Select value={agent.criticality} />
        </Field>
        <Field label="Preço base">
          <Input value={agent.price} />
        </Field>
        <Field label="Recomendação" full>
          <Textarea value={agent.recommendation} />
        </Field>
      </Panel>
    </UnifiedPagePanel>
  );
}

function ServicesPage() {
  return (
    <SimpleTablePage
      eyebrow="Catálogo"
      title="Serviços"
      description="Itens reutilizados em propostas e composição comercial."
      columns={[
        { key: "name", label: "Serviço" },
        { key: "owner", label: "Owner" },
        { key: "price", label: "Preço base" },
      ]}
      rows={services}
    />
  );
}

function CostsPage() {
  return (
    <SimpleTablePage
      eyebrow="Catálogo"
      title="Custos"
      description="Custos complementares usados em orçamento e operação."
      columns={[
        { key: "name", label: "Custo" },
        { key: "category", label: "Categoria" },
        { key: "price", label: "Preço base" },
      ]}
      rows={costs}
    />
  );
}

function EquipmentsPage() {
  return (
    <SimpleTablePage
      eyebrow="Operação"
      title="Equipamentos"
      description="Controle visual de disponibilidade e calibração do parque de medição."
      columns={[
        { key: "name", label: "Equipamento" },
        { key: "status", label: "Status" },
        { key: "calibration", label: "Calibração" },
      ]}
      rows={equipments.map((item) => ({
        ...item,
        status: <StatusBadge status={item.status} />,
      }))}
    />
  );
}

function UsersPage() {
  const userAccessProfiles = [
    {
      ...users[0],
      status: "Ativo",
      workspace: "Canal HO",
      access: "Administrador global",
      lastAccess: "Hoje, 20:42",
      modules: ["PRHO", "Orçamentos", "Billing"],
      twoFactor: true,
    },
    {
      ...users[1],
      status: "Ativo",
      workspace: "Canal HO",
      access: "Gestão técnica",
      lastAccess: "Hoje, 19:58",
      modules: ["PRHO", "Amostragens", "Relatórios"],
      twoFactor: true,
    },
    {
      ...users[2],
      status: "Ativo",
      workspace: "Operação Sudeste",
      access: "Operação de campo",
      lastAccess: "Hoje, 18:17",
      modules: ["Amostragens", "Laudos"],
      twoFactor: false,
    },
    {
      ...users[3],
      status: "Convidado",
      workspace: "Portal Cliente",
      access: "Cliente leitor",
      lastAccess: "Convite pendente",
      modules: ["Relatórios"],
      twoFactor: false,
    },
  ];

  const activeUsers = userAccessProfiles.filter((user) => user.status === "Ativo").length;
  const internalUsers = userAccessProfiles.filter((user) => user.role !== "Usuário Cliente").length;
  const twoFactorCoverage = Math.round(
    (userAccessProfiles.filter((user) => user.twoFactor).length / userAccessProfiles.length) * 100,
  );

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Administração"
          title="Usuários e permissões"
          description="Mockup do módulo de acesso com papéis, dados e preparo para controle granular."
          meta={[
            <Badge key="total" tone="status">
              {userAccessProfiles.length} usuários
            </Badge>,
            <Badge key="internal" tone="processing">
              {internalUsers} perfis internos
            </Badge>,
            <Badge key="2fa" tone="review">
              2FA {twoFactorCoverage}%
            </Badge>,
          ]}
          actions={[
            <NavLink
              key="new"
              to="/app/users/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Novo usuário
            </NavLink>,
          ]}
        />
      }
      bodyClassName="grid gap-6"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuários ativos"
          value={activeUsers}
          hint="Equipe interna com acesso liberado"
          tone="positive"
        />
        <StatCard
          label="Cobertura 2FA"
          value={`${twoFactorCoverage}%`}
          hint="Perfis com camada extra de segurança"
          tone="info"
        />
        <StatCard
          label="Workspaces"
          value="3"
          hint="Canal principal, operação e portal cliente"
        />
        <StatCard
          label="Convites pendentes"
          value="1"
          hint="Usuário cliente aguardando primeiro acesso"
          tone="critical"
        />
      </div>

      <SearchAndFilters
        framed={false}
        search="Buscar por nome, e-mail, registro ou workspace"
        filters={[
          <Field key="role" label="Papel">
            <Select value="Todos os perfis" />
          </Field>,
          <Field key="workspace" label="Workspace">
            <Select value="Todos" />
          </Field>,
          <Field key="security" label="Segurança">
            <Select value="2FA e status" />
          </Field>,
        ]}
        actions={[
          <Button key="matrix" variant="tertiary">
            Matriz de acesso
          </Button>,
          <Button key="invite" variant="secondary">
            Convidar usuário
          </Button>,
        ]}
      />

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="grid gap-4">
          <DataTable
            columns={[
              { key: "identity", label: "Usuário" },
              { key: "access", label: "Acesso" },
              { key: "workspace", label: "Workspace" },
              { key: "contact", label: "Contato" },
              { key: "security", label: "Segurança" },
              { key: "actions", label: "Ações" },
            ]}
            rows={userAccessProfiles.map((user) => ({
              id: user.id,
              identity: (
                <div className="grid gap-3 md:grid-cols-[48px_minmax(0,1fr)] md:items-center">
                  <div className="grid size-12 place-items-center rounded-[16px] bg-[var(--surface-elevated)] text-[15px] font-semibold text-[var(--color-brand-foreground)]">
                    {user.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="grid gap-1">
                    <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                      {user.name}
                    </strong>
                    <span className="text-[13px] text-[var(--color-text-soft)]">
                      {user.registry} • {user.role}
                    </span>
                  </div>
                </div>
              ),
              access: (
                <div className="grid gap-2">
                  <Badge tone={user.status === "Ativo" ? "positive" : "review"}>
                    {user.status}
                  </Badge>
                  <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    {user.access}
                  </span>
                </div>
              ),
              workspace: (
                <div className="grid gap-2">
                  <span className="text-[15px] text-[var(--color-text-default)]">
                    {user.workspace}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.modules.map((module) => (
                      <Badge key={module} tone="status" className="min-h-7 px-3 text-[12px]">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              ),
              contact: (
                <div className="grid gap-1">
                  <span className="text-[15px] text-[var(--color-text-default)]">
                    {user.email}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-soft)]">
                    {user.phone}
                  </span>
                </div>
              ),
              security: (
                <div className="grid gap-2">
                  <Badge tone={user.twoFactor ? "processing" : "noQuantify"}>
                    {user.twoFactor ? "2FA ativo" : "Sem 2FA"}
                  </Badge>
                  <span className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                    {user.lastAccess}
                  </span>
                </div>
              ),
              actions: (
                <div className="flex flex-wrap gap-2">
                  <NavLink
                    to={`/app/users/${user.id}/edit`}
                    className={buttonStyles({
                      variant: "tertiary",
                      className: "min-h-9 px-3 text-[13px]",
                    })}
                  >
                    Editar
                  </NavLink>
                  <Button variant="ghost" className="min-h-9 px-3 text-[13px]">
                    Permissões
                  </Button>
                </div>
              ),
            }))}
          />

          <Panel className="grid gap-4 bg-[var(--surface-muted)] p-5 lg:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Governança
                </p>
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Perfis que exigem ação
                </h3>
              </div>
              <Badge tone="review">2 pendências</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Vitor Almeida
                </strong>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Ativar 2FA e revisar acesso ao módulo de orçamento antes do próximo ciclo.
                </p>
              </div>
              <div className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                <strong className="text-[15px] font-semibold text-[var(--color-text-strong)]">
                  Cliente Exemplo
                </strong>
                <p className="mt-2 text-[14px] leading-6 text-[var(--color-text-soft)]">
                  Convite ainda não aceito. Confirmar destinatário e reenviar acesso se necessário.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4">
          <Panel className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Resumo de acesso
              </p>
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Visão rápida de segurança
              </h3>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[15px] text-[var(--color-text-default)]">
                  Administradores globais
                </span>
                <strong className="text-[18px] font-semibold text-[var(--color-text-strong)]">
                  1
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[15px] text-[var(--color-text-default)]">
                  Acesso cliente externo
                </span>
                <strong className="text-[18px] font-semibold text-[var(--color-text-strong)]">
                  1
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                <span className="text-[15px] text-[var(--color-text-default)]">
                  Workspaces distintos
                </span>
                <strong className="text-[18px] font-semibold text-[var(--color-text-strong)]">
                  3
                </strong>
              </div>
            </div>
          </Panel>

          <Panel className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                Política mockada
              </p>
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                Regras de concessão
              </h3>
            </div>
            <div className="grid gap-3 text-[14px] leading-6 text-[var(--color-text-soft)]">
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                Perfis com acesso a billing e configurações devem manter 2FA obrigatório.
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                Usuários cliente visualizam relatórios e documentos aprovados, sem acesso operacional.
              </div>
              <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4">
                Workspaces operacionais podem ser segmentados por região, contrato ou unidade.
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </UnifiedPagePanel>
  );
}

function UserFormPage() {
  const { id } = useParams();
  const user = users.find((item) => item.id === id) || users[0];
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Administração"
          title={id ? `Editar ${user.name}` : "Cadastrar novo usuário"}
          description="Formulário mockado com papel, contatos e acesso principal."
          actions={[<Button key="save">Salvar usuário</Button>]}
        />
      }
    >
      <Panel className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <Input value={user.name} />
        </Field>
        <Field label="Cargo">
          <Input value={user.role} />
        </Field>
        <Field label="Registro">
          <Input value={user.registry} />
        </Field>
        <Field label="E-mail">
          <Input value={user.email} />
        </Field>
        <Field label="Telefone">
          <Input value={user.phone} />
        </Field>
        <Field label="Plano de acesso">
          <Select value="Workspace principal" />
        </Field>
      </Panel>
    </UnifiedPagePanel>
  );
}

function SettingsPage() {
  const { section = "company" } = useParams();
  const sections = {
    company: {
      title: "Dados da empresa",
      copy: "Branding, dados cadastrais, contatos e assinatura institucional.",
    },
    "print-texts": {
      title: "Textos dos impressos",
      copy: "Blocos padrão de orçamento, relatório e observações comerciais.",
    },
    results: {
      title: "Resultados",
      copy: "Critérios, textos e nomenclaturas utilizadas na consolidação final.",
    },
    "risk-classification": {
      title: "Classificação de risco",
      copy: "Regras de criticidade, categorias e badges normativos.",
    },
    "measurement-validation": {
      title: "Validação da medição",
      copy: "Checklist e travas visuais da etapa de aprovação final.",
    },
    "technical-bases": {
      title: "Bases técnicas",
      copy: "Manutenção das bases normativas e técnicas usadas pela IA e pelo motor de classificação.",
    },
    "access-control": {
      title: "Controle de acesso",
      copy: "Papéis mockados e mapeamento inicial de permissões.",
    },
    "pdf-templates": {
      title: "Templates PDF",
      copy: "Modelos visuais para orçamento, ficha de amostra e relatório final.",
    },
  };
  const current = sections[section] || sections.company;
  const technicalBasesSummary = {
    total: technicalBasesCatalog.length,
    active: technicalBasesCatalog.filter((item) => item.status === "Ativa").length,
    review: technicalBasesCatalog.filter((item) => item.status !== "Ativa").length,
  };

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Configurações"
          title={current.title}
          description={current.copy}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Panel className="grid gap-2">
          {Object.entries(sections).map(([key, value]) => (
            <NavLink
              key={key}
              to={`/app/settings/${key}`}
              className={cn(
                "rounded-2xl px-4 py-3 text-[14px] font-semibold no-underline transition",
                section === key
                  ? "bg-[var(--tab-active-bg)] text-[var(--color-text-strong)]"
                  : "text-[var(--color-text-soft)] hover:bg-[var(--surface-muted)]",
              )}
            >
              {value.title}
            </NavLink>
          ))}
        </Panel>
        {section === "technical-bases" ? (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                label="Bases cadastradas"
                value={technicalBasesSummary.total}
                hint="Normas, matriz, métodos e tabela de preços"
                tone="info"
              />
              <StatCard
                label="Ativas"
                value={technicalBasesSummary.active}
                hint="Prontas para uso pelo motor técnico"
                tone="positive"
              />
              <StatCard
                label="Em revisão"
                value={technicalBasesSummary.review}
                hint="Itens aguardando revisão ou publicação"
                tone="critical"
              />
            </div>
            <Panel className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-blue-500)]">
                  Catálogo técnico
                </p>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                  Bases normativas e de classificação
                </h3>
              </div>
              <div className="grid gap-3">
                {technicalBasesCatalog.map((base) => (
                  <div
                    key={base.id}
                    id={base.id}
                    className="scroll-mt-6 grid gap-3 rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--surface-muted)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="grid gap-1">
                        <strong className="text-[16px] font-semibold text-[var(--color-text-strong)]">
                          {base.name}
                        </strong>
                        <p className="text-[13px] leading-5 text-[var(--color-text-soft)]">
                          Versão {base.version} • vigência em {base.effectiveDate}
                        </p>
                      </div>
                      <StatusBadge status={base.status} />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                          Fonte
                        </span>
                        <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                          {base.source}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                          Última atualização
                        </span>
                        <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                          {base.updatedAt}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                          Responsável
                        </span>
                        <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                          {base.owner}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--surface-base)] p-4">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-soft)]">
                          Referência
                        </span>
                        <p className="mt-1 text-[14px] text-[var(--color-text-default)]">
                          {base.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        ) : (
          <Panel className="grid gap-4">
            <Field label="Conteúdo principal">
              <Textarea value={current.copy} rows={6} />
            </Field>
            <Toast
              title="Sem backend"
              description="Esta etapa só prepara comportamento e layout das páginas de configuração."
            />
          </Panel>
        )}
      </div>
    </UnifiedPagePanel>
  );
}

function BillingPage() {
  const { section = "plans" } = useParams();

  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow="Fluxo G"
          title="Planos e assinatura"
          description="Planejamento SaaS, uso de IA, módulos contratados e comparação entre planos."
        />
      }
      bodyClassName="grid gap-6"
    >
      <Panel className="flex flex-wrap gap-2 p-2 lg:p-2">
        {[
          ["plans", "Planos"],
          ["usage", "Uso da IA"],
          ["modules", "Módulos contratados"],
        ].map(([value, label]) => (
          <NavLink
            key={value}
            to={`/app/billing/${value}`}
            className={cn(
              "rounded-xl border px-[14px] py-[10px] text-[14px] font-semibold no-underline transition",
              section === value
                ? "border-[var(--color-border-subtle)] bg-[var(--menu-item-active-bg)] text-[var(--color-brand-foreground)] shadow-[var(--shadow-soft)]"
                : "border-transparent bg-transparent text-[var(--color-text-soft)] hover:bg-[var(--surface-muted)]",
            )}
          >
            {label}
          </NavLink>
        ))}
      </Panel>
      {section === "usage" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {usageMetrics.map((metric) => (
            <UsageMeter
              key={metric.id}
              label={metric.label}
              used={metric.used}
              total={metric.total}
              unit={metric.unit}
            />
          ))}
        </div>
      ) : section === "modules" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Analisador PRHO",
            "Pré-orçamento",
            "Orçamento",
            "Amostragem",
            "Importação de laudos",
            "Relatórios finais",
          ].map((module) => (
            <Panel key={module} className="grid gap-3">
              <strong className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--color-text-strong)]">
                {module}
              </strong>
              <StatusBadge status="Ativo" />
            </Panel>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} current={plan.id === "professional"} />
          ))}
        </div>
      )}
    </UnifiedPagePanel>
  );
}

function ModuleGridPage({
  eyebrow,
  title,
  description,
  actionLabel,
  actionPath,
  cards,
}) {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={[
            <NavLink
              key="action"
              to={actionPath}
              className={buttonStyles({ variant: "primary" })}
            >
              {actionLabel}
            </NavLink>,
          ]}
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards}</div>
    </UnifiedPagePanel>
  );
}

function SimpleTablePage({ eyebrow, title, description, columns, rows }) {
  return (
    <UnifiedPagePanel
      header={
        <PageHeader
          framed={false}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      }
      bodyPadded={false}
    >
      <DataTable columns={columns} rows={rows} framed={false} />
    </UnifiedPagePanel>
  );
}

function resolvePageTitle(pathname) {
  const patterns = [
    ["/login", "Login"],
    ["/forgot-password", "Recuperação de senha"],
    ["/reset-password", "Redefinição de senha"],
    ["/app/dashboard", "Dashboard"],
    ["/app/profile", "Perfil do usuário"],
    ["/app/customers/new", "Novo cliente"],
    ["/app/customers", "Clientes"],
    ["/app/prho/new", "Nova análise PRHO"],
    ["/app/prho", "Analisador PRHO"],
    ["/app/pre-quotations", "Pré-orçamentos"],
    ["/app/quotations/new", "Novo orçamento"],
    ["/app/quotations", "Orçamentos"],
    ["/app/sampling/sample", "Amostra"],
    ["/app/sampling", "Amostragens"],
    ["/app/lab-imports", "Importação de laudos"],
    ["/app/reports", "Relatórios finais"],
    ["/app/agents", "Agentes"],
    ["/app/services", "Serviços"],
    ["/app/costs", "Custos"],
    ["/app/equipments", "Equipamentos"],
    ["/app/users", "Usuários"],
    ["/app/settings", "Configurações"],
    ["/app/billing", "Planos e assinatura"],
  ];

  const match = patterns.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : "CHO 2.0";
}

function buildBreadcrumbs(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const map = {
    login: "Login",
    app: "App",
    dashboard: "Dashboard",
    profile: "Perfil",
    customers: "Clientes",
    new: "Novo",
    edit: "Editar",
    prho: "PRHO",
    "pre-quotations": "Pré-orçamentos",
    quotations: "Orçamentos",
    sampling: "Amostragens",
    sample: "Amostra",
    "lab-imports": "Laudos",
    reports: "Relatórios",
    agents: "Agentes",
    services: "Serviços",
    costs: "Custos",
    equipments: "Equipamentos",
    users: "Usuários",
    settings: "Configurações",
    company: "Empresa",
    "print-texts": "Textos",
    results: "Resultados",
    "risk-classification": "Risco",
    "measurement-validation": "Validação",
    "access-control": "Acesso",
    "pdf-templates": "Templates PDF",
    billing: "Billing",
    plans: "Planos",
    usage: "Uso IA",
    modules: "Módulos",
    upload: "Upload",
    processing: "Processamento",
    review: "Revisão",
    classification: "Classificação",
    summary: "Resumo",
    preview: "Preview",
  };

  return parts.map((part) => ({
    label: map[part] || part.toUpperCase(),
  }));
}

export default App;
