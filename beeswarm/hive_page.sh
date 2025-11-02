#!/usr/bin/env bash
set -e

# 🐝 BeeHive Studio - Page/Module Scaffolding Automation
# Usage: bash hive_page.sh <PageName> [image-asset] [page-type]

NAME="$1"
ASSET="$2"
PAGE_TYPE="${3:-standard}"
DEST="src/pages"
ASSET_PATH="src/assets"
BEEHIVE_ROOT="/workspaces/adgenxai/beeswarm"

# Color codes for mythic terminal output
GOLD='\033[0;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${GOLD}🐝 BeeHive Studio - Page Scaffolding Ceremony${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

if [ -z "$NAME" ]; then
  echo -e "${GOLD}Usage: bash hive_page.sh <PageName> [image-asset] [page-type]${NC}"
  echo -e "${BLUE}Examples:${NC}"
  echo -e "${BLUE}  bash hive_page.sh CinematicHero A-bright-cinematic.jpg${NC}"
  echo -e "${BLUE}  bash hive_page.sh SwarmDashboard hero.jpg dashboard${NC}"
  echo -e "${BLUE}  bash hive_page.sh PersonaLab lab-bg.png laboratory${NC}"
  echo -e "${PURPLE}Page Types: standard, dashboard, laboratory, gallery, feed${NC}"
  exit 1
fi

# Navigate to BeeHive root
cd "$BEEHIVE_ROOT"

mkdir -p "$DEST"
COMPONENT="$DEST/${NAME}.tsx"

echo -e "${GOLD}🌟 Scaffolding $NAME ($PAGE_TYPE type)...${NC}"

# Generate component based on page type
case "$PAGE_TYPE" in
  "dashboard")
    COMPONENT_TEMPLATE="dashboard"
    ;;
  "laboratory")
    COMPONENT_TEMPLATE="laboratory"
    ;;
  "gallery")
    COMPONENT_TEMPLATE="gallery"
    ;;
  "feed")
    COMPONENT_TEMPLATE="feed"
    ;;
  *)
    COMPONENT_TEMPLATE="standard"
    ;;
esac

echo -e "${PURPLE}📝 Generating $COMPONENT_TEMPLATE template...${NC}"

# Create the React component with mythic structure
cat > "$COMPONENT" <<'EOF'
import React from 'react';
import { motion } from 'framer-motion';
import { colors, animations, gradients } from '../theme/beehive';
ASSET_IMPORT_PLACEHOLDER

// 🐝 BeeHive Studio - NAME_PLACEHOLDER Page
// Generated: TIMESTAMP_PLACEHOLDER
// Type: PAGE_TYPE_PLACEHOLDER
ASSET_COMMENT_PLACEHOLDER

interface ${NAME}Props {
  className?: string;
}

