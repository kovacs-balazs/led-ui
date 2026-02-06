import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RadxaStatus } from "@/hooks/use-connection";
import { ActivityIndicator } from "react-native";

const statusText: Record<RadxaStatus, string> = {
  NOT_WIFI: "Kapcsolódj WiFi-re",
  DEVICE_OFFLINE: "Radxa nem elérhető",
  CONNECTED: "Csatlakozva",
};

export default function LoadingScreen({ status }: { status: RadxaStatus }) {
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
