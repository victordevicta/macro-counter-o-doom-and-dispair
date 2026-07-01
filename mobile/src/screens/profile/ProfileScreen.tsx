import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

export const ProfileScreen: React.FC = () => {
  const { user, profile, goals, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Flee the Sanctum?',
      '"Are you certain you wish to escape the dark vault? Your progress shall be remembered."',
      [
        { text: 'Stay and Suffer', style: 'cancel' },
        {
          text: 'Flee',
          style: 'destructive',
          onPress: logout,
        },
      ],
    );
  };

  const activityLabels: Record<string, string> = {
    SEDENTARY: 'Sedentary',
    LIGHTLY_ACTIVE: 'Lightly Active',
    MODERATELY_ACTIVE: 'Moderately Active',
    VERY_ACTIVE: 'Very Active',
    EXTRA_ACTIVE: 'Extra Active',
  };

  const goalLabels: Record<string, string> = {
    LOSE_WEIGHT: 'Lose Weight',
    MAINTAIN: 'Maintain',
    GAIN_MUSCLE: 'Gain Muscle',
  };

  return (
    <LinearGradient colors={[Colors.background, '#140A14']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>💀</Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚔️ Cursed Tracker</Text>
          </View>
        </View>

        {/* Body Stats */}
        {profile && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>⚗️ CORPOREAL MEASUREMENTS</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Weight', value: profile.currentWeight ? `${profile.currentWeight} kg` : '—' },
                { label: 'Height', value: profile.heightCm ? `${profile.heightCm} cm` : '—' },
                { label: 'Sex', value: profile.sex || '—' },
                { label: 'Activity', value: activityLabels[profile.activityLevel] || '—' },
                { label: 'Goal', value: goalLabels[profile.goal] || '—' },
              ].map((stat) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Nutritional Goals */}
        {goals && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>🎯 NUTRITIONAL DECREE</Text>
            <View style={styles.goalsGrid}>
              {[
                { label: 'Calories', value: goals.calories, unit: 'kcal', color: Colors.textPrimary },
                { label: 'Protein', value: goals.proteinG, unit: 'g', color: Colors.protein },
                { label: 'Carbs', value: goals.carbsG, unit: 'g', color: Colors.carbs },
                { label: 'Fat', value: goals.fatG, unit: 'g', color: Colors.fat },
                { label: 'Fiber', value: goals.fiberG, unit: 'g', color: Colors.fiber },
                { label: 'Sodium', value: goals.sodiumMg, unit: 'mg', color: Colors.sodium },
              ].map((g) => (
                <View key={g.label} style={styles.goalItem}>
                  <Text style={[styles.goalValue, { color: g.color }]}>
                    {Math.round(g.value)}
                    <Text style={styles.goalUnit}>{g.unit}</Text>
                  </Text>
                  <Text style={styles.goalLabel}>{g.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* About */}
        <Card variant="bordered" style={styles.card}>
          <Text style={styles.cardTitle}>🩸 ABOUT THE DARK APP</Text>
          <Text style={styles.aboutText}>
            Macro Counter O' Doom and Dispair{'\n'}
            "Where your macros meet their judgment."
          </Text>
          <Text style={styles.version}>Version 1.0.0 — The Cursed Release</Text>
        </Card>

        <Button
          title="FLEE THE SANCTUM"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
        />

        <Text style={styles.footer}>
          "All gains shall be accounted for. All deficits shall be mourned."
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { padding: Spacing.base, paddingTop: 56, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryDark,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 52 },
  username: {
    fontSize: FontSize['2xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  email: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  badge: {
    marginTop: 10,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: { fontSize: FontSize.sm, color: Colors.primaryLight, fontWeight: '700' },
  card: { marginBottom: Spacing.base },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.base,
  },
  statsGrid: { gap: 8 },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  statValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalItem: { width: '30%', alignItems: 'center', paddingVertical: 8 },
  goalValue: { fontSize: FontSize.lg, fontWeight: '800', fontVariant: ['tabular-nums'] },
  goalUnit: { fontSize: FontSize.xs, fontWeight: '400' },
  goalLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  aboutText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  version: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 8 },
  logoutButton: { marginTop: 8 },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 24,
  },
});
