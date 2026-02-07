import { io, Socket } from 'socket.io-client';

const WS_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://mahshakti-market-pro-production.up.railway.app';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket && this.isConnected) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');
    
    this.socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket Connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket Disconnected');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ WebSocket Error:', error);
    });

    // Listen for LTP updates
   this.socket.on('ltp_update', (data) => {
  console.log('📈 LTP Update Received:', data);

  if (!data || !data.symbol) return;

  this.emit('ltp_update', {
    symbol: data.symbol,
    ltp: data.ltp,
    change: data.change,
    percentChange: data.percentChange,
  });
});

    // Listen for scanner alerts
    this.socket.on('scanner_alert', (data) => {
      this.emit('scanner_alert', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket Disconnected');
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Subscribe to symbol LTP
 subscribeToSymbol(symbol: string) {
  if (!this.socket) return;

  const subscribeAction = () => {
    console.log('📡 Subscribing to:', symbol);
    this.socket?.emit('subscribe_symbol', { symbol });
  };

  if (this.isConnected) {
    subscribeAction();
  } else {
    this.socket.once('connect', subscribeAction);
  }
}

  // Unsubscribe from symbol
  unsubscribeFromSymbol(symbol: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('unsubscribe', { symbol });
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default new WebSocketService();
