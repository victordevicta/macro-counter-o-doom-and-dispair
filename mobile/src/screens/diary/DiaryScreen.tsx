import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addDays, subDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useDiaryStore } from '../../store/diaryStore';
import { MealSection } from '../../components/diary/MealSection';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { MealType, FoodEntry } from '../../types/diary.types';

interface DiaryScreenProps {
  onAddFood: (mealType: MealType) => void;
}

export const DiaryScreen: React.FC<DiaryScreenProps> = ({ onAddFood }) => {
  const { currentDate, diary, isLoading, setDate, fetchDiary, deleteEntry } = useDiaryStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchDiary(format(currentDate, 'yyyy-MM-dd'));
  }, []);

  const goToDay = (direction: 1 | -1) => {
    const newDate = direction === 1 ? addDays(currentDate, 1) : subDays(currentDate, 1);
    setDate(newDate);
  };

  const isToday = format(currentDate, 'yyyy-MM-dd') === today;

  const totals = diary?.totals;

  const MEAL_TYPES: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  return (
    <LinearGradient
      colors={[Colors.background, '#0A0A14', Colors.background]}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📜 Dark Diary</Text>
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={() => goToDay(-1)} style={styles.navArrow}>
            <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDate(new Date())}
            style={styles.dateChip}
          >
            <Text style={[styles.dateText, isToday && styles.dateTextToday]}>
              {isToday ? 'Today' : format(currentDate, 'EEE, MMM d')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goToDay(1)}
            style={[styles.navArrow, isToday && styles.navArrowDisabled]}
            disabled={isToday}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={isToday ? Colors.textMuted : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchDiary(format(currentDate, 'yyyy-MM-dd'))}
            tintColor={Colors.primaryLight}
          />
        }
      >
        {/* Daily Summary */}
        {totals && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>DAILY TOTALS</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{Math.round(totals.calories)}</Text>
                <Text style={styles.summaryLabel}>kcal</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.protein }]}>
                  {Math.round(totals.proteinG)}
                </Text>
                <Text style={styles.summaryLabel}>Protein (g)</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.carbs }]}>
                  {Math.round(totals.carbsG)}
                </Text>
                <Text style={styles.summaryLabel}>Carbs (g)</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.fat }]}>
                  {Math.round(totals.fatG)}
                </Text>
                <Text style={styles.summaryLabel}>Fat (g)</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Meal Sections */}
        {MEAL_TYPES.map((mealType) => (
          <MealSection
            key={mealType}
            mealType={mealType}
            entries={diary?.meals[mealType] || []}
            onAddFood={onAddFood}
            onDeleteEntry={deleteEntry}
            onEditEntry={(entry: FoodEntry) => {}}
          />
        ))}

        <Text style={styles.footer}>
          "Every morsel inscribed. Every calorie judged."
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingTop: 52, paddingBottom: Spacing.base },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  navArrow: { padding: 8 },
  navArrowDisabled: { opacity: 0.3 },
  dateChip: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textSecondary },
  dateTextToday: { color: Colors.gold },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  summaryCard: { marginBottom: Spacing.base },
  summaryTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  summaryDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  summaryValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
