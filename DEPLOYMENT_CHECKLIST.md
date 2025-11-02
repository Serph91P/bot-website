# 🚀 Deployment Checkliste

## ✅ Vorbereitung (lokal)

- [x] Repository geklont
- [x] `.env.local` mit Entwicklungs-Werten erstellt
- [x] `npm install` ausgeführt
- [x] Emby-Login getestet (funktioniert!)
- [x] n8n Workflow-Migration verstanden

## 📦 n8n Workflow Setup

### Schritt 1: Workflow importieren
1. In n8n einloggen
2. "New Workflow" → "Import from file"
3. `Telegram Chat Bot_ TV Status.json` hochladen (deine Vorlage)
4. Workflow umbenennen zu "Web TV Sender Check"

### Schritt 2: Nodes anpassen
Gemäß `N8N_WORKFLOW_MIGRATION.md`:

- [ ] **Telegram Trigger** → `Webhook Trigger`
  - Path: `sender-search`
  - HTTP Method: POST
  - Response Mode: `responseNode`
  
- [ ] **Action Router** hinzufügen (prüft `body.action`)
  - `action === "search"` → Parse Query
  - `action === "select"` → Parse Selection
  
- [ ] **Parse Query** anpassen
  - Input: `$json.body.senderName`
  - Output: `channel_query`, `user_id`
  
- [ ] **Parse Selection** erstellen
  - Input: `$json.body.senderId`
  - Output: `chosen_id`, `user_id`
  
- [ ] **DB Search** kopieren (identisch!)
  - Postgres Query unverändert lassen
  
- [ ] **Match Channel** anpassen
  - `chat_id` → `user_id`
  
- [ ] **Respond to Webhook** Nodes erstellen:
  - Needs Selection: `{ status: "needs_selection", senders: [...] }`
  - Start Check: `{ status: "checking", senderId: ... }`
  - Not Found: `{ status: "error", message: "..." }`
  
- [ ] **HTTP Test + SSH** kopieren (identisch!)
  
- [ ] **Send to Website** Node erstellen
  - Type: HTTP Request
  - Method: POST
  - URL: `https://your-domain.com/api/n8n/webhook`
  - Auth: Header Auth (`X-N8N-Webhook-Secret`)
  - Body: `{ userId, senderId, status, message, details }`

### Schritt 3: Credentials einrichten
- [ ] Postgres Credentials verbinden
- [ ] SSH Credentials (falls vorhanden) verbinden
- [ ] Header Auth Credential für Webseite erstellen
  - Name: `X-N8N-Webhook-Secret`
  - Value: (gleicher Wert wie in `.env`)

### Schritt 4: Testen
- [ ] Workflow aktivieren
- [ ] Test mit curl gegen Webhook:
  ```bash
  curl -X POST https://your-n8n.com/webhook/sender-search \
    -H "Content-Type: application/json" \
    -d '{"action":"search","senderName":"Sky Bundesliga","userId":"test"}'
  ```
- [ ] Response prüfen (senders-Array oder checking-Status)

## 🐳 Docker Build & Deploy

### Schritt 1: Environment Variables vorbereiten
Erstelle auf dem Server `/opt/bot-website/.env`:

```bash
# Emby Server
EMBY_SERVER_URL=https://your-emby-server.com
EMBY_API_KEY=your-emby-api-key

# n8n
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/sender-search
N8N_WEBHOOK_SECRET=generate-random-secret-here

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Production
NODE_ENV=production
```

### Schritt 2: Docker Image bauen
```bash
# Auf Server oder in CI/CD
docker build -t bot-website:latest .
```

**Oder:** Push zu GitHub → GitHub Actions baut automatisch!

### Schritt 3: Container starten
```bash
docker run -d \
  --name bot-website \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file /opt/bot-website/.env \
  bot-website:latest
```

**Oder mit docker-compose:**
```bash
cd /opt/bot-website
docker-compose up -d
```

