import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemeMessages } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { FoodEntry, MealType } from '../../types/diary.types';
import { FoodEntryItem } from './FoodEntryItem';

const MEAL_ICONS: Record<MealType, string> = {
  BREAKFAST: '🌅',
  LUNCH: '🍽️',
  DINNER: '🍖',
  SNACK: '🍎',
};

interface MealSectionProps {
  mealType: MealType;
  entries: FoodEntry[];
  onAddFood: (mealType: MealType) => void;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: FoodEntry) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  mealType,
  entries,
  onAddFood,
  onDeleteEntry,
  onEditEntry,
}) => {
  const { t } = useTranslation('diary');
  const colors = useThemeColors();
  const messages = useThemeMessages();
  const styles = makeStyles(colors);
  const [expanded, setExpanded] = useState(true);

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = entries.reduce((sum, e) => sum + e.proteinG, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbsG, 0);
  const totalFat = entries.reduce((sum, e) => sum + e.fatG, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{MEAL_ICONS[mealType]}</Text>
          <View>
            <Text style={styles.mealName}>{messages.mealNames[mealType]}</Text>
            {entries.length > 0 && (
              <Text style={styles.mealMeta}>
                {t('mealSection.item', { count: entries.length })} •{' '}
                <Text style={styles.calories}>{Math.round(totalCalories)} {t('kcal')}</Text>
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddFood(mealType)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add-circle" size={28} color={colors.primaryLight} />
          </TouchableOpacity>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.text.muted}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <>
          {entries.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyState}
              onPress={() => onAddFood(mealType)}
            >
              <Text style={styles.emptyText}>{t('mealSection.addPrompt')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.entriesContainer}>
              {entries.map((entry) => (
                <FoodEntryItem
                  key={entry.id}
                  entry={entry}
                  onDelete={() => onDeleteEntry(entry.id)}
                  onEdit={() => onEditEntry(entry)}
                />
              ))}
              {entries.length > 0 && (
                <View style={styles.mealTotals}>
                  <Text style={styles.totalLabel}>{t('mealSection.mealTotal')}</Text>
                  <View style={styles.macroRow}>
                    <Text style={[styles.macroText, { color: colors.macros.protein }]}>
                      P: {Math.round(totalProtein)}g
                    </Text>
                    <Text style={[styles.macroText, { color: colors.macros.carbs }]}>
                      C: {Math.round(totalCarbs)}g
                    </Text>
                    <Text style={[styles.macroText, { color: colors.macros.fat }]}>
                      F: {Math.round(totalFat)}g
                    </Text>
                    <Text style={[styles.macroText, { color: colors.text.primary }]}>
                      {Math.round(totalCalories)} {t('kcal')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.base,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    icon: { fontSize: 24 },
    mealName: {
      fontSize: FontSize.base,
      fontWeight: '700',
      color: colors.text.primary,
    },
    mealMeta: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      marginTop: 2,
    },
    calories: { color: colors.secondary },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    addButton: { padding: 2 },
    emptyState: {
      padding: Spacing.base,
      paddingTop: 0,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      fontStyle: 'italic',
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: BorderRadius.md,
      width: '100%',
      textAlign: 'center',
    },
    entriesContainer: {},
    mealTotals: {
      padding: Spacing.base,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    macroRow: { flexDirection: 'row', gap: 10 },
    macroText: { fontSize: FontSize.xs, fontWeight: '700' },
  });
}
