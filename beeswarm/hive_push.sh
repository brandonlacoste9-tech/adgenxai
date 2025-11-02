#!/usr/bin/env bash
set -e

# 🐝 BeeHive Studio - Creative Asset Push Automation
# Usage: bash hive_push.sh <filename> [destination]

FILENAME="$1"
DEST="${2:-src/assets}"
BEEHIVE_ROOT="/workspaces/adgenxai/beeswarm"

# Color codes for mythic terminal output
GOLD='\033[0;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GOLD}🐝 BeeHive Studio - Creative Asset Integration${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

if [ -z "$FILENAME" ]; then
  echo -e "${GOLD}Usage: bash hive_push.sh <filename> [destination]${NC}"
  echo -e "${BLUE}Example: bash hive_push.sh A-bright-cinematic.jpg${NC}"
  echo -e "${BLUE}Example: bash hive_push.sh hero-video.mp4 src/assets/videos${NC}"
  exit 1
fi

# Check if file exists
if [ ! -f "$FILENAME" ]; then
  echo -e "${GOLD}⚠️  File not found: $FILENAME${NC}"
  echo -e "${BLUE}Please ensure the file exists in the current directory${NC}"
  exit 1
fi

# Navigate to BeeHive root
cd "$BEEHIVE_ROOT"

echo -e "${GOLD}🌟 Importing $FILENAME into $DEST ...${NC}"
mkdir -p "$DEST"
cp "$FILENAME" "$DEST/"

# Get file info for commit message
BASENAME=$(basename "$FILENAME")
FILESIZE=$(ls -lh "$DEST/$BASENAME" | awk '{print $5}')
FILETYPE="${BASENAME##*.}"

echo -e "${GOLD}📁 Asset Details:${NC}"
echo -e "${BLUE}   Name: $BASENAME${NC}"
echo -e "${BLUE}   Size: $FILESIZE${NC}"
echo -e "${BLUE}   Type: $FILETYPE${NC}"
echo -e "${BLUE}   Path: $DEST/$BASENAME${NC}"

echo -e "${GOLD}🔄 Adding to git and committing ...${NC}"
git add "$DEST/$BASENAME"
git status --porcelain | grep "$BASENAME"

# Create mythic commit message
COMMIT_MSG="✨ BeeHive Expansion: Add $BASENAME ($FILESIZE $FILETYPE)

🐝 Asset Integration Details:
- File: $BASENAME
- Size: $FILESIZE
- Type: $FILETYPE
- Destination: $DEST/
- Timestamp: $(date '+%Y-%m-%d %H:%M:%S')

The hive grows stronger with each creative drop.
Nectar now flowing through: $DEST/$BASENAME"

git commit -m "$COMMIT_MSG"

echo -e "${GOLD}🚀 Pushing to repository ...${NC}"
git push origin main

echo -e "${GREEN}✅ Hive expansion complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GOLD}🌟 $BASENAME is now live in the BeeHive Studio!${NC}"
echo -e "${BLUE}   Asset Path: $DEST/$BASENAME${NC}"
echo -e "${BLUE}   Import in React: import asset from '../assets/$BASENAME'${NC}"
echo -e "${BLUE}   The creative nectar circulates...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"