/**
 * Netlify Function: Auto-Review Agent
 * 
 * Triggers bulk auto-review on ALL open PRs and issues in both repositories:
 * - brandonlacoste9-tech/adgenxai
 * - brandonlacoste9-tech/Beehive
 * 
 * Usage:
 *   Browser: https://www.adgenxai.pro/.netlify/functions/auto-review-agent
 *   CLI: curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Import the auto-review agent
// Note: We'll use dynamic import to handle the TypeScript compilation
async function loadAutoReviewAgent() {
  const module = await import('../../agents/github-pr-manager/src/auto-review-agent');
  return module.AutoReviewAgent;
}

/**
 * Netlify Function Handler
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log('🤖 Auto-Review Agent triggered');
  console.log(`📅 Time: ${new Date().toISOString()}`);
  console.log(`🌐 Method: ${event.httpMethod}`);
  
  // Get GitHub token from environment
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  
  if (!githubToken) {
    console.error('❌ GitHub token not found in environment variables');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Configuration error',
        message: 'GitHub token not configured. Please set GITHUB_TOKEN or GH_TOKEN in Netlify environment variables.',
        timestamp: new Date().toISOString()
      })
    };
  }

  try {
    // Load and instantiate the auto-review agent
    console.log('📦 Loading Auto-Review Agent...');
    const AutoReviewAgent = await loadAutoReviewAgent();
    const agent = new AutoReviewAgent(githubToken);
    
    // Run bulk review
    console.log('🚀 Starting bulk review process...');
    const results = await agent.runBulkReview();
    
    console.log('✅ Bulk review completed successfully');
    console.log(`📊 Processed: ${results.totalProcessed} items`);
    console.log(`✅ Successful: ${results.successful}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: true,
        message: 'Bulk auto-review completed',
        summary: {
          timestamp: results.timestamp,
          totalProcessed: results.totalProcessed,
          successful: results.successful,
          failed: results.failed,
          repositories: results.repositories
        },
        results: results.results,
        nextSteps: [
          'Check PR comments for automated reviews',
          'Check issue threads for automated responses',
          'Re-run as needed for continuous review cycles'
        ],
        links: {
          adgenxai_prs: 'https://github.com/brandonlacoste9-tech/adgenxai/pulls?state=open',
          adgenxai_issues: 'https://github.com/brandonlacoste9-tech/adgenxai/issues?state=open',
          beehive_prs: 'https://github.com/brandonlacoste9-tech/Beehive/pulls?state=open',
          beehive_issues: 'https://github.com/brandonlacoste9-tech/Beehive/issues?state=open'
        }
      }, null, 2)
    };
    
  } catch (error) {
    console.error('❌ Auto-review agent failed:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Auto-review failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        troubleshooting: [
          'Check GitHub token permissions',
          'Verify repository access',
          'Check Netlify function logs',
          'Ensure rate limits are not exceeded'
        ]
      }, null, 2)
    };
  }
};
