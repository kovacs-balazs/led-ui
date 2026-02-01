import { Text, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";
import { LedStrip } from "@/types/types";

export type LedStripProps = {
  ledStrip: LedStrip;
};

export function LedStrip({ ledStrip }: LedStripProps) {
  return (
    <View className="flex screen-title h-16 w-max">
      <Text className="flex text-4xl my-auto text-center text-neutral-200 font-bold">
        {title}
      </Text>
      <View
        className={`h-1`}
        style={{ backgroundColor: Colors.separatorLine }}
      />
    </View>
  );
}
