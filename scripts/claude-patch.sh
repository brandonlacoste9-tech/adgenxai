#!/usr/bin/env bash
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 path/to/file"
  exit 1
fi
IN="$1"
OUT="${IN}.claude.patch"

echo "Generating patch for: $IN"
claude generate-patch "$IN" > "$OUT" || { echo "Claude did not generate a patch or returned non-zero"; exit 0; }
echo "Patch written to: $OUT"
echo "Preview with: less $OUT"
echo "Apply with: git apply $OUT"

exit 0
