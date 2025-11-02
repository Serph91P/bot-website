# Korrigierter Workflow - So funktioniert es WIRKLICH!

## ❌ MISSVERSTÄNDNIS geklärt!

Die Webseite (bot-website) hat **KEINE** n8n-Endpunkte.
Die Webseite **RUFT** n8n auf und n8n antwortet **DIREKT**.

## ✅ Der RICHTIGE Ablauf:

### Szenario 1: Einzelner Sender gefunden

```
1. User tippt "ARD" in der Webseite
   ↓
2. Webseite → n8n (POST)
   URL: N8N_WEBHOOK_URL/sender-search
   Body: { "senderName": "ARD", "userId": "emby-123" }
   ↓
3. n8n antwortet SOFORT:
   {
     "status": "checking",
     "senderId": "sender-123",
     "senderName": "ARD HD"
   }
   ↓
4. Webseite zeigt: "ARD HD wird geprüft..."
   ↓
5. n8n macht die Prüfung im Hintergrund
   ↓
6. SPÄTER: n8n sendet Ergebnis zurück (siehe unten)
```

### Szenario 2: Mehrere Sender gefunden

```
1. User tippt "ARD" in der Webseite
   ↓
2. Webseite → n8n (POST)
   URL: N8N_WEBHOOK_URL/sender-search
   Body: { "senderName": "ARD", "userId": "emby-123" }
   ↓
3. n8n antwortet SOFORT:
   {
     "status": "multiple",
     "senders": [
       { "id": "1", "name": "ARD HD" },
       { "id": "2", "name": "ARD Alpha" }
     ]
   }
   ↓
4. Webseite zeigt Auswahl-Liste
   ↓
5. User klickt auf "ARD HD"
   ↓
6. Webseite → n8n (POST)
   URL: N8N_WEBHOOK_URL/sender-confirm
   Body: { "senderId": "1", "userId": "emby-123" }
   ↓
7. n8n antwortet:
   {
     "status": "checking",
     "senderId": "1",
     "senderName": "ARD HD"
   }
   ↓
8. Webseite zeigt: "ARD HD wird geprüft..."
```

## 🔄 Wie kommt das Ergebnis zurück?

Das ist der ZWEITE Teil - der Callback:

```
1. n8n hat Prüfung abgeschlossen
   ↓
2. n8n → Webseite (POST)
   URL: https://ihre-webseite.de/api/n8n/webhook
   Body: {
     "senderId": "1",
     "status": "completed",
     "message": "Prüfung erfolgreich!"
   }
   ↓
3. Webseite empfängt und speichert das Ergebnis
```

## 📍 Die ECHTEN Endpunkte

### Auf der WEBSEITE (bot-website):

| Endpunkt | Was macht er? | Wer ruft auf? |
|----------|---------------|---------------|
| `/api/n8n/check-sender` | Leitet an n8n weiter | Frontend (User-Klick) |
| `/api/n8n/select-sender` | Leitet an n8n weiter | Frontend (User-Auswahl) |
| `/api/n8n/webhook` | Empfängt Ergebnis | n8n (Callback) |

### Auf N8N:

| Endpunkt | Was macht er? | Wer ruft auf? |
|----------|---------------|---------------|
| `/sender-search` | Sucht Sender, antwortet sofort | Webseite |
| `/sender-confirm` | Bestätigt Auswahl, antwortet sofort | Webseite |

## 🔧 n8n Workflow-Setup

### Workflow 1: Sender-Suche

```
[Webhook Trigger: /sender-search]
        ↓
[Empfange: senderName, userId]
        ↓
[Suche in Datenbank]
        ↓
    ┌───┴───┐
    ↓       ↓
[1 Sender] [Mehrere]
    ↓       ↓
[Response] [Response]
{           {
  status:     status:
  checking    multiple
}           }
    ↓
[Wenn checking: Weiter zur Prüfung]
    ↓
[Prüfung durchführen]
    ↓
[HTTP Request an Webseite]
URL: https://webseite.de/api/n8n/webhook
Body: { status: completed, ... }
```

## ⚠️ WICHTIG für n8n!

### Webhook muss RESPOND TO WEBHOOK haben!

```javascript
// In n8n: Nach der Suche
// Node: "Respond to Webhook"

// Wenn 1 Sender:
{
  "status": "checking",
  "senderId": "{{ $json.id }}",
  "senderName": "{{ $json.name }}"
}

// Wenn mehrere:
{
  "status": "multiple",
  "senders": "{{ $json.results }}"
}
```

### Callback später senden:

```javascript
// In n8n: Nach der Prüfung
// Node: "HTTP Request"
URL: https://ihre-webseite.de/api/n8n/webhook
Method: POST
Body: {
  "senderId": "123",
  "status": "completed",
  "message": "Prüfung erfolgreich"
}
```

## 🎯 Zusammenfassung

**Webseite → n8n:**
- Webseite fragt n8n
- n8n antwortet SOFORT
- Das ist ein synchroner Request

**n8n → Webseite:**
- n8n macht Prüfung
- n8n sendet Ergebnis später
- Das ist ein asynchroner Callback

## 🔍 Code-Flow in der Webseite

```typescript
// 1. User gibt "ARD" ein
// 2. Frontend ruft auf:
fetch('/api/n8n/check-sender', {
  body: JSON.stringify({ senderName: "ARD" })
})

// 3. Backend leitet weiter:
n8nClient.checkSender("ARD", userId)
  ↓
// Macht HTTP POST zu:
N8N_WEBHOOK_URL/sender-search

// 4. n8n antwortet sofort
// 5. Backend gibt an Frontend zurück
// 6. Frontend zeigt an
```

## ❓ Noch unklar?

Das wichtigste:
- **Webseite ruft n8n AUF** (nicht umgekehrt!)
- **n8n antwortet SOFORT** mit Status
- **n8n sendet SPÄTER** das finale Ergebnis per Callback
