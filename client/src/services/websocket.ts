type EventCallback = (event: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectInterval: number = 3000;
  private isExplicitClose: boolean = false;

  connect(url?: string) {
    const defaultWsUrl = typeof window !== 'undefined'
      ? (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + 
        (window.location.port === '5173' ? 'localhost:5000' : window.location.host)
      : 'ws://localhost:5000';
    const targetUrl = url || (import.meta.env.VITE_WS_URL as string) || defaultWsUrl;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(targetUrl);

      this.socket.onopen = () => {
        console.log('[Telemetry WS] Connected to automation stream');
        this.emit('connection_change', { connected: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.emit(parsed.type, parsed.data);
          this.emit('*', parsed);
        } catch (e) {
          console.error('[Telemetry WS] Parse error', e);
        }
      };

      this.socket.onclose = () => {
        console.warn('[Telemetry WS] Disconnected');
        this.emit('connection_change', { connected: false });
        if (!this.isExplicitClose) {
          setTimeout(() => this.connect(url), this.reconnectInterval);
        }
      };

      this.socket.onerror = (err) => {
        console.error('[Telemetry WS] Error', err);
      };
    } catch (e) {
      console.error('[Telemetry WS] Connection failed', e);
      setTimeout(() => this.connect(url), this.reconnectInterval);
    }
  }

  on(eventType: string, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType: string, callback: EventCallback) {
    this.listeners.get(eventType)?.delete(callback);
  }

  private emit(eventType: string, data: any) {
    this.listeners.get(eventType)?.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error('[Telemetry WS] Listener error', e);
      }
    });
  }

  close() {
    this.isExplicitClose = true;
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const wsService = new WebSocketService();
