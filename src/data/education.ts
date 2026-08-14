import type { EducationItem, ResearchItem } from './types';

export const education: EducationItem[] = [
  {
    id: 'mestrado',
    degree: { pt: 'Mestrado em Tecnologia da Informação', en: "Master's in Information Technology" },
    institution: 'IFPB',
    period: { pt: 'Fev/2025 – atual', en: 'Feb/2025 – present' },
    description: {
      pt: 'Linha de Gestão e Desenvolvimento de Sistemas. Pesquisa em IA aplicada à Engenharia de Software: machine learning em testes, qualidade e automação. Estudo de LLMs.',
      en: 'Systems Management and Development track. Research on AI applied to Software Engineering: machine learning in testing, quality and automation. Study of LLMs.',
    },
  },
  {
    id: 'dados',
    degree: { pt: 'Tecnólogo em Ciência de Dados', en: 'Technologist in Data Science' },
    institution: 'UNIPÊ',
    period: { pt: 'Fev/2021 – Dez/2022', en: 'Feb/2021 – Dec/2022' },
    description: {
      pt: 'ML supervisionado e não supervisionado: classificação, regressão, árvores de decisão, redes neurais. Avaliação de modelos com scikit-learn. MLOps. Big data com PySpark, PostgreSQL e MongoDB.',
      en: 'Supervised and unsupervised ML: classification, regression, decision trees, neural networks. Model evaluation with scikit-learn. MLOps. Big data with PySpark, PostgreSQL and MongoDB.',
    },
  },
  {
    id: 'matematica',
    degree: { pt: 'Graduação em Matemática Computacional', en: 'BSc in Computational Mathematics' },
    institution: 'UFPB',
    period: { pt: 'Jul/2016 – Dez/2021', en: 'Jul/2016 – Dec/2021' },
    description: {
      pt: 'Base matemática dos modelos: álgebra linear computacional, cálculo numérico, otimização, análise numérica e modelagem matemática. Monitorias de Cálculo II e Matemática Discreta.',
      en: 'Mathematical foundation of the models: computational linear algebra, numerical calculus, optimization, numerical analysis and mathematical modeling. Teaching assistant for Calculus II and Discrete Mathematics.',
    },
  },
];

// Recorte desta seção: o CONTEÚDO da pesquisa. O vínculo e as datas vivem em experience.ts.
// Não descrever o Keep Chat como projeto de segurança pública: o edital tem trechos de
// pré-requisito reaproveitados de outro edital. A descrição oficial é a do item 2.1.
export const research: ResearchItem[] = [
  {
    id: 'keepchat',
    title: { pt: 'Projeto Keep Chat', en: 'Keep Chat Project' },
    institution: 'FAPESQ / SECTIES-PB',
    period: { pt: 'Set/2025 – atual', en: 'Sep/2025 – present' },
    description: {
      pt: 'Iniciativa educativa voltada para a capacitação, formação e treinamento em ferramentas de Inteligência Artificial generativa, com o propósito de promover impacto social positivo. Pesquisa com fomento público estadual.',
      en: 'Educational initiative for training and qualification in generative Artificial Intelligence tools, aimed at promoting positive social impact. Research funded by the state government.',
    },
    sourceUrl:
      'https://fapesq.rpp.br/editais/2025/edital-no-30-2025-selecao-de-pesquisadores-para-o-projeto-keep-chat',
  },
];
