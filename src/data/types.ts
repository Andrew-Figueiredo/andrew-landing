export type Localized = { pt: string; en: string };

export type Service = {
  id: 'dev' | 'ai' | 'automation' | 'quality';
  icon: 'Code2' | 'BrainCircuit' | 'Workflow' | 'ShieldCheck';
  // 'primary' são as três frentes de peso equivalente. 'secondary' é a qualidade: aparece e
  // tem lastro, mas nunca ocupa o mesmo espaço nem vem antes das três. O Hero renderiza só as
  // primárias, e a seção de Serviços dá à secundária um bloco próprio, visualmente menor.
  weight: 'primary' | 'secondary';
  title: Localized;
  items: Localized[];
};

export type ProcessStep = {
  n: string;
  title: Localized;
  description: Localized;
};

export type SkillGroup = {
  id: string;
  title: Localized;
  skills: string[];
};

export type EducationItem = {
  id: string;
  degree: Localized;
  institution: string;
  period: Localized;
  description: Localized;
};

export type ResearchItem = {
  id: string;
  title: Localized;
  institution: string;
  period: Localized;
  description: Localized;
  sourceUrl?: string;
};

export type ProjectCategory = 'ia' | 'fullstack' | 'landing';

export type Project = {
  id: string;
  category: ProjectCategory;
  title: Localized;
  description: Localized;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
  year: number;
};

export type ExperienceRole = {
  title: Localized;
  period: Localized;
  bullets: Localized[];
};

export type ExperienceItem = {
  id: string;
  organization: string;
  kind: 'employment' | 'research';
  period: Localized;
  current: boolean;
  roles: ExperienceRole[];
};
