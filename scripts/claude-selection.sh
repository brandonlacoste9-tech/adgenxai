#!/usr/bin/env bash
set -e

# Create temp files with proper security and cleanup
TMPFILE="$(mktemp "${TMPDIR:-/tmp}/claude-selection.XXXXXX")"
mv "$TMPFILE" "${TMPFILE}.md"
TMPFILE="${TMPFILE}.md"
OUTFILE="${TMPFILE}.out"

# Ensure cleanup on exit
trap 'rm -f "$TMPFILE" "$OUTFILE"' EXIT

echo "Reading stdin into: $TMPFILE"
cat - > "$TMPFILE"

echo "Calling Claude..."
if claude review "$TMPFILE" > "$OUTFILE"; then
  echo "Output written to: $OUTFILE"
  
  # Open in VS Code if available
  # Note: Opening in VS Code is optional, so we don't fail if it's unavailable or errors
  if command -v code >/dev/null 2>&1; then
    code --reuse-window "$OUTFILE" || true
  else
    echo "Open the file manually: $OUTFILE"
  fi
  exit 0
else
  echo "Error: Claude review failed" >&2
  exit 1
fi