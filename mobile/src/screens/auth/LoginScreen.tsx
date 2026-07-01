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
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

const loginSchema = z.object({
  email: z.string().email('The dark registry requires a valid email.'),
  password: z.string().min(8, 'Password too short for the dark gates.'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'The Gates Reject You',
        text2: error?.response?.data?.message || 'Invalid credentials. The dark gates remain sealed.',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.background, '#1A0A0A', Colors.background]}
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
            <Text style={styles.skull}>💀</Text>
            <Text style={styles.title}>Macro Counter</Text>
            <Text style={styles.subtitle}>O' Doom and Dispair</Text>
            <Text style={styles.tagline}>
              "Enter the sanctum. Your macros await judgment."
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>ENTER THE SANCTUM</Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="soul@doomvault.com"
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
                    label="Password"
                    placeholder="Your dark secret"
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
                title={isLoading ? 'Summoning...' : 'ENTER'}
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                fullWidth
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={onNavigateToRegister}
                style={styles.registerLink}
              >
                <Text style={styles.registerText}>
                  New soul?{' '}
                  <Text style={styles.registerHighlight}>Join the cursed ranks</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            "The macros shall be counted. The suffering shall be quantified."
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  skull: { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 280,
  },
  form: { flex: 1 },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loginButton: { marginTop: Spacing.sm },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  registerLink: { alignItems: 'center' },
  registerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  registerHighlight: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
  },
  eyeIcon: { fontSize: 18 },
});
