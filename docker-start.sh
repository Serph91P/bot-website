#!/bin/bash

# Docker Quick Start Script
# Dieses Script hilft beim schnellen Setup und Start der Applikation

set -e

echo "🚀 Bot Website - Docker Setup"
echo "=============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker ist nicht installiert!"
    echo "Bitte installieren Sie Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose ist nicht installiert!"
    echo "Bitte installieren Sie Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker und Docker Compose sind installiert"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Erstelle .env Datei..."
    cp .env.docker.example .env
    
    echo "🔐 Generiere sichere Secrets..."
    N8N_SECRET=$(openssl rand -base64 32)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Update .env with generated secrets
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|N8N_CALLBACK_SECRET=.*|N8N_CALLBACK_SECRET=$N8N_SECRET|g" .env
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$NEXTAUTH_SECRET|g" .env
    else
        # Linux
        sed -i "s|N8N_CALLBACK_SECRET=.*|N8N_CALLBACK_SECRET=$N8N_SECRET|g" .env
        sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$NEXTAUTH_SECRET|g" .env
    fi
    
    echo ""
    echo "✅ .env Datei erstellt mit generierten Secrets"
    echo ""
    echo "⚠️  WICHTIG: Bitte bearbeiten Sie .env und tragen Sie ein:"
    echo "   - EMBY_SERVER_URL"
    echo "   - EMBY_API_KEY"
    echo "   - N8N_WEBHOOK_URL"
    echo "   - NEXTAUTH_URL (Ihre öffentliche Domain)"
    echo ""
    read -p "Drücken Sie Enter, wenn Sie die .env Datei angepasst haben..."
else
    echo "✅ .env Datei existiert bereits"
fi

echo ""
echo "🔨 Baue Docker Image..."
docker-compose build

echo ""
echo "🚀 Starte Container..."
docker-compose up -d

echo ""
echo "⏳ Warte auf Container-Start..."
sleep 5

# Check if container is running
if docker-compose ps | grep -q "bot-website.*Up"; then
    echo ""
    echo "✅ Container erfolgreich gestartet!"
    echo ""
    echo "📱 Die App ist verfügbar unter:"
    echo "   http://localhost:3000"
    echo ""
    echo "📋 Nützliche Befehle:"
    echo "   docker-compose logs -f        # Logs anzeigen"
    echo "   docker-compose stop           # Container stoppen"
    echo "   docker-compose restart        # Container neu starten"
    echo "   docker-compose down           # Container stoppen und entfernen"
    echo ""
    echo "🎉 Setup abgeschlossen!"
else
    echo ""
    echo "❌ Container konnte nicht gestartet werden"
    echo "Logs:"
    docker-compose logs
    exit 1
fi
