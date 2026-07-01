import { apiClient } from './client';
import { UserProfile, NutritionGoal } from '../types/auth.types';

export const usersApi = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data || response;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data || response;
  },

  getStats: async () => {
    const response = await apiClient.get('/users/stats');
    return response.data || response;
  },

  getGoals: async (): Promise<NutritionGoal> => {
    const response = await apiClient.get('/goals');
    return response.data || response;
  },

  updateGoals: async (data: Partial<NutritionGoal>) => {
    const response = await apiClient.put('/goals', data);
    return response.data || response;
  },

  resetGoals: async () => {
    const response = await apiClient.post('/goals/reset');
    return response.data || response;
  },
};
