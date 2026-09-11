import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { BorderRadius } from '../../theme/spacing';
import { FontSize } from '../../theme/typography';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  containerStyle?: ViewStyle;
  onRightIconPress?: () => void;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  multiline,
  numberOfLines,
  editable = true,
  containerStyle,
  onRightIconPress,
  hint,
}) => {
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focused,
          error && styles.errorBorder,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
            multiline && styles.multiline,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          selectionColor={colors.primaryLight}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
      fontSize: FontSize.sm,
      fontWeight: '600',
      color: colors.text.secondary,
      marginBottom: 6,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      minHeight: 52,
    },
    focused: { borderColor: colors.primaryLight, borderWidth: 1.5 },
    errorBorder: { borderColor: colors.status.errorLight },
    disabled: { opacity: 0.6 },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: FontSize.base,
      color: colors.text.primary,
    },
    inputWithLeft: { paddingLeft: 8 },
    inputWithRight: { paddingRight: 8 },
    multiline: { paddingTop: 14, textAlignVertical: 'top' },
    leftIcon: { paddingLeft: 12 },
    rightIcon: { paddingRight: 12 },
    error: {
      fontSize: FontSize.xs,
      color: colors.status.errorLight,
      marginTop: 4,
    },
    hint: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      marginTop: 4,
    },
  });
}
