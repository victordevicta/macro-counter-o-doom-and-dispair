import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { BorderRadius } from '../../theme/spacing';
import { FontSize } from '../../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth,
}) => {
  const colors = useThemeColors();
  const styles = makeStyles(colors);

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const isDisabled = disabled || isLoading;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 20 },
    lg: { paddingVertical: 18, paddingHorizontal: 28 },
  };

  const textSizes = {
    sm: FontSize.sm,
    md: FontSize.base,
    lg: FontSize.lg,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.touchable, fullWidth && styles.fullWidth, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? [colors.border, colors.borderLight] : [colors.primaryLight, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles[size], styles.row]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.onPrimary} size="small" />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text style={[styles.text, { fontSize: textSizes[size] }, styles.textPrimary, textStyle]}>
                {title}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'gold') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        style={[styles.touchable, fullWidth && styles.fullWidth, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? [colors.border, colors.borderLight] : [colors.secondaryLight, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles[size], styles.row]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text style={[styles.text, { fontSize: textSizes[size] }, styles.textDark, textStyle]}>
                {title}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.base,
        sizeStyles[size],
        styles.row,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text.primary} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: textSizes[size] },
              variant === 'outline' && styles.textOutline,
              variant === 'ghost' && styles.textGhost,
              variant === 'danger' && styles.textDanger,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    touchable: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
    gradient: { borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
    base: { borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
    row: { flexDirection: 'row' },
    fullWidth: { width: '100%' },
    secondary: { backgroundColor: colors.surfaceElevated },
    outline: { borderWidth: 1.5, borderColor: colors.primaryLight, backgroundColor: 'transparent' },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.status.error },
    disabled: { opacity: 0.5 },
    text: { fontWeight: '700', color: colors.text.primary, letterSpacing: 0.3 },
    textPrimary: { color: colors.text.onPrimary },
    textDark: { color: colors.background },
    textOutline: { color: colors.primaryLight },
    textGhost: { color: colors.text.secondary },
    textDanger: { color: colors.status.errorLight },
    iconLeft: { marginRight: 8 },
    iconRight: { marginLeft: 8 },
  });
}
