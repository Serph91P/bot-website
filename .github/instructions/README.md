# GitHub Copilot Custom Instructions

Dieses Projekt verwendet **GitHub Copilot Custom Instructions** um konsistente Code-Qualität und Best Practices sicherzustellen.

## 📁 Struktur

### Repository-weite Anweisungen
**Datei:** `.github/copilot-instructions.md`

Enthält allgemeine Anweisungen für das gesamte Projekt:
- Project Overview
- Folder Structure
- Libraries and Frameworks
- Coding Standards
- API and Integration Patterns
- UI Guidelines

Diese Anweisungen gelten für **alle** Dateien im Repository.

### Pfadspezifische Anweisungen
**Verzeichnis:** `.github/instructions/`

Enthält spezialisierte Anweisungen für bestimmte Dateitypen:

| Datei | Gilt für | Beschreibung |
|-------|----------|--------------|
| `api-routes.instructions.md` | `src/app/api/**/*.ts` | Next.js API Route Standards |
| `components.instructions.md` | `src/components/**/*.tsx` | React Component Best Practices |
| `lib.instructions.md` | `src/lib/**/*.ts` | Library/Utility Function Guidelines |
| `pages.instructions.md` | `src/app/**/page.tsx`, `src/app/**/layout.tsx` | Next.js Page/Layout Conventions |
| `docker.instructions.md` | `Dockerfile`, `docker-compose*.yml` | Docker Best Practices |

## 🎯 Wie es funktioniert

### 1. Automatische Anwendung
GitHub Copilot liest diese Anweisungen automatisch und wendet sie an, wenn du:
- Code mit Copilot Chat generierst
- Copilot um Hilfe bittest
- Code-Vervollständigungen erhältst

### 2. Priorisierung
Bei Konflikten zwischen verschiedenen Anweisungsdateien gilt:
1. **Pfadspezifische Anweisungen** (höchste Priorität)
2. **Repository-weite Anweisungen**
3. **Copilot's eingebautes Wissen** (niedrigste Priorität)

### 3. Beispiel

Wenn du in `src/components/sender/SenderInput.tsx` arbeitest:
- ✅ `copilot-instructions.md` wird angewendet (Project Overview, Coding Standards)
- ✅ `components.instructions.md` wird angewendet (Component Best Practices)
- ✅ Spezifische Anweisungen aus `components.instructions.md` überschreiben allgemeine

## 📝 Best Practices beim Schreiben von Anweisungen

### ✅ Gute Anweisungen (kurz, spezifisch, umsetzbar)
```markdown
- Use TypeScript with strict mode enabled
- Use arrow functions for React components
- Export types from /src/types/index.ts
- Return consistent JSON structure: { status, message, data?, error? }
```

### ❌ Schlechte Anweisungen (zu vage, stilistisch, zu detailliert)
```markdown
- Always be friendly and informal when generating code
- Answer all questions in less than 1000 characters
- Always use external styleguide from another repo
- Use @terminal when answering Git questions
```

## 🔧 Wartung

### Anweisungen hinzufügen
1. Bearbeite `.github/copilot-instructions.md` für repository-weite Änderungen
2. Erstelle neue `.instructions.md` Datei in `.github/instructions/` für pfadspezifische Regeln

### Format für pfadspezifische Anweisungen
```markdown
---
applyTo: "pfad/zu/dateien/**/*.ts"
---

# Titel

- Anweisung 1
- Anweisung 2
```

### Mehrere Pfade
```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---
```

### Alle Dateien
```markdown
---
applyTo: "**"
---
```

## 📚 Weitere Ressourcen

- [GitHub Docs: Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Best Practices Guide](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot#writing-effective-repository-custom-instructions)

## ✨ Vorteile

- **Konsistenz:** Alle Entwickler und Copilot folgen denselben Standards
- **Onboarding:** Neue Entwickler lernen Projekt-Konventionen automatisch
- **Qualität:** Reduziert häufige Fehler und Anti-Patterns
- **Effizienz:** Weniger Code-Review-Kommentare zu Stil-Fragen
- **Dokumentation:** Anweisungen dienen gleichzeitig als Entwickler-Dokumentation

## 🚀 Aktivierung

Diese Anweisungen sind **automatisch aktiv** sobald die Dateien im `.github/` Verzeichnis liegen.

Keine weitere Konfiguration nötig! 🎉
