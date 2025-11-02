# Bot Website - Docker Schnellstart

Dieses Verzeichnis enthält alle notwendigen Docker-Konfigurationen.

## 🚀 Schnellstart (Empfohlen)

### Automatisches Setup-Script

```bash
./docker-start.sh
```

Das Script:
- ✅ Prüft Docker-Installation
- ✅ Erstellt .env mit sicheren Secrets
- ✅ Baut das Docker Image
- ✅ Startet die Container
- ✅ Zeigt Zugriffs-URL

### Mit Makefile

```bash
# Alle verfügbaren Befehle anzeigen
make help

# Schnellstart
make env          # .env erstellen
make secrets      # Secrets generieren
make docker-up    # Container starten

# Logs anzeigen
make docker-logs
```

## 📋 Manuelle Schritte

### 1. Environment-Datei erstellen

```bash
cp .env.docker.example .env
```

Bearbeiten Sie `.env`:

```env
EMBY_SERVER_URL=https://ihr-emby-server.de
EMBY_API_KEY=ihr-api-key
N8N_WEBHOOK_URL=https://ihre-n8n-instanz.de/webhook
N8N_CALLBACK_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 2. Container starten

```bash
docker-compose up -d
```

### 3. Zugriff

App verfügbar unter: **http://localhost:3000**

## 📁 Docker-Dateien

| Datei | Beschreibung |
|-------|-------------|
| `Dockerfile` | Multi-stage Build für optimale Image-Größe |
| `docker-compose.yml` | Standard Docker Compose Konfiguration |
| `docker-compose.extended.yml` | Erweitert mit Nginx (optional) |
| `.dockerignore` | Dateien die nicht ins Image kopiert werden |
| `.env.docker.example` | Beispiel für Umgebungsvariablen |
| `docker-start.sh` | Automatisches Setup-Script |
| `Makefile` | Shortcuts für Docker-Befehle |
| `DOCKER.md` | Ausführliche Docker-Dokumentation |

## 🔧 Häufige Befehle

```bash
# Container Status
docker-compose ps

# Logs anzeigen
docker-compose logs -f

# Container stoppen
docker-compose stop

# Container neu starten
docker-compose restart

# Container stoppen und entfernen
docker-compose down

# Image neu bauen
docker-compose build --no-cache

# In Container-Shell
docker-compose exec bot-website sh
```

## 🌐 Production Deployment

Für Production mit HTTPS:

```bash
docker-compose -f docker-compose.extended.yml up -d
```

Siehe `DOCKER.md` für Details zu:
- Nginx Reverse Proxy Setup
- SSL/TLS Konfiguration
- Monitoring und Logging
- Auto-Updates mit Watchtower

## 🔐 Sicherheit

**Wichtig für Production:**

1. Ändern Sie alle Secrets in `.env`
2. Nutzen Sie HTTPS (Nginx/Traefik/Caddy)
3. Setzen Sie `NEXTAUTH_URL` auf Ihre echte Domain
4. Konfigurieren Sie Firewall-Regeln
5. Aktivieren Sie automatische Updates

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Container Metriken

```bash
docker stats bot-website
```

## 🐛 Troubleshooting

### Port bereits belegt

```bash
# Port in .env ändern
echo "PORT=3001" >> .env
docker-compose up -d
```

### Container startet nicht

```bash
# Logs prüfen
docker-compose logs bot-website

# Environment-Variablen prüfen
docker-compose exec bot-website env
```

### Änderungen werden nicht übernommen

```bash
# Neu bauen ohne Cache
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Weitere Dokumentation

- **DOCKER.md** - Vollständige Docker-Dokumentation
- **README.md** - Projekt-Übersicht
- **SETUP_COMPLETE.md** - Setup-Anleitung
