import { getPower, updatePower } from "@/api/power/power";
import { create } from "zustand";

type PowerState = {
  power: boolean;
  loading: boolean;
  error: string | null;

  setPower: (power: boolean) => void;
  save: () => Promise<void>;
};

export const usePowerStore = create<PowerState>((set, get) => ({
  power: true,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getPower();
      set({ power: data.power });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // 🔄 CSAK HELYI FRISSÍTÉS: frissíti a data tömböt és a selected állapotot
  setPower: (power) => {
    set({power: power});
  },

  // 💾 SZERVERRE KÜLDÉS: a jelenleg kiválasztott szalag helyi állapotának mentése
  /* save: async () => {
    const { power, loading } = get();
    /* wsSend({
        type: "SET_POWER",
        data: power
    })

  }, */
   save: async () => {
    const { power, loading } = get();

    if (loading) return;

    set({ loading: true, error: null });
    try {
      await updatePower(power);
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
