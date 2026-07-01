import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { ProgressBar } from '../ui/ProgressBar';
import { FontSize } from '../../theme/typography';

interface MacroSummaryProps {
  protein: { value: number; goal: number };
  carbs: { value: number; goal: number };
  fat: { value: number; goal: number };
  fiber?: { value: number; goal: number };
}

export const MacroSummary: React.FC<MacroSummaryProps> = ({
  protein,
  carbs,
  fat,
  fiber,
}) => {
  const macros = [
    {
      key: 'protein',
      label: 'Protein',
      doomLabel: 'PROTEIN',
      value: protein.value,
      goal: protein.goal,
      color: Colors.protein,
      unit: 'g',
    },
    {
      key: 'carbs',
      label: 'Carbs',
      doomLabel: 'CARBS',
      value: carbs.value,
      goal: carbs.goal,
      color: Colors.carbs,
      unit: 'g',
    },
    {
      key: 'fat',
      label: 'Fat',
      doomLabel: 'FAT',
      value: fat.value,
      goal: fat.goal,
      color: Colors.fat,
      unit: 'g',
    },
    ...(fiber
      ? [
          {
            key: 'fiber',
            label: 'Fiber',
            doomLabel: 'FIBER',
            value: fiber.value,
            goal: fiber.goal,
            color: Colors.fiber,
            unit: 'g',
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      {macros.map((macro) => {
        const pct = Math.min((macro.value / macro.goal) * 100, 100);
        const isOver = macro.value > macro.goal;
        return (
          <View key={macro.key} style={styles.macroRow}>
            <View style={styles.macroHeader}>
              <View style={styles.macroLeft}>
                <View style={[styles.dot, { backgroundColor: macro.color }]} />
                <Text style={styles.macroLabel}>{macro.doomLabel}</Text>
              </View>
              <Text style={[styles.macroValue, isOver && { color: Colors.errorLight }]}>
                {Math.round(macro.value)}
                <Text style={styles.macroGoal}>/{Math.round(macro.goal)}{macro.unit}</Text>
              </Text>
            </View>
            <ProgressBar
              value={macro.value}
              max={macro.goal}
              color={macro.color}
              height={6}
              animated
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 14 },
  macroRow: { gap: 6 },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  macroLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  macroValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  macroGoal: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '400',
  },
});
