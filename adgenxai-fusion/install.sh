#!/usr/bin/env bash
set -e

# Color codes
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
BLUE="\033[1;34m"
RESET="\033[0m"

function info()  { echo -e "${BLUE}⧗${RESET} $1"; }
function ok()    { echo -e "${GREEN}✔${RESET} $1"; }
function warn()  { echo -e "${YELLOW}⚠${RESET} $1"; }
function err()   { echo -e "${RED}✖${RESET} $1"; }

echo -e "\n${BLUE}───────────────────────────────────────────────${RESET}"
echo -e "${GREEN}   AdgenxAI Fusion v2 Installer & Bootstrapper ${RESET}"
echo -e "${BLUE}───────────────────────────────────────────────${RESET}\n"

# Step 1. Prerequisites
info "Checking dependencies…"
command -v python >/dev/null 2>&1 || { err "Python is required."; exit 1; }
command -v git >/dev/null 2>&1 || { err "Git is required."; exit 1; }
ok "Dependencies found"

# Step 2. Virtual environment
if [ ! -d "venv" ]; then
  info "Creating virtual environment…"
  python -m venv venv
  ok "Virtual environment created"
else
  ok "Virtual environment already exists"
fi

# Step 3. Activate
. venv/bin/activate
ok "Environment activated"

# Step 4. Install packages
info "Installing Python dependencies…"
pip install --upgrade pip >/dev/null
pip install -r requirements.txt --quiet && ok "Packages installed"

# Step 5. Ensure directories
info "Preparing directories…"
mkdir -p logs speech && ok "Directories ready"

# Step 6. Environment file
if [ ! -f ".env" ]; then
  cp .env.example .env
  warn ".env created from template — add your keys"
else
  ok ".env already configured"
fi

# Step 7. Optional npm install
if [ -f "package.json" ]; then
  if command -v npm >/dev/null 2>&1; then
    info "Installing Node dependencies…"
    npm install --quiet && ok "Node packages installed"
  else
    warn "npm not found — skipping JS dependencies"
  fi
fi

# Step 8. Banner display
if [ -f "./fusion_banner.sh" ]; then
  chmod +x ./fusion_banner.sh
  ./fusion_banner.sh
fi

echo -e "\n${GREEN}✓ Installation complete${RESET}"
echo "Next steps:"
echo "  1. source venv/bin/activate"
echo "  2. python app.py"
echo "  3. Visit http://127.0.0.1:8000"
echo ""