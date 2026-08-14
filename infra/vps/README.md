# Infraestrutura da VPS — como o apex é servido

Documentação do ambiente real onde `andrewfigueiredo.dev` roda. Os arquivos desta pasta são
**cópias de leitura** do que existe na VPS, versionadas para referência. Nada aqui é aplicado
automaticamente.

## O ambiente

A VPS não é dedicada a este site. Ela hospeda vários stacks em `/opt`:

| Stack | O que é |
|---|---|
| `/opt/admin_corretor` | aplicação (frontend, backend, postgres) **e o Nginx compartilhado** |
| `/opt/n8n` | n8n + postgres |
| `/opt/evolution-go` | Evolution API |
| `/opt/glicemia` | uptime-kuma + redis |

As portas **80 e 443 pertencem ao container `admin_corretor-nginx-1`**, que atua como reverse
proxy de todos os domínios:

| Hostname | Servido como |
|---|---|
| `andrewfigueiredo.dev` + `www` | **estáticos de `/opt/andrew-portfolio`** ← este projeto |
| `anderson.andrewfigueiredo.dev` | estáticos de `/opt/anderson-portfolio` |
| `imov.andrewfigueiredo.dev` | proxy para `backend` / `frontend` |
| `robot.andrewfigueiredo.dev` | proxy para `n8n-n8n-1:5678` |
| `evolutionapi.andrewfigueiredo.dev` | proxy para `evolution_go:8080` |

## Consequências para este projeto

**Não subimos Nginx, Certbot ou container próprio.** O apex já é servido por um Nginx que
existe, com TLS resolvido. Publicar significa apenas colocar os arquivos no diretório certo.

**TLS não é Let's Encrypt.** O certificado é de origem da Cloudflare
(`/etc/letsencrypt/cloudflare/andrewfigueiredo.dev.pem`), compartilhado por todos os
subdomínios e renovado fora deste repositório. Certbot não tem papel aqui.

**O deploy escreve em um único diretório**, `/opt/andrew-portfolio`, usado só pelo apex.
Nenhum container é criado, reiniciado ou parado; nenhuma porta é tocada. É o que mantém os
outros domínios fora de risco.

**A Cloudflare fica na frente.** Se uma publicação parecer não ter surtido efeito, o suspeito
número um é cache da Cloudflare, não o rsync.

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `apex-nginx-atual.conf` | os dois `server` blocks do apex, copiados de `/opt/admin_corretor/docker/nginx/nginx.conf` |
| `placeholder-atual.html` | a tela de "portfólio em breve" que ocupava `/opt/andrew-portfolio` antes deste projeto |

O `try_files $uri $uri/ /index.html` do bloco do apex **já funciona** com a saída deste
projeto, sem alteração: `/` serve o `index.html` que redireciona por idioma, `/pt/` serve
`/pt/index.html`, e os assets resolvem direto.

## Se um dia precisar editar a config do Nginx

O arquivo vive em `/opt/admin_corretor/docker/nginx/nginx.conf` no host e é montado read-only
no container. **Ele é compartilhado com os outros domínios** — edite apenas os blocos cujo
`server_name` é `andrewfigueiredo.dev`, valide com `docker exec admin_corretor-nginx-1 nginx -t`
antes de recarregar, e recarregue com `docker exec admin_corretor-nginx-1 nginx -s reload`.
Um erro de sintaxe aqui derruba todos os domínios de uma vez.
