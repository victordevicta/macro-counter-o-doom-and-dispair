import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenFoodFactsService {
  private readonly logger = new Logger(OpenFoodFactsService.name);
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('openFoodFacts.baseUrl');
  }

  async searchByBarcode(barcode: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v2/product/${barcode}.json`, {
        headers: { 'User-Agent': 'MacroCounterDoom/1.0 (doom@doomvault.com)' },
        timeout: 8000,
      });

      if (response.data.status !== 1) return null;

      return this.mapProduct(response.data.product);
    } catch (error) {
      this.logger.error(`Open Food Facts barcode failed: ${(error as Error).message}`);
      return null;
    }
  }

  async search(query: string, page = 1) {
    try {
      const response = await axios.get(`${this.baseUrl}/cgi/search.pl`, {
        headers: { 'User-Agent': 'MacroCounterDoom/1.0 (doom@doomvault.com)' },
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 20,
          page,
          fields:
            'code,product_name,brands,image_url,nutriments,serving_size,serving_quantity',
        },
        timeout: 8000,
      });

      const products = response.data?.products || [];
      return products.map(this.mapProduct.bind(this)).filter(Boolean);
    } catch (error) {
      this.logger.error(`Open Food Facts search failed: ${(error as Error).message}`);
      return [];
    }
  }

  private mapProduct(product: any) {
    if (!product?.product_name) return null;

    const n = product.nutriments || {};
    const servingSize = parseFloat(product.serving_quantity) || 100;

    return {
      externalId: product.code || product._id,
      source: 'OPEN_FOOD_FACTS' as const,
      barcode: product.code,
      name: product.product_name,
      brand: product.brands,
      imageUrl: product.image_url,
      servingSize,
      servingUnit: 'g',
      servingName: product.serving_size,
      calories: n['energy-kcal_serving'] || n['energy-kcal_100g'] || 0,
      proteinG: n['proteins_serving'] || n['proteins_100g'] || 0,
      carbsG: n['carbohydrates_serving'] || n['carbohydrates_100g'] || 0,
      fatG: n['fat_serving'] || n['fat_100g'] || 0,
      fiberG: n['fiber_serving'] || n['fiber_100g'],
      sugarG: n['sugars_serving'] || n['sugars_100g'],
      sodiumMg: n['sodium_serving']
        ? n['sodium_serving'] * 1000
        : n['sodium_100g']
          ? n['sodium_100g'] * 1000
          : undefined,
      saturatedFatG: n['saturated-fat_serving'] || n['saturated-fat_100g'],
      potassiumMg: n['potassium_serving'] ? n['potassium_serving'] * 1000 : undefined,
    };
  }
}
