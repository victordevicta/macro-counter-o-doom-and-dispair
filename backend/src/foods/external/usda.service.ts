import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UsdaService {
  private readonly logger = new Logger(UsdaService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('usda.baseUrl');
    this.apiKey = this.configService.get<string>('usda.apiKey');
  }

  async search(query: string, pageSize = 20, pageNumber = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/foods/search`, {
        params: {
          api_key: this.apiKey,
          query,
          pageSize,
          pageNumber,
        },
        timeout: 10000,
      });

      const foods = response.data?.foods || [];
      return foods.map(this.mapFood.bind(this));
    } catch (error) {
      this.logger.error(`USDA search failed: ${(error as Error).message}`);
      return [];
    }
  }

  async getFood(fdcId: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/food/${fdcId}`, {
        params: { api_key: this.apiKey },
        timeout: 10000,
      });
      return this.mapDetailedFood(response.data);
    } catch (error) {
      this.logger.error(`USDA food detail failed: ${(error as Error).message}`);
      return null;
    }
  }

  private getNutrient(nutrients: any[], nutrientId: number): number | undefined {
    const n = nutrients?.find((n) => n.nutrientId === nutrientId);
    return n?.value;
  }

  private mapFood(food: any) {
    const nutrients = food.foodNutrients || [];

    return {
      externalId: String(food.fdcId),
      source: 'USDA' as const,
      name: food.description,
      brand: food.brandOwner || food.brandName,
      servingSize: 100,
      servingUnit: 'g',
      calories: this.getNutrient(nutrients, 1008) || 0,
      proteinG: this.getNutrient(nutrients, 1003) || 0,
      carbsG: this.getNutrient(nutrients, 1005) || 0,
      fatG: this.getNutrient(nutrients, 1004) || 0,
      fiberG: this.getNutrient(nutrients, 1079),
      sugarG: this.getNutrient(nutrients, 2000),
      sodiumMg: this.getNutrient(nutrients, 1093),
      saturatedFatG: this.getNutrient(nutrients, 1258),
      cholesterolMg: this.getNutrient(nutrients, 1253),
      potassiumMg: this.getNutrient(nutrients, 1092),
      calciumMg: this.getNutrient(nutrients, 1087),
      ironMg: this.getNutrient(nutrients, 1089),
      vitaminCMg: this.getNutrient(nutrients, 1162),
      vitaminDMcg: this.getNutrient(nutrients, 1114),
      magnesiumMg: this.getNutrient(nutrients, 1090),
      zincMg: this.getNutrient(nutrients, 1095),
    };
  }

  private mapDetailedFood(food: any) {
    return this.mapFood({ ...food, foodNutrients: food.foodNutrients });
  }
}
