import React, { useState } from 'react';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

export const AuthNavigator: React.FC = () => {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (screen === 'register') {
    return (
      <RegisterScreen onNavigateToLogin={() => setScreen('login')} />
    );
  }

  return (
    <LoginScreen onNavigateToRegister={() => setScreen('register')} />
  );
};
