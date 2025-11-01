#!/usr/bin/env node
// Simple validator for fixture shape
import { readFileSync } from 'fs';

function validate(file) {
  const json = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(json)) {
    throw new Error(`${file}: expected array`);
  }
  json.forEach((c, i) => {
    if (!c.id || !c.name || !Array.isArray(c.creative_items)) {
      throw new Error(`${file}[${i}]: missing required fields`);
    }
  });
  console.log(`${file}: OK`);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/validate-fixtures.js <fixture1.json> [<fixture2.json> ...]");
  process.exit(2);
}

files.forEach(file => {
  validate(file);
});
