#!/bin/bash
# 🚀 Bot Website - Simple Server Deployment
# Dieses Script deployed die Webseite direkt auf dem Server mit docker-compose

set -e

echo "🚀 Bot Website Deployment (Server-Side Build)"
echo "=============================================="
echo ""

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

function info() { echo -e "${GREEN}✓${NC} $1"; }
function warn() { echo -e "${YELLOW}⚠${NC} $1"; }
function error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# 1. Docker prüfen
echo "📋 Schritt 1: Voraussetzungen prüfen..."
if ! command -v docker &> /dev/null; then
    error "Docker ist nicht installiert!"
fi
info "Docker ist installiert"

# 2. .env prüfen
echo ""
echo "🔐 Schritt 2: Environment Variables prüfen..."
if [ ! -f ".env" ]; then
    error ".env Datei fehlt! Bitte erstellen: cp .env.example .env"
fi
info ".env Datei gefunden"

# Wichtige Variablen validieren
source .env
if [ -z "$EMBY_SERVER_URL" ]; then error "EMBY_SERVER_URL fehlt in .env!"; fi
if [ -z "$NEXTAUTH_SECRET" ]; then error "NEXTAUTH_SECRET fehlt in .env!"; fi
if [ -z "$N8N_WEBHOOK_URL" ]; then error "N8N_WEBHOOK_URL fehlt in .env!"; fi
info "Alle wichtigen Variablen vorhanden"

# 3. Alte Container stoppen
echo ""
echo "🛑 Schritt 3: Alte Container stoppen..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || info "Keine laufenden Container"

# 4. Image neu bauen und starten
echo ""
echo "🐳 Schritt 4: Docker Image bauen und Container starten..."
echo ""
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

# 5. Health Check
echo ""
echo "🏥 Schritt 5: Health Check..."
sleep 8

for i in {1..15}; do
    if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
        info "Health Check erfolgreich!"
        break
    fi
    if [ $i -eq 15 ]; then
        error "Health Check fehlgeschlagen!"
    fi
    echo "Warte auf Container... ($i/15)"
    sleep 2
done

# 6. Status anzeigen
echo ""
echo "📊 Container Status:"
echo "==================="
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi

echo ""
echo "✅ Deployment erfolgreich!"
echo ""
echo "📍 Die Webseite läuft auf: http://localhost:3000"
echo "🔍 Health Check: http://localhost:3000/api/health"
echo ""
echo "📜 Logs anzeigen:"
if command -v docker-compose &> /dev/null; then
    echo "   docker-compose logs -f"
else
    echo "   docker compose logs -f"
fi
echo ""
echo "⚠️  Nächste Schritte:"
echo "   1. Reverse Proxy einrichten (nginx.conf nutzen)"
echo "   2. SSL-Zertifikat mit certbot erstellen"
echo "   3. NEXTAUTH_URL in .env auf https://deine-domain.de setzen"
echo "   4. Container neu starten: ./deploy-simple.sh"
echo ""
