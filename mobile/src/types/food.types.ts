export type FoodSource =
  | 'NUTRITIONIX'
  | 'OPEN_FOOD_FACTS'
  | 'USDA'
  | 'CUSTOM'
  | 'USER_CREATED';

export interface Food {
  id: string;
  externalId?: string;
  source: FoodSource;
  barcode?: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  servingSize: number;
  servingUnit: string;
  servingName?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  saturatedFatG?: number;
  transFatG?: number;
  cholesterolMg?: number;
  potassiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminCMg?: number;
  vitaminDMcg?: number;
  magnesiumMg?: number;
  zincMg?: number;
  isFavorite?: boolean;
}

export interface FoodSearchResult {
  data: Food[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
