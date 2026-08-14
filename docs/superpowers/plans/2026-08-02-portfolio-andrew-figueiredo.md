# Portfólio Andrew Figueiredo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a landing institucional da Sonhai por um portfólio pessoal bilíngue em Next.js, publicado em `andrewfigueiredo.dev` via GitHub Actions e GHCR.

**Architecture:** Next.js 15 App Router com `output: 'export'` — todo o site é HTML/CSS/JS estático gerado em build. Internacionalização por rotas (`/pt/`, `/en/`) usando dicionários tipados sem biblioteca, com `app/[lang]/layout.tsx` atuando como root layout. O GitHub Actions compila, empacota numa imagem Nginx e publica no GHCR; a VPS apenas baixa a imagem pronta.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui (`button`, `badge`), Framer Motion, lucide-react, Vitest, Docker, Nginx, Certbot, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`

## Global Constraints

- Tom sóbrio e técnico. Proibido: "apaixonado", "energia contagiante", "entusiasmado".
- Não inventar métricas. Onde faltar número, deixar `// TODO: adicionar métrica`.
- Nenhuma string hardcoded em componente. Texto de interface vem de `src/i18n/`; registros vêm de `src/data/`.
- `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }` — obrigatórios e interdependentes.
- Não existe `src/app/layout.tsx`. O root layout é `src/app/[lang]/layout.tsx`.
- Paleta: accent `#14395E`, fg `#0B1220`, muted `#5A6472`, bg `#FFFFFF`, bg-soft `#FAFAFA`, line `#E4E7EC`. Uma única cor de destaque, sem gradientes.
- Tipografia: Geist (headings), Inter (corpo), Geist Mono (rótulos e chips), todas via `next/font`.
- Bordas de 1px em vez de sombras pesadas. Sem cards flutuantes idênticos, sem emoji como ícone, sem barras de progresso percentuais.
- Mobile-first, validado em 375px, 768px e 1440px.
- `prefers-reduced-motion` respeitado via um único componente `<Reveal>`.
- Nenhum IP, usuário ou chave versionado.
- Datas de experiência (verificadas com o autor): ENACOM Jul/2021 – Out/2024; CODATA Nov/2024 – atual; Keep Chat Set/2025 – atual; UFPB Abr/2019 – Jan/2020.
- Não descrever o Keep Chat como projeto de segurança pública. Usar a descrição oficial do item 2.1 do edital.

## Desvios conscientes da spec

**Os três foram aprovados pelo autor em 2026-08-02 e já estão refletidos na spec.** Ficam
registrados aqui para que a razão de cada um continue legível depois.

1. **shadcn/ui não é instalado.** A spec previa `button` e `badge`. O site usa exatamente dois
   estilos de botão e um chip de texto, todos resolvidos com classes utilitárias em poucas
   linhas. Instalar shadcn traria `components.json`, `class-variance-authority` e o fluxo de
   `npx shadcn add` para gerar componentes que aqui seriam mais longos do que o markup direto.
   `clsx` e `tailwind-merge` entram assim mesmo, via `cn()`, caso a necessidade apareça depois.
2. **Vitest entra como camada mínima de verificação.** A spec não menciona testes. Foram
   incluídos apenas invariantes que o TypeScript não alcança (distribuição de projetos por
   categoria, contagem de destaques, quais vínculos são atuais) — nove asserções ao todo.
3. **Playwright entra como devDependency** para gerar a OG image a partir de um template HTML.
   A spec listava `og-image.png` como pendência de conteúdo, mas o metadata a referencia, e
   imagem referenciada e ausente é bug.

---

## Phase 0 — Migração e scaffold

### Task 1: Remover a Sonhai e criar o scaffold Next.js

**Files:**
- Delete: `index.html`
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/globals.css`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`, `.dockerignore`
- Preserve: `docs/`, `public/`, `README.md`, `CLAUDE.md`, `.gitignore`

**Interfaces:**
- Produces: projeto Next.js que builda para `out/` com `npm run build`.

- [ ] **Step 1: Fazer o scaffold num diretório temporário**

`create-next-app` recusa rodar num diretório que já tem conteúdo. Scaffold fora e mova o resultado para dentro, preservando o que já existe.

```bash
cd /tmp
npx create-next-app@latest andrew-scaffold \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --use-npm
```

- [ ] **Step 2: Mover os arquivos do scaffold para o repositório**

```bash
cd "/c/Users/Andrew/Documents/Projetos Pessoais/andrew-landing"
cp -r /tmp/andrew-scaffold/src ./
cp /tmp/andrew-scaffold/package.json /tmp/andrew-scaffold/tsconfig.json ./
cp /tmp/andrew-scaffold/next.config.ts /tmp/andrew-scaffold/postcss.config.mjs ./
cp /tmp/andrew-scaffold/eslint.config.mjs ./
cat /tmp/andrew-scaffold/.gitignore >> .gitignore
rm -rf /tmp/andrew-scaffold
git rm -q index.html
```

- [ ] **Step 3: Remover a estrutura padrão e criar a estrutura `[lang]`**

```bash
rm -f src/app/layout.tsx src/app/page.tsx src/app/favicon.ico
mkdir -p "src/app/[lang]"
```

- [ ] **Step 4: Escrever `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Site 100% estático: sem runtime Node em produção.
  output: 'export',
  // Gera out/pt/index.html. Sem isso o Nginx precisaria de regras de try_files
  // e /pt e /pt/ passariam a existir como conteúdo duplicado para o Google.
  trailingSlash: true,
  // Obrigatório com output: 'export' — não há servidor para otimizar sob demanda.
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 5: Escrever `src/app/[lang]/layout.tsx` mínimo**

Este arquivo é o root layout. Será expandido na Task 3.

```tsx
export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Escrever `src/app/[lang]/page.tsx` mínimo**

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <main>{lang}</main>;
}
```

- [ ] **Step 7: Criar `.dockerignore`**

```
node_modules
.next
out
.git
docs
.superpowers
*.md
```

- [ ] **Step 8: Instalar e buildar**

Run: `npm install && npm run build`
Expected: build conclui e cria `out/pt/index.html` e `out/en/index.html`.

- [ ] **Step 9: Verificar o output do export**

Run: `ls out/pt/index.html out/en/index.html`
Expected: os dois arquivos existem. Se falhar, `generateStaticParams` não está sendo aplicado.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js com export estatico e rotas por idioma"
```

---

## Phase 1 — Design system e i18n

### Task 2: Tokens de tema e tipografia

**Files:**
- Modify: `src/app/globals.css` (substituir todo o conteúdo)
- Modify: `src/app/[lang]/layout.tsx`

**Interfaces:**
- Produces: classes utilitárias `text-accent`, `bg-bg-soft`, `border-line`, `font-head`, `font-body`, `font-mono`; variáveis CSS `--font-geist`, `--font-inter`, `--font-geist-mono` no `<html>`.

- [ ] **Step 1: Escrever `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-accent: #14395E;
  --color-fg: #0B1220;
  --color-muted: #5A6472;
  --color-bg: #FFFFFF;
  --color-bg-soft: #FAFAFA;
  --color-line: #E4E7EC;

  --font-head: var(--font-geist), system-ui, sans-serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

/* Âncoras não podem parar embaixo da navbar fixa. */
:target {
  scroll-margin-top: 5rem;
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Carregar as fontes no layout**

Substitua `src/app/[lang]/layout.tsx`:

```tsx
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './../globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html
      lang={lang === 'en' ? 'en' : 'pt-BR'}
      className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Provar que os tokens funcionam**

Substitua o corpo de `src/app/[lang]/page.tsx`:

```tsx
export default async function Page() {
  return (
    <main className="p-8">
      <p className="font-mono text-accent text-xs uppercase tracking-widest">token check</p>
      <h1 className="font-head text-4xl font-bold tracking-tight">Andrew Figueiredo</h1>
      <div className="mt-4 border border-line bg-bg-soft p-4">borda e fundo</div>
    </main>
  );
}
```

- [ ] **Step 4: Verificar visualmente**

Run: `npm run dev` e abra `http://localhost:3000/pt/`
Expected: o rótulo aparece em azul `#14395E` e monoespaçado; o título em Geist; o bloco com borda cinza clara de 1px e fundo `#FAFAFA`. Se as fontes caírem para system-ui, as variáveis não chegaram ao `<html>`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tokens de tema e tipografia via next/font"
```

---

### Task 3: Dicionários tipados e metadata bilíngue

**Files:**
- Create: `src/i18n/pt.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- Modify: `src/app/[lang]/layout.tsx`

**Interfaces:**
- Produces:
  - `locales: readonly ['pt', 'en']`, `type Locale = 'pt' | 'en'`, `defaultLocale: Locale`
  - `type Dictionary = typeof pt`
  - `getDictionary(lang: Locale): Dictionary`
  - `isLocale(value: string): value is Locale`

- [ ] **Step 1: Escrever `src/i18n/pt.ts`**

`pt.ts` é a fonte da verdade da forma do dicionário. Só texto de interface — nada de conteúdo de currículo, que vive em `src/data/`.

