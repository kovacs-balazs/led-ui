import { Pressable, Switch, Text, View } from "react-native";
import { TypeLedStrip } from "@/types/types";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { useCallback } from "react";
import Svg, { Path } from "react-native-svg";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Link } from "expo-router";

const SettingsIcon = ({ size = 24, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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

  return (
    <Pressable
      onPress={() => setSelected(ledStrip)}
      onLongPress={() =>
        router.push({
          pathname: "/ledstrip-settings",
          params: { id: ledStrip.id },
        })
      }
      delayLongPress={300}
    >
      <View
        className={`p-3 rounded-xl ${selected ? "bg-gray-400" : "bg-neutral-300"} ${selected ? "dark:bg-gray-600" : "dark:bg-gray-800"} flex-row justify-between items-center`}
      >
        {/* Név + pin */}
        <View className="flex flex-row gap-4 items-center">
          <Text
            className={`text-neutral-800 dark:text-neutral-200 text-lg ${selected ? "font-bold" : ""} ${ledStrip.power ? "" : "line-through"}`}
          >
            {ledStrip.name}
          </Text>
          <Text className="text-neutral-800 dark:text-neutral-300 text-md">
            p{ledStrip.pin}
          </Text>
        </View>

        <View className="flex-row items-center">
          {/* Settings icon*/}
          <View className="items-center justify-center mr-4">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/ledstrip-settings",
                  params: { id: ledStrip.id },
                })
              }
              className="rounded"
            >
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
