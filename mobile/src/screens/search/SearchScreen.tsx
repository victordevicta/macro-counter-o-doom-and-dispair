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
import { useTranslation } from 'react-i18next';
import { foodsApi } from '../../api/foods.api';
import { Input } from '../../components/ui/Input';
import { useThemeColors, useThemeMessages } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
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
  const { t } = useTranslation('search');
  const colors = useThemeColors();
  const messages = useThemeMessages();
  const styles = makeStyles(colors);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'favorites'>('recent');

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
            <Text style={styles.foodImageEmoji}>🍽️</Text>
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
        <Text style={styles.foodKcal}>{t('kcal')}</Text>
        <View style={styles.foodMacros}>
          <Text style={[styles.macroText, { color: colors.macros.protein }]}>
            {Math.round(food.proteinG)}P
          </Text>
          <Text style={[styles.macroText, { color: colors.macros.carbs }]}>
            {Math.round(food.carbsG)}C
          </Text>
          <Text style={[styles.macroText, { color: colors.macros.fat }]}>
            {Math.round(food.fatG)}F
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [mealType, onFoodSelected]);

  return (
    <LinearGradient
      colors={colors.gradient as any}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>{t('subtitleFor', { meal: messages.mealNames[mealType].toLowerCase() })}</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Input
              placeholder={t('searchPlaceholder')}
              value={query}
              onChangeText={handleQueryChange}
              leftIcon={
                <Ionicons name="search" size={18} color={colors.text.muted} />
              }
              containerStyle={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.scanButton} onPress={onScanBarcode}>
            <Ionicons name="barcode-outline" size={24} color={colors.text.onPrimary} />
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
                {t(`tabs.${tab === 'search' ? 'results' : tab}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryLight} />
          <Text style={styles.loadingText}>{t('loadingText')}</Text>
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
              <Text style={styles.emptyTitle}>
                {activeTab === 'favorites'
                  ? t('empty.favoritesTitle')
                  : activeTab === 'recent'
                    ? t('empty.recentTitle')
                    : t('empty.searchTitle')}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'search' && query.length < 2
                  ? t('empty.searchHintShort')
                  : t('empty.searchHintDefault')}
              </Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    header: { paddingHorizontal: Spacing.base, paddingTop: 52, paddingBottom: Spacing.sm },
    title: { fontSize: FontSize['2xl'], fontWeight: '900', color: colors.text.primary },
    subtitle: { fontSize: FontSize.sm, color: colors.text.muted, marginBottom: 12 },
    searchRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    searchInputWrapper: { flex: 1 },
    searchInput: { marginBottom: 0 },
    scanButton: {
      width: 52,
      height: 52,
      backgroundColor: colors.primary,
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
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabActive: { borderColor: colors.primaryLight, backgroundColor: colors.primaryGlow },
    tabText: { fontSize: FontSize.xs, fontWeight: '700', color: colors.text.muted },
    tabTextActive: { color: colors.primaryLight },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
    loadingText: { color: colors.text.muted },
    listContent: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
    foodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    foodLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    foodImage: { width: 44, height: 44, borderRadius: BorderRadius.sm },
    foodImagePlaceholder: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.sm,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    foodImageEmoji: { fontSize: 24 },
    foodInfo: { flex: 1 },
    foodName: { fontSize: FontSize.sm, fontWeight: '700', color: colors.text.primary },
    foodBrand: { fontSize: FontSize.xs, color: colors.secondary, marginTop: 2 },
    foodServing: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 2 },
    foodRight: { alignItems: 'flex-end' },
    foodCalories: {
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    foodKcal: { fontSize: FontSize.xs, color: colors.text.muted },
    foodMacros: { flexDirection: 'row', gap: 6, marginTop: 4 },
    macroText: { fontSize: FontSize.xs, fontWeight: '700' },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyTitle: { fontSize: FontSize.base, fontWeight: '700', color: colors.text.secondary },
    emptySubtitle: { fontSize: FontSize.sm, color: colors.text.muted },
  });
}