export default function $NAME({ className = '' }: ${NAME}Props) {
  return (
    <motion.section 
      className={\`relative min-h-screen bg-gradient-to-br from-hive-dark to-hive-darkAlt text-aurora-gold font-sans overflow-hidden \${className}\`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animations.ceremonial}
    >
      {/* Mythic Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
      
      {/* Plasma Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 64, 175, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={animations.glow}
      />

      ${ASSET:+/* Hero Asset */}
      ${ASSET:+<motion.div}
      ${ASSET:+  className="absolute inset-0 z-0"}
      ${ASSET:+  initial={{ scale: 1.1, opacity: 0 }}}
      ${ASSET:+  animate={{ scale: 1, opacity: 0.3 }}}
      ${ASSET:+  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}}
      ${ASSET:+>}
      ${ASSET:+  <img }
      ${ASSET:+    src={heroImage} }
      ${ASSET:+    alt="$NAME Hero" }
      ${ASSET:+    className="w-full h-full object-cover pointer-events-none"}
      ${ASSET:+  />}
      ${ASSET:+</motion.div>}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Ceremonial Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, ...animations.ceremonial }}
        >
          <motion.h1 
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-aurora-gold to-aurora-goldLight bg-clip-text text-transparent"
            animate={{
              textShadow: [
                '0 0 20px rgba(212, 175, 55, 0.5)',
                '0 0 40px rgba(212, 175, 55, 0.8)',
                '0 0 20px rgba(212, 175, 55, 0.5)',
              ],
            }}
            transition={animations.glow}
          >
            $NAME
          </motion.h1>
          
          <motion.p 
            className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 0.5, ...animations.ceremonial }}
          >
            Welcome to the $NAME chamber of the BeeHive Studio. 
            ${PAGE_TYPE == "dashboard" && "Monitor the pulse of creative swarm intelligence."}
            ${PAGE_TYPE == "laboratory" && "Experiment with mythic creative algorithms."}
            ${PAGE_TYPE == "gallery" && "Explore the visual nectar of collective creativity."}
            ${PAGE_TYPE == "feed" && "Stream the live creative consciousness of the hive."}
            ${PAGE_TYPE == "standard" && "Experience the next evolution of creative interfaces."}
          </motion.p>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, ...animations.ceremonial }}
        >
          {/* Feature Cards */}
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-hive-dark/80 to-hive-darkAlt/60 backdrop-blur-sm border border-aurora-gold/20 hover:border-aurora-gold/60 transition-all duration-500"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Honeycomb Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEwzMC4xOTUgNS4xODhMMzUuNSAxNUwzMC4xOTUgMjQuODEyTDIwIDMwTDkuODA1IDI0LjgxMkw0LjUgMTVMOS44MDUgNS4xODhMMjAgMFoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] bg-repeat" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 mx-auto bg-gradient-to-br from-aurora-gold to-aurora-goldLight rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🐝</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-aurora-gold">
                  Feature {index}
                </h3>
                
                <p className="text-aurora-gold/70 text-sm leading-relaxed">
                  Customize this ${PAGE_TYPE} experience with your creative vision.
                  The hive awaits your mythic touch.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.button
          className="mt-16 px-12 py-4 bg-gradient-to-r from-aurora-gold to-aurora-goldLight text-hive-dark font-semibold rounded-full hover:shadow-2xl hover:shadow-aurora-gold/50 transition-all duration-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, ...animations.ceremonial }}
        >
          Enter the $NAME Chamber
        </motion.button>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 bg-aurora-gold/30 rounded-full"
            style={{
              left: \`\${Math.random() * 100}%\`,
              top: \`\${Math.random() * 100}%\`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}

// Export metadata for router integration
export const pageMetadata = {
  name: '$NAME',
  path: '/${NAME.toLowerCase()}',
  type: '$PAGE_TYPE',
  ${ASSET:+asset: '$ASSET',}
  generated: '$(date '+%Y-%m-%d %H:%M:%S')',
  description: '${PAGE_TYPE} page for BeeHive Studio creative interface',
};
EOF

echo -e "${GOLD}📊 Component Details:${NC}"
echo -e "${BLUE}   Name: $NAME${NC}"
echo -e "${BLUE}   Type: $PAGE_TYPE${NC}"
echo -e "${BLUE}   File: $COMPONENT${NC}"
echo -e "${BLUE}   Lines: $(wc -l < "$COMPONENT")${NC}"
${ASSET:+echo -e "${BLUE}   Asset: $ASSET${NC}"}

echo -e "${GOLD}🔄 Adding new module to git and committing ...${NC}"
git add "$COMPONENT"

# Create detailed commit message
COMMIT_MSG="🐝 BeeHive Scaffold: Add $NAME ($PAGE_TYPE)

✨ New Page Module Details:
- Component: $NAME
- Type: $PAGE_TYPE
- File: $COMPONENT
- Lines: $(wc -l < "$COMPONENT")
${ASSET:+- Asset: $ASSET}
- Generated: $(date '+%Y-%m-%d %H:%M:%S')

🎨 Features:
- Mythic design system integration
- Framer Motion ceremonial animations
- Plasma glow and honeycomb effects
${ASSET:+- Hero asset integration}
- Responsive grid layout
- Interactive hover states

The hive expands with each new chamber.
Path: /${NAME,,}"

git commit -m "$COMMIT_MSG"

echo -e "${GOLD}🚀 Pushing new module to repository ...${NC}"
git push origin main

echo -e "${GREEN}✅ $NAME page is live!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GOLD}🌟 BeeHive Studio has expanded!${NC}"
echo -e "${BLUE}   Component: $NAME${NC}"
echo -e "${BLUE}   Path: $COMPONENT${NC}"
echo -e "${BLUE}   Route: /${NAME,,}${NC}"
echo -e "${PURPLE}   Next Step: Add to your router configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"