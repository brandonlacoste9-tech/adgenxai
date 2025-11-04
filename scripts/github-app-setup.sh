#!/bin/bash
# GitHub App Configuration Setup Script
# This script helps you configure the GitHub App for automated PR/Issue management

set -e

echo "🚀 GitHub App Configuration Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration directory
AGENT_DIR="agents/github-pr-manager"
ENV_FILE="$AGENT_DIR/.env"
ENV_EXAMPLE="$AGENT_DIR/.env.example"

echo -e "${BLUE}This script will guide you through GitHub App setup${NC}"
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists at $ENV_FILE${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting without changes"
        exit 0
    fi
    # Backup existing .env
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%s)"
    echo -e "${GREEN}✓ Created backup of existing .env${NC}"
fi

# Check if we're in the right directory
if [ ! -d "$AGENT_DIR" ]; then
    echo -e "${RED}✗ Error: $AGENT_DIR directory not found${NC}"
    echo "Please run this script from the repository root"
    exit 1
fi

echo ""
echo "📋 Step 1: Create GitHub App"
echo "=============================="
echo ""
echo "1. Visit: https://github.com/settings/apps"
echo "2. Click 'New GitHub App'"
echo "3. Fill in the following details:"
echo ""
echo "   Name: AdGenXAI PR Manager"
echo "   Homepage URL: https://github.com/brandonlacoste9-tech/adgenxai"
echo "   Webhook URL: https://your-domain.com/webhook (or use ngrok for testing)"
echo "   Webhook Secret: Generate a strong secret (save it!)"
echo ""
echo "4. Set Permissions:"
echo "   - Issues: Read & Write"
echo "   - Pull requests: Read & Write"
echo "   - Contents: Read"
echo "   - Metadata: Read"
echo "   - Checks: Write"
echo ""
echo "5. Subscribe to Events:"
echo "   - Issues"
echo "   - Pull requests"
echo "   - Pull request reviews"
echo "   - Issue comments"
echo ""
echo "6. Click 'Create GitHub App'"
echo "7. Generate and download the Private Key"
echo "8. Install the app to your repository"
echo ""

read -p "Press Enter when you've created the GitHub App..."
echo ""

# Collect GitHub App credentials
echo "📝 Step 2: Enter GitHub App Credentials"
echo "========================================"
echo ""

read -p "Enter your GitHub App ID: " GITHUB_APP_ID
read -p "Enter your GitHub Installation ID: " GITHUB_INSTALLATION_ID
read -p "Enter your Webhook Secret: " GITHUB_WEBHOOK_SECRET
echo ""
echo "Enter your Private Key (paste the entire content, then press Ctrl+D):"
GITHUB_PRIVATE_KEY=$(</dev/stdin)

# Validate inputs
if [ -z "$GITHUB_APP_ID" ] || [ -z "$GITHUB_INSTALLATION_ID" ] || [ -z "$GITHUB_WEBHOOK_SECRET" ] || [ -z "$GITHUB_PRIVATE_KEY" ]; then
    echo -e "${RED}✗ Error: All credentials are required${NC}"
    exit 1
fi

# Create .env file
echo ""
echo "💾 Step 3: Creating .env file"
echo "=============================="

cat > "$ENV_FILE" << EOF
# GitHub App Configuration
GITHUB_APP_ID=$GITHUB_APP_ID
GITHUB_PRIVATE_KEY="$GITHUB_PRIVATE_KEY"
GITHUB_INSTALLATION_ID=$GITHUB_INSTALLATION_ID
GITHUB_WEBHOOK_SECRET=$GITHUB_WEBHOOK_SECRET

# Agent Configuration
MAX_CONCURRENT_TASKS=10
TASK_TIMEOUT=300000
RETRY_ATTEMPTS=3

# Specialized Agent Endpoints
SECURITY_AGENT_ENDPOINT=http://localhost:3001
CODE_REVIEW_AGENT_ENDPOINT=http://localhost:3002
TESTING_AGENT_ENDPOINT=http://localhost:3003
DOCUMENTATION_AGENT_ENDPOINT=http://localhost:3004
PERFORMANCE_AGENT_ENDPOINT=http://localhost:3005
DEPLOYMENT_AGENT_ENDPOINT=http://localhost:3006

# Database Configuration
DATABASE_URL=sqlite://./github_agent.db

# Monitoring Configuration
MONITORING_ENABLED=true
MONITORING_ENDPOINT=http://prometheus:9090

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Security
CORS_ORIGIN=*
TRUST_PROXY=false

# Optional: Feature Flags
ENABLE_AUTO_MERGE=false
ENABLE_CODE_GENERATION=true
ENABLE_ISSUE_AUTO_ASSIGNMENT=true
ENABLE_PR_AUTO_LABELING=true
EOF

echo -e "${GREEN}✓ Created .env file at $ENV_FILE${NC}"
echo ""

# Test configuration
echo "🧪 Step 4: Testing Configuration"
echo "================================="
echo ""

cd "$AGENT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building project..."
npm run build

# Start the server (in background)
echo "Starting GitHub Agent server..."
npm start &
AGENT_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health || echo "failed")

if [[ $HEALTH_CHECK == *"status"* ]]; then
    echo -e "${GREEN}✓ GitHub Agent is running successfully!${NC}"
    echo ""
    echo "Server details:"
    echo "$HEALTH_CHECK"
else
    echo -e "${RED}✗ Failed to start GitHub Agent${NC}"
    echo "Check logs for errors"
    kill $AGENT_PID 2>/dev/null
    exit 1
fi

# Stop the test server
kill $AGENT_PID 2>/dev/null

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Next Steps:"
echo "1. Start the agent: cd $AGENT_DIR && npm start"
echo "2. Or use PM2: npm run agent:deploy"
echo "3. Configure webhook URL in GitHub App settings"
echo "4. Test with a PR or issue in your repository"
echo ""
echo "📚 Documentation:"
echo "- GITHUB_APP_STATUS.md - Complete setup guide"
echo "- GITHUB_AGENT_INSTALLATION_PLAN.md - Installation details"
echo "- agents/github-pr-manager/README.md - Agent documentation"
echo ""
echo -e "${GREEN}🎉 GitHub App is ready to use!${NC}"
