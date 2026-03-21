#!/usr/bin/env bash
# Start nginx for PM2 apps (macOS)
# Apps must be running: pnpm pm2:start
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$SCRIPT_DIR/../nginx/nginx.pm2.mac.conf"

# Stop existing nginx using our config
nginx -s stop 2>/dev/null || true
sleep 1

# Start nginx with our config
nginx -c "$CONFIG"

echo "Nginx started. Open http://localhost:8080"
echo "  - AutoForge: http://localhost:8080/"
echo "  - interview-agent: http://localhost:8080/interview-agent/"
