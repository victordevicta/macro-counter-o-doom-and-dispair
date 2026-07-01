import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NutritionixService {
  private readonly logger = new Logger(NutritionixService.name);
  private readonly baseUrl: string;
  private readonly appId: string;
  private readonly appKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('nutritionix.baseUrl');
    this.appId = this.configService.get<string>('nutritionix.appId');
    this.appKey = this.configService.get<string>('nutritionix.appKey');
  }

  private get isConfigured(): boolean {
    return !!(this.appId && this.appKey);
  }

  private get headers() {
    return {
      'x-app-id': this.appId,
      'x-app-key': this.appKey,
      'Content-Type': 'application/json',
    };
  }

  async search(query: string, limit = 20) {
    if (!this.isConfigured) return [];
    try {
      const response = await axios.get(`${this.baseUrl}/search/instant`, {
        headers: this.headers,
        params: { query, branded: true, self: false, detailed: true, limit },
      });

      const { branded = [], common = [] } = response.data;

      return [...branded, ...common].map(this.mapFood.bind(this));
    } catch (error) {
      this.logger.error(`Nutritionix search failed: ${(error as Error).message}`);
      return [];
    }
  }

  async searchByBarcode(upc: string) {
    if (!this.isConfigured) return null;
    try {
      const response = await axios.get(`${this.baseUrl}/search/item`, {
        headers: this.headers,
        params: { upc },
      });
      const foods = response.data?.foods || [];
      return foods.map(this.mapDetailedFood.bind(this));
    } catch (error) {
      this.logger.error(`Nutritionix barcode search failed: ${(error as Error).message}`);
      return null;
    }
  }

  async getNutrients(query: string) {
    if (!this.isConfigured) return [];
    try {
      const response = await axios.post(
        `${this.baseUrl}/natural/nutrients`,
        { query },
        { headers: this.headers },
      );
      const foods = response.data?.foods || [];
      return foods.map(this.mapDetailedFood.bind(this));
    } catch (error) {
      this.logger.error(`Nutritionix nutrients failed: ${(error as Error).message}`);
      return [];
    }
  }

  private mapFood(food: any) {
    return {
      externalId: food.nix_item_id || food.food_name,
      source: 'NUTRITIONIX' as const,
      name: food.food_name || food.item_name,
      brand: food.brand_name,
      imageUrl: food.photo?.thumb,
      servingSize: food.serving_weight_grams || 100,
      servingUnit: 'g',
      servingName: food.serving_unit,
      calories: food.nf_calories || 0,
      proteinG: food.nf_protein || 0,
      carbsG: food.nf_total_carbohydrate || 0,
      fatG: food.nf_total_fat || 0,
      fiberG: food.nf_dietary_fiber,
      sugarG: food.nf_sugars,
      sodiumMg: food.nf_sodium,
      saturatedFatG: food.nf_saturated_fat,
      cholesterolMg: food.nf_cholesterol,
      potassiumMg: food.nf_potassium,
    };
  }

  private mapDetailedFood(food: any) {
    return {
      ...this.mapFood(food),
      externalId: food.nix_item_id || food.food_name,
      servingSize: food.serving_weight_grams || 100,
    };
  }
}
