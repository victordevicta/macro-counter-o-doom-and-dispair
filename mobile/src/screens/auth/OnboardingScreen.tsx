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
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

type Step = 'body' | 'activity' | 'goal';

const ACTIVITY_OPTIONS = [
  { value: 'SEDENTARY', label: 'Sedentary', desc: 'Little or no exercise', emoji: '🪑' },
  { value: 'LIGHTLY_ACTIVE', label: 'Lightly Active', desc: '1-3 days/week', emoji: '🚶' },
  { value: 'MODERATELY_ACTIVE', label: 'Moderately Active', desc: '3-5 days/week', emoji: '🏃' },
  { value: 'VERY_ACTIVE', label: 'Very Active', desc: '6-7 days/week', emoji: '⚔️' },
  { value: 'EXTRA_ACTIVE', label: 'Extra Active', desc: 'Twice daily', emoji: '🔥' },
];

const GOAL_OPTIONS = [
  { value: 'LOSE_WEIGHT', label: 'Lose Weight', desc: 'Shed the mortal burden', emoji: '⬇️' },
  { value: 'MAINTAIN', label: 'Maintain', desc: 'Hold the cursed form', emoji: '⚖️' },
  { value: 'GAIN_MUSCLE', label: 'Gain Muscle', desc: 'Forge a greater vessel', emoji: '💪' },
];

export const OnboardingScreen: React.FC = () => {
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
      Alert.alert('Incomplete', 'The dark registry requires all corporeal measurements.');
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
      Alert.alert('Ritual Failed', error?.response?.data?.message || 'The dark ritual failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, '#150A15']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.skull}>🏺</Text>
        <Text style={styles.title}>The Ritual of Calibration</Text>
        <Text style={styles.subtitle}>
          "Offer your measurements to the dark oracle. Your destiny shall be calculated."
        </Text>

        <View style={styles.stepIndicator}>
          {(['body', 'activity', 'goal'] as Step[]).map((s, i) => (
            <View key={s} style={[styles.stepDot, step === s && styles.stepDotActive]} />
          ))}
        </View>

        {step === 'body' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚗️ CORPOREAL MEASUREMENTS</Text>

            <Text style={styles.sectionLabel}>Sex</Text>
            <View style={styles.sexRow}>
              {(['MALE', 'FEMALE'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sexButton, sex === s && styles.sexButtonActive]}
                  onPress={() => setSex(s)}
                >
                  <Text style={styles.sexEmoji}>{s === 'MALE' ? '⚔️' : '🌙'}</Text>
                  <Text style={[styles.sexLabel, sex === s && styles.sexLabelActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Age (years)"
              placeholder="25"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <Input
              label="Weight (kg)"
              placeholder="75.0"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
            <Input
              label="Height (cm)"
              placeholder="175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Button
              title="NEXT →"
              onPress={() => setStep('activity')}
              fullWidth
              disabled={!sex || !age || !weight || !height}
            />
          </View>
        )}

        {step === 'activity' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ ACTIVITY LEVEL</Text>
            {ACTIVITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, activityLevel === opt.value && styles.optionCardActive]}
                onPress={() => setActivityLevel(opt.value)}
              >
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, activityLevel === opt.value && styles.optionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                {activityLevel === opt.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <View style={styles.navRow}>
              <Button title="← BACK" onPress={() => setStep('body')} variant="outline" style={styles.navButton} />
              <Button title="NEXT →" onPress={() => setStep('goal')} style={styles.navButton} />
            </View>
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 YOUR DARK OBJECTIVE</Text>
            {GOAL_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, goal === opt.value && styles.optionCardActive]}
                onPress={() => setGoal(opt.value)}
              >
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, goal === opt.value && styles.optionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                {goal === opt.value && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <View style={styles.navRow}>
              <Button title="← BACK" onPress={() => setStep('activity')} variant="outline" style={styles.navButton} />
              <Button
                title={isLoading ? 'Calculating...' : 'SEAL THE PACT'}
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

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { padding: Spacing.xl, paddingTop: 60 },
  skull: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primaryLight, width: 24 },
  section: { gap: 16 },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sexRow: { flexDirection: 'row', gap: 12 },
  sexButton: {
    flex: 1,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    gap: 8,
  },
  sexButtonActive: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryGlow },
  sexEmoji: { fontSize: 32 },
  sexLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  sexLabelActive: { color: Colors.primaryLight },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  optionCardActive: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryGlow },
  optionEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  optionText: { flex: 1 },
  optionLabel: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textSecondary },
  optionLabelActive: { color: Colors.textPrimary },
  optionDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  checkmark: { fontSize: FontSize.lg, color: Colors.primaryLight, fontWeight: '800' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  navButton: { flex: 1 },
});
