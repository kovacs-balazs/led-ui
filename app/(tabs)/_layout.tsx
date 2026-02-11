import { Tabs } from "expo-router";
import React, { useCallback } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { LedIcon } from "@/components/icons/led-icon";
import { SaveIcon } from "@/components/icons/save-icon";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { useSettingsStore } from "@/hooks/use-settings";
import { Header } from "@react-navigation/elements";
import {
  ActivityIndicator,
  Keyboard,
  Pressable
} from "react-native";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { save, loading, error } = useLedStripsStore();
  const {
    data: settings,
    save: settingsSave,
    loading: settingsLoading,
    error: settingsError,
  } = useSettingsStore();

  const handleSave = useCallback(async () => {
    try {
      Keyboard.dismiss();
      await save();
      if (!error) {
        console.log("Saved successfully");
        Toast.show({
          type: "success",
          text1: "Saved!",
          text2: "Your changes have been saved successfully",
          position: "bottom",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [save, error]);

  const handleSettingsSave = useCallback(async () => {
    try {
      Keyboard.dismiss();
      if (settings.wifi.password.length < 8) {
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: "Wi-Fi password must be 8+ characters.",
          position: "bottom",
          visibilityTime: 2000,
        });
        return;
      }
      await settingsSave();
      if (!error) {
        console.log("Settings saved successfully");
        Toast.show({
          type: "success",
          text1: "Saved!",
          text2: "Your changes have been saved successfully",
          position: "bottom",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      console.error("Settings save failed:", err);
    }
  }, [settings, settingsSave, settingsError]);

  const renderHeaderRight = (disabled: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="p-4"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.8 : 1 }],
      })}
      accessibilityRole="button"
      accessibilityLabel="Save changes"
      accessibilityState={{ disabled: disabled }}
    >
      {disabled ? (
        <ActivityIndicator
          size="small"
          color={Colors[colorScheme ?? "light"].tint}
        />
      ) : (
        <SaveIcon color={Colors[colorScheme ?? "light"].tint} size={24} />
      )}
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerBackButtonDisplayMode: "minimal",
        header: ({ options }) => (
          <Header
            title={""}
            {...options}
            headerStyle={{
              height: 100,
              borderBottomWidth: 2,
              borderBottomColor: Colors.separatorLine,
            }}
            headerTitleStyle={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "LED Strips",
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="house.fill" color={color} />
            <LedIcon color={color} size={28} />
          ),
          headerRight: () => renderHeaderRight(loading, handleSave),
        }}
      />

      <Tabs.Screen
        name="animations"
        options={{
          title: "Animations",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
            // <LedIcon color={"#000000"} size={24} />
          ),
          headerRight: () => renderHeaderRight(loading, handleSave),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <SettingsIcon size={28} color={color} strokeWidth={2} />
            // <LedIcon color={"#000000"} size={24} />
          ),
          headerRight: () => {
            return renderHeaderRight(settingsLoading, handleSettingsSave)
          }
        }}
      />

      {/*<Tabs.Screen*/}
      {/*  name="save"*/}
      {/*  options={{*/}
      {/*    title: "Save",*/}
      {/*    tabBarIcon: ({ color }) => (*/}
      {/*      <Pressable onPress={handleSave}>*/}
      {/*        {({ pressed }) => {*/}
      {/*          return <SaveIcon color={color} size={pressed ? 24 : 28} />;*/}
      {/*        }}*/}
      {/*      </Pressable>*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Tabs.Screen name="index_template" options={{ href: null }} />
    </Tabs>
  );
}
