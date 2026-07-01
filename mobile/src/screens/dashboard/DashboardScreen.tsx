import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { useDiaryStore } from '../../store/diaryStore';
import { useTheme } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { CalorieRing } from '../../components/dashboard/CalorieRing';
import { MacroSummary } from '../../components/dashboard/MacroSummary';
import { Card } from '../../components/ui/Card';
import { CompanionWidget } from '../../components/companion/CompanionWidget';

interface DashboardScreenProps {
  onNavigateToDiary: () => void;
  onNavigateToSearch: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToDiary,
  onNavigateToSearch,
}) => {
  const { user, profile, goals } = useAuthStore();
  const { diary, isLoading, fetchDiary } = useDiaryStore();
  const theme = useTheme();
  const { colors, messages } = theme;

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchDiary(today);
  }, []);

  const totals = diary?.totals ?? {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    sodiumMg: 0,
  };

  const calorieGoal = goals?.calories ?? 2000;
  const proteinGoal = goals?.proteinG ?? 150;
  const carbsGoal = goals?.carbsG ?? 200;
  const fatGoal = goals?.fatG ?? 65;
  const fiberGoal = goals?.fiberG ?? 25;

  const sodiumPct = goals?.sodiumMg ? (totals.sodiumMg / goals.sodiumMg) * 100 : 0;
  const hasEntries = Object.values(diary?.meals || {}).flat().length > 0;

  const styles = makeStyles(colors);

  return (
    <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
      <StatusBar barStyle={theme.id === 'clean' ? 'dark-content' : 'light-content'} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchDiary(today)}
            tintColor={colors.primaryLight}
            colors={[colors.primaryLight]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>{messages.dashboardTitle}</Text>
            <Text style={styles.username}>
              {profile?.firstName || user?.username || 'Wanderer'}
            </Text>
          </View>
          <View style={[styles.dateChip, { backgroundColor: colors.primaryDark, borderColor: colors.primary }]}>
            <Text style={[styles.dateText, { color: colors.text.onPrimary }]}>
              {format(new Date(), 'MMM d')}
            </Text>
          </View>
        </View>

        {/* Companion Widget */}
        <Card style={styles.companionCard}>
          <CompanionWidget
            caloriesConsumed={totals.calories}
            caloriesGoal={calorieGoal}
            proteinConsumed={totals.proteinG}
            proteinGoal={proteinGoal}
            hasEntries={hasEntries}
          />
        </Card>

        {/* Calorie Ring */}
        <Card style={styles.calorieCard}>
          <CalorieRing consumed={totals.calories} goal={calorieGoal} size={220} />
        </Card>

        {/* Macro Summary */}
        <Card style={styles.macroCard}>
          <Text style={styles.cardTitle}>{messages.macroSectionTitle}</Text>
          <MacroSummary
            protein={{ value: totals.proteinG, goal: proteinGoal }}
            carbs={{ value: totals.carbsG, goal: carbsGoal }}
            fat={{ value: totals.fatG, goal: fatGoal }}
            fiber={{ value: totals.fiberG, goal: fiberGoal }}
          />
        </Card>

        {/* Micronutrients */}
        <Card style={styles.microCard}>
          <Text style={styles.cardTitle}>{messages.microSectionTitle}</Text>
          <View style={styles.microGrid}>
            <View style={styles.microItem}>
              <Text style={styles.microValue}>{Math.round(totals.sodiumMg)}</Text>
              <Text style={styles.microUnit}>mg Sodium</Text>
              {sodiumPct > 100 && (
                <Text style={[styles.microAlert, { color: colors.status.errorLight }]}>
                  ⚠️ Over limit
                </Text>
              )}
            </View>
            <View style={[styles.microDivider, { backgroundColor: colors.border }]} />
            <View style={styles.microItem}>
              <Text style={styles.microValue}>{Math.round(totals.fiberG)}</Text>
              <Text style={styles.microUnit}>g {messages.fiberLabel}</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onNavigateToDiary}
          >
            <Text style={styles.quickActionEmoji}>📜</Text>
            <Text style={[styles.quickActionText, { color: colors.text.secondary }]}>
              {messages.diaryTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onNavigateToSearch}
          >
            <Text style={styles.quickActionEmoji}>🔍</Text>
            <Text style={[styles.quickActionText, { color: colors.text.secondary }]}>
              {messages.addFoodLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Card variant="bordered" style={styles.statsCard}>
          <Text style={styles.cardTitle}>{messages.statsSectionTitle}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Object.values(diary?.meals || {}).flat().length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.muted }]}>Items Logged</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {diary?.remaining?.calories != null
                  ? Math.round(Math.abs(diary.remaining.calories))
                  : '—'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.muted }]}>
                {diary?.remaining?.calories != null && totals.calories > calorieGoal
                  ? 'kcal Over'
                  : messages.remainingLabel.slice(0, 8)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(
                  (totals.proteinG * 4 + totals.carbsG * 4 + totals.fatG * 9) > 0
                    ? (totals.proteinG * 4 /
                        (totals.proteinG * 4 + totals.carbsG * 4 + totals.fatG * 9)) *
                        100
                    : 0
                )}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.text.muted }]}>From Protein</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: 16, paddingTop: 56, paddingBottom: 100 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    screenTitle: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.text.muted,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    username: {
      fontSize: 24,
      fontWeight: '900',
      color: colors.text.primary,
      marginTop: 2,
    },
    dateChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    dateText: { fontSize: 13, fontWeight: '600' },
    companionCard: { marginBottom: 16 },
    calorieCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 20 },
    macroCard: { marginBottom: 16 },
    microCard: { marginBottom: 16 },
    statsCard: { marginBottom: 16 },
    cardTitle: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.secondary ?? colors.primary,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    microGrid: { flexDirection: 'row', alignItems: 'center' },
    microItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
    microDivider: { width: 1, height: 48 },
    microValue: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text.primary,
    },
    microUnit: { fontSize: 10, color: colors.text.muted, marginTop: 2 },
    microAlert: { fontSize: 10, fontStyle: 'italic', marginTop: 4 },
    quickActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    quickAction: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      gap: 8,
    },
    quickActionEmoji: { fontSize: 28 },
    quickActionText: { fontSize: 13, fontWeight: '700' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text.primary,
    },
    statLabel: { fontSize: 10, marginTop: 2 },
  });
}
