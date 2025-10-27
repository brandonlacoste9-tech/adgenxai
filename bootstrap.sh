#!/bin/bash
set -e

echo "🚀 Bootstrapping AdgenXAI Sensory Cortex..."
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p scripts
mkdir -p netlify/functions
mkdir -p packages/webhook-gateway/src
mkdir -p .github/workflows
mkdir -p .vscode
mkdir -p .netlify
mkdir -p docs

# Create package.json
echo "📦 Creating package.json..."
cat > package.json << 'PACKAGE_JSON'
{
  "name": "adgenxai",
  "version": "1.0.0",
  "description": "AI-powered advertising solution with webhook sensory cortex",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "dev": "netlify dev",
    "deploy": "netlify deploy --prod"
  },
  "dependencies": {
    "@netlify/functions": "^2.4.0",
    "@netlify/blobs": "^7.0.0",
    "zod": "^3.22.4",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "typescript": "^5.5.0"
  },
  "keywords": ["ai", "advertising", "webhook", "mcp", "sensory-cortex"],
  "author": "brandonlacoste9-tech",
  "license": "MIT"
}
PACKAGE_JSON

# Create tsconfig.json
echo "⚙️  Creating tsconfig.json..."
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": [
    "netlify/functions/**/*",
    "packages/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
TSCONFIG

# Create netlify.toml
echo "🌐 Creating netlify.toml..."
cat > netlify.toml << 'NETLIFY'
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
NETLIFY

# Create .env.example
echo "🔐 Creating .env.example..."
cat > .env.example << 'ENV'
# GitHub Configuration
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_PAT=your_personal_access_token_here

# Netlify Configuration
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_site_id

# Application Configuration
NODE_ENV=production
ENABLE_WEBHOOK_PROCESSING=false
ENV

# Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'GITIGNORE'

# Project specific
.env
.env.local
.netlify/
dist/
node_modules/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
*.log
GITIGNORE

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "📦 Next: Install dependencies"
echo "   npm install"
echo ""
echo "🧠 Then: Run VS Code setup"
echo "   ./scripts/.vscode-setup.sh"
echo ""
EOF

chmod +x bootstrap.sh
./bootstrap.sh
