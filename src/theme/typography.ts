import { Platform } from 'react-native';

// Font families
export const fontFamilies = {
  // Persian/Farsi fonts
  persian: {
    regular: Platform.select({
      ios: 'Vazir',
      android: 'Vazir',
      web: 'Vazir, Tahoma, Arial, sans-serif',
    }),
    medium: Platform.select({
      ios: 'Vazir-Medium',
      android: 'Vazir-Medium',
      web: 'Vazir-Medium, Tahoma, Arial, sans-serif',
    }),
    bold: Platform.select({
      ios: 'Vazir-Bold',
      android: 'Vazir-Bold',
      web: 'Vazir-Bold, Tahoma, Arial, sans-serif',
    }),
  },
  
  // English fonts (modern style)
  english: {
    regular: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      web: 'Inter, system-ui, -apple-system, sans-serif',
    }),
    medium: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto-Medium',
      web: 'Inter-Medium, system-ui, -apple-system, sans-serif',
    }),
    bold: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto-Bold',
      web: 'Inter-Bold, system-ui, -apple-system, sans-serif',
    }),
  },
  
  // Monospace for code/numbers
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'monospace',
    web: 'JetBrains Mono, Consolas, monospace',
  }),
} as const;

// Font sizes (responsive)
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

// Line heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Font weights
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// Typography presets
export const typography = {
  // Headings
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  },
  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  },
  
  // Body text
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  
  // UI text
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  button: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  
} as const;
