#!/usr/bin/env bash
set -e

GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

function ok()   { echo -e "${GREEN}✔${RESET} $1"; }
function info() { echo -e "${YELLOW}⧗${RESET} $1"; }

VERSION_FILE="fusion_banner.sh"
CHANGELOG="CHANGELOG.md"
PACKAGE="package.json"

if [ $# -eq 0 ]; then
  echo "Usage: bash bump_version.sh <new_version>"
  exit 1
fi

NEW_VERSION=$1
DATE=$(date +"%Y-%m-%d")

info "Updating version to $NEW_VERSION..."

# 1. Update fusion_banner.sh
if [ -f "$VERSION_FILE" ]; then
  sed -i.bak -E "s/VERSION=\"[^\"]+\"/VERSION=\"$NEW_VERSION\"/" "$VERSION_FILE"
  ok "Updated banner version"
fi

# 2. Update package.json (if present)
if [ -f "$PACKAGE" ]; then
  sed -i.bak -E "s/\"version\": *\"[0-9\.]+\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE"
  ok "Updated package.json"
fi

# 3. Append changelog entry
if [ -f "$CHANGELOG" ]; then
  cat <<EOF >> "$CHANGELOG"

## [$NEW_VERSION] – $DATE
### Added
- Minor enhancements and version bump automation.

EOF
  ok "Appended entry to CHANGELOG.md"
fi

# 4. Commit changes
git add $VERSION_FILE $PACKAGE $CHANGELOG 2>/dev/null || true
git commit -m "Bump version to $NEW_VERSION" >/dev/null 2>&1 || true
git tag -a "v$NEW_VERSION" -m "AdgenxAI Fusion v$NEW_VERSION"

ok "Version bump complete → $NEW_VERSION"
echo ""
echo "Remember to push the tag:"
echo "  git push origin main --tags"