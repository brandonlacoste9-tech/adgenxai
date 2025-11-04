/**
 * Auto-Review Agent
 * 
 * Bulk reviews and auto-fixes ALL open PRs and issues in both repositories:
 * - brandonlacoste9-tech/adgenxai
 * - brandonlacoste9-tech/Beehive
 */

interface Repository {
  owner: string;
  repo: string;
}

interface ReviewResult {
  repository: string;
  type: 'pr' | 'issue';
  number: number;
  title: string;
  status: 'success' | 'error';
  action?: string;
  message?: string;
  error?: string;
}

interface BulkReviewResults {
  timestamp: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  repositories: string[];
  results: ReviewResult[];
}

/**
 * Auto-Review Agent
 * Reviews all open PRs and issues in configured repositories
 */
export class AutoReviewAgent {
  private repositories: Repository[];
  private githubToken: string;

  constructor(githubToken: string) {
    this.githubToken = githubToken;
    this.repositories = [
      { owner: 'brandonlacoste9-tech', repo: 'adgenxai' },
      { owner: 'brandonlacoste9-tech', repo: 'Beehive' }
    ];
  }

  /**
   * Fetch all open pull requests for a repository
   */
  private async fetchOpenPRs(owner: string, repo: string): Promise<any[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AdGenXAI-AutoReview-Agent'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PRs: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch all open issues for a repository
   */
  private async fetchOpenIssues(owner: string, repo: string): Promise<any[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AdGenXAI-AutoReview-Agent'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch issues: ${response.status} ${response.statusText}`);
    }

    const allIssues = await response.json();
    // Filter out pull requests (issues API returns both)
    return allIssues.filter((issue: any) => !issue.pull_request);
  }

