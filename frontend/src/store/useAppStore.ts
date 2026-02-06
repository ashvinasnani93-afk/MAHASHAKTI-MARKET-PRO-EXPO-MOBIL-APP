import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface MarketData {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Market Data
  marketData: Record<string, MarketData>;
  updateMarketData: (symbol: string, data: MarketData) => void;
  clearMarketData: () => void;

  // System Status
  backendConnected: boolean;
  wsConnected: boolean;
  setBackendConnected: (connected: boolean) => void;
  setWsConnected: (connected: boolean) => void;

  // Settings
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Market Data
  marketData: {},
  updateMarketData: (symbol, data) =>
    set((state) => ({
      marketData: { ...state.marketData, [symbol]: data },
    })),
  clearMarketData: () => set({ marketData: {} }),

  // System Status
  backendConnected: false,
  wsConnected: false,
  setBackendConnected: (connected) => set({ backendConnected: connected }),
  setWsConnected: (connected) => set({ wsConnected: connected }),

  // Settings
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  setBackendUrl: (url) => set({ backendUrl: url }),

  // UI State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));