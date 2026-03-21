#!/usr/bin/env bash
# Docker deployment script
# Run on server after: git pull
set -e

echo "🐳 Deploying Nuxt MFE platform (Docker)..."

# Load env if exists
[ -f .env.production ] && export $(grep -v '^#' .env.production | xargs)

# Build and start
docker compose build --no-cache
docker compose down
docker compose up -d

echo "🎉 Docker deploy complete. Apps available at http://localhost:8080"
echo "   - AutoForge: http://localhost:8080/"
echo "   - interview-agent: http://localhost:8080/interview-agent/"
