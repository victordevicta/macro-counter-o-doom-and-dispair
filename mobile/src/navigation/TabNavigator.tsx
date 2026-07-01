import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { DiaryScreen } from '../screens/diary/DiaryScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { AddFoodScreen } from '../screens/diary/AddFoodScreen';
import { BarcodeScannerScreen } from '../screens/barcode/BarcodeScannerScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ThemeSelectScreen } from '../screens/settings/ThemeSelectScreen';
import { useTheme } from '../hooks/useTheme';
import { MealType } from '../types/diary.types';
import { Food } from '../types/food.types';

const Tab = createBottomTabNavigator();

type AppFlow =
  | { screen: 'tabs' }
  | { screen: 'search'; mealType: MealType }
  | { screen: 'barcode'; mealType?: MealType }
  | { screen: 'addFood'; food: Food; mealType: MealType }
  | { screen: 'themeSelect' };

export const TabNavigator: React.FC = () => {
  const [flow, setFlow] = useState<AppFlow>({ screen: 'tabs' });
  const theme = useTheme();
  const { colors, messages } = theme;

  const handleAddFood = (mealType: MealType) => setFlow({ screen: 'search', mealType });
  const handleFoodSelected = (food: Food, mealType: MealType) => setFlow({ screen: 'addFood', food, mealType });
  const handleScanBarcode = (mealType?: MealType) => setFlow({ screen: 'barcode', mealType });
  const handleBarcodeFood = (food: Food) => {
    const mealType = (flow as any).mealType ?? 'LUNCH';
    setFlow({ screen: 'addFood', food, mealType });
  };

  if (flow.screen === 'themeSelect') {
    return <ThemeSelectScreen onBack={() => setFlow({ screen: 'tabs' })} />;
  }
  if (flow.screen === 'search') {
    return (
      <SearchScreen
        mealType={flow.mealType}
        onFoodSelected={handleFoodSelected}
        onScanBarcode={() => handleScanBarcode(flow.mealType)}
      />
    );
  }
  if (flow.screen === 'barcode') {
    return (
      <BarcodeScannerScreen
        onFoodFound={handleBarcodeFood}
        onBack={() => setFlow({ screen: 'tabs' })}
      />
    );
  }
  if (flow.screen === 'addFood') {
    return (
      <AddFoodScreen
        food={flow.food}
        mealType={flow.mealType}
        onDone={() => setFlow({ screen: 'tabs' })}
        onBack={() => setFlow({ screen: 'search', mealType: flow.mealType })}
      />
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 4,
          height: 70,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { focused: string; outline: string }> = {
            Dashboard: { focused: 'skull', outline: 'skull-outline' },
            Diary: { focused: 'book', outline: 'book-outline' },
            Progress: { focused: 'trending-up', outline: 'trending-up-outline' },
            Profile: { focused: 'person', outline: 'person-outline' },
            Skins: { focused: 'color-palette', outline: 'color-palette-outline' },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={((focused ? icon?.focused : icon?.outline) ?? 'ellipse-outline') as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        children={() => (
          <DashboardScreen
            onNavigateToDiary={() => {}}
            onNavigateToSearch={() => setFlow({ screen: 'search', mealType: 'LUNCH' })}
          />
        )}
        options={{ tabBarLabel: messages.dashboardTitle.slice(0, 7) }}
      />
      <Tab.Screen
        name="Diary"
        children={() => <DiaryScreen onAddFood={handleAddFood} />}
        options={{ tabBarLabel: messages.diaryTitle.slice(0, 7) }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: messages.progressTitle.slice(0, 7) }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: messages.profileTitle.slice(0, 7) }}
      />
      <Tab.Screen
        name="Skins"
        children={() => <ThemeSelectScreen onBack={() => {}} />}
        options={{ tabBarLabel: 'Skins' }}
      />
    </Tab.Navigator>
  );
};
