import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { ALL_THEMES, AppTheme } from '../../themes';

interface Props {
  onBack: () => void;
}

const ThemeCard: React.FC<{
  theme: AppTheme;
  isActive: boolean;
  onSelect: () => void;
}> = ({ theme, isActive, onSelect }) => {
  const { colors } = theme;
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: isActive ? 2 : 1,
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.85}
    >
      {/* Preview header */}
      <LinearGradient
        colors={colors.gradient as any}
        style={styles.cardPreview}
      >
        <Text style={styles.cardEmoji}>{theme.emoji}</Text>
        {/* Fake macro bars */}
        <View style={styles.previewBars}>
          <View style={[styles.previewBar, { backgroundColor: colors.macros.protein, width: '70%' }]} />
          <View style={[styles.previewBar, { backgroundColor: colors.macros.carbs, width: '55%' }]} />
          <View style={[styles.previewBar, { backgroundColor: colors.macros.fat, width: '40%' }]} />
        </View>
      </LinearGradient>

      {/* Card body */}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardName, { color: colors.text.primary }]}>{theme.displayName}</Text>
          {isActive && (
            <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.activeBadgeText, { color: colors.text.onPrimary }]}>ACTIVE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardDesc, { color: colors.text.muted }]} numberOfLines={2}>
          {theme.description}
        </Text>

        {/* Companion */}
        <View style={styles.companionRow}>
          <Text style={styles.companionEmoji}>{theme.companion.avatarEmoji}</Text>
          <Text style={[styles.companionName, { color: colors.text.secondary }]}>
            {theme.companion.name} — {theme.companion.title}
          </Text>
        </View>

        {/* Color dots */}
        <View style={styles.colorDots}>
          {[colors.primary, colors.secondary, colors.macros.protein, colors.macros.carbs, colors.macros.fat].map((c, i) => (
            <View key={i} style={[styles.colorDot, { backgroundColor: c }]} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ThemeSelectScreen: React.FC<Props> = ({ onBack }) => {
  const activeTheme = useTheme();
  const { themeId, setTheme } = useThemeStore();
  const colors = activeTheme.colors;
  const messages = activeTheme.messages;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={activeTheme.id === 'clean' ? 'dark-content' : 'light-content'} />
      <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {messages.settingsTitle}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            CHOOSE YOUR SKIN
          </Text>
          <Text style={[styles.sectionSub, { color: colors.text.muted }]}>
            Each skin changes the entire experience — colors, messages, companion, and personality.
          </Text>

          {ALL_THEMES.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === themeId}
              onSelect={() => setTheme(theme.id)}
            />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  sectionSub: { fontSize: 13, lineHeight: 18, marginBottom: 20 },
  card: { borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  cardPreview: { height: 90, padding: 14, justifyContent: 'space-between' },
  cardEmoji: { fontSize: 28 },
  previewBars: { gap: 4 },
  previewBar: { height: 4, borderRadius: 2 },
  cardBody: { padding: 14, gap: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: 17, fontWeight: '800' },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  activeBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  cardDesc: { fontSize: 12, lineHeight: 17 },
  companionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  companionEmoji: { fontSize: 18 },
  companionName: { fontSize: 11, fontStyle: 'italic', flex: 1 },
  colorDots: { flexDirection: 'row', gap: 6, marginTop: 4 },
  colorDot: { width: 14, height: 14, borderRadius: 7 },
});
