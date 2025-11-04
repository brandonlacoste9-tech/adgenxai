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

// Since we're importing TypeScript, we need to use dynamic import
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
    // Dynamically import the compiled auto-review agent
    // Note: This assumes the TypeScript has been compiled to JavaScript
    const autoReviewModule = await import('../agents/github-pr-manager/src/auto-review-agent.js').catch(async () => {
      // If .js doesn't exist, try importing the .ts file (requires tsx or ts-node)
      console.log('⚠️  Compiled .js not found, attempting to load .ts file...');
      console.log('📦 Installing tsx for TypeScript execution...\n');
      
      // Try to use tsx if available
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      try {
        // Check if tsx is available
        await execAsync('npx -y tsx --version');
        console.log('✅ tsx available, using it to run TypeScript\n');
        
        // Run the test with tsx
        const { stdout, stderr } = await execAsync(
          `npx tsx -e "
            import { runAutoReview } from '../agents/github-pr-manager/src/auto-review-agent.ts';
            const summary = await runAutoReview(
              '${githubToken}',
              ['brandonlacoste9-tech/adgenxai', 'brandonlacoste9-tech/Beehive'],
              { dryRun: true, enableAIAnalysis: false, maxPRsPerRepo: 5, maxIssuesPerRepo: 5 }
            );
            console.log(JSON.stringify(summary));
          "`
        );
        
        const summary = JSON.parse(stdout);
        displaySummary(summary);
        process.exit(0);
      } catch (tsxError) {
        console.error('❌ Error: Could not execute TypeScript');
        console.error('');
        console.error('Please compile the TypeScript first:');
        console.error('  cd agents/github-pr-manager && npm run build');
        console.error('');
        console.error('Or install tsx:');
        console.error('  npm install -g tsx');
        console.error('');
        process.exit(1);
      }
    });

    // If we successfully imported the module, run it
    if (autoReviewModule && autoReviewModule.runAutoReview) {
      const summary = await autoReviewModule.runAutoReview(
        githubToken,
        ['brandonlacoste9-tech/adgenxai', 'brandonlacoste9-tech/Beehive'],
        {
          dryRun: true,
          enableAIAnalysis: false, // Disable AI for faster testing
          maxPRsPerRepo: 5, // Limit to 5 PRs per repo for testing
          maxIssuesPerRepo: 5 // Limit to 5 issues per repo for testing
        }
      );

      displaySummary(summary);
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function displaySummary(summary) {
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
}

main();
