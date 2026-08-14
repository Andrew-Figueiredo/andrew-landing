import type { Project } from './types';

// TODO: substituir as nove entradas por projetos reais.
// Regra de redação: descreva o problema resolvido, não o artefato.
// Fraco: "Chatbot WhatsApp". Forte: "Chatbot que qualifica leads e agenda atendimentos".
export const projects: Project[] = [
  {
    id: 'ia-1',
    category: 'ia',
    title: { pt: 'Classificador de chamados de suporte', en: 'Support ticket classifier' },
    description: {
      pt: 'Roteia tickets por categoria e urgência automaticamente, eliminando a triagem manual da equipe de atendimento.',
      en: 'Routes tickets by category and urgency automatically, removing manual triage from the support team.',
    },
    stack: ['Python', 'scikit-learn', 'FastAPI'],
    featured: true,
    year: 2025,
  },
  {
    id: 'ia-2',
    category: 'ia',
    title: { pt: 'Assistente de consulta a documentos internos', en: 'Internal document assistant' },
    description: {
      pt: 'Responde perguntas sobre normas e procedimentos internos citando a fonte, reduzindo a dependência de especialistas.',
      en: 'Answers questions about internal policies citing the source, reducing dependency on specialists.',
    },
    stack: ['Python', 'LLM', 'PostgreSQL'],
    featured: true,
    year: 2025,
  },
  {
    id: 'fs-1',
    category: 'fullstack',
    title: { pt: 'Painel de acompanhamento técnico', en: 'Technical tracking dashboard' },
    description: {
      pt: 'Consolida indicadores de qualidade que antes viviam em planilhas dispersas, dando visibilidade única ao time.',
      en: 'Consolidates quality indicators previously scattered across spreadsheets into a single view for the team.',
    },
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    featured: true,
    year: 2025,
  },
  {
    id: 'fs-2',
    category: 'fullstack',
    title: { pt: 'Integração entre sistemas legados', en: 'Legacy system integration' },
    description: {
      pt: 'Sincroniza cadastros entre dois sistemas que não conversavam, acabando com a redigitação diária de dados.',
      en: 'Syncs records between two systems that could not talk to each other, ending daily manual re-entry.',
    },
    stack: ['Node.js', 'APIs REST', 'Docker'],
    featured: true,
    year: 2024,
  },
  {
    id: 'fs-3',
    category: 'fullstack',
    title: { pt: 'Aplicação de gestão de atendimentos', en: 'Service management application' },
    description: {
      pt: 'Substitui controle em planilha por fluxo com histórico e responsáveis, tornando auditável o que antes se perdia.',
      en: 'Replaces spreadsheet control with a tracked flow with history and owners, making auditable what used to be lost.',
    },
    stack: ['React', 'Node.js', 'MongoDB'],
    featured: true,
    year: 2024,
  },
  {
    id: 'fs-4',
    category: 'fullstack',
    title: { pt: 'API de consolidação de dados', en: 'Data consolidation API' },
    description: {
      pt: 'Expõe num contrato único dados que estavam presos em três bases distintas, simplificando as integrações seguintes.',
      en: 'Exposes through a single contract data locked in three separate databases, simplifying downstream integrations.',
    },
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
    featured: true,
    year: 2024,
  },
  {
    id: 'lp-1',
    category: 'landing',
    title: { pt: 'Meu Cantinho Imóveis', en: 'Meu Cantinho Imóveis' },
    description: {
      pt: 'Catálogo filtrável de imóveis com contato direto por WhatsApp, pra corretor autônomo sem presença digital parar de perder lead pra concorrência.',
      en: 'Filterable property catalog with direct WhatsApp contact, so an independent agent without a digital presence stops losing leads to competitors.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    repoUrl: 'https://github.com/Andrew-Figueiredo/corretor-imoveis-landing',
    demoUrl: 'https://corretor-imoveis-landing.vercel.app/',
    featured: false,
    year: 2026,
  },
  {
    id: 'lp-2',
    category: 'landing',
    title: { pt: 'Página de captura para campanha', en: 'Campaign capture page' },
    description: {
      pt: 'Concentra o tráfego de campanha num fluxo único de contato, tornando mensurável o retorno do investimento.',
      en: 'Concentrates campaign traffic into a single contact flow, making return on investment measurable.',
    },
    stack: ['Next.js', 'Tailwind CSS'],
    featured: false,
    year: 2024,
  },
  {
    id: 'lp-3',
    category: 'landing',
    title: { pt: 'Site de apresentação de serviços', en: 'Services presentation site' },
    description: {
      pt: 'Organiza a oferta de serviços de forma escaneável, reduzindo as perguntas repetidas no primeiro contato.',
      en: 'Organizes the service offering in a scannable way, cutting repeated questions on first contact.',
    },
    stack: ['Next.js', 'TypeScript'],
    featured: false,
    year: 2024,
  },
];
