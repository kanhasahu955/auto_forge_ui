# Create New Repo & Push

## 1. Create repo on GitHub

1. Open **https://github.com/new**
2. **Repository name:** e.g. `nuxt-mfe-frontends`
3. **Description:** (optional) Nuxt microfrontend platform
4. **Public** or **Private**
5. **Do NOT** add README, .gitignore, or license (we have them)
6. Click **Create repository**

---

## 2. Fix nested .git (if `git add .` fails)

If you see `does not have a commit checked out` or `unable to index file`, remove nested `.git` folders:

```bash
rm -rf apps/AutoForge/.git apps/interview-agent/.git
```

Then run `git add .` again.

---

## 3. Push from your machine

From the `frontends` folder:

```bash
# If not a git repo yet
cd /path/to/frontends
git init

# Add all files
git add .

# First commit
git commit -m "chore: initial commit"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USER and YOUR_REPO)
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git

# Push
git push -u origin main
```

---

## 4. Using the setup script

```bash
./scripts/github-setup.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME
# Then follow the printed steps
```

---

## 5. After first push

- **develop branch:** `git checkout -b develop && git push -u origin develop`
- **Secrets:** Settings → Secrets → Add `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY` for deploy
- **Branch protection:** Settings → Branches → Add rule for `main`
