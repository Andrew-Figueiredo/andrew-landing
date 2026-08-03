# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Portfólio pessoal de Andrew Figueiredo em `andrewfigueiredo.dev`. Next.js 15 (App Router) +
TypeScript + Tailwind v4, bilíngue PT/EN, exportado como site estático e servido por Nginx em
container. Sem backend, banco ou formulário com submit.

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

**Não existe `src/app/layout.tsx`.** Todas as rotas ficam sob `src/app/[lang]/`, e o layout desse
segmento atua como root layout — é o que permite `<html lang>` correto por idioma.
`generateStaticParams` emite `pt` e `en`, e `dynamicParams = false` fecha o resto.

**`output: 'export'` restringe o que é possível.** Sem middleware, sem rotas dinâmicas de
servidor, sem otimização de imagem em runtime. `trailingSlash: true` e `images.unoptimized: true`
são interdependentes com ele; mudar um quebra o deploy.

**O redirect da raiz é `public/index.html`**, escrito à mão. É o único ponto do site que usa
`localStorage`. O toggle de idioma na navbar é um `<Link>` real que troca a rota.

**Animação vive só em `src/components/Reveal.tsx`**, o único componente de motion marcado
`'use client'`. `Projects.tsx` também é client, por causa do estado do filtro. Não espalhe
`'use client'` além desses dois — as demais seções são Server Components.

**Ícones de marca são SVG inline** em `src/components/icons/BrandIcons.tsx`. `lucide-react` v1
removeu `Github` e `Linkedin`; os demais ícones vêm da lucide normalmente.

## Convenções

**Fronteira `i18n/` vs `data/`.** `src/i18n/` guarda texto de interface (nav, botões, títulos de
seção). `src/data/` guarda registros, e campos que variam por idioma usam `{ pt, en }` dentro do
próprio registro. Nenhuma string hardcoded em componente.

**Paridade PT/EN é garantida pelo compilador.** `pt.ts` define `Dictionary` via `typeof`; `en.ts`
é tipado com ele. Chave faltando quebra `npm run typecheck`, não o runtime. `pt.ts` **não** usa
`as const` de propósito: isso produziria tipos literais e `en.ts` passaria a exigir as strings em
português.

**Tokens de tema** ficam em `@theme` dentro de `src/app/globals.css`. Use as utilitárias
(`text-accent`, `bg-bg-soft`, `border-line`, `font-head`, `font-mono`). Nunca hardcode cor ou
fonte num componente.

**Tom do conteúdo:** sóbrio e técnico. Proibido "apaixonado", "energia contagiante",
"entusiasmado". Não inventar métricas — onde faltar número, deixar `// TODO: adicionar métrica`.

**Descrição de projeto diz qual problema foi resolvido**, não o que foi construído.

**Keep Chat aparece em duas seções** com recortes deliberadamente distintos: `AiResearch` trata do
conteúdo da pesquisa, `Experience` do vínculo e das datas. Não unifique os textos. Não descreva o
projeto como sendo de segurança pública — o edital tem trechos de pré-requisito reaproveitados de
outro edital; vale a descrição oficial do item 2.1.

**Invariantes de dados** estão em `src/data/data.test.ts`: distribuição por categoria, contagem de
destaques, unicidade de id, e quais vínculos são atuais. Se um desses falhar depois de editar
dados, confira a spec antes de alterar o teste.

## Pendências de conteúdo

Ver seção 14 da spec. Os nove projetos em `src/data/projects.ts` são seed marcado
`// TODO: substituir`.
