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
