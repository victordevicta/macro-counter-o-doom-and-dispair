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
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegistered: (email: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin, onRegistered }) => {
  const { t } = useTranslation('auth');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = z.object({
    username: z.string().max(100, t('register.validation.usernameTooLong')),
    email: z.string().email(t('register.validation.emailInvalid')),
    password: z
      .string()
      .min(8, t('register.validation.passwordTooShort'))
      .regex(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).+$/,
        t('register.validation.passwordComplexity'),
      ),
  });
  type RegisterForm = z.infer<typeof registerSchema>;

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.username, data.email, data.password);
      onRegistered(data.email);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('register.errorTitle'),
        text2: error?.response?.data?.message || t('register.errorFallback'),
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
            <Text style={styles.title}>{t('register.title')}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('register.formTitle')}</Text>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('register.usernameLabel')}
                  placeholder={t('register.usernamePlaceholder')}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  hint={t('register.usernameHint')}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('register.emailLabel')}
                  placeholder={t('register.emailPlaceholder')}
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
                  label={t('register.passwordLabel')}
                  placeholder={t('register.passwordPlaceholder')}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  hint={t('register.passwordHint')}
                />
              )}
            />

            <Button
              title={isLoading ? t('register.submittingButton') : t('register.submitButton')}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              fullWidth
              style={styles.registerButton}
            />

            <TouchableOpacity
              onPress={onNavigateToLogin}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                {t('register.loginPrompt')}{' '}
                <Text style={styles.loginHighlight}>{t('register.loginLink')}</Text>
              </Text>
            </TouchableOpacity>
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
    header: { alignItems: 'center', marginBottom: 32 },
    title: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
      letterSpacing: 0.5,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formTitle: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: colors.secondary,
      letterSpacing: 3,
      textTransform: 'uppercase',
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    registerButton: { marginTop: Spacing.sm },
    loginLink: { alignItems: 'center', marginTop: Spacing.lg },
    loginText: { fontSize: FontSize.sm, color: colors.text.secondary },
    loginHighlight: { color: colors.primaryLight, fontWeight: '700' },
  });
}
