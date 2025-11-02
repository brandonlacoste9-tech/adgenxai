import fs from 'fs';
import path from 'path';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const inputPath = argv.input;
const outputPath = argv.output || 'reports/fraud-report.md';

if (!inputPath) {
  console.error('Missing --input path for fraud summary');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { pr = '', timestamp, results = [] } = summary;

const rows = results.map(({ campaignId, analysis }) => {
  const risk = analysis?.riskLevel ?? 'unknown';
  const score = analysis?.fraud_score ?? analysis?.score ?? 'n/a';
  return `| ${campaignId} | ${score} | ${risk} |`;
});

const signalSections = results.map(({ campaignId, analysis }) => {
  if (!Array.isArray(analysis?.signals) || !analysis.signals.length) {
    return `- ${campaignId}: No detailed signals provided.`;
  }
  const bullets = analysis.signals.slice(0, 5).map(signal => `  - ${signal}`).join('\n');
  return `- ${campaignId}:\n${bullets}`;
});

const reportLines = [
  '# Codex Fraud Canary Report',
  '',
  `- Generated: ${timestamp || new Date().toISOString()}`,
  pr ? `- PR: ${pr}` : '- PR: (scheduled run)',
  '',
  '| Campaign | Fraud Score | Risk Level |',
  '| --- | --- | --- |',
  ...rows,
  '',
  '## Signals',
  '',
  ...signalSections,
  '',
  '## Recommended Actions',
  '',
  results.length
    ? '- Review high-risk campaigns and apply `// codex:hold` annotations as needed.'
    : '- No campaigns evaluated. Confirm fixtures are configured.',
  '- Investigate signals flagged in Supabase logs for deeper insight.',
  '',
  '## Telemetry Attachments',
  '',
  '- Source summary: `fraud_summary.json`',
  '- Supabase function: `supabase/functions/fraud-detection-api`'
];

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, reportLines.join('\n'));
console.log(`Fraud report written to ${outputPath}`);
