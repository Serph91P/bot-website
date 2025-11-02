# Bot Website - Schnellstart-Anleitung

## Erste Schritte

1. **Dependencies installieren**
   ```bash
   npm install
   ```

2. **Umgebungsvariablen einrichten**
   ```bash
   cp .env.example .env.local
   ```
   
   Bearbeiten Sie `.env.local` und tragen Sie Ihre Konfiguration ein:
   - `EMBY_SERVER_URL`: Die URL Ihres Emby-Servers
   - `NEXTAUTH_SECRET`: Generieren Sie einen mit `openssl rand -base64 32`
   - `N8N_WEBHOOK_URL`: Die Basis-URL Ihrer n8n-Instanz
   - `N8N_CALLBACK_SECRET`: Ein geheimer String für Webhook-Validierung

3. **Development Server starten**
   ```bash
   npm run dev
   ```
   
   Öffnen Sie http://localhost:3000

4. **Mit Emby-Credentials anmelden**
   - Geben Sie Ihren Emby-Benutzernamen und Passwort ein
   - Die Session bleibt persistiert

5. **Sender prüfen**
   - Geben Sie einen Sendernamen ein (z.B. "ARD")
   - Bei mehreren Treffern wählen Sie den gewünschten Sender aus
   - Warten Sie auf das Prüfungsergebnis von n8n

## n8n Workflow Beispiel

Ihr n8n-Workflow sollte:

1. **Webhook empfangen** (`/sender-search`)
   - Body: `{ "senderName": "ARD", "userId": "user123" }`

2. **Sender suchen** in Ihrer Datenbank/API

3. **Response zurückgeben**:
   - Einzelner Sender: `{ "status": "checking", "senderId": "123", "senderName": "ARD" }`
   - Mehrere Sender: `{ "status": "multiple", "senders": [...] }`

4. **Prüfung durchführen**

5. **Callback senden** an `{APP_URL}/api/n8n/webhook`
   - Body: `{ "senderId": "123", "status": "completed", "message": "Erfolgreich geprüft" }`

## Docker Build

```bash
docker build -t bot-website .
docker run -p 3000:3000 --env-file .env.local bot-website
```

## Troubleshooting

- **Fehler bei Login**: Überprüfen Sie `EMBY_SERVER_URL` und Zugangsdaten
- **n8n Fehler**: Prüfen Sie `N8N_WEBHOOK_URL` und Webhook-Konfiguration
- **Session-Probleme**: Stellen Sie sicher, dass `NEXTAUTH_SECRET` gesetzt ist

## Nächste Schritte

1. Konfigurieren Sie Ihre n8n-Workflows
2. Passen Sie das Design nach Ihren Wünschen an
3. Fügen Sie eigene Icons für die PWA hinzu
4. Deployen Sie auf Ihren Server
