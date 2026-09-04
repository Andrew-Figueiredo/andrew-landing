import type { SkillGroup } from './types';

// A ordem ainda comunica posicionamento: grupos com `area` vêm antes dos três últimos
// (data/infra/methods), que são apoio e aparecem em toda página de área.
export const skillGroups: SkillGroup[] = [
  {
    id: 'web',
    area: 'fullstack',
    title: { pt: 'Desenvolvimento Web', en: 'Web Development' },
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'React Native', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    id: 'backend',
    area: 'fullstack',
    title: { pt: 'Backend & APIs', en: 'Backend & APIs' },
    skills: ['Python', 'Node.js', 'APIs REST', 'PostgreSQL', 'MongoDB', 'SQL'],
  },
  {
    id: 'ai',
    area: 'ia-automacao',
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
    area: 'ia-automacao',
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
    area: 'qa',
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
