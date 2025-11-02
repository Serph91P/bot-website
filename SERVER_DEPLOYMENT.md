# 🚀 Server Deployment - Ultra Simple

## 📦 Was passiert:

1. Du pushst das Repo zu GitHub
2. Du klonst es auf deinen Server
3. Du erstellst `.env`
4. Du führst **ein Script** aus → **Fertig!**

Docker-Compose baut automatisch das Image auf dem Server und startet den Container.

---

## 🎯 Schritt-für-Schritt:

### Auf deinem Rechner:
```bash
# Repository zu GitHub pushen
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Auf dem Server:

#### 1. Repository klonen
```bash
cd /opt
git clone https://github.com/dein-username/bot-website.git
cd bot-website
```

#### 2. Environment Variables erstellen
```bash
cp .env.example .env
nano .env
```

Fülle aus:
```env
EMBY_SERVER_URL=https://your-emby-server.com
EMBY_API_KEY=your-api-key
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/sender-search
N8N_WEBHOOK_SECRET=dein-geheimes-token
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

#### 3. Deploy starten
```bash
./deploy-simple.sh
```

**Das war's!** 🎉

---

## 📋 Was das Script macht:

```bash
./deploy-simple.sh
```

Automatisch:
- ✅ Prüft ob Docker installiert ist
- ✅ Validiert `.env` Datei
- ✅ Stoppt alte Container
- ✅ **Baut Docker Image auf dem Server**
- ✅ Startet neuen Container
- ✅ Macht Health Check

---

## 🔄 Updates deployen:

Wenn du Code-Änderungen machst:

```bash
# Auf dem Server:
cd /opt/bot-website
git pull
./deploy-simple.sh
```

Fertig! Der Container wird neu gebaut mit den neuen Änderungen.

---

## 🌐 Reverse Proxy einrichten:

Nach erfolgreichem Deployment:

```bash
# 1. Nginx Config kopieren
sudo cp nginx.conf /etc/nginx/sites-available/bot-website

# 2. Domain anpassen
sudo sed -i 's/your-domain.com/deine-domain.de/g' /etc/nginx/sites-available/bot-website

# 3. Aktivieren
sudo ln -s /etc/nginx/sites-available/bot-website /etc/nginx/sites-enabled/

# 4. SSL Zertifikat (Let's Encrypt)
sudo certbot --nginx -d deine-domain.de

# 5. Nginx neu laden
sudo nginx -t
sudo systemctl reload nginx
```

**Jetzt:** Update `NEXTAUTH_URL` in `.env`:
```bash
nano .env
# Ändere: NEXTAUTH_URL=https://deine-domain.de
./deploy-simple.sh
```

---

## 🛠️ Nützliche Befehle:

```bash
# Logs anschauen
docker compose logs -f

# Container Status
docker compose ps

# Container neu starten
docker compose restart

# Container stoppen
docker compose down

# Neu deployen
./deploy-simple.sh
```

---

## 🎯 Zusammenfassung:

### Auf dem Server brauchst du nur:

1. **Docker & Docker Compose** installiert
2. **Git** installiert
3. **3 Befehle:**
   ```bash
   git clone <repo-url> /opt/bot-website
   cd /opt/bot-website && cp .env.example .env && nano .env
   ./deploy-simple.sh
   ```

**Das Image wird automatisch auf dem Server gebaut!**

Kein lokales Bauen, kein Registry Push - alles passiert direkt auf dem Server. 🚀

---

## ❓ FAQ

**Q: Muss ich das Image irgendwohin pushen?**  
A: Nein! `docker-compose up --build` baut es direkt auf dem Server.

**Q: Wie update ich die App?**  
A: `git pull && ./deploy-simple.sh`

**Q: Kann ich auch manuell bauen?**  
A: Ja: `docker compose up -d --build`

**Q: Wo liegen die Built-Files?**  
A: Im Docker Image, nicht auf dem Host. Docker managed alles.

**Q: Brauche ich node/npm auf dem Server?**  
A: Nein! Docker Container hat alles drin.

---

**Das ist der einfachste Weg!** ✨
