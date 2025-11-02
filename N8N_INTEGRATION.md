# n8n Workflow Integration Guide

## ⚠️ WICHTIG: Wer ruft wen auf?

**Die Webseite ruft n8n auf, nicht umgekehrt!**

```
User → Webseite → n8n (sendet Anfrage)
                   ↓
Webseite ← n8n (antwortet sofort)
```

Später (nach der Prüfung):
```
Webseite ← n8n (sendet Callback mit Ergebnis)
```

## Übersicht

Die Bot Website kommuniziert mit n8n über Webhooks:
1. **Webseite fragt n8n** - n8n antwortet synchron
2. **n8n sendet Ergebnis zurück** - asynchroner Callback

## Workflow 1: Sender-Suche

### Endpoint (auf n8n!)
`POST {N8N_WEBHOOK_URL}/sender-search`

**WER RUFT AUF?** Die Webseite (bot-website)!
**WER ANTWORTET?** n8n antwortet sofort!

### Request Body (von Webseite an n8n)
```json
{
  "senderName": "ARD",
  "userId": "emby-user-id-123"
}
```

### Response-Szenarien

#### Szenario 1: Einzelner Sender gefunden
```json
{
  "status": "checking",
  "senderId": "sender-123",
  "senderName": "ARD HD"
}
```

Die App zeigt dann:
- "Der Sender 'ARD HD' wird geprüft..."
- Status-Anzeige mit Spinner

#### Szenario 2: Mehrere Sender gefunden
```json
{
  "status": "multiple",
  "senders": [
    {
      "id": "sender-123",
      "name": "ARD HD"
    },
    {
      "id": "sender-124",
      "name": "ARD Alpha"
    },
    {
      "id": "sender-125",
      "name": "ARD Mediathek"
    }
  ]
}
```

Die App zeigt dann:
- Liste der gefundenen Sender zur Auswahl
- Benutzer klickt auf einen Sender
- App sendet Request an `/sender-confirm` (siehe Workflow 2)

#### Szenario 3: Fehler
```json
{
  "status": "error",
  "message": "Sender nicht gefunden"
}
```

## Workflow 2: Sender-Bestätigung (bei Mehrfach-Auswahl)

### Endpoint (auf n8n!)
`POST {N8N_WEBHOOK_URL}/sender-confirm`

**WER RUFT AUF?** Die Webseite (nachdem User einen Sender gewählt hat)!
**WER ANTWORTET?** n8n antwortet sofort!

### Request Body (von Webseite an n8n)
```json
{
  "senderId": "sender-123",
  "userId": "emby-user-id-123"
}
```

### Response
```json
{
  "status": "checking",
  "senderId": "sender-123",
  "senderName": "ARD HD"
}
```

## Workflow 3: Status-Callback (von n8n an Webseite)

**WICHTIG:** Das passiert SPÄTER, nachdem die Prüfung fertig ist!

Nachdem die Prüfung abgeschlossen ist, sendet n8n einen Callback an die Webseite.

### Endpoint (auf der Webseite!)
`POST {APP_URL}/api/n8n/webhook`

**WER RUFT AUF?** n8n (sendet das Ergebnis)!
**WER EMPFÄNGT?** Die Webseite (bot-website)!

### Headers
```
Content-Type: application/json
X-N8N-Signature: {N8N_CALLBACK_SECRET}
```

### Request Body

#### Erfolgreiche Prüfung
```json
{
  "senderId": "sender-123",
  "status": "completed",
  "message": "Sender wurde erfolgreich geprüft. Alle Streams funktionieren.",
  "details": {
    "totalStreams": 5,
    "workingStreams": 5,
    "failedStreams": 0,
    "checkDuration": 12.5
  }
}
```

#### Fehlerhafte Prüfung
```json
{
  "senderId": "sender-123",
  "status": "error",
  "message": "Fehler bei der Sender-Prüfung. Einige Streams sind nicht erreichbar.",
  "details": {
    "totalStreams": 5,
    "workingStreams": 3,
    "failedStreams": 2,
    "errors": ["Stream HD nicht erreichbar", "Stream 4K Timeout"]
  }
}
```

