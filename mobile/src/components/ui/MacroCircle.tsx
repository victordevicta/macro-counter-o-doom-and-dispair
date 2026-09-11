import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';

interface MacroCircleProps {
  value: number;
  max: number;
  color: string;
  label: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
}

export const MacroCircle: React.FC<MacroCircleProps> = ({
  value,
  max,
  color,
  label,
  unit = 'g',
  size = 80,
  strokeWidth = 6,
}) => {
  const { t } = useTranslation('common');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - percentage);
  const isOver = value > max;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceElevated}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isOver ? colors.status.errorLight : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={[styles.value, { color: isOver ? colors.status.errorLight : color }]}>
          {Math.round(value)}
        </Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.max}>{t('of')} {Math.round(max)}{unit}</Text>
    </View>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { alignItems: 'center' },
    svg: { position: 'absolute' },
    center: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    value: {
      fontSize: FontSize.md,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    unit: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      marginTop: -2,
    },
    label: {
      marginTop: 86,
      fontSize: FontSize.xs,
      fontWeight: '600',
      color: colors.text.secondary,
      textAlign: 'center',
    },
    max: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      textAlign: 'center',
    },
  });
}
