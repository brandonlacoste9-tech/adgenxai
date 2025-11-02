// tailwind.config.js
// Unified BeeHive design system — Aurora + Hive + Swarm tones

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        hiveDark: '#0b0c10',
        hivePanel: '#13151a',
        auroraGold: '#fccb00',
        plasmaBlue: '#1a8cff',
        auroraAmber: '#ffb400',
        swarmGray: '#b8b8b8'
      },
      backgroundImage: {
        hiveGradient: 'radial-gradient(circle at center, rgba(255,215,0,0.08), transparent 80%)',
        hivePattern:
          'repeating-linear-gradient(60deg, rgba(255,215,0,0.04) 0px, rgba(255,215,0,0.04) 2px, transparent 2px, transparent 24px)'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        aurora: '0 0 30px rgba(255,215,0,0.25)',
        hiveInner: 'inset 0 0 10px rgba(255,215,0,0.2)'
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};