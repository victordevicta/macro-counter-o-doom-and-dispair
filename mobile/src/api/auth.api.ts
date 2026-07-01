import { apiClient, saveTokens, clearTokens } from './client';
import { AuthTokens, LoginForm, RegisterForm } from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterForm): Promise<AuthTokens> => {
    const response = await apiClient.post('/auth/register', data);
    const tokens = response.data || response;
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
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
