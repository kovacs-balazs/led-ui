import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DeviceStatus } from "@/hooks/use-connection";
import { ActivityIndicator } from "react-native";

const statusText: Record<DeviceStatus, string> = {
  NOT_WIFI: "Kapcsolódj WiFi-re",
  DEVICE_OFFLINE: "Radxa nem elérhető",
  CONNECTED: "Csatlakozva",
};

export default function LoadingScreen({ status }: { status: DeviceStatus }) {
  const text: string = statusText[status];

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" />
      {/* <ThemedText style={{ marginTop: 20 }}>Loading...</ThemedText> */}
      <ThemedText style={{ marginTop: 20 }}>{text}</ThemedText>
    </ThemedView>
  );
}
