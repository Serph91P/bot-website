# 🔄 Kompletter Workflow - Schritt für Schritt

## Szenario: User will "ARD" prüfen

### Phase 1: User-Eingabe & Anfrage ⏱️ SOFORT

```
┌─────────────┐
│   Browser   │
│  (User)     │
└──────┬──────┘
       │ 1. User tippt "ARD"
       │    und klickt "Prüfen"
       ↓
┌─────────────────────────┐
│  Frontend (React)       │
│  SenderInput.tsx        │
└──────┬──────────────────┘
       │ 2. fetch('/api/n8n/check-sender')
       │    Body: { senderName: "ARD" }
       ↓
┌─────────────────────────┐
│  Backend (Next.js)      │
│  /api/n8n/check-sender  │
└──────┬──────────────────┘
       │ 3. n8nClient.checkSender("ARD", userId)
       │    POST zu N8N_WEBHOOK_URL/sender-search
       ↓
┌─────────────────────────┐
│      n8n Workflow       │
│   Webhook-Trigger       │
└──────┬──────────────────┘
       │ 4. Empfängt Request
       │    Sucht in Datenbank
       │
       ├─── Wenn 1 Sender gefunden ───┐
       │                               │
       │ 5. Respond to Webhook         │
       │    {                          │
       │      status: "checking",      │
       │      senderId: "123",         │
       │      senderName: "ARD HD"     │
       │    }                          │
       ↓                               │
┌─────────────────────────┐           │
│  Backend (Next.js)      │←──────────┘
│  /api/n8n/check-sender  │
└──────┬──────────────────┘
       │ 6. Gibt Response zurück
       ↓
┌─────────────────────────┐
│  Frontend (React)       │
│  StatusDisplay.tsx      │
└──────┬──────────────────┘
       │ 7. Zeigt an:
       │    "ARD HD wird geprüft... 🔄"
       ↓
┌─────────────┐
│   Browser   │
│  (User)     │ 
│  sieht:     │
│  🔄 Lädt... │
└─────────────┘
```

### Phase 2: Prüfung läuft ⏱️ SPÄTER (5-30 Sekunden)

```
┌─────────────────────────┐
│      n8n Workflow       │
│                         │
│  [Respond ist schon     │
│   passiert oben!]       │
│                         │
│  Jetzt weiter:          │
│  → Prüfung durchführen  │
│  → Tests laufen         │
│  → Ergebnis ermitteln   │
└──────┬──────────────────┘
       │ 8. Prüfung abgeschlossen!
       │
       │ 9. HTTP Request Node
       │    POST https://ihre-webseite.de/api/n8n/webhook
       │    Body: {
       │      senderId: "123",
       │      status: "completed",
       │      message: "Prüfung erfolgreich!"
       │    }
       ↓
┌─────────────────────────┐
│  Backend (Next.js)      │
│  /api/n8n/webhook       │
└──────┬──────────────────┘
       │ 10. Empfängt Callback
       │     Speichert Ergebnis
       │     (in DB oder Memory)
       ↓
```

### Phase 3: User sieht Ergebnis ⏱️ VIA POLLING ODER SSE

```
┌─────────────┐
│   Browser   │
│  (User)     │
└──────┬──────┘
       │ 11. Frontend pollt alle paar Sekunden:
       │     fetch('/api/status/123')
       │     ODER
       │     SSE-Verbindung wartet auf Update
       ↓
┌─────────────────────────┐
│  Backend (Next.js)      │
│  /api/status/123        │
└──────┬──────────────────┘
       │ 12. Gibt gespeichertes
       │     Ergebnis zurück
       ↓
┌─────────────────────────┐
│  Frontend (React)       │
│  StatusDisplay.tsx      │
└──────┬──────────────────┘
       │ 13. Zeigt Ergebnis:
       │     "✅ Prüfung erfolgreich!"
       ↓
┌─────────────┐
│   Browser   │
│  (User)     │
│  sieht:     │
│  ✅ Fertig! │
└─────────────┘
```

## 🎯 Die 3 wichtigen Endpunkte

### AUF DER WEBSEITE (bot-website):

1. **`/api/n8n/check-sender`** (POST)
   - Empfängt: Request vom Frontend
   - Macht: Leitet an n8n weiter
   - Gibt zurück: Antwort von n8n

2. **`/api/n8n/webhook`** (POST)
   - Empfängt: Callback von n8n
   - Macht: Speichert Ergebnis
   - Gibt zurück: { success: true }

3. **`/api/status/{id}`** (GET) ← MUSS NOCH GEBAUT WERDEN!
   - Empfängt: Request vom Frontend
   - Macht: Liest Ergebnis aus Speicher
   - Gibt zurück: Status-Update

### AUF N8N:

1. **`/sender-search`** (POST - Webhook)
   - Empfängt: Request von Webseite
   - Macht: Sucht Sender
   - Gibt zurück: Sofort mit Status

2. **`/sender-confirm`** (POST - Webhook)
   - Empfängt: Request von Webseite (bei Mehrfach-Auswahl)
   - Macht: Startet Prüfung
   - Gibt zurück: Sofort mit Status

## ⚠️ Was noch fehlt!

Die Webseite kann momentan das Callback-Ergebnis von n8n **empfangen**, aber das Frontend weiß nicht, **wann** es fertig ist!

Wir brauchen noch:

### Option A: Polling (einfach)
```typescript
// Frontend pollt alle 2 Sekunden
setInterval(() => {
  fetch(`/api/status/${senderId}`)
    .then(data => {
      if (data.status === 'completed') {
        // Zeige Ergebnis
      }
    })
}, 2000)
```

### Option B: Server-Sent Events (besser)
```typescript
// Frontend öffnet SSE-Verbindung
const eventSource = new EventSource(`/api/sse/${senderId}`)
eventSource.onmessage = (event) => {
  // Update von Server
}
```

### Option C: WebSockets (am besten)
```typescript
// Echtzeit-Verbindung
const ws = new WebSocket('ws://...')
ws.onmessage = (event) => {
  // Update von Server
}
```

## 🔧 Was du in n8n machen musst:

### 1. Webhook-Trigger einrichten
```
Webhook-Trigger Node
  Path: /sender-search
  Method: POST
```

### 2. Sofort antworten
```
Respond to Webhook Node
  Response Body:
  {
    "status": "checking",
    "senderId": "{{ $json.id }}",
    "senderName": "{{ $json.name }}"
  }
```

### 3. Weiter mit Prüfung
```
Function Node
  → Deine Prüflogik
```

### 4. Callback senden
```
HTTP Request Node
  URL: https://ihre-webseite.de/api/n8n/webhook
  Method: POST
  Body:
  {
    "senderId": "{{ $('Webhook').item.json.senderId }}",
    "status": "completed",
    "message": "Alles OK!"
  }
```

## 📝 Zusammenfassung

**Synchron (sofort):**
- Webseite → n8n: "Prüfe ARD"
- n8n → Webseite: "OK, läuft!"

**Asynchron (später):**
- n8n → Webseite: "Fertig! Ergebnis: ..."

**Polling (aktuell fehlt):**
- Frontend → Backend: "Schon fertig?"
- Backend → Frontend: "Ja! Hier Ergebnis..."

Verstanden? 😊
