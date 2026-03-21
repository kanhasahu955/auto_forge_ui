#!/usr/bin/env bash
# PM2 bare-metal deployment script
# Run on server after: git pull
set -e

echo "🚀 Deploying Nuxt MFE platform (PM2)..."

# Load env if exists
[ -f .env.production ] && export $(grep -v '^#' .env.production | xargs)

# Install deps
pnpm install

# Build all apps
pnpm build

# Restart PM2
if pm2 describe AutoForge >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js
  echo "✅ PM2 apps reloaded"
else
  mkdir -p logs
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup || true
  echo "✅ PM2 apps started"
fi

echo "🎉 Deploy complete. Run 'pm2 status' to verify."
