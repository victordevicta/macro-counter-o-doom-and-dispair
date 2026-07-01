import { apiClient } from './client';
import { DailyDiary, MealType, WeekSummary } from '../types/diary.types';

export const diaryApi = {
  getDailyDiary: async (date: string): Promise<DailyDiary> => {
    const response = await apiClient.get('/diary', { params: { date } });
    return response.data || response;
  },

  getWeekSummary: async (startDate: string): Promise<WeekSummary> => {
    const response = await apiClient.get('/diary/week', { params: { startDate } });
    return response.data || response;
  },

  addEntry: async (data: {
    foodId: string;
    date: string;
    mealType: MealType;
    servings: number;
    servingSize?: number;
    servingUnit?: string;
  }) => {
    const response = await apiClient.post('/diary/entries', data);
    return response.data || response;
  },

  updateEntry: async (
    entryId: string,
    data: { servings?: number; servingSize?: number; servingUnit?: string },
  ) => {
    const response = await apiClient.put(`/diary/entries/${entryId}`, data);
    return response.data || response;
  },

  deleteEntry: async (entryId: string) => {
    const response = await apiClient.delete(`/diary/entries/${entryId}`);
    return response.data || response;
  },

  copyMeal: async (fromDate: string, fromMealType: MealType, toDate: string) => {
    const response = await apiClient.post('/diary/copy-meal', {
      fromDate,
      fromMealType,
      toDate,
    });
    return response.data || response;
  },
};

export const weightApi = {
  getLogs: async (limit = 30) => {
    const response = await apiClient.get('/weight', { params: { limit } });
    return response.data || response;
  },

  getProgress: async () => {
    const response = await apiClient.get('/weight/progress');
    return response.data || response;
  },

  addLog: async (data: {
    weightKg: number;
    bodyFatPercent?: number;
    muscleMassKg?: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/weight', data);
    return response.data || response;
  },

  deleteLog: async (logId: string) => {
    const response = await apiClient.delete(`/weight/${logId}`);
    return response.data || response;
  },
};
