# Makefile für einfachere Docker-Verwaltung

.PHONY: help install dev build start stop restart logs clean test docker-build docker-up docker-down docker-logs

# Default target
help:
	@echo "Bot Website - Verfügbare Befehle:"
	@echo ""
	@echo "  Development:"
	@echo "    make install      - Dependencies installieren"
	@echo "    make dev          - Development Server starten"
	@echo "    make build        - Production Build erstellen"
	@echo "    make start        - Production Server starten"
	@echo ""
	@echo "  Docker:"
	@echo "    make docker-build - Docker Image bauen"
	@echo "    make docker-up    - Docker Container starten"
	@echo "    make docker-down  - Docker Container stoppen"
	@echo "    make docker-logs  - Docker Logs anzeigen"
	@echo "    make docker-restart - Docker Container neu starten"
	@echo ""
	@echo "  Utilities:"
	@echo "    make clean        - Temporäre Dateien löschen"
	@echo "    make env          - .env Datei aus Example erstellen"
	@echo "    make secrets      - Sichere Secrets generieren"

# Development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

# Docker Commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d
	@echo "Container gestartet! Verfügbar unter http://localhost:3000"
	@echo "Logs anzeigen: make docker-logs"

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-clean:
	docker-compose down -v
	docker system prune -f

# Environment Setup
env:
	@if [ ! -f .env ]; then \
		cp .env.docker.example .env; \
		echo ".env Datei erstellt. Bitte anpassen!"; \
	else \
		echo ".env existiert bereits!"; \
	fi

secrets:
	@echo "Generiere sichere Secrets..."
	@echo "N8N_CALLBACK_SECRET=$$(openssl rand -base64 32)"
	@echo "NEXTAUTH_SECRET=$$(openssl rand -base64 32)"

# Cleanup
clean:
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf out

# Full reset
reset: clean
	rm -rf node_modules
	npm install

# Test container locally
test-docker: docker-build
	docker run --rm -p 3000:3000 --env-file .env bot-website

# Production deployment
deploy: docker-build docker-down docker-up
	@echo "Deployment abgeschlossen!"
