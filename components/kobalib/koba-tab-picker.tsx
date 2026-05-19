import { formatName } from "@/utils/utils";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "../themed-text";

interface KobaTabPickerProps {
  label?: string;
  value: string;
  tabs: string[];
  onChange: (tab: string) => void;
}

function KobaTabPicker({
  label,
  value,
  tabs,
  onChange,
}: KobaTabPickerProps) {
  return (
    <View>
      {label && (
        <ThemedText className="text-lg font-semibold mb-1">
          {label}
        </ThemedText>
      )}

      <View className="flex flex-row flex-wrap gap-3 justify-center">
        {tabs.map((tab, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              onChange(tab);
            }}
            className={`p-2 w-fit ${tab === value
              ? "bg-blue-400 dark:bg-blue-600"
              : "bg-neutral-300 dark:bg-neutral-600"
              } rounded-xl`}
            style={{
              flexGrow: 1,
              flexBasis: "auto",
            }}
          >
            <ThemedText className="text-xl text-center">
              {formatName(tab)}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default memo(KobaTabPicker);