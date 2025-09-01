'use client';
import { useEffect, useState } from "react";

const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!wsUrl) {
      console.log("NEXT_PUBLIC_WS_URL is not defined");
      return;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};

export default useSocket;
