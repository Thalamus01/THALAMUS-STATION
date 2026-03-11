import { useState, useEffect, useRef, useCallback } from 'react';

export interface SentinelState {
  balance: number;
  equity: number;
  profit: number;
  positions: any[];
  ticks: Record<string, any>;
  lastUpdate: number;
  isConnected: boolean;
  latency: number;
  mode: 'HUNTER' | 'CONSERVATION' | 'SHELTER';
  dangerIndex: number;
  emotionalIntensity: number;
  disciplineScore: number;
  detectedBiases: any[];
}

export const useSentinelRealtime = (accountId: string, key: string) => {
  const [state, setState] = useState<SentinelState>({
    balance: 0,
    equity: 0,
    profit: 0,
    positions: [],
    ticks: {},
    lastUpdate: Date.now(),
    isConnected: false,
    latency: 0,
    mode: 'HUNTER',
    dangerIndex: 0,
    emotionalIntensity: 0,
    disciplineScore: 100,
    detectedBiases: []
  });

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatSentRef = useRef<number>(0);
  const backoffRef = useRef<number>(1000);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    console.log(`[SENTINEL] Connecting to ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[SENTINEL] WebSocket Connected");
      setState(prev => ({ ...prev, isConnected: true }));
      backoffRef.current = 1000;

      // Subscribe to account
      socket.send(JSON.stringify({ type: 'SUBSCRIBE', accountId, key }));

      // Start heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          lastHeartbeatSentRef.current = Date.now();
          socket.send(JSON.stringify({ type: 'HEARTBEAT' }));
        }
      }, 5000);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'UPDATE') {
          setState(prev => ({
            ...prev,
            ...message.data,
            lastUpdate: Date.now(),
            isConnected: true
          }));
        } else if (message.type === 'HEARTBEAT_ACK') {
          const latency = Date.now() - lastHeartbeatSentRef.current;
          setState(prev => ({ ...prev, latency }));
        }
      } catch (e) {
        console.error("[SENTINEL] Message error:", e);
      }
    };

    socket.onclose = () => {
      console.log("[SENTINEL] WebSocket Disconnected");
      setState(prev => ({ ...prev, isConnected: false }));
      clearInterval(heartbeatIntervalRef.current!);
      
      // Reconnect with exponential backoff
      reconnectTimeoutRef.current = setTimeout(() => {
        backoffRef.current = Math.min(backoffRef.current * 2, 30000);
        connect();
      }, backoffRef.current);
    };

    socket.onerror = (err) => {
      console.error("[SENTINEL] WebSocket Error:", err);
      socket.close();
    };
  }, [accountId, key]);

  // Fallback Polling for Serverless (Vercel)
  useEffect(() => {
    if (state.isConnected) return;

    const poll = async () => {
      try {
        const response = await fetch(`/api/trading-data?id=${accountId}&key=${key}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok') {
            setState(prev => ({
              ...prev,
              ...data,
              lastUpdate: Date.now(),
              // We don't set isConnected to true for polling to keep the UI aware it's fallback
              latency: 0 
            }));
          }
        }
      } catch (e) {
        console.error("[SENTINEL] Polling error:", e);
      }
    };

    const interval = setInterval(poll, 2000);
    poll(); // Initial poll

    return () => clearInterval(interval);
  }, [accountId, key, state.isConnected]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, [connect]);

  return state;
};

export default useSentinelRealtime;
