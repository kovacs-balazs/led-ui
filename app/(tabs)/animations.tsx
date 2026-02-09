import { Animation } from "@/components/animations/animation";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AUDIO_ANIMATIONS, IDLE_ANIMATIONS } from "@/config/animations";
import { Colors } from "@/constants/theme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function AnimationsScreen() {
  const [selectedType, setSelectedType] = useState(0); // 0 = idle, 1 = audio

  const { selected } = useLedStripsStore();

  return (
    <ThemedView className="flex-1">
      <View className="p-4 flex-row gap-4">
        {["Idle", "Audio"].map((label, index) => {
          const isActive = index === selectedType;

          return (
            <Pressable
              key={index}
              className={`flex-1 p-2 rounded-lg ${isActive ? "bg-blue-400 dark:bg-blue-600" : "bg-neutral-300 dark:bg-gray-800"}`}
              onPress={() => setSelectedType(index)}
            >
              <Text
                className={`text-2xl text-center
                  ${isActive ? "font-bold" : ""} 
                  ${isActive ? "text-neutral-800" : "text-neutral-700"}
                  ${isActive ? "dark:text-neutral-200" : "dark:text-neutral-300"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View
        className="h-0.5"
        style={{ backgroundColor: Colors.separatorLine }}
      />

      {selected ? (
        <ScrollView className="p-4 overflow-y-auto">
          <View className="flex gap-4">
            {(selectedType === 0 ? IDLE_ANIMATIONS : AUDIO_ANIMATIONS).map(
              (anim, index) => (
                <Animation
                  key={index}
                  animation={anim}
                  selected={selected.animation === anim.id}
                />
              ),
            )}
          </View>
        </ScrollView>
      ) : (
        <ThemedText>
          No LED strip selected
        </ThemedText>
      )}
    </ThemedView>
  );
}