```ts
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
  footer: {
    rights: 'Todos os direitos reservados.',
    source: 'Código deste site',
  },
} as const;

export type Dictionary = typeof pt;
```

- [ ] **Step 2: Escrever `src/i18n/en.ts`**

O tipo `Dictionary` obriga a paridade: chave faltando quebra o `tsc`.

```ts
import type { Dictionary } from './pt';

export const en: Dictionary = {
  nav: {
    about: 'About',
    services: 'Services',
    projects: 'Projects',
    process: 'How I work',
    skills: 'Skills',
    ai: 'AI',
    experience: 'Experience',
    contact: 'Contact',
    ariaMain: 'Main navigation',
    ariaLang: 'Switch language',
  },
  hero: {
    eyebrow: 'Systems Development Specialist · AI and Automation Consulting',
    headlineBefore: 'I build the system, embed ',
    headlineAccent: 'intelligence',
    headlineAfter: ' and automate the operation around it.',
    subheadline:
      '5+ years building and sustaining systems, from requirements to production. Software development, AI consulting and process automation.',
    ctaProjects: 'View projects',
    ctaCv: 'Download CV',
    actuationLabel: 'Experience at',
  },
  sections: {
    aboutTitle: 'About',
    servicesTitle: 'Services',
    projectsTitle: 'Projects',
    processTitle: 'How I work',
    skillsTitle: 'Skills',
    aiTitle: 'AI: education and research',
    experienceTitle: 'Experience',
    contactTitle: 'Contact',
  },
  projects: {
    filterAll: 'All',
    filterIa: 'AI',
    filterFullstack: 'Fullstack',
    filterLanding: 'Landing Pages',
    showAll: 'Show all',
    showLess: 'Show less',
    repo: 'Repository',
    demo: 'Demo',
    ariaFilter: 'Filter projects by category',
  },
  ai: {
    educationLabel: 'Education',
    researchLabel: 'Research',
    sourceLabel: 'Official source',
  },
  experience: {
    current: 'present',
    researchGrant: 'Research grant · 20h/week',
    employment: 'Employment',
  },
  contact: {
    intro: 'Available for consulting, projects and technical conversations.',
    email: 'Email',
  },
  footer: {
    rights: 'All rights reserved.',
    source: 'Source code',
  },
};
```

- [ ] **Step 3: Escrever `src/i18n/index.ts`**

```ts
import { pt, type Dictionary } from './pt';
import { en } from './en';

export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Provar que a paridade é verificada pelo compilador**

Remova temporariamente a linha `showAll: 'Show all',` de `src/i18n/en.ts`.

Run: `npx tsc --noEmit`
Expected: FALHA com "Property 'showAll' is missing in type". Restaure a linha e rode de novo — deve passar. Este passo existe para provar que a garantia é real, não teórica.

- [ ] **Step 5: Ligar metadata, hreflang e canonical no layout**

Substitua `src/app/[lang]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { locales, isLocale, defaultLocale, type Locale } from '@/i18n';
import './../globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const SITE = 'https://andrewfigueiredo.dev';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Com output: 'export', qualquer segmento fora de generateStaticParams não tem para onde
// ser resolvido em runtime. Fechar aqui transforma /fr/ em 404 no build, em vez de erro.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : defaultLocale;

  const copy = {
    pt: {
      title: 'Andrew Figueiredo — Desenvolvimento de Sistemas, IA e Automação',
      description:
        'Especialista em desenvolvimento de sistemas, consultoria em IA e automação de processos. +5 anos construindo e sustentando sistemas, do requisito à produção.',
    },
    en: {
      title: 'Andrew Figueiredo — Systems Development, AI and Automation',
      description:
        'Systems development specialist, AI consulting and process automation. 5+ years building and sustaining systems, from requirements to production.',
    },
  }[lang];

  return {
    metadataBase: new URL(SITE),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${SITE}/${lang}/`,
      languages: {
        'pt-BR': `${SITE}/pt/`,
        en: `${SITE}/en/`,
        'x-default': `${SITE}/pt/`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Andrew Figueiredo',
      locale: lang === 'en' ? 'en_US' : 'pt_BR',
      url: `${SITE}/${lang}/`,
      title: copy.title,
      description: copy.description,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Andrew Figueiredo' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html
      lang={lang === 'en' ? 'en' : 'pt-BR'}
      className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Verificar o HTML gerado**

Run: `npm run build && grep -c 'hreflang' out/en/index.html`
Expected: número maior que zero. Confirme também `grep 'canonical' out/en/index.html` apontando para `/en/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: dicionarios tipados PT/EN e metadata bilingue com hreflang"
```

---

### Task 4: Redirect de raiz, sitemap e robots

**Files:**
- Create: `public/index.html`, `public/sitemap.xml`, `public/robots.txt`

**Interfaces:**
- Produces: `out/index.html` que resolve a raiz para `/pt/` ou `/en/` conforme `localStorage.lang`.

Com `output: 'export'` não há middleware. Sitemap e robots são estáticos e ficam em `public/` — para duas URLs, gerar via `app/sitemap.ts` só adicionaria risco.

- [ ] **Step 1: Escrever `public/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Andrew Figueiredo</title>
<link rel="canonical" href="https://andrewfigueiredo.dev/pt/">
<meta name="robots" content="noindex">
<script>
  // Única finalidade do localStorage no site: lembrar o idioma na entrada pela raiz.
  // O toggle da navbar é um <Link> real e troca a URL; ele nunca depende disto.
  (function () {
    var lang = 'pt';
    try {
      if (localStorage.getItem('lang') === 'en') lang = 'en';
    } catch (e) {
      // localStorage bloqueado (modo privado, cookies desativados): segue no padrão.
    }
    location.replace('/' + lang + '/');
  })();
</script>
<noscript><meta http-equiv="refresh" content="0;url=/pt/"></noscript>
</head>
<body>
<p>Redirecionando para <a href="/pt/">andrewfigueiredo.dev/pt/</a>.</p>
</body>
</html>
```

- [ ] **Step 2: Escrever `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://andrewfigueiredo.dev/pt/</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://andrewfigueiredo.dev/pt/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://andrewfigueiredo.dev/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://andrewfigueiredo.dev/pt/"/>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://andrewfigueiredo.dev/en/</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://andrewfigueiredo.dev/pt/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://andrewfigueiredo.dev/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://andrewfigueiredo.dev/pt/"/>
    <priority>0.9</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Escrever `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://andrewfigueiredo.dev/sitemap.xml
```

- [ ] **Step 4: Verificar que os estáticos chegam ao export**

Run: `npm run build && ls out/index.html out/sitemap.xml out/robots.txt`
Expected: os três existem. `out/index.html` não pode ter sido sobrescrito pelo Next.js — confirme com `grep -q localStorage out/index.html && echo OK`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: redirect de raiz por preferencia de idioma, sitemap e robots"
```

---

## Phase 2 — Camada de dados

### Task 5: Tipos e dados de perfil, serviços, processo, skills e formação

**Files:**
- Create: `src/data/types.ts`, `src/data/profile.ts`, `src/data/services.ts`, `src/data/process.ts`, `src/data/skills.ts`, `src/data/education.ts`

**Interfaces:**
- Produces:
  - `type Localized = { pt: string; en: string }`
  - `profile: { name; title: Localized; email; github; linkedin; cvPath; photoPath; actuation: string[] }`
  - `services: Service[]` com `Service = { id; icon; title: Localized; items: Localized[] }`
  - `processSteps: ProcessStep[]` com `ProcessStep = { n; title: Localized; description: Localized }`
  - `skillGroups: SkillGroup[]` com `SkillGroup = { id; title: Localized; skills: string[] }`
  - `education: EducationItem[]`, `research: ResearchItem[]`

- [ ] **Step 1: Escrever `src/data/types.ts`**

```ts
export type Localized = { pt: string; en: string };

export type Service = {
  id: 'dev' | 'ai' | 'automation';
  icon: 'Code2' | 'BrainCircuit' | 'Workflow';
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
```

- [ ] **Step 2: Escrever `src/data/profile.ts`**

```ts
export const profile = {
  name: 'Andrew Figueiredo',
  email: 'andrewdw18@gmail.com',
  github: 'https://github.com/Andrew-Figueiredo',
  linkedin: 'https://www.linkedin.com/in/andrew-figueiredo/',
  repoUrl: 'https://github.com/Andrew-Figueiredo/andrew-landing',
  cvPath: '/cv-andrew-figueiredo.pdf',
  photoPath: '/andrew-figueiredo.jpg',
  // Prova verificável que já existe. Listado como atuação profissional, não como cliente.
  actuation: ['CODATA', 'ENACOM', 'FAPESQ'],
} as const;
```

- [ ] **Step 3: Escrever `src/data/services.ts`**

```ts
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
      { pt: 'Diagnóstico de oportunidades de IA em processos existentes', en: 'Assessment of AI opportunities in existing processes' },
      { pt: 'Integração de LLMs em produtos e fluxos de trabalho', en: 'LLM integration into products and workflows' },
      { pt: 'Desenvolvimento e treinamento de modelos de machine learning sob medida', en: 'Development and training of custom machine learning models' },
      { pt: 'Modelagem preditiva e análise avançada de dados', en: 'Predictive modeling and advanced data analysis' },
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
```

- [ ] **Step 4: Escrever `src/data/process.ts`**

```ts
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
```

- [ ] **Step 5: Escrever `src/data/skills.ts`**

A ordem comunica o posicionamento e não deve ser alterada.

```ts
import type { SkillGroup } from './types';

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
      'LLMs', 'Treinamento de modelos', 'ML supervisionado', 'ML não supervisionado',
      'Redes neurais', 'Classificação', 'Regressão', 'Árvores de decisão',
      'scikit-learn', 'PySpark', 'MLOps', 'Avaliação de modelos', 'Jupyter', 'Python', 'R',
    ],
  },
  {
    id: 'automation',
    title: { pt: 'Automação & Bots', en: 'Automation & Bots' },
    skills: ['n8n', 'Chatbots WhatsApp', 'Chatbots Telegram', 'Power Automate', 'Integrações entre sistemas', 'RPA'],
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
    id: 'quality',
    title: { pt: 'Qualidade & Engenharia de Testes', en: 'Quality & Test Engineering' },
    skills: [
      'Playwright', 'Pytest', 'Pytest-BDD', 'Cypress', 'Selenium',
      'Azure DevOps', 'SonarQube', 'BDD', 'Testes de API', 'Testes de performance',
    ],
  },
  {
    id: 'methods',
    title: { pt: 'Metodologias', en: 'Methodologies' },
    skills: ['SCRUM', 'Ágil', 'Design Patterns', 'Clean Code'],
  },
];
```

- [ ] **Step 6: Escrever `src/data/education.ts`**

```ts
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
```

- [ ] **Step 7: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: dados de perfil, servicos, processo, skills e formacao"
```

