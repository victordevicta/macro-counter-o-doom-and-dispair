import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

type Step = 'body' | 'activity' | 'goal';

const ACTIVITY_VALUES = ['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE'] as const;
const ACTIVITY_EMOJIS: Record<string, string> = {
  SEDENTARY: '🪑',
  LIGHTLY_ACTIVE: '🚶',
  MODERATELY_ACTIVE: '🏃',
  VERY_ACTIVE: '🚴',
  EXTRA_ACTIVE: '🔥',
};

const GOAL_VALUES = ['LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE'] as const;
const GOAL_EMOJIS: Record<string, string> = {
  LOSE_WEIGHT: '⬇️',
  MAINTAIN: '⚖️',
  GAIN_MUSCLE: '💪',
};

export const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation('onboarding');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { refreshProfile, refreshGoals } = useAuthStore();
  const [step, setStep] = useState<Step>('body');
  const [isLoading, setIsLoading] = useState(false);

  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'MALE' | 'FEMALE' | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('SEDENTARY');
  const [goal, setGoal] = useState('MAINTAIN');

  const handleFinish = async () => {
    if (!sex || !age || !weight || !height) {
      Alert.alert(t('alerts.incompleteTitle'), t('alerts.incompleteMessage'));
      return;
    }

    setIsLoading(true);
    try {
      const birthYear = new Date().getFullYear() - parseInt(age);
      const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

      await usersApi.updateProfile({
        sex,
        dateOfBirth,
        currentWeight: parseFloat(weight),
        heightCm: parseFloat(height),
        activityLevel: activityLevel as any,
        goal: goal as any,
      });

      await Promise.all([refreshProfile(), refreshGoals()]);
    } catch (error: any) {
      Alert.alert(t('alerts.failedTitle'), error?.response?.data?.message || t('alerts.failedFallback'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>

        <View style={styles.stepIndicator}>
          {(['body', 'activity', 'goal'] as Step[]).map((s) => (
            <View key={s} style={[styles.stepDot, step === s && styles.stepDotActive]} />
          ))}
        </View>

        {step === 'body' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('body.sectionTitle')}</Text>

            <Text style={styles.sectionLabel}>{t('body.sexLabel')}</Text>
            <View style={styles.sexRow}>
              {(['MALE', 'FEMALE'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sexButton, sex === s && styles.sexButtonActive]}
                  onPress={() => setSex(s)}
                >
                  <Text style={styles.sexEmoji}>{s === 'MALE' ? '♂️' : '♀️'}</Text>
                  <Text style={[styles.sexLabel, sex === s && styles.sexLabelActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label={t('body.ageLabel')}
              placeholder="25"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <Input
              label={t('body.weightLabel')}
              placeholder="75.0"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
            <Input
              label={t('body.heightLabel')}
              placeholder="175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Button
              title={t('nav.next')}
              onPress={() => setStep('activity')}
              fullWidth
              disabled={!sex || !age || !weight || !height}
            />
          </View>
        )}

        {step === 'activity' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('activity.sectionTitle')}</Text>
            {ACTIVITY_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.optionCard, activityLevel === value && styles.optionCardActive]}
                onPress={() => setActivityLevel(value)}
              >
                <Text style={styles.optionEmoji}>{ACTIVITY_EMOJIS[value]}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, activityLevel === value && styles.optionLabelActive]}>
                    {t(`activity.options.${value}.label`)}
                  </Text>
                  <Text style={styles.optionDesc}>{t(`activity.options.${value}.desc`)}</Text>
                </View>
                {activityLevel === value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <View style={styles.navRow}>
              <Button title={t('nav.back')} onPress={() => setStep('body')} variant="outline" style={styles.navButton} />
              <Button title={t('nav.next')} onPress={() => setStep('goal')} style={styles.navButton} />
            </View>
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('goal.sectionTitle')}</Text>
            {GOAL_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.optionCard, goal === value && styles.optionCardActive]}
                onPress={() => setGoal(value)}
              >
                <Text style={styles.optionEmoji}>{GOAL_EMOJIS[value]}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, goal === value && styles.optionLabelActive]}>
                    {t(`goal.options.${value}.label`)}
                  </Text>
                  <Text style={styles.optionDesc}>{t(`goal.options.${value}.desc`)}</Text>
                </View>
                {goal === value && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <View style={styles.navRow}>
              <Button title={t('nav.back')} onPress={() => setStep('activity')} variant="outline" style={styles.navButton} />
              <Button
                title={isLoading ? t('nav.finishing') : t('nav.finish')}
                onPress={handleFinish}
                isLoading={isLoading}
                variant="gold"
                style={styles.navButton}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    content: { padding: Spacing.xl, paddingTop: 60 },
    title: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 24,
    },
    stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
    stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
    stepDotActive: { backgroundColor: colors.primaryLight, width: 24 },
    section: { gap: 16 },
    sectionTitle: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: colors.secondary,
      letterSpacing: 2,
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: 8,
    },
    sectionLabel: {
      fontSize: FontSize.sm,
      fontWeight: '600',
      color: colors.text.secondary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    sexRow: { flexDirection: 'row', gap: 12 },
    sexButton: {
      flex: 1,
      padding: 16,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      gap: 8,
    },
    sexButtonActive: { borderColor: colors.primaryLight, backgroundColor: colors.primaryGlow },
    sexEmoji: { fontSize: 32 },
    sexLabel: { fontSize: FontSize.sm, fontWeight: '700', color: colors.text.secondary },
    sexLabelActive: { color: colors.primaryLight },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.base,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 12,
    },
    optionCardActive: { borderColor: colors.primaryLight, backgroundColor: colors.primaryGlow },
    optionEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
    optionText: { flex: 1 },
    optionLabel: { fontSize: FontSize.base, fontWeight: '700', color: colors.text.secondary },
    optionLabelActive: { color: colors.text.primary },
    optionDesc: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 2 },
    checkmark: { fontSize: FontSize.lg, color: colors.primaryLight, fontWeight: '800' },
    navRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    navButton: { flex: 1 },
  });
}
