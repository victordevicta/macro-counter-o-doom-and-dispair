import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { foodsApi } from '../../api/foods.api';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Food } from '../../types/food.types';
import { MealType } from '../../types/diary.types';

interface SearchScreenProps {
  mealType?: MealType;
  onFoodSelected: (food: Food, mealType: MealType) => void;
  onScanBarcode: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  mealType = 'LUNCH',
  onFoodSelected,
  onScanBarcode,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'favorites'>('recent');

  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleQueryChange = (text: string) => {
    setQuery(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(text);
      if (text.length >= 2) setActiveTab('search');
    }, 400);
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['foods', 'search', debouncedQuery],
    queryFn: () => foodsApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const { data: recentFoods } = useQuery({
    queryKey: ['foods', 'recent'],
    queryFn: foodsApi.getRecent,
    enabled: activeTab === 'recent',
  });

  const { data: favorites } = useQuery({
    queryKey: ['foods', 'favorites'],
    queryFn: foodsApi.getFavorites,
    enabled: activeTab === 'favorites',
  });

  const displayData = React.useMemo(() => {
    if (activeTab === 'search' && searchResults) {
      const items = (searchResults as any).data ?? searchResults;
      return Array.isArray(items) ? items : [];
    }
    if (activeTab === 'recent' && recentFoods) {
      const items = (recentFoods as any).data ?? recentFoods;
      return Array.isArray(items) ? items : [];
    }
    if (activeTab === 'favorites' && favorites) {
      const items = (favorites as any).data ?? favorites;
      return Array.isArray(items) ? items.map((f: any) => f.food || f) : [];
    }
    return [];
  }, [activeTab, searchResults, recentFoods, favorites]);

  const renderFoodItem = useCallback(({ item: food }: { item: Food }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => onFoodSelected(food, mealType)}
      activeOpacity={0.7}
    >
      <View style={styles.foodLeft}>
        {food.imageUrl ? (
          <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
        ) : (
          <View style={styles.foodImagePlaceholder}>
            <Text style={styles.foodImageEmoji}>🍖</Text>
          </View>
        )}
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={1}>{food.name}</Text>
          {food.brand && (
            <Text style={styles.foodBrand} numberOfLines={1}>{food.brand}</Text>
          )}
          <Text style={styles.foodServing}>
            {food.servingSize}{food.servingUnit}
            {food.servingName ? ` (${food.servingName})` : ''}
          </Text>
        </View>
      </View>
      <View style={styles.foodRight}>
        <Text style={styles.foodCalories}>{Math.round(food.calories)}</Text>
        <Text style={styles.foodKcal}>kcal</Text>
        <View style={styles.foodMacros}>
          <Text style={[styles.macroText, { color: Colors.protein }]}>
            {Math.round(food.proteinG)}P
          </Text>
          <Text style={[styles.macroText, { color: Colors.carbs }]}>
            {Math.round(food.carbsG)}C
          </Text>
          <Text style={[styles.macroText, { color: Colors.fat }]}>
            {Math.round(food.fatG)}F
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [mealType, onFoodSelected]);

  return (
    <LinearGradient
      colors={[Colors.background, '#0A0A14']}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Seek Sustenance</Text>
        <Text style={styles.subtitle}>for {mealType.toLowerCase().replace('_', ' ')}</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Input
              placeholder="Search the dark tome of foods..."
              value={query}
              onChangeText={handleQueryChange}
              leftIcon={
                <Ionicons name="search" size={18} color={Colors.textMuted} />
              }
              containerStyle={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.scanButton} onPress={onScanBarcode}>
            <Ionicons name="barcode-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {(['recent', 'favorites', 'search'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'recent' ? '⏱ Recent' : tab === 'favorites' ? '❤️ Favorites' : '🌀 Results'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryLight} />
          <Text style={styles.loadingText}>Consulting the dark oracle...</Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>
                {activeTab === 'favorites' ? '💔' : activeTab === 'recent' ? '📜' : '🌀'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'favorites'
                  ? 'No sacred favorites yet.'
                  : activeTab === 'recent'
                    ? 'No recent summonings.'
                    : 'The void returns nothing.'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'search' && query.length < 2
                  ? 'Type at least 2 runes to search.'
                  : 'Begin your dark quest for sustenance.'}
              </Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingTop: 52, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  searchInputWrapper: { flex: 1 },
  searchInput: { marginBottom: 0 },
  scanButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryGlow },
  tabText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },
  tabTextActive: { color: Colors.primaryLight },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: Colors.textMuted, fontStyle: 'italic' },
  listContent: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  foodLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  foodImage: { width: 44, height: 44, borderRadius: BorderRadius.sm },
  foodImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImageEmoji: { fontSize: 24 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  foodBrand: { fontSize: FontSize.xs, color: Colors.gold, marginTop: 2 },
  foodServing: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  foodRight: { alignItems: 'flex-end' },
  foodCalories: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  foodKcal: { fontSize: FontSize.xs, color: Colors.textMuted },
  foodMacros: { flexDirection: 'row', gap: 6, marginTop: 4 },
  macroText: { fontSize: FontSize.xs, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textSecondary },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic' },
});
