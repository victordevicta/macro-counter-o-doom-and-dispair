import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NutritionixService } from './external/nutritionix.service';
import { OpenFoodFactsService } from './external/open-food-facts.service';
import { UsdaService } from './external/usda.service';
import { SearchFoodDto, CreateCustomFoodDto } from './dto/search-food.dto';

@Injectable()
export class FoodsService {
  private readonly logger = new Logger(FoodsService.name);

  constructor(
    private prisma: PrismaService,
    private nutritionix: NutritionixService,
    private openFoodFacts: OpenFoodFactsService,
    private usda: UsdaService,
  ) {}

  async search(dto: SearchFoodDto, userId: string) {
    const { query, page = 1, limit = 20 } = dto;

    const dbResults = await this.prisma.food.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const [nutritionixResults, usdaResults] = await Promise.allSettled([
      this.nutritionix.search(query, limit),
      this.usda.search(query, limit),
    ]);

    const externalFoods = [
      ...(nutritionixResults.status === 'fulfilled' ? nutritionixResults.value : []),
      ...(usdaResults.status === 'fulfilled' ? usdaResults.value : []),
    ];

    const savedFoods = await this.upsertExternalFoods(externalFoods);

    const userFavorites = await this.prisma.favoriteFood.findMany({
      where: { userId },
      select: { foodId: true },
    });
    const favoriteIds = new Set(userFavorites.map((f) => f.foodId));

    const allFoods = [...dbResults, ...savedFoods].map((food) => ({
      ...food,
      isFavorite: favoriteIds.has(food.id),
    }));

    const uniqueFoods = this.deduplicateFoods(allFoods);

    return {
      data: uniqueFoods.slice((page - 1) * limit, page * limit),
      meta: { total: uniqueFoods.length, page, limit },
    };
  }

  async searchByBarcode(barcode: string, userId: string) {
    const existing = await this.prisma.food.findFirst({
      where: { barcode },
    });

    if (existing) {
      const isFavorite = !!(await this.prisma.favoriteFood.findUnique({
        where: { userId_foodId: { userId, foodId: existing.id } },
      }));
      return { ...existing, isFavorite };
    }

    const [nutritionixResult, offResult] = await Promise.allSettled([
      this.nutritionix.searchByBarcode(barcode),
      this.openFoodFacts.searchByBarcode(barcode),
    ]);

    const foodData =
      (nutritionixResult.status === 'fulfilled' && nutritionixResult.value?.[0]) ||
      (offResult.status === 'fulfilled' && offResult.value);

    if (!foodData) {
      throw new NotFoundException('The barcode leads to the void. No food found.');
    }

    const saved = await this.prisma.food.create({ data: { ...foodData, barcode } });
    return { ...saved, isFavorite: false };
  }

  async getFoodById(id: string, userId: string) {
    const food = await this.prisma.food.findUnique({ where: { id } });
    if (!food) throw new NotFoundException('Food perished from existence.');

    const isFavorite = !!(await this.prisma.favoriteFood.findUnique({
      where: { userId_foodId: { userId, foodId: id } },
    }));

    return { ...food, isFavorite };
  }

  async createCustomFood(userId: string, dto: CreateCustomFoodDto) {
    return this.prisma.food.create({
      data: { ...dto, source: 'USER_CREATED', createdById: userId },
    });
  }

  async toggleFavorite(userId: string, foodId: string) {
    const existing = await this.prisma.favoriteFood.findUnique({
      where: { userId_foodId: { userId, foodId } },
    });

    if (existing) {
      await this.prisma.favoriteFood.delete({
        where: { userId_foodId: { userId, foodId } },
      });
      return { isFavorite: false, message: 'Removed from the sacred tome.' };
    }

    await this.prisma.favoriteFood.create({ data: { userId, foodId } });
    return { isFavorite: true, message: 'Added to the sacred tome.' };
  }

  async getFavorites(userId: string) {
    return this.prisma.favoriteFood.findMany({
      where: { userId },
      include: { food: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecentFoods(userId: string, limit = 20) {
    const entries = await this.prisma.foodEntry.findMany({
      where: { userId },
      include: { food: true },
      orderBy: { createdAt: 'desc' },
      take: limit * 3,
    });

    const seen = new Set<string>();
    const unique: typeof entries = [];

    for (const entry of entries) {
      if (!seen.has(entry.foodId)) {
        seen.add(entry.foodId);
        unique.push(entry);
        if (unique.length >= limit) break;
      }
    }

    return unique.map((e) => e.food);
  }

  private async upsertExternalFoods(foods: any[]) {
    const saved: any[] = [];

    for (const food of foods) {
      if (!food.externalId || !food.source) continue;
      try {
        const upserted = await this.prisma.food.upsert({
          where: {
            externalId_source: { externalId: food.externalId, source: food.source },
          },
          update: { ...food },
          create: { ...food },
        });
        saved.push(upserted);
      } catch (e) {
        this.logger.warn(`Failed to upsert food ${food.name}: ${(e as Error).message}`);
      }
    }

    return saved;
  }

  private deduplicateFoods(foods: any[]) {
    const seen = new Set<string>();
    return foods.filter((food) => {
      if (seen.has(food.id)) return false;
      seen.add(food.id);
      return true;
    });
  }
}
