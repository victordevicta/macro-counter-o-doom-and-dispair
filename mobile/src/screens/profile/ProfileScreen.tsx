import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation('profile');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { user, profile, goals, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      t('logoutConfirm.title'),
      t('logoutConfirm.message'),
      [
        { text: t('logoutConfirm.cancelButton'), style: 'cancel' },
        {
          text: t('logoutConfirm.confirmButton'),
          style: 'destructive',
          onPress: logout,
        },
      ],
    );
  };

  const activityLabels: Record<string, string> = t('activityLabels', { returnObjects: true }) as any;
  const goalLabels: Record<string, string> = t('goalLabels', { returnObjects: true }) as any;

  return (
    <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('badge')}</Text>
          </View>
        </View>

        {/* Body Stats */}
        {profile && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{t('bodyStats.sectionTitle')}</Text>
            <View style={styles.statsGrid}>
              {[
                { label: t('bodyStats.weight'), value: profile.currentWeight ? `${profile.currentWeight} kg` : '—' },
                { label: t('bodyStats.height'), value: profile.heightCm ? `${profile.heightCm} cm` : '—' },
                { label: t('bodyStats.sex'), value: profile.sex || '—' },
                { label: t('bodyStats.activity'), value: activityLabels[profile.activityLevel] || '—' },
                { label: t('bodyStats.goal'), value: goalLabels[profile.goal] || '—' },
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
            <Text style={styles.cardTitle}>{t('goalsSection.sectionTitle')}</Text>
            <View style={styles.goalsGrid}>
              {[
                { label: t('goalsSection.calories'), value: goals.calories, unit: 'kcal', color: colors.text.primary },
                { label: t('goalsSection.protein'), value: goals.proteinG, unit: 'g', color: colors.macros.protein },
                { label: t('goalsSection.carbs'), value: goals.carbsG, unit: 'g', color: colors.macros.carbs },
                { label: t('goalsSection.fat'), value: goals.fatG, unit: 'g', color: colors.macros.fat },
                { label: t('goalsSection.fiber'), value: goals.fiberG, unit: 'g', color: colors.macros.fiber },
                { label: t('goalsSection.sodium'), value: goals.sodiumMg, unit: 'mg', color: colors.sodium ?? colors.macros.calories },
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
          <Text style={styles.cardTitle}>{t('about.sectionTitle')}</Text>
          <Text style={styles.aboutText}>
            {t('about.appName')}{'\n'}
            {t('about.tagline')}
          </Text>
          <Text style={styles.version}>{t('about.version')}</Text>
        </Card>

        <Button
          title={t('logoutButton')}
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
        />
      </ScrollView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    content: { padding: Spacing.base, paddingTop: 56, paddingBottom: 100 },
    avatarSection: { alignItems: 'center', marginBottom: 28 },
    avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primaryDark,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarEmoji: { fontSize: 52 },
    username: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
    },
    email: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      marginTop: 4,
    },
    badge: {
      marginTop: 10,
      backgroundColor: colors.primaryDark,
      borderRadius: BorderRadius.full,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    badgeText: { fontSize: FontSize.sm, color: colors.primaryLight, fontWeight: '700' },
    card: { marginBottom: Spacing.base },
    cardTitle: {
      fontSize: FontSize.xs,
      fontWeight: '800',
      color: colors.secondary,
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
      borderBottomColor: colors.border,
    },
    statLabel: { fontSize: FontSize.sm, color: colors.text.muted },
    statValue: { fontSize: FontSize.sm, fontWeight: '700', color: colors.text.primary },
    goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    goalItem: { width: '30%', alignItems: 'center', paddingVertical: 8 },
    goalValue: { fontSize: FontSize.lg, fontWeight: '800', fontVariant: ['tabular-nums'] },
    goalUnit: { fontSize: FontSize.xs, fontWeight: '400' },
    goalLabel: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 2 },
    aboutText: {
      fontSize: FontSize.sm,
      color: colors.text.secondary,
      lineHeight: 22,
    },
    version: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 8 },
    logoutButton: { marginTop: 8 },
  });
}
