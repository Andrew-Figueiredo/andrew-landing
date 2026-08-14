import type { ExperienceItem } from './types';

// Ordem cronológica reversa. ENACOM é um bloco único com progressão interna: três blocos
// soltos leem como rotatividade, agrupados leem como crescimento.
// CODATA e Keep Chat são simultâneos — emprego e bolsa de pesquisa. O campo `kind` existe
// para que a sobreposição de datas leia como acúmulo legítimo, não como inconsistência.
export const experience: ExperienceItem[] = [
  {
    id: 'keepchat',
    organization: 'FAPESQ / SECTIES-PB',
    kind: 'research',
    period: { pt: 'Set/2025 – atual', en: 'Sep/2025 – present' },
    current: true,
    roles: [
      {
        title: {
          pt: 'Pesquisador — Analista de TI | Projeto Keep Chat',
          en: 'Researcher — IT Analyst | Keep Chat Project',
        },
        period: { pt: 'Set/2025 – atual', en: 'Sep/2025 – present' },
        bullets: [
          {
            pt: 'Pesquisa aplicada em ferramentas de IA generativa dentro de projeto com fomento público estadual',
            en: 'Applied research on generative AI tools within a state-funded public project',
          },
        ],
      },
    ],
  },
  {
    id: 'codata',
    organization: 'CODATA — Companhia de Dados da Paraíba',
    kind: 'employment',
    period: { pt: 'Nov/2024 – atual', en: 'Nov/2024 – present' },
    current: true,
    roles: [
      {
        title: {
          pt: 'Analista de TI — Desenvolvimento e Qualidade',
          en: 'IT Analyst — Development and Quality',
        },
        period: { pt: 'Nov/2024 – atual', en: 'Nov/2024 – present' },
        bullets: [
          {
            pt: 'Desenvolvimento de suítes de automação em Python com Playwright e Pytest',
            en: 'Built Python automation suites with Playwright and Pytest',
          },
          {
            pt: 'Implementação de BDD com Pytest-BDD e integração de relatórios ao pipeline',
            en: 'Implemented BDD with Pytest-BDD and wired reporting into the pipeline',
          },
          { pt: 'Análise de qualidade de código com SonarQube', en: 'Code quality analysis with SonarQube' },
          { pt: 'Construção de dashboards de acompanhamento técnico', en: 'Built technical tracking dashboards' },
          {
            pt: 'Testes de desempenho e análise de gargalos de aplicação',
            en: 'Performance testing and application bottleneck analysis',
          },
        ],
      },
    ],
  },
  {
    id: 'enacom',
    organization: 'ENACOM',
    kind: 'employment',
    period: { pt: 'Jul/2021 – Out/2024', en: 'Jul/2021 – Oct/2024' },
    current: false,
    roles: [
      {
        title: {
          pt: 'Analista de Qualidade de Software V — Líder Técnico',
          en: 'Software Quality Analyst V — Technical Lead',
        },
        period: { pt: 'Fev/2023 – Out/2024', en: 'Feb/2023 – Oct/2024' },
        bullets: [
          {
            pt: 'Liderança técnica de equipe, definindo padrões de código e processo',
            en: 'Technical leadership of the team, defining code and process standards',
          },
          {
            pt: 'Desenvolvimento de automações em Python para otimização de fluxos',
            en: 'Built Python automations to streamline workflows',
          },
          {
            pt: 'Administração de pipeline e TestPlan em Azure DevOps',
            en: 'Pipeline and TestPlan administration in Azure DevOps',
          },
          {
            pt: 'Atuação junto ao cliente na operação assistida do sistema',
            en: 'Worked alongside the client during assisted system operation',
          },
        ],
      },
      {
        title: { pt: 'Analista de Qualidade de Software III', en: 'Software Quality Analyst III' },
        period: { pt: 'Out/2022 – Fev/2023', en: 'Oct/2022 – Feb/2023' },
        bullets: [
          {
            pt: 'Desenvolvimento de automações web com padrão Page Object',
            en: 'Built web automations using the Page Object pattern',
          },
          { pt: 'Automação de processos com Power Automate', en: 'Process automation with Power Automate' },
        ],
      },
      {
        title: {
          pt: 'Analista de Qualidade de Software I / Estágio',
          en: 'Software Quality Analyst I / Internship',
        },
        period: { pt: 'Jul/2021 – Out/2022', en: 'Jul/2021 – Oct/2022' },
        bullets: [
          {
            pt: 'Automação em Cypress (JavaScript) com Page Objects',
            en: 'Cypress (JavaScript) automation with Page Objects',
          },
          { pt: 'Testes e integração de APIs REST', en: 'REST API testing and integration' },
          { pt: 'Manipulação de bases MongoDB', en: 'MongoDB database handling' },
        ],
      },
    ],
  },
  {
    id: 'ufpb',
    organization: 'UFPB',
    kind: 'employment',
    period: { pt: 'Abr/2019 – Jan/2020', en: 'Apr/2019 – Jan/2020' },
    current: false,
    roles: [
      {
        title: { pt: 'Desenvolvedor Mobile', en: 'Mobile Developer' },
        period: { pt: 'Abr/2019 – Jan/2020', en: 'Apr/2019 – Jan/2020' },
        bullets: [
          {
            pt: 'Desenvolvimento de aplicação mobile em React Native',
            en: 'Built a mobile application in React Native',
          },
          { pt: 'Prototipação em Figma', en: 'Prototyping in Figma' },
        ],
      },
    ],
  },
];
