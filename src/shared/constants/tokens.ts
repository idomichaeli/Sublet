// Design Tokens - Professional Renting App Style Guide
// Based on modern mobile UI/UX best practices

export const colors = {
  // Primary Colors - Nature Green
  primary: {
    50: '#F0F9F0',
    100: '#DCF2DC',
    200: '#B8E5B8',
    300: '#94D894',
    400: '#70CB70',
    500: '#4CAF50', // Main primary color - Nature Green
    600: '#3D8B40',
    700: '#2E7D32',
    800: '#1F5F23',
    900: '#0F3F14',
  },
  
  // Secondary Colors - Nature Yellow
  secondary: {
    50: '#FFFEF0',
    100: '#FFFCDB',
    200: '#FFF9B7',
    300: '#FFF693',
    400: '#FFF36F',
    500: '#FFEB3B', // Main secondary color - Nature Yellow
    600: '#FBC02D',
    700: '#F9A825',
    800: '#F57F17',
    900: '#F57C00',
  },
  
  // Neutral Colors
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Status Colors
  success: {
    50: '#F0F9F0',
    100: '#DCF2DC',
    200: '#B8E5B8',
    300: '#94D894',
    400: '#70CB70',
    500: '#4CAF50', // Nature Green
    600: '#3D8B40',
    700: '#2E7D32',
    800: '#1F5F23',
    900: '#0F3F14',
  },
  
  warning: {
    50: '#FFFEF0',
    100: '#FFFCDB',
    200: '#FFF9B7',
    300: '#FFF693',
    400: '#FFF36F',
    500: '#FFEB3B', // Nature Yellow
    600: '#FBC02D',
    700: '#F9A825',
    800: '#F57F17',
    900: '#F57C00',
  },
  
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  
  // Dark Mode Colors
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B3B3B3',
  },
} as const;

export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Text Styles
export const textStyles = {
  h1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  h2: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semiBold,
  },
  h3: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
  },
  caption: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  button: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.tight * typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
} as const;

// Component Variants
export const buttonVariants = {
  primary: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    textColor: colors.neutral[0],
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.primary[500],
    textColor: colors.primary[500],
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: colors.primary[500],
  },
  success: {
    backgroundColor: colors.success[500],
    borderColor: colors.success[500],
    textColor: colors.neutral[0],
  },
  warning: {
    backgroundColor: colors.warning[500],
    borderColor: colors.warning[500],
    textColor: colors.neutral[0],
  },
  error: {
    backgroundColor: colors.error[500],
    borderColor: colors.error[500],
    textColor: colors.neutral[0],
  },
} as const;

export const statusColors = {
  approved: colors.success[500], // Nature Green
  pending: colors.warning[500],  // Nature Yellow
  rejected: colors.error[500],
  available: colors.success[500], // Nature Green
  unavailable: colors.neutral[400],
} as const;

// Opacity variants for colors
export const colorOpacity = {
  // 10% opacity
  '10': '1A',
  // 20% opacity  
  '20': '33',
  // 30% opacity
  '30': '4D',
  // 40% opacity
  '40': '66',
  // 50% opacity
  '50': '80',
  // 60% opacity
  '60': '99',
  // 70% opacity
  '70': 'B3',
  // 80% opacity
  '80': 'CC',
  // 90% opacity
  '90': 'E6',
} as const;

// Helper function to create colors with opacity
export const withOpacity = (color: string, opacity: keyof typeof colorOpacity): string => {
  return color + colorOpacity[opacity];
};

// Liquid Glass Design Tokens
export const liquidGlass = {
  background: withOpacity(colors.neutral[0], '10'),
  backgroundDark: withOpacity(colors.neutral[900], '10'),
  border: withOpacity(colors.neutral[0], '20'),
  borderDark: withOpacity(colors.neutral[0], '10'),
  shadow: {
    color: withOpacity(colors.neutral[900], '10'),
    offset: { width: 0, height: 8 },
    opacity: 0.3,
    radius: 24,
    elevation: 8,
  },
  backdrop: {
    blur: 20,
    saturation: 1.2,
  },
} as const;
