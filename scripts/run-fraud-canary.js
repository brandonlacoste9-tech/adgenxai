import fs from 'fs';
import fetch from 'node-fetch';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const SUPABASE_URL = argv['supabase-url'] || process.env.SUPABASE_URL;
const SUPABASE_KEY = argv['supabase-key'] || process.env.FRAUD_API_KEY;
const PR = argv.pr || process.env.PR_NUMBER || process.env.GITHUB_REF || '';
const FIXTURES = argv.fixtures || 'docs/codex/fixtures/fraud_canary/sample_campaigns.json';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or FRAUD_API_KEY');
  process.exit(1);
}

async function callSupabaseFunction(campaign) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/fraud-detection-api`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ campaign })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase function returned ${response.status}: ${text}`);
  }

  return response.json();
}

async function run() {
  const fixtures = JSON.parse(fs.readFileSync(FIXTURES, 'utf8'));
  const results = [];

  for (const campaign of fixtures.campaigns || []) {
    const analysis = await callSupabaseFunction(campaign);
    results.push({ campaignId: campaign.id, analysis });
  }

  const payload = { pr: PR, timestamp: new Date().toISOString(), results };
  fs.writeFileSync('fraud_summary.json', JSON.stringify(payload, null, 2));
  console.log('fraud_summary.json written');
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
