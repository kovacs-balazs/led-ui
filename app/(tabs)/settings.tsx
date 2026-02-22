import { getDeviceStatus, reconnectDevice } from "@/api/device/device";
import {
  KobaInputBox,
  KobaInputBoxRef,
} from "@/components/kobalib/koba-inputbox";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSettingsStore } from "@/hooks/use-settings";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

/*
wifi név, jelszo
Bluetooth name
 */

export default function SettingsScreen() {
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);

  const { data, update, updateWiFi, loading } = useSettingsStore();

  const wifiNameInputRef = useRef<KobaInputBoxRef>(null);
  const [wifiNameInputError, setWifiNameInputError] = useState<string>();

  const wifiPasswordInputRef = useRef<KobaInputBoxRef>(null);
  const [wifiPasswordInputError, setWifiPasswordInputError] = useState<string>();

  const bluetoothNameInputRef = useRef<KobaInputBoxRef>(null);
  const [bluetoothNameInputError, setBluetoothNameInputError] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchDeviceStatus = async () => {
        const res = await getDeviceStatus();
        if (isActive) {
          setDeviceStatus(res.connected);
        }
      };

      fetchDeviceStatus();
      const interval = setInterval(fetchDeviceStatus, 1000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [])
  );

  const handleWiFiNameSubmit = (name: string) => {
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

  const tryReconnectDevice = async () => {
    if (deviceStatus) {
      Toast.show({
        type: "error",
        text1: "Connection failed",
        text2: "Device is already connected",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }

    const res = await reconnectDevice();

    if (res.connected) {
      Toast.show({
        type: "success",
        text1: "Reconnected",
        text2: "Device connected successfully",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Reconnect Failed",
        text2: "Unable to connect to the device",
        position: "bottom",
        visibilityTime: 2000,
      });
    }

    return setDeviceStatus(res.connected);
  }

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View className="p-4 flex-col gap-4">
          <KobaInputBox
            ref={wifiNameInputRef}
            label="Wi-Fi Name"
            initialValue={data.wifi.name}
            placeholder={"Enter name..."}
            onSubmit={handleWiFiNameSubmit}
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
          <View className="">
            <Text className={`${deviceStatus ? "text-green-500" : "text-red-500"} text-lg font-semibold`}>
              Device: {deviceStatus ? "Connected" : "Not connected"}
            </Text>
            <Pressable
              onPress={tryReconnectDevice}
              className="bg-blue-600 rounded-xl p-1.5 mt-1"
              style={{ width: 120 }}
            >
              <ThemedText className="text-lg rounded-xl text-center font-semibold">Reconnect</ThemedText>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </ThemedView>
  );
}
