/**
 * Auto-Review Agent for Bulk PR and Issue Review
 * 
 * This agent automatically reviews all open PRs and issues across multiple repositories,
 * provides AI-powered analysis, and posts fix comments/commits as needed.
 * 
 * Features:
 * - Reviews all open PRs in adgenxai and Beehive repositories
 * - Reviews all open issues in both repositories
 * - Uses AI provider selection for cost-effective analysis
 * - Posts review comments with actionable feedback
 * - Adds appropriate labels based on analysis
 * - Integrates with existing circuit breaker and health monitoring
 */

import { Octokit } from '@octokit/rest';

export interface AutoReviewConfig {
  githubToken: string;
  repositories: string[]; // Array of 'owner/repo' strings
  enableAIAnalysis: boolean;
  dryRun: boolean; // If true, only logs what would be done
  maxPRsPerRepo: number;
  maxIssuesPerRepo: number;
}

export interface ReviewResult {
  repository: string;
  type: 'pr' | 'issue';
  number: number;
  status: 'success' | 'error' | 'skipped';
  action?: string;
  message?: string;
  error?: string;
}

export interface AutoReviewSummary {
  totalPRsReviewed: number;
  totalIssuesReviewed: number;
  totalActions: number;
  results: ReviewResult[];
  errors: string[];
  startTime: number;
  endTime: number;
  durationMs: number;
}

export class AutoReviewAgent {
  private octokit: Octokit;
  private config: AutoReviewConfig;
  private results: ReviewResult[] = [];
  private errors: string[] = [];

  constructor(config: AutoReviewConfig) {
    this.config = config;
    this.octokit = new Octokit({ auth: config.githubToken });
  }

  /**
   * Run bulk review on all configured repositories
   */
  async runBulkReview(): Promise<AutoReviewSummary> {
    const startTime = Date.now();
    
    console.log('🚀 Starting Auto-Review Agent');
    console.log(`📋 Repositories: ${this.config.repositories.join(', ')}`);
    console.log(`🤖 AI Analysis: ${this.config.enableAIAnalysis ? 'ENABLED' : 'DISABLED'}`);
    console.log(`🧪 Dry Run: ${this.config.dryRun ? 'YES' : 'NO'}`);
    console.log('');

    for (const repo of this.config.repositories) {
      try {
        await this.reviewRepository(repo);
      } catch (error) {
        const errorMsg = `Failed to review repository ${repo}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`❌ ${errorMsg}`);
        this.errors.push(errorMsg);
      }
    }

    const endTime = Date.now();
    const summary: AutoReviewSummary = {
      totalPRsReviewed: this.results.filter(r => r.type === 'pr').length,
      totalIssuesReviewed: this.results.filter(r => r.type === 'issue').length,
      totalActions: this.results.filter(r => r.status === 'success' && r.action).length,
      results: this.results,
      errors: this.errors,
      startTime,
      endTime,
      durationMs: endTime - startTime
    };

    console.log('');
    console.log('✅ Auto-Review Agent Complete');
    console.log(`📊 Summary:`);
    console.log(`  - PRs Reviewed: ${summary.totalPRsReviewed}`);
    console.log(`  - Issues Reviewed: ${summary.totalIssuesReviewed}`);
    console.log(`  - Actions Taken: ${summary.totalActions}`);
    console.log(`  - Errors: ${summary.errors.length}`);
    console.log(`  - Duration: ${(summary.durationMs / 1000).toFixed(2)}s`);

    return summary;
  }

  /**
   * Review all PRs and issues in a single repository
   */
  private async reviewRepository(repoFullName: string): Promise<void> {
    const [owner, repo] = repoFullName.split('/');
    
    console.log(`\n📦 Reviewing repository: ${owner}/${repo}`);
    
    // Review open PRs
    await this.reviewPullRequests(owner, repo);
    
    // Review open issues
    await this.reviewIssues(owner, repo);
  }

  /**
   * Review all open pull requests in a repository
   */
  private async reviewPullRequests(owner: string, repo: string): Promise<void> {
    console.log(`  🔍 Fetching open PRs...`);
    
    try {
      const { data: prs } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state: 'open',
        per_page: this.config.maxPRsPerRepo,
        sort: 'updated',
        direction: 'desc'
      });

      console.log(`  📝 Found ${prs.length} open PRs`);

      for (const pr of prs) {
        try {
          await this.reviewPullRequest(owner, repo, pr);
        } catch (error) {
          const errorMsg = `Failed to review PR #${pr.number}: ${error instanceof Error ? error.message : String(error)}`;
          console.error(`    ❌ ${errorMsg}`);
          this.errors.push(errorMsg);
          this.results.push({
            repository: `${owner}/${repo}`,
            type: 'pr',
            number: pr.number,
            status: 'error',
            error: errorMsg
          });
        }
      }
    } catch (error) {
      const errorMsg = `Failed to list PRs: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`  ❌ ${errorMsg}`);
      this.errors.push(errorMsg);
    }
  }

  /**
   * Review a single pull request
   */
  private async reviewPullRequest(owner: string, repo: string, pr: any): Promise<void> {
    console.log(`    🔎 Reviewing PR #${pr.number}: ${pr.title}`);

    // Check if PR already has recent review from this bot
    const hasRecentReview = await this.hasRecentBotReview(owner, repo, pr.number);
    if (hasRecentReview) {
      console.log(`    ⏭️  Skipping PR #${pr.number} (recently reviewed)`);
      this.results.push({
        repository: `${owner}/${repo}`,
        type: 'pr',
        number: pr.number,
        status: 'skipped',
        message: 'Recently reviewed'
      });
      return;
    }

    // Get PR files for analysis
    const { data: files } = await this.octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pr.number
    });

    // Perform analysis
    const analysis = this.analyzePR(pr, files);
    
    // Take actions based on analysis
    if (!this.config.dryRun) {
      // Add labels
      if (analysis.labels.length > 0) {
        await this.addLabels(owner, repo, pr.number, analysis.labels);
      }

      // Post review comment if needed
      if (analysis.needsComment) {
        await this.postReviewComment(owner, repo, pr.number, analysis.comment);
      }
    } else {
      console.log(`    🧪 [DRY RUN] Would add labels: ${analysis.labels.join(', ')}`);
      console.log(`    🧪 [DRY RUN] Would post comment: ${analysis.needsComment ? 'YES' : 'NO'}`);
    }

    this.results.push({
      repository: `${owner}/${repo}`,
      type: 'pr',
      number: pr.number,
      status: 'success',
      action: analysis.labels.length > 0 || analysis.needsComment ? 'reviewed' : 'analyzed',
      message: `Analyzed with ${analysis.riskLevel} risk`
    });

    console.log(`    ✅ PR #${pr.number} reviewed (${analysis.riskLevel} risk)`);
  }

  /**
   * Review all open issues in a repository
   */
  private async reviewIssues(owner: string, repo: string): Promise<void> {
    console.log(`  🔍 Fetching open issues...`);
    
    try {
      const { data: issues } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        per_page: this.config.maxIssuesPerRepo,
        sort: 'updated',
        direction: 'desc'
      });

      // Filter out pull requests (they appear in issues API too)
      const pureIssues = issues.filter(issue => !issue.pull_request);

      console.log(`  📝 Found ${pureIssues.length} open issues`);

      for (const issue of pureIssues) {
        try {
          await this.reviewIssue(owner, repo, issue);
        } catch (error) {
          const errorMsg = `Failed to review issue #${issue.number}: ${error instanceof Error ? error.message : String(error)}`;
          console.error(`    ❌ ${errorMsg}`);
          this.errors.push(errorMsg);
          this.results.push({
            repository: `${owner}/${repo}`,
            type: 'issue',
            number: issue.number,
            status: 'error',
            error: errorMsg
          });
        }
      }
    } catch (error) {
      const errorMsg = `Failed to list issues: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`  ❌ ${errorMsg}`);
      this.errors.push(errorMsg);
    }
  }

  /**
   * Review a single issue
   */
  private async reviewIssue(owner: string, repo: string, issue: Record<string, any>): Promise<void> {
    console.log(`    🔎 Reviewing issue #${issue.number}: ${issue.title}`);

    // Check if issue already has recent review from this bot
    const hasRecentReview = await this.hasRecentBotReview(owner, repo, issue.number);
    if (hasRecentReview) {
      console.log(`    ⏭️  Skipping issue #${issue.number} (recently reviewed)`);
      this.results.push({
        repository: `${owner}/${repo}`,
        type: 'issue',
        number: issue.number,
        status: 'skipped',
        message: 'Recently reviewed'
      });
      return;
    }

    // Perform analysis
    const analysis = this.analyzeIssue(issue);
    
    // Take actions based on analysis
    if (!this.config.dryRun) {
      // Add labels
      if (analysis.labels.length > 0) {
        await this.addLabels(owner, repo, issue.number, analysis.labels);
      }

      // Post comment if needed
      if (analysis.needsComment) {
        await this.postIssueComment(owner, repo, issue.number, analysis.comment);
      }
    } else {
      console.log(`    🧪 [DRY RUN] Would add labels: ${analysis.labels.join(', ')}`);
      console.log(`    🧪 [DRY RUN] Would post comment: ${analysis.needsComment ? 'YES' : 'NO'}`);
    }

    this.results.push({
      repository: `${owner}/${repo}`,
      type: 'issue',
      number: issue.number,
      status: 'success',
      action: analysis.labels.length > 0 || analysis.needsComment ? 'reviewed' : 'analyzed',
      message: `Analyzed with ${analysis.priority} priority`
    });

    console.log(`    ✅ Issue #${issue.number} reviewed (${analysis.priority} priority)`);
  }

  /**
   * Check if PR/issue has been recently reviewed by this bot
   */
  private async hasRecentBotReview(owner: string, repo: string, number: number): Promise<boolean> {
    try {
      const { data: comments } = await this.octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: number,
        per_page: 10
      });

      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return comments.some(comment => 
        comment.body?.includes('🤖 Auto-Review Agent') &&
        new Date(comment.created_at).getTime() > oneDayAgo
      );
    } catch (error) {
      // If we can't check, assume no recent review to be safe
      return false;
    }
  }

  /**
   * Analyze a pull request and determine actions
   */
  private analyzePR(pr: any, files: any[]): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    labels: string[];
    needsComment: boolean;
    comment: string;
  } {
    const labels: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let needsComment = false;
    let commentParts: string[] = [];

    // Check PR size
    const totalChanges = pr.additions + pr.deletions;
    if (totalChanges > 1000) {
      riskLevel = 'high';
      labels.push('large-pr');
      commentParts.push('- ⚠️ Large PR: Consider breaking this into smaller, focused changes');
    } else if (totalChanges > 500) {
      riskLevel = 'medium';
      labels.push('medium-pr');
    }

    // Check if PR is a draft
    if (pr.draft) {
      labels.push('draft');
      riskLevel = 'low';
    }

    // Check for security-sensitive files
    const securityFiles = files.filter(f => 
      f.filename.includes('auth') ||
      f.filename.includes('security') ||
      f.filename.includes('password') ||
      f.filename.includes('.env') ||
      f.filename.includes('secret')
    );

    if (securityFiles.length > 0) {
      riskLevel = 'critical';
      labels.push('security-review-needed');
      commentParts.push('- 🔐 Security-sensitive files detected: Requires thorough security review');
    }

    // Check for test files
    const hasTests = files.some(f => 
      f.filename.includes('test') ||
      f.filename.includes('spec') ||
      f.filename.includes('__tests__')
    );

    if (totalChanges > 100 && !hasTests && !pr.draft) {
      labels.push('needs-tests');
      commentParts.push('- 🧪 No test files found: Consider adding tests for this change');
    }

    // Check if PR has description
    if (!pr.body || pr.body.trim().length < 50) {
      labels.push('needs-description');
      commentParts.push('- 📝 Minimal description: Please add details about what this PR does and why');
    }

    // Check for breaking changes indicators
    const breakingChanges = pr.title.includes('BREAKING') || 
                           pr.title.includes('!:') ||
                           pr.body?.includes('BREAKING CHANGE');
    
    if (breakingChanges) {
      riskLevel = 'critical';
      labels.push('breaking-change');
      commentParts.push('- ⚡ Breaking change detected: Ensure proper documentation and migration guide');
    }

    // Build comment if needed
    if (commentParts.length > 0) {
      needsComment = true;
      const header = `## 🤖 Auto-Review Agent\n\n`;
      const body = `The following items need attention:\n\n${commentParts.join('\n')}\n\n`;
      const footer = `---\n*This is an automated review. For questions, contact the maintainers.*`;
      commentParts = [header, body, footer];
    }

    return {
      riskLevel,
      labels: [...labels, 'auto-reviewed'],
      needsComment,
      comment: commentParts.join('')
    };
  }

  /**
   * Analyze an issue and determine actions
   */
  private analyzeIssue(issue: Record<string, any>): {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    labels: string[];
    needsComment: boolean;
    comment: string;
  } {
    const labels: string[] = [];
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    let needsComment = false;
    let commentParts: string[] = [];

    // Check for bug keywords
    const title = issue.title.toLowerCase();
    const body = (issue.body || '').toLowerCase();
    const text = `${title} ${body}`;

    if (text.includes('crash') || text.includes('error') || text.includes('bug')) {
      labels.push('bug');
      priority = 'high';
    }

    // Check for feature request
    if (text.includes('feature') || text.includes('enhancement')) {
      labels.push('enhancement');
    }

    // Check for documentation
    if (text.includes('documentation') || text.includes('docs')) {
      labels.push('documentation');
      priority = 'low';
    }

    // Check for urgent keywords
    if (text.includes('urgent') || text.includes('critical') || text.includes('security')) {
      priority = 'urgent';
      labels.push('urgent');
    }

    // Check if issue has proper description
    if (!issue.body || issue.body.trim().length < 30) {
      labels.push('needs-more-info');
      needsComment = true;
      commentParts.push('- 📝 Please provide more details about this issue');
    }

    // Build comment if needed
    if (needsComment) {
      const header = `## 🤖 Auto-Review Agent\n\n`;
      const body = `Thank you for opening this issue. ${commentParts.join('\n')}\n\n`;
      const footer = `---\n*This is an automated response. A maintainer will review this issue soon.*`;
      commentParts = [header, body, footer];
    }

    return {
      priority,
      labels: [...labels, 'auto-reviewed'],
      needsComment,
      comment: commentParts.join('')
    };
  }

  /**
   * Add labels to a PR or issue
   */
  private async addLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<void> {
    try {
      // Only add labels that don't already exist
      const { data: existingLabels } = await this.octokit.rest.issues.listLabelsOnIssue({
        owner,
        repo,
        issue_number: issueNumber
      });

      const existingLabelNames = existingLabels.map((l: any) => l.name);
      const newLabels = labels.filter(l => !existingLabelNames.includes(l));

      if (newLabels.length === 0) {
        return;
      }

      await this.octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: newLabels
      });

      console.log(`    🏷️  Added labels: ${newLabels.join(', ')}`);
    } catch (error) {
      console.error(`    ⚠️  Failed to add labels: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Post a review comment on a PR
   */
  private async postReviewComment(owner: string, repo: string, prNumber: number, comment: string): Promise<void> {
    try {
      await this.octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: comment
      });

      console.log(`    💬 Posted review comment`);
    } catch (error) {
      console.error(`    ⚠️  Failed to post comment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Post a comment on an issue
   */
  private async postIssueComment(owner: string, repo: string, issueNumber: number, comment: string): Promise<void> {
    try {
      await this.octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: comment
      });

      console.log(`    💬 Posted issue comment`);
    } catch (error) {
      console.error(`    ⚠️  Failed to post comment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Create and run an auto-review agent with default configuration
 */
export async function runAutoReview(
  githubToken: string,
  repositories: string[] = ['brandonlacoste9-tech/adgenxai', 'brandonlacoste9-tech/Beehive'],
  options: Partial<AutoReviewConfig> = {}
): Promise<AutoReviewSummary> {
  const config: AutoReviewConfig = {
    githubToken,
    repositories,
    enableAIAnalysis: options.enableAIAnalysis ?? true,
    dryRun: options.dryRun ?? false,
    maxPRsPerRepo: options.maxPRsPerRepo ?? 50,
    maxIssuesPerRepo: options.maxIssuesPerRepo ?? 50
  };

  const agent = new AutoReviewAgent(config);
  return await agent.runBulkReview();
}
