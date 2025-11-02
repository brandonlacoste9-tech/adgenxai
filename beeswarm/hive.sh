#!/usr/bin/env bash
set -e

# 🐝 BeeHive Studio - Command Center
# Unified automation for creative expansion and development

GOLD='\033[0;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# ASCII Art Banner
echo -e "${GOLD}"
cat << "EOF"
    🐝 BeeHive Studio Command Center 🐝
    
    ████████████████████████████████████████
    ██                                    ██
    ██  ⬢  CREATIVE AUTOMATION NEXUS  ⬢   ██  
    ██                                    ██
    ████████████████████████████████████████
    
EOF
echo -e "${NC}"

show_help() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${GOLD}🌟 BeeHive Studio Automation Commands${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "${CYAN}📁 ASSET MANAGEMENT:${NC}"
  echo -e "${BLUE}  bash hive.sh push <filename>              ${NC}# Push creative asset to hive"
  echo -e "${BLUE}  bash hive.sh push <file> <custom-path>    ${NC}# Push to custom destination"
  echo ""
  echo -e "${CYAN}🎨 PAGE SCAFFOLDING:${NC}"
  echo -e "${BLUE}  bash hive.sh page <PageName>              ${NC}# Create standard page"
  echo -e "${BLUE}  bash hive.sh page <Name> <asset.jpg>      ${NC}# Create page with hero asset"
  echo -e "${BLUE}  bash hive.sh page <Name> <asset> <type>   ${NC}# Create typed page"
  echo ""
  echo -e "${CYAN}🔧 DEVELOPMENT:${NC}"
  echo -e "${BLUE}  bash hive.sh dev                          ${NC}# Start development server"
  echo -e "${BLUE}  bash hive.sh build                        ${NC}# Build for production"
  echo -e "${BLUE}  bash hive.sh preview                      ${NC}# Preview production build"
  echo ""
  echo -e "${CYAN}📊 PROJECT STATUS:${NC}"
  echo -e "${BLUE}  bash hive.sh status                       ${NC}# Show git and build status"
  echo -e "${BLUE}  bash hive.sh stats                        ${NC}# Show project statistics"
  echo ""
  echo -e "${CYAN}🚀 DEPLOYMENT:${NC}"
  echo -e "${BLUE}  bash hive.sh deploy                       ${NC}# Deploy to production"
  echo -e "${BLUE}  bash hive.sh sync                         ${NC}# Sync with remote repository"
  echo ""
  echo -e "${PURPLE}📝 Page Types: standard, dashboard, laboratory, gallery, feed${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Check if no arguments provided
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

COMMAND="$1"
shift

case "$COMMAND" in
  "push")
    echo -e "${GOLD}🚀 Initiating Asset Push Sequence...${NC}"
    ./hive_push.sh "$@"
    ;;
    
  "page")
    echo -e "${GOLD}🎨 Initiating Page Scaffolding Ceremony...${NC}"
    ./hive_page.sh "$@"
    ;;
    
  "dev")
    echo -e "${GOLD}🔧 Starting BeeHive Development Server...${NC}"
    npm run dev
    ;;
    
  "build")
    echo -e "${GOLD}🏗️  Building BeeHive for Production...${NC}"
    npm run build
    ;;
    
  "preview")
    echo -e "${GOLD}👁️  Previewing Production Build...${NC}"
    npm run preview
    ;;
    
  "status")
    echo -e "${GOLD}📊 BeeHive Status Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}🌿 Git Status:${NC}"
    git status --short
    echo ""
    echo -e "${CYAN}📈 Recent Commits:${NC}"
    git log --oneline -5
    echo ""
    echo -e "${CYAN}📁 Project Structure:${NC}"
    echo -e "${BLUE}   Source Files: $(find src -name '*.tsx' -o -name '*.ts' | wc -l)${NC}"
    echo -e "${BLUE}   Assets: $(find src/assets -type f 2>/dev/null | wc -l)${NC}"
    echo -e "${BLUE}   Pages: $(find src/pages -name '*.tsx' 2>/dev/null | wc -l)${NC}"
    echo -e "${BLUE}   Components: $(find src/components -name '*.tsx' 2>/dev/null | wc -l)${NC}"
    ;;
    
  "stats")
    echo -e "${GOLD}📊 BeeHive Project Statistics${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    
    # Count lines of code
    if command -v cloc &> /dev/null; then
      echo -e "${CYAN}📝 Code Statistics (via cloc):${NC}"
      cloc src/ --quiet
    else
      echo -e "${CYAN}📝 Code Statistics:${NC}"
      echo -e "${BLUE}   TypeScript/TSX: $(find src -name '*.tsx' -o -name '*.ts' | xargs wc -l | tail -1 | awk '{print $1}') lines${NC}"
      echo -e "${BLUE}   CSS/Styles: $(find src -name '*.css' -o -name '*.scss' | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo 0) lines${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}📦 Dependencies:${NC}"
    echo -e "${BLUE}   Total: $(cat package.json | jq -r '.dependencies // {} | keys | length') runtime + $(cat package.json | jq -r '.devDependencies // {} | keys | length') dev${NC}"
    echo -e "${BLUE}   Framer Motion: $(npm list framer-motion --depth=0 2>/dev/null | grep framer-motion || echo 'Not installed')${NC}"
    echo -e "${BLUE}   React: $(npm list react --depth=0 2>/dev/null | grep react || echo 'Not installed')${NC}"
    ;;
    
  "deploy")
    echo -e "${GOLD}🚀 Deploying BeeHive to Production...${NC}"
    echo -e "${BLUE}Building optimized version...${NC}"
    npm run build
    echo -e "${BLUE}Syncing with repository...${NC}"
    git add .
    git commit -m "🐝 BeeHive Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit"
    git push origin main
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    ;;
    
  "sync")
    echo -e "${GOLD}🔄 Syncing BeeHive with Remote Repository...${NC}"
    git pull origin main
    npm install
    echo -e "${GREEN}✅ Sync complete!${NC}"
    ;;
    
  "help"|"-h"|"--help")
    show_help
    ;;
    
  *)
    echo -e "${GOLD}⚠️  Unknown command: $COMMAND${NC}"
    echo -e "${BLUE}Use 'bash hive.sh help' to see all available commands${NC}"
    exit 1
    ;;
esac