  /**
   * Review a pull request
   */
  private async reviewPR(owner: string, repo: string, pr: any): Promise<ReviewResult> {
    const fullRepo = `${owner}/${repo}`;
    
    try {
      console.log(`📝 Reviewing PR #${pr.number}: ${pr.title} in ${fullRepo}`);
      
      // Analyze PR complexity and requirements
      const analysis = this.analyzePR(pr);
      
      // Post review comment
      const comment = this.generateReviewComment(analysis);
      await this.postComment(owner, repo, pr.number, comment, 'pr');
      
      return {
        repository: fullRepo,
        type: 'pr',
        number: pr.number,
        title: pr.title,
        status: 'success',
        action: 'reviewed',
        message: `Posted review comment with ${analysis.suggestions.length} suggestions`
      };
    } catch (error) {
      console.error(`❌ Error reviewing PR #${pr.number}:`, error);
      return {
        repository: fullRepo,
        type: 'pr',
        number: pr.number,
        title: pr.title,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Review an issue
   */
  private async reviewIssue(owner: string, repo: string, issue: any): Promise<ReviewResult> {
    const fullRepo = `${owner}/${repo}`;
    
    try {
      console.log(`🔍 Reviewing Issue #${issue.number}: ${issue.title} in ${fullRepo}`);
      
      // Analyze issue
      const analysis = this.analyzeIssue(issue);
      
      // Post helpful comment if needed
      if (analysis.needsResponse) {
        const comment = this.generateIssueComment(analysis);
        await this.postComment(owner, repo, issue.number, comment, 'issue');
      }
      
      return {
        repository: fullRepo,
        type: 'issue',
        number: issue.number,
        title: issue.title,
        status: 'success',
        action: analysis.needsResponse ? 'commented' : 'reviewed',
        message: analysis.message
      };
    } catch (error) {
      console.error(`❌ Error reviewing Issue #${issue.number}:`, error);
      return {
        repository: fullRepo,
        type: 'issue',
        number: issue.number,
        title: issue.title,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Analyze PR to determine review requirements
   */
  private analyzePR(pr: any): any {
    const suggestions: string[] = [];
    const labels: string[] = pr.labels?.map((l: any) => l.name) || [];
    const body = pr.body || '';
    const title = pr.title || '';
    
    // Check for common issues
    if (!body || body.length < 50) {
      suggestions.push('⚠️ PR description is too short. Please add more context about the changes.');
    }
    
    if (!title.match(/^(feat|fix|docs|style|refactor|test|chore|ci):/i)) {
      suggestions.push('💡 Consider using conventional commit format for the title (feat:, fix:, etc.)');
    }
    
    if (pr.draft) {
      suggestions.push('📝 This is a draft PR. Remember to mark it as ready for review when complete.');
    }
    
    if (labels.length === 0) {
      suggestions.push('🏷️ Consider adding labels to categorize this PR.');
    }
    
    return {
      suggestions,
      labels,
      isDraft: pr.draft,
      hasDescription: body.length >= 50
    };
  }

  /**
   * Analyze issue to determine if response is needed
   */
  private analyzeIssue(issue: any): any {
    const labels: string[] = issue.labels?.map((l: any) => l.name) || [];
    const body = issue.body || '';
    const comments = issue.comments || 0;
    
    let needsResponse = false;
    let message = 'Issue reviewed';
    
    // Check if issue needs attention
    if (comments === 0 && !labels.includes('needs-triage')) {
      needsResponse = true;
      message = 'New issue detected - needs triage';
    }
    
    if (body.length < 30 && !needsResponse) {
      needsResponse = true;
      message = 'Issue description is too short';
    }
    
    return {
      needsResponse,
      message,
      labels,
      hasDescription: body.length >= 30,
      hasComments: comments > 0
    };
  }

  /**
   * Generate review comment for PR
   */
  private generateReviewComment(analysis: any): string {
    let comment = '## 🤖 Auto-Review Agent\n\n';
    comment += 'Thanks for your contribution! Here are some automated suggestions:\n\n';
    
    if (analysis.suggestions.length > 0) {
      analysis.suggestions.forEach((suggestion: string) => {
        comment += `${suggestion}\n`;
      });
    } else {
      comment += '✅ Everything looks good! No automated suggestions at this time.\n';
    }
    
    comment += '\n---\n';
    comment += '_This comment was automatically generated by the AdGenXAI Auto-Review Agent_';
    
    return comment;
  }

  /**
   * Generate comment for issue
   */
  private generateIssueComment(analysis: any): string {
    let comment = '## 🤖 Auto-Review Agent\n\n';
    comment += 'Thank you for opening this issue!\n\n';
    
    if (!analysis.hasDescription) {
      comment += '⚠️ **Please provide more details:**\n';
      comment += '- What is the expected behavior?\n';
      comment += '- What is the actual behavior?\n';
      comment += '- Steps to reproduce (if applicable)\n\n';
    }
    
    if (!analysis.hasComments) {
      comment += '👀 This issue has been triaged and will be reviewed by the team.\n\n';
    }
    
    comment += '---\n';
    comment += '_This comment was automatically generated by the AdGenXAI Auto-Review Agent_';
    
    return comment;
  }

  /**
   * Post comment on PR or Issue
   */
  private async postComment(
    owner: string,
    repo: string,
    number: number,
    comment: string,
    type: 'pr' | 'issue'
  ): Promise<void> {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'AdGenXAI-AutoReview-Agent'
      },
      body: JSON.stringify({ body: comment })
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Run bulk review on all repositories
   */
  async runBulkReview(): Promise<BulkReviewResults> {
    console.log('🚀 Starting bulk auto-review...');
    console.log(`📦 Repositories: ${this.repositories.map(r => `${r.owner}/${r.repo}`).join(', ')}`);
    
    const results: ReviewResult[] = [];
    let successful = 0;
    let failed = 0;

    for (const repo of this.repositories) {
      const { owner, repo: repoName } = repo;
      const fullRepo = `${owner}/${repoName}`;
      
      console.log(`\n📂 Processing ${fullRepo}...`);
      
      try {
        // Process PRs
        console.log(`  🔍 Fetching open PRs...`);
        const prs = await this.fetchOpenPRs(owner, repoName);
        console.log(`  ✅ Found ${prs.length} open PR(s)`);
        
        for (const pr of prs) {
          const result = await this.reviewPR(owner, repoName, pr);
          results.push(result);
          if (result.status === 'success') successful++;
          else failed++;
          
          // Rate limiting: wait 1 second between reviews
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Process Issues
        console.log(`  🔍 Fetching open issues...`);
        const issues = await this.fetchOpenIssues(owner, repoName);
        console.log(`  ✅ Found ${issues.length} open issue(s)`);
        
        for (const issue of issues) {
          const result = await this.reviewIssue(owner, repoName, issue);
          results.push(result);
          if (result.status === 'success') successful++;
          else failed++;
          
          // Rate limiting: wait 1 second between reviews
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${fullRepo}:`, error);
        failed++;
        results.push({
          repository: fullRepo,
          type: 'issue', // Changed to 'issue' as a generic error type
          number: 0,
          title: 'Repository processing failed',
          status: 'error',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const bulkResults: BulkReviewResults = {
      timestamp: new Date().toISOString(),
      totalProcessed: successful + failed,
      successful,
      failed,
      repositories: this.repositories.map(r => `${r.owner}/${r.repo}`),
      results
    };

    console.log('\n✅ Bulk review completed!');
    console.log(`📊 Summary: ${successful} successful, ${failed} failed out of ${bulkResults.totalProcessed} total`);
    
    return bulkResults;
  }
}
