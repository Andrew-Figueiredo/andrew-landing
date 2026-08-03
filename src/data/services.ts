import type { Service } from './types';

export const services: Service[] = [
  {
    id: 'dev',
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
    icon: 'Workflow',
    title: { pt: 'Automação e Bots', en: 'Automation and Bots' },
    items: [
      { pt: 'Automação de processos com n8n', en: 'Process automation with n8n' },
      { pt: 'Chatbots para WhatsApp e Telegram', en: 'WhatsApp and Telegram chatbots' },
      { pt: 'Integrações entre sistemas e RPA', en: 'System integrations and RPA' },
    ],
  },
];
