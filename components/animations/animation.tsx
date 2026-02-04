import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { AnimationConfig } from "@/types/types";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SettingsIcon } from "../icons/settings-icon";

export type AnimationProps = {
  animation: AnimationConfig;
  selected: boolean;
};

export function Animation({ animation, selected }: AnimationProps) {
  const { update, selected: selectedLedStrip } = useLedStripsStore();

  const colorScheme = useColorScheme();
  const route: string =
    "/animations-settings/" +
    (animation.id < 100 ? "idle" : "audio") +
    "/" +
    animation.route;

  const selectAnimation = () => {
    if (!selectedLedStrip) {
      return;
    }

    update({ id: selectedLedStrip.id, animation: animation.id });
  };

  return (
    <Pressable
      onPress={selectAnimation}
      onLongPress={() =>
        router.push({
          pathname: route,
          params: { id: animation.id },
        })
      }
      delayLongPress={300}
    >
      <View
        className={`p-3 rounded-xl ${selected ? "bg-gray-400" : "bg-neutral-300"} ${selected ? "dark:bg-gray-600" : "dark:bg-gray-800"} flex-row justify-between items-center`}
      >
        <Text
          className={`flex items-center text-neutral-700 dark:text-neutral-200 text-lg ${selected ? "font-bold" : ""}`}
        >
          {animation.name}
        </Text>

        <View className="flex-row items-center justify-center mr-4">
          <Pressable
            onPress={() =>
              router.push({
                pathname: route,
                params: { id: animation.id },
              })
            }
            className="rounded"
          >
            <SettingsIcon
              size={28}
              color={`${colorScheme === "dark" ? "#f5f5f5" : "#292524"}`}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
