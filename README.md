# Bot Website - Sender Prüfung

Eine Progressive Web App (PWA) zur Überprüfung von TV-Sendern über n8n-Workflows mit Emby-Authentifizierung.

## 🚀 Features

- ✅ **Emby-Authentifizierung**: Sichere Anmeldung mit Emby-Zugangsdaten
- ✅ **Persistente Sessions**: Sessions bleiben über Browser-Neustarts erhalten
- ✅ **PWA-Funktionalität**: Installierbar auf mobilen Geräten und Desktop
- ✅ **n8n Integration**: Kommunikation mit n8n-Workflows für Sender-Prüfung
- ✅ **Mehrfach-Auswahl**: Auswahl bei mehreren gefundenen Sendern
- ✅ **Real-time Updates**: Status-Updates während der Prüfung
- ✅ **Responsive Design**: Optimiert für Mobile und Desktop
- ✅ **Dark Mode**: Automatische Anpassung an System-Theme

## 📋 Voraussetzungen

- Node.js 20.x oder höher
- npm oder yarn
- Emby Server mit API-Zugriff
- n8n-Instanz mit Webhook-Endpunkten
- Docker (optional für Container-Deployment)

## 🛠️ Installation

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd bot-website
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env.local
   ```
   
   Bearbeiten Sie `.env.local` und tragen Sie Ihre Werte ein:
   ```env
   EMBY_SERVER_URL=https://your-emby-server.com
   EMBY_API_KEY=your-emby-api-key
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
   N8N_CALLBACK_SECRET=your-random-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret
   ```

4. **Development Server starten**
   ```bash
   npm run dev
   ```
   
   Die App ist nun unter `http://localhost:3000` erreichbar.

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment (Empfohlen für Production)

#### Schnellstart mit Docker Compose

```bash
# Automatisches Setup
./docker-start.sh

# Oder manuell
cp .env.docker.example .env
# .env bearbeiten mit Ihren Werten
docker-compose up -d
```

Die App ist dann verfügbar unter `http://localhost:3000`

#### Mit Makefile

```bash
make help          # Alle Befehle anzeigen
make env           # .env erstellen
make docker-up     # Container starten
make docker-logs   # Logs anzeigen
```

#### Docker Compose (manuell)

Erstellen Sie eine `.env` Datei:

```env
EMBY_SERVER_URL=https://your-emby-server.com
EMBY_API_KEY=your-api-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_CALLBACK_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

Starten Sie die Container:

```bash
docker-compose up -d
```

#### Standalone Docker

```bash
# Build
docker build -t bot-website .

# Run
docker run -p 3000:3000 --env-file .env bot-website
```

**Siehe [DOCKER.md](./DOCKER.md) für ausführliche Docker-Dokumentation**

## 🔧 n8n Workflow Konfiguration

Die App benötigt zwei n8n-Webhooks:

### 1. Sender-Suche Webhook

**URL**: `{N8N_WEBHOOK_URL}/sender-search`

**Request Body**:
```json
{
  "senderName": "ARD",
  "userId": "user123"
}
```

**Response** (Einzelner Sender):
```json
{
  "status": "checking",
  "senderId": "123",
  "senderName": "ARD"
}
```

**Response** (Mehrere Sender):
```json
{
  "status": "multiple",
  "senders": [
    { "id": "123", "name": "ARD HD" },
    { "id": "124", "name": "ARD Alpha" }
  ]
}
```

### 2. Status-Update Webhook

**URL**: `{YOUR_APP_URL}/api/n8n/webhook`

**Request Body**:
```json
{
  "senderId": "123",
  "status": "completed",
  "message": "Sender wurde erfolgreich geprüft",
  "details": {}
}
```

## 📁 Projekt-Struktur

```
bot-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth.js
│   │   │   └── n8n/           # n8n Webhooks
│   │   ├── dashboard/         # Dashboard-Seite
│   │   ├── login/             # Login-Seite
│   │   └── layout.tsx         # Root Layout
│   ├── components/            # React-Komponenten
│   │   ├── auth/             # Auth-Komponenten
│   │   └── sender/           # Sender-Komponenten
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # Auth-Konfiguration
│   │   ├── emby.ts          # Emby-Client
│   │   └── n8n.ts           # n8n-Client
│   └── types/               # TypeScript-Typen
├── public/                  # Statische Dateien
│   ├── icons/              # PWA Icons
│   └── manifest.json       # PWA Manifest
├── Dockerfile              # Docker Build
└── .github/workflows/      # CI/CD
```

## 🔐 Sicherheit

- **HTTPS**: Verwenden Sie in Produktion immer HTTPS
- **NEXTAUTH_SECRET**: Generieren Sie einen sicheren Zufallsstring
  ```bash
  openssl rand -base64 32
  ```
- **N8N_CALLBACK_SECRET**: Nutzen Sie einen geheimen String für Webhook-Validierung
- **EMBY_API_KEY**: Halten Sie Ihren API-Key geheim

## 🚢 GitHub Actions CI/CD

Das Projekt enthält eine vorkonfigurierte GitHub Actions Workflow-Datei für automatisches Docker-Image-Building:

1. Bei jedem Push auf `main` wird ein Docker-Image gebaut
2. Das Image wird zu GitHub Container Registry (ghcr.io) gepusht
3. Das Image kann dann auf Ihrem Server deployed werden

## 🎨 PWA Icons

Erstellen Sie Icons in folgenden Größen und platzieren Sie sie in `public/icons/`:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Sie können Tools wie [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) verwenden.

## 📝 Lizenz

Dieses Projekt ist privat.

## 🤝 Support

Für Fragen und Support kontaktieren Sie den Projekt-Maintainer.

---

**Letzte Aktualisierung**: November 2025
