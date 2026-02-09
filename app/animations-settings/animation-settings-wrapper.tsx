// components/animation/AnimationWrapper.tsx
import { ThemedView } from "@/components/themed-view";
import { getAnimationById } from "@/config/animations";
import { AnimationConfig } from "@/types/types";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect } from "react";
import { Keyboard, Platform, Pressable, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
      <ThemedView className="flex-1 justify-center items-center">
        <Pressable
          onPress={router.back}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 rounded"
        >
          <Text className="text-red-700 dark:text-red-300">
            Animation not found. Tap to go back.
          </Text>
        </Pressable>
      </ThemedView>
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

      {/* Itt 8 a padding, mert az animációknál mindig lesz color picker, és beljebb kell húzni a colorpickert, hogy a széléig könnyen ki lehessen húzni a dolgokat */}
      <ThemedView className="flex-1">
        <KeyboardAwareScrollView>
          <Pressable className="p-4" onPress={Keyboard.dismiss}>
            {children(animation)}
          </Pressable>
        </KeyboardAwareScrollView>
      </ThemedView>
    </>
  );
}
