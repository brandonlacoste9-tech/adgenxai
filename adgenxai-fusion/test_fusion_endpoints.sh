#!/bin/bash
# AdgenxAI Fusion v2 - Endpoint Testing Script
# Tests all Fusion API endpoints

# Configuration
BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"
TIMEOUT=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test functions
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}
    
    echo -n "Testing $method $endpoint... "
    
    if [ "$method" = "POST" ] && [ ! -z "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time $TIMEOUT \
            "$BASE_URL$endpoint" 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" \
            --max-time $TIMEOUT \
            "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $status_code${NC}"
        return 0
    else
        echo -e "${RED}❌ $status_code (expected $expected_status)${NC}"
        return 1
    fi
}

echo "
🔧 AdgenxAI Fusion v2 - Endpoint Testing Suite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Testing against: $BASE_URL
Timeout: ${TIMEOUT}s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

# Test counter
total_tests=0
passed_tests=0

# Test 1: Health Check
echo "📊 Health & Status Endpoints"
((total_tests++))
if test_endpoint "GET" "/health"; then
    ((passed_tests++))
fi

# Test 2: Main Dashboard
((total_tests++))
if test_endpoint "GET" "/"; then
    ((passed_tests++))
fi

echo ""
echo "💬 Chat & AI Endpoints"

# Test 3: Chat Endpoint
((total_tests++))
chat_data='{"prompt": "Hello Fusion v2", "session_id": "test_session"}'
if test_endpoint "POST" "/chat" "$chat_data"; then
    ((passed_tests++))
fi

# Test 4: Streaming Endpoint
((total_tests++))
stream_data='{"prompt": "Stream test"}'
if test_endpoint "POST" "/stream" "$stream_data"; then
    ((passed_tests++))
fi

echo ""
echo "🎭 Orchestration Endpoints"

# Test 5: Rehearsal Endpoint
((total_tests++))
if test_endpoint "GET" "/rehearsal"; then
    ((passed_tests++))
fi

# Test 6: Log Export
((total_tests++))
if test_endpoint "GET" "/logs/export"; then
    ((passed_tests++))
fi

echo ""
echo "🔍 Additional Tests"

# Test 7: Invalid Endpoint (should return 404)
((total_tests++))
if test_endpoint "GET" "/nonexistent" "" 404; then
    ((passed_tests++))
fi

# Test 8: Invalid Chat Data (should handle gracefully)
((total_tests++))
invalid_data='{"invalid": "data"}'
if test_endpoint "POST" "/chat" "$invalid_data" 200; then
    ((passed_tests++))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}✅ All tests passed! ($passed_tests/$total_tests)${NC}"
    echo "🚀 Fusion v2 endpoints are working correctly"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed ($passed_tests/$total_tests passed)${NC}"
    echo "🔧 Check the failing endpoints and try again"
    exit 1
fi