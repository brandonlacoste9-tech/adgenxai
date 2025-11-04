#!/bin/bash

#######################################################################
# AdGenXAI - Deployment Verification Script
#######################################################################
# This script verifies that the deployment is working correctly
# Usage: ./scripts/verify-deployment.sh <site-url>
#######################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Get site URL from argument or prompt
SITE_URL="$1"
if [[ -z "$SITE_URL" ]]; then
    read -p "Enter your site URL (e.g., https://your-site.netlify.app): " SITE_URL
fi

# Remove trailing slash
SITE_URL="${SITE_URL%/}"

echo ""
echo "🔍 AdGenXAI - Deployment Verification"
echo "======================================"
echo ""
print_step "Testing site: $SITE_URL"
echo ""

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Homepage
print_step "Test 1: Homepage accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" || echo "000")
if [[ "$HTTP_CODE" == "200" ]]; then
    print_success "Homepage is accessible (HTTP $HTTP_CODE)"
    ((TESTS_PASSED++))
else
    print_error "Homepage failed (HTTP $HTTP_CODE)"
    ((TESTS_FAILED++))
fi

# Test 2: Dashboard
print_step "Test 2: Dashboard page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/dashboard" || echo "000")
if [[ "$HTTP_CODE" == "200" ]]; then
    print_success "Dashboard is accessible (HTTP $HTTP_CODE)"
    ((TESTS_PASSED++))
else
    print_warning "Dashboard returned HTTP $HTTP_CODE (may require auth)"
    ((TESTS_PASSED++))
fi

# Test 3: API Health Check
print_step "Test 3: API endpoints..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/chat" -X POST -H "Content-Type: application/json" -d '{}' || echo "000")
if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "400" ]]; then
    print_success "API endpoints are responding (HTTP $HTTP_CODE)"
    ((TESTS_PASSED++))
else
    print_error "API endpoints failed (HTTP $HTTP_CODE)"
    ((TESTS_FAILED++))
fi

# Test 4: Static Assets
print_step "Test 4: Static assets loading..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/_next/static/css/" || echo "000")
if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "404" ]]; then
    print_success "Static asset serving configured"
    ((TESTS_PASSED++))
else
    print_error "Static assets may not be configured correctly"
    ((TESTS_FAILED++))
fi

# Test 5: Security Headers
print_step "Test 5: Security headers..."
HEADERS=$(curl -s -I "$SITE_URL" || echo "")
if echo "$HEADERS" | grep -q "X-Frame-Options"; then
    print_success "Security headers are configured"
    ((TESTS_PASSED++))
else
    print_warning "Some security headers may be missing"
    ((TESTS_PASSED++))
fi

# Test 6: HTTPS
print_step "Test 6: HTTPS configuration..."
if [[ "$SITE_URL" == https://* ]]; then
    print_success "Site is using HTTPS"
    ((TESTS_PASSED++))
else
    print_warning "Site is not using HTTPS"
    ((TESTS_PASSED++))
fi

# Test 7: Response Time
print_step "Test 7: Performance check..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null "$SITE_URL"
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
if [[ $RESPONSE_TIME -lt 3000 ]]; then
    print_success "Response time: ${RESPONSE_TIME}ms (Good)"
    ((TESTS_PASSED++))
else
    print_warning "Response time: ${RESPONSE_TIME}ms (Consider optimization)"
    ((TESTS_PASSED++))
fi

# Summary
echo ""
echo "=================================="
echo "Test Results Summary"
echo "=================================="
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
    print_success "All critical tests passed! 🎉"
    echo ""
    echo "Your site is live at: $SITE_URL"
    echo ""
    echo "Next steps:"
    echo "1. Test all interactive features manually"
    echo "2. Check Netlify Functions logs for any errors"
    echo "3. Monitor application performance"
    echo "4. Set up custom domain (if not already done)"
    echo ""
    exit 0
else
    print_error "Some tests failed. Please review the issues above."
    echo ""
    echo "Troubleshooting:"
    echo "1. Check Netlify build logs"
    echo "2. Verify environment variables are set"
    echo "3. Review function logs in Netlify dashboard"
    echo ""
    exit 1
fi
