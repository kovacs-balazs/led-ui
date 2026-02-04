import {
  KobaInputBox,
  KobaInputBoxRef,
} from "@/components/kobalib/koba-inputbox";
import { ThemedView } from "@/components/themed-view";
import { useSettingsStore } from "@/hooks/use-settings";
import { useRef, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

/*
wifi név, jelszo
Bluetooth name
 */

export default function SettingsScreen() {
  const { data, update, updateWiFi } = useSettingsStore();

  const wifiNameInputRef = useRef<KobaInputBoxRef>(null);
  const [wifiNameInputError, setWifiNameInputError] = useState<string>();

  const wifiPasswordInputRef = useRef<KobaInputBoxRef>(null);
  const [wifiPasswordInputError, setWifiPasswordInputError] =
    useState<string>();

  const bluetoothNameInputRef = useRef<KobaInputBoxRef>(null);
  const [bluetoothNameInputError, setBluetoothNameInputError] =
    useState<string>();

  const handleWiFINameSubmit = (name: string) => {
    if (!name.trim()) {
      wifiNameInputRef.current?.setValue(data.wifi.name);
      setWifiNameInputError("A mező nem lehet üres!");
      return;
    }

    updateWiFi({ name: name });
    setWifiNameInputError("");
  };

  const handleWiFIPasswordSubmit = (password: string) => {
    if (!password.trim()) {
      wifiPasswordInputRef.current?.setValue(data.wifi.password);
      setWifiPasswordInputError("A mező nem lehet üres!");
      return;
    }

    if (password.length < 8) {
      wifiPasswordInputRef.current?.setValue(data.wifi.password);
      setWifiPasswordInputError("A jelszó minimum 8 karakter kell legyen!");
      return;
    }

    updateWiFi({ password: password });
    setWifiPasswordInputError("");
  };

  const handleBluetoothNameSubmit = (name: string) => {
    if (!name.trim()) {
      bluetoothNameInputRef.current?.setValue(data.bluetoothName);
      setBluetoothNameInputError("A mező nem lehet üres!");
      return;
    }

    update({ bluetoothName: name });
    setBluetoothNameInputError("");
  };

  return (
    <ThemedView className="flex-1">
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View className="p-4 flex-col gap-4">
          <KobaInputBox
            ref={wifiNameInputRef}
            label="Wi-Fi Name"
            initialValue={data.wifi.name}
            placeholder={"Enter name..."}
            onSubmit={handleWiFINameSubmit}
            error={wifiNameInputError}
          />
          <KobaInputBox
            ref={wifiPasswordInputRef}
            label="Wi-Fi Password"
            initialValue={data.wifi.password}
            placeholder={"Enter password..."}
            onSubmit={handleWiFIPasswordSubmit}
            error={wifiPasswordInputError}
          />
          <KobaInputBox
            ref={bluetoothNameInputRef}
            label="Bluetooth Name"
            initialValue={data.bluetoothName}
            placeholder={"Enter name..."}
            onSubmit={handleBluetoothNameSubmit}
            error={bluetoothNameInputError}
          />
        </View>
      </Pressable>
    </ThemedView>
  );
}