## n8n Workflow Beispiel-Setup

### Node 1: Webhook Trigger
- **Name**: "Receive Sender Check Request"
- **Webhook Path**: `/sender-search`
- **HTTP Method**: POST

### Node 2: Function - Parse Request
```javascript
// Parse incoming request
const senderName = $input.item.json.body.senderName;
const userId = $input.item.json.body.userId;

return {
  senderName,
  userId,
  searchQuery: senderName.toLowerCase()
};
```

### Node 3: Database Query
- **Name**: "Search Senders in Database"
- **Type**: MySQL / PostgreSQL / HTTP Request
- **Query**: `SELECT id, name FROM senders WHERE name LIKE ?`

### Node 4: IF Node - Check Result Count
- **Condition**: `{{ $json.length }}`
- **Greater than**: 1

### Node 5a: Function - Single Sender Response
```javascript
const sender = $input.first().json;

return {
  status: 'checking',
  senderId: sender.id,
  senderName: sender.name
};
```

### Node 5b: Function - Multiple Senders Response
```javascript
const senders = $input.all().map(item => ({
  id: item.json.id,
  name: item.json.name
}));

return {
  status: 'multiple',
  senders: senders
};
```

### Node 6: Respond to Webhook
- **Response Data**: `{{ $json }}`

### Node 7: Wait / Delay (nur bei single sender)
- **Time**: 2 seconds (simuliert Prüfung)

### Node 8: HTTP Request - Send Callback
- **URL**: `{APP_URL}/api/n8n/webhook`
- **Method**: POST
- **Headers**:
  - `Content-Type`: application/json
  - `X-N8N-Signature`: `{N8N_CALLBACK_SECRET}`
- **Body**:
```json
{
  "senderId": "{{ $json.senderId }}",
  "status": "completed",
  "message": "Sender wurde erfolgreich geprüft",
  "details": {
    "checkTime": "{{ $now }}",
    "result": "OK"
  }
}
```

## Testen der Integration

### 1. Test mit cURL

```bash
# Sender-Suche
curl -X POST http://localhost:3000/api/n8n/check-sender \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"senderName": "ARD"}'

# Callback von n8n
curl -X POST http://localhost:3000/api/n8n/webhook \
  -H "Content-Type: application/json" \
  -H "X-N8N-Signature: YOUR_SECRET" \
  -d '{
    "senderId": "123",
    "status": "completed",
    "message": "Test erfolgreich"
  }'
```

### 2. Test mit Postman

Importieren Sie die folgende Collection:

```json
{
  "info": {
    "name": "Bot Website - n8n Integration",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Check Sender",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"senderName\": \"ARD\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/n8n/check-sender",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "n8n", "check-sender"]
        }
      }
    }
  ]
}
```

## Troubleshooting

### Problem: "Keine Antwort von n8n"
- Überprüfen Sie `N8N_WEBHOOK_URL` in `.env.local`
- Stellen Sie sicher, dass n8n erreichbar ist
- Prüfen Sie n8n-Logs auf Fehler

### Problem: "Callback kommt nicht an"
- Überprüfen Sie, ob die App-URL von n8n aus erreichbar ist
- Prüfen Sie den `X-N8N-Signature` Header
- Schauen Sie in die Browser-Konsole und Server-Logs

### Problem: "Session expired"
- Erhöhen Sie `maxAge` in der Session-Konfiguration
- Überprüfen Sie `NEXTAUTH_SECRET`

## Best Practices

1. **Timeout-Handling**: Implementieren Sie Timeouts in n8n (max. 30 Sekunden)
2. **Error Handling**: Fangen Sie alle Fehler ab und senden Sie aussagekräftige Meldungen
3. **Logging**: Loggen Sie alle Requests für Debugging
4. **Rate Limiting**: Implementieren Sie Rate Limiting in n8n
5. **Monitoring**: Überwachen Sie die Webhook-Endpunkte auf Verfügbarkeit

## Weitere Ressourcen

- [n8n Webhook Dokumentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextAuth.js Session Management](https://authjs.dev/getting-started/session-management)
