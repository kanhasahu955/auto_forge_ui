# Branch & PR Rules

Configure these in **GitHub → Settings → Branches** (or via GitHub API).

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production – protected, deploy on push |
| `develop` | Staging – CI only |

## Branch Protection (main)

1. Go to **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main`
3. Enable:
   - **Require a pull request before merging**
     - Required approvals: 1
   - **Require status checks to pass**
     - Add: `build` (from main.yml)
   - **Require branches to be up to date**
   - **Do not allow bypassing**
4. Save

## Branch Protection (develop)

- Same as main, or relax (e.g. allow direct push for dev)

## Commit Rules (enforced via commitlint)

Format: `type(scope): subject`

```
feat(app): add login page
fix(api): handle 404 response
docs: update README
chore: bump deps
```

## PR Rules

- Use PR template (auto-fills when opening PR)
- Link related issue if any
- Ensure CI passes before merge
