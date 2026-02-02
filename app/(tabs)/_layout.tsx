import { router, Tabs } from "expo-router";
import React, { useCallback } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Header } from "@react-navigation/elements";
import { LedIcon } from "@/components/icons/led-icon";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SaveIcon } from "@/components/icons/save-icon";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { useSettingsStore } from "@/hooks/use-settings";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { save, loading, error } = useLedStripsStore();
  const { save: settingsSave, loading: settingsLoading, error: settingsError } = useSettingsStore();

  const handleSave = useCallback(async () => {
    try {
      await save();
      if (!error) {
        console.log("Saved successfully");
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [save, error]);

  const handleSettingsSave = useCallback(async () => {
    try {
      await settingsSave();
      if (!error) {
        console.log("Settings saved successfully");
      }
    } catch (err) {
      console.error("Settings save failed:", err);
    }
  }, [settingsSave, settingsError]);

  const renderHeaderRight = (disabled: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="mr-4"
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
        name="leds"
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
        name="explore"
        options={{
          title: "Explore",
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
          headerRight: () => renderHeaderRight(settingsLoading, handleSettingsSave),
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
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
