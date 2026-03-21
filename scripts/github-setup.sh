#!/usr/bin/env bash
# Create new GitHub repo and push frontend projects
# Usage: ./scripts/github-setup.sh GITHUB_USERNAME REPO_NAME
# Example: ./scripts/github-setup.sh myuser nuxt-mfe-frontends
set -e

USER=${1:? "Usage: $0 GITHUB_USERNAME REPO_NAME"}
REPO=${2:? "Usage: $0 GITHUB_USERNAME REPO_NAME"}
REMOTE="https://github.com/${USER}/${REPO}.git"

echo ">>> Setting up Git for ${USER}/${REPO}"
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Init git if needed
if [ ! -d .git ]; then
  echo ">>> Initializing git..."
  git init
fi

# Add remote (replace if exists)
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"

echo ""
echo ">>> Next steps:"
echo "1. Create repo on GitHub: https://github.com/new"
echo "   - Name: $REPO"
echo "   - Do NOT add README, .gitignore (we have them)"
echo ""
echo "2. Then run:"
echo "   git add ."
echo "   git commit -m \"chore: initial commit\""
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
