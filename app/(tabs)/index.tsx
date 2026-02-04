import { ThemedView } from "@/components/themed-view";
import { Pressable, ScrollView, Text, View } from "react-native";

import { LedStrip } from "@/components/leds/ledstrip";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { useSettingsStore } from "@/hooks/use-settings";
import { useEffect } from "react";
import "../../global.css";
import { generateUniqueName } from "../../utils/utils";

/*
// Mentés gombra kattintva
const handleSave = async () => {
  await save(); // Elküldi a SZERVERNEK a selected állapotot
};
 */

export default function HomeScreen() {
  const {
    data,
    selected,
    fetch: fetchLedStrips,
    add,
    loading,
  } = useLedStripsStore();
  const { fetch: fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchLedStrips();
    fetchSettings();
    console.log("Fetched ledstrips and settings");
  }, [fetchLedStrips, fetchSettings]);

  // Show loading indicator while fetching
  if (loading && data.length === 0) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <Text className="text-neutral-800 dark:text-neutral-200">
          Loading LED strips...
        </Text>
      </ThemedView>
    );
  }

  if (!selected) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <Text className="text-neutral-800 dark:text-neutral-200">
          No LED strip selected.
        </Text>
      </ThemedView>
    );
  }

  const handleAdd = () => {
    add({
      name: generateUniqueName(data),
      pin: 0,
      ledCount: 50,
      power: false,
      animation: 0,
      animations: [],
    });
  };

  return (
    <ThemedView className="flex-1 justify-between">
      <ScrollView className="flex flex-col p-4 overflow-y-auto">
        <View className="flex gap-4">
          {data.map((ledStrip) => (
            <LedStrip
              key={ledStrip.name}
              ledStrip={ledStrip}
              selected={selected.id === ledStrip.id}
            />
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <Pressable className="py-4 px-24" onPress={handleAdd}>
        {({ pressed }) => {
          return (
            <View
              className={`p-2.5 bg-cyan-600 rounded-xl ${pressed ? "scale-95" : "scale-100"}`}
            >
              <Text className="text-xl text-neutral-200 font-bold text-center">
                Add
              </Text>
            </View>
          );
        }}
      </Pressable>
    </ThemedView>
  );
}
