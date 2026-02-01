import { Text, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";

export type ScreenTitleProps = ViewProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
};

export function ScreenTitle({ title, ...otherProps }: ScreenTitleProps) {
  return (
    <View className="flex screen-title h-16 w-max">
      <Text className="flex text-4xl my-auto text-center text-neutral-200 font-bold">{title}</Text>
      <View className={`h-1`} style={{backgroundColor: Colors.separatorLine}} />
    </View>
  );
}
