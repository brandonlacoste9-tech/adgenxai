#!/bin/bash
set -e

echo "🧠 Setting up AdgenXAI VS Code Workspace..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create .vscode directory
echo "📁 Creating .vscode directory..."
mkdir -p .vscode

# Create mcp.json
echo "🔧 Creating MCP configuration..."
cat > .vscode/mcp.json << 'MCP_JSON'
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "description": "GitHub MCP Server (OAuth-based)",
      "capabilities": {
        "tools": true,
        "resources": true,
        "prompts": true
      }
    }
  }
}
MCP_JSON

# Create tasks.json
echo "⚙️  Creating VS Code tasks..."
cat > .vscode/tasks.json << 'TASKS_JSON'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Deploy to Netlify",
      "type": "shell",
      "command": "npm run deploy",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    },
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true,
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      }
    },
    {
      "label": "Type Check",
      "type": "shell",
      "command": "npm run typecheck",
      "presentation": {
        "reveal": "silent"
      }
    },
    {
      "label": "Build",
      "type": "shell",
      "command": "npm run build",
      "group": "build",
      "presentation": {
        "reveal": "silent"
      }
    }
  ]
}
TASKS_JSON

# Create extensions.json
echo "📦 Configuring recommended extensions..."
cat > .vscode/extensions.json << 'EXTENSIONS_JSON'
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "github.vscode-github-actions",
    "ms-vscode.vscode-typescript-next"
  ]
}
EXTENSIONS_JSON

# Create settings.json
echo "⚙️  Creating workspace settings..."
cat > .vscode/settings.json << 'SETTINGS_JSON'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.autoSave": "onFocusChange",
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.netlify": true
  }
}
SETTINGS_JSON

# Create Copilot instructions
echo "📖 Creating Copilot context..."
cat > .vscode/copilot-instructions.md << 'COPILOT_MD'
# AdgenXAI Sensory Cortex - Copilot Instructions

## Project Context
AI-powered advertising solution with webhook sensory cortex for real-time GitHub event processing.

## Tech Stack
- TypeScript
- Netlify Functions
- GitHub MCP Server
- Zod for validation

## Key Commands
- Deploy: `npm run deploy`
- Dev: `npm run dev`
- Build: `npm run build`
- Type Check: `npm run typecheck`

## Coding Standards
- Use TypeScript strict mode
- Validate all inputs with Zod schemas
- Log all webhook events
- Handle errors gracefully
COPILOT_MD

echo ""
echo -e "${GREEN}✅ VS Code workspace configured!${NC}"
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "  1. Open in VS Code: ${BLUE}code .${NC}"
echo "  2. Install recommended extensions (VS Code will prompt)"
echo "  3. Sign in to GitHub Copilot (status bar)"
echo "  4. Enable Agent Mode in Copilot Chat"
echo "  5. Test: Ask Copilot 'List open pull requests'"
echo ""
