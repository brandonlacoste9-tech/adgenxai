#!/usr/bin/env node
"use strict";

const { spawnSync } = require("child_process");

function readSecretFromStdIn() {
  let data = "";
  try {
    data = require("fs").readFileSync(0, "utf8");
  } catch (error) {
    console.error("✗ Failed to read from STDIN:", error.message);
    process.exit(1);
  }
  return data.trim();
}

const args = process.argv.slice(2);
const useStdIn = args.includes("--stdin");
const explicitValue = args.find((arg) => !arg.startsWith("-"));
const secret = useStdIn ? readSecretFromStdIn() : explicitValue || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secret) {
  console.error("✗ Missing Supabase service role key. Pass it as an argument, via --stdin, or set SUPABASE_SERVICE_ROLE_KEY in your environment.");
  process.exit(1);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["netlify", "env:set", "SUPABASE_SERVICE_ROLE_KEY", secret], {
  stdio: "inherit",
});

if (result.error) {
  console.error("✗ Failed to invoke Netlify CLI:", result.error.message);
  process.exit(1);
}

if (typeof result.status === "number" && result.status !== 0) {
  process.exit(result.status);
}

console.log("✓ Supabase service role key synced to Netlify environment.");
