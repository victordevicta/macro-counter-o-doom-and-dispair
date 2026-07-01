import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { NutritionixService } from './external/nutritionix.service';
import { OpenFoodFactsService } from './external/open-food-facts.service';
import { UsdaService } from './external/usda.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FoodsController],
  providers: [FoodsService, NutritionixService, OpenFoodFactsService, UsdaService],
  exports: [FoodsService],
})
export class FoodsModule {}
