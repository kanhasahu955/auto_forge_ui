#!/usr/bin/env bash
# Create a new release: bump version, commit, tag, push
# Usage: ./scripts/release.sh [patch|minor|major]
set -e

TYPE=${1:-patch}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT"

# Bump version (updates package.json only)
pnpm version:$TYPE

VERSION=$(node -p "require('./package.json').version")

echo "Version bumped to $VERSION"
echo "Next steps:"
echo "  1. Update CHANGELOG.md for $VERSION"
echo "  2. git add . && git commit -m \"chore: release v$VERSION\""
echo "  3. git tag v$VERSION"
echo "  4. git push origin main && git push origin v$VERSION"
echo ""
echo "Or run: git add . && git commit -m 'chore: release v$VERSION' && git tag v$VERSION && git push origin main --tags"
