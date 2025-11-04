/**
 * Netlify Function: Auto-Review Agent
 * 
 * Endpoint: /.netlify/functions/auto-review-agent
 * 
 * This function triggers a bulk review of all open PRs and issues across
 * the adgenxai and Beehive repositories. It can be called via GET or POST.
 * 
 * Usage:
 *   curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
 * 
 * Query Parameters:
 *   - dryRun: If 'true', only logs what would be done without making changes
 *   - repos: Comma-separated list of repositories (default: adgenxai,Beehive)
 */

import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import { runAutoReview } from '../../agents/github-pr-manager/src/auto-review-agent';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  const startTime = Date.now();
  
  // Log request
  console.log('🤖 Auto-Review Agent triggered', {
    method: event.httpMethod,
    timestamp: new Date().toISOString(),
    headers: event.headers
  });

  // Get GitHub token from environment
  const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  
  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN not configured');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Configuration error',
        message: 'GITHUB_TOKEN environment variable not set',
        timestamp: new Date().toISOString()
      })
    };
  }

  // Parse query parameters
  const queryParams = event.queryStringParameters || {};
  const dryRun = queryParams.dryRun === 'true' || queryParams.dry_run === 'true';
  
  // Get repositories from query param or use defaults
  let repositories = ['brandonlacoste9-tech/adgenxai', 'brandonlacoste9-tech/Beehive'];
  if (queryParams.repos) {
    const owner = 'brandonlacoste9-tech';
    repositories = queryParams.repos
      .split(',')
      .map(r => r.trim())
      .map(r => r.includes('/') ? r : `${owner}/${r}`);
  }

  try {
    // Run the auto-review agent
    console.log('🚀 Starting auto-review process', {
      dryRun,
      repositories,
      enableAI: true
    });

    const summary = await runAutoReview(githubToken, repositories, {
      dryRun,
      enableAIAnalysis: true,
      maxPRsPerRepo: 50,
      maxIssuesPerRepo: 50
    });

    const duration = Date.now() - startTime;
    
    console.log('✅ Auto-review completed', {
      prsReviewed: summary.totalPRsReviewed,
      issuesReviewed: summary.totalIssuesReviewed,
      actions: summary.totalActions,
      errors: summary.errors.length,
      durationMs: duration
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        success: true,
        message: '🤖 Auto-Review Agent completed successfully',
        summary: {
          prsReviewed: summary.totalPRsReviewed,
          issuesReviewed: summary.totalIssuesReviewed,
          actionsTaken: summary.totalActions,
          errorCount: summary.errors.length,
          durationSeconds: (summary.durationMs / 1000).toFixed(2),
          repositories
        },
        details: {
          results: summary.results,
          errors: summary.errors
        },
        dryRun,
        timestamp: new Date().toISOString()
      }, null, 2)
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Auto-review failed', {
      error: errorMessage,
      stack: errorStack,
      durationMs: duration
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Auto-review failed',
        message: errorMessage,
        durationSeconds: (duration / 1000).toFixed(2),
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};
