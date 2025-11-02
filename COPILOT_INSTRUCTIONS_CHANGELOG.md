# GitHub Copilot Instructions - Änderungsprotokoll

## ✅ Durchgeführte Änderungen (2. November 2025)

### 1. Hauptdatei optimiert
**Datei:** `.github/copilot-instructions.md`

**Vorher:**
- Zu detailliert mit vielen Code-Beispielen
- Enthielt API-Dokumentation (gehört nicht in Instructions)
- Zu viele spezifische Implementierungsdetails
- Mix aus Deutsch und Englisch

**Nachher:**
- Kurz und prägnant (GitHub Best Practices)
- Fokus auf allgemeine Coding Standards
- Konsistente englische Sprache
- Keine spezifischen Code-Beispiele oder API-Docs

**Struktur:**
```
- Project Overview
- Folder Structure
- Libraries and Frameworks
- Coding Standards
- API and Integration Patterns
- UI Guidelines
```

### 2. Pfadspezifische Anweisungen erstellt
**Verzeichnis:** `.github/instructions/`

#### Neue Dateien:

1. **`api-routes.instructions.md`**
   - Gilt für: `src/app/api/**/*.ts`
   - Inhalt: Validation, Error Handling, Response Format, Authentication

2. **`components.instructions.md`**
   - Gilt für: `src/components/**/*.tsx`
   - Inhalt: Client/Server Components, Props, Accessibility, State Management

3. **`lib.instructions.md`**
   - Gilt für: `src/lib/**/*.ts`
   - Inhalt: Error Handling, API Clients, Retry Logic, Type Exports

4. **`pages.instructions.md`**
   - Gilt für: `src/app/**/page.tsx`, `src/app/**/layout.tsx`
   - Inhalt: Metadata, Suspense, Server Actions, Loading States

5. **`docker.instructions.md`**
   - Gilt für: `Dockerfile`, `docker-compose*.yml`, `.dockerignore`
   - Inhalt: Multi-stage Builds, Security, Health Checks

6. **`types.instructions.md`**
   - Gilt für: `src/types/**/*.ts`
   - Inhalt: Type vs Interface, Zod Integration, Generic Types

7. **`README.md`**
   - Dokumentation der Custom Instructions
   - Erklärung wie das System funktioniert
   - Best Practices Guide

## 📊 Vergleich: Vorher vs. Nachher

### Repository-weite Anweisungen

| Aspekt | Vorher | Nachher |
|--------|--------|---------|
| Länge | ~280 Zeilen | ~60 Zeilen |
| Fokus | API-Dokumentation + Code-Beispiele | Allgemeine Standards |
| Sprache | Deutsch + Englisch | Konsistent Englisch |
| Code-Beispiele | Viele | Keine |
| Struktur | Komplex, verschachtelt | Flach, übersichtlich |

### Neue pfadspezifische Anweisungen

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| API Routes | Keine spezifischen Regeln | Dedizierte Anweisungen |
| Components | Allgemeine Hinweise | React-spezifische Best Practices |
| Libraries | Keine Regeln | Error Handling, Types, Exports |
| Pages | Vermischt mit Komponenten | Separate Next.js Page-Konventionen |
| Docker | Nur in allgemeiner Doku | Eigene Build-Anweisungen |
| Types | Keine spezifischen Regeln | TypeScript Best Practices |

## 🎯 Vorteile der neuen Struktur

### 1. **Klarere Trennung**
- Allgemeine Projekt-Info in Hauptdatei
- Spezifische Regeln in pfadspezifischen Dateien
- Keine Vermischung von Concerns

### 2. **Bessere Wartbarkeit**
- Änderungen an API-Regeln → nur eine Datei
- Neue Bereiche → neue `.instructions.md` erstellen
- Übersichtlicher für Team-Mitglieder

### 3. **Präzisere Anwendung**
- Copilot wendet nur relevante Regeln an
- Weniger "Noise" in Kontext
- Bessere Code-Vorschläge

### 4. **GitHub Best Practices**
✅ Kurze, selbstständige Anweisungen
✅ Breit anwendbar auf viele Requests
✅ Keine stilistischen Vorgaben
✅ Keine externen Ressourcen-Referenzen
✅ Fokus auf technische Standards

### 5. **Dokumentations-Wert**
- Anweisungen dienen gleichzeitig als Entwickler-Docs
- Neue Team-Mitglieder sehen Standards im Code
- Konsistente Code-Qualität im gesamten Projekt

## 📝 Was NICHT in Instructions gehört

Gemäß GitHub-Dokumentation wurden folgende Dinge entfernt:

### ❌ Entfernt aus Hauptdatei:
- API-Endpoint-Dokumentation (→ gehört in README oder OpenAPI spec)
- Code-Beispiele für spezifische Features (→ gehört in Code-Kommentare)
- Detaillierte Workflow-Diagramme (→ gehört in separate Dokumentation)
- Umgebungsvariablen-Beispiele (→ gehört in .env.example)
- Docker-Commands (→ gehört in DOCKER.md)
- Feature-Checklisten (→ gehört in GitHub Issues/Projects)

### ❌ Nicht hinzugefügt:
- Anweisungen zu externen Ressourcen verwenden
- Antwort-Stil-Vorgaben ("freundlich", "informell")
- Antwort-Längen-Beschränkungen
- Tool-spezifische Anweisungen ("nutze @terminal für Git")

## 🚀 Nächste Schritte

### Weitere pfadspezifische Anweisungen (optional):

```markdown
.github/instructions/
├── middleware.instructions.md    # für src/middleware.ts
├── config.instructions.md        # für *.config.js|ts
├── tests.instructions.md         # für **/*.test.ts(x)
└── styles.instructions.md        # für **/*.css
```

### Empfohlene Wartung:

1. **Monatlich:** Anweisungen auf Aktualität prüfen
2. **Bei Breaking Changes:** Package-Versionen in Hauptdatei aktualisieren
3. **Bei neuen Patterns:** Pfadspezifische Anweisungen erweitern
4. **Nach Code-Reviews:** Häufige Feedback-Punkte als Regel aufnehmen

## 📚 Referenzen

- [GitHub Docs: Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Writing Effective Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot#writing-effective-repository-custom-instructions)
- [Glob Pattern Syntax](https://github.com/isaacs/minimatch#usage)

---

**Status:** ✅ Abgeschlossen und produktionsbereit
**Kompatibilität:** GitHub Copilot in VS Code, JetBrains IDEs, github.com
**Aktivierung:** Automatisch nach Commit der Dateien
