// components/animation/AnimationWrapper.tsx
import { ThemedView } from "@/components/themed-view";
import { getAnimationById } from "@/config/animations";
import { AnimationConfig } from "@/types/types";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";

interface AnimationWrapperProps {
  children: (animation: AnimationConfig) => ReactNode;
}

export default function AnimationWrapper({ children }: AnimationWrapperProps) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animationId = Number(id);
  const animation: AnimationConfig | undefined = getAnimationById(animationId);

  useEffect(() => {
    if (!animation) {
      router.back();
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "This animation is not founded by id.",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }
  }, [animation, animationId, router]);

  if (!animation) {
    return (
      <Text className="text-neutral-800 dark:text-neutral-200">
        Animation not found.
      </Text>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: animation?.name,
          headerBackVisible: Platform.OS !== "ios",
          headerTitleStyle: { fontSize: 20 },
          // headerLeft: () =>
          //   Platform.OS === "ios" ? (
          //     <Pressable onPress={() => router.back()} className="px-4">
          //       <Text className="text-xl text-neutral-600 dark:text-neutral-200">{"<"}</Text>
          //     </Pressable>
          //   ) : undefined,
        }}
      />

      <ThemedView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView>
            <Pressable onPress={Keyboard.dismiss} className="p-4">
              {children(animation)}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}
