import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
}

export const CalorieRing: React.FC<CalorieRingProps> = ({
  consumed,
  goal,
  size = 200,
}) => {
  const { t } = useTranslation('dashboard');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(consumed / goal, 1.0);
  const strokeDashoffset = circumference * (1 - percentage);
  const remaining = goal - consumed;
  const isOver = consumed > goal;

  const ringColor = isOver
    ? colors.status.errorLight
    : percentage > 0.9
      ? colors.status.warningLight
      : colors.primaryLight;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
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
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <View style={[styles.innerContent, { width: size, height: size }]}>
          <Text style={styles.remainingLabel}>
            {isOver ? t('kcalOver') : t('remaining')}
          </Text>
          <Text style={[styles.calorieNumber, isOver && styles.overColor]}>
            {Math.abs(Math.round(remaining))}
          </Text>
          <Text style={styles.calorieUnit}>kcal</Text>
          <Text style={styles.consumed}>
            {Math.round(consumed)} / {Math.round(goal)}
          </Text>
        </View>
      </View>
    </View>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { alignItems: 'center' },
    innerContent: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    remainingLabel: {
      fontSize: FontSize.xs,
      fontWeight: '700',
      color: colors.text.muted,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    calorieNumber: {
      fontSize: FontSize['4xl'],
      fontWeight: '900',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
      lineHeight: 44,
    },
    overColor: { color: colors.status.errorLight },
    calorieUnit: {
      fontSize: FontSize.sm,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    consumed: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      marginTop: 4,
      fontVariant: ['tabular-nums'],
    },
  });
}
