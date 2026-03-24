# AutoForge Platform UI

Platform UI connected to Auth and Organization backend services.

## Setup

1. **Start backend services:**
   ```bash
   cd backend
   make auth          # Auth on :8001
   make organization  # Organization on :8007
   make gateway       # Gateway on :8000 (proxies all APIs)
   ```

2. **Configure frontend** (optional — defaults):
   ```bash
   # In frontends/.env or frontends/apps/AutoForge/.env
   NUXT_PUBLIC_API_BASE=http://localhost:8000
   NUXT_PUBLIC_AUTH_API_BASE=http://localhost:8001   # Auth service (direct)
   ```

3. **Start frontend:**
   ```bash
   cd frontends
   pnpm dev
   ```
   AutoForge: http://localhost:3000 | Interview Agent: http://localhost:3001

## Implemented

### Auth (via auth service directly)

- **Login** — `/auth/login` — email/password, stores JWT in `auth-token` cookie
- **Register** — `/auth/register` — name, email, password, role (student/recruiter/candidate)
- **Logout** — clears token, calls backend logout
- **Nav** — Login/Register when unauthenticated; user dropdown (Organizations, Sign out) when authenticated

### Organizations (via gateway `/api/v1/organizations`)

- **List** — `/organizations` — list all orgs, create new
- **Detail** — `/organizations/[id]` — org info, activities, assessments, members
- **Create org** — modal with name + slug
- **Members** — list members, invite member (UI ready)

### Composables

| Composable | Layer | Purpose |
|------------|-------|---------|
| `useAuth()` | base | user, isLoggedIn, setToken, logout |
| `useAuthApi()` | AutoForge | login, register, fetchMe, logout (API calls) |
| `useOrganizationApi()` | AutoForge | listOrgs, getOrg, createOrg, listActivities, listAssessments, listMembers, inviteMember |

### Middleware

- `auth` — redirects unauthenticated users from `/organizations/*` to `/auth/login`

### Microfrontends

- **AutoForge** (shell) — login, register, organizations, DSA, interview, resume
- **Interview Agent** — uses `useAuth()` from base layer; token comes from cookie set by AutoForge

## API Flow

```
Browser → http://localhost:3000 (AutoForge)
       → useAuthApi() → http://localhost:8001 (Auth service direct)
       → useApi() → http://localhost:8000 (Gateway) → /api/v1/organizations/* → Organization service :8007
```
