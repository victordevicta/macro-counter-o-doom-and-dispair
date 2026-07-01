import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  heavy: 'System',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const Typography = StyleSheet.create({
  heroTitle: {
    fontSize: FontSize['4xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  h1: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  h4: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: FontSize.base,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: FontSize.base,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  small: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: '400',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  number: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  doom: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.primaryLight,
    fontStyle: 'italic',
  },
});
