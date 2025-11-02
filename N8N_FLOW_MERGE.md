# 🔀 N8N Workflow - Flow Zusammenführung (WICHTIG!)

## ⚠️ Problem erkannt!

Du hast absolut recht! Im Screenshot fehlt die **Zusammenführung der beiden Flows**!

## ❌ Aktueller Fehler:

```
Webhook → Action Router
            ├─ search ──> Parse Query ──> DB Search ──> Match Channel ──> ✅ Weiter zu Tests
            │
            └─ select ──> Parse Selection ─> DB Search by ID ──> 💀 ENDET IM NICHTS!
```

## ✅ Korrekte Lösung:

```
Webhook → Action Router
            ├─ search ──> Parse Query ──> DB Search ──────┐
            │                                              ↓
            └─ select ──> Parse Selection ─> DB Search ───> Match Channel
                                                               ↓
                                                        Needs Selection?
                                                      ├─ Yes → Respond: Selection
                                                      └─ No  → Respond: Start Check
                                                                  ↓
                                                             HTTP Test
                                                                  ↓
                                                          SSH Stability Test  
                                                                  ↓
                                                          Send to Website
```

**BEIDE Flows müssen zum GLEICHEN "Match Channel" Node führen!**

---

## 🔧 Was du in n8n machen musst:

### Schritt 1: Match Channel Logic vereinheitlichen

Du hast jetzt wahrscheinlich:
- `Match Channel` (nach DB Search)
- `Match Channel1` (nach DB Search by ID)

**Lösung:** 

#### Option A (Empfohlen): Beide zu EINEM Node verbinden

1. **Lösche** den Node "Match Channel1"
2. **Verbinde** beide DB-Nodes zum **gleichen** "Match Channel" Node:
   - `DB Search` → `Match Channel`
   - `DB Search by ID` → `Match Channel` (zweite Verbindung!)

#### Option B: Merge Node verwenden

Wenn die Daten-Struktur leicht unterschiedlich ist:

```
DB Search ─────────┐
                   ├──> Merge ──> Match Channel ──> Tests
DB Search by ID ───┘
```

**Merge Node Settings:**
- Mode: `Merge By Position` oder `Append`
- Damit beide Ergebnisse zusammengeführt werden

---

## 📊 Detaillierter Flow:

### Phase 1: Input & Search

```
┌──────────────────────────────────────────────────────────┐
│ PHASE 1: INPUT & DATABASE SEARCH                        │
└──────────────────────────────────────────────────────────┘

Webhook (POST /sender-search)
  ↓
  body: { 
    action: "search" | "select",
    senderName?: string,
    senderId?: number,
    userId: string
  }
  ↓
Action Router (If: action === "select")
  ├─ FALSE (action = "search") ────────────────────┐
  │    ↓                                            │
  │  Parse Query                                    │
  │    ↓                                            │
  │    output: {                                    │
  │      channel_query: "sky bundesliga",          │
  │      user_id: "user123"                        │
  │    }                                            │
  │    ↓                                            │
  │  DB Search (Fuzzy Search mit Score)            │
  │    ↓                                            │
  │    output: [                                    ↓
  │      {stream_id: 1, name: "...", score: 0.9},  │
  │      {stream_id: 2, name: "...", score: 0.7}   │
  │    ]                                            │
  │                                                 │
  └─ TRUE (action = "select") ─────────────────────┤
       ↓                                            │
     Parse Selection                                │
       ↓                                            │
       output: {                                    │
         chosen_id: 103877,                        │
         user_id: "user123"                        │
       }                                            │
       ↓                                            │
     DB Search by ID (Exact Match)                 │
       ↓                                            │
       output: {                                    │
         stream_id: 103877,                        │
         name: "Sky Bundesliga 4 HDraw",           │
         direct_source: "http://..."               │
       }                                            │
       ↓                                            │
       ↓                                            │
       └────────────────────────────────────────────┘
                         ↓
                   Match Channel  ← HIER ZUSAMMENFÜHREN!
```

### Phase 2: Decision & Response

```
┌──────────────────────────────────────────────────────────┐
│ PHASE 2: MATCH LOGIC & WEBHOOK RESPONSE                 │
└──────────────────────────────────────────────────────────┘

Match Channel (JavaScript Code)
  ↓
  Analysiert Ergebnisse:
  - Keine Treffer? → found: false
  - Ein klarer Treffer? → found: true, need_choice: false
  - Mehrere ähnliche? → found: false, need_choice: true
  ↓
  output: {
    found: boolean,
    need_choice: boolean,
    match_name?: string,
    stream_id?: number,
    probe_url?: string,
    suggestions?: [{id, name}, ...],
    user_id: string
  }
  ↓
Needs Selection? (If: need_choice === true)
  ├─ TRUE (Multiple Matches) ──────> Respond to Webhook
  │                                   {
  │                                     status: "needs_selection",
  │                                     senders: [...]
  │                                   }
  │                                   → WORKFLOW ENDET
  │
  └─ FALSE (Single Match) ──────────> Switch (found === true)
       ├─ TRUE ─────────────────────> Respond to Webhook
       │                               {
       │                                 status: "checking",
       │                                 senderId: 123,
       │                                 message: "Prüfe..."
       │                               }
       │                               ↓
       │                            HTTP Test ──> (continues...)
       │
       └─ FALSE (Not Found) ────────> Respond to Webhook
                                       {
                                         status: "error",
                                         message: "Nicht gefunden"
                                       }
                                       → WORKFLOW ENDET
```

### Phase 3: Testing (nur bei Single Match!)

