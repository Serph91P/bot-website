#!/bin/bash
# 🚀 Bot Website - Server Deployment Script
# Dieses Script deployed die Webseite auf deinem Server

set -e  # Exit on error

echo "🚀 Bot Website Deployment"
echo "========================="
echo ""

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Konfiguration
APP_NAME="bot-website"
APP_DIR="/opt/${APP_NAME}"
DOCKER_IMAGE="${APP_NAME}:latest"

# Funktionen
function info() {
    echo -e "${GREEN}✓${NC} $1"
}

function warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

function error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

# Schritt 1: Voraussetzungen prüfen
echo "📋 Schritt 1: Voraussetzungen prüfen..."
if ! command -v docker &> /dev/null; then
    error "Docker ist nicht installiert! Bitte installiere Docker zuerst."
fi
info "Docker ist installiert"

if ! command -v docker-compose &> /dev/null; then
    warn "docker-compose ist nicht installiert. Verwende 'docker compose' stattdessen."
fi

# Schritt 2: Verzeichnis erstellen
echo ""
echo "📁 Schritt 2: App-Verzeichnis vorbereiten..."
if [ ! -d "$APP_DIR" ]; then
    sudo mkdir -p "$APP_DIR"
    sudo chown $USER:$USER "$APP_DIR"
    info "Verzeichnis erstellt: $APP_DIR"
else
    info "Verzeichnis existiert bereits"
fi

# Schritt 3: Repository klonen oder aktualisieren
echo ""
echo "📦 Schritt 3: Code aktualisieren..."
if [ ! -d "$APP_DIR/.git" ]; then
    echo "Git Repository URL eingeben:"
    read -r REPO_URL
    git clone "$REPO_URL" "$APP_DIR"
    info "Repository geklont"
else
    cd "$APP_DIR"
    git pull
    info "Repository aktualisiert"
fi

cd "$APP_DIR"

# Schritt 4: Environment Variables
echo ""
echo "🔐 Schritt 4: Environment Variables konfigurieren..."
if [ ! -f "$APP_DIR/.env" ]; then
    warn ".env Datei nicht gefunden!"
    echo ""
    echo "Bitte .env erstellen mit folgenden Variablen:"
    echo ""
    cat .env.example
    echo ""
    echo "Drücke Enter wenn .env erstellt ist..."
    read
    
    if [ ! -f "$APP_DIR/.env" ]; then
        error ".env Datei fehlt immer noch!"
    fi
fi
info ".env Datei vorhanden"

# Validierung der wichtigsten Variablen
source "$APP_DIR/.env"
if [ -z "$EMBY_SERVER_URL" ] || [ -z "$NEXTAUTH_SECRET" ] || [ -z "$N8N_WEBHOOK_URL" ]; then
    error "Wichtige Umgebungsvariablen fehlen in .env!"
fi
info "Environment Variables validiert"

# Schritt 5: Docker Image bauen
echo ""
echo "🐳 Schritt 5: Docker Image bauen..."
docker build -t "$DOCKER_IMAGE" .
info "Docker Image gebaut: $DOCKER_IMAGE"

# Schritt 6: Alten Container stoppen (falls vorhanden)
echo ""
echo "🛑 Schritt 6: Alte Container stoppen..."
if docker ps -a | grep -q "$APP_NAME"; then
    docker stop "$APP_NAME" 2>/dev/null || true
    docker rm "$APP_NAME" 2>/dev/null || true
    info "Alter Container entfernt"
else
    info "Kein alter Container gefunden"
fi

# Schritt 7: Neuen Container starten
echo ""
echo "▶️  Schritt 7: Container starten..."
docker run -d \
    --name "$APP_NAME" \
    --restart unless-stopped \
    -p 3000:3000 \
    --env-file "$APP_DIR/.env" \
    "$DOCKER_IMAGE"

info "Container gestartet: $APP_NAME"

# Schritt 8: Health Check
echo ""
echo "🏥 Schritt 8: Health Check..."
sleep 5  # Warte kurz bis Container hochgefahren ist

for i in {1..10}; do
    if curl -sf http://localhost:3000/api/health > /dev/null; then
        info "Health Check erfolgreich!"
        break
    fi
    if [ $i -eq 10 ]; then
        error "Health Check fehlgeschlagen! Container Logs:"
        docker logs "$APP_NAME"
        exit 1
    fi
    echo "Warte auf Container... ($i/10)"
    sleep 2
done

# Schritt 9: Logs anzeigen
echo ""
echo "📜 Container Logs (letzte 20 Zeilen):"
echo "====================================="
docker logs --tail 20 "$APP_NAME"
echo ""

# Abschluss
echo ""
echo "✅ Deployment erfolgreich abgeschlossen!"
echo ""
echo "📊 Informationen:"
echo "   • Container Name: $APP_NAME"
echo "   • Interner Port: 3000"
echo "   • Health Check: http://localhost:3000/api/health"
echo ""
echo "🔍 Nützliche Befehle:"
echo "   • Logs anzeigen:     docker logs -f $APP_NAME"
echo "   • Container stoppen: docker stop $APP_NAME"
echo "   • Container starten: docker start $APP_NAME"
echo "   • Neu deployen:      $0"
echo ""
echo "⚠️  Nächste Schritte:"
echo "   1. Reverse Proxy konfigurieren (Nginx/Traefik)"
echo "   2. SSL-Zertifikat einrichten (Let's Encrypt)"
echo "   3. NEXTAUTH_URL in .env auf https://your-domain.com setzen"
echo "   4. Container neu starten"
echo ""
echo "📚 Dokumentation:"
echo "   • DEPLOYMENT_CHECKLIST.md - Vollständige Checkliste"
echo "   • N8N_WORKFLOW_MIGRATION.md - n8n Workflow Setup"
echo "   • DOCKER.md - Docker Dokumentation"
echo ""
