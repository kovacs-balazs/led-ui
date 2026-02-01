import { Text, View } from "react-native";
import { ThemedView } from "@/components/themed-view";

import "../../global.css";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { LedStrip } from "@/components/leds/ledstrip";
import { TypeLedStrip } from "@/types/types";
import { useEffect } from "react";

/*
// Mentés gombra kattintva
const handleSave = async () => {
  await save(); // Elküldi a SZERVERNEK a selected állapotot
};
 */

export default function HomeScreen() {
  const { data, selected, fetch: fetchLedStrips } = useLedStripsStore();

  useEffect(() => {
    fetchLedStrips();
    console.log("Fetched ledstrips")
  }, [fetchLedStrips]);

  return (
    <ThemedView className="flex-1">
      <View className="flex flex-col p-4 gap-4 overflow-y-auto">
        {data.map((ledStrip) => (
          <LedStrip
            key={ledStrip.name}
            ledStrip={ledStrip}
            selected={selected === ledStrip}
          />
        ))}
      </View>
    </ThemedView>
  );
}
