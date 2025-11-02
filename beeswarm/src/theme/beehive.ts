export const colors = {
  aurora: {
    gold: '#D4AF37',
    goldLight: '#F4E4A1',
    goldDark: '#B8941F',
  },
  plasma: {
    blue: '#1E40AF',
    blueLight: '#3B82F6',
    blueDark: '#1E3A8A',
    cyan: '#06B6D4',
    purple: '#8B5CF6',
  },
  hive: {
    dark: '#0F172A',
    darkAlt: '#1E293B',
    amber: '#F59E0B',
    amberLight: '#FDE047',
    orange: '#EA580C',
  },
  mythic: {
    void: '#000000',
    shadow: '#111827',
    mist: '#374151',
    pearl: '#F9FAFB',
    ember: '#DC2626',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

export const animations = {
  ceremonial: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
  },
  glow: {
    duration: 2.5,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'reverse' as const,
  },
  honeycomb: {
    duration: 1.2,
    ease: [0.4, 0, 0.2, 1],
  },
  swarm: {
    duration: 0.6,
    ease: [0.23, 1, 0.32, 1],
  },
  plasma: {
    duration: 3,
    ease: 'linear',
    repeat: Infinity,
  },
};

export const gradients = {
  aurora: 'linear-gradient(135deg, #D4AF37 0%, #F4E4A1 50%, #B8941F 100%)',
  plasma: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #06B6D4 100%)',
  hive: 'linear-gradient(135deg, #F59E0B 0%, #FDE047 50%, #EA580C 100%)',
  mythic: 'linear-gradient(135deg, #000000 0%, #111827 50%, #374151 100%)',
  ember: 'linear-gradient(135deg, #DC2626 0%, #EA580C 50%, #F59E0B 100%)',
  void: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
};

export const shadows = {
  glow: {
    aurora: '0 0 20px rgba(212, 175, 55, 0.5)',
    plasma: '0 0 20px rgba(59, 130, 246, 0.5)',
    hive: '0 0 20px rgba(245, 158, 11, 0.5)',
    mythic: '0 0 20px rgba(55, 65, 81, 0.5)',
  },
  ceremonial: {
    soft: '0 4px 16px rgba(0, 0, 0, 0.1)',
    medium: '0 8px 32px rgba(0, 0, 0, 0.15)',
    strong: '0 16px 64px rgba(0, 0, 0, 0.2)',
  },
  plasma: {
    blue: '0 0 40px rgba(30, 64, 175, 0.6)',
    cyan: '0 0 40px rgba(6, 182, 212, 0.6)',
    purple: '0 0 40px rgba(139, 92, 246, 0.6)',
  },
};

export const spacing = {
  hive: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
};

export const typography = {
  mythic: {
    title: {
      fontSize: '3rem',
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    heading: {
      fontSize: '2rem',
      lineHeight: '1.3',
      fontWeight: '600',
      letterSpacing: '-0.015em',
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.875rem',
      lineHeight: '1.4',
      fontWeight: '500',
    },
    label: {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
    },
  },
};