#!/usr/bin/env node
import { mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, isAbsolute, resolve } from 'node:path';
import process from 'node:process';
import { randomUUID } from 'node:crypto';

const exitWith = (code, message) => {
  if (message) {
    process.stderr.write(`${message}\n`);
  }
  process.exit(code);
};

const parseArgs = (argv) => {
  const options = {
    repo: '',
    format: 'json',
    limit: 20,
    output: '-',
    dryRun: false,
    force: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    switch (token) {
      case '--repo':
        options.repo = argv[++i] ?? '';
        break;
      case '--format':
        options.format = (argv[++i] ?? 'json').toLowerCase();
        break;
      case '--limit':
        options.limit = Number(argv[++i] ?? '20');
        break;
      case '--output':
        options.output = argv[++i] ?? '-';
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--force':
        options.force = true;
        break;
      default:
        exitWith(1, `Unknown argument: ${token}`);
    }
  }

  if (!options.repo) {
    exitWith(1, 'Missing required --repo option.');
  }

  if (!['json', 'markdown'].includes(options.format)) {
    exitWith(1, 'Unsupported format. Use json or markdown.');
  }

  if (!Number.isFinite(options.limit) || options.limit <= 0) {
    exitWith(1, '--limit must be a positive number.');
  }

  return options;
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const token = process.env.GITHUB_TOKEN;
  const apiBase = process.env.GITHUB_API_BASE || 'https://api.github.com';

  if (!token || token.trim() === '') {
    exitWith(1, 'GITHUB_TOKEN not set. Export a valid token before running triage.');
  }

  const headers = {
    Authorization: `token ${token}`,
    'User-Agent': 'pr-triage-cli',
    Accept: 'application/vnd.github+json'
  };

  const validateResponse = await fetch(`${apiBase}/user`, { headers, method: 'GET' });
  if (!validateResponse.ok) {
    const body = await validateResponse.text();
    exitWith(1, `GitHub token validation failed (${validateResponse.status}): ${body}`);
  }

  const pullsResponse = await fetch(`${apiBase}/repos/${options.repo}/pulls?state=open&per_page=${options.limit}`, {
    headers,
    method: 'GET'
  });

  if (!pullsResponse.ok) {
    const body = await pullsResponse.text();
    exitWith(1, `Failed to query pull requests (${pullsResponse.status}): ${body}`);
  }

  const pulls = await pullsResponse.json();
  const generatedAt = new Date().toISOString();
  const baseReport = {
    repo: options.repo,
    generatedAt,
    dryRun: options.dryRun,
    limit: options.limit,
    pullRequests: pulls.map((pull) => ({
      number: pull.number,
      title: pull.title,
      author: pull.user?.login ?? 'unknown',
      url: pull.html_url,
      draft: Boolean(pull.draft),
      createdAt: pull.created_at,
      mergeableState: pull.mergeable_state ?? 'unknown'
    }))
  };

  const formatAsMarkdown = (report) => {
    const lines = [];
    lines.push(`# Pull request triage for ${report.repo}`);
    lines.push(`Generated at ${report.generatedAt}`);
    lines.push('');
    if (report.pullRequests.length === 0) {
      lines.push('No open pull requests found.');
      return lines.join('\n');
    }
    lines.push('| Number | Title | Author | Draft | Created |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const item of report.pullRequests) {
      lines.push(`| #${item.number} | ${item.title.replace(/\|/g, '\\|')} | ${item.author} | ${item.draft ? 'yes' : 'no'} | ${item.createdAt} |`);
    }
    return lines.join('\n');
  };

  let payload;
  if (options.format === 'markdown') {
    payload = formatAsMarkdown(baseReport);
  } else {
    payload = JSON.stringify(baseReport, null, 2);
  }

  const writeOutput = async (content) => {
    if (options.output === '-') {
      process.stdout.write(`${content}\n`);
      return;
    }

    const absoluteOutput = isAbsolute(options.output)
      ? options.output
      : resolve(process.cwd(), options.output);
    const directory = dirname(absoluteOutput);
    await mkdir(directory, { recursive: true });

    const tempFile = join(directory === '' ? tmpdir() : directory, `.triage-${randomUUID()}.tmp`);
    await writeFile(tempFile, content, { encoding: 'utf8' });
    await rm(absoluteOutput, { force: true });
    await rename(tempFile, absoluteOutput);
  };

  await writeOutput(payload);

  if (options.force) {
    process.stderr.write('Force flag ignored because automation merge is disabled in this build.\n');
  }
};

run().catch((error) => {
  exitWith(1, error instanceof Error ? error.message : String(error));
});
