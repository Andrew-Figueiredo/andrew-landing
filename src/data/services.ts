import type { Service } from './types';

export const services: Service[] = [
  {
    id: 'dev',
    weight: 'primary',
    icon: 'Code2',
    title: { pt: 'Desenvolvimento de Sistemas', en: 'Systems Development' },
    items: [
      { pt: 'Aplicações web sob medida (React / Next.js)', en: 'Custom web applications (React / Next.js)' },
      { pt: 'APIs e integrações entre sistemas', en: 'APIs and system integrations' },
      { pt: 'Landing pages e sites profissionais', en: 'Landing pages and professional websites' },
    ],
  },
  {
    id: 'ai',
    weight: 'primary',
    icon: 'BrainCircuit',
    title: { pt: 'Consultoria em IA', en: 'AI Consulting' },
    items: [
      {
        pt: 'Diagnóstico de oportunidades de IA em processos existentes',
        en: 'Assessment of AI opportunities in existing processes',
      },
      {
        pt: 'Integração de LLMs em produtos e fluxos de trabalho',
        en: 'LLM integration into products and workflows',
      },
      {
        pt: 'Desenvolvimento e treinamento de modelos de machine learning sob medida',
        en: 'Development and training of custom machine learning models',
      },
      {
        pt: 'Modelagem preditiva e análise avançada de dados',
        en: 'Predictive modeling and advanced data analysis',
      },
      { pt: 'Automação inteligente de processos', en: 'Intelligent process automation' },
    ],
  },
  {
    id: 'automation',
    weight: 'primary',
    icon: 'Workflow',
    title: { pt: 'Automação e Bots', en: 'Automation and Bots' },
    items: [
      { pt: 'Automação de processos com n8n', en: 'Process automation with n8n' },
      { pt: 'Chatbots para WhatsApp e Telegram', en: 'WhatsApp and Telegram chatbots' },
      { pt: 'Integrações entre sistemas e RPA', en: 'System integrations and RPA' },
    ],
  },
  {
    id: 'quality',
    icon: 'ShieldCheck',
    // Peso deliberadamente menor: é o que fecha o ciclo das outras três, não uma quarta oferta
    // em pé de igualdade. Ver seção 2 da spec.
    weight: 'secondary',
    title: { pt: 'Qualidade e Engenharia de Testes', en: 'Quality and Test Engineering' },
    items: [
      { pt: 'Suítes de testes automatizados integradas ao pipeline', en: 'Automated test suites wired into the pipeline' },
      { pt: 'BDD, testes de API e de desempenho', en: 'BDD, API and performance testing' },
      { pt: 'Análise estática de código e portões de qualidade em CI/CD', en: 'Static code analysis and quality gates in CI/CD' },
    ],
  },
];
