import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
}

const DOOM_QUOTES_OVER = [
  'The excess corrupts your vessel.',
  'Gluttony shall be your undoing.',
  'The cursor tips into despair.',
];

const DOOM_QUOTES_UNDER = [
  'Protein deficit detected.',
  'Your gains are perishing.',
  'Feed the mortal coil.',
  'The void hungers within.',
];

export const CalorieRing: React.FC<CalorieRingProps> = ({
  consumed,
  goal,
  size = 200,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(consumed / goal, 1.0);
  const strokeDashoffset = circumference * (1 - percentage);
  const remaining = goal - consumed;
  const isOver = consumed > goal;

  const ringColor = isOver
    ? Colors.errorLight
    : percentage > 0.9
      ? Colors.warningLight
      : Colors.primaryLight;

  const quote = isOver
    ? DOOM_QUOTES_OVER[Math.floor(Date.now() / 1000) % DOOM_QUOTES_OVER.length]
    : DOOM_QUOTES_UNDER[Math.floor(Date.now() / 1000) % DOOM_QUOTES_UNDER.length];

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.surfaceElevated}
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
            {isOver ? 'OVER BY' : 'REMAINING'}
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

      <Text style={styles.doomQuote} numberOfLines={2}>
        {quote}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  innerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  calorieNumber: {
    fontSize: FontSize['4xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    lineHeight: 44,
  },
  overColor: { color: Colors.errorLight },
  calorieUnit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  consumed: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  doomQuote: {
    marginTop: 16,
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 200,
  },
});
