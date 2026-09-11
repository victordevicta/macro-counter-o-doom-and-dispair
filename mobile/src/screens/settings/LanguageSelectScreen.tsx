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
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguageStore } from '../../store/languageStore';
import { useTheme } from '../../hooks/useTheme';
import { LANGUAGE_REGISTRY } from '../../i18n/languages';

interface Props {
  onBack: () => void;
}

export const LanguageSelectScreen: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const activeTheme = useTheme();
  const { languageId, setLanguage } = useLanguageStore();
  const colors = activeTheme.colors;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.primary }]}>← {t('common:back', { defaultValue: 'Back' })}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {t('language.sectionTitle')}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            {t('language.sectionTitle')}
          </Text>
          <Text style={[styles.sectionSub, { color: colors.text.muted }]}>
            {t('language.sectionSubtitle')}
          </Text>

          {LANGUAGE_REGISTRY.map((lang) => {
            const isActive = lang.id === languageId;
            return (
              <TouchableOpacity
                key={lang.id}
                disabled={lang.locked}
                onPress={() => setLanguage(lang.id as 'en' | 'pt-BR')}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                    borderWidth: isActive ? 2 : 1,
                    opacity: lang.locked ? 0.5 : 1,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.flag}>{lang.flagEmoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={[styles.nativeName, { color: colors.text.primary }]}>{lang.nativeName}</Text>
                  <Text style={[styles.englishName, { color: colors.text.muted }]}>{lang.englishName}</Text>
                </View>
                {lang.locked ? (
                  <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.badgeText, { color: colors.text.muted }]}>{t('language.comingSoon')}</Text>
                  </View>
                ) : isActive ? (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.badgeText, { color: colors.text.onPrimary }]}>✓</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}

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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  flag: { fontSize: 32 },
  cardInfo: { flex: 1 },
  nativeName: { fontSize: 16, fontWeight: '700' },
  englishName: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
