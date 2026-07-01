export const Colors = {
  // Base
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElevated: '#1A1A28',
  surfaceCard: '#16161F',
  border: '#2A1A2A',
  borderLight: '#3A2A3A',

  // Primary - Blood Crimson
  primary: '#8B1A1A',
  primaryLight: '#C62828',
  primaryDark: '#5A0A0A',
  primaryGlow: 'rgba(139, 26, 26, 0.3)',

  // Accent - Medieval Gold
  gold: '#C9A84C',
  goldDim: '#8A6F32',
  goldGlow: 'rgba(201, 168, 76, 0.2)',

  // Secondary - Dark Violet
  violet: '#5A2D6B',
  violetLight: '#8B4DA8',

  // Text
  textPrimary: '#E8D5C4',
  textSecondary: '#9E8575',
  textMuted: '#5A4A3A',
  textOnPrimary: '#F0E8E0',

  // Macro Colors
  protein: '#9B3D9B',
  proteinLight: '#C862C8',
  proteinGlow: 'rgba(155, 61, 155, 0.3)',

  carbs: '#A0522D',
  carbsLight: '#D2703F',
  carbsGlow: 'rgba(160, 82, 45, 0.3)',

  fat: '#B8860B',
  fatLight: '#DAA520',
  fatGlow: 'rgba(184, 134, 11, 0.3)',

  fiber: '#2E8B57',
  fiberLight: '#3CB371',

  // Status
  success: '#2E7D32',
  successLight: '#4CAF50',
  warning: '#E65100',
  warningLight: '#FF7043',
  error: '#8B0000',
  errorLight: '#C62828',
  info: '#1565C0',

  // Water
  water: '#1565C0',
  waterLight: '#1E88E5',

  // Sodium
  sodium: '#FF6F00',
  sodiumLight: '#FFA000',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Gradient stops
  gradientStart: '#0A0A0F',
  gradientMid: '#12121A',
  gradientEnd: '#1A0A0A',

  // White/transparent
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
