import { getLedStrips, updateLedStrips } from "@/api/ledstrips/ledstrips";
import { BaseAnimation, TypeLedStrip } from "@/types/types";
import { create } from "zustand";

type LedStripsState = {
  data: TypeLedStrip[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  setData: (data: TypeLedStrip[]) => void;
  setSelectedId: (id: number) => void;
  // Csak helyi frissítés (nincs hálózati hívás)
  update: (payload: { id: number } & Partial<TypeLedStrip>) => void;
  // Szerverre küldés a kiválasztott szalag helyi állapotával
  save: () => Promise<void>;
  delete: (id: number) => void;
  add: (newStrip: Omit<TypeLedStrip, "id">) => void; // Új LED szalag hozzáadása
  setSelected: (strip: TypeLedStrip | null) => void;
  initSocket(): () => void;
  updateAnimation: (
    stripId: number,
    animationId: number,
    updater: (anim: BaseAnimation) => BaseAnimation
  ) => void;
};

export const useLedStripsStore = create<LedStripsState>((set, get) => ({
  data: [],
  selectedId: null,
  loading: false,
  error: null,

  setData: (data) => set({ data }),
  setSelectedId: (id) => set({ selectedId: id }),

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLedStrips();
      /* set({ data }); */

      set((state) => {
        return {
          data: data,
          selectedId: state.selectedId ?? data[0].id ?? null,
        }
      });
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

      /* const newSelected =
        state.selected?.id === payload.id
          ? { ...state.selected, ...payload }
          : state.selected;
 */
      return { data: newData, /* selected: newSelected */ };
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

      const currentSelected = state.data.find(s => s.id === state.selectedId) || null;

      let newSelected: TypeLedStrip | null = currentSelected;

      if (state.selectedId === idToDelete) {
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
        selectedId: newSelected?.id,
      };
    });
  },

  add: (newStripData: Omit<TypeLedStrip, "id">) => {
    set((state) => {
      if (state.data.length >= 10) return state;

      const newId = Array.from({ length: 10 }, (_, i) => i)
        .find((id) => !state.data.some((strip) => strip.id === id));

      if (newId === undefined) return state;
      // Új LED szalag objektum
      const newStrip: TypeLedStrip = {
        ...newStripData,
        id: newId,
      };

      // Adjuk hozzá az adatokhoz
      const newData = [...state.data, newStrip];

      // Válasszuk ki az új szalagot
      return {
        data: newData,
        selectedId: state.selectedId ?? newStrip.id,
      };
    });
  },

  setSelected: (strip) => set({ selectedId: strip?.id }),
  initSocket: () => {
    connectWebSocket(set);
  },

  updateAnimation: (stripId, animationId, updater) => {
    set((state) => ({
      data: state.data.map((strip) => {
        if (strip.id !== stripId) return strip;

        return {
          ...strip,
          animations: strip.animations.map((anim) =>
            anim.id === animationId
              ? updater(anim)
              : anim
          ),
        };
      }),
    }));
  }
}));