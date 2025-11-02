#!/bin/bash
# deploy.sh - Cross-platform deployment script for AdgenXAI
# Usage: ./scripts/deployment/deploy.sh [--build-only] [--dry-run]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Options
BUILD_ONLY=false
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --build-only)
      BUILD_ONLY=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 AdgenXAI Deployment Script${NC}"
echo "======================================"

# Check prerequisites
echo -e "\n${YELLOW}▶ Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js and npm are available${NC}"

# Install dependencies
echo -e "\n${YELLOW}▶ Installing dependencies...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}[DRY RUN] Would run: npm ci${NC}"
else
    npm ci
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Type check
echo -e "\n${YELLOW}▶ Running type check...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}[DRY RUN] Would run: npm run typecheck${NC}"
else
    npm run typecheck
    echo -e "${GREEN}✓ Type check passed${NC}"
fi

# Run tests
echo -e "\n${YELLOW}▶ Running tests...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}[DRY RUN] Would run: npm test${NC}"
else
    npm test
    echo -e "${GREEN}✓ Tests passed${NC}"
fi

# Build
echo -e "\n${YELLOW}▶ Building application...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}[DRY RUN] Would run: npm run build${NC}"
else
    npm run build
    echo -e "${GREEN}✓ Build completed${NC}"
fi

# Deploy (if not build-only)
if [ "$BUILD_ONLY" = false ]; then
    echo -e "\n${YELLOW}▶ Deploying to Netlify...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}⚠ Netlify CLI not found. Installing...${NC}"
        if [ "$DRY_RUN" = true ]; then
            echo -e "${BLUE}[DRY RUN] Would run: npm install -g netlify-cli${NC}"
        else
            npm install -g netlify-cli
        fi
    fi
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "${BLUE}[DRY RUN] Would run: npm run deploy${NC}"
    else
        npm run deploy
        echo -e "${GREEN}✓ Deployed to Netlify${NC}"
    fi
fi

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"

if [ "$BUILD_ONLY" = false ] && [ "$DRY_RUN" = false ]; then
    echo -e "\n${BLUE}📋 Next steps:${NC}"
    echo "• Check your Netlify dashboard for deployment status"
    echo "• Test your application at your Netlify URL"
    echo "• Monitor function logs if using serverless functions"
fi