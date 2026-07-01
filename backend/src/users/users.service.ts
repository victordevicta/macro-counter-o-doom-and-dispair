import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        goals: true,
        _count: {
          select: {
            foodEntries: true,
            weightLogs: true,
            favoriteFoods: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Soul not found in the registry.');

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: { ...dto },
      create: { userId, ...dto },
    });

    if (dto.currentWeight) {
      await this.prisma.weightLog.create({
        data: { userId, weightKg: dto.currentWeight },
      });
    }

    if (profile.sex && profile.dateOfBirth && profile.heightCm && profile.currentWeight && profile.activityLevel) {
      await this.recalculateGoals(userId, profile as any);
      await this.prisma.userProfile.update({
        where: { userId },
        data: { onboardingDone: true },
      });
    }

    return profile;
  }

  async recalculateGoals(userId: string, profile: any) {
    const { calories, protein, carbs, fat } = this.calculateTDEE(profile);

    await this.prisma.nutritionGoal.upsert({
      where: { userId },
      update: {
        calories,
        proteinG: protein,
        carbsG: carbs,
        fatG: fat,
      },
      create: {
        userId,
        calories,
        proteinG: protein,
        carbsG: carbs,
        fatG: fat,
      },
    });
  }

  private calculateTDEE(profile: {
    sex: string;
    dateOfBirth: Date;
    heightCm: number;
    currentWeight: number;
    activityLevel: string;
    goal: string;
  }) {
    const age = Math.floor(
      (Date.now() - new Date(profile.dateOfBirth).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25),
    );

    // Mifflin-St Jeor
    let bmr: number;
    if (profile.sex === 'MALE') {
      bmr = 10 * profile.currentWeight + 6.25 * profile.heightCm - 5 * age + 5;
    } else {
      bmr = 10 * profile.currentWeight + 6.25 * profile.heightCm - 5 * age - 161;
    }

    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9,
    };

    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

    const goalAdjustments = {
      LOSE_WEIGHT: -500,
      MAINTAIN: 0,
      GAIN_MUSCLE: 300,
    };

    const calories = Math.round(tdee + (goalAdjustments[profile.goal] || 0));

    const protein = Math.round(profile.currentWeight * 2.2);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    return { calories, protein, carbs, fat };
  }

  async getStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEntries, streak, lastWeight] = await Promise.all([
      this.prisma.foodEntry.count({ where: { userId } }),
      this.calculateStreak(userId),
      this.prisma.weightLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
      }),
    ]);

    return { totalEntries, streak, lastWeight };
  }

  private async calculateStreak(userId: string): Promise<number> {
    const entries = await this.prisma.foodEntry.findMany({
      where: { userId },
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
      take: 365,
    });

    if (!entries.length) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === i) streak++;
      else break;
    }

    return streak;
  }
}
