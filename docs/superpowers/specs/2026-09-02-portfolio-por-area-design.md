# Portfólio por área — design

Data: 2026-09-02
Status: aprovado, pronto para plano de implementação

## 1. Contexto e motivação

O portfólio hoje é single-page: `/[lang]/` renderiza todas as seções (Hero, About,
Services, Projects, Process, Skills, AiResearch, Experience, Contact) em sequência,
falando com todo mundo ao mesmo tempo. Andrew quer que a home vire um seletor de área
e que cada área tenha sua própria página, falando diretamente com o público daquela
área (recrutador de QA, cliente de IA, contratante fullstack) — organização do
portfólio (que vai crescer com os 9 projetos reais) é um benefício secundário, não o
motivador.

**As três áreas mapeiam quase 1:1 no modelo de dados atual:**

| Área | slug pt | slug en | `Service` de origem | `SkillGroup` de origem |
|---|---|---|---|---|
| Fullstack | `fullstack` | `fullstack` | `dev` | `web`, `backend` |
| IA e Automação | `ia-automacao` | `ai-automation` | `ai` + `automation` | `ai`, `automation` |
| QA | `qa` | `qa` | `quality` | `quality` |

Isso substitui o conceito de "frente primária vs. secundária" (que existia só porque
tudo vivia na mesma página e a qualidade não podia competir em peso visual com as
outras três). Numa página própria, QA não é mais "menor" — é a página inteira.

## 2. Rotas

Nova rota aninhada `/[lang]/[area]/`, ao lado da home `/[lang]/`. Mantém
`output: 'export'` e `dynamicParams = false`: `generateStaticParams` do segmento
`[area]` recebe o `lang` do pai e retorna os 3 slugs traduzidos daquele idioma —
6 páginas estáticas ao todo (3 áreas × 2 idiomas).

```
/pt/                    → seletor de área (Hero enxuto + 3 cards)
/pt/fullstack/          → página da área Fullstack
/pt/ia-automacao/       → página da área IA e Automação
/pt/qa/                 → página da área QA
/en/                    → seletor (EN)
/en/fullstack/
/en/ai-automation/
/en/qa/
```

Um path pt (`/pt/qa/`) que não bate com nenhum slug válido do `[area]` cai em
`notFound()`, igual ao tratamento hoje para `lang` inválido.

## 3. Modelo de dados

### 3.1 `src/data/areas.ts` (novo)

Um registro por área: `id`, `slug: { pt, en }`, `label: Localized`, texto de hero
próprio (`eyebrow`, `headline`, `subheadline` — reaproveita a estrutura de
`t.hero.*`, mas com conteúdo focado na área). Fica em `data/` e não em `i18n/`
porque é registro (uma entrada por área), seguindo a fronteira já documentada no
CLAUDE.md.

```ts
export type AreaId = 'fullstack' | 'ia-automacao' | 'qa';

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

export const areas: Area[] = [ /* fullstack, ia-automacao, qa, nessa ordem */ ];
```

Duas funções puras de apoio, usadas por rotas e pelo `LanguageToggle`:
`areaBySlug(lang, slug): Area | undefined` e `areaSlug(area, lang): string`.

### 3.2 `types.ts` — mudanças

- `Service.weight: 'primary' | 'secondary'` **sai**. Entra `Service.area: AreaId`.
- `SkillGroup` ganha `area?: AreaId`. Ausente = grupo de apoio, aparece em toda
  página de área (mantém `data`, `infra`, `methods` como estão hoje).
- `ProjectCategory` ganha `'qa'`, ficando `'ia' | 'fullstack' | 'landing' | 'qa'`.
- Mapeamento categoria → área é uma função pura em `areas.ts` (ou `projects.ts`),
  não um campo novo no `Project`: `ia`→ia-automacao, `fullstack`+`landing`→fullstack,
  `qa`→qa. Evita duplicar informação já implícita na categoria.

### 3.3 `services.ts`

Cada uma das 4 entradas ganha `area` no lugar de `weight`:
`dev`→`fullstack`, `ai`→`ia-automacao`, `automation`→`ia-automacao`, `quality`→`qa`.

### 3.4 `skills.ts`

`web`, `backend` → `area: 'fullstack'`. `ai`, `automation` → `area: 'ia-automacao'`.
`quality` → `area: 'qa'`. `data`, `infra`, `methods` sem `area` (grupos de apoio,
continuam em toda página, na mesma ordem relativa ao final).

### 3.5 `projects.ts`

Categoria `'qa'` some ao vocabulário. Duas entradas novas, seed marcado
`// TODO: substituir` como as outras 9 (aditivas — não competem pelos 9 slots
travados em `data.test.ts`):

1. Um projeto único cobrindo três etapas: construção de suíte de testes com IA
   (Claude Code / Codex), configuração de pipeline CI/CD rodando os testes, e
   publicação de relatório com Allure Report. `stack` reflete as três frentes
   (ex.: `['Playwright', 'Allure Report', 'GitHub Actions']`).
