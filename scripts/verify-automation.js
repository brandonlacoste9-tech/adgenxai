#!/usr/bin/env node
/**
 * GitHub Automation Verification Script
 * Verifies the automation setup described in Issue #110
 * 
 * Usage: node scripts/verify-automation.js
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('🔍 GitHub Automation Verification - Issue #110\n');
console.log('='.repeat(60));

// Check 1: GitHub Workflows
console.log('\n📋 Checking GitHub Workflows...');
const workflowDir = path.join(__dirname, '../.github/workflows');
const requiredWorkflows = [
  'automated-issue-response.yml',
  'cortex-observer.yml',
  'observer-v2.yml',
  'codeql.yml',
  'ci.yml',
  'test.yml'
];

requiredWorkflows.forEach(workflow => {
  const workflowPath = path.join(workflowDir, workflow);
  if (fs.existsSync(workflowPath)) {
    checks.passed.push(`✅ Workflow exists: ${workflow}`);
  } else {
    checks.failed.push(`❌ Missing workflow: ${workflow}`);
  }
});

// Check 2: Agent Framework
console.log('\n🤖 Checking Agent Framework...');
const agentDirs = [
  'agents/github-pr-manager',
  'agents/github-pr-manager/src'
];

agentDirs.forEach(dir => {
  const agentPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(agentPath)) {
    checks.passed.push(`✅ Agent directory exists: ${dir}`);
  } else {
    checks.failed.push(`❌ Missing agent directory: ${dir}`);
  }
});

// Check 3: Agent CLI Integration
console.log('\n🔧 Checking GitHub Agent CLI...');
const agentFiles = [
  'dist/index.js',
  'GITHUB_AGENT_INSTALLATION_PLAN.md',
  'GITHUB_AGENT_QUICK_REF.md'
];

agentFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ Agent file exists: ${file}`);
  } else {
    checks.failed.push(`❌ Missing agent file: ${file}`);
  }
});

// Check 4: NPM Scripts
console.log('\n📦 Checking NPM Scripts...');
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredScripts = [
    'agent:deploy',
    'agent:health',
    'agent:status',
    'agent:monitor'
  ];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      checks.passed.push(`✅ NPM script exists: ${script}`);
    } else {
      checks.failed.push(`❌ Missing NPM script: ${script}`);
    }
  });
} else {
  checks.failed.push('❌ package.json not found');
}

// Check 5: Documentation
console.log('\n📚 Checking Documentation...');
const docFiles = [
  'docs/AGENT_ORCHESTRATION.md',
  'agents/README.md',
  'agents/github-pr-manager/README.md',
  '.github/copilot-coding-agent.yml'
];

docFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ Documentation exists: ${file}`);
  } else {
    checks.failed.push(`❌ Missing documentation: ${file}`);
  }
});

// Check 6: Configuration Files
console.log('\n⚙️  Checking Configuration Files...');
const configFiles = [
  '.github/labeler.yml',
  '.github/copilot-coding-agent.yml'
];

configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ Config file exists: ${file}`);
  } else {
    checks.failed.push(`❌ Missing config file: ${file}`);
  }
});

// Check 7: Agent Dependencies
console.log('\n📦 Checking Dependencies...');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    'github-agent-cli'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      checks.passed.push(`✅ Dependency installed: ${dep}`);
    } else {
      checks.warnings.push(`⚠️  Optional dependency missing: ${dep}`);
    }
  });
}

// Check 8: Automation Status Report
console.log('\n📊 Checking Status Report...');
const statusReportPath = path.join(__dirname, '../GITHUB_AUTOMATION_STATUS_REPORT.md');
if (fs.existsSync(statusReportPath)) {
  checks.passed.push('✅ Automation status report exists');
} else {
  checks.failed.push('❌ Missing automation status report');
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('\n📊 VERIFICATION RESULTS\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED CHECKS:');
  checks.passed.forEach(check => console.log(`   ${check}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  checks.warnings.forEach(check => console.log(`   ${check}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED CHECKS:');
  checks.failed.forEach(check => console.log(`   ${check}`));
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📈 SUMMARY:');
console.log(`   Total Checks: ${checks.passed.length + checks.failed.length + checks.warnings.length}`);
console.log(`   ✅ Passed: ${checks.passed.length}`);
console.log(`   ⚠️  Warnings: ${checks.warnings.length}`);
console.log(`   ❌ Failed: ${checks.failed.length}`);

const totalChecks = checks.passed.length + checks.failed.length;
const passRate = totalChecks > 0 ? (checks.passed.length / totalChecks) * 100 : 0;
console.log(`   📊 Pass Rate: ${passRate.toFixed(1)}%`);

// Exit code
if (checks.failed.length > 0) {
  console.log('\n⚠️  Some checks failed. Review the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ All critical checks passed!');
  if (checks.warnings.length > 0) {
    console.log('⚠️  Some optional features are missing but not critical.');
  }
  process.exit(0);
}
