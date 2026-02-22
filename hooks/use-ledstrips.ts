import { getLedStrips, updateLedStrips } from "@/api/ledstrips/ledstrips";
import { TypeLedStrip } from "@/types/types";
import { create } from "zustand";

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
  delete: (id: number) => void;
  add: (newStrip: Omit<TypeLedStrip, "id">) => void; // Új LED szalag hozzáadása
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
      console.error("Error fetching LED strips:", e);
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
      const newData = state.data.map((strip) =>
        strip.id === payload.id ? { ...strip, ...payload } : strip,
      );

      const newSelected =
        state.selected?.id === payload.id
          ? { ...state.selected, ...payload }
          : state.selected;

      return { data: newData, selected: newSelected };
    });
  },

  // 💾 SZERVERRE KÜLDÉS: a jelenleg kiválasztott szalag helyi állapotának mentése
  save: async () => {
    const { data, loading } = get();

    if (loading) return;

    set({ loading: true, error: null });
    try {
      // Küldjük el az összes szalagot a szervernek
      await updateLedStrips(data);

      // Frissítsük az adatokat a szerverről (konzisztencia)
      // const refreshedData = await getLedStrips();

      // Frissítsük a selected állapotot is
      set((state) => ({
        // data: refreshedData,
        // selected: state.selected
        //   ? refreshedData.find(
        //       (s: TypeLedStrip) => s.id === state.selected!.id,
        //     ) || null
        //   : refreshedData[0] || null,
        loading: false,
      }));
    } catch (e) {
      set({
        error: `Save failed: ${(e as Error).message}`,
        loading: false,
      });
    }
  },

  // 🗑️ CSAK HELYI TÖRLÉS
  delete: (idToDelete: number) => {
    set((state) => {
      const newData = state.data.filter((strip) => strip.id !== idToDelete);

      let newSelected: TypeLedStrip | null = state.selected;

      if (state.selected?.id === idToDelete) {
        if (newData.length > 0) {
          // Legközelebbi ID keresése
          newSelected = newData.reduce((closest, current) => {
            const diffCurrent = Math.abs(current.id - idToDelete);
            const diffClosest = Math.abs(closest.id - idToDelete);
            return diffCurrent < diffClosest ? current : closest;
          });
        } else {
          newSelected = null;
        }
      }

      return {
        data: newData,
        selected: newSelected,
      };
    });
  },

  add: (newStripData: Omit<TypeLedStrip, "id">) => {
    set((state) => {
      // Generáljunk új ID-t (legnagyobb meglévő + 1)
      const maxId =
        state.data.length > 0
          ? Math.max(...state.data.map((strip) => strip.id))
          : -1;

      const newId = maxId + 1;

      // Új LED szalag objektum
      const newStrip: TypeLedStrip = {
        ...newStripData,
        id: newId,
      };

      // Adjuk hozzá az adatokhoz
      const newData = [...state.data, newStrip];

      console.log(maxId, newId, newStrip);
      // Válasszuk ki az új szalagot
      return {
        data: newData,
        selected: state.selected || newStrip,
      };
    });
  },

  setSelected: (strip) => set({ selected: strip }),
}));
