import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useDiaryStore } from '../../store/diaryStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useThemeColors, useThemeMessages } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Food } from '../../types/food.types';
import { MealType } from '../../types/diary.types';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

interface AddFoodScreenProps {
  food: Food;
  mealType: MealType;
  onDone: () => void;
  onBack: () => void;
}

export const AddFoodScreen: React.FC<AddFoodScreenProps> = ({
  food,
  mealType,
  onDone,
  onBack,
}) => {
  const { t } = useTranslation('addFood');
  const colors = useThemeColors();
  const messages = useThemeMessages();
  const styles = makeStyles(colors);
  const mealName = messages.mealNames[mealType];
  const { addEntry } = useDiaryStore();
  const { goals } = useAuthStore();
  const [servings, setServings] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const numServings = parseFloat(servings) || 1;
  const ratio = numServings;

  const calculated = {
    calories: food.calories * ratio,
    proteinG: food.proteinG * ratio,
    carbsG: food.carbsG * ratio,
    fatG: food.fatG * ratio,
    fiberG: (food.fiberG || 0) * ratio,
    sodiumMg: (food.sodiumMg || 0) * ratio,
  };

  const adjustServings = (delta: number) => {
    const current = parseFloat(servings) || 1;
    const next = Math.max(0.25, current + delta);
    setServings(next % 1 === 0 ? String(next) : next.toFixed(2));
  };

  const handleAdd = async () => {
    const s = parseFloat(servings);
    if (!s || s <= 0) {
      Alert.alert(t('alerts.invalidTitle'), t('alerts.invalidMessage'));
      return;
    }

    setIsLoading(true);
    try {
      await addEntry({
        foodId: food.id,
        mealType,
        servings: s,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
      });
      onDone();
    } catch (error: any) {
      Alert.alert(t('alerts.failedTitle'), error?.response?.data?.message || t('alerts.failedFallback'));
    } finally {
      setIsLoading(false);
    }
  };

  const nutrientRows = [
    { label: t('nutrition.protein'), value: calculated.proteinG, unit: 'g', color: colors.macros.protein, goal: goals?.proteinG },
    { label: t('nutrition.carbs'), value: calculated.carbsG, unit: 'g', color: colors.macros.carbs, goal: goals?.carbsG },
    { label: t('nutrition.fat'), value: calculated.fatG, unit: 'g', color: colors.macros.fat, goal: goals?.fatG },
    { label: t('nutrition.fiber'), value: calculated.fiberG, unit: 'g', color: colors.macros.fiber, goal: goals?.fiberG },
    { label: t('nutrition.sodium'), value: calculated.sodiumMg, unit: 'mg', color: colors.sodium ?? colors.macros.calories, goal: goals?.sodiumMg },
  ];

  return (
    <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('headerTitle', { meal: mealName })}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Food Header */}
        <Card style={styles.foodCard}>
          <View style={styles.foodHeader}>
            {food.imageUrl ? (
              <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
            ) : (
              <View style={styles.foodImagePlaceholder}>
                <Text style={{ fontSize: 36 }}>🍽️</Text>
              </View>
            )}
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
              <Text style={styles.servingInfo}>
                {t('servingPer', { size: food.servingSize, unit: food.servingUnit })}
                {food.servingName ? ` (${food.servingName})` : ''}
              </Text>
            </View>
          </View>
        </Card>

        {/* Serving Control */}
        <Card style={styles.servingCard}>
          <Text style={styles.sectionTitle}>{t('portion.sectionTitle')}</Text>
          <View style={styles.servingControl}>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => adjustServings(-0.5)}
            >
              <Text style={styles.servingBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.servingInputWrapper}>
              <Input
                value={servings}
                onChangeText={setServings}
                keyboardType="decimal-pad"
                containerStyle={styles.servingInput}
              />
              <Text style={styles.servingUnit}>× {food.servingSize}{food.servingUnit}</Text>
            </View>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => adjustServings(0.5)}
            >
              <Text style={styles.servingBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Quick portion buttons */}
          <View style={styles.quickPortions}>
            {[0.5, 1, 1.5, 2].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.portionChip, parseFloat(servings) === s && styles.portionChipActive]}
                onPress={() => setServings(String(s))}
              >
                <Text style={[styles.portionText, parseFloat(servings) === s && styles.portionTextActive]}>
                  {s}×
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Calorie Preview */}
        <Card style={styles.calorieCard}>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieLabel}>{t('totalCalories')}</Text>
            <Text style={styles.calorieValue}>{Math.round(calculated.calories)}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
          {goals?.calories && (
            <Text style={styles.caloriePercent}>
              {t('percentOfDaily', { percent: Math.round((calculated.calories / goals.calories) * 100) })}
            </Text>
          )}
        </Card>

        {/* Nutrition Facts */}
        <Card style={styles.nutritionCard}>
          <Text style={styles.sectionTitle}>{t('nutrition.sectionTitle')}</Text>
          {nutrientRows.map((n) => (
            <View key={n.label} style={styles.nutrientRow}>
              <View style={styles.nutrientLeft}>
                <View style={[styles.nutrientDot, { backgroundColor: n.color }]} />
                <Text style={styles.nutrientLabel}>{n.label}</Text>
              </View>
              <Text style={[styles.nutrientValue, { color: n.color }]}>
                {n.value > 0 ? `${Math.round(n.value)}${n.unit}` : '—'}
              </Text>
            </View>
          ))}
        </Card>

        <Button
          title={isLoading ? t('addingButton') : t('addButton', { meal: mealName.toUpperCase() })}
          onPress={handleAdd}
          isLoading={isLoading}
          fullWidth
          variant="gold"
          style={styles.addButton}
        />
      </ScrollView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      paddingTop: 52,
      paddingBottom: Spacing.sm,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: FontSize.base, fontWeight: '700', color: colors.text.primary },
    content: { padding: Spacing.base, paddingBottom: 100 },
    foodCard: { marginBottom: Spacing.base },
    foodHeader: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    foodImage: { width: 64, height: 64, borderRadius: BorderRadius.md },
    foodImagePlaceholder: {
      width: 64,
      height: 64,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    foodInfo: { flex: 1 },
    foodName: { fontSize: FontSize.base, fontWeight: '800', color: colors.text.primary },
    foodBrand: { fontSize: FontSize.sm, color: colors.secondary, marginTop: 2 },
    servingInfo: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 4 },
    servingCard: { marginBottom: Spacing.base },
    sectionTitle: {
      fontSize: FontSize.xs,
      fontWeight: '800',
      color: colors.secondary,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: Spacing.base,
    },
    servingControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    servingBtn: {
      width: 44,
      height: 44,
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    servingBtnText: { fontSize: FontSize.xl, fontWeight: '800', color: colors.text.onPrimary },
    servingInputWrapper: { flex: 1, alignItems: 'center' },
    servingInput: { marginBottom: 0, width: '100%' },
    servingUnit: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 4 },
    quickPortions: { flexDirection: 'row', gap: 8, marginTop: Spacing.sm },
    portionChip: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    portionChipActive: { borderColor: colors.primaryLight, backgroundColor: colors.primaryGlow },
    portionText: { fontSize: FontSize.sm, fontWeight: '700', color: colors.text.muted },
    portionTextActive: { color: colors.primaryLight },
    calorieCard: { marginBottom: Spacing.base, alignItems: 'center' },
    calorieRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    calorieLabel: { fontSize: FontSize.xs, color: colors.text.muted, letterSpacing: 2 },
    calorieValue: {
      fontSize: FontSize['4xl'],
      fontWeight: '900',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    calorieUnit: { fontSize: FontSize.sm, color: colors.text.secondary },
    caloriePercent: { fontSize: FontSize.xs, color: colors.text.muted, fontStyle: 'italic', marginTop: 4 },
    nutritionCard: { marginBottom: Spacing.base },
    nutrientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    nutrientLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    nutrientDot: { width: 10, height: 10, borderRadius: 5 },
    nutrientLabel: { fontSize: FontSize.sm, color: colors.text.secondary },
    nutrientValue: { fontSize: FontSize.sm, fontWeight: '700', fontVariant: ['tabular-nums'] },
    addButton: { marginTop: Spacing.base },
  });
}
