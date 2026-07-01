import { useMemo } from 'react';
import { NutritionGoal } from '../types/auth.types';
import { NutritionTotals } from '../types/diary.types';

export function useNutritionProgress(
  totals: NutritionTotals | undefined,
  goals: NutritionGoal | undefined,
) {
  return useMemo(() => {
    if (!totals || !goals) return null;

    const caloriePct = Math.min((totals.calories / goals.calories) * 100, 100);
    const proteinPct = Math.min((totals.proteinG / goals.proteinG) * 100, 100);
    const carbsPct = Math.min((totals.carbsG / goals.carbsG) * 100, 100);
    const fatPct = Math.min((totals.fatG / goals.fatG) * 100, 100);

    const isCaloriesOver = totals.calories > goals.calories;
    const isProteinLow = totals.proteinG < goals.proteinG * 0.8;

    const getDoomQuote = () => {
      if (isCaloriesOver) return 'The excess corrupts your vessel.';
      if (isProteinLow) return 'Protein deficit detected. Gains perishing.';
      if (caloriePct < 30) return 'The void hungers within you.';
      if (caloriePct > 85) return 'Nearing the caloric limit.';
      return 'The balance holds... for now.';
    };

    return {
      caloriePct,
      proteinPct,
      carbsPct,
      fatPct,
      isCaloriesOver,
      isProteinLow,
      remaining: {
        calories: goals.calories - totals.calories,
        proteinG: goals.proteinG - totals.proteinG,
        carbsG: goals.carbsG - totals.carbsG,
        fatG: goals.fatG - totals.fatG,
      },
      doomQuote: getDoomQuote(),
    };
  }, [totals, goals]);
}

export function useMacroCalories(totals: NutritionTotals | undefined) {
  return useMemo(() => {
    if (!totals) return { proteinCal: 0, carbsCal: 0, fatCal: 0, total: 0 };
    const proteinCal = totals.proteinG * 4;
    const carbsCal = totals.carbsG * 4;
    const fatCal = totals.fatG * 9;
    const total = proteinCal + carbsCal + fatCal;
    return {
      proteinCal,
      carbsCal,
      fatCal,
      total,
      proteinPct: total > 0 ? (proteinCal / total) * 100 : 0,
      carbsPct: total > 0 ? (carbsCal / total) * 100 : 0,
      fatPct: total > 0 ? (fatCal / total) * 100 : 0,
    };
  }, [totals]);
}
