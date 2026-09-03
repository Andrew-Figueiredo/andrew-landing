// Sem `as const` de propósito: ele produziria tipos literais ('Sobre'), e en.ts
// tipado como Dictionary passaria a exigir exatamente a string em português.
export const pt = {
  nav: {
    about: 'Sobre',
    services: 'Serviços',
    projects: 'Projetos',
    process: 'Como eu trabalho',
    skills: 'Skills',
    ai: 'IA',
    experience: 'Experiência',
    contact: 'Contato',
    backToAreas: 'Todas as áreas',
    ariaMain: 'Navegação principal',
    ariaLang: 'Trocar idioma',
  },
  hero: {
    eyebrow: 'Especialista em Desenvolvimento de Sistemas · Consultoria em IA e Automação',
    headlineBefore: 'Construo o sistema, integro ',
    headlineAccent: 'inteligência',
    headlineAfter: ' e automatizo a operação em volta.',
    subheadline:
      '+5 anos construindo e sustentando sistemas, do requisito à produção. Desenvolvimento de software, consultoria em IA e automação de processos.',
    ctaProjects: 'Ver projetos',
    ctaCv: 'Baixar CV',
    actuationLabel: 'Atuação',
  },
  about: {
    paragraphs: [
      'Entrei na engenharia de software pelo lado da qualidade e da automação, e isso me deu uma leitura completa de como um sistema é construído, onde ele quebra e o que é preciso para sustentá-lo em produção.',
      'Hoje desenvolvo aplicações web, integro soluções de IA e automatizo processos. São três camadas do mesmo trabalho: construir o sistema, colocar inteligência dentro dele e automatizar a operação em volta.',
      'Tenho base em Matemática Computacional, formação em Ciência de Dados e mestrado em Tecnologia da Informação com pesquisa em IA aplicada à Engenharia de Software.',
    ],
    photoAlt: 'Andrew Figueiredo',
  },
  sections: {
    aboutTitle: 'Sobre',
    servicesTitle: 'Serviços',
    projectsTitle: 'Projetos',
    processTitle: 'Como eu trabalho',
    skillsTitle: 'Skills',
    aiTitle: 'IA: formação e pesquisa',
    experienceTitle: 'Experiência',
    contactTitle: 'Contato',
  },
  projects: {
    filterAll: 'Todos',
    filterIa: 'IA',
    filterFullstack: 'Fullstack',
    filterLanding: 'Landing Pages',
    filterQa: 'QA',
    showAll: 'Ver todos',
    showLess: 'Ver menos',
    repo: 'Repositório',
    demo: 'Demo',
    ariaFilter: 'Filtrar projetos por categoria',
  },
  ai: {
    educationLabel: 'Formação',
    researchLabel: 'Pesquisa',
    sourceLabel: 'Fonte oficial',
  },
  experience: {
    current: 'atual',
    researchGrant: 'Bolsa de pesquisa · 20h semanais',
    employment: 'Vínculo empregatício',
  },
  contact: {
    intro: 'Disponível para consultoria, projetos e conversas técnicas.',
    email: 'E-mail',
  },
  home: {
    selectorTitle: 'Escolha uma área',
    selectorSubtitle: 'Cada área mostra os serviços, projetos e skills relevantes pra ela.',
    selectorCta: 'Explorar',
  },
  footer: {
    rights: 'Todos os direitos reservados.',
    source: 'Código deste site',
  },
};

export type Dictionary = typeof pt;
