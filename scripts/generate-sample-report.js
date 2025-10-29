#!/usr/bin/env node
// Generates a human readable sample fraud report from a summary JSON
import { existsSync, readFileSync, writeFileSync } from 'fs';

const summaryPath = process.argv[2] || 'reports/adgenxai-sample.json';
const out = process.argv[3] || 'docs/codex/samples/sample_fraud_report.md';

if (!existsSync(summaryPath)) {
  console.error('Summary file not found:', summaryPath);
  process.exit(1);
}

const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));

let md = `# Codex Fraud Canary — Sample Report\n\nGenerated: ${new Date().toISOString()}\n\n`;

md += '## Summary\n\n';
md += `Total fixtures: ${summary.total_fixtures ?? 'N/A'}\n\n`;

if (Array.isArray(summary.items)) {
  md += '## Findings\n\n';
  summary.items.forEach(it => {
    md += `### ${it.fixture}\n`;
    md += `- score: ${it.score}\n`;
    md += `- indicators: ${JSON.stringify(it.indicators || [])}\n\n`;
  });
}

writeFileSync(out, md, 'utf8');
console.log('Wrote', out);
