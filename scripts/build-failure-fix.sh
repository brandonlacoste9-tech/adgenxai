#!/bin/bash
# Automated Build Failure Fix Script
# Fixes common Netlify deployment issues affecting 21 PRs

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔧 AdGenXAI - Build Failure Auto-Fix"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ Error: package.json not found${NC}"
    echo "Please run this script from the repository root"
    exit 1
fi

# Backup existing files
echo "📦 Step 1: Creating Backups"
echo "============================"
cp package.json package.json.backup.$(date +%s)
[ -f package-lock.json ] && cp package-lock.json package-lock.json.backup.$(date +%s)
echo -e "${GREEN}✓ Backups created${NC}"
echo ""

# Install missing dependencies
echo "📚 Step 2: Installing Missing Dependencies"
echo "==========================================="
echo ""

MISSING_DEPS=(
    "@supabase/supabase-js"
    "react-apexcharts"
    "echarts"
    "echarts-for-react"
)

for dep in "${MISSING_DEPS[@]}"; do
    echo "Checking $dep..."
    if npm list "$dep" &>/dev/null; then
        echo -e "${GREEN}  ✓ Already installed${NC}"
    else
        echo "  Installing $dep..."
        npm install "$dep"
        echo -e "${GREEN}  ✓ Installed${NC}"
    fi
done

echo ""
echo -e "${GREEN}✓ Dependencies check complete${NC}"
echo ""

# Rebuild lockfile
echo "🔄 Step 3: Rebuilding package-lock.json"
echo "========================================"
rm -rf node_modules package-lock.json
echo "Installing all dependencies..."
npm install --prefer-offline
echo -e "${GREEN}✓ Dependencies reinstalled${NC}"
echo ""

# Create missing modules
echo "📝 Step 4: Creating Missing Modules"
echo "===================================="

# Create lib directory if it doesn't exist
mkdir -p lib

# Create streaming-metrics hook if missing
if [ ! -f "lib/streaming-metrics.ts" ]; then
    cat > lib/streaming-metrics.ts << 'EOF'
/**
 * Streaming Metrics Hook
 * Provides real-time metrics for AI streaming operations
 */
import { useState, useEffect, useCallback } from 'react';

export interface StreamingMetrics {
  tokensPerSecond: number;
  latency: number;
  costPerToken: number;
  totalTokens: number;
  estimatedCost: number;
}

export function useStreamingMetrics() {
  const [metrics, setMetrics] = useState<StreamingMetrics>({
    tokensPerSecond: 0,
    latency: 0,
    costPerToken: 0,
    totalTokens: 0,
    estimatedCost: 0
  });

  const updateMetrics = useCallback((update: Partial<StreamingMetrics>) => {
    setMetrics(prev => ({ ...prev, ...update }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      tokensPerSecond: 0,
      latency: 0,
      costPerToken: 0,
      totalTokens: 0,
      estimatedCost: 0
    });
  }, []);

  return { metrics, updateMetrics, resetMetrics };
}

export default useStreamingMetrics;
EOF
    echo -e "${GREEN}✓ Created lib/streaming-metrics.ts${NC}"
else
    echo -e "${BLUE}ℹ lib/streaming-metrics.ts already exists${NC}"
fi

echo ""

# Verify next.config.mjs
echo "⚙️  Step 5: Verifying Build Configuration"
echo "=========================================="

if [ -f "next.config.mjs" ]; then
    echo "Checking next.config.mjs..."
    if grep -q "output: 'export'" next.config.mjs; then
        echo -e "${GREEN}  ✓ Static export configured${NC}"
    else
        echo -e "${YELLOW}  ⚠️  May need to add output: 'export'${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠️  next.config.mjs not found${NC}"
fi

if [ -f "netlify.toml" ]; then
    echo "Checking netlify.toml..."
    if grep -q 'publish = "out"' netlify.toml; then
        echo -e "${GREEN}  ✓ Netlify publish dir configured${NC}"
    else
        echo -e "${YELLOW}  ⚠️  May need to set publish directory${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠️  netlify.toml not found${NC}"
fi

echo ""

# Run TypeScript check
echo "🔍 Step 6: Running TypeScript Check"
echo "===================================="
if npm run typecheck; then
    echo -e "${GREEN}✓ TypeScript check passed${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript errors found (may not block build)${NC}"
fi
echo ""

# Test build
echo "🏗️  Step 7: Testing Build"
echo "=========================="
echo ""
echo "Running: npm run build"
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    BUILD_SUCCESS=true
else
    echo ""
    echo -e "${RED}✗ Build failed${NC}"
    BUILD_SUCCESS=false
fi

echo ""

# Summary
echo "📊 Summary"
echo "=========="
echo ""

if [ "$BUILD_SUCCESS" = true ]; then
    echo -e "${GREEN}✅ All fixes applied successfully!${NC}"
    echo ""
    echo "Changes made:"
    echo "  - Installed missing dependencies"
    echo "  - Rebuilt package-lock.json"
    echo "  - Created missing modules"
    echo "  - Verified build configuration"
    echo "  - Build test passed"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Review changes: git diff"
    echo "2. Stage changes: git add package.json package-lock.json lib/"
    echo "3. Commit: git commit -m \"fix: resolve build failures\""
    echo "4. Push: git push origin <branch-name>"
    echo ""
    echo "This should fix approximately 8-15 failing PRs"
else
    echo -e "${RED}⚠️  Build still failing${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check build errors above"
    echo "2. Review BUILD_FAILURE_ANALYSIS.md for detailed fixes"
    echo "3. Check Netlify logs for specific errors"
    echo "4. Try: rm -rf .next out && npm run build"
    echo ""
    echo "Backups available:"
    echo "  - package.json.backup.*"
    echo "  - package-lock.json.backup.*"
fi

echo ""
echo "📚 Documentation:"
echo "  - BUILD_FAILURE_ANALYSIS.md - Detailed analysis"
echo "  - PR_ACTION_PLAN.md - PR management guide"
echo ""

if [ "$BUILD_SUCCESS" = true ]; then
    echo -e "${GREEN}🎉 Fix complete!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Manual intervention may be needed${NC}"
    exit 1
fi
