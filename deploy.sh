#!/bin/bash
# Quick deployment script - simple wrapper around the main deploy script

echo "🚀 AdgenXAI Quick Deploy"
echo "======================="
echo ""
echo "This will run the full deployment process:"
echo "• Install dependencies"
echo "• Run type checking"
echo "• Run tests"
echo "• Build the application"
echo "• Deploy to Netlify"
echo ""

read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/deployment/deploy.sh
else
    echo "Deployment cancelled."
    echo ""
    echo "Available options:"
    echo "• ./scripts/deployment/deploy.sh           # Full deployment"
    echo "• ./scripts/deployment/deploy.sh --build-only  # Build only"
    echo "• ./scripts/deployment/deploy.sh --dry-run     # Preview actions"
fi