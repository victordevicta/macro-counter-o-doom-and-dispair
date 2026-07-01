import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🩸 Seeding the dark registry...');

  const demoUser = await prisma.user.upsert({
    where: { email: 'doom@doomvault.com' },
    update: {},
    create: {
      email: 'doom@doomvault.com',
      username: 'doom_wanderer',
      passwordHash: await bcrypt.hash('D00mP@ssw0rd!', 12),
      profile: {
        create: {
          sex: 'MALE',
          dateOfBirth: new Date('1995-06-15'),
          heightCm: 180,
          currentWeight: 80,
          activityLevel: 'MODERATELY_ACTIVE',
          goal: 'MAINTAIN',
          onboardingDone: true,
        },
      },
      goals: {
        create: {
          calories: 2500,
          proteinG: 180,
          carbsG: 280,
          fatG: 80,
          fiberG: 30,
          waterMl: 3000,
          sodiumMg: 2300,
        },
      },
    },
  });

  const sampleFoods = [
    {
      name: 'Chicken Breast',
      brand: 'Generic',
      source: 'CUSTOM' as const,
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      proteinG: 31,
      carbsG: 0,
      fatG: 3.6,
      sodiumMg: 74,
    },
    {
      name: 'Brown Rice (cooked)',
      brand: 'Generic',
      source: 'CUSTOM' as const,
      servingSize: 100,
      servingUnit: 'g',
      calories: 112,
      proteinG: 2.6,
      carbsG: 23.5,
      fatG: 0.9,
      fiberG: 1.8,
    },
    {
      name: 'Whole Eggs',
      brand: 'Generic',
      source: 'CUSTOM' as const,
      servingSize: 50,
      servingUnit: 'g',
      servingName: '1 large egg',
      calories: 72,
      proteinG: 6.3,
      carbsG: 0.4,
      fatG: 5,
      cholesterolMg: 185,
    },
    {
      name: 'Oats (dry)',
      brand: 'Generic',
      source: 'CUSTOM' as const,
      servingSize: 40,
      servingUnit: 'g',
      servingName: '1/2 cup',
      calories: 148,
      proteinG: 5.5,
      carbsG: 26,
      fatG: 2.6,
      fiberG: 3.8,
    },
    {
      name: 'Broccoli (steamed)',
      brand: 'Generic',
      source: 'CUSTOM' as const,
      servingSize: 100,
      servingUnit: 'g',
      calories: 35,
      proteinG: 2.4,
      carbsG: 7.2,
      fatG: 0.4,
      fiberG: 2.6,
      vitaminCMg: 89,
    },
  ];

  for (const food of sampleFoods) {
    await prisma.food.upsert({
      where: { externalId_source: { externalId: food.name.toLowerCase().replace(/ /g, '_'), source: food.source } },
      update: {},
      create: {
        ...food,
        externalId: food.name.toLowerCase().replace(/ /g, '_'),
      },
    });
  }

  console.log('✅ The dark registry has been populated.');
  console.log('   Demo account: doom@doomvault.com / D00mP@ssw0rd!');
}

main()
  .catch((e) => {
    console.error('💀 Seed ritual failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
