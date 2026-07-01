import { create } from 'zustand';
import { DailyDiary, MealType } from '../types/diary.types';
import { diaryApi } from '../api/diary.api';
import { format } from 'date-fns';

interface DiaryState {
  currentDate: Date;
  diary: DailyDiary | null;
  isLoading: boolean;

  setDate: (date: Date) => void;
  fetchDiary: (date?: string) => Promise<void>;
  addEntry: (params: {
    foodId: string;
    mealType: MealType;
    servings: number;
    servingSize?: number;
    servingUnit?: string;
  }) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  updateEntry: (entryId: string, servings: number) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentDate: new Date(),
  diary: null,
  isLoading: false,

  setDate: (date) => {
    set({ currentDate: date });
    get().fetchDiary(format(date, 'yyyy-MM-dd'));
  },

  fetchDiary: async (date) => {
    const d = date || format(get().currentDate, 'yyyy-MM-dd');
    set({ isLoading: true });
    try {
      const diary = await diaryApi.getDailyDiary(d);
      set({ diary, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addEntry: async ({ foodId, mealType, servings, servingSize, servingUnit }) => {
    const date = format(get().currentDate, 'yyyy-MM-dd');
    await diaryApi.addEntry({ foodId, date, mealType, servings, servingSize, servingUnit });
    await get().fetchDiary(date);
  },

  deleteEntry: async (entryId) => {
    await diaryApi.deleteEntry(entryId);
    const date = format(get().currentDate, 'yyyy-MM-dd');
    await get().fetchDiary(date);
  },

  updateEntry: async (entryId, servings) => {
    await diaryApi.updateEntry(entryId, { servings });
    const date = format(get().currentDate, 'yyyy-MM-dd');
    await get().fetchDiary(date);
  },
}));
