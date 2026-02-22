import { clearConsole, getConsole } from "@/api/console/console";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ConsoleScreen() {
  const [messages, setMessages] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMessages = async () => {
        const msgs = await getConsole();
        if (isActive) {
          setMessages(msgs);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Console",
          headerBackVisible: Platform.OS !== "ios",
          headerTitleStyle: { fontSize: 20 },
          headerShadowVisible: false,
          headerRight: () => (
            <View>
              <Pressable
                onPress={() => {
                  clearConsole().finally(() => {
                    Toast.show({
                      type: "success",
                      text1: "Console cleared",
                      //text2: "Your changes have been saved successfully",
                      position: "bottom",
                      visibilityTime: 2000,
                    });
                    setMessages([]);
                  });
                }}
                className="border p-2 rounded-xl bg-red-500"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                accessibilityRole="button"
                accessibilityLabel="Clear console"
              >
                <ThemedText className="font-bold text-center">CLEAR</ThemedText>
              </Pressable>
            </View>
          )
        }}
      />

      <ThemedView className="flex-1">
        <ScrollView className={`px-4`} style={{ marginBottom: 50 }}>
          {messages.map((msg, idx) => (
            <Text pointerEvents="none" key={idx} className={`text-lg text-neutral-800 dark:text-neutral-200 ${msg.includes("[ERR]") ? "text-red-500 dark:text-red-500" : ""}`}>{msg}</Text>
          ))}
        </ScrollView>
      </ThemedView>
    </>
  )
}