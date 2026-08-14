import type { SkillGroup } from './types';

// A ordem comunica o posicionamento e não deve ser alterada sem revisar a spec.
// Os quatro primeiros grupos são as frentes de atuação (web e backend formam a de
// Desenvolvimento). Qualidade vem em quinto: declarada, mas depois das três principais.
// Os três últimos são apoio.
export const skillGroups: SkillGroup[] = [
  {
    id: 'web',
    title: { pt: 'Desenvolvimento Web', en: 'Web Development' },
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'React Native', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    id: 'backend',
    title: { pt: 'Backend & APIs', en: 'Backend & APIs' },
    skills: ['Python', 'Node.js', 'APIs REST', 'PostgreSQL', 'MongoDB', 'SQL'],
  },
  {
    id: 'ai',
    title: { pt: 'IA & Machine Learning', en: 'AI & Machine Learning' },
    skills: [
      'LLMs',
      'Treinamento de modelos',
      'ML supervisionado',
      'ML não supervisionado',
      'Redes neurais',
      'Classificação',
      'Regressão',
      'Árvores de decisão',
      'scikit-learn',
      'PySpark',
      'MLOps',
      'Avaliação de modelos',
      'Jupyter',
      'Python',
      'R',
    ],
  },
  {
    id: 'automation',
    title: { pt: 'Automação & Bots', en: 'Automation & Bots' },
    skills: [
      'n8n',
      'Chatbots WhatsApp',
      'Chatbots Telegram',
      'Power Automate',
      'Integrações entre sistemas',
      'RPA',
    ],
  },
  {
    id: 'quality',
    title: { pt: 'Qualidade & Engenharia de Testes', en: 'Quality & Test Engineering' },
    skills: [
      'Playwright',
      'Pytest',
      'Pytest-BDD',
      'Cypress',
      'Selenium',
      'Azure DevOps',
      'SonarQube',
      'BDD',
      'Testes de API',
      'Testes de performance',
    ],
  },
  {
    id: 'data',
    title: { pt: 'Dados & BI', en: 'Data & BI' },
    skills: ['Power BI', 'Dashboards', 'Modelagem de dados', 'Análise de dados', 'Knime Analytics'],
  },
  {
    id: 'infra',
    title: { pt: 'Infra & DevOps', en: 'Infra & DevOps' },
    skills: ['Docker', 'Nginx', 'GitHub Actions', 'Linux/VPS', 'CI/CD'],
  },
  {
    id: 'methods',
    title: { pt: 'Metodologias', en: 'Methodologies' },
    skills: ['SCRUM', 'Ágil', 'Design Patterns', 'Clean Code'],
  },
];
