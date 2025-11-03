#!/usr/bin/env bash
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 path/to/file"
  exit 1
fi
IN="$1"
OUT="${IN}.claude.patch"

echo "Generating patch for: $IN"
if claude generate-patch "$IN" > "$OUT"; then
  echo "Patch written to: $OUT"
  echo "Preview with: less $OUT"
  echo "Apply with: git apply $OUT"
  exit 0
else
  echo "Error: Claude did not generate a patch or returned non-zero" >&2
  exit 1
fi
