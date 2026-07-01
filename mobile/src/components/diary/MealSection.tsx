import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { FoodEntry, MealType, MEAL_LABELS, MEAL_ICONS } from '../../types/diary.types';
import { FoodEntryItem } from './FoodEntryItem';

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
            <Text style={styles.mealName}>{MEAL_LABELS[mealType]}</Text>
            {entries.length > 0 && (
              <Text style={styles.mealMeta}>
                {entries.length} item{entries.length !== 1 ? 's' : ''} •{' '}
                <Text style={styles.calories}>{Math.round(totalCalories)} kcal</Text>
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
            <Ionicons name="add-circle" size={28} color={Colors.primaryLight} />
          </TouchableOpacity>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textMuted}
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
              <Text style={styles.emptyText}>+ Add sustenance to the record</Text>
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
                  <Text style={styles.totalLabel}>Meal Total</Text>
                  <View style={styles.macroRow}>
                    <Text style={[styles.macroText, { color: Colors.protein }]}>
                      P: {Math.round(totalProtein)}g
                    </Text>
                    <Text style={[styles.macroText, { color: Colors.carbs }]}>
                      C: {Math.round(totalCarbs)}g
                    </Text>
                    <Text style={[styles.macroText, { color: Colors.fat }]}>
                      F: {Math.round(totalFat)}g
                    </Text>
                    <Text style={[styles.macroText, { color: Colors.textPrimary }]}>
                      {Math.round(totalCalories)} kcal
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  mealMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  calories: { color: Colors.gold },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addButton: { padding: 2 },
  emptyState: {
    padding: Spacing.base,
    paddingTop: 0,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    width: '100%',
    textAlign: 'center',
  },
  entriesContainer: {},
  mealTotals: {
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  macroRow: { flexDirection: 'row', gap: 10 },
  macroText: { fontSize: FontSize.xs, fontWeight: '700' },
});
