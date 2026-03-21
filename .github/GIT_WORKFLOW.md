# Git & GitHub Workflow

Step-by-step guide for clone, pull, push, and pull requests.

---

## 0. First-time: Create repo & push

See [.github/NEW_REPO.md](.github/NEW_REPO.md) for creating a new GitHub repo and pushing this project.

---

## 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
pnpm install
```

---

## 2. Pull latest changes

Always pull before starting work:

```bash
git pull origin main
```

Or for `develop`:

```bash
git pull origin develop
```

---

## 3. Create a feature branch

```bash
# From main (or develop)
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feat/add-login-page
# or
git checkout -b fix/api-404-handler
```

**Branch naming:**
- `feat/` – new feature
- `fix/` – bug fix
- `docs/` – documentation
- `chore/` – maintenance

---

## 4. Make changes & commit

```bash
# Stage files
git add .
# or specific: git add path/to/file

# Commit (use conventional format - enforced by commitlint)
git commit -m "feat(app): add login page"

# Or use guided commit:
pnpm commit
```

**Valid commit formats:**
```
feat(scope): description
fix(scope): description
docs: update README
chore: bump deps
```

---

## 5. Push your branch

```bash
# First push - set upstream
git push -u origin feat/add-login-page

# Later pushes
git push
```

---

## 6. Create a Pull Request (PR)

### On GitHub

1. Go to **github.com/YOUR_USERNAME/YOUR_REPO**
2. You’ll see **Compare & pull request** for your branch, or click **Pull requests → New**
3. Set:
   - **Base:** `main` (or `develop`)
   - **Compare:** your branch (e.g. `feat/add-login-page`)
4. Fill in title and description (template will appear)
5. Click **Create pull request**

### Via GitHub CLI (optional)

```bash
gh pr create --base main --head feat/add-login-page --title "feat: add login page"
```

---

## 7. PR review & merge

1. Wait for CI (build) to pass
2. Request review (if required)
3. Address review comments and push updates to the same branch
4. When approved, click **Merge pull request**
5. Choose merge type: **Create a merge commit** (or Squash)
6. Delete branch (recommended)

---

## 8. Update your branch with main

If `main` has moved ahead:

```bash
git checkout feat/add-login-page
git pull origin main
# Or: git merge main
# Resolve conflicts if any
git push
```

---

## 9. Deploy flow

| Action | Result |
|--------|--------|
| Push to `main` | CI runs → Deploy (if secrets set) |
| Push tag `v1.0.0` | Release created → Deploy |
| Push to `develop` | CI runs only |

---

## Quick reference

```bash
# Daily workflow
git pull origin main
git checkout -b feat/my-feature
# ... make changes ...
git add .
git commit -m "feat(app): my feature"
git push -u origin feat/my-feature
# → Create PR on GitHub
```

---

## Common commands

| Command | Purpose |
|--------|---------|
| `git status` | See changed files |
| `git log --oneline` | Short commit history |
| `git branch -a` | List branches |
| `git checkout main` | Switch to main |
| `git stash` | Save work in progress |
| `git stash pop` | Restore stashed work |
