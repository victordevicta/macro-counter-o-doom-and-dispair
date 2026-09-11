import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { BorderRadius, Shadow } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'bordered' | 'crimson';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 16,
}) => {
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  return (
    <View
      style={[
        styles.base,
        { padding },
        variant === 'elevated' && styles.elevated,
        variant === 'bordered' && styles.bordered,
        variant === 'crimson' && styles.crimson,
        style,
      ]}
    >
      {children}
    </View>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    base: {
      backgroundColor: colors.surfaceCard,
      borderRadius: BorderRadius.lg,
      ...Shadow.md,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      ...Shadow.lg,
    },
    bordered: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    crimson: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primaryDark,
    },
  });
}
