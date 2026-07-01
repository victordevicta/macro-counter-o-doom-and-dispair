import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGoalsDto } from './dto/update-goals.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async getGoals(userId: string) {
    return this.prisma.nutritionGoal.findUnique({ where: { userId } });
  }

  async updateGoals(userId: string, dto: UpdateGoalsDto) {
    return this.prisma.nutritionGoal.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async resetToCalculated(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });

    if (!profile?.sex || !profile?.dateOfBirth || !profile?.heightCm || !profile?.currentWeight) {
      return { message: 'Complete your profile first, wanderer.' };
    }

    const age = Math.floor(
      (Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    );

    let bmr: number;
    if (profile.sex === 'MALE') {
      bmr = 10 * profile.currentWeight + 6.25 * profile.heightCm - 5 * age + 5;
    } else {
      bmr = 10 * profile.currentWeight + 6.25 * profile.heightCm - 5 * age - 161;
    }

    const multipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9,
    };

    const tdee = bmr * (multipliers[profile.activityLevel] || 1.2);
    const goalAdj = { LOSE_WEIGHT: -500, MAINTAIN: 0, GAIN_MUSCLE: 300 };
    const calories = Math.round(tdee + (goalAdj[profile.goal] || 0));
    const proteinG = Math.round(profile.currentWeight * 2.2);
    const fatG = Math.round((calories * 0.25) / 9);
    const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);

    return this.prisma.nutritionGoal.upsert({
      where: { userId },
      update: { calories, proteinG, carbsG, fatG },
      create: { userId, calories, proteinG, carbsG, fatG },
    });
  }
}