### Schritt 4: Health Check
```bash
curl http://localhost:3000/api/health
# Erwartete Antwort: {"status":"ok"}
```

## 🔒 Reverse Proxy Setup

### Nginx Beispiel
Erstelle `/etc/nginx/sites-available/bot-website`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Certificates (z.B. Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Proxy Settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktivieren:
```bash
ln -s /etc/nginx/sites-available/bot-website /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Traefik Beispiel (docker-compose.yml)
```yaml
services:
  bot-website:
    image: bot-website:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.bot-website.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.bot-website.entrypoints=websecure"
      - "traefik.http.routers.bot-website.tls.certresolver=letsencrypt"
      - "traefik.http.services.bot-website.loadbalancer.server.port=3000"
```

## 🧪 Finale Tests

### 1. Login testen
```bash
# Browser öffnen
https://your-domain.com/login

# Mit Emby-Credentials einloggen
# Sollte zu /dashboard weiterleiten
```

### 2. Sender-Suche testen
```bash
# Im Dashboard Sender eingeben: "Sky Bundesliga"
# Erwartete Reaktion:
# - Liste von Sendern erscheint ODER
# - "Prüfe Sky Bundesliga..." Nachricht
```

### 3. Status-Update testen
```bash
# Nach n8n Test sollte Status aktualisiert werden
# Entweder durch:
# - Polling (alle 5 Sekunden)
# - SSE (wenn implementiert)
```

### 4. PWA Installation testen
```bash
# Mobile: Browser-Menü → "Zum Startbildschirm hinzufügen"
# Desktop: URL-Leiste → Install-Icon klicken
```

## 📊 Monitoring

### Logs prüfen
```bash
# Docker Logs
docker logs -f bot-website

# Nginx Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# n8n Workflow Executions
# → n8n Web UI → Executions Tab
```

### Health Checks
```bash
# Webseite
curl https://your-domain.com/api/health

# n8n Webhook
curl -X POST https://your-n8n.com/webhook/sender-search \
  -H "Content-Type: application/json" \
  -d '{"action":"search","senderName":"test","userId":"test"}'
```

## 🔧 Troubleshooting

### Container startet nicht
```bash
# Logs checken
docker logs bot-website

# Häufige Ursachen:
# - .env fehlt oder falsch
# - Port 3000 bereits belegt
# - NEXTAUTH_SECRET fehlt
```

### Login funktioniert nicht
```bash
# Emby-Server erreichbar?
curl -I $EMBY_SERVER_URL

# API-Key korrekt?
# → Emby Dashboard → API Keys prüfen
```

### n8n Callback kommt nicht an
```bash
# Webhook-Secret stimmt überein?
# - .env: N8N_WEBHOOK_SECRET
# - n8n: Header Auth Credential

# Firewall-Regeln prüfen
# n8n muss Webseite erreichen können
```

### PWA funktioniert nicht
```bash
# HTTPS erforderlich!
# Service Worker nur über HTTPS (außer localhost)

# Manifest prüfen
curl https://your-domain.com/manifest.json

# Service Worker prüfen
# Browser DevTools → Application → Service Workers
```

## ✅ Deployment abgeschlossen!

Wenn alle Schritte ✅ sind:

🎉 **Glückwunsch!** Deine TV-Sender-Check PWA ist live!

### Nächste Schritte (optional):

- [ ] GitHub Actions für automatisches Deployment einrichten
- [ ] Backup-Strategie für Postgres DB (n8n)
- [ ] Monitoring mit Uptime Kuma / Grafana
- [ ] PWA Icons generieren (verschieden Größen)
- [ ] Dark Mode implementieren
- [ ] Push-Benachrichtigungen aktivieren

---

**Dokumentation:**
- `README.md` - Allgemeine Projekt-Info
- `N8N_WORKFLOW_MIGRATION.md` - Workflow-Konvertierung
- `N8N_INTEGRATION.md` - n8n Integration Details
- `DOCKER.md` - Docker-Dokumentation