2. Relatórios e testes manuais.

## 4. Componentes afetados

### 4.1 Novos

- **`AreaSelector`** (`src/components/sections/AreaSelector.tsx`): substitui, na
  home, as seções que hoje vinham depois do Hero. 3 cards (um por `areas`), cada um
  linkando para `/[lang]/[slug-da-área-no-idioma-atual]/`.
- Home (`src/app/[lang]/page.tsx`) passa a renderizar só `Navbar` + `Hero` (versão
  enxuta, sem CTA de projetos/CV — ver 4.2) + `AreaSelector` + `Footer`.

### 4.2 `Hero`

Ganha uma variante: recebe `area?: Area`. Sem `area` (home), usa eyebrow/headline
genéricos do perfil, sem o bloco de 3 frentes que hoje lista `services.filter(w =>
primary)` (esse bloco não faz mais sentido — a escolha de frente é o próprio
seletor). Com `area`, usa `area.hero.*` para eyebrow/headline/subheadline; o bloco
inferior deixa de listar as 3 frentes e passa a listar os `items` do `Service`
daquela área (ou é removido, se ficar redundante com a seção Services logo abaixo —
decisão de implementação, não trava o design).

### 4.3 `Services`, `Skills`, `Projects` — todos ganham prop `area: AreaId`

- **`Services`**: filtra `services.filter(s => s.area === area)` e renderiza todos
  em pé de igualdade (grid, sem bloco "secundário" — essa distinção só existia
  para caber 4 frentes numa página).
- **`Skills`**: renderiza grupos com `group.area === area || group.area ===
  undefined` (a área da página primeiro, grupos de apoio depois, ordem preservada
  do array original).
- **`Projects`**: `sorted`/filtro de categoria não muda de mecânica, mas a lista
  de base já vem pré-filtrada pelas categorias daquela área (ex.: fullstack mostra
  `fullstack` + `landing`). Os botões de filtro (`filterAll`/`filterIa`/etc.) na
  área fullstack, por exemplo, mostram só "todos / fullstack / landing" — não os
  filtros de categorias que não pertencem à área.

### 4.4 `Navbar` e `LanguageToggle`

- **`Navbar`** ganha prop `area?: AreaId`. Com `area`, o menu de âncoras de seção
  continua igual (a página de área ainda é single-scroll), mas acrescenta um bloco
  de troca de área: links para as outras 2 áreas + link para o seletor (`/[lang]/`).
  Sem `area` (home), sem esse bloco.
- **`LanguageToggle`** deixa de assumir `/${other}/` fixo. Recebe `area?: AreaId`;
  com área, monta `/${other}/${areaSlug(area, other)}/` usando `areaSlug` de
  `areas.ts`. Sem área, mantém o comportamento atual.

### 4.5 Seções que não mudam

`About`, `Process`, `AiResearch`, `Experience`, `Contact`, `Footer` continuam
idênticas em toda página de área — sem prop `area`, renderizadas do mesmo jeito
nas 3 páginas.

## 5. i18n

Chaves novas em `pt.ts`/`en.ts` (paridade garantida por `typeof` como hoje):
- `nav.switchArea`, `nav.backToAreas` (ou similar) para os novos links da navbar.
- `home.selectorTitle`, `home.selectorSubtitle` (copy acima dos 3 cards).
- Rótulo de cada área já vive em `areas.ts` (`Area.label`), não duplicado em
  `pt.ts`/`en.ts`.

## 6. Testes (`data.test.ts`)

- Invariante "quality nunca ocupa o mesmo espaço visual" **sai** — era regra de
  layout de página única, não se aplica mais (QA tem página inteira própria).
- Distribuição de categoria por página única segue travada para o conjunto
  original de 9: 2 `ia`, 4 `fullstack`, 3 `landing`. Nova asserção: projetos
  `category: 'qa'` existem (>= 2) e são tratados à parte dessa contagem de 9 —
  não entram no total nem na proporção.
- Nova asserção: todo `Service.area` e todo `SkillGroup.area` (quando presente)
  é um `AreaId` válido de `areas.ts`, e cada área tem pelo menos 1 `Service`.

## 7. Fora de escopo

- Conteúdo de About/Experience/Formação/AiResearch/Contato não muda por área.
- Sem SSR nem rota dinâmica de servidor — export estático continua (`images.
  unoptimized`, `trailingSlash`, `dynamicParams=false` inalterados).
- Os 8 projetos ainda-seed (`ia-2`, `fs-1..4`, `lp-2`, `lp-3`) não são tocados
  aqui — só ganham a categoria `qa` como opção nova de vocabulário.
- Redesenho visual dos cards do seletor de área fica a critério da implementação,
  seguindo os tokens de tema já existentes (`@theme` em `globals.css`).
