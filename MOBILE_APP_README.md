# 🚀 Mahashakti Market Pro - React Native Mobile App

**Production-Ready Stock Market Trading Platform with Real-time Option Scanner & Advanced Signal Engine**

[![React Native](https://img.shields.io/badge/React_Native-0.81-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-purple)](https://github.com/pmndrs/zustand)

---

## 📖 Overview

Mahashakti Market Pro is a **professional mobile trading platform** built with React Native and Expo, designed to connect to your existing Node.js backend for real-time market data, trading signals, and option chain analysis.

### ✨ Key Features

- **📊 Dashboard**: Live indices tracking (NIFTY, BANKNIFTY, FINNIFTY)
- **⚡ Trading Signals**: Advanced signal engine with 5 signal types
- **🔍 Option Chain Viewer**: Real-time CE/PE strike data
- **🚨 Scanner**: 15-20% explosive move detection
- **⚙️ Settings**: Backend configuration & system status
- **🌙 Dark Theme**: Professional dark UI optimized for mobile
- **📱 Cross-Platform**: iOS, Android & Web support

---

## 🏗️ Project Structure

```
/app/frontend/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx              # Root layout with tab navigation
│   └── (tabs)/                  # Bottom tab screens
│       ├── index.tsx            # Dashboard
│       ├── signals.tsx          # Signals
│       ├── option-chain.tsx     # Option Chain
│       ├── scanner.tsx          # Scanner
│       └── settings.tsx         # Settings
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── MarketCard.tsx      # Index card component
│   │   └── SignalCard.tsx      # Signal display card
│   │
│   ├── screens/                 # Main screen components
│   │   ├── Dashboard.tsx       # Dashboard logic
│   │   ├── Signals.tsx         # Signals logic
│   │   ├── OptionChain.tsx     # Option chain logic
│   │   ├── Scanner.tsx         # Scanner logic
│   │   └── Settings.tsx        # Settings logic
│   │
│   ├── services/                # Backend & WebSocket services
│   │   ├── api.ts              # Axios API client
│   │   └── websocket.ts        # Socket.io WebSocket client
│   │
│   ├── store/                   # State management
│   │   └── useAppStore.ts      # Zustand global store
│   │
│   └── theme/                   # Design system
│       └── colors.ts            # Color palette & spacing
│
├── assets/                      # Images & fonts
├── .env                         # Environment variables
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- Yarn or npm
- Expo Go app (for mobile testing)
- Your Node.js backend deployed and running

### Installation

```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies
yarn install

# Start Expo dev server
yarn start

# Start for specific platforms
yarn android    # Android emulator/device
yarn ios        # iOS simulator/device
yarn web        # Web browser
```

### Environment Variables

Update `/app/frontend/.env`:

```env
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

**Important**: Change this to your actual Node.js backend URL!

---

## 📱 Screens Overview

### 1. **Dashboard** 📊
- **Purpose**: Real-time market overview
- **Features**:
  - Live indices (NIFTY, BANKNIFTY, FINNIFTY)
  - System status (Backend, WebSocket, Angel One)
  - Pull-to-refresh
  - Auto-updates via WebSocket

### 2. **Signals** ⚡
- **Purpose**: Trading signal recommendations
- **Features**:
  - 5 Signal Types: STRONG_BUY, BUY, WAIT, SELL, STRONG_SELL
  - EMA 20/50 trend analysis
  - RSI sanity checks
  - Volume confirmation
  - Search & filter by signal type
  - Watchlist tracking

### 3. **Option Chain** 🔗
- **Purpose**: Option strike analysis
- **Features**:
  - CE/PE strike table
  - ATM (At The Money) highlighting
  - Multiple expiry dates
  - Real-time LTP updates
  - Symbol switcher (NIFTY, BANKNIFTY, FINNIFTY)
  - Spot price display

### 4. **Scanner** 🔍
- **Purpose**: Detect explosive option moves
- **Features**:
  - 15-20% price explosion detection
  - 5x volume spike alerts
  - 15%+ OI change tracking
  - Real-time WebSocket alerts
  - Filter by: Price, Volume, OI
  - Smart money entry detection

### 5. **Settings** ⚙️
- **Purpose**: App configuration
- **Features**:
  - Backend URL configuration
  - Connection testing
  - System status monitoring
  - Push notification toggle
  - Auto-refresh toggle
  - Cache management
  - Logout (placeholder)

---

## 🔌 Backend API Integration

### API Endpoints

Your mobile app expects these endpoints from your Node.js backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/status` | GET | System status (Angel login, WebSocket) |
| `/api/ltp?symbol=NIFTY` | GET | Last Traded Price |
| `/api/option-chain?symbol=NIFTY` | GET | Option chain data |
| `/api/signal?symbol=RELIANCE` | GET | Trading signals |
| `/api/scanner` | GET | Scanner alerts |

### WebSocket Events

```typescript
// Subscribe to real-time updates
webSocketService.subscribe('ltp_update', (data) => {
  // Handle LTP updates
});

webSocketService.subscribe('scanner_alert', (data) => {
  // Handle scanner alerts
});
```

---

## 📦 Building for Production

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 📞 Support & Next Steps

### To Connect to Your Backend:

1. **Update Environment Variables**:
   ```bash
   # Edit /app/frontend/.env
   EXPO_PUBLIC_BACKEND_URL=https://your-deployed-backend.com
   ```

2. **Restart Expo**:
   ```bash
   sudo supervisorctl restart expo
   ```

3. **Test Connection**:
   - Open Settings screen
   - Tap "Test Connection"
   - Verify backend status

---

**Built with ❤️ for Indian Stock Market Traders**

**Happy Trading! 📈**
