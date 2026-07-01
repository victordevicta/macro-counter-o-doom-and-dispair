export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceCard: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  secondary: string;
  secondaryLight: string;
  secondaryGlow: string;
  accent: string;
  accentLight: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onPrimary: string;
    onDark: string;
  };
  macros: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  status: {
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
  };
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBackground: string;
  inputBorder: string;
  gradient: readonly [string, string, ...string[]];
  overlay: string;
  glow: string;
  // Legacy compat
  gold?: string;
  goldGlow?: string;
  sodium?: string;
  water?: string;
  white: string;
  transparent: string;
}

export interface ThemeMessages {
  // Companion reactive messages
  greeting: string[];
  proteinGoalReached: string[];
  calorieGoalReached: string[];
  calorieSurplus: string[];
  calorieDeficit: string[];
  mealAdded: string[];
  streakCongrats: string[];
  noDataYet: string[];
  goodMorning: string[];
  goodAfternoon: string[];
  goodEvening: string[];
  goodNight: string[];
  // UI Text (themed labels)
  dashboardTitle: string;
  diaryTitle: string;
  progressTitle: string;
  profileTitle: string;
  settingsTitle: string;
  caloriesLabel: string;
  proteinLabel: string;
  carbsLabel: string;
  fatLabel: string;
  fiberLabel: string;
  remainingLabel: string;
  consumedLabel: string;
  goalLabel: string;
  addFoodLabel: string;
  scanLabel: string;
  searchLabel: string;
  macroSectionTitle: string;
  microSectionTitle: string;
  statsSectionTitle: string;
  // Meal names
  mealNames: {
    BREAKFAST: string;
    LUNCH: string;
    DINNER: string;
    SNACK: string;
  };
}

export interface CompanionConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  avatarEmoji: string;
  personality: 'dark' | 'energetic' | 'chill' | 'intense' | 'sporty' | 'tech' | 'anime' | 'clean';
  accentColor: string;
  bubbleColor: string;
  textColor: string;
}

export interface AppTheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  emoji: string;
  tags: string[];
  locked: boolean;
  colors: ThemeColors;
  messages: ThemeMessages;
  companion: CompanionConfig;
}
