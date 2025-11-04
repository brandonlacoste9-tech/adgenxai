#!/bin/bash
# Merge Ready PRs Automation Script
# Merges PRs #36, #38, #39, #92 that are approved and have passing CI

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🚀 AdGenXAI - Merge Ready PRs"
echo "=============================="
echo ""

# Ready PRs from triage analysis
READY_PRS=(36 38 39 92)
PR_DETAILS=(
    "36:Add /status page for Sensory Cortex telemetry monitoring"
    "38:Add GitHub Copilot instructions per best practices"
    "39:Add PR consolidation execution plan and documentation"
    "92:Fix missing dependencies and modules breaking build/tests"
)

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ Error: GitHub CLI (gh) is not installed${NC}"
    echo ""
    echo "Install it from: https://cli.github.com/"
    echo "Or on macOS: brew install gh"
    echo "Or on Ubuntu: sudo apt install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with GitHub CLI${NC}"
    echo "Authenticating now..."
    gh auth login
fi

echo -e "${BLUE}Repository: brandonlacoste9-tech/adgenxai${NC}"
echo ""

# Function to check PR status
check_pr_status() {
    local pr_number=$1
    local pr_title=$2

    echo -e "${BLUE}Checking PR #$pr_number${NC}"

    # Get PR details
    local pr_state=$(gh pr view $pr_number --json state --jq '.state')
    local pr_mergeable=$(gh pr view $pr_number --json mergeable --jq '.mergeable')
    local pr_checks=$(gh pr view $pr_number --json statusCheckRollup --jq '.statusCheckRollup[-1].conclusion')

    echo "  Title: $pr_title"
    echo "  State: $pr_state"
    echo "  Mergeable: $pr_mergeable"
    echo "  Checks: $pr_checks"

    if [ "$pr_state" != "OPEN" ]; then
        echo -e "  ${YELLOW}⚠️  PR is not open (skipping)${NC}"
        return 1
    fi

    if [ "$pr_mergeable" != "MERGEABLE" ]; then
        echo -e "  ${YELLOW}⚠️  PR is not mergeable (conflicts?)${NC}"
        return 1
    fi

    if [ "$pr_checks" != "SUCCESS" ] && [ "$pr_checks" != "null" ]; then
        echo -e "  ${YELLOW}⚠️  CI checks not passing${NC}"
        return 1
    fi

    echo -e "  ${GREEN}✓ Ready to merge${NC}"
    return 0
}

# Function to merge PR
merge_pr() {
    local pr_number=$1
    local pr_title=$2

    echo ""
    echo -e "${GREEN}Merging PR #$pr_number${NC}"
    echo "  $pr_title"

    # Perform the merge with squash
    if gh pr merge $pr_number --squash --auto; then
        echo -e "${GREEN}  ✓ Successfully merged PR #$pr_number${NC}"
        return 0
    else
        echo -e "${RED}  ✗ Failed to merge PR #$pr_number${NC}"
        return 1
    fi
}

# Main execution
echo "📋 Step 1: Checking PR Status"
echo "=============================="
echo ""

# Arrays to track results
declare -a mergeable_prs
declare -a skipped_prs
declare -a failed_prs

# Check all PRs
for pr_detail in "${PR_DETAILS[@]}"; do
    IFS=':' read -r pr_number pr_title <<< "$pr_detail"

    if check_pr_status "$pr_number" "$pr_title"; then
        mergeable_prs+=("$pr_number:$pr_title")
    else
        skipped_prs+=("$pr_number:$pr_title")
    fi
    echo ""
done

echo ""
echo "📊 Summary"
echo "=========="
echo "Mergeable: ${#mergeable_prs[@]}"
echo "Skipped: ${#skipped_prs[@]}"
echo ""

if [ ${#mergeable_prs[@]} -eq 0 ]; then
    echo -e "${YELLOW}No PRs ready to merge${NC}"
    exit 0
fi

# Ask for confirmation
echo "The following PRs will be merged:"
for pr_detail in "${mergeable_prs[@]}"; do
    IFS=':' read -r pr_number pr_title <<< "$pr_detail"
    echo "  - PR #$pr_number: $pr_title"
done
echo ""

read -p "Continue with merge? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Merge cancelled"
    exit 0
fi

echo ""
echo "🚀 Step 2: Merging PRs"
echo "======================"
echo ""

# Merge all ready PRs
for pr_detail in "${mergeable_prs[@]}"; do
    IFS=':' read -r pr_number pr_title <<< "$pr_detail"

    if merge_pr "$pr_number" "$pr_title"; then
        # Wait a bit between merges
        sleep 2
    else
        failed_prs+=("$pr_number:$pr_title")
    fi
done

# Final summary
echo ""
echo "✅ Merge Complete!"
echo "==================="
echo ""

successful_count=$((${#mergeable_prs[@]} - ${#failed_prs[@]}))
echo "Successfully merged: $successful_count PR(s)"
echo "Failed: ${#failed_prs[@]} PR(s)"
echo "Skipped: ${#skipped_prs[@]} PR(s)"
echo ""

if [ ${#failed_prs[@]} -gt 0 ]; then
    echo -e "${YELLOW}Failed PRs:${NC}"
    for pr_detail in "${failed_prs[@]}"; do
        IFS=':' read -r pr_number pr_title <<< "$pr_detail"
        echo "  - PR #$pr_number: $pr_title"
    done
    echo ""
fi

if [ ${#skipped_prs[@]} -gt 0 ]; then
    echo "Skipped PRs (review manually):"
    for pr_detail in "${skipped_prs[@]}"; do
        IFS=':' read -r pr_number pr_title <<< "$pr_detail"
        echo "  - PR #$pr_number: $pr_title"
    done
    echo ""
fi

echo "📊 Next Steps:"
echo "1. Check GitHub Actions for main branch build"
echo "2. Verify deployment to production"
echo "3. Run smoke tests"
echo "4. Review remaining PRs in PR_ACTION_PLAN.md"
echo ""

if [ $successful_count -gt 0 ]; then
    echo -e "${GREEN}🎉 PR merge automation complete!${NC}"
else
    echo -e "${YELLOW}⚠️  No PRs were merged${NC}"
fi
