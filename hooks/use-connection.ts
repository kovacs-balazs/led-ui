import * as Network from "expo-network";
import { useCallback, useEffect, useRef, useState } from "react";

export type RadxaStatus = "NOT_WIFI" | "DEVICE_OFFLINE" | "CONNECTED";

const RADXA_IP = "192.168.1.202";
const RADXA_PORT = 8000;
const TIMEOUT = 3000;

async function checkDevice(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(
      `http://${RADXA_IP}:${RADXA_PORT}/api/health`,
      {
        signal: controller.signal,
      },
    );

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

export function useConnection(pollInterval = 5000) {
  const [status, setStatus] = useState<RadxaStatus>("DEVICE_OFFLINE");
  const [loading, setLoading] = useState<boolean>(false);

  const isCheckingRef = useRef(false);

  const checkConnection = useCallback(async () => {
    if (isCheckingRef.current) return;

    isCheckingRef.current = true;
    setLoading(true);

    try {
      const network = await Network.getNetworkStateAsync();

      if (network.type !== Network.NetworkStateType.WIFI) {
        setStatus("NOT_WIFI");
        return;
      }

      const alive = await checkDevice();

      if (!alive) {
        setStatus("DEVICE_OFFLINE");
        return;
      }

      setStatus("CONNECTED");
    } finally {
      setLoading(false);
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    checkConnection();

    const interval = setInterval(() => {
      checkConnection();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [checkConnection, pollInterval]);

  return {
    status,
    loading,
    isConnected: status === "CONNECTED",
    refresh: checkConnection,
  };
}
