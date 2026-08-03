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
sudo chmod 700 /home/deploy/.ssh
# cole a chave pública em /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys

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

O GitHub Actions faz todo o trabalho; a VPS só baixa a imagem pronta e nunca compila.

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

## Documentação de projeto

- Spec de design: `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`
- Plano de implementação: `docs/superpowers/plans/2026-08-02-portfolio-andrew-figueiredo.md`

## Histórico

Este repositório hospedou antes a landing institucional da Sonhai. O conteúdo está preservado
no commit `74d877a`.
