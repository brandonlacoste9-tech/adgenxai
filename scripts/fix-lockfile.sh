#!/bin/bash

# Script to regenerate package-lock.json with lucide-react dependency
# This ensures npm ci will work in CI/CD environments

echo "🔧 Regenerating package-lock.json to include lucide-react..."

# Remove existing lock file
rm -f package-lock.json

# Install dependencies to regenerate lock file
npm install --package-lock-only

echo "✅ package-lock.json updated successfully!"
echo "📦 lucide-react@^0.263.1 is now included in the lock file"