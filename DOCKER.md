# Docker Deployment Guide

## Schnellstart mit Docker Compose

### 1. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env` Datei im Projekt-Root:

```bash
cp .env.docker.example .env
```

Bearbeiten Sie `.env` und tragen Sie Ihre Werte ein:

```env
EMBY_SERVER_URL=https://ihr-emby-server.de
EMBY_API_KEY=ihr-emby-api-key
N8N_WEBHOOK_URL=https://ihre-n8n-instanz.de/webhook
N8N_CALLBACK_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://ihre-domain.de
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 2. Container starten

```bash
# Build und Start
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Status prüfen
docker-compose ps
```

### 3. Zugriff

Die App ist nun verfügbar unter:
- **http://localhost:3000** (Standard)
- Oder dem Port, den Sie in `.env` als `PORT` definiert haben

### 4. Container stoppen

```bash
# Stoppen
docker-compose stop

# Stoppen und entfernen
docker-compose down

# Mit Volumes entfernen
docker-compose down -v
```

## Standalone Docker (ohne Compose)

### Build

```bash
docker build -t bot-website .
```

### Run

```bash
docker run -d \
  --name bot-website \
  -p 3000:3000 \
  -e EMBY_SERVER_URL=https://ihr-emby-server.de \
  -e EMBY_API_KEY=ihr-api-key \
  -e N8N_WEBHOOK_URL=https://ihre-n8n-instanz.de/webhook \
  -e N8N_CALLBACK_SECRET=ihr-secret \
  -e NEXTAUTH_URL=https://ihre-domain.de \
  -e NEXTAUTH_SECRET=ihr-nextauth-secret \
  -e NODE_ENV=production \
  --restart unless-stopped \
  bot-website
```

### Mit .env File

```bash
docker run -d \
  --name bot-website \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  bot-website
```

## Erweiterte Docker Compose (mit Nginx)

Für Production-Deployments mit HTTPS:

```bash
docker-compose -f docker-compose.extended.yml up -d
```

### Nginx Konfiguration (optional)

Erstellen Sie `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream bot-website {
        server bot-website:3000;
    }

    server {
        listen 80;
        server_name ihre-domain.de;

        location / {
            proxy_pass http://bot-website;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # HTTPS Configuration
    # server {
    #     listen 443 ssl;
    #     server_name ihre-domain.de;
    #
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #
    #     location / {
    #         proxy_pass http://bot-website;
    #         proxy_http_version 1.1;
    #         proxy_set_header Upgrade $http_upgrade;
    #         proxy_set_header Connection 'upgrade';
    #         proxy_set_header Host $host;
    #         proxy_cache_bypass $http_upgrade;
    #     }
    # }
}
```

## Health Check

Der Container hat einen Health-Check auf `/api/health`:

```bash
# Manuell testen
curl http://localhost:3000/api/health

# Response:
# {"status":"ok","timestamp":"2025-11-01T15:00:00.000Z","service":"bot-website"}
```

## Docker Hub / GitHub Container Registry

### Tag und Push

```bash
# GitHub Container Registry
docker tag bot-website ghcr.io/USERNAME/bot-website:latest
docker push ghcr.io/USERNAME/bot-website:latest

# Docker Hub
docker tag bot-website USERNAME/bot-website:latest
docker push USERNAME/bot-website:latest
```

### Pull und Run

```bash
# Von GitHub Container Registry
docker pull ghcr.io/USERNAME/bot-website:latest
docker run -d -p 3000:3000 --env-file .env ghcr.io/USERNAME/bot-website:latest

# Von Docker Hub
docker pull USERNAME/bot-website:latest
docker run -d -p 3000:3000 --env-file .env USERNAME/bot-website:latest
```

## Portainer Integration

Wenn Sie Portainer verwenden:

1. **Stack erstellen** in Portainer UI
2. **docker-compose.yml** hochladen oder einfügen
3. **Environment Variables** über Portainer UI setzen
4. **Deploy the stack**

## Watchtower für Auto-Updates

Fügen Sie Watchtower zu `docker-compose.yml` hinzu:

```yaml
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 300 bot-website
```

## Troubleshooting

### Container startet nicht

```bash
# Logs prüfen
docker-compose logs bot-website

# Interaktiv debuggen
docker-compose run --rm bot-website sh
```

### Port bereits belegt

Ändern Sie den Port in `.env`:

```env
PORT=3001
```

### Umgebungsvariablen prüfen

```bash
docker-compose exec bot-website env | grep -E "EMBY|N8N|NEXTAUTH"
```

### Container neu bauen

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Production Checklist

- [ ] HTTPS aktiviert (Nginx/Traefik/Caddy)
- [ ] Sichere Secrets generiert
- [ ] `NEXTAUTH_URL` auf Production-Domain gesetzt
- [ ] Health Checks funktionieren
- [ ] Logs werden überwacht
- [ ] Backups konfiguriert (falls Sessions in DB)
- [ ] Rate Limiting aktiviert
- [ ] Firewall-Regeln gesetzt

## Weitere Informationen

- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose/
- Next.js Deployment: https://nextjs.org/docs/deployment
