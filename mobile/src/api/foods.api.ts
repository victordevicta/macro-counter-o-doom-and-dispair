import { apiClient } from './client';
import { Food, FoodSearchResult } from '../types/food.types';

export const foodsApi = {
  // Note: apiClient interceptor already unwraps axios response.data, so the result
  // here is the raw JSON body from the server (e.g. { data: [], meta: {} }).
  search: async (query: string, page = 1, limit = 20): Promise<FoodSearchResult> => {
    return apiClient.get('/foods/search', { params: { query, page, limit } }) as any;
  },

  getByBarcode: async (barcode: string): Promise<Food> => {
    return apiClient.get(`/foods/barcode/${barcode}`) as any;
  },

  getById: async (id: string): Promise<Food> => {
    return apiClient.get(`/foods/${id}`) as any;
  },

  getFavorites: async () => {
    return apiClient.get('/foods/favorites') as any;
  },

  getRecent: async () => {
    return apiClient.get('/foods/recent') as any;
  },

  toggleFavorite: async (foodId: string) => {
    return apiClient.post(`/foods/${foodId}/favorite`) as any;
  },

  createCustom: async (data: Partial<Food>) => {
    return apiClient.post('/foods/custom', data) as any;
  },
};