---

### Task 6: Experiência, projetos e invariantes de dados

**Files:**
- Create: `src/data/experience.ts`, `src/data/projects.ts`, `src/data/data.test.ts`, `vitest.config.ts`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Consumes: tipos de `src/data/types.ts`.
- Produces: `experience: ExperienceItem[]`, `projects: Project[]`, script `npm test`.

- [ ] **Step 1: Escrever `src/data/experience.ts`**

Ordem cronológica reversa. ENACOM é um bloco único com progressão interna: três blocos soltos leem como rotatividade, agrupados leem como crescimento.

```ts
import type { ExperienceItem } from './types';

export const experience: ExperienceItem[] = [
  {
    id: 'keepchat',
    organization: 'FAPESQ / SECTIES-PB',
    kind: 'research',
    period: { pt: 'Set/2025 – atual', en: 'Sep/2025 – present' },
    current: true,
    roles: [
      {
        title: { pt: 'Pesquisador — Analista de TI | Projeto Keep Chat', en: 'Researcher — IT Analyst | Keep Chat Project' },
        period: { pt: 'Set/2025 – atual', en: 'Sep/2025 – present' },
        bullets: [
          {
            pt: 'Pesquisa aplicada em ferramentas de IA generativa dentro de projeto com fomento público estadual',
            en: 'Applied research on generative AI tools within a state-funded public project',
          },
        ],
      },
    ],
  },
  {
    id: 'codata',
    organization: 'CODATA — Companhia de Dados da Paraíba',
    kind: 'employment',
    period: { pt: 'Nov/2024 – atual', en: 'Nov/2024 – present' },
    current: true,
    roles: [
      {
        title: { pt: 'Analista de TI — Desenvolvimento e Qualidade', en: 'IT Analyst — Development and Quality' },
        period: { pt: 'Nov/2024 – atual', en: 'Nov/2024 – present' },
        bullets: [
          { pt: 'Desenvolvimento de suítes de automação em Python com Playwright e Pytest', en: 'Built Python automation suites with Playwright and Pytest' },
          { pt: 'Implementação de BDD com Pytest-BDD e integração de relatórios ao pipeline', en: 'Implemented BDD with Pytest-BDD and wired reporting into the pipeline' },
          { pt: 'Análise de qualidade de código com SonarQube', en: 'Code quality analysis with SonarQube' },
          { pt: 'Construção de dashboards de acompanhamento técnico', en: 'Built technical tracking dashboards' },
          { pt: 'Testes de desempenho e análise de gargalos de aplicação', en: 'Performance testing and application bottleneck analysis' },
        ],
      },
    ],
  },
  {
    id: 'enacom',
    organization: 'ENACOM',
    kind: 'employment',
    period: { pt: 'Jul/2021 – Out/2024', en: 'Jul/2021 – Oct/2024' },
    current: false,
    roles: [
      {
        title: { pt: 'Analista de Qualidade de Software V — Líder Técnico', en: 'Software Quality Analyst V — Technical Lead' },
        period: { pt: 'Fev/2023 – Out/2024', en: 'Feb/2023 – Oct/2024' },
        bullets: [
          { pt: 'Liderança técnica de equipe, definindo padrões de código e processo', en: 'Technical leadership of the team, defining code and process standards' },
          { pt: 'Desenvolvimento de automações em Python para otimização de fluxos', en: 'Built Python automations to streamline workflows' },
          { pt: 'Administração de pipeline e TestPlan em Azure DevOps', en: 'Pipeline and TestPlan administration in Azure DevOps' },
          { pt: 'Atuação junto ao cliente na operação assistida do sistema', en: 'Worked alongside the client during assisted system operation' },
        ],
      },
      {
        title: { pt: 'Analista de Qualidade de Software III', en: 'Software Quality Analyst III' },
        period: { pt: 'Out/2022 – Fev/2023', en: 'Oct/2022 – Feb/2023' },
        bullets: [
          { pt: 'Desenvolvimento de automações web com padrão Page Object', en: 'Built web automations using the Page Object pattern' },
          { pt: 'Automação de processos com Power Automate', en: 'Process automation with Power Automate' },
        ],
      },
      {
        title: { pt: 'Analista de Qualidade de Software I / Estágio', en: 'Software Quality Analyst I / Internship' },
        period: { pt: 'Jul/2021 – Out/2022', en: 'Jul/2021 – Oct/2022' },
        bullets: [
          { pt: 'Automação em Cypress (JavaScript) com Page Objects', en: 'Cypress (JavaScript) automation with Page Objects' },
          { pt: 'Testes e integração de APIs REST', en: 'REST API testing and integration' },
          { pt: 'Manipulação de bases MongoDB', en: 'MongoDB database handling' },
        ],
      },
    ],
  },
  {
    id: 'ufpb',
    organization: 'UFPB',
    kind: 'employment',
    period: { pt: 'Abr/2019 – Jan/2020', en: 'Apr/2019 – Jan/2020' },
    current: false,
    roles: [
      {
        title: { pt: 'Desenvolvedor Mobile', en: 'Mobile Developer' },
        period: { pt: 'Abr/2019 – Jan/2020', en: 'Apr/2019 – Jan/2020' },
        bullets: [
          { pt: 'Desenvolvimento de aplicação mobile em React Native', en: 'Built a mobile application in React Native' },
          { pt: 'Prototipação em Figma', en: 'Prototyping in Figma' },
        ],
      },
    ],
  },
];
```

- [ ] **Step 2: Escrever `src/data/projects.ts` com o seed**

Nove entradas com textos de tamanho realista, para o layout ser validado antes dos dados reais. A descrição diz **qual problema foi resolvido**, não o que foi construído.

