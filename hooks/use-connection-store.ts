import { getPower, updatePower } from "@/api/power/power";
import { create } from "zustand";

export type DeviceStatus = "NOT_WIFI" | "DEVICE_OFFLINE" | "CONNECTED";

type ConnectionStore = {
  status: DeviceStatus;
  loading: boolean;

  setStatus: (status: DeviceStatus) => void;
  setLoading: (loading: boolean) => void;
};

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  status: "DEVICE_OFFLINE" as DeviceStatus,
  loading: false,

  setStatus: (status) => { set({ status: status }) },
  setLoading: (loading) => set({ loading }),
}));
