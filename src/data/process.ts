import type { ProcessStep } from './types';

export const processSteps: ProcessStep[] = [
  {
    n: '01',
    title: { pt: 'Levantamento e análise de requisitos', en: 'Requirements gathering and analysis' },
    description: {
      pt: 'Entender o processo real antes de propor solução, incluindo o que já existe e o que não pode quebrar.',
      en: 'Understanding the actual process before proposing a solution, including what exists and what cannot break.',
    },
  },
  {
    n: '02',
    title: { pt: 'Arquitetura e modelagem', en: 'Architecture and modeling' },
    description: {
      pt: 'Definir fronteiras, contratos entre componentes e modelo de dados antes da primeira linha de código.',
      en: 'Defining boundaries, contracts between components and the data model before the first line of code.',
    },
  },
  {
    n: '03',
    title: { pt: 'Desenvolvimento', en: 'Development' },
    description: {
      pt: 'Implementação incremental, com entregas verificáveis em vez de um único marco no fim.',
      en: 'Incremental implementation, with verifiable deliveries instead of a single milestone at the end.',
    },
  },
  {
    n: '04',
    title: { pt: 'Qualidade, testes automatizados e CI/CD', en: 'Quality, automated testing and CI/CD' },
    description: {
      pt: 'Suítes automatizadas integradas ao pipeline, análise estática e portões que impedem regressão de chegar à produção.',
      en: 'Automated suites wired into the pipeline, static analysis and gates that keep regressions out of production.',
    },
  },
  {
    n: '05',
    title: { pt: 'Deploy, monitoramento e evolução', en: 'Deployment, monitoring and evolution' },
    description: {
      pt: 'Publicação automatizada, acompanhamento do comportamento em produção e ajuste contínuo.',
      en: 'Automated releases, tracking behaviour in production and continuous adjustment.',
    },
  },
];
