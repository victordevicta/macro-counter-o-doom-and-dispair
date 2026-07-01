import { Food } from './food.types';
import { NutritionGoal } from './auth.types';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface FoodEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  date: string;
  mealType: MealType;
  servings: number;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sodiumMg?: number;
  createdAt: string;
}

export interface NutritionTotals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
}

export interface DailyDiary {
  date: string;
  meals: {
    BREAKFAST: FoodEntry[];
    LUNCH: FoodEntry[];
    DINNER: FoodEntry[];
    SNACK: FoodEntry[];
  };
  totals: NutritionTotals;
  goals: NutritionGoal | null;
  remaining: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  } | null;
}

export interface DaySummary {
  date: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
}

export interface WeekSummary {
  days: DaySummary[];
  weekTotal: NutritionTotals;
}

export const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Dawn Rations',
  LUNCH: 'Midday Sustenance',
  DINNER: 'Nightly Feast',
  SNACK: 'The Cursed Morsels',
};

export const MEAL_ICONS: Record<MealType, string> = {
  BREAKFAST: '🌅',
  LUNCH: '⚔️',
  DINNER: '🍖',
  SNACK: '💀',
};
