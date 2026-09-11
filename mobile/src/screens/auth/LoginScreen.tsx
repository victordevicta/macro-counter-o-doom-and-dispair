import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const { t } = useTranslation('auth');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().email(t('login.emailLabel')),
    password: z.string().min(8, t('register.validation.passwordTooShort')),
  });
  type LoginForm = z.infer<typeof loginSchema>;

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setUnverifiedEmail(null);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      const message = error?.response?.data?.message || t('login.errorFallback');
      if (error?.response?.status === 403) {
        setUnverifiedEmail(data.email);
      }
      Toast.show({
        type: 'error',
        text1: t('login.errorTitle'),
        text2: message,
        visibilityTime: 4000,
      });
    }
  };

  const onResendVerification = async () => {
    if (!unverifiedEmail) return;
    try {
      await authApi.resendVerification(unverifiedEmail);
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
    }
  };

  return (
    <LinearGradient
      colors={colors.gradient as any}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.tagline}>{t('login.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formCard}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('login.emailLabel')}
                    placeholder={t('login.emailPlaceholder')}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('login.passwordLabel')}
                    placeholder={t('login.passwordPlaceholder')}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry={!showPassword}
                    rightIcon={
                      <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    }
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              <Button
                title={isLoading ? t('login.enteringButton') : t('login.enterButton')}
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                fullWidth
                style={styles.loginButton}
              />

              {unverifiedEmail && (
                <TouchableOpacity onPress={onResendVerification} style={styles.resendLink}>
                  <Text style={styles.resendText}>{t('login.resendLink')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={onNavigateToRegister}
                style={styles.registerLink}
              >
                <Text style={styles.registerText}>
                  {t('login.registerPrompt')}{' '}
                  <Text style={styles.registerHighlight}>{t('login.registerLink')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: 80,
      paddingBottom: 40,
    },
    header: { alignItems: 'center', marginBottom: 40 },
    title: {
      fontSize: FontSize['3xl'],
      fontWeight: '900',
      color: colors.text.primary,
      letterSpacing: 1,
    },
    tagline: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: 12,
      maxWidth: 280,
    },
    form: { flex: 1 },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    loginButton: { marginTop: Spacing.sm },
    resendLink: { alignItems: 'center', marginTop: Spacing.md },
    resendText: {
      fontSize: FontSize.xs,
      color: colors.secondary,
      textDecorationLine: 'underline',
    },
    registerLink: { alignItems: 'center', marginTop: Spacing.lg },
    registerText: {
      fontSize: FontSize.sm,
      color: colors.text.secondary,
    },
    registerHighlight: {
      color: colors.primaryLight,
      fontWeight: '700',
    },
    eyeIcon: { fontSize: 18 },
  });
}
