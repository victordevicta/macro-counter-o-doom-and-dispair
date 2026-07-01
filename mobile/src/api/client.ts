import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { storage } from './storage';

const BASE_URL = __DEV__
  ? Platform.OS === 'web'
    ? 'http://localhost:3000/api/v1'       // browser no mesmo PC
    : 'http://192.168.15.16:3000/api/v1'   // celular físico via Wi-Fi
  : 'https://api.macrocounterdoom.com/api/v1';

const ACCESS_TOKEN_KEY = 'doom_access_token';
const REFRESH_TOKEN_KEY = 'doom_refresh_token';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = response.data.data || response.data;

        await storage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await storage.setItem(REFRESH_TOKEN_KEY, newRefresh);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch {
        await storage.deleteItem(ACCESS_TOKEN_KEY);
        await storage.deleteItem(REFRESH_TOKEN_KEY);
        throw error;
      }
    }

    return Promise.reject(error);
  },
);

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await Promise.all([
    storage.setItem(ACCESS_TOKEN_KEY, accessToken),
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken),
  ]);
};

export const clearTokens = async () => {
  await Promise.all([
    storage.deleteItem(ACCESS_TOKEN_KEY),
    storage.deleteItem(REFRESH_TOKEN_KEY),
  ]);
};

export const getAccessToken = () => storage.getItem(ACCESS_TOKEN_KEY);
