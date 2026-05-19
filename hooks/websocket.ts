import { API_PORT, DEVICE_IP } from "@/api/api";
import { useLedStripsStore } from "./use-ledstrips";
import { usePowerStore } from "./use-power";
import { useSettingsStore } from "./use-settings";
import { useConnectionStore } from "./use-connection-store";

let ws: WebSocket | null = null;
let reconnectTimeout: any = null;
let connecting = false;
let pingInterval: any = null;

const WS_RECONNECT_DELAY = 2000;

const setConnectionOffline = () => {
  useConnectionStore.getState().setStatus("DEVICE_OFFLINE");
  useConnectionStore.getState().setLoading(false);
};

const setConnectionConnected = () => {
  useConnectionStore.getState().setStatus("CONNECTED");
  useConnectionStore.getState().setLoading(false);
};

const connectWebSocket = () => {
  if (
    connecting ||
    ws?.readyState === WebSocket.OPEN ||
    ws?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  connecting = true;

  const url = `ws://${DEVICE_IP}:${API_PORT}/ws`;
  console.log("Connecting WS:", url);

  ws = new WebSocket(url);

  ws.onopen = () => {
    connecting = false;
    console.log("WS connected");

    setConnectionConnected();

    // START HEARTBEAT
    if (pingInterval) clearInterval(pingInterval);

    pingInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "PING" }));
      }
    }, 15000);
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "INIT": {
          const { ledStrips, settings, power } = msg.data;

          const store = useLedStripsStore.getState();
          const oldSelectedId = store.selectedId;

          const newSelected =
            ledStrips.find((s: any) => s.id === oldSelectedId)?.id ??
            ledStrips[0]?.id ??
            null;

          store.setData(ledStrips);
          store.setSelectedId(newSelected);

          useSettingsStore.getState().setSettings(settings);
          usePowerStore.getState().setPower(power);
          break;
        }

        case "LED_STRIPS": {
          const data = msg.data;

          const store = useLedStripsStore.getState();
          const oldSelectedId = store.selectedId;

          const newSelected = data.find((s: any) => s.id === oldSelectedId)?.id ?? data[0]?.id ?? null;

          store.setData(data);
          store.setSelectedId(newSelected);

          break;
        }

        case "SETTINGS": {
          useSettingsStore.getState().setSettings(msg.data);
          break;
        }

        case "POWER": {
          usePowerStore.getState().setPower(msg.data);
          break;
        }
      }

    } catch (e) {
      console.error("WS parse error", e);
    }
  };

  ws.onclose = () => {
    ws = null;
    connecting = false;

    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }

    setConnectionOffline();

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }

    reconnectTimeout = setTimeout(connectWebSocket, WS_RECONNECT_DELAY); // csak egyszer!
  };

  ws.onerror = (e) => {
    console.error("WS error", e);

    setConnectionOffline();
    ws?.close();
  };
};

export const disconnectWebSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  ws?.close();
};

export const wsSend = (msg: any) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  } else {
    console.warn("WS not connected");
  }
};

export { connectWebSocket };

