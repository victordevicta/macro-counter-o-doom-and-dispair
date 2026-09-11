import React, { useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useDiaryStore } from '../../store/diaryStore';
import { useLanguageStore } from '../../store/languageStore';
import { getDateFnsLocale } from '../../i18n/dateLocale';
import { MealSection } from '../../components/diary/MealSection';
import { Card } from '../../components/ui/Card';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { MealType, FoodEntry } from '../../types/diary.types';

interface DiaryScreenProps {
  onAddFood: (mealType: MealType) => void;
}

export const DiaryScreen: React.FC<DiaryScreenProps> = ({ onAddFood }) => {
  const { t } = useTranslation('diary');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { languageId } = useLanguageStore();
  const dateLocale = getDateFnsLocale(languageId);
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
      colors={colors.gradient as any}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('headerTitle')}</Text>
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={() => goToDay(-1)} style={styles.navArrow}>
            <Ionicons name="chevron-back" size={22} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDate(new Date())}
            style={styles.dateChip}
          >
            <Text style={[styles.dateText, isToday && styles.dateTextToday]}>
              {isToday ? t('today') : format(currentDate, 'EEE, MMM d', { locale: dateLocale })}
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
              color={isToday ? colors.text.muted : colors.text.secondary}
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
            tintColor={colors.primaryLight}
          />
        }
      >
        {/* Daily Summary */}
        {totals && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('dailyTotals')}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{Math.round(totals.calories)}</Text>
                <Text style={styles.summaryLabel}>{t('kcal')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.macros.protein }]}>
                  {Math.round(totals.proteinG)}
                </Text>
                <Text style={styles.summaryLabel}>{t('proteinG')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.macros.carbs }]}>
                  {Math.round(totals.carbsG)}
                </Text>
                <Text style={styles.summaryLabel}>{t('carbsG')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.macros.fat }]}>
                  {Math.round(totals.fatG)}
                </Text>
                <Text style={styles.summaryLabel}>{t('fatG')}</Text>
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
      </ScrollView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    header: { paddingHorizontal: Spacing.base, paddingTop: 52, paddingBottom: Spacing.base },
    headerTitle: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
      marginBottom: 12,
    },
    dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
    navArrow: { padding: 8 },
    navArrowDisabled: { opacity: 0.3 },
    dateChip: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.full,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: { fontSize: FontSize.base, fontWeight: '700', color: colors.text.secondary },
    dateTextToday: { color: colors.secondary },
    scroll: { flex: 1 },
    content: { padding: Spacing.base, paddingBottom: 100 },
    summaryCard: { marginBottom: Spacing.base },
    summaryTitle: {
      fontSize: FontSize.xs,
      fontWeight: '800',
      color: colors.text.muted,
      letterSpacing: 2,
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    summaryRow: { flexDirection: 'row', alignItems: 'center' },
    summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
    summaryDivider: { width: 1, height: 40, backgroundColor: colors.border },
    summaryValue: {
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    summaryLabel: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 2 },
  });
}
