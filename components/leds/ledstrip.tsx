import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { TypeLedStrip } from "@/types/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SettingsIcon } from "../icons/settings-icon";

export type LedStripProps = {
  ledStrip: TypeLedStrip;
  selected: boolean;
  // onUpdate: (changes: Partial<LedStrip>) => void;
};

export function LedStrip({ ledStrip, selected }: LedStripProps) {
  const { update, setSelected: setSelected } = useLedStripsStore();

  const colorScheme = useColorScheme();

  const togglePower = useCallback(
    (e: boolean) => {
      update({ id: ledStrip.id, power: e });
    },
    [ledStrip, update],
  );

  const goSettings = () => {
    router.push({
      pathname: "/ledstrip-settings",
      params: { id: ledStrip.id },
    });
  };

  return (
    <Pressable
      onPress={() => setSelected(ledStrip)}
      onLongPress={goSettings}
      delayLongPress={300}
    >
      <View
        className={`p-3 rounded-xl ${selected ? "bg-gray-400" : "bg-neutral-300"} ${selected ? "dark:bg-gray-600" : "dark:bg-gray-800"} flex-row justify-between items-center`}
      >
        {/* Név + pin */}
        <View className="flex flex-row gap-4 items-center">
          <Text
            className={`text-neutral-700 dark:text-neutral-200 text-lg ${selected ? "font-bold" : ""} ${ledStrip.power ? "" : "line-through"}`}
          >
            {ledStrip.name}
          </Text>
          <Text className="text-neutral-700 dark:text-neutral-300 text-md">
            p{ledStrip.pin}
          </Text>
        </View>

        <View className="flex-row items-center">
          {/* Settings icon*/}
          <View className="items-center justify-center mr-4">
            <Pressable onPress={goSettings} className="rounded">
              {/*<Text className="text-3xl">⚙️</Text>*/}
              <SettingsIcon
                size={28}
                color={`${colorScheme === "dark" ? "#f5f5f5" : "#292524"}`}
              />
            </Pressable>
          </View>

          {/* Power toggle*/}
          <View className="items-center justify-center h-2">
            <Switch value={ledStrip.power} onValueChange={togglePower} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
