import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface VerifyEmailScreenProps {
  email: string;
  onNavigateToLogin: () => void;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  email,
  onNavigateToLogin,
}) => {
  const { t } = useTranslation('auth');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const [isResending, setIsResending] = useState(false);

  const onResend = async () => {
    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      Toast.show({
        type: 'success',
        text1: t('verifyEmail.resendSuccessTitle'),
        text2: t('verifyEmail.resendSuccessMessage'),
        visibilityTime: 4000,
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: t('verifyEmail.resendErrorTitle'),
        text2: t('verifyEmail.resendErrorMessage'),
        visibilityTime: 4000,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.gradient as any}
      style={styles.gradient}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('verifyEmail.title')}</Text>
        <Text style={styles.tagline}>{t('verifyEmail.tagline')}</Text>

        <View style={styles.card}>
          <Text style={styles.message}>{t('verifyEmail.message')}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.hint}>{t('verifyEmail.hint')}</Text>

          <Button
            title={isResending ? t('verifyEmail.resendingButton') : t('verifyEmail.resendButton')}
            onPress={onResend}
            isLoading={isResending}
            fullWidth
            style={styles.resendButton}
          />

          <TouchableOpacity onPress={onNavigateToLogin} style={styles.loginLink}>
            <Text style={styles.loginText}>
              {t('verifyEmail.loginPrompt')}{' '}
              <Text style={styles.loginHighlight}>{t('verifyEmail.loginLink')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    title: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
      textAlign: 'center',
    },
    tagline: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 32,
      maxWidth: 280,
    },
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    message: {
      fontSize: FontSize.sm,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    email: {
      fontSize: FontSize.md,
      fontWeight: '700',
      color: colors.secondary,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 16,
    },
    hint: {
      fontSize: FontSize.xs,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    resendButton: { marginTop: Spacing.sm },
    loginLink: { alignItems: 'center', marginTop: Spacing.lg },
    loginText: { fontSize: FontSize.sm, color: colors.text.secondary },
    loginHighlight: { color: colors.primaryLight, fontWeight: '700' },
  });
}
