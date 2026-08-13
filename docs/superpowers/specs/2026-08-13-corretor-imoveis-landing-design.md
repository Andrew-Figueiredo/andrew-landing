# Landing de corretor de imóveis — "Meu Cantinho Imóveis"

Data: 2026-08-13
Status: aprovado, aguardando implementação
Projeto: 1 de 9 (categoria `landing`) do plano descrito em
`docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md` seção 14.

## Contexto

`src/data/projects.ts` (no repo `andrew-landing`) tem 9 projetos seed marcados
`// TODO: substituir`. Este é o primeiro dos 3 projetos de categoria `landing` a ganhar
implementação real, cada um em seu próprio repositório standalone — **este projeto NÃO vive
dentro do repo `andrew-landing`**, apenas sua spec é versionada aqui até o repo novo existir.
Só depois que o repo novo e o deploy existirem, a entrada correspondente em `projects.ts` ganha
`repoUrl` real.

Decisões que se aplicam a todos os 9 projetos (ver memória do projeto / spec principal seção 14):
cenário inventado-mas-plausível, stack padrão Next.js + TypeScript + Tailwind, projetos
`landing` ganham demo ao vivo (Vercel, deploy automático no push).

## Cenário

Imobiliária fictícia de porte pequeno/médio, foco em imóveis populares/classe média (não alto
padrão). Nome: **Meu Cantinho Imóveis**. Problema que o site resolve: corretor autônomo sem
presença digital perde lead pra concorrência que já tem catálogo pesquisável online; o site dá
um catálogo filtrável com contato direto por WhatsApp, sem fricção de formulário.

Identidade visual: popular/acessível — paleta vibrante (verde + laranja/coral), tipografia sans
arredondada, tom de copy direto e amigável (não corporativo, não luxo).

Idioma: **PT-BR apenas**. Diferente do portfólio principal (bilíngue PT/EN), aqui não há
justificativa de negócio pra inglês — é um negócio local brasileiro.

## Rotas

Next.js App Router, `output: 'export'` (mesmo padrão do portfólio principal:
`trailingSlash: true`, `images.unoptimized: true`, `dynamicParams = false`).

- `/` — home: hero, imóveis em destaque (3–4 cards), diferenciais da imobiliária, CTA WhatsApp geral
- `/imoveis` — listagem completa + filtro (tipo, faixa de preço, quartos, bairro)
- `/imoveis/[slug]` — detalhe do imóvel: galeria de fotos, ficha técnica, mapa/localização
  aproximada, CTA WhatsApp "agendar visita" com mensagem pré-preenchida
- `/sobre` — corretor, contato, WhatsApp

Slugs gerados via `generateStaticParams` a partir do array estático de imóveis.

## Modelo de dados

`src/data/imoveis.ts`, array estático tipado (sem CMS, sem backend):

```ts
type Imovel = {
  slug: string;
  titulo: string;
  tipo: 'casa' | 'apartamento' | 'terreno';
  precoCentavos: number;
  quartos: number;
  bairro: string;
  areaM2: number;
  banheiros: number;
  vagas: number;
  caracteristicas: string[]; // ex: "piscina", "churrasqueira"
  descricao: string;
  fotos: string[]; // paths locais, baixados de Unsplash/Pexels (uso livre)
  destaque: boolean; // aparece na home
};
```

15–20 registros. Preço em centavos (evita bug de float). Bairros fictícios dentro de uma cidade
fictícia (evita associar a endereço real). Fotos: stock photos gratuitas (Unsplash/Pexels),
baixadas e commitadas no repo — imóveis fictícios, fotos reais, aparência pronta pra mostrar em
portfólio (não placeholder cinza).

Pelo menos 1 imóvel `destaque: true` por `tipo`, pra home nunca ficar vazia numa categoria.

## Componentes

- `Hero` — server component
- `ImovelCard` — server component: foto, preço, resumo, link pra `/imoveis/[slug]`
- `FiltroImoveis` — **único client component com estado** (`'use client'`): tipo, faixa de
  preço, quartos, bairro. Filtragem client-side sobre o array recebido via props (array pequeno,
  sem paginação/backend necessário)
- `GaleriaFotos` — client component simples: troca de foto ativa, sem lib externa
- `FichaTecnica`, `MapaAproximado` — server components, somente leitura de dados
- `WhatsAppCTA` — server component: monta link `https://wa.me/<numero>?text=<mensagem>`

Padrão de isolar estado em poucos client components, igual ao portfólio principal (lá é
`Reveal.tsx` + `Projects.tsx`; aqui é `FiltroImoveis` + `GaleriaFotos`).

## CTA — WhatsApp deep link

Decisão (não form com submit simulado): `<a href="https://wa.me/<numero>?text=...">` puro, sem
JS de submit, sem persistência, sem backend. Consistente com a regra do site principal ("sem
backend, banco ou formulário com submit").

Número fictício fixo (ex: `5511999999999`). Mensagem pré-preenchida e URL-encoded:
`"Olá! Tenho interesse no imóvel: {titulo} ({bairro})"`. Função pura `gerarLinkWhatsApp(imovel)`
centraliza a montagem — testável isoladamente.

## Deploy e repositório

- Repositório novo standalone (fora de `andrew-landing`), nome de trabalho
  `corretor-imoveis-landing` (confirmar no momento da criação).
- Mesmo setup base do portfólio principal: Next.js + TypeScript + Tailwind, `output: 'export'`.
- Deploy: **Vercel**, auto-deploy no push. Diferente do site principal (VPS compartilhada +
  rsync) — aqui é projeto isolado, Vercel free tier resolve sem infra extra.
- README do repo novo: screenshots + descrição do **problema resolvido** (não do que foi
  construído), seguindo a convenção de projeto do portfólio principal.
- Este spec deve ser copiado/adaptado para dentro do repo novo quando ele for criado (convenção
  daqui em diante: cada projeto dos 9 mantém sua própria spec dentro do seu próprio repo, não
  só aqui em `andrew-landing`).

## Testes

Vitest, espelhando o padrão de `src/data/data.test.ts` do portfólio principal:

- **Invariantes do seed**: `slug` único, 15–20 registros, todo `tipo` dentro do union válido,
  pelo menos 1 `destaque: true` por `tipo`
- **`filtrarImoveis(imoveis, criterios)`**: função pura extraída de `FiltroImoveis`, testa
  combinações de critérios (tipo + faixa de preço + quartos + bairro, isolado e combinado)
- **`gerarLinkWhatsApp(imovel)`**: função pura, testa URL-encoding correto e conteúdo da
  mensagem

Sem E2E — escopo pequeno, sem backend/estado de servidor pra quebrar.

## Fora de escopo

- Formulário de contato com submit (mesmo simulado) — decidido a favor do WhatsApp deep link
- CMS ou fonte de dados externa — array estático no repo
- Paginação de listagem — 15–20 imóveis não justifica
- Seção "imóveis semelhantes" na página de detalhe — descartada na revisão de design
- Bilíngue PT/EN — só PT-BR
- Mapa interativo real (Google Maps embed com API key) — "mapa aproximado" é ilustrativo/estático
