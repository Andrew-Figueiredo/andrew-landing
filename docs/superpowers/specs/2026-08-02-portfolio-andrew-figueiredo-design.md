# Portfólio Andrew Figueiredo — Design

Data: 2026-08-02
Repositório: `Andrew-Figueiredo/andrew-landing` · Domínio: `andrewfigueiredo.dev` · VPS: `91.99.8.84`

---

## 1. Objetivo

Portfólio pessoal de página única que estabeleça autoridade técnica junto a recrutadores
técnicos, tech leads e clientes de consultoria em IA, automação e desenvolvimento.

O site substitui a landing institucional da Sonhai, que hoje ocupa o repositório e aponta
`og:url` para `andrewfigueiredo.dev`.

## 2. Posicionamento

Título: **Especialista em Desenvolvimento de Sistemas | Consultoria em IA e Automação**

Três frentes com peso equivalente:

1. Desenvolvimento de Sistemas — aplicações web, APIs, integrações
2. Consultoria em IA — LLMs, machine learning aplicado, automação inteligente
3. Automação e Bots — n8n, chatbots WhatsApp e Telegram, RPA

E uma quarta frente **de peso deliberadamente menor** (decisão do autor em 2026-08-03):

4. Qualidade e Engenharia de Testes — testes automatizados, BDD, CI/CD, análise estática

O eixo que une tudo: ele constrói o sistema, integra inteligência nele, automatiza a operação em
volta — e sabe garantir que aquilo se sustenta em produção. São camadas do mesmo trabalho. Hero
e Sobre devem tornar isso explícito.

A quarta frente não é uma oferta em pé de igualdade: é o fecho do ciclo das outras três. Poucos
desenvolvedores conseguem afirmar essa última parte com lastro, e é isso que ela acrescenta em
vez de diluir. Consequências de implementação, travadas por teste em `src/data/data.test.ts`:

- O Hero renderiza apenas as frentes `weight: 'primary'` — a qualidade não disputa a primeira dobra.
- A seção de Serviços dá à qualidade um bloco próprio de largura total abaixo do grid de três,
  com os itens em linha. Um quarto card daria a ela o mesmo peso visual das principais.
- Em Skills ela ocupa a quinta posição: depois das quatro frentes, antes dos grupos de apoio.

A experiência em Qualidade de Software é parte da trajetória, não a identidade do site.
Os títulos de cargo reais são preservados; os bullets descrevem o trabalho de engenharia
("desenvolvi suítes de automação em Python integradas ao pipeline de CI", não "executei testes").

**Tom:** sóbrio e técnico. Proibido: "apaixonado", "energia contagiante", "entusiasmado".
Não inventar métricas — onde faltar número, deixar `// TODO: adicionar métrica`.

### Referencial competitivo

Análise de cinco sites na mesma interseção ([eugeneyan.com](https://eugeneyan.com),
[jxnl.co](https://jxnl.co), [brittanychiang.com](https://brittanychiang.com),
[especialistan8n.com.br](https://especialistan8n.com.br/),
[ivonfilho.com](https://ivonfilho.com/especialista-n8n/)):

- Nenhum publica preço. Todos têm uma frase-âncora curta de posicionamento.
- Todos usam coluna única com navegação por âncoras.
- **O separador entre autoridade e marketing é prova verificável** — artefato, cliente
  nomeado, volume de publicação. Os sites fracos prometem benefício genérico.

Consequência de projeto: o site precisa elevar a prova que Andrew já possui (empresas reais,
liderança técnica, pesquisa com fomento público) em vez de depender dos projetos placeholder.

## 3. Decisões de arquitetura

| Decisão | Escolha | Razão |
|---|---|---|
| Sonhai | Sai do repositório | Um domínio, um produto, um deploy. Histórico git preserva o conteúdo. |
| i18n | Rotas `/pt` e `/en` | Ambos idiomas indexáveis com `hreflang`; preserva Server Components. |
| Render | `output: 'export'` | Sem backend, banco ou conteúdo dinâmico. Elimina o runtime Node da VPS. |
| Card de projeto | Tipográfico, imagem opcional | Não depende de thumbnail que ainda não existe. |
| Paleta | Azul profundo `#14395E` | Escolha do autor entre azul, verde-petróleo e grafite. |
| Hero | Tipográfico, largura total, sem foto | Dá escala à headline e espaço real às três frentes. Foto vai para o Sobre. |
| Build da imagem | GitHub Actions + GHCR | Evita compilar Next.js na VPS (risco de OOM) e não duplica o build do CI. |

### Consequências que precisam ser respeitadas

- `output: 'export'` **não suporta middleware**. O redirect da raiz é resolvido fora do Next.js.
- `output: 'export'` exige `images: { unoptimized: true }`. As imagens são otimizadas em
  build (WebP dimensionado), não sob demanda.
- `trailingSlash: true` é obrigatório. O export gera `out/pt/index.html`; sem ele, o Nginx
  precisaria de regras de `try_files` para resolver `/pt` e `/pt/` de forma consistente, e
  as duas URLs passariam a existir como conteúdo duplicado aos olhos do Google.
- Não existe `src/app/layout.tsx`. Com todas as rotas sob `[lang]`, o layout do segmento
  **é** o root layout — padrão documentado do Next.js para i18n em App Router. É o que
  permite `<html lang={lang}>` correto por idioma.

## 4. Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · lucide-react ·
`clsx` + `tailwind-merge` (helper `cn()`). Desenvolvimento: Vitest, Playwright.
Sem backend, sem banco, sem formulário com submit.

**shadcn/ui não será instalado** (revisão de 2026-08-02, aprovada pelo autor). O site usa dois
estilos de botão e um chip de texto; instalar shadcn traria `components.json`,
`class-variance-authority` e o fluxo de `npx shadcn add` para gerar componentes mais longos que
o markup direto. O helper `cn()` fica pronto caso componentes mais complexos — modal, dropdown,
tabs — passem a ser necessários; nesse momento vale instalar.

### Verificação

A spec original não previa testes. Decisão da mesma revisão: entra uma camada mínima, cobrindo
só o que o TypeScript não alcança.

- `npm run typecheck` — já garante a paridade dos dicionários PT/EN por tipagem
- `npm test` (Vitest) — invariantes dos dados: distribuição de projetos por categoria, contagem
  de destaques, unicidade de id, quais vínculos são atuais, agrupamento dos cargos da ENACOM
- `npm run lint` e `npm run build`
- Playwright entra como devDependency apenas para gerar a OG image a partir de um template HTML

## 5. Estrutura de arquivos

```
src/
  app/
    [lang]/
      layout.tsx        # root layout: <html lang>, next/font, metadata, hreflang
      page.tsx          # compõe as seções; generateStaticParams → pt | en
    globals.css         # tokens via @theme (Tailwind v4)
  components/
    layout/   Navbar.tsx · Footer.tsx · LanguageToggle.tsx
    sections/ Hero · About · Services · Projects · Process · Skills · AiResearch · Experience · Contact
    ProjectCard.tsx · SectionHeading.tsx
    Reveal.tsx          # único 'use client' de animação
  data/       profile.ts · services.ts · process.ts · skills.ts · education.ts · experience.ts · projects.ts
              types.ts · data.test.ts
  i18n/       pt.ts · en.ts · index.ts
  lib/        utils.ts
public/
  andrew-figueiredo.jpg   # já adicionado (640×640, 50 KB); converter para WebP no build
  index.html              # redirect de raiz por preferência de idioma
  cv-andrew-figueiredo.pdf # já adicionado; substituir quando o CV for revisado
  og-image.png            # 1200×630, gerada por scripts/make-og-image.mjs
scripts/
  og-template.html · make-og-image.mjs
infra/vps/
  README.md · apex-nginx-atual.conf · placeholder-atual.html   # ver adendo, seção 17
```

Um arquivo por seção. Nenhuma string hardcoded em componente.

## 6. Design system

```
Cor    --accent        #14395E   (azul profundo, cor única de destaque)
       --fg            #0B1220
       --muted         #5A6472
       --bg            #FFFFFF
       --bg-soft       #FAFAFA
       --line          #E4E7EC
Fonte  headings        Geist          (via next/font)
       corpo           Inter          (via next/font)
       rótulos/mono    Geist Mono     (eyebrows, numeração, chips de stack)
```

Bordas de 1px em vez de sombras pesadas. Espaçamento amplo, grid consistente. Mobile-first,
validado em 375px, 768px e 1440px. Sem gradientes, sem cards flutuantes idênticos, sem emoji
como ícone, sem barras de progresso percentuais.

## 7. Estrutura da página

Ordem das seções, com as mudanças em relação ao brief original marcadas:

1. **Navbar fixa** — nome, âncoras, toggle PT/EN, GitHub, LinkedIn
2. **Hero** — eyebrow com o título profissional, headline das três frentes, subheadline
   (+5 anos, do requisito à produção), CTAs (Ver projetos / Baixar CV / LinkedIn / GitHub),
   faixa numerada 01–03 descrevendo as frentes.
   **[mudança]** Linha discreta de atuação com `CODATA · ENACOM` abaixo dos CTAs — prova
   verificável que já existe, listada como atuação profissional, não como cliente.
3. **Sobre** — 2–3 parágrafos em primeira pessoa, tom técnico. **[mudança]** A foto de perfil
   vive aqui, em tamanho médio ao lado do texto.
4. **Serviços** — três blocos (Desenvolvimento / Consultoria em IA / Automação e Bots)
5. **Projetos** — acima de Experiência; filtro por categoria
6. **Como eu trabalho** — cinco etapas do ciclo de construção
7. **Skills** — oito grupos, na ordem que comunica o posicionamento
8. **IA: formação e pesquisa** — **[mudança]** renomeada. Deixa de ser só diplomas e passa a
   incluir a pesquisa ativa (Keep Chat). O argumento sai de "estudei IA" para "pesquiso IA
   com financiamento público".
9. **Experiência** — timeline vertical. **[mudança]** Os três cargos da ENACOM são agrupados
   sob a empresa mostrando progressão (Estágio → Analista III → Analista V / Líder Técnico).
   Três blocos soltos leem como rotatividade; agrupados, leem como crescimento.
   Keep Chat entra aqui como vínculo de pesquisa, com recorte diferente do da seção 8.
10. **Contato** — sem formulário: `mailto:`, LinkedIn, GitHub
11. **Footer** — nome, ano dinâmico, link para o repositório do site

## 8. Conteúdo

### Sobre — narrativa central

Entrou na engenharia de software pelo lado da qualidade e da automação, o que deu leitura
completa de como um sistema é construído, onde quebra e como se sustenta. Hoje desenvolve
aplicações web, integra soluções de IA e automatiza processos. Base em Matemática
Computacional, formação em Ciência de Dados, mestrado em TI com pesquisa em IA aplicada à
Engenharia de Software.

### Serviços (`src/data/services.ts`)

**Desenvolvimento de Sistemas** — aplicações web sob medida (React/Next.js); APIs e
integrações entre sistemas; landing pages e sites profissionais.

**Consultoria em IA** — diagnóstico de oportunidades de IA em processos existentes;
integração de LLMs em produtos e fluxos; desenvolvimento e treinamento de modelos de ML sob
medida; modelagem preditiva e análise avançada de dados; automação inteligente de processos.

**Automação e Bots** — automação de processos com n8n; chatbots WhatsApp e Telegram;
integrações entre sistemas e RPA.

### Como eu trabalho (`src/data/process.ts`)

Cinco etapas, uma linha cada: Levantamento e análise de requisitos → Arquitetura e modelagem
→ Desenvolvimento → Qualidade, testes automatizados e CI/CD → Deploy, monitoramento e evolução.

Esta seção é o que demonstra domínio do ciclo completo e não aparece em nenhum dos
concorrentes analisados.

### Skills (`src/data/skills.ts`) — a ordem comunica o posicionamento

1. **Desenvolvimento Web** — React, Next.js, TypeScript, JavaScript, React Native, Tailwind, HTML/CSS
2. **Backend & APIs** — Python, Node.js, APIs REST, PostgreSQL, MongoDB, SQL
3. **IA & Machine Learning** — LLMs (integração e aplicação), treinamento e criação de modelos,
   ML supervisionado e não supervisionado, redes neurais, classificação, regressão, árvores de
   decisão, SKLearn, PySpark, MLOps, avaliação de modelos, Jupyter, Python, R
4. **Automação & Bots** — n8n, chatbots WhatsApp e Telegram, Power Automate, integrações, RPA
5. **Dados & BI** — Power BI, dashboards, modelagem e análise de dados, Knime Analytics
6. **Infra & DevOps** — Docker, Nginx, GitHub Actions, Linux/VPS, CI/CD
7. **Qualidade & Engenharia de Testes** — Playwright, Pytest, Pytest-BDD, Cypress, Selenium,
   Azure DevOps, SonarQube, BDD, testes de API e performance
8. **Metodologias** — SCRUM, Ágil, Design Patterns, Clean Code

### IA: formação e pesquisa (`src/data/education.ts`)

- **Mestrado em Tecnologia da Informação — IFPB** (Fev/2025 – atual). Linha: Gestão e
  Desenvolvimento de Sistemas. Pesquisa em IA aplicada à Engenharia de Software: machine
  learning em testes, qualidade e automação. Estudo de LLMs.
- **Tecnólogo em Ciência de Dados — UNIPÊ** (Fev/2021 – Dez/2022). ML supervisionado e não
  supervisionado, avaliação de modelos com SKLearn, MLOps, big data com PySpark, PostgreSQL
  e MongoDB.
- **Graduação em Matemática Computacional — UFPB** (Jul/2016 – Dez/2021). Álgebra linear
  computacional, cálculo numérico, otimização, análise numérica, modelagem matemática.
- **Pesquisa: Projeto Keep Chat — FAPESQ / SECTIES-PB** (Set/2025 – atual). Iniciativa educativa de
  capacitação e treinamento em ferramentas de IA generativa, com propósito de impacto social
  positivo, conforme [Edital nº 30/2025 — SECTIES/FAPESQ/PB](https://fapesq.rpp.br/editais/2025/edital-no-30-2025-selecao-de-pesquisadores-para-o-projeto-keep-chat).
  Nesta seção o recorte é o **conteúdo da pesquisa**; a seção 9 registra o vínculo e as datas.
- Monitorias de Cálculo II e Matemática Discreta na UFPB: uma linha, sem destaque.

Argumento a comunicar: treinamento e criação de modelos, trabalho com LLMs, e a base
matemática para entender por que os modelos funcionam — não apenas consumi-los via API.

> Não descrever o Keep Chat como projeto de segurança pública. O edital contém trechos de
> pré-requisito que parecem reaproveitados de outro edital; a descrição oficial do projeto é
> a do item 2.1, citada acima.

### Experiência (`src/data/experience.ts`)

Dois vínculos são simultâneos e devem aparecer assim na timeline: CODATA é o emprego e
Keep Chat é bolsa de pesquisa de 20h semanais. A timeline precisa deixar essa natureza
distinta legível, para que a sobreposição de datas não pareça inconsistência.

1. **Pesquisador — Analista de TI | Projeto Keep Chat** | FAPESQ / SECTIES-PB | Set/2025 – atual
   Recorte de vínculo: pesquisa aplicada em IA generativa com fomento público estadual,
   20h semanais.
2. **Analista de TI — Desenvolvimento e Qualidade** | CODATA (Companhia de Dados da Paraíba)
   | Nov/2024 – atual
   - Desenvolvimento de suítes de automação em Python com Playwright e Pytest
   - Implementação de BDD (Pytest-BDD) e integração de relatórios ao pipeline
   - Análise de qualidade de código com SonarQube
   - Construção de dashboards de acompanhamento técnico
   - Testes de desempenho e análise de gargalos de aplicação
3. **ENACOM** | Jul/2021 – Out/2024 — bloco único com progressão interna:
   - **Analista de Qualidade de Software V — Líder Técnico** (Fev/2023 – Out/2024): liderança
     técnica de equipe definindo padrões de código e processo; automações em Python para
     otimização de fluxos; administração de pipeline e TestPlan em Azure DevOps; atuação
     junto ao cliente na operação assistida do sistema
   - **Analista de Qualidade de Software III** (Out/2022 – Fev/2023): automações web com
     padrão Page Object; automação de processos com Power Automate
   - **Analista de Qualidade de Software I / Estágio** (Jul/2021 – Out/2022): automação em
     Cypress com Page Objects; testes e integração de APIs REST; manipulação de bases MongoDB
4. **Desenvolvedor Mobile** | UFPB | Abr/2019 – Jan/2020 — aplicação mobile em React Native;
   prototipação em Figma. **Mesmo peso visual dos demais**: é a prova mais antiga de atuação
   como desenvolvedor.

### Projetos (`src/data/projects.ts`)

```ts
type Project = {
  id: string;
  category: 'ia' | 'fullstack' | 'landing';
  title: { pt: string; en: string };
  description: { pt: string; en: string };  // 1-2 linhas: problema resolvido
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
  year: number;
};
```

- Filtro por categoria (Todos · IA · Fullstack · Landing Pages), estado em React, transição
  via Framer Motion. Ordem padrão: IA → Fullstack → Landing Pages.
- Seis em destaque por padrão, com "Ver todos" e link para o GitHub.
- Distribuição prevista: 2 de IA, 4 fullstack, 3 landing pages. Seed com 9 entradas marcadas
  `// TODO: substituir`, com texto de tamanho realista para validar o layout.
- **Card tipográfico**: badge de categoria, ano, título, o problema resolvido, badges de stack,
  links. O campo `image` existe e, quando preenchido, renderiza como faixa superior — o card
  nunca depende dela. Link ausente = botão ausente; nada de botão morto.
- A descrição diz **qual problema foi resolvido**, não o que foi construído. "Chatbot WhatsApp"
  é fraco; "Chatbot que qualifica leads e agenda atendimentos automaticamente" é forte.

## 9. Internacionalização

- Dicionário tipado, sem biblioteca. `pt.ts` define a forma; `en.ts` é declarado como
  `typeof ptDictionary`, então **chave faltando no inglês quebra o `tsc`**.
- **Fronteira entre `data/` e `i18n/`**: `i18n/` guarda texto de interface (rótulos de nav,
  botões, títulos de seção); `data/` guarda registros, e campos que variam por idioma usam
  `{ pt, en }` dentro do próprio registro. Um projeto é editado num lugar só, nos dois idiomas.
- Toggle é um `<Link>` real que troca a rota, gravando a preferência em `localStorage`.
- **Preferência na raiz**: `public/index.html` escrito à mão lê `localStorage.lang`, envia para
  `/en/` quando for o caso e `/pt/` por padrão, com `<noscript>` de meta-refresh e `canonical`
  apontando para `/pt/`. É o único ponto do site onde `localStorage` importa.
- PT-BR é o padrão.

## 10. Acessibilidade, SEO e performance

- HTML semântico, contraste AA, navegação por teclado, `aria-label` em links de ícone,
  `alt` em imagens.
- `metadataBase = https://andrewfigueiredo.dev`, Open Graph com `/og-image.png` (1200×630),
  `hreflang` entre `/pt` e `/en`, favicon, `sitemap.xml`, `robots.txt`.
- Fontes via `next/font` (baixadas em build, servidas do próprio domínio).
- Alvo Lighthouse ≥ 95.
- `prefers-reduced-motion` respeitado: um único componente `<Reveal>` marcado `'use client'`
  usa `useReducedMotion()`. As seções permanecem Server Components.

## 11. Infraestrutura

**Dockerfile multi-stage.** Estágio 1 (`node:22-alpine`): `npm ci`, `npm run build` → `out/`.
Estágio 2 (`nginx:1.27-alpine`): copia `out/` e a config. A imagem final não contém Node,
`node_modules` nem código-fonte.

**docker-compose.yml — dois serviços**: `web` e `certbot`, com volumes compartilhados
`/etc/letsencrypt` e `/var/www/certbot`. Certbot roda `renew` em laço de 12h; `web` recarrega
o Nginx no mesmo intervalo para adotar certificado renovado sem downtime.

**Nginx.** Porta 80 libera `/.well-known/acme-challenge/` e redireciona o resto para HTTPS.
`www.andrewfigueiredo.dev` → apex. No apex: serve os arquivos estáticos, `cache-control:
immutable` de um ano em `/_next/static/`, sem cache no HTML. Headers de segurança: HSTS,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, CSP.

**Compressão:** `gzip_static` com `.gz` pré-comprimidos no build. Brotli exigiria compilar
o Nginx com `ngx_brotli`, trocando uma imagem oficial por uma imagem a manter — fora de escopo.

**CSP:** precisará de `'unsafe-inline'` em `script-src` por causa dos scripts inline de
hidratação do Next.js. Entregar com comentário documentando o caminho de endurecimento por
hash. Como `next/font` serve as fontes localmente, a CSP não precisa liberar o Google Fonts.

**`scripts/init-letsencrypt.sh`** para emissão inicial, com passo em staging antes da emissão
de produção.

## 12. CI/CD

`.github/workflows/deploy.yml` — trigger em `push` para `main` e `workflow_dispatch`.

- **Job 1 (CI):** `npm ci`, lint, `tsc --noEmit`. **Não** roda `npm run build` — o build
  acontece uma única vez, dentro do build da imagem no Job 2. Duplicá-lo aqui anularia a
  razão de ter tirado a compilação da VPS.
- **Job 2 (Build & Push):** builda a imagem (o `npm run build` roda no estágio 1 do
  Dockerfile) e publica no GitHub Container Registry. Uma falha de build reprova o job.
- **Job 3 (Deploy):** condicionado aos anteriores. SSH via `appleboy/ssh-action`,
  `docker compose pull && docker compose up -d`, `docker image prune -f`, health check final
  com `curl -f https://andrewfigueiredo.dev`.

A VPS nunca vê o código-fonte: recebe uma imagem com o site já compilado e o Nginx
configurado, e `git pull` na VPS deixa de existir no processo. Se o build quebrar, ele quebra
no Actions e o site em produção segue intacto.

**Aprovado pelo autor em 2026-08-02.**

**Visibilidade do pacote no GHCR:** público. A VPS baixa a imagem sem autenticação, evitando
mais um segredo para administrar e rotacionar. O site é público de qualquer forma. Se um dia
for necessário torná-lo privado, a VPS passa a exigir `docker login ghcr.io` com um token de
leitura, que entra como secret adicional.

Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`, `VPS_APP_PATH`.
Nenhum IP, usuário ou chave versionado. `.env` + `.env.example`.

## 13. Documentação (README.md)

1. Como rodar localmente
2. Onde editar conteúdo (`src/data/`, `src/i18n/`)
3. Registros DNS: A record de `andrewfigueiredo.dev` e `www` para a VPS
4. Preparação da VPS: Docker, Docker Compose, usuário de deploy, chave SSH, firewall (80/443)
5. Emissão inicial do certificado e verificação da renovação automática
6. Cadastro dos secrets no GitHub e disparo do deploy
7. Justificativa da escolha de `output: 'export'`

## 14. Pendências de conteúdo

Bloqueiam o conteúdo final, não a construção do site. O site sobe com marcadores visíveis.

- [x] Datas confirmadas: ENACOM Jul/2021 – Out/2024 (encerrada em 30/10/2024, imediatamente
      antes da CODATA); CODATA Nov/2024 – atual; Keep Chat Set/2025 – atual, perfil Analista de TI
- [x] Keep Chat não tem artefato público por enquanto — usar o link do edital como referência.
      Revisitar quando houver site, repositório ou material de curso publicado
- [ ] Nove projetos reais substituindo o seed
- [x] `og-image.png` (1200×630) deixa de ser pendência de conteúdo: é gerada de um template
      HTML por `npm run og`. O metadata a referencia, e imagem referenciada e ausente quebraria
      o preview de todo link compartilhado
- [x] CV em `public/cv-andrew-figueiredo.pdf` (cópia do PT-BR atual). Substituir pela versão
      revisada; decidir se haverá versão EN
- [ ] Métricas nos bullets de experiência, onde existirem

## 15. Fora de escopo

Blog / seção de escrita (é a alavanca de autoridade mais forte a médio prazo, e a arquitetura
deixa a porta aberta em `app/[lang]/`, mas exige produção de conteúdo). Backend, banco,
formulário com submit, analytics, tema escuro, Brotli, CSP por hash.

## 16. Migração da Sonhai

`index.html` sai do topo do repositório. O histórico git preserva o conteúdo — anotar no
README o SHA `74d877a` como ponto de recuperação. A Sonhai passa a ser um projeto próprio,
com repositório e domínio próprios, fora do escopo desta spec.

---

## 17. Adendo de 2026-08-03 — a VPS não estava vazia

As seções 11 (Infraestrutura) e 12 (CI/CD) foram escritas assumindo uma VPS dedicada. A
inspeção do servidor mostrou o contrário, e **essas duas seções estão obsoletas**.

O que se descobriu:

- As portas 80 e 443 pertencem ao container `admin_corretor-nginx-1`, um Nginx compartilhado
  que atende cinco hostnames, incluindo o apex `andrewfigueiredo.dev`.
- O apex já servia uma tela de "portfólio em breve" como **arquivos estáticos** do diretório
  `/opt/andrew-portfolio`, montado read-only no Nginx.
- O TLS é certificado de origem da **Cloudflare**, compartilhado entre os subdomínios. Não é
  Let's Encrypt.

Subir o `docker-compose` desta spec teria falhado por conflito de porta — ou, no pior caso,
derrubado `admin_corretor`, `n8n` e `evolution_go` junto.

**Decisão do autor em 2026-08-03:** o deploy passa a ser `rsync` do `out/` para
`/opt/andrew-portfolio`. Dockerfile, docker-compose, configuração de Nginx própria e o script
do Certbot foram removidos do repositório. O ambiente real está documentado em
`infra/vps/README.md`, com cópias da config do apex e do placeholder anterior.

Restrição permanente: **este projeto é dono apenas do apex.** Nenhuma automação deste
repositório pode criar, reiniciar ou parar containers, nem fazer bind em porta.
