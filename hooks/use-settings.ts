import { getSettings, updateSettings } from "@/api/settings/settings";
import { Settings } from "@/types/types";
import { create } from "zustand";

type SettingsState = {
  data: Settings;
  loading: boolean;
  error: string | null;

  setSettings: (settings: Settings) => void;
  fetch: () => Promise<void>;
  update: (partial: Partial<Settings>) => void;
  updateWiFi: (partial: Partial<Settings["wifi"]>) => void;
  save: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  data: {
    wifi: { name: "Roxy-AP", password: "12345678" },
    bluetoothName: "Betti-BT",
  },
  loading: false,
  error: null,

  setSettings: (settings) => {
    set({data: settings})
  },

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getSettings();
      set({ data: data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // 🔄 CSAK HELYI FRISSÍTÉS: frissíti a data tömböt és a selected állapotot
  update: (partial) => {
    set((state) => {
      return { data: { ...state.data, ...partial } };
    });
  },

  updateWiFi: (partial) => {
    set((state) => {
      return {
        data: { ...state.data, wifi: { ...state.data.wifi, ...partial } },
      };
    });
  },

  // 💾 SZERVERRE KÜLDÉS: a jelenleg kiválasztott szalag helyi állapotának mentése
  save: async () => {
    const { data, loading } = get();

    if (loading) return;

    set({ loading: true, error: null });
    try {
      await updateSettings(data);
      // const refreshedData = await getSettings();
      set({ loading: false });
      // console.log("Visszajött adat", refreshedData);
    } catch (e) {
      set({
        error: `Save failed: ${(e as Error).message}`,
        loading: false,
      });
    }
  },
}));