```ts
import type { Project } from './types';

// TODO: substituir as nove entradas por projetos reais.
// Regra de redação: descreva o problema resolvido, não o artefato.
// Fraco: "Chatbot WhatsApp". Forte: "Chatbot que qualifica leads e agenda atendimentos".
export const projects: Project[] = [
  {
    id: 'ia-1',
    category: 'ia',
    title: { pt: 'Classificador de chamados de suporte', en: 'Support ticket classifier' },
    description: {
      pt: 'Roteia tickets por categoria e urgência automaticamente, eliminando a triagem manual da equipe de atendimento.',
      en: 'Routes tickets by category and urgency automatically, removing manual triage from the support team.',
    },
    stack: ['Python', 'scikit-learn', 'FastAPI'],
    featured: true,
    year: 2025,
  },
  {
    id: 'ia-2',
    category: 'ia',
    title: { pt: 'Assistente de consulta a documentos internos', en: 'Internal document assistant' },
    description: {
      pt: 'Responde perguntas sobre normas e procedimentos internos citando a fonte, reduzindo a dependência de especialistas.',
      en: 'Answers questions about internal policies citing the source, reducing dependency on specialists.',
    },
    stack: ['Python', 'LLM', 'PostgreSQL'],
    featured: true,
    year: 2025,
  },
  {
    id: 'fs-1',
    category: 'fullstack',
    title: { pt: 'Painel de acompanhamento técnico', en: 'Technical tracking dashboard' },
    description: {
      pt: 'Consolida indicadores de qualidade que antes viviam em planilhas dispersas, dando visibilidade única ao time.',
      en: 'Consolidates quality indicators previously scattered across spreadsheets into a single view for the team.',
    },
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    featured: true,
    year: 2025,
  },
  {
    id: 'fs-2',
    category: 'fullstack',
    title: { pt: 'Integração entre sistemas legados', en: 'Legacy system integration' },
    description: {
      pt: 'Sincroniza cadastros entre dois sistemas que não conversavam, acabando com a redigitação diária de dados.',
      en: 'Syncs records between two systems that could not talk to each other, ending daily manual re-entry.',
    },
    stack: ['Node.js', 'APIs REST', 'Docker'],
    featured: true,
    year: 2024,
  },
  {
    id: 'fs-3',
    category: 'fullstack',
    title: { pt: 'Aplicação de gestão de atendimentos', en: 'Service management application' },
    description: {
      pt: 'Substitui controle em planilha por fluxo com histórico e responsáveis, tornando auditável o que antes se perdia.',
      en: 'Replaces spreadsheet control with a tracked flow with history and owners, making auditable what used to be lost.',
    },
    stack: ['React', 'Node.js', 'MongoDB'],
    featured: true,
    year: 2024,
  },
  {
    id: 'fs-4',
    category: 'fullstack',
    title: { pt: 'API de consolidação de dados', en: 'Data consolidation API' },
    description: {
      pt: 'Expõe num contrato único dados que estavam presos em três bases distintas, simplificando as integrações seguintes.',
      en: 'Exposes through a single contract data locked in three separate databases, simplifying downstream integrations.',
    },
    stack: ['Python', 'FastAPI', 'PostgreSQL'],
    featured: true,
    year: 2024,
  },
  {
    id: 'lp-1',
    category: 'landing',
    title: { pt: 'Landing page institucional', en: 'Corporate landing page' },
    description: {
      pt: 'Página de apresentação que converte visitante em contato qualificado, com carregamento sob um segundo.',
      en: 'Presentation page turning visitors into qualified contacts, loading in under a second.',
    },
    stack: ['Next.js', 'Tailwind CSS'],
    featured: false,
    year: 2025,
  },
  {
    id: 'lp-2',
    category: 'landing',
    title: { pt: 'Página de captura para campanha', en: 'Campaign capture page' },
    description: {
      pt: 'Concentra o tráfego de campanha num fluxo único de contato, tornando mensurável o retorno do investimento.',
      en: 'Concentrates campaign traffic into a single contact flow, making return on investment measurable.',
    },
    stack: ['Next.js', 'Tailwind CSS'],
    featured: false,
    year: 2024,
  },
  {
    id: 'lp-3',
    category: 'landing',
    title: { pt: 'Site de apresentação de serviços', en: 'Services presentation site' },
    description: {
      pt: 'Organiza a oferta de serviços de forma escaneável, reduzindo as perguntas repetidas no primeiro contato.',
      en: 'Organizes the service offering in a scannable way, cutting repeated questions on first contact.',
    },
    stack: ['Next.js', 'TypeScript'],
    featured: false,
    year: 2024,
  },
];
```

- [ ] **Step 3: Instalar Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 4: Criar `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```

- [ ] **Step 5: Adicionar o script `test` ao `package.json`**

Dentro de `"scripts"`, acrescente:

```json
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 6: Escrever o teste de invariantes que deve falhar**

Estes testes protegem regras que o TypeScript não alcança: contagem por categoria, unicidade de id, e a regra de que link ausente nunca vira botão morto.

```ts
import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { experience } from './experience';

describe('projects', () => {
  it('mantém a distribuição prevista de 2 IA, 4 fullstack e 3 landing', () => {
    const count = (c: string) => projects.filter((p) => p.category === c).length;
    expect(count('ia')).toBe(2);
    expect(count('fullstack')).toBe(4);
    expect(count('landing')).toBe(3);
  });

  it('tem exatamente 6 projetos em destaque', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(6);
  });

  it('não repete id', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nunca guarda link vazio, que viraria botão morto', () => {
    for (const p of projects) {
      expect(p.repoUrl ?? 'ok').not.toBe('');
      expect(p.demoUrl ?? 'ok').not.toBe('');
    }
  });

  it('preenche os dois idiomas em título e descrição', () => {
    for (const p of projects) {
      expect(p.title.pt.length).toBeGreaterThan(0);
      expect(p.title.en.length).toBeGreaterThan(0);
      expect(p.description.pt.length).toBeGreaterThan(0);
      expect(p.description.en.length).toBeGreaterThan(0);
    }
  });
});

describe('experience', () => {
  it('marca como atuais apenas CODATA e Keep Chat', () => {
    const current = experience.filter((e) => e.current).map((e) => e.id).sort();
    expect(current).toEqual(['codata', 'keepchat']);
  });

  it('agrupa os três cargos da ENACOM num bloco só', () => {
    const enacom = experience.find((e) => e.id === 'enacom');
    expect(enacom?.roles).toHaveLength(3);
  });

  it('não deixa nenhum item sem bullets', () => {
    for (const item of experience) {
      for (const role of item.roles) {
        expect(role.bullets.length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 7: Rodar os testes**

Run: `npm test`
Expected: PASS em todos. Se "marca como atuais apenas CODATA e Keep Chat" falhar, as datas de experiência foram alteradas — confira contra as Global Constraints antes de mudar o teste.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: dados de experiencia e projetos com invariantes em vitest"
```

---

## Phase 3 — Componentes e seções

### Task 7: Chrome do site — Reveal, Navbar, LanguageToggle e Footer

**Files:**
- Create: `src/lib/utils.ts`, `src/components/Reveal.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/LanguageToggle.tsx`, `src/components/layout/Footer.tsx`
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `getDictionary`, `Locale` de `@/i18n`; `profile` de `@/data/profile`.
- Produces:
  - `<Reveal delay?: number>` — wrapper de animação, único `'use client'` de motion
  - `<Navbar lang: Locale>`, `<Footer lang: Locale>`
  - `cn(...classes)` em `src/lib/utils.ts`

- [ ] **Step 1: Instalar dependências**

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

- [ ] **Step 2: Escrever `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Escrever `src/components/Reveal.tsx`**

Único componente de animação. Concentrar aqui mantém todas as seções como Server Components.

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Escrever `src/components/layout/LanguageToggle.tsx`**

O toggle é um `<Link>` real: troca a rota, não o estado. O `localStorage` só grava a preferência para a próxima entrada pela raiz.

```tsx
'use client';

import Link from 'next/link';
import type { Locale } from '@/i18n';

export function LanguageToggle({ lang, label }: { lang: Locale; label: string }) {
  const other: Locale = lang === 'pt' ? 'en' : 'pt';

  return (
    <Link
      href={`/${other}/`}
      aria-label={label}
      onClick={() => {
        try {
          localStorage.setItem('lang', other);
        } catch {
          // localStorage indisponível: a navegação acontece do mesmo jeito.
        }
      }}
      className="font-mono text-xs rounded border border-line px-2 py-1 text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className={lang === 'pt' ? 'text-accent' : undefined}>PT</span>
      <span aria-hidden> / </span>
      <span className={lang === 'en' ? 'text-accent' : undefined}>EN</span>
    </Link>
  );
}
```

- [ ] **Step 5: Escrever `src/components/layout/Navbar.tsx`**

```tsx
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { LanguageToggle } from './LanguageToggle';

export function Navbar({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const anchors = [
    { href: '#sobre', label: t.nav.about },
    { href: '#servicos', label: t.nav.services },
    { href: '#projetos', label: t.nav.projects },
    { href: '#ia', label: t.nav.ai },
    { href: '#experiencia', label: t.nav.experience },
    { href: '#contato', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href={`/${lang}/`} className="font-head text-sm font-semibold tracking-tight">
          {profile.name}
        </Link>

        <nav aria-label={t.nav.ariaMain} className="hidden gap-5 text-sm text-muted md:flex">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="transition-colors hover:text-accent">
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted transition-colors hover:text-accent">
            <Github size={18} aria-hidden />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted transition-colors hover:text-accent">
            <Linkedin size={18} aria-hidden />
          </a>
          <LanguageToggle lang={lang} label={t.nav.ariaLang} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Escrever `src/components/layout/Footer.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. {t.footer.rights}
        </p>
        <a href={profile.repoUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
          {t.footer.source}
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Compor a página**

```tsx
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Navbar lang={lang} />
      <main />
      <Footer lang={lang} />
    </>
  );
}
```

- [ ] **Step 8: Verificar navegação entre idiomas**

Run: `npm run dev`, abra `http://localhost:3000/pt/`, clique no toggle.
Expected: navega para `/en/`, os rótulos da nav mudam para inglês, `PT` deixa de estar em azul e `EN` assume. O ano no rodapé é o corrente.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: navbar, footer, toggle de idioma e wrapper de animacao"
```

---

### Task 8: Hero

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `getDictionary`, `profile`, `services`, `<Reveal>`.
- Produces: `<Hero lang: Locale>`.

O hero é tipográfico e de largura total, sem foto. As três frentes ganham descrição real — é a articulação delas que diferencia o posicionamento, não uma faixa espremida.

- [ ] **Step 1: Escrever `src/components/sections/Hero.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import { Reveal } from '@/components/Reveal';

export function Hero({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <Reveal>
        <p className="mb-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.09em] text-accent">
          <span aria-hidden className="inline-block h-px w-7 bg-accent" />
          {t.hero.eyebrow}
        </p>

        <h1 className="font-head max-w-[20ch] text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
          {t.hero.headlineBefore}
          <span className="text-accent">{t.hero.headlineAccent}</span>
          {t.hero.headlineAfter}
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">
          {t.hero.subheadline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a href="#projetos" className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            {t.hero.ctaProjects}
          </a>
          <a href={profile.cvPath} download className="rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent">
            {t.hero.ctaCv}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent">
            LinkedIn ↗
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent">
            GitHub ↗
          </a>
        </div>

        <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.09em] text-muted">
          {t.hero.actuationLabel}: {profile.actuation.join(' · ')}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 grid gap-px border-t border-line sm:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.id} className={i > 0 ? 'pt-5 sm:border-l sm:border-line sm:pl-5' : 'pt-5 sm:pr-5'}>
              <p className="font-mono text-[0.65rem] text-accent">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="font-head mt-1 text-sm font-semibold">{s.title[lang]}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {s.items.slice(0, 2).map((it) => it[lang]).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Montar na página**

Em `src/app/[lang]/page.tsx`, importe `Hero` e substitua `<main />` por:

```tsx
      <main>
        <Hero lang={lang} />
      </main>
```

- [ ] **Step 3: Verificar em três larguras**

Run: `npm run dev` e inspecione `http://localhost:3000/pt/` em 375px, 768px e 1440px.
Expected: em 375px as três frentes empilham e nada corta; em 1440px a headline não passa de ~20 caracteres por linha; os separadores verticais entre frentes só aparecem a partir de `sm`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: hero tipografico com as tres frentes e linha de atuacao"
```

---

### Task 9: Sobre e Serviços

**Files:**
- Create: `src/components/sections/About.tsx`, `src/components/sections/Services.tsx`, `src/components/SectionHeading.tsx`
- Modify: `src/i18n/pt.ts`, `src/i18n/en.ts` (parágrafos do Sobre), `src/app/[lang]/page.tsx`

**Interfaces:**
- Produces: `<SectionHeading id, label>`, `<About lang>`, `<Services lang>`.
- Consumes: `t.about.paragraphs` (adicionado nesta task).

- [ ] **Step 1: Adicionar os parágrafos do Sobre em `src/i18n/pt.ts`**

Acrescente antes de `sections:`:

```ts
  about: {
    paragraphs: [
      'Entrei na engenharia de software pelo lado da qualidade e da automação, e isso me deu uma leitura completa de como um sistema é construído, onde ele quebra e o que é preciso para sustentá-lo em produção.',
      'Hoje desenvolvo aplicações web, integro soluções de IA e automatizo processos. São três camadas do mesmo trabalho: construir o sistema, colocar inteligência dentro dele e automatizar a operação em volta.',
      'Tenho base em Matemática Computacional, formação em Ciência de Dados e mestrado em Tecnologia da Informação com pesquisa em IA aplicada à Engenharia de Software.',
    ],
    photoAlt: 'Andrew Figueiredo',
  },
```

- [ ] **Step 2: Adicionar a tradução em `src/i18n/en.ts`**

```ts
  about: {
    paragraphs: [
      'I came into software engineering through quality and automation, which gave me a complete reading of how a system is built, where it breaks and what it takes to keep it running in production.',
      'Today I build web applications, integrate AI solutions and automate processes. These are three layers of the same work: building the system, embedding intelligence in it and automating the operation around it.',
      'My background is in Computational Mathematics, with a degree in Data Science and a master’s in Information Technology researching AI applied to Software Engineering.',
    ],
    photoAlt: 'Andrew Figueiredo',
  },
```

- [ ] **Step 3: Verificar a paridade**

Run: `npm run typecheck`
Expected: sem erros. Erro aqui significa que as duas chaves não têm a mesma forma.

- [ ] **Step 4: Escrever `src/components/SectionHeading.tsx`**

```tsx
export function SectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h2 id={id} className="font-mono mb-8 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent">
      <span aria-hidden className="inline-block h-px w-7 bg-accent" />
      {label}
    </h2>
  );
}
```

- [ ] **Step 5: Escrever `src/components/sections/About.tsx`**

A foto vive aqui, em tamanho médio ao lado do texto — onde apoia a leitura em vez de disputar espaço com a headline.

```tsx
import Image from 'next/image';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function About({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="sobre" label={t.sections.aboutTitle} />
          <div className="grid gap-8 sm:grid-cols-[180px_1fr]">
            <Image
              src={profile.photoPath}
              alt={t.about.photoAlt}
              width={180}
              height={216}
              className="h-[216px] w-[180px] rounded-lg border border-line object-cover"
              style={{ objectPosition: 'center 20%' }}
              priority={false}
            />
            <div className="space-y-4">
              {t.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-[62ch] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Escrever `src/components/sections/Services.tsx`**

```tsx
import { BrainCircuit, Code2, Workflow } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { services } from '@/data/services';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const icons = { Code2, BrainCircuit, Workflow } as const;

export function Services({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="servicos" label={t.sections.servicesTitle} />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="border-t border-line pt-5">
                  <Icon size={20} className="text-accent" aria-hidden />
                  <h3 className="font-head mt-3 text-base font-semibold">{s.title[lang]}</h3>
                  <ul className="mt-3 space-y-2">
                    {s.items.map((item) => (
                      <li key={item.en} className="text-sm leading-relaxed text-muted">
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Montar na página**

Adicione `<About lang={lang} />` e `<Services lang={lang} />` dentro de `<main>`, depois de `<Hero />`.

- [ ] **Step 8: Verificar**

Run: `npm run build && npm run dev`
Expected: a âncora `#sobre` para abaixo da navbar, sem texto escondido; a foto carrega em 180×216 sem distorção; a alternância de fundo funciona (Sobre em `#FAFAFA`, Serviços em branco).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: secoes sobre e servicos"
```

---

### Task 10: Projetos com filtro por categoria

**Files:**
- Create: `src/components/sections/Projects.tsx`, `src/components/ProjectCard.tsx`
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `projects`, `Project`, `ProjectCategory`, `Dictionary`.
- Produces: `<Projects lang>`, `<ProjectCard project, lang, labels>`.

O filtro exige estado, então esta seção é `'use client'`. O card é tipográfico: nunca depende de imagem, e link ausente significa botão ausente.

- [ ] **Step 1: Escrever `src/components/ProjectCard.tsx`**

```tsx
import type { Locale } from '@/i18n';
import type { Project } from '@/data/types';

export function ProjectCard({
  project,
  lang,
  labels,
}: {
  project: Project;
  lang: Locale;
  labels: { repo: string; demo: string; category: string };
}) {
  return (
    <article className="flex h-full flex-col border border-line p-5 transition-colors hover:border-accent">
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt="" className="mb-4 h-36 w-full rounded object-cover" />
      ) : null}

      <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-wider">
        <span className="text-accent">{labels.category}</span>
        <span className="text-muted">{project.year}</span>
      </div>

      <h3 className="font-head mt-3 text-base font-semibold">{project.title[lang]}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description[lang]}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li key={tech} className="font-mono rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-muted">
            {tech}
          </li>
        ))}
      </ul>

      {(project.repoUrl || project.demoUrl) && (
        <div className="mt-4 flex gap-4 text-sm font-medium">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {labels.repo} ↗
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {labels.demo} ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Escrever `src/components/sections/Projects.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getDictionary, type Locale } from '@/i18n';
import { projects } from '@/data/projects';
import type { ProjectCategory } from '@/data/types';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';

type Filter = 'all' | ProjectCategory;
const ORDER: ProjectCategory[] = ['ia', 'fullstack', 'landing'];

export function Projects({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);

  const categoryLabel: Record<ProjectCategory, string> = {
    ia: t.projects.filterIa,
    fullstack: t.projects.filterFullstack,
    landing: t.projects.filterLanding,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.projects.filterAll },
    { key: 'ia', label: t.projects.filterIa },
    { key: 'fullstack', label: t.projects.filterFullstack },
    { key: 'landing', label: t.projects.filterLanding },
  ];

  const sorted = [...projects].sort(
    (a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || b.year - a.year,
  );
  const byFilter = filter === 'all' ? sorted : sorted.filter((p) => p.category === filter);
  const visible = expanded ? byFilter : byFilter.slice(0, 6);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading id="projetos" label={t.sections.projectsTitle} />

        <div role="group" aria-label={t.projects.ariaFilter} className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => {
                setFilter(f.key);
                setExpanded(false);
              }}
              className={
                filter === f.key
                  ? 'rounded-md border border-accent bg-accent px-3 py-1.5 text-sm font-medium text-white'
                  : 'rounded-md border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent'
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard
                  project={p}
                  lang={lang}
                  labels={{ repo: t.projects.repo, demo: t.projects.demo, category: categoryLabel[p.category] }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {byFilter.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-8 rounded-md border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {expanded ? t.projects.showLess : t.projects.showAll}
          </button>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Montar na página**

Adicione `<Projects lang={lang} />` depois de `<Services />`.

- [ ] **Step 4: Verificar comportamento do filtro**

Run: `npm run dev`
Expected: "Todos" mostra 6 cards e o botão "Ver todos" aparece (há 9); clicar em "IA" mostra 2 e o botão some; a ordem padrão é IA → Fullstack → Landing; nenhum card mostra botão de repositório ou demo, porque o seed não tem links.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: secao de projetos com filtro por categoria"
```

---

### Task 11: Como eu trabalho e Skills

**Files:**
- Create: `src/components/sections/Process.tsx`, `src/components/sections/Skills.tsx`
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `processSteps`, `skillGroups`.
- Produces: `<Process lang>`, `<Skills lang>`.

- [ ] **Step 1: Escrever `src/components/sections/Process.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { processSteps } from '@/data/process';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Process({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="processo" label={t.sections.processTitle} />
        </Reveal>
        <ol className="grid gap-px sm:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li className="h-full border-t border-line pt-4 sm:pr-4">
                <span className="font-mono text-[0.65rem] text-accent">{step.n}</span>
                <h3 className="font-head mt-1 text-sm font-semibold leading-snug">{step.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description[lang]}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Escrever `src/components/sections/Skills.tsx`**

Sem barras de progresso percentuais. Layout escaneável, agrupado, com a ordem preservada.

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { skillGroups } from '@/data/skills';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Skills({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="skills" label={t.sections.skillsTitle} />
        </Reveal>
        <div className="space-y-6">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={Math.min(i, 4) * 0.05}>
              <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[220px_1fr]">
                <h3 className="font-head text-sm font-semibold">{group.title[lang]}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <li key={skill} className="font-mono rounded border border-line bg-bg px-2 py-0.5 text-xs text-muted">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Montar na página**

Adicione `<Process lang={lang} />` e `<Skills lang={lang} />` depois de `<Projects />`.

- [ ] **Step 4: Verificar**

Run: `npm run dev`
Expected: em 375px as cinco etapas do processo empilham legíveis; em Skills o título do grupo fica acima da lista no mobile e ao lado a partir de `sm`; a ordem dos oito grupos é a definida em `skills.ts`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: secoes como eu trabalho e skills"
```

---

### Task 12: IA (formação e pesquisa) e Experiência

**Files:**
- Create: `src/components/sections/AiResearch.tsx`, `src/components/sections/Experience.tsx`
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `education`, `research`, `experience`.
- Produces: `<AiResearch lang>`, `<Experience lang>`.

O Keep Chat aparece nas duas seções com recortes deliberadamente distintos: aqui o **conteúdo da pesquisa**, na timeline o **vínculo e as datas**. Não repetir o mesmo texto.

- [ ] **Step 1: Escrever `src/components/sections/AiResearch.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { education, research } from '@/data/education';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function AiResearch({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="ia" label={t.sections.aiTitle} />
        </Reveal>

        <Reveal>
          <p className="font-mono mb-4 text-[0.65rem] uppercase tracking-wider text-muted">
            {t.ai.researchLabel}
          </p>
          {research.map((item) => (
            <div key={item.id} className="mb-10 border-l-2 border-accent pl-5">
              <h3 className="font-head text-base font-semibold">
                {item.title[lang]} <span className="text-muted">· {item.institution}</span>
              </h3>
              <p className="font-mono mt-1 text-xs text-muted">{item.period[lang]}</p>
              <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">{item.description[lang]}</p>
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                  {t.ai.sourceLabel} ↗
                </a>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.08}>
          <p className="font-mono mb-4 text-[0.65rem] uppercase tracking-wider text-muted">
            {t.ai.educationLabel}
          </p>
          <div className="space-y-6">
            {education.map((item) => (
              <div key={item.id} className="border-t border-line pt-4">
                <h3 className="font-head text-sm font-semibold">
                  {item.degree[lang]} <span className="text-muted">· {item.institution}</span>
                </h3>
                <p className="font-mono mt-1 text-xs text-muted">{item.period[lang]}</p>
                <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted">{item.description[lang]}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Escrever `src/components/sections/Experience.tsx`**

CODATA e Keep Chat são simultâneos. O rótulo de natureza (`employment` vs `research`) existe para que a sobreposição de datas leia como acúmulo legítimo, não como inconsistência de currículo.

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { experience } from '@/data/experience';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Experience({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="experiencia" label={t.sections.experienceTitle} />
        </Reveal>

        <div className="space-y-10">
          {experience.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 3) * 0.06}>
              <div className="border-l border-line pl-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-head text-base font-semibold">{item.organization}</h3>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                    {item.kind === 'research' ? t.experience.researchGrant : t.experience.employment}
                  </span>
                  <span className="font-mono text-xs text-muted">{item.period[lang]}</span>
                </div>

                <div className="mt-4 space-y-5">
                  {item.roles.map((role) => (
                    <div key={role.title.en}>
                      <p className="text-sm font-semibold">{role.title[lang]}</p>
                      <p className="font-mono mt-0.5 text-xs text-muted">{role.period[lang]}</p>
                      <ul className="mt-2 space-y-1.5">
                        {role.bullets.map((b) => (
                          <li key={b.en} className="max-w-[68ch] text-sm leading-relaxed text-muted before:mr-2 before:text-accent before:content-['—']">
                            {b[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Montar na página**

Adicione `<AiResearch lang={lang} />` e `<Experience lang={lang} />` depois de `<Skills />`.

- [ ] **Step 4: Verificar**

Run: `npm run dev`
Expected: a ENACOM aparece como um bloco com três cargos aninhados, não como três entradas; CODATA e Keep Chat exibem rótulos distintos de natureza do vínculo; o link "Fonte oficial" do Keep Chat abre o edital da FAPESQ.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: secoes de IA (formacao e pesquisa) e experiencia"
```

---

### Task 13: Contato e OG image

**Files:**
- Create: `src/components/sections/Contact.tsx`, `scripts/og-template.html`, `scripts/make-og-image.mjs`, `public/og-image.png`
- Modify: `src/app/[lang]/page.tsx`, `package.json`

**Interfaces:**
- Produces: `<Contact lang>`, `public/og-image.png` (1200×630), script `npm run og`.

Sem formulário: `mailto:`, LinkedIn e GitHub. A OG image é gerada de um template HTML via Playwright — a mesma ferramenta que já está no seu dia a dia.

- [ ] **Step 1: Escrever `src/components/sections/Contact.tsx`**

```tsx
import { Github, Linkedin, Mail } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Contact({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const links = [
    { href: `mailto:${profile.email}`, icon: Mail, label: t.contact.email, value: profile.email, external: false },
    { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn', value: 'andrew-figueiredo', external: true },
    { href: profile.github, icon: Github, label: 'GitHub', value: 'Andrew-Figueiredo', external: true },
  ];

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="contato" label={t.sections.contactTitle} />
          <p className="mb-8 max-w-[52ch] text-base text-muted">{t.contact.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {links.map(({ href, icon: Icon, label, value, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3 border border-line p-4 transition-colors hover:border-accent"
                >
                  <Icon size={18} className="text-accent" aria-hidden />
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-sm text-muted">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Escrever `scripts/og-template.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 90px; background: #FFFFFF; color: #0B1220;
    font-family: 'Geist', system-ui, sans-serif;
  }
  .eyebrow {
    font-family: 'Geist Mono', monospace; font-size: 20px;
    letter-spacing: .09em; text-transform: uppercase; color: #14395E;
    display: flex; align-items: center; gap: 16px; margin-bottom: 36px;
  }
  .eyebrow::before { content: ''; width: 56px; height: 2px; background: #14395E; }
  h1 { font-size: 66px; font-weight: 700; letter-spacing: -.028em; line-height: 1.05; max-width: 17ch; }
  h1 span { color: #14395E; }
  p { margin-top: 28px; font-size: 26px; color: #5A6472; max-width: 40ch; }
  .foot {
    margin-top: 48px; padding-top: 26px; border-top: 1px solid #E4E7EC;
    font-family: 'Geist Mono', monospace; font-size: 19px; color: #5A6472;
  }
</style>
</head>
<body>
  <div class="eyebrow">Especialista em Desenvolvimento de Sistemas</div>
  <h1>Construo o sistema, integro <span>inteligência</span> e automatizo a operação.</h1>
  <p>Desenvolvimento de software, consultoria em IA e automação de processos.</p>
  <div class="foot">Andrew Figueiredo · andrewfigueiredo.dev</div>
</body>
</html>
```

- [ ] **Step 3: Escrever `scripts/make-og-image.mjs`**

```js
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, 'og-template.html');
const output = path.join(here, '..', 'public', 'og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${template}`);
// Sem isto a captura pode sair com a fonte de fallback.
await page.waitForLoadState('networkidle');
await page.screenshot({ path: output });
await browser.close();

console.log(`OG image gerada em ${output}`);
```

- [ ] **Step 4: Instalar o Playwright e adicionar o script**

```bash
npm install -D playwright
npx playwright install chromium
```

Em `"scripts"` do `package.json`, acrescente:

```json
"og": "node scripts/make-og-image.mjs"
```

- [ ] **Step 5: Gerar a imagem**

Run: `npm run og`
Expected: cria `public/og-image.png`. Abra o arquivo e confirme 1200×630, texto em Geist (não em fonte de fallback) e o azul `#14395E` no rótulo e na palavra destacada.

- [ ] **Step 6: Montar na página e verificar o site completo**

Adicione `<Contact lang={lang} />` como última seção dentro de `<main>`.

Run: `npm run typecheck && npm test && npm run build`
Expected: os três passam. Confirme `ls -la out/og-image.png`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: secao de contato e geracao da og-image"
```

---

## Phase 4 — Containerização

### Task 14: Dockerfile e configuração do Nginx

**Files:**
- Create: `Dockerfile`, `nginx/nginx.conf`

**Interfaces:**
- Produces: imagem que serve o site estático na porta 80, com `/` resolvendo idioma e `www` redirecionando para o apex.

- [ ] **Step 1: Escrever o `Dockerfile`**

```dockerfile
# ---- build ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Pré-comprime para o gzip_static: o Nginx serve o .gz pronto, sem gastar CPU por request.
# Escrito como laço com redirecionamento porque o gzip do BusyBox (Alpine) não tem -k
# de forma confiável entre versões.
RUN find out -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \) \
      -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

# ---- runtime ----
FROM nginx:1.27-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
```

- [ ] **Step 2: Escrever `nginx/nginx.conf`**

```nginx
# --- HTTP: desafio ACME e redirect para HTTPS ---
server {
    listen 80;
    server_name andrewfigueiredo.dev www.andrewfigueiredo.dev;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://andrewfigueiredo.dev$request_uri;
    }
}

# --- HTTPS www -> apex ---
server {
    listen 443 ssl;
    http2 on;
    server_name www.andrewfigueiredo.dev;

    ssl_certificate     /etc/letsencrypt/live/andrewfigueiredo.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/andrewfigueiredo.dev/privkey.pem;

    return 301 https://andrewfigueiredo.dev$request_uri;
}

# --- HTTPS apex: serve o site ---
server {
    listen 443 ssl;
    http2 on;
    server_name andrewfigueiredo.dev;

    ssl_certificate     /etc/letsencrypt/live/andrewfigueiredo.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/andrewfigueiredo.dev/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    gzip_static on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # 'unsafe-inline' em script-src é exigido pelos scripts de hidratação que o Next.js
    # injeta no export. Endurecer por hash exige regerar a política a cada build.
    # next/font serve as fontes do próprio domínio, então não é preciso liberar o Google Fonts.
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; frame-ancestors 'none'" always;

    # Assets com hash no nome: nunca mudam de conteúdo.
    location /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # HTML precisa refletir o deploy mais recente.
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

- [ ] **Step 3: Buildar a imagem localmente**

Run: `docker build -t andrew-landing:test .`
Expected: build conclui sem erro.

- [ ] **Step 4: Verificar o conteúdo da imagem**

O Nginx ainda não sobe sem certificado, então valide os arquivos direto na imagem:

```bash
docker run --rm andrew-landing:test ls /usr/share/nginx/html
docker run --rm andrew-landing:test ls /usr/share/nginx/html/pt/index.html.gz
```

Expected: a listagem mostra `index.html`, `pt/`, `en/`, `og-image.png`, `sitemap.xml`, `robots.txt`; o `.gz` do PT existe, provando que a pré-compressão rodou.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: dockerfile multi-stage e configuracao do nginx"
```

---

### Task 15: docker-compose, Certbot e emissão inicial

**Files:**
- Create: `docker-compose.yml`, `scripts/init-letsencrypt.sh`, `.env.example`

**Interfaces:**
- Produces: stack de dois serviços (`web`, `certbot`) com renovação automática.

- [ ] **Step 1: Escrever `docker-compose.yml`**

```yaml
services:
  web:
    image: ${IMAGE:-ghcr.io/andrew-figueiredo/andrew-landing:latest}
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - certbot-etc:/etc/letsencrypt:ro
      - certbot-www:/var/www/certbot:ro
    # Recarrega o Nginx periodicamente para adotar certificado renovado sem downtime.
    command: >-
      /bin/sh -c "while :; do sleep 12h & wait $${!}; nginx -s reload; done & nginx -g 'daemon off;'"

  certbot:
    image: certbot/certbot:latest
    restart: unless-stopped
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    entrypoint: >-
      /bin/sh -c "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h & wait $${!}; done"

volumes:
  certbot-etc:
  certbot-www:
```

- [ ] **Step 2: Escrever `.env.example`**

```
# Imagem publicada pelo GitHub Actions no GHCR.
IMAGE=ghcr.io/andrew-figueiredo/andrew-landing:latest
```

- [ ] **Step 3: Escrever `scripts/init-letsencrypt.sh`**

```bash
#!/usr/bin/env bash
# Emissão inicial do certificado. Rodar UMA vez na VPS, antes do primeiro up definitivo.
# A renovação depois é automática, pelo container certbot.
set -euo pipefail

DOMAIN="andrewfigueiredo.dev"
EMAIL="andrewdw18@gmail.com"
STAGING="${STAGING:-1}"   # 1 = ambiente de teste do Let's Encrypt (padrão, evita rate limit)

if [ "$STAGING" = "1" ]; then
  STAGING_FLAG="--staging"
  echo ">> Modo STAGING. Confirme que funciona, depois rode: STAGING=0 $0"
else
  STAGING_FLAG=""
  echo ">> Modo PRODUÇÃO. O Let's Encrypt limita cinco falhas por hora por domínio."
fi

# O Nginx não sobe sem certificado, e o certificado não é emitido sem o Nginx no ar.
# Um certificado autoassinado temporário quebra esse impasse.
docker compose run --rm --entrypoint "\
  sh -c 'mkdir -p /etc/letsencrypt/live/$DOMAIN && \
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
      -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
      -subj /CN=localhost'" certbot

docker compose up -d web
sleep 5

# Remove o temporário e emite o real via desafio webroot.
docker compose run --rm --entrypoint "rm -rf /etc/letsencrypt/live/$DOMAIN /etc/letsencrypt/archive/$DOMAIN /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_FLAG \
    --email $EMAIL \
    -d $DOMAIN -d www.$DOMAIN \
    --rsa-key-size 2048 \
    --agree-tos \
    --non-interactive" certbot

docker compose up -d
echo ">> Certificado emitido. Verifique: curl -I https://$DOMAIN"
```

- [ ] **Step 4: Tornar o script executável**

```bash
chmod +x scripts/init-letsencrypt.sh
git update-index --chmod=+x scripts/init-letsencrypt.sh
```

- [ ] **Step 5: Validar a sintaxe do compose**

Run: `docker compose config`
Expected: imprime a configuração resolvida sem erro. Erro aqui significa YAML inválido ou variável mal referenciada.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: docker-compose com certbot e script de emissao inicial"
```

---

## Phase 5 — CI/CD e documentação

### Task 16: Workflow do GitHub Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`, `VPS_APP_PATH`.
- Produces: imagem em `ghcr.io/<owner>/andrew-landing:latest` e deploy na VPS.

O Job 1 **não** roda `npm run build` — o build acontece uma única vez, dentro da imagem no Job 2. Duplicá-lo anularia a razão de ter tirado a compilação da VPS.

- [ ] **Step 1: Escrever `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  IMAGE: ghcr.io/${{ github.repository_owner }}/andrew-landing

jobs:
  ci:
    name: Lint, typecheck e testes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  build:
    name: Build e push da imagem
    needs: ci
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ${{ env.IMAGE }}:latest
            ${{ env.IMAGE }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy na VPS
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Pull da imagem e restart na VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            set -e
            cd ${{ secrets.VPS_APP_PATH }}
            docker compose pull
            docker compose up -d
            docker image prune -f

      - name: Health check
        run: |
          for i in 1 2 3 4 5; do
            if curl -fsS -o /dev/null https://andrewfigueiredo.dev/pt/; then
              echo "Site respondendo."
              exit 0
            fi
            echo "Tentativa $i falhou; aguardando o container subir."
            sleep 10
          done
          echo "Health check falhou após 5 tentativas."
          exit 1
```

- [ ] **Step 2: Verificar a sintaxe do workflow localmente**

Run: `npx --yes yaml-lint .github/workflows/deploy.yml 2>/dev/null || node -e "require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); console.log('arquivo legível')"`
Expected: sem erro de parsing. A validação real acontece no primeiro push.

- [ ] **Step 3: Confirmar que os scripts referenciados existem**

Run: `node -e "const s=require('./package.json').scripts; ['lint','typecheck','test','build'].forEach(k=>{if(!s[k])throw new Error('faltando script: '+k)}); console.log('todos os scripts existem')"`
Expected: "todos os scripts existem". Este passo evita o modo de falha mais comum: workflow chamando script inexistente.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: workflow de build no GHCR e deploy por ssh"
```

---

### Task 17: README e reescrita do CLAUDE.md

**Files:**
- Modify: `README.md` (substituir todo o conteúdo), `CLAUDE.md` (substituir todo o conteúdo)

O `CLAUDE.md` atual documenta a landing da Sonhai, que deixou de existir no repositório na Task 1.

- [ ] **Step 1: Escrever o `README.md`**

````markdown
# andrewfigueiredo.dev

Portfólio pessoal de Andrew Figueiredo — desenvolvimento de sistemas, consultoria em IA e
automação. Site estático bilíngue (PT-BR / EN) em Next.js, servido por Nginx em container.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000/pt/
```

Outros comandos:

```bash
npm run build      # gera o site estático em out/
npm run typecheck  # tsc --noEmit (garante paridade dos dicionários PT/EN)
npm test           # invariantes dos dados
npm run lint
npm run og         # regera public/og-image.png
```

## Onde editar conteúdo

| O que | Onde |
|---|---|
| Texto de interface (nav, botões, títulos) | `src/i18n/pt.ts` e `src/i18n/en.ts` |
| Perfil, e-mail, links, caminho do CV | `src/data/profile.ts` |
| Serviços | `src/data/services.ts` |
| Etapas de "Como eu trabalho" | `src/data/process.ts` |
| Skills | `src/data/skills.ts` |
| Formação e pesquisa | `src/data/education.ts` |
| Experiência | `src/data/experience.ts` |
| Projetos | `src/data/projects.ts` |

`pt.ts` define a forma do dicionário; `en.ts` é tipado como `Dictionary`. Chave faltando no
inglês quebra o `npm run typecheck` — a paridade é garantida pelo compilador.

Campos que variam por idioma dentro de `src/data/` usam `{ pt, en }` no próprio registro.

## Por que `output: 'export'`

O site não tem backend, banco, formulário com submit nem conteúdo que mude em runtime — tudo
é conhecido em build time. Com export estático, o Nginx serve arquivos direto: não há processo
Node em produção para monitorar, reiniciar ou atualizar por segurança.

O custo é que `middleware.ts` não existe. Duas consequências no projeto: o redirect da raiz é
feito por `public/index.html` (que lê a preferência de idioma do `localStorage`), e
`next/image` roda com `unoptimized: true`, com as imagens dimensionadas antes do commit.

`trailingSlash: true` é obrigatório: o export gera `out/pt/index.html`, e sem ele `/pt` e
`/pt/` passariam a existir como conteúdo duplicado.

## DNS

Dois registros A apontando para o IP da VPS:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | IP da VPS |
| A | `www` | IP da VPS |

Confirme a propagação antes de emitir o certificado, senão o desafio ACME falha:

```bash
dig +short andrewfigueiredo.dev
dig +short www.andrewfigueiredo.dev
```

## Preparar a VPS

```bash
# Docker e Docker Compose
curl -fsSL https://get.docker.com | sh

# Usuário de deploy sem sudo para o Docker
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy

# Chave SSH: gere localmente e instale a pública na VPS
# ssh-keygen -t ed25519 -C "deploy@andrewfigueiredo.dev" -f ~/.ssh/andrew_deploy
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy tee -a /home/deploy/.ssh/authorized_keys < /dev/null
sudo chmod 700 /home/deploy/.ssh && sudo chmod 600 /home/deploy/.ssh/authorized_keys

# Firewall
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
```

Na VPS, crie o diretório da aplicação. O código-fonte nunca vai para lá — só três arquivos,
porque a configuração do Nginx viaja dentro da imagem:

```bash
mkdir -p /home/deploy/andrew-landing/scripts && cd /home/deploy/andrew-landing
# Copie do repositório (scp ou colando o conteúdo):
#   docker-compose.yml
#   .env.example
#   scripts/init-letsencrypt.sh
cp .env.example .env
chmod +x scripts/init-letsencrypt.sh
```

## Certificado TLS

```bash
cd /home/deploy/andrew-landing
./scripts/init-letsencrypt.sh              # staging: valida o fluxo sem gastar rate limit
STAGING=0 ./scripts/init-letsencrypt.sh    # produção
```

Verifique a renovação automática:

```bash
docker compose run --rm certbot certbot renew --dry-run
docker compose logs certbot --tail 30
```

O container `certbot` tenta renovar a cada 12h e o `web` recarrega o Nginx no mesmo intervalo,
adotando o certificado novo sem downtime.

## Deploy

O GitHub Actions faz todo o trabalho; a VPS só baixa a imagem pronta.

```
git push origin main
  └─ Job 1  npm ci · lint · typecheck · test
     Job 2  docker build (npm run build roda aqui) → push no GHCR
     Job 3  ssh na VPS → docker compose pull && up -d → prune → health check
```

Secrets em **Settings › Secrets and variables › Actions**:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | conteúdo da chave **privada** |
| `VPS_PORT` | `22` |
| `VPS_APP_PATH` | `/home/deploy/andrew-landing` |

O pacote no GHCR é público, então a VPS baixa sem autenticação. Se for tornado privado, ela
passa a exigir `docker login ghcr.io` com um token de leitura.

Dispare manualmente em **Actions › Deploy › Run workflow**.

## Histórico

Este repositório hospedou antes a landing institucional da Sonhai. O conteúdo está preservado
no commit `74d877a`.
````

- [ ] **Step 2: Reescrever o `CLAUDE.md`**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Portfólio pessoal de Andrew Figueiredo em `andrewfigueiredo.dev`. Next.js 15 (App Router) +
TypeScript + Tailwind v4, bilíngue PT/EN, exportado como site estático e servido por Nginx
em container. Sem backend, banco ou formulário com submit.

Spec de design: `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`.

## Comandos

```bash
npm run dev        # http://localhost:3000/pt/
npm run build      # gera out/
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm test -- -t "nome do teste"   # um teste específico
npm run lint
npm run og         # regera public/og-image.png
```

## Arquitetura

**Não existe `src/app/layout.tsx`.** Todas as rotas ficam sob `src/app/[lang]/`, e o layout
desse segmento atua como root layout — é o que permite `<html lang>` correto por idioma.
`generateStaticParams` emite `pt` e `en`.

**`output: 'export'` restringe o que é possível.** Sem middleware, sem rotas dinâmicas de
servidor, sem otimização de imagem em runtime. `trailingSlash: true` e
`images.unoptimized: true` são interdependentes com ele; mudar um quebra o deploy.

**O redirect da raiz é `public/index.html`**, escrito à mão. É o único ponto do site que usa
`localStorage`. O toggle de idioma na navbar é um `<Link>` real que troca a rota.

**Animação vive só em `src/components/Reveal.tsx`.** É o único componente de motion marcado
`'use client'` — as seções permanecem Server Components. `Projects.tsx` também é client, por
causa do estado do filtro. Não espalhe `'use client'` além desses dois.

## Convenções

**Fronteira `i18n/` vs `data/`.** `src/i18n/` guarda texto de interface (nav, botões, títulos
de seção). `src/data/` guarda registros, e campos que variam por idioma usam `{ pt, en }`
dentro do próprio registro. Nenhuma string hardcoded em componente.

**Paridade PT/EN é garantida pelo compilador.** `pt.ts` define `Dictionary` via `typeof`;
`en.ts` é tipado com ele. Chave faltando quebra `npm run typecheck`, não o runtime.

**Tokens de tema** ficam em `@theme` dentro de `src/app/globals.css`. Use as utilitárias
(`text-accent`, `bg-bg-soft`, `border-line`, `font-head`, `font-mono`). Nunca hardcode cor
ou fonte num componente.

**Tom do conteúdo:** sóbrio e técnico. Proibido "apaixonado", "energia contagiante",
"entusiasmado". Não inventar métricas — onde faltar número, deixar `// TODO: adicionar métrica`.

**Descrição de projeto diz qual problema foi resolvido**, não o que foi construído.

**Invariantes de dados** estão em `src/data/data.test.ts`: distribuição por categoria, contagem
de destaques, unicidade de id, e quais vínculos são atuais. Se um teste desses falhar depois de
editar dados, confira a spec antes de alterar o teste.

## Pendências de conteúdo

Ver seção 14 da spec. Os nove projetos em `src/data/projects.ts` são seed marcado
`// TODO: substituir`.
```

- [ ] **Step 3: Verificação final completa**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: os quatro passam sem erro.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: readme de operacao e CLAUDE.md do projeto Next.js"
```

---

## Verificação manual antes do primeiro deploy

Estes itens não são automatizáveis e valem uma passada antes de apontar o DNS.

- [ ] Lighthouse ≥ 95 em Performance, Accessibility, Best Practices e SEO, em `/pt/` e `/en/`
- [ ] Navegação completa por teclado: `Tab` alcança todos os links e botões de filtro, com foco visível
- [ ] Contraste AA: `#5A6472` sobre `#FAFAFA` e `#14395E` sobre `#FFFFFF`
- [ ] Layout íntegro em 375px, 768px e 1440px
- [ ] `prefers-reduced-motion: reduce` ativo elimina as animações de entrada e o layout do filtro
- [ ] Preview de Open Graph em `https://www.opengraph.xyz/url/https%3A%2F%2Fandrewfigueiredo.dev`
- [ ] `/pt/` e `/en/` com `hreflang` recíproco e `canonical` correto
- [ ] `curl -I https://andrewfigueiredo.dev` retorna HSTS e as demais headers de segurança
- [ ] `curl -I https://www.andrewfigueiredo.dev` retorna 301 para o apex
