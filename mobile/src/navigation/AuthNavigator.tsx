import React, { useState } from 'react';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { VerifyEmailScreen } from '../screens/auth/VerifyEmailScreen';

type Screen = 'login' | 'register' | 'verify-email';

export const AuthNavigator: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  if (screen === 'register') {
    return (
      <RegisterScreen
        onNavigateToLogin={() => setScreen('login')}
        onRegistered={(email) => {
          setPendingEmail(email);
          setScreen('verify-email');
        }}
      />
    );
  }

  if (screen === 'verify-email') {
    return (
      <VerifyEmailScreen
        email={pendingEmail}
        onNavigateToLogin={() => setScreen('login')}
      />
    );
  }

  return (
    <LoginScreen onNavigateToRegister={() => setScreen('register')} />
  );
};
