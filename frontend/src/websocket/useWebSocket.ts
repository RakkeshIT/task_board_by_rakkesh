"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface WSMessage {
  type: string;
  data: any;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isManualCloseRef = useRef(false);
  const lastOnlineCountRef = useRef(1)


  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  const getReconnectDelay = () => {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    return delay;
  };

  const connect = useCallback(() => {
    // Don't connect if manually closed
    if (isManualCloseRef.current) return;

    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    console.log(`🔌 Connecting... (attempt ${reconnectAttemptsRef.current + 1})`);
    setIsReconnecting(true);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Connection timeout (5 seconds)
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log("Connection timeout");
          ws.close();
        }
      }, 5000);

      ws.onopen = () => {
        console.log(" Connected!");
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0; // Reset attempts
      };

      ws.onmessage = (event) => {
          console.log("🎯 RAW:", event.data);
        try {
          const msg: WSMessage = JSON.parse(event.data);
          console.log("🎯 PARSED:", msg.type, msg.data);
          setLastMessage(msg)
          if (msg.type === "PRESENCE") {
            setOnlineCount(msg.data.count);
            lastOnlineCountRef.current = msg.data.count;
          }
          
        } catch (err) {
          console.error("Invalid message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log(` Disconnected (code: ${event.code})`);
        setIsConnected(false);
        wsRef.current = null;

        // Auto reconnect (unless manual close)
        if (!isManualCloseRef.current) {
          const delay = getReconnectDelay();
          reconnectAttemptsRef.current++;
          
          console.log(` Reconnecting in ${delay}ms...`);
          setIsReconnecting(true);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error(" WebSocket Error:", error);
      };

    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      
      // Retry on failure
      const delay = getReconnectDelay();
      reconnectAttemptsRef.current++;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    }

  }, [url]);

  // Manual disconnect function
  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
    setIsReconnecting(false);
    setOnlineCount(1)
  }, []);

  // Connect on mount
  useEffect(() => {
    isManualCloseRef.current = false;
    connect();
    
    return () => {
    console.log("🔌 Cleaning up WebSocket...");
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect on window focus (user comes back)
  useEffect(() => {
    const handleFocus = () => {
      if (!isConnected && !isReconnecting) {
        console.log("🪟 Window focused, checking connection...");
        reconnectAttemptsRef.current = 0; // Reset for fresh attempt
        connect();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isConnected, isReconnecting, connect]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Network online");
      if (!isConnected) {
        reconnectAttemptsRef.current = 0;
        connect();
      }
    };

    const handleOffline = () => {
      console.log("📴 Network offline");
      setIsConnected(false);
      setIsReconnecting(true)
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isConnected, connect]);

  return {
    isConnected,
    isReconnecting,
    lastMessage,
    onlineCount: isConnected ? onlineCount : lastOnlineCountRef.current,
    disconnect,
  };
}