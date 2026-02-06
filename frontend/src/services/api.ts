import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-backend-url.com';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired - clear storage
          await AsyncStorage.removeItem('jwt_token');
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async getHealth() {
    const response = await this.api.get('/health');
    return response.data;
  }

  // System status
  async getStatus() {
    const response = await this.api.get('/api/status');
    return response.data;
  }

  // Option Chain
  async getOptionChain(symbol: string, expiry?: string) {
    const params = expiry ? { symbol, expiry } : { symbol };
    const response = await this.api.get('/api/option-chain', { params });
    return response.data;
  }

  // Signals
  async getSignal(symbol: string) {
    const response = await this.api.get('/api/signal', {
      params: { symbol },
    });
    return response.data;
  }

  // LTP (Last Traded Price)
  async getLTP(symbol: string) {
    const response = await this.api.get('/api/ltp', {
      params: { symbol },
    });
    return response.data;
  }

  // Scanner - Option Explosion
  async getScanner(filters?: any) {
    const response = await this.api.get('/api/scanner', {
      params: filters,
    });
    return response.data;
  }

  // Login (placeholder)
  async login(credentials: { username: string; password: string }) {
    // Placeholder - will be implemented later
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  // Logout
  async logout() {
    await AsyncStorage.removeItem('jwt_token');
  }
}

export default new ApiService();