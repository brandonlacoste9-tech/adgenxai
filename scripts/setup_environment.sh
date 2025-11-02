#!/bin/bash
# AdGenXAI Bootstrap Environment Setup
# This script prepares your development environment for the 16-week build

set -e

echo "🚀 AdGenXAI Bootstrap Environment Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check system requirements
echo -e "\n${BLUE}🔍 Checking System Requirements...${NC}"

# Check disk space (need 2TB for models)
available_space=$(df -h . | awk 'NR==2 {print $4}' | sed 's/[^0-9]*//g')
if [ "$available_space" -lt 2000 ]; then
    print_warning "You have less than 2TB free space. Model downloads may require external storage."
else
    print_status "Sufficient disk space available (>2TB)"
fi

# Check Node.js
if command -v node &> /dev/null; then
    node_version=$(node --version)
    print_status "Node.js found: $node_version"
else
    print_error "Node.js not found. Please install Node.js 18+ and run again."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    print_status "npm found: $npm_version"
else
    print_error "npm not found. Please install npm and run again."
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    print_status "Python found: $python_version"
else
    print_error "Python 3 not found. Please install Python 3.8+ and run again."
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    git_version=$(git --version)
    print_status "Git found: $git_version"
else
    print_error "Git not found. Please install Git and run again."
    exit 1
fi

# Check Docker (optional but recommended)
if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    print_status "Docker found: $docker_version"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not found. Docker is recommended for model containerization."
    DOCKER_AVAILABLE=false
fi

# Create project directories
echo -e "\n${BLUE}📁 Setting up project structure...${NC}"

mkdir -p adgenxai-workspace/{models,datasets,checkpoints,logs,experiments}
mkdir -p adgenxai-workspace/models/{text,image,video,audio,3d}

print_status "Created workspace directories"

# Install current project dependencies
echo -e "\n${BLUE}📦 Installing AdGenXAI dependencies...${NC}"

if [ -f "package.json" ]; then
    npm install
    print_status "Installed Node.js dependencies"
else
    print_warning "No package.json found in current directory"
fi

# Create Python virtual environment
echo -e "\n${BLUE}🐍 Setting up Python environment...${NC}"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    print_status "Created Python virtual environment"
fi

source .venv/bin/activate
pip install --upgrade pip

# Install basic Python dependencies
pip install torch torchvision torchaudio transformers diffusers accelerate xformers
print_status "Installed basic AI/ML Python packages"

# Create environment configuration
echo -e "\n${BLUE}⚙️  Creating environment configuration...${NC}"

cat > .env.example << 'EOF'
# AdGenXAI Environment Configuration
# Copy this to .env and fill in your values

# API Configuration
BEE_API_URL=https://www.adgenxai.pro/api
BEE_API_KEY=your_bee_agent_api_key

# Database (if using external)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# Social Platform APIs (optional)
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id
FB_ACCESS_TOKEN=your_facebook_access_token

# Model Configuration
MODELS_PATH=./adgenxai-workspace/models
HUGGINGFACE_TOKEN=your_hf_token_for_gated_models

# Local Development
NODE_ENV=development
PORT=3000
EOF

print_status "Created .env.example configuration template"

# Create basic run scripts
echo -e "\n${BLUE}📝 Creating run scripts...${NC}"

# Development start script
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
# Start development environment

echo "🚀 Starting AdGenXAI development environment..."

# Activate Python environment
source .venv/bin/activate

# Start Next.js development server
npm run dev &

echo "✅ Development server started at http://localhost:3000"
echo "✅ Press Ctrl+C to stop"

wait
EOF

chmod +x scripts/dev.sh

# Test script
cat > scripts/test.sh << 'EOF'
#!/bin/bash
# Run all tests

echo "🧪 Running AdGenXAI test suite..."

# Run frontend tests
npm run test

# Run Python tests (if any)
if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ]; then
    source .venv/bin/activate
    python -m pytest
fi

echo "✅ All tests completed"
EOF

chmod +x scripts/test.sh

print_status "Created development and test scripts"

# Create model download preparation
cat > scripts/prepare_models.sh << 'EOF'
#!/bin/bash
# Prepare for model downloads

echo "📥 Preparing model download environment..."

# Create model-specific directories
mkdir -p adgenxai-workspace/models/{text/{llama,qwen,mistral},image/{flux,sd,dalle},video/{svd,cogvideo,luma},audio/{whisper,musicgen},3d/{point-e,shap-e}}

# Install model download tools
source .venv/bin/activate
pip install huggingface_hub gdown

echo "✅ Model download environment ready"
echo "📋 Next step: Run download_model_weights.sh to begin downloads"
EOF

chmod +x scripts/prepare_models.sh

print_status "Created model preparation script"

# Summary
echo -e "\n${GREEN}🎉 Bootstrap Environment Setup Complete!${NC}"
echo "======================================"
echo ""
echo "✅ System requirements verified"
echo "✅ Project structure created"  
echo "✅ Dependencies installed"
echo "✅ Environment configured"
echo "✅ Scripts created"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Copy .env.example to .env and configure your values"
echo "2. Run 'scripts/prepare_models.sh' to prepare model downloads"
echo "3. Import your 4 remaining documents into docs/ directory"
echo "4. Run 'scripts/dev.sh' to start development"
echo ""
echo -e "${YELLOW}💡 Tip: Run 'scripts/test.sh' anytime to validate your setup${NC}"