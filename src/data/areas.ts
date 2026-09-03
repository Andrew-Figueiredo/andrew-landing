import type { Locale } from '@/i18n';
import type { AreaId, Localized, ProjectCategory } from './types';

export type Area = {
  id: AreaId;
  slug: Localized;
  label: Localized;
  hero: {
    eyebrow: Localized;
    headlineBefore: Localized;
    headlineAccent: Localized;
    headlineAfter: Localized;
    subheadline: Localized;
  };
};

export const areas: Area[] = [
  {
    id: 'fullstack',
    slug: { pt: 'fullstack', en: 'fullstack' },
    label: { pt: 'Fullstack', en: 'Fullstack' },
    hero: {
      eyebrow: {
        pt: 'Desenvolvimento de Sistemas Fullstack',
        en: 'Fullstack Systems Development',
      },
      headlineBefore: { pt: 'Construo o sistema ', en: 'I build the system ' },
      headlineAccent: { pt: 'de ponta a ponta', en: 'end to end' },
      headlineAfter: {
        pt: ', do banco de dados à interface.',
        en: ', from the database to the interface.',
      },
      subheadline: {
        pt: '+5 anos desenvolvendo aplicações web e APIs, do requisito à produção. Front-end, back-end e a integração entre sistemas.',
        en: '5+ years building web applications and APIs, from requirements to production. Front-end, back-end and the integration between systems.',
      },
    },
  },
  {
    id: 'ia-automacao',
    slug: { pt: 'ia-automacao', en: 'ai-automation' },
    label: { pt: 'IA e Automação', en: 'AI and Automation' },
    hero: {
      eyebrow: {
        pt: 'Consultoria em IA e Automação de Processos',
        en: 'AI Consulting and Process Automation',
      },
      headlineBefore: { pt: 'Integro ', en: 'I embed ' },
      headlineAccent: { pt: 'inteligência', en: 'intelligence' },
      headlineAfter: {
        pt: ' e automatizo a operação ao redor do sistema.',
        en: ' and automate the operation around the system.',
      },
      subheadline: {
        pt: 'Diagnóstico de oportunidades de IA, integração de LLMs em produtos e automação de processos com n8n e RPA.',
        en: 'Assessment of AI opportunities, LLM integration into products and process automation with n8n and RPA.',
      },
    },
  },
  {
    id: 'qa',
    slug: { pt: 'qa', en: 'qa' },
    label: { pt: 'QA', en: 'QA' },
    hero: {
      eyebrow: {
        pt: 'Engenharia de Qualidade de Software',
        en: 'Software Quality Engineering',
      },
      headlineBefore: { pt: 'Garanto que o sistema ', en: 'I make sure the system ' },
      headlineAccent: { pt: 'funciona', en: 'works' },
      headlineAfter: {
        pt: ' antes de chegar em produção.',
        en: ' before it reaches production.',
      },
      subheadline: {
        pt: 'Suítes de testes automatizados integradas ao pipeline, BDD, testes de API e de desempenho, portões de qualidade em CI/CD.',
        en: 'Automated test suites wired into the pipeline, BDD, API and performance testing, quality gates in CI/CD.',
      },
    },
  },
];

export function areaBySlug(lang: Locale, slug: string): Area | undefined {
  return areas.find((a) => a.slug[lang] === slug);
}

export function areaById(id: AreaId): Area {
  const area = areas.find((a) => a.id === id);
  if (!area) throw new Error(`área desconhecida: ${id}`);
  return area;
}

const CATEGORIES_BY_AREA: Record<AreaId, ProjectCategory[]> = {
  fullstack: ['fullstack', 'landing'],
  'ia-automacao': ['ia'],
  qa: ['qa'],
};

export function categoriesForArea(area: AreaId): ProjectCategory[] {
  return CATEGORIES_BY_AREA[area];
}
