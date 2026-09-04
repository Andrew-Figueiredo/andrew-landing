# Portfólio por área — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a home do portfólio num seletor de área (Fullstack / IA e Automação /
QA), com cada área ganhando sua própria rota estática (`/[lang]/[area]/`) que reaproveita as
seções existentes filtradas para aquela área.

**Architecture:** Um registro novo `src/data/areas.ts` define as 3 áreas (id, slug bilíngue,
label, hero copy) e duas funções puras de mapeamento (`categoriesForArea`, `areaBySlug`/
`areaById`). `Service` e `SkillGroup` ganham um campo `area` (substituindo `weight` em
`Service`). A rota `/[lang]/page.tsx` vira o seletor; uma rota nova `/[lang]/[area]/page.tsx`
(com `generateStaticParams` aninhado, `dynamicParams=false`, export estático preservado) monta
a página de área reaproveitando `Hero`/`Services`/`Skills`/`Projects` agora cientes de `area`, e
`Navbar`/`LanguageToggle` agora cientes de `area` para trocar de área/idioma sem perder o
contexto.

**Tech Stack:** Next.js 15.5 (App Router, `output: 'export'`), TypeScript, Tailwind v4,
Vitest (testes de dados em `src/data/*.test.ts`, `environment: 'node'` — não há testes de
componente React neste projeto, então tarefas de componente são verificadas por
`npm run typecheck` + `npm run build` + checagem manual no browser, não por teste automatizado).

**Spec:** [docs/superpowers/specs/2026-09-02-portfolio-por-area-design.md](../specs/2026-09-02-portfolio-por-area-design.md)

## Global Constraints

- `output: 'export'` continua obrigatório — sem SSR, sem rota dinâmica de servidor. Qualquer
  segmento fora de `generateStaticParams` deve virar 404 em build (`dynamicParams = false`).
- `trailingSlash: true` e `images.unoptimized: true` não mudam.
- Paridade PT/EN é garantida pelo compilador: `pt.ts` não usa `as const`, `en.ts` é tipado como
  `Dictionary = typeof pt`. Toda chave nova entra nos dois arquivos.
- Nenhuma string hardcoded em componente — texto de UI vem de `t = getDictionary(lang)`, texto
  de registro (nome de área, copy de hero por área) vem de `src/data/`.
- Cor e fonte só via utilitárias de tema (`text-accent`, `bg-bg-soft`, `border-line`,
  `font-head`, `font-mono`) — nunca hardcoded no componente.
- Tom do conteúdo: sóbrio e técnico. Sem "apaixonado"/"contagiante"/hype. Sem métrica
  inventada.
- `src/i18n/` só guarda texto de interface; `src/data/` guarda registros. Área é registro →
  vive em `src/data/areas.ts`, não em `pt.ts`/`en.ts`.

---

## Task 1: `src/data/areas.ts` — registro de áreas + helpers

**Files:**
- Create: `src/data/areas.ts`
- Create: `src/data/areas.test.ts`
- Modify: `src/data/types.ts:1-12` (adiciona `AreaId` antes de `Service`, sem tocar em `Service`
  ainda — isso é puramente aditivo, `Service.weight` continua existindo até a Task 2)

**Interfaces:**
- Produces: `AreaId = 'fullstack' | 'ia-automacao' | 'qa'` (em `types.ts`), `Area` type,
  `areas: Area[]`, `areaBySlug(lang: Locale, slug: string): Area | undefined`,
  `areaById(id: AreaId): Area`, `categoriesForArea(area: AreaId): ProjectCategory[]` (todos em
  `areas.ts`).

- [ ] **Step 1: Adicionar `AreaId` em `types.ts`**

Em `src/data/types.ts`, logo após `export type Localized = { pt: string; en: string };`,
adicionar:

```ts
export type AreaId = 'fullstack' | 'ia-automacao' | 'qa';
```

- [ ] **Step 2: Rodar typecheck pra confirmar que a adição não quebra nada**

Run: `npm run typecheck`
Expected: PASS (mudança é puramente aditiva)

- [ ] **Step 3: Escrever `src/data/areas.test.ts` (falha primeiro — `areas.ts` ainda não existe)**

