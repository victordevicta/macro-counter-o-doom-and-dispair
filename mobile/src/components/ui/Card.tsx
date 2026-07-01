import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
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

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadow.lg,
  },
  bordered: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  crimson: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
});
