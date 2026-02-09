import { ThemedView } from "@/components/themed-view";
import { Pressable, ScrollView, Text, View } from "react-native";

import { getNewLedStrip } from "@/api/ledstrips/ledstrips";
import { LedStrip } from "@/components/leds/ledstrip";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { useSettingsStore } from "@/hooks/use-settings";
import { generateUniqueName } from "@/utils/utils";
import { useCallback, useEffect } from "react";
import "../../global.css";

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

  const handleAdd = useCallback(async () => {
    const newLedStrip = await getNewLedStrip(generateUniqueName(data));
    add(newLedStrip);

    console.log("Added ledstrip", newLedStrip);
  }, [data, add]);

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
              className={`p-2.5 bg-blue-600 rounded-xl ${pressed ? "scale-95" : "scale-100"}`}
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
