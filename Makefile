.PHONY: dev dev-all build docker-up docker-down deploy install

# Default: run all microfrontends in dev
dev: install
	pnpm dev

dev-all: dev

# Single app dev
dev-autoforge:
	pnpm dev:AutoForge

dev-interview:
	pnpm dev:interview-agent

# Build all apps
build:
	pnpm build

# Docker
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# PM2 (bare metal)
pm2-start:
	pnpm pm2:start

pm2-stop:
	pnpm pm2:stop

pm2-restart:
	pnpm pm2:restart

# Deploy
deploy:
	bash scripts/deploy.sh

deploy-docker:
	bash scripts/deploy-docker.sh

# Install deps
install:
	pnpm install
