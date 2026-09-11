import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useTheme';
import { ProgressBar } from '../ui/ProgressBar';
import { ThemeColors } from '../../themes/types';
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
  const { t } = useTranslation('common');
  const colors = useThemeColors();
  const styles = makeStyles(colors);

  const macros = [
    {
      key: 'protein',
      label: t('macros.protein'),
      value: protein.value,
      goal: protein.goal,
      color: colors.macros.protein,
      unit: 'g',
    },
    {
      key: 'carbs',
      label: t('macros.carbs'),
      value: carbs.value,
      goal: carbs.goal,
      color: colors.macros.carbs,
      unit: 'g',
    },
    {
      key: 'fat',
      label: t('macros.fat'),
      value: fat.value,
      goal: fat.goal,
      color: colors.macros.fat,
      unit: 'g',
    },
    ...(fiber
      ? [
          {
            key: 'fiber',
            label: t('macros.fiber'),
            value: fiber.value,
            goal: fiber.goal,
            color: colors.macros.fiber,
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
                <Text style={styles.macroLabel}>{macro.label}</Text>
              </View>
              <Text style={[styles.macroValue, isOver && { color: colors.status.errorLight }]}>
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

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
      color: colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    macroValue: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    macroGoal: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      fontWeight: '400',
    },
  });
}
