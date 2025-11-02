#!/usr/bin/env bash
set -e

GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
RESET="\033[0m"

function info()  { echo -e "${YELLOW}⧗${RESET} $1"; }
function ok()    { echo -e "${GREEN}✔${RESET} $1"; }
function err()   { echo -e "${RED}✖${RESET} $1"; }

echo ""
echo -e "${GREEN}──────────────────────────────────────────────${RESET}"
echo -e "${YELLOW}  AdgenxAI Fusion v2 Cleanup Utility${RESET}"
echo -e "${GREEN}──────────────────────────────────────────────${RESET}"
echo ""

read -p "Proceed with full cleanup? This deletes virtualenv, logs, and containers [y/N]: " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

# 1. Stop and remove containers
if command -v docker >/dev/null 2>&1; then
  info "Stopping containers…"
  docker compose down --remove-orphans >/dev/null 2>&1 || true
  ok "All containers stopped"
fi

# 2. Remove virtual environment
if [ -d "venv" ]; then
  info "Removing virtual environment…"
  rm -rf venv
  ok "Virtual environment removed"
else
  ok "No virtual environment found"
fi

# 3. Clear logs and speech folders
info "Deleting logs and speech data…"
rm -rf logs/* speech/* || true
ok "Directories cleaned"

# 4. Remove npm modules if present
if [ -d "node_modules" ]; then
  info "Removing Node modules…"
  rm -rf node_modules
  ok "Node modules removed"
fi

# 5. Purge Docker images optionally
read -p "Remove Fusion Docker images too? [y/N]: " DOCKERCLEAN
if [[ "$DOCKERCLEAN" =~ ^[Yy]$ ]]; then
  docker images "adgenxai_fusion*" -q | xargs -r docker rmi -f
  ok "Images removed"
fi

echo ""
ok "Cleanup complete."
echo "Project reset to base state."
echo ""