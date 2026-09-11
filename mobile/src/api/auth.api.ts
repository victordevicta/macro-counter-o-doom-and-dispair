import { apiClient, saveTokens, clearTokens } from './client';
import { AuthTokens, LoginForm, RegisterForm, RegisterResponse } from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterForm): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data || response;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data || response;
  },

  login: async (data: LoginForm): Promise<AuthTokens> => {
    const response = await apiClient.post('/auth/login', data);
    const tokens = response.data || response;
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  logout: async (refreshToken?: string) => {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } finally {
      await clearTokens();
    }
  },
};
