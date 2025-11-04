#!/bin/bash

#######################################################################
# AdGenXAI - Netlify Deployment Script
#######################################################################
# This script automates the deployment process to Netlify
# Usage: ./scripts/deploy-to-netlify.sh [production|preview]
#######################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check deployment mode
DEPLOY_MODE="${1:-preview}"

echo ""
echo "🚀 AdGenXAI - Netlify Deployment"
echo "=================================="
echo ""

# Validate deployment mode
if [[ "$DEPLOY_MODE" != "production" && "$DEPLOY_MODE" != "preview" ]]; then
    print_error "Invalid deployment mode: $DEPLOY_MODE"
    echo "Usage: $0 [production|preview]"
    exit 1
fi

print_step "Deployment mode: $DEPLOY_MODE"
echo ""

# Check if Netlify CLI is installed
print_step "Checking Netlify CLI installation..."
if ! command -v netlify &> /dev/null; then
    print_error "Netlify CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  npm install -g netlify-cli"
    echo ""
    exit 1
fi
print_success "Netlify CLI is installed"

# Check if logged in to Netlify
print_step "Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    print_warning "Not logged in to Netlify"
    print_step "Logging in to Netlify..."
    netlify login
fi
print_success "Authenticated with Netlify"

# Check for .env.local file
print_step "Checking environment configuration..."
if [[ ! -f ".env.local" && "$DEPLOY_MODE" == "production" ]]; then
    print_warning "No .env.local file found"
    echo "Make sure environment variables are configured in Netlify Dashboard"
    echo "Visit: https://app.netlify.com/sites/YOUR_SITE/settings/deploys#environment"
fi

# Run pre-deployment checks
print_step "Running pre-deployment checks..."

# Check for TypeScript errors
print_step "Type-checking..."
if npm run typecheck; then
    print_success "Type check passed"
else
    print_error "Type check failed"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run tests
print_step "Running tests..."
if npm test; then
    print_success "Tests passed"
else
    print_error "Tests failed"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the application
print_step "Building application..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Deploy to Netlify
echo ""
if [[ "$DEPLOY_MODE" == "production" ]]; then
    print_step "Deploying to production..."
    print_warning "⚠️  This will deploy to PRODUCTION!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 0
    fi

    netlify deploy --prod
else
    print_step "Creating deploy preview..."
    netlify deploy
fi

if [ $? -eq 0 ]; then
    echo ""
    print_success "Deployment successful! 🎉"
    echo ""

    # Get site info
    print_step "Site information:"
    netlify status

    echo ""
    print_step "Next steps:"
    if [[ "$DEPLOY_MODE" == "preview" ]]; then
        echo "1. Review the deploy preview URL above"
        echo "2. Test all functionality"
        echo "3. Deploy to production with: npm run deploy"
    else
        echo "1. Visit your production site"
        echo "2. Verify all features are working"
        echo "3. Monitor logs in Netlify dashboard"
    fi
    echo ""
else
    print_error "Deployment failed"
    exit 1
fi