```ts
import { describe, expect, it } from 'vitest';
import { areas, areaBySlug, areaById, categoriesForArea } from './areas';

describe('areas', () => {
  it('tem as 3 áreas na ordem fullstack, ia-automacao, qa', () => {
    expect(areas.map((a) => a.id)).toEqual(['fullstack', 'ia-automacao', 'qa']);
  });

  it('cada área tem slug distinto em pt e distinto em en', () => {
    const ptSlugs = areas.map((a) => a.slug.pt);
    const enSlugs = areas.map((a) => a.slug.en);
    expect(new Set(ptSlugs).size).toBe(areas.length);
    expect(new Set(enSlugs).size).toBe(areas.length);
  });

  it('preenche os dois idiomas em label e em todo texto de hero', () => {
    for (const area of areas) {
      expect(area.label.pt.length).toBeGreaterThan(0);
      expect(area.label.en.length).toBeGreaterThan(0);
      for (const key of Object.keys(area.hero) as (keyof typeof area.hero)[]) {
        expect(area.hero[key].pt.length).toBeGreaterThan(0);
        expect(area.hero[key].en.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('areaBySlug', () => {
  it('resolve a área certa a partir do slug em cada idioma', () => {
    expect(areaBySlug('pt', 'ia-automacao')?.id).toBe('ia-automacao');
    expect(areaBySlug('en', 'ai-automation')?.id).toBe('ia-automacao');
  });

  it('retorna undefined pra slug inexistente', () => {
    expect(areaBySlug('pt', 'nao-existe')).toBeUndefined();
  });
});

describe('areaById', () => {
  it('resolve a área certa a partir do id', () => {
    expect(areaById('qa').slug.pt).toBe('qa');
  });
});

describe('categoriesForArea', () => {
  it('mapeia fullstack pra fullstack e landing', () => {
    expect(categoriesForArea('fullstack')).toEqual(['fullstack', 'landing']);
  });

  it('mapeia ia-automacao só pra ia', () => {
    expect(categoriesForArea('ia-automacao')).toEqual(['ia']);
  });

  it('mapeia qa só pra qa', () => {
    expect(categoriesForArea('qa')).toEqual(['qa']);
  });
});
```

- [ ] **Step 4: Rodar o teste e confirmar que falha (módulo não existe)**

Run: `npm test -- areas`
Expected: FAIL com erro de import/módulo `./areas` não encontrado

- [ ] **Step 5: Criar `src/data/areas.ts`**

```ts
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
```

- [ ] **Step 6: Rodar o teste de novo e confirmar que passa**

Run: `npm test -- areas`
Expected: PASS (todos os `it` de `areas.test.ts`)

- [ ] **Step 7: Typecheck do projeto inteiro**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/data/types.ts src/data/areas.ts src/data/areas.test.ts
git commit -m "feat: registro de areas do portfolio (fullstack/ia-automacao/qa)"
```

---

## Task 2: Migrar modelo de dados — `Service.area`, `SkillGroup.area`, categoria `qa`

**Files:**
- Modify: `src/data/types.ts` (Service perde `weight`, ganha `area`; SkillGroup ganha `area?`;
  ProjectCategory ganha `'qa'`)
- Modify: `src/data/services.ts` (4 entradas trocam `weight` por `area`)
- Modify: `src/data/skills.ts` (8 grupos: 5 ganham `area`, 3 continuam sem)
- Modify: `src/data/projects.ts` (2 entradas novas, categoria `'qa'`)
- Modify: `src/data/data.test.ts` (remove testes de `weight`/posicionamento, adiciona testes de
  área válida e distribuição de `qa`)

**Interfaces:**
- Consumes: `AreaId`, `Area`, `areas` (Task 1)
- Produces: `Service.area: AreaId`, `SkillGroup.area?: AreaId`,
  `ProjectCategory = 'ia' | 'fullstack' | 'landing' | 'qa'` — usados pelas Tasks 3-8.

- [ ] **Step 1: Reescrever `data.test.ts` primeiro (vai falhar — campos novos não existem
  ainda)**

Substituir o arquivo inteiro `src/data/data.test.ts` por:

```ts
import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { experience } from './experience';
import { services } from './services';
import { skillGroups } from './skills';
import { areas } from './areas';

describe('áreas', () => {
  const areaIds = areas.map((a) => a.id);

  it('todo Service e todo SkillGroup com área usam uma área válida', () => {
    for (const s of services) {
      expect(areaIds).toContain(s.area);
    }
    for (const g of skillGroups) {
      if (g.area !== undefined) {
        expect(areaIds).toContain(g.area);
      }
    }
  });

  it('toda área tem pelo menos um Service', () => {
    for (const id of areaIds) {
      expect(services.some((s) => s.area === id)).toBe(true);
    }
  });
});

describe('projects', () => {
  it('mantém a distribuição prevista de 2 IA, 4 fullstack e 3 landing, com QA aditivo', () => {
    const count = (c: string) => projects.filter((p) => p.category === c).length;
    expect(count('ia')).toBe(2);
    expect(count('fullstack')).toBe(4);
    expect(count('landing')).toBe(3);
    expect(count('qa')).toBeGreaterThanOrEqual(2);
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
    const current = experience
      .filter((e) => e.current)
      .map((e) => e.id)
      .sort();
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

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm test`
Expected: FAIL — `count('qa')` é 0 (menor que 2), e possivelmente erro de tipo em `services`/
`skillGroups` porque `s.area`/`g.area` ainda não existem nos dados (undefined não está em
`areaIds`, então o primeiro teste de `áreas` também falha)

- [ ] **Step 3: Atualizar `Service` e `SkillGroup` em `types.ts`**

Em `src/data/types.ts`, substituir o bloco de `Service` (que hoje tem o comentário sobre
`weight` e o campo `weight: 'primary' | 'secondary'`) por:

```ts
export type Service = {
  id: 'dev' | 'ai' | 'automation' | 'quality';
  icon: 'Code2' | 'BrainCircuit' | 'Workflow' | 'ShieldCheck';
  area: AreaId;
  title: Localized;
  items: Localized[];
};
```

Em `SkillGroup`, adicionar `area?: AreaId;` logo após `id: string;`:

```ts
export type SkillGroup = {
  id: string;
  area?: AreaId;
  title: Localized;
  skills: string[];
};
```

Em `ProjectCategory`, adicionar `'qa'`:

```ts
export type ProjectCategory = 'ia' | 'fullstack' | 'landing' | 'qa';
```

- [ ] **Step 4: Atualizar `services.ts`**

Substituir `weight: 'primary'` por `area: 'fullstack'` na entrada `dev`; por
`area: 'ia-automacao'` nas entradas `ai` e `automation`; substituir o bloco `weight:
'secondary'` (com o comentário "Peso deliberadamente menor...") na entrada `quality` por
`area: 'qa'` (removendo o comentário, que descrevia uma regra que não existe mais — QA tem
página própria agora).

- [ ] **Step 5: Atualizar `skills.ts`**

Adicionar `area: 'fullstack'` aos grupos `web` e `backend`; `area: 'ia-automacao'` aos grupos
`ai` e `automation`; `area: 'qa'` ao grupo `quality`. Grupos `data`, `infra`, `methods` ficam
sem `area`. Atualizar o comentário no topo do arquivo (linhas 3-6), que hoje descreve a regra
de ordenação "frentes antes da qualidade, qualidade antes do apoio" — trocar por:

```ts
// A ordem ainda comunica posicionamento: grupos com `area` vêm antes dos três últimos
// (data/infra/methods), que são apoio e aparecem em toda página de área.
```

- [ ] **Step 6: Adicionar as 2 entradas de categoria `qa` em `projects.ts`**

Adicionar ao final do array `projects`, antes do `];` de fechamento:

```ts
  {
    id: 'qa-1',
    category: 'qa',
    title: {
      pt: 'Suíte de testes com IA, pipeline e relatório de qualidade',
      en: 'AI-built test suite, pipeline and quality report',
    },
    description: {
      pt: 'Testes automatizados gerados com IA (Claude Code e Codex), rodando em pipeline de CI/CD com publicação de relatório Allure, eliminando a validação manual repetitiva a cada entrega.',
      en: 'Automated tests generated with AI (Claude Code and Codex), running in a CI/CD pipeline with Allure report publishing, removing repetitive manual validation on every release.',
    },
    stack: ['Playwright', 'GitHub Actions', 'Allure Report'],
    featured: false,
    year: 2026,
  },
  {
    id: 'qa-2',
    category: 'qa',
    title: {
      pt: 'Testes manuais e relatórios de qualidade',
      en: 'Manual testing and quality reports',
    },
    description: {
      pt: 'Roteiros de teste manual e relatórios de execução para cenários que a automação ainda não cobre, mantendo rastreabilidade do que foi validado antes de cada release.',
      en: "Manual test scripts and execution reports for scenarios automation doesn't yet cover, keeping traceability of what was validated before each release.",
    },
    stack: ['Azure DevOps', 'Documentação de testes'],
    featured: false,
    year: 2026,
  },
```

- [ ] **Step 7: Rodar os testes de novo e confirmar que passam**

Run: `npm test`
Expected: PASS — todos os testes em `data.test.ts` e `areas.test.ts`

- [ ] **Step 8: Typecheck do projeto inteiro**

Run: `npm run typecheck`
Expected: FAIL — os componentes que ainda leem `s.weight` (`Hero.tsx`, `Services.tsx`) e a
mecânica de posicionamento antiga vão quebrar. Isso é esperado: eles são corrigidos nas Tasks
5-6. Anotar os erros reportados (devem apontar exatamente `Hero.tsx` e `Services.tsx`) e seguir
para o commit desta task mesmo assim — os componentes ficam pendentes de correção nas próximas
tasks, que são o próximo passo imediato do plano.

- [ ] **Step 9: Commit**

```bash
git add src/data/types.ts src/data/services.ts src/data/skills.ts src/data/projects.ts src/data/data.test.ts
git commit -m "feat: Service e SkillGroup ganham area, projeto ganha categoria qa"
```

---

## Task 3: i18n — chaves novas de navegação e seletor de home

**Files:**
- Modify: `src/i18n/pt.ts`
- Modify: `src/i18n/en.ts`

**Interfaces:**
- Produces: `t.nav.backToAreas`, `t.projects.filterQa`, `t.home.selectorTitle`,
  `t.home.selectorSubtitle`, `t.home.selectorCta` — usados pelas Tasks 4, 8, 9.
- Remove: `t.sections.servicesClosing` (fica órfã depois da Task 6 — `Services` não vai mais
  ter bloco secundário).

- [ ] **Step 1: Editar `src/i18n/pt.ts`**

Em `nav`, adicionar `backToAreas` (depois de `contact`):

```ts
    contact: 'Contato',
    backToAreas: 'Todas as áreas',
    ariaMain: 'Navegação principal',
```

Em `sections`, remover a linha `servicesClosing: 'E o que fecha o ciclo',`.

Em `projects`, adicionar `filterQa` (depois de `filterLanding`):

```ts
    filterLanding: 'Landing Pages',
    filterQa: 'QA',
    showAll: 'Ver todos',
```

Adicionar um bloco novo `home` no nível raiz do objeto (depois de `contact`, antes de
`footer`):

```ts
  home: {
    selectorTitle: 'Escolha uma área',
    selectorSubtitle: 'Cada área mostra os serviços, projetos e skills relevantes pra ela.',
    selectorCta: 'Explorar',
  },
```

- [ ] **Step 2: Editar `src/i18n/en.ts`** com as mesmas chaves, mesma posição:

`nav.backToAreas: 'All areas'`. Remover `sections.servicesClosing`. `projects.filterQa: 'QA'`.

```ts
  home: {
    selectorTitle: 'Choose an area',
    selectorSubtitle: 'Each area shows the services, projects and skills relevant to it.',
    selectorCta: 'Explore',
  },
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: `en.ts` deve compilar limpo (paridade de chaves com `pt.ts` via `Dictionary`). Os
erros de `Hero.tsx`/`Services.tsx` da Task 2 continuam presentes — não são desta task, ignorar
por enquanto.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/pt.ts src/i18n/en.ts
git commit -m "feat: chaves de i18n pro seletor de area e nav entre areas"
```

---

## Task 4: `Navbar` e `LanguageToggle` — cientes de área

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/LanguageToggle.tsx`

**Interfaces:**
- Consumes: `areas`, `areaById` de `@/data/areas` (Task 1); `AreaId` de `@/data/types`;
  `t.nav.backToAreas` (Task 3).
- Produces: `Navbar({ lang, area? }: { lang: Locale; area?: AreaId })`,
  `LanguageToggle({ lang, label, area? }: { lang: Locale; label: string; area?: AreaId })` —
  usados pelas Tasks 10 e 11.

- [ ] **Step 1: Reescrever `src/components/layout/LanguageToggle.tsx`**

```tsx
'use client';

import Link from 'next/link';
import type { Locale } from '@/i18n';
import { areaById } from '@/data/areas';
import type { AreaId } from '@/data/types';

// O toggle é um <Link> real: troca a rota, não o estado. O localStorage só grava a
// preferência para a próxima entrada pela raiz do domínio.
export function LanguageToggle({
  lang,
  label,
  area,
}: {
  lang: Locale;
  label: string;
  area?: AreaId;
}) {
  const other: Locale = lang === 'pt' ? 'en' : 'pt';
  const href = area ? `/${other}/${areaById(area).slug[other]}/` : `/${other}/`;

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={() => {
        try {
          localStorage.setItem('lang', other);
        } catch {
          // localStorage indisponível: a navegação acontece do mesmo jeito.
        }
      }}
      className="font-mono rounded border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className={lang === 'pt' ? 'text-accent' : undefined}>PT</span>
      <span aria-hidden> / </span>
      <span className={lang === 'en' ? 'text-accent' : undefined}>EN</span>
    </Link>
  );
}
```

- [ ] **Step 2: Reescrever `src/components/layout/Navbar.tsx`**

```tsx
import Link from 'next/link';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { areas } from '@/data/areas';
import type { AreaId } from '@/data/types';
import { LanguageToggle } from './LanguageToggle';

export function Navbar({ lang, area }: { lang: Locale; area?: AreaId }) {
  const t = getDictionary(lang);

  const anchors = area
    ? [
        { href: '#sobre', label: t.nav.about },
        { href: '#servicos', label: t.nav.services },
        { href: '#projetos', label: t.nav.projects },
        { href: '#ia', label: t.nav.ai },
        { href: '#experiencia', label: t.nav.experience },
        { href: '#contato', label: t.nav.contact },
      ]
    : [];

  const otherAreas = areas.filter((a) => a.id !== area);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href={`/${lang}/`} className="font-head text-sm font-semibold tracking-tight">
          {profile.name}
        </Link>

        {anchors.length > 0 && (
          <nav aria-label={t.nav.ariaMain} className="hidden gap-5 text-sm text-muted md:flex">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="transition-colors hover:text-accent">
                {a.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {area && (
            <nav className="hidden gap-3 border-r border-line pr-3 text-sm text-muted sm:flex">
              {otherAreas.map((a) => (
                <Link
                  key={a.id}
                  href={`/${lang}/${a.slug[lang]}/`}
                  className="transition-colors hover:text-accent"
                >
                  {a.label[lang]}
                </Link>
              ))}
              <Link href={`/${lang}/`} className="transition-colors hover:text-accent">
                {t.nav.backToAreas}
              </Link>
            </nav>
          )}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-accent"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-accent"
          >
            <LinkedinIcon size={18} />
          </a>
          <LanguageToggle lang={lang} label={t.nav.ariaLang} area={area} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: sem novos erros vindos de `Navbar.tsx`/`LanguageToggle.tsx` (os erros pendentes de
`Hero.tsx`/`Services.tsx` continuam, não são desta task).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/LanguageToggle.tsx
git commit -m "feat: navbar e toggle de idioma cientes de area"
```

---

## Task 5: `Hero` — variante por área

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Area` type de `@/data/areas` (Task 1), `services` (com `area` da Task 2).
- Produces: `Hero({ lang, area? }: { lang: Locale; area?: Area })` — usado pelas Tasks 10 e 11.

- [ ] **Step 1: Reescrever `src/components/sections/Hero.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import type { Area } from '@/data/areas';
import { Reveal } from '@/components/Reveal';

export function Hero({ lang, area }: { lang: Locale; area?: Area }) {
  const t = getDictionary(lang);

  const eyebrow = area ? area.hero.eyebrow[lang] : t.hero.eyebrow;
  const headlineBefore = area ? area.hero.headlineBefore[lang] : t.hero.headlineBefore;
  const headlineAccent = area ? area.hero.headlineAccent[lang] : t.hero.headlineAccent;
  const headlineAfter = area ? area.hero.headlineAfter[lang] : t.hero.headlineAfter;
  const subheadline = area ? area.hero.subheadline[lang] : t.hero.subheadline;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <Reveal>
        <p className="font-mono mb-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent">
          <span aria-hidden className="inline-block h-px w-7 bg-accent" />
          {eyebrow}
        </p>

        <h1 className="font-head max-w-[20ch] text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
          {headlineBefore}
          <span className="text-accent">{headlineAccent}</span>
          {headlineAfter}
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">{subheadline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {area && (
            <a
              href="#projetos"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t.hero.ctaProjects}
            </a>
          )}
          <a
            href={profile.cvPath}
            download
            className="rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {t.hero.ctaCv}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            GitHub ↗
          </a>
        </div>

        <p className="font-mono mt-8 text-[0.7rem] uppercase tracking-[0.09em] text-muted">
          {t.hero.actuationLabel}: {profile.actuation.join(' · ')}
        </p>
      </Reveal>

      {area && (
        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-px border-t border-line sm:grid-cols-2">
            {services
              .filter((s) => s.area === area.id)
              .map((s, i) => (
                <div
                  key={s.id}
                  className={i > 0 ? 'pt-5 sm:border-l sm:border-line sm:pl-5' : 'pt-5 sm:pr-5'}
                >
                  <h2 className="font-head text-sm font-semibold">{s.title[lang]}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {s.items.map((it) => it[lang]).join(' · ')}
                  </p>
                </div>
              ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
```

Nota: o CTA "Ver projetos" (`#projetos`) só aparece com `area`, porque a home não tem seção de
projetos — sem essa condição o link ficaria morto na home.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: sem erro em `Hero.tsx` (o erro de `s.weight` que a Task 2 deixou pendente some aqui).
Erro pendente de `Services.tsx` continua — não é desta task.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: Hero com variante por area"
```

---

## Task 6: `Services` — filtra por área, sem bloco secundário

**Files:**
- Modify: `src/components/sections/Services.tsx`

**Interfaces:**
- Consumes: `AreaId` de `@/data/types`, `services` (com `area` da Task 2).
- Produces: `Services({ lang, area }: { lang: Locale; area: AreaId })` — usado pela Task 11.

- [ ] **Step 1: Reescrever `src/components/sections/Services.tsx`**

```tsx
import { BrainCircuit, Code2, ShieldCheck, Workflow } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { services } from '@/data/services';
import type { AreaId } from '@/data/types';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const icons = { Code2, BrainCircuit, Workflow, ShieldCheck } as const;

export function Services({ lang, area }: { lang: Locale; area: AreaId }) {
  const t = getDictionary(lang);
  const items = services.filter((s) => s.area === area);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="servicos" label={t.sections.servicesTitle} />
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((s, i) => {
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

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS — nenhum erro pendente das Tasks 2/5 sobra depois desta.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Services.tsx
git commit -m "feat: Services filtra por area, sem bloco secundario"
```

---

## Task 7: `Skills` — filtra grupos da área + grupos de apoio

**Files:**
- Modify: `src/components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `AreaId` de `@/data/types`, `skillGroups` (com `area?` da Task 2).
- Produces: `Skills({ lang, area }: { lang: Locale; area: AreaId })` — usado pela Task 11.

- [ ] **Step 1: Reescrever `src/components/sections/Skills.tsx`**

```tsx
import { getDictionary, type Locale } from '@/i18n';
import { skillGroups } from '@/data/skills';
import type { AreaId } from '@/data/types';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// Sem barras de progresso percentuais. Layout escaneável, com a ordem dos grupos preservada.
export function Skills({ lang, area }: { lang: Locale; area: AreaId }) {
  const t = getDictionary(lang);
  const groups = skillGroups.filter((g) => g.area === area || g.area === undefined);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="skills" label={t.sections.skillsTitle} />
        </Reveal>
        <div className="space-y-6">
          {groups.map((group, i) => (
            <Reveal key={group.id} delay={Math.min(i, 4) * 0.05}>
              <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[220px_1fr]">
                <h3 className="font-head text-sm font-semibold">{group.title[lang]}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="font-mono rounded border border-line bg-bg px-2 py-0.5 text-xs text-muted"
                    >
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

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Skills.tsx
git commit -m "feat: Skills filtra grupos por area, mantendo grupos de apoio"
```

---

## Task 8: `Projects` — base filtrada por área + filtro de categoria `qa`

**Files:**
- Modify: `src/components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `categoriesForArea` de `@/data/areas` (Task 1), `AreaId`/`ProjectCategory` de
  `@/data/types`, `t.projects.filterQa` (Task 3).
- Produces: `Projects({ lang, area }: { lang: Locale; area: AreaId })` — usado pela Task 11.

- [ ] **Step 1: Reescrever `src/components/sections/Projects.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getDictionary, type Locale } from '@/i18n';
import { projects } from '@/data/projects';
import { categoriesForArea } from '@/data/areas';
import type { AreaId, ProjectCategory } from '@/data/types';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';

type Filter = 'all' | ProjectCategory;
const ORDER: ProjectCategory[] = ['ia', 'fullstack', 'landing', 'qa'];

export function Projects({ lang, area }: { lang: Locale; area: AreaId }) {
  const t = getDictionary(lang);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);

  const categoryLabel: Record<ProjectCategory, string> = {
    ia: t.projects.filterIa,
    fullstack: t.projects.filterFullstack,
    landing: t.projects.filterLanding,
    qa: t.projects.filterQa,
  };

  const areaCategories = categoriesForArea(area);
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.projects.filterAll },
    ...ORDER.filter((c) => areaCategories.includes(c)).map((c) => ({
      key: c as Filter,
      label: categoryLabel[c],
    })),
  ];

  const base = projects.filter((p) => areaCategories.includes(p.category));
  const sorted = [...base].sort(
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
                  labels={{
                    repo: t.projects.repo,
                    demo: t.projects.demo,
                    category: categoryLabel[p.category],
                  }}
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

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "feat: Projects filtra base e categorias pela area"
```

---

## Task 9: `AreaSelector` — nova seção da home

**Files:**
- Create: `src/components/sections/AreaSelector.tsx`

**Interfaces:**
- Consumes: `areas` de `@/data/areas` (Task 1), `t.home.*` (Task 3).
- Produces: `AreaSelector({ lang }: { lang: Locale })` — usado pela Task 10.

- [ ] **Step 1: Criar `src/components/sections/AreaSelector.tsx`**

```tsx
import Link from 'next/link';
import { getDictionary, type Locale } from '@/i18n';
import { areas } from '@/data/areas';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function AreaSelector({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="areas" label={t.home.selectorTitle} />
          <p className="mb-8 max-w-[58ch] text-sm leading-relaxed text-muted">
            {t.home.selectorSubtitle}
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.id} delay={i * 0.08}>
              <Link
                href={`/${lang}/${area.slug[lang]}/`}
                className="flex h-full flex-col border border-line p-5 transition-colors hover:border-accent"
              >
                <h3 className="font-head text-base font-semibold">{area.label[lang]}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {area.hero.subheadline[lang]}
                </p>
                <span className="mt-4 text-sm font-medium text-accent">
                  {t.home.selectorCta} ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AreaSelector.tsx
git commit -m "feat: AreaSelector, secao da home com os 3 cards de area"
```

---

## Task 10: Home (`/[lang]/`) vira o seletor

**Files:**
- Modify: `src/app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Navbar` (sem `area`), `Hero` (sem `area`), `AreaSelector` (Task 9), `Footer`
  (inalterado).

- [ ] **Step 1: Reescrever `src/app/[lang]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { AreaSelector } from '@/components/sections/AreaSelector';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Navbar lang={lang} />
      <main>
        <Hero lang={lang} />
        <AreaSelector lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[lang]/page.tsx
git commit -m "feat: home vira seletor de area"
```

---

## Task 11: Nova rota `/[lang]/[area]/` — página de área completa

**Files:**
- Create: `src/app/[lang]/[area]/page.tsx`

**Interfaces:**
- Consumes: `areas`, `areaBySlug` (Task 1); `Navbar`/`LanguageToggle` cientes de `area` (Task
  4); `Hero` com `area` (Task 5); `Services`/`Skills`/`Projects` com `area: AreaId` (Tasks 6-8);
  `About`/`Process`/`AiResearch`/`Experience`/`Contact`/`Footer` (inalterados, mesma assinatura
  `{ lang }` de hoje).

- [ ] **Step 1: Criar `src/app/[lang]/[area]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n';
import { areas, areaBySlug } from '@/data/areas';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Process } from '@/components/sections/Process';
import { Skills } from '@/components/sections/Skills';
import { AiResearch } from '@/components/sections/AiResearch';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return [];
  return areas.map((a) => ({ area: a.slug[params.lang as Locale] }));
}

// Mesmo raciocínio do layout de [lang]: fora dos slugs gerados aqui, a rota vira 404 no
// build, não erro em runtime — não há runtime nesse projeto (output: 'export').
export const dynamicParams = false;

export default async function AreaPage({
  params,
}: {
  params: Promise<{ lang: string; area: string }>;
}) {
  const { lang, area: areaSlugParam } = await params;
  if (!isLocale(lang)) notFound();

  const area = areaBySlug(lang, areaSlugParam);
  if (!area) notFound();

  return (
    <>
      <Navbar lang={lang} area={area.id} />
      <main>
        <Hero lang={lang} area={area} />
        <About lang={lang} />
        <Services lang={lang} area={area.id} />
        <Projects lang={lang} area={area.id} />
        <Process lang={lang} />
        <Skills lang={lang} area={area.id} />
        <AiResearch lang={lang} />
        <Experience lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Build estático — confirma que as 6 páginas de área saem no export**

Run: `npm run build`
Expected: PASS, com `out/pt/fullstack/index.html`, `out/pt/ia-automacao/index.html`,
`out/pt/qa/index.html`, `out/en/fullstack/index.html`, `out/en/ai-automation/index.html`,
`out/en/qa/index.html` todos gerados (conferir com `ls out/pt out/en` depois do build).

- [ ] **Step 4: Commit**

```bash
git add "src/app/[lang]/[area]/page.tsx"
git commit -m "feat: rota de area, monta secoes filtradas pela area escolhida"
```

---

## Task 12: Verificação final e checagem manual no browser

**Files:** nenhum (só verificação)

- [ ] **Step 1: Suíte completa**

Run: `npm run typecheck && npm test && npm run lint && npm run build`
Expected: tudo PASS

- [ ] **Step 2: Subir o dev server e checar rotas manualmente**

Run: `npm run dev`

No browser, conferir:
- `http://localhost:3000/pt/` — hero enxuto + 3 cards de área, sem seção de projetos/skills
- `http://localhost:3000/pt/fullstack/` — hero da área, Services só com "Desenvolvimento de
  Sistemas", Projects só com categorias fullstack+landing, Skills com grupos web/backend +
  apoio, navbar mostra links pra "IA e Automação" e "QA" + "Todas as áreas"
- `http://localhost:3000/pt/ia-automacao/` — Services com 2 cards (ai + automation), Projects
  só categoria ia
- `http://localhost:3000/pt/qa/` — Services só "Qualidade e Engenharia de Testes" (sem mais
  bloco secundário/menor), Projects com os 2 novos projetos de QA
- Trocar idioma em cada página de área e confirmar que o slug muda corretamente
  (`/pt/ia-automacao/` → `/en/ai-automation/`, não `/en/`)
- `http://localhost:3000/pt/nao-existe/` — 404

- [ ] **Step 3: Parar o dev server**

Ctrl+C no terminal onde `npm run dev` está rodando.

- [ ] **Step 4: Reportar ao usuário**

Sem commit nesta task (é só verificação). Se algo do Step 2 falhar, voltar pra task
correspondente, corrigir, e repetir a Step 1 antes de reportar sucesso.