```
┌──────────────────────────────────────────────────────────┐
│ PHASE 3: STREAM TESTING (Background)                    │
└──────────────────────────────────────────────────────────┘

HTTP Test (HEAD Request zu probe_url)
  ↓
  Prüft: Status Code 200-399?
  ↓
If (Online?)
  ├─ TRUE ──────────> SSH Stability Test
  │                   (ffprobe, frame counting, latency)
  │                   ↓
  │                   output: {
  │                     live: true,
  │                     quality: "excellent",
  │                     latency: 145,
  │                     ...
  │                   }
  │                   ↓
  │                 AI Format (Optional)
  │                   ↓
  │                 Send to Website
  │                   POST /api/n8n/webhook
  │                   {
  │                     userId: "user123",
  │                     senderId: 123,
  │                     status: "online",
  │                     message: "Läuft stabil...",
  │                     details: {...}
  │                   }
  │
  └─ FALSE ─────────> Send to Website
                      POST /api/n8n/webhook
                      {
                        userId: "user123",
                        senderId: 123,
                        status: "offline",
                        message: "Nicht erreichbar"
                      }
```

---

## 🎯 Kritischer Punkt: Match Channel

Der **Match Channel** Node muss **beide Inputs** verarbeiten können:

### Input von DB Search (Fuzzy):
```javascript
[
  { stream_id: 1, name: "Sky Bundesliga 4 HDraw", direct_source: "http://...", total_score: 0.9 },
  { stream_id: 2, name: "Sky Bundesliga 4 Mobil", direct_source: "http://...", total_score: 0.7 }
]
```

### Input von DB Search by ID (Exact):
```javascript
{
  stream_id: 103877,
  name: "Sky Bundesliga 4 HDraw",
  direct_source: "http://..."
}
```

### Match Channel Code muss angepasst werden:

```javascript
// Beide Input-Formate unterstützen
let rows;

// Von DB Search (Array)
if (Array.isArray($input.all()[0].json)) {
  rows = $input.all().flatMap(i => i.json);
} 
// Von DB Search by ID (Single Object) 
else {
  rows = $input.all().map(i => i.json);
}

// Rest der Logik bleibt gleich...
const userId = $item(0).$node["Parse Query"]?.json?.user_id 
            || $item(0).$node["Parse Selection"]?.json?.user_id;

// ... (deine bestehende Match-Logik)
```

---

## ✅ Checkliste für n8n:

- [ ] **Beide DB-Nodes** verbinden mit **einem** Match Channel
- [ ] **Match Channel Code** anpassen für beide Input-Formate
- [ ] **Needs Selection?** If-Node kommt **nach** Match Channel
- [ ] **Drei Ausgänge** vom Needs Selection If:
  - needs_choice = true → Respond: Selection
  - found = true → Respond: Start Check → HTTP Test
  - found = false → Respond: Not Found
- [ ] **HTTP Test** und **SSH Test** nur im "found = true" Branch
- [ ] **Send to Website** am Ende beider Test-Branches

---

## 🧪 Test-Szenario:

### Szenario 1: Suche mit eindeutigem Ergebnis
```
1. POST /webhook/sender-search { action: "search", senderName: "Sky Bundesliga 4" }
2. → Parse Query → DB Search → Match Channel
3. → found=true, need_choice=false
4. → Respond: { status: "checking" }
5. → HTTP Test → SSH Test → Send to Website
```

### Szenario 2: Suche mit mehreren Ergebnissen
```
1. POST /webhook/sender-search { action: "search", senderName: "Sky" }
2. → Parse Query → DB Search → Match Channel
3. → found=false, need_choice=true
4. → Respond: { status: "needs_selection", senders: [...] }
5. → ENDE (User muss wählen)
```

### Szenario 3: User wählt aus Liste
```
1. POST /webhook/sender-search { action: "select", senderId: 103877 }
2. → Parse Selection → DB Search by ID → Match Channel  ← HIER WAR DER FEHLER!
3. → found=true, need_choice=false
4. → Respond: { status: "checking" }
5. → HTTP Test → SSH Test → Send to Website
```

**Szenario 3 muss genauso weiterlaufen wie Szenario 1!**

---

## 🎨 Visuelle Zusammenfassung:

```
                    ┌─────────────┐
                    │   Webhook   │
                    └──────┬──────┘
                           │
                    ┌──────▼────────┐
                    │ Action Router │
                    └───┬───────┬───┘
                        │       │
          ┌─────────────┘       └─────────────┐
          │                                    │
    ┌─────▼──────┐                    ┌───────▼────────┐
    │Parse Query │                    │Parse Selection │
    └─────┬──────┘                    └───────┬────────┘
          │                                    │
    ┌─────▼─────┐                     ┌───────▼────────┐
    │ DB Search │                     │DB Search by ID │
    └─────┬─────┘                     └───────┬────────┘
          │                                    │
          └────────────┬───────────────────────┘
                       │
                ┌──────▼──────────┐
                │  Match Channel  │ ← BEIDE FLOWS HIER!
                └──────┬──────────┘
                       │
                ┌──────▼──────────┐
                │Needs Selection? │
                └─┬──────┬───────┬┘
                  │      │       │
        ┌─────────┘      │       └─────────┐
        │                │                 │
  ┌─────▼─────┐   ┌──────▼──────┐   ┌─────▼──────┐
  │ Selection │   │Start Checking│   │ Not Found  │
  │ Response  │   │   Response   │   │  Response  │
  └───────────┘   └──────┬───────┘   └────────────┘
                         │
                    ┌────▼─────┐
                    │HTTP Test │
                    └────┬─────┘
                         │
                  ┌──────▼────────┐
                  │  SSH Test     │
                  └──────┬────────┘
                         │
                ┌────────▼─────────┐
                │ Send to Website  │
                └──────────────────┘
```

---

**Die Zusammenführung nach "Match Channel" ist kritisch für den kompletten Workflow!** 🎯
