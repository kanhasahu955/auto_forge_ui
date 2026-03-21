# Nuxt Microfrontend Platform

Production-ready Nuxt microfrontend platform with shared layers, packages, Element Plus UI, axios, GraphQL, and full automation (Docker, PM2, GitHub Actions).

---

## Table of Contents

1. [Git Workflow](#git-workflow)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [How to Run](#how-to-run)
6. [Project Structure](#project-structure)
7. [Environment Variables](#environment-variables)
8. [Shared Stack](#shared-stack)
9. [Deployment](#deployment)
10. [Scripts Reference](#scripts-reference)
11. [Troubleshooting](#troubleshooting)

---

## Git Workflow

- **New repo & push:** [.github/NEW_REPO.md](.github/NEW_REPO.md)
- **Clone, pull, PR:** [.github/GIT_WORKFLOW.md](.github/GIT_WORKFLOW.md)

```bash
# Quick start
git clone https://github.com/USER/REPO.git && cd REPO && pnpm install
git pull origin main
git checkout -b feat/my-feature
# ... edit ...
git add . && git commit -m "feat: my feature"
git push -u origin feat/my-feature
# → Open PR on GitHub
```

---

## Technologies Used

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Nuxt | 4.x | Full-stack Vue framework (SPA mode) |
| **UI** | Vue | 3.5 | Reactive UI |
| **UI Library** | Element Plus | 2.13 | Shared component library |
| **Build** | Vite | 7.x | Fast dev server & bundling |
| **State** | Pinia | 3.x | State management |
| **HTTP** | Axios | 1.13 | REST API client |
| **GraphQL** | graphql-request | 7.x | GraphQL client |
| **Utilities** | lodash-es | 4.x | Utilities (debounce, clone, etc.) |
| **Package Manager** | pnpm | 9+ | Monorepo workspace |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Container** | Docker | - | Production containers |
| **Process Manager** | PM2 | - | Bare-metal process management |
| **Reverse Proxy** | Nginx | latest | Routing microfrontends |
| **CI/CD** | GitHub Actions | - | Auto deploy on push |
| **SEO** | @nuxtjs/seo | 4.x | Sitemap, robots.txt, meta tags, Schema.org |

### Per-App Additions

**AutoForge:** dayjs, lucide-vue-next, vue-toastification, zod

**interview-agent:** @tanstack/vue-query, vee-validate, ag-grid, echarts, mapbox-gl, @casl/ability

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+ — `npm install -g pnpm`
- **Docker** (optional, for containerized deployment)
- **PM2** (optional, for bare-metal deployment) — `npm install -g pm2`

---

## Installation

```bash
# Clone the repository (if applicable)
cd frontends

# Install dependencies (from project root)
pnpm install
```

---

## How to Run

### Development

**Run all microfrontends in parallel:**
```bash
pnpm dev
# or
make dev
```

| App | URL |
|-----|-----|
| AutoForge (host) | http://localhost:3000 |
| interview-agent | http://localhost:3001/interview-agent/ |

**Run a single app:**
```bash
pnpm dev:AutoForge
pnpm dev:interview-agent
```

**Using Makefile:**
```bash
make dev              # Install + run all apps
make dev-autoforge    # AutoForge only
make dev-interview    # interview-agent only
make build            # Build all
make docker-up        # Docker up
make deploy-docker    # Full Docker deploy
```

### Production Build

```bash
pnpm build
```

Builds all apps. Output is in each app’s `.output/` directory.

### Docker (Production)

```bash
# Build and start
pnpm docker:build
pnpm docker:start

# Access
# http://localhost:8080          → AutoForge (host)
# http://localhost:8080/interview-agent/  → interview-agent
```

**Other Docker commands:**
```bash
pnpm docker:stop    # Stop containers
pnpm docker:logs    # Follow logs
make docker-up      # Alias for docker:start
make docker-down    # Alias for docker:stop
```

### PM2 (Bare Metal)

```bash
# Build first
pnpm build

# Start with PM2
pnpm pm2:start

# Check status
pnpm pm2:status

# View logs
pnpm pm2:logs
```

Configure nginx using `nginx/nginx.pm2.conf` and route traffic to ports 3000 (AutoForge) and 3001 (interview-agent).

---

## Project Structure

```
frontends/
├── apps/
│   ├── AutoForge/              # Host app (shell) - root path /
│   │   ├── app/
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   └── interview-agent/        # Microfrontend - /interview-agent/
│       ├── app/
│       ├── nuxt.config.ts
│       └── package.json
├── layers/
│   ├── base/                   # Shared config & composables
│   │   ├── composables/
│   │   │   ├── useApi.ts
│   │   │   ├── useSampleApi.ts
│   │   │   ├── useGraphql.ts
│   │   │   ├── useNavigation.ts
│   │   │   └── useLodash.ts
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   └── ui/                     # Shared Element Plus components
│       └── app/components/
│           ├── AppButton.vue
│           ├── AppCard.vue
│           ├── AppInput.vue
│           └── AppFormItem.vue
├── packages/
│   └── shared/                 # Reusable utilities
│       ├── api.ts              # Axios client factory
│       ├── graphql.ts          # GraphQL client
│       ├── sample-api.ts       # JSONPlaceholder demo API
│       ├── lodash.ts           # Lodash re-exports
│       ├── routing.ts          # Route helpers
│       └── package.json
├── nginx/
│   ├── nginx.conf              # For Docker
│   └── nginx.pm2.conf          # For PM2 (localhost)
├── docker/
│   ├── Dockerfile.AutoForge
│   └── Dockerfile.interview-agent
├── scripts/
│   ├── deploy.sh              # PM2 deploy
│   └── deploy-docker.sh       # Docker deploy
├── .github/
│   ├── workflows/
│   │   ├── main.yml            # CI + Deploy on main
│   │   └── release.yml         # Release + Deploy on tag v*
│   ├── pull_request_template.md
│   └── BRANCH_RULES.md        # Branch protection setup
├── package.json
├── pnpm-workspace.yaml
├── ecosystem.config.js         # PM2 config
├── docker-compose.yaml
├── Makefile
└── .env                        # Environment variables
```

---

## Environment Variables

Create `.env` in the project root (copy from `.env.example` if available):

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_SITE_URL` | Site URL (sitemap, canonical) | `https://example.com` |
| `NUXT_SITE_NAME` | Site name | - |
| `NUXT_SITE_DESCRIPTION` | Site description | - |
| `NUXT_PUBLIC_API_BASE` | Production REST API base URL | `https://api.domain.com` |
| `NUXT_PUBLIC_SAMPLE_API_BASE` | Demo/sample API (JSONPlaceholder) | `https://jsonplaceholder.typicode.com` |
| `NUXT_PUBLIC_GRAPHQL_ENDPOINT` | GraphQL endpoint | `https://api.domain.com/graphql` |
| `NUXT_API_SECRET` | Server-side API secret | - |
| `JWT_SECRET` | JWT signing secret | - |
| `DATABASE_URL` | Database connection string | - |
| `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, etc. | Optional cloud config | - |

---

## Shared Stack

### UI Components (Element Plus – full set)

All Element Plus components are wrapped with an `App` prefix in `layers/ui`. Use them across all apps:

**Basic:** AppButton, AppLink, AppSpace, AppDivider, AppContainer, AppHeader, AppMain, AppAside, AppFooter

**Form:** AppForm, AppFormItem, AppInput, AppInputNumber, AppSelect, AppOption, AppCheckbox, AppCheckboxGroup, AppRadio, AppRadioGroup, AppSwitch, AppSlider, AppDatePicker, AppTimePicker, AppCascader, AppAutocomplete, AppRate, AppUpload

**Data:** AppCard, AppTable, AppTableColumn, AppPagination, AppTag, AppAvatar, AppBadge, AppProgress, AppEmpty, AppImage, AppCollapse, AppCollapseItem, AppTree, AppDescriptions, AppDescriptionsItem, AppCarousel, AppCarouselItem, AppTimeline, AppTimelineItem, AppResult, AppTransfer, AppSkeleton

**Navigation:** AppTabs, AppTabPane, AppMenu, AppMenuItem, AppSubMenu, AppBreadcrumb, AppBreadcrumbItem, AppDropdown, AppDropdownMenu, AppDropdownItem, AppSteps, AppStep, AppBacktop, AppAffix

**Feedback:** AppAlert, AppDialog, AppDrawer, AppTooltip, AppPopover, AppPopconfirm

**Other:** AppConfigProvider, AppScrollbar

```vue
<template>
  <AppCard>
    <AppForm>
      <AppFormItem label="Name">
        <AppInput v-model="name" placeholder="Enter name" />
      </AppFormItem>
      <AppButton type="primary">Save</AppButton>
    </AppForm>
  </AppCard>
</template>
```

### Composables

| Composable | Purpose |
|------------|---------|
| `useApi()` | Axios client with auth; `api.get/post/put/patch/delete` |
| `useSampleApi()` | JSONPlaceholder: `getPosts()`, `getPost(id)`, `getUsers()`, etc. |
| `useGraphql()` | GraphQL client |
| `useNavigation()` | `go(path)`, `resolvePath()`, `ROUTES` (baseURL-aware) |
| `usePageSeo()` | Per-page meta: `usePageSeo({ title, description, image })` |
| `useLodash()` | `_.debounce`, `_.cloneDeep`, etc. |

### API Usage

```vue
<script setup lang="ts">
// Production API (auth from auth-token cookie)
const { api } = useApi()
const users = await api.get('/users')
await api.post('/users', { name: 'John' })

// Sample API (JSONPlaceholder)
const sampleApi = useSampleApi()
const posts = await sampleApi.getPosts()
const post = await sampleApi.getPost(1)
</script>
```

### SEO Usage

```vue
<script setup lang="ts">
// Per-page meta (use in pages/layouts)
usePageSeo({
  title: 'My Page Title',
  description: 'Page description for search engines',
  image: '/og-image.png',
  ogType: 'article',
})
</script>
```

- **Sitemap:** `/sitemap.xml` (auto-generated)
- **Robots:** `/robots.txt` (AutoForge; interview-agent skipped)

### GraphQL (.graphql files)

Add `.graphql` or `.gql` files in each app's `graphql/` folder (e.g. `apps/AutoForge/graphql/`). Import and use with `useGraphql()`:

```vue
<script setup lang="ts">
import GetUser from '~/graphql/user.graphql'
import GetPosts from '~/graphql/sample.graphql'

const client = useGraphql()
const user = await client.request(GetUser, { id: '1' })
const { posts } = await client.request(GetPosts)
</script>
```

- **Vite plugin:** `vite-plugin-graphql-loader` (in base layer) enables `.graphql`/.gql imports
- **TypeScript:** `*.graphql` and `*.gql` are typed as `DocumentNode`

### Direct Imports

```ts
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'
import { createGraphQLClient, gql } from '@nuxt-mfe/shared/graphql'
import { resolveRoute, ROUTES } from '@nuxt-mfe/shared/routing'
import { debounce, cloneDeep } from '@nuxt-mfe/shared/lodash'
import { SAMPLE_ENDPOINTS, SAMPLE_API_BASE } from '@nuxt-mfe/shared/sample-api'
```

---

## Deployment

### GitHub Workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| **main.yml** | Push/PR to `main`, `develop` | Build (CI) |
| **main.yml** | Push to `main` | Deploy (latest) |
| **release.yml** | Tag push `v*` (e.g. `v1.0.0`) | Build → Create Release → Deploy |

### Versioning & Releases

```bash
pnpm version:patch    # 1.0.0 → 1.0.1
pnpm version:minor    # 1.0.0 → 1.1.0
pnpm version:major    # 1.0.0 → 2.0.0
pnpm release patch    # Bump + show next steps
```

**Release flow:** Update CHANGELOG → bump version → commit → tag (`git tag v1.0.1`) → push (`git push origin main --tags`). GitHub creates Release and deploys.

### Repo Secrets

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Server hostname or IP |
| `SERVER_USER` | SSH user |
| `SSH_PRIVATE_KEY` | SSH private key content |

Push to `main` to trigger deploy. Push tag `v1.0.0` to create Release and deploy.

---

## Branch & Commit Rules

### Branch strategy
- `main` – production (protected)
- `develop` – staging

### Commit format (enforced by commitlint)
```
type(scope): subject
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

```bash
feat(app): add login page
fix(api): handle 404
chore: bump deps
```

Use `pnpm commit` for guided commit (Commitizen).

### Branch protection
Configure in **GitHub → Settings → Branches**. See [.github/BRANCH_RULES.md](.github/BRANCH_RULES.md).

### Manual Deploy

**Docker:**
```bash
# On server
cd /var/www/frontends
git pull
pnpm deploy:docker
```

**PM2:**
```bash
cd /var/www/frontends
git pull
pnpm deploy
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in dev (parallel) |
| `pnpm dev:AutoForge` | Run AutoForge only |
| `pnpm dev:interview-agent` | Run interview-agent only |
| `pnpm build` | Build all apps |
| `pnpm build:AutoForge` | Build AutoForge only |
| `pnpm build:interview-agent` | Build interview-agent only |
| `pnpm docker:build` | Build Docker images |
| `pnpm docker:start` | Start Docker containers |
| `pnpm docker:stop` | Stop Docker containers |
| `pnpm docker:logs` | Follow Docker logs |
| `pnpm pm2:start` | Start apps with PM2 |
| `pnpm pm2:stop` | Stop PM2 apps |
| `pnpm pm2:restart` | Restart PM2 apps |
| `pnpm pm2:logs` | PM2 logs |
| `pnpm pm2:status` | PM2 status |
| `pnpm deploy` | Run PM2 deploy script |
| `pnpm deploy:docker` | Run Docker deploy script |
| `pnpm ci` | Install + build (CI) |

---

## Troubleshooting

**Port already in use**
- AutoForge: 3000, interview-agent: 3001
- Change in `nuxt.config.ts` via `devServer.port`

**Docker build fails**
- Run `pnpm install` at root first
- Check `.dockerignore` excludes `node_modules`, `.nuxt`, `.output`

**PM2 apps not starting**
- Run `pnpm build` before `pnpm pm2:start`
- Ensure `apps/*/` have `.output/server/index.mjs`

**API requests fail**
- Confirm `NUXT_PUBLIC_API_BASE` in `.env`
- For sample API, `NUXT_PUBLIC_SAMPLE_API_BASE` defaults to JSONPlaceholder

**Element Plus styles missing**
- Base layer includes `@element-plus/nuxt`; no extra config needed

**Interview Agent returns 500**
- Use the **trailing slash**: `http://localhost:8080/interview-agent/` (not `/interview-agent`)
- Ensure PM2 is running: `pnpm pm2:status` — both AutoForge and interview-agent should be "online"
- Restart: `pnpm pm2:restart`
- Check logs: `pnpm pm2:logs interview-agent`

**EMFILE: too many open files** (when running `pnpm dev`)
- `pnpm dev` runs both apps; each uses file watchers. The root script sets `ulimit -n 10240` before starting.
- If you still see errors: run one app at a time (`pnpm dev:AutoForge` or `pnpm dev:interview-agent`).
- macOS: increase limit permanently: `ulimit -n 65536` in `~/.zshrc`, or use a launchd plist for system-wide limits

**Docker: "permission denied while trying to connect to the docker API"**
- Ensure **Docker Desktop is running**
- macOS: Open Docker Desktop from Applications
- Linux: `sudo usermod -aG docker $USER` then log out/in, or run `sudo docker compose up -d`
- If using Cursor/sandbox: run the command in a normal terminal (outside sandbox)
