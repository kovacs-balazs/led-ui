import { create } from "zustand";
import { getLedStrips, updateLedStrips } from "@/app/api/ledstrips/ledstrips";
import { LedStrip } from "@/types/types";

type LedStripsState = {
  data: LedStrip[];
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  update: (payload: any) => Promise<void>;
};

export const useLedStripsStore = create<LedStripsState>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLedStrips();
      set({ data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  update: async (payload) => {
    try {
      await updateLedStrips(payload);
      await useLedStripsStore.getState().fetch(); // re-sync
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
