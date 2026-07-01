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
import { useDiaryStore } from '../../store/diaryStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Food } from '../../types/food.types';
import { MealType, MEAL_LABELS } from '../../types/diary.types';
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
      Alert.alert('Invalid Amount', 'The portion must be greater than zero.');
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
      Alert.alert('Failed', error?.response?.data?.message || 'The dark tome rejected your entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const nutrientRows = [
    { label: 'Protein', value: calculated.proteinG, unit: 'g', color: Colors.protein, goal: goals?.proteinG },
    { label: 'Carbohydrates', value: calculated.carbsG, unit: 'g', color: Colors.carbs, goal: goals?.carbsG },
    { label: 'Fat', value: calculated.fatG, unit: 'g', color: Colors.fat, goal: goals?.fatG },
    { label: 'Fiber', value: calculated.fiberG, unit: 'g', color: Colors.fiber, goal: goals?.fiberG },
    { label: 'Sodium', value: calculated.sodiumMg, unit: 'mg', color: Colors.sodium, goal: goals?.sodiumMg },
  ];

  return (
    <LinearGradient colors={[Colors.background, '#100A14']} style={styles.gradient}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to {MEAL_LABELS[mealType]}</Text>
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
                <Text style={{ fontSize: 36 }}>🍖</Text>
              </View>
            )}
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
              <Text style={styles.servingInfo}>
                Per {food.servingSize}{food.servingUnit}
                {food.servingName ? ` (${food.servingName})` : ''}
              </Text>
            </View>
          </View>
        </Card>

        {/* Serving Control */}
        <Card style={styles.servingCard}>
          <Text style={styles.sectionTitle}>⚗️ PORTION ALCHEMY</Text>
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
            <Text style={styles.calorieLabel}>TOTAL CALORIES</Text>
            <Text style={styles.calorieValue}>{Math.round(calculated.calories)}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
          {goals?.calories && (
            <Text style={styles.caloriePercent}>
              {Math.round((calculated.calories / goals.calories) * 100)}% of your daily ration
            </Text>
          )}
        </Card>

        {/* Nutrition Facts */}
        <Card style={styles.nutritionCard}>
          <Text style={styles.sectionTitle}>💀 NUTRITIONAL FATE</Text>
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
          title={isLoading ? 'Inscribing...' : `ADD TO ${MEAL_LABELS[mealType].toUpperCase()}`}
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

const styles = StyleSheet.create({
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
  headerTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: Spacing.base, paddingBottom: 100 },
  foodCard: { marginBottom: Spacing.base },
  foodHeader: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  foodImage: { width: 64, height: 64, borderRadius: BorderRadius.md },
  foodImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  foodBrand: { fontSize: FontSize.sm, color: Colors.gold, marginTop: 2 },
  servingInfo: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
  servingCard: { marginBottom: Spacing.base },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.base,
  },
  servingControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  servingBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingBtnText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  servingInputWrapper: { flex: 1, alignItems: 'center' },
  servingInput: { marginBottom: 0, width: '100%' },
  servingUnit: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
  quickPortions: { flexDirection: 'row', gap: 8, marginTop: Spacing.sm },
  portionChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  portionChipActive: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryGlow },
  portionText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
  portionTextActive: { color: Colors.primaryLight },
  calorieCard: { marginBottom: Spacing.base, alignItems: 'center' },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  calorieLabel: { fontSize: FontSize.xs, color: Colors.textMuted, letterSpacing: 2 },
  calorieValue: {
    fontSize: FontSize['4xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  calorieUnit: { fontSize: FontSize.sm, color: Colors.textSecondary },
  caloriePercent: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4 },
  nutritionCard: { marginBottom: Spacing.base },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nutrientLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nutrientDot: { width: 10, height: 10, borderRadius: 5 },
  nutrientLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  nutrientValue: { fontSize: FontSize.sm, fontWeight: '700', fontVariant: ['tabular-nums'] },
  addButton: { marginTop: Spacing.base },
});
