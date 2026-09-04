export type Localized = { pt: string; en: string };

export type AreaId = 'fullstack' | 'ia-automacao' | 'qa';

export type Service = {
  id: 'dev' | 'ai' | 'automation' | 'quality';
  icon: 'Code2' | 'BrainCircuit' | 'Workflow' | 'ShieldCheck';
  area: AreaId;
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
  area?: AreaId;
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

export type ProjectCategory = 'ia' | 'fullstack' | 'landing' | 'qa';

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
