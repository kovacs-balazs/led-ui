import { create } from "zustand";
import { getLedStrips, updateLedStrips } from "@/api/ledstrips/ledstrips";
import { TypeLedStrip } from "@/types/types";

type LedStripsState = {
  data: TypeLedStrip[];
  selected: TypeLedStrip | null;
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  // Csak helyi frissítés (nincs hálózati hívás)
  update: (payload: { id: number } & Partial<TypeLedStrip>) => void;
  // Szerverre küldés a kiválasztott szalag helyi állapotával
  save: () => Promise<void>;
  setSelected: (strip: TypeLedStrip | null) => void;
};

export const useLedStripsStore = create<LedStripsState>((set, get) => ({
  data: [],
  selected: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLedStrips();
      set({ data });

      set((state) => ({
        selected: state.selected || data[0] || null,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // 🔄 CSAK HELYI FRISSÍTÉS: frissíti a data tömböt és a selected állapotot
  update: (payload) => {
    if (payload?.id === undefined || payload?.id === null) {
      console.error("Update payload requires 'id' field");
      return;
    }

    set((state) => {
      // Frissíti a data tömbben a megfelelő szalagot
      const newData = state.data.map((strip) =>
        strip.id === payload.id ? { ...strip, ...payload } : strip,
      );

      // Ha a selected szalagot frissítjük, azt is frissítjük
      // const newSelected =
      //   state.selected?.id === payload.id
      //     ? { ...state.selected, ...payload }
      //     : state.selected;

      return { data: newData, /*selected: newSelected*/ };
    });
  },

  // 💾 SZERVERRE KÜLDÉS: a jelenleg kiválasztott szalag helyi állapotának mentése
  save: async () => {
    const { selected, loading } = get();

    // Védelem: ne futtasson párhuzamos mentéseket
    if (loading || !selected) {
      if (!selected) set({ error: "No LED strip selected to save" });
      return;
    }

    set({ loading: true, error: null });
    try {
      // Küldés szerverre a HELYI selected állapottal
      await updateLedStrips(selected);

      // Frissíti a teljes listát a szerverről (konzisztencia biztosítása)
      const refreshedData = await getLedStrips();

      // Frissíti a selected állapotot is a szerver válaszával
      set((state) => ({
        data: refreshedData,
        selected:
          refreshedData.find(
            (s: TypeLedStrip) => s.id === state.selected?.id,
          ) || null,
        loading: false,
      }));
    } catch (e) {
      set({
        error: `Save failed: ${(e as Error).message}`,
        loading: false,
      });
    }
  },

  setSelected: (strip) => set({ selected: strip }),
}));
