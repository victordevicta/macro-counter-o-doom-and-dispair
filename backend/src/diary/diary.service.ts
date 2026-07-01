import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddFoodEntryDto, UpdateFoodEntryDto } from './dto/add-entry.dto';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  async getDailyDiary(userId: string, date: string) {
    const targetDate = new Date(date);

    const [entries, goals] = await Promise.all([
      this.prisma.foodEntry.findMany({
        where: { userId, date: targetDate },
        include: { food: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.nutritionGoal.findUnique({ where: { userId } }),
    ]);

    const grouped = {
      BREAKFAST: entries.filter((e) => e.mealType === 'BREAKFAST'),
      LUNCH: entries.filter((e) => e.mealType === 'LUNCH'),
      DINNER: entries.filter((e) => e.mealType === 'DINNER'),
      SNACK: entries.filter((e) => e.mealType === 'SNACK'),
    };

    const totals = this.calculateTotals(entries);

    return {
      date,
      meals: grouped,
      totals,
      goals,
      remaining: goals
        ? {
            calories: Math.max(0, goals.calories - totals.calories),
            proteinG: Math.max(0, goals.proteinG - totals.proteinG),
            carbsG: Math.max(0, goals.carbsG - totals.carbsG),
            fatG: Math.max(0, goals.fatG - totals.fatG),
          }
        : null,
    };
  }

  async addFoodEntry(userId: string, dto: AddFoodEntryDto) {
    const food = await this.prisma.food.findUnique({ where: { id: dto.foodId } });
    if (!food) throw new NotFoundException('Food not found in the void.');

    const servingSize = dto.servingSize ?? food.servingSize;
    const ratio = (servingSize * dto.servings) / food.servingSize;

    return this.prisma.foodEntry.create({
      data: {
        userId,
        foodId: dto.foodId,
        date: new Date(dto.date),
        mealType: dto.mealType,
        servings: dto.servings,
        servingSize,
        servingUnit: dto.servingUnit ?? food.servingUnit,
        calories: food.calories * ratio,
        proteinG: food.proteinG * ratio,
        carbsG: food.carbsG * ratio,
        fatG: food.fatG * ratio,
        fiberG: food.fiberG ? food.fiberG * ratio : null,
        sodiumMg: food.sodiumMg ? food.sodiumMg * ratio : null,
      },
      include: { food: true },
    });
  }

  async updateFoodEntry(userId: string, entryId: string, dto: UpdateFoodEntryDto) {
    const entry = await this.prisma.foodEntry.findFirst({
      where: { id: entryId, userId },
      include: { food: true },
    });

    if (!entry) throw new NotFoundException('Entry has perished from the diary.');

    const servings = dto.servings ?? entry.servings;
    const servingSize = dto.servingSize ?? entry.servingSize;
    const ratio = (servingSize * servings) / entry.food.servingSize;

    return this.prisma.foodEntry.update({
      where: { id: entryId },
      data: {
        servings,
        servingSize,
        servingUnit: dto.servingUnit ?? entry.servingUnit,
        calories: entry.food.calories * ratio,
        proteinG: entry.food.proteinG * ratio,
        carbsG: entry.food.carbsG * ratio,
        fatG: entry.food.fatG * ratio,
        fiberG: entry.food.fiberG ? entry.food.fiberG * ratio : null,
        sodiumMg: entry.food.sodiumMg ? entry.food.sodiumMg * ratio : null,
      },
      include: { food: true },
    });
  }

  async deleteFoodEntry(userId: string, entryId: string) {
    const entry = await this.prisma.foodEntry.findFirst({
      where: { id: entryId, userId },
    });
    if (!entry) throw new NotFoundException('Entry not found.');

    await this.prisma.foodEntry.delete({ where: { id: entryId } });
    return { message: 'The morsel has been purged from the record.' };
  }

  async getWeekSummary(userId: string, startDate: string) {
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6);

    const entries = await this.prisma.foodEntry.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });

    const dailyMap = new Map<string, typeof entries>();
    for (const entry of entries) {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, []);
      dailyMap.get(dateKey).push(entry);
    }

    const days: any[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const dayEntries = dailyMap.get(key) || [];
      days.push({ date: key, ...this.calculateTotals(dayEntries) });
    }

    return { days, weekTotal: this.calculateTotals(entries) };
  }

  async copyMeal(userId: string, fromDate: string, fromMealType: string, toDate: string) {
    const sourceEntries = await this.prisma.foodEntry.findMany({
      where: { userId, date: new Date(fromDate), mealType: fromMealType as any },
    });

    if (!sourceEntries.length) {
      throw new NotFoundException('No entries found to copy from the past.');
    }

    const newEntries = await Promise.all(
      sourceEntries.map((e) =>
        this.prisma.foodEntry.create({
          data: {
            userId,
            foodId: e.foodId,
            date: new Date(toDate),
            mealType: e.mealType,
            servings: e.servings,
            servingSize: e.servingSize,
            servingUnit: e.servingUnit,
            calories: e.calories,
            proteinG: e.proteinG,
            carbsG: e.carbsG,
            fatG: e.fatG,
            fiberG: e.fiberG,
            sodiumMg: e.sodiumMg,
          },
          include: { food: true },
        }),
      ),
    );

    return newEntries;
  }

  private calculateTotals(entries: any[]) {
    return entries.reduce(
      (acc, e) => ({
        calories: acc.calories + (e.calories || 0),
        proteinG: acc.proteinG + (e.proteinG || 0),
        carbsG: acc.carbsG + (e.carbsG || 0),
        fatG: acc.fatG + (e.fatG || 0),
        fiberG: acc.fiberG + (e.fiberG || 0),
        sodiumMg: acc.sodiumMg + (e.sodiumMg || 0),
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, sodiumMg: 0 },
    );
  }
}
