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

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Name too short for the registry.')
    .max(20, 'Name too long for the registry.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores.'),
  email: z.string().email('Invalid soul address.'),
  password: z
    .string()
    .min(8, 'The darkness demands at least 8 characters.')
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password requires uppercase, lowercase and a number.',
    ),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.username, data.email, data.password);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Cursed',
        text2: error?.response?.data?.message || 'The dark registry rejects your inscription.',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.background, '#0A0A1A', Colors.background]}
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
            <Text style={styles.skull}>🩸</Text>
            <Text style={styles.title}>Inscribe Your Soul</Text>
            <Text style={styles.tagline}>
              "Join the cursed registry. Begin your nutritional suffering."
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>SOUL REGISTRATION</Text>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  placeholder="doomed_warrior"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  hint="Your identity in the dark realm"
                />
              )}
            />

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
                  label="Dark Password"
                  placeholder="Your cursed secret"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  hint="Uppercase, lowercase, number required"
                />
              )}
            />

            <Button
              title={isLoading ? 'Inscribing...' : 'JOIN THE CURSED'}
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
                Already cursed?{' '}
                <Text style={styles.loginHighlight}>Enter the sanctum</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            "The void awaits your macros."
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
  header: { alignItems: 'center', marginBottom: 32 },
  skull: { fontSize: 56, marginBottom: 12 },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 280,
  },
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
  registerButton: { marginTop: Spacing.sm },
  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginHighlight: { color: Colors.primaryLight, fontWeight: '700' },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
  },
});
