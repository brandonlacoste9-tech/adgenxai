#!/usr/bin/env node

/**
 * Test script for Auto-Review Agent
 * 
 * This script tests the auto-review agent logic locally in dry-run mode
 * to ensure it works correctly before deployment.
 * 
 * Usage:
 *   node scripts/test-auto-review.js
 * 
 * Environment variables required:
 *   GITHUB_TOKEN or GITHUB_PAT - GitHub personal access token
 */

import { runAutoReview } from '../agents/github-pr-manager/src/auto-review-agent.js';

async function main() {
  console.log('🧪 Testing Auto-Review Agent');
  console.log('========================================\n');

  // Get GitHub token from environment
  const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  
  if (!githubToken) {
    console.error('❌ Error: GITHUB_TOKEN or GITHUB_PAT environment variable not set');
    console.error('');
    console.error('Please set your GitHub personal access token:');
    console.error('  export GITHUB_TOKEN=your_token_here');
    console.error('');
    process.exit(1);
  }

  console.log('✅ GitHub token found');
  console.log('🧪 Running in DRY RUN mode (no actual changes will be made)');
  console.log('');

  try {
    // Run auto-review in dry-run mode
    const summary = await runAutoReview(
      githubToken,
      ['brandonlacoste9-tech/adgenxai', 'brandonlacoste9-tech/Beehive'],
      {
        dryRun: true,
        enableAIAnalysis: false, // Disable AI for faster testing
        maxPRsPerRepo: 5, // Limit to 5 PRs per repo for testing
        maxIssuesPerRepo: 5 // Limit to 5 issues per repo for testing
      }
    );

    console.log('\n========================================');
    console.log('📊 Test Summary');
    console.log('========================================');
    console.log(`PRs Reviewed: ${summary.totalPRsReviewed}`);
    console.log(`Issues Reviewed: ${summary.totalIssuesReviewed}`);
    console.log(`Actions (would be taken): ${summary.totalActions}`);
    console.log(`Errors: ${summary.errors.length}`);
    console.log(`Duration: ${(summary.durationMs / 1000).toFixed(2)}s`);

    if (summary.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      summary.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    console.log('\n✅ Test completed successfully!');
    console.log('');
    console.log('To run for real (not dry-run), use:');
    console.log('  curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
