# andrewfigueiredo.dev

Portfólio pessoal de Andrew Figueiredo — desenvolvimento de sistemas, consultoria em IA e
automação. Site estático bilíngue (PT-BR / EN) em Next.js, publicado por rsync num Nginx
compartilhado que já roda na VPS.

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
inglês quebra o `npm run typecheck` — a paridade é garantida pelo compilador, não por revisão.

Campos que variam por idioma dentro de `src/data/` usam `{ pt, en }` no próprio registro, para
que um projeto seja editado num lugar só, nos dois idiomas.

## Por que `output: 'export'`

O site não tem backend, banco, formulário com submit nem conteúdo que mude em runtime — tudo é
conhecido em build time. Com export estático, o Nginx serve arquivos direto: não há processo
Node em produção para monitorar, reiniciar ou atualizar por segurança.

O custo é que `middleware.ts` não existe. Duas consequências no projeto: o redirect da raiz é
feito por `public/index.html` (que lê a preferência de idioma do `localStorage`), e `next/image`
roda com `unoptimized: true`, com as imagens dimensionadas antes do commit.

`trailingSlash: true` é obrigatório: o export gera `out/pt/index.html`, e sem ele `/pt` e `/pt/`
passariam a existir como conteúdo duplicado aos olhos do Google.

## Onde o site roda

O apex `andrewfigueiredo.dev` é servido como **arquivos estáticos** por um Nginx compartilhado
que já roda na VPS — o container `admin_corretor-nginx-1`, que também atende `imov.`, `robot.`,
`evolutionapi.` e `anderson.` no mesmo par de portas.

Este projeto **não sobe Nginx, Certbot nem container próprio**. Publicar significa colocar o
conteúdo de `out/` em `/opt/andrew-portfolio`, diretório montado read-only no Nginx e usado
apenas pelo apex.

O TLS é certificado de origem da Cloudflare, compartilhado entre os subdomínios e renovado fora
deste repositório. Let's Encrypt e Certbot não têm papel aqui.

Detalhes do ambiente, incluindo a config atual do Nginx e o mapa de domínios:
[`infra/vps/README.md`](infra/vps/README.md).

## DNS

Já configurado e em produção. Os registros do apex apontam para a VPS através da Cloudflare.
Nada a fazer aqui — mexer no DNS afeta todos os subdomínios.

## Deploy

Um `push` na `main` dispara build no GitHub Actions e sincroniza o resultado por `rsync`.

```
git push origin main
  └─ Job 1  npm ci · lint · typecheck · test
     Job 2  npm run build → confere out/ → rsync para /opt/andrew-portfolio → health check
```

O deploy escreve num único diretório. Nenhum container é criado, reiniciado ou parado, e
nenhuma porta é tocada — por isso os outros domínios ficam fora de risco.

Secrets em **Settings › Secrets and variables › Actions**:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | usuário com escrita em `/opt/andrew-portfolio` |
| `VPS_SSH_KEY` | conteúdo da chave **privada** |
| `VPS_PORT` | `22` |
| `VPS_APP_PATH` | `/opt/andrew-portfolio` |

Dispare manualmente em **Actions › Deploy › Run workflow**.

### Se a publicação parecer não ter surtido efeito

O suspeito número um é **cache da Cloudflare**, não o rsync. Confirme o que está na VPS antes
de investigar o pipeline:

```bash
ssh <user>@<host> 'ls -la /opt/andrew-portfolio | head'
```

### Publicar manualmente, se precisar

```bash
npm run build
rsync -az --delete out/ <user>@<host>:/opt/andrew-portfolio/
```

## Documentação de projeto

- Spec de design: `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`
- Plano de implementação: `docs/superpowers/plans/2026-08-02-portfolio-andrew-figueiredo.md`

## Histórico

Este repositório hospedou antes a landing institucional da Sonhai. O conteúdo está preservado
no commit `74d877a`.
