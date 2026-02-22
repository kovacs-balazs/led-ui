import { formatName } from "@/utils/utils";
import { memo, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "../themed-text";

interface KobaTabPickerProps {
  label?: string
  initialTab: string;
  tabs: string[]
  onChange: (tab: string) => void;
}

function RealKobaTabPickerProps({ label, initialTab, tabs, onChange }: KobaTabPickerProps) {
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    if (!initialTab) {
      setSelectedTab(tabs[0]);
      return;
    }

    setSelectedTab(initialTab);
  }, [initialTab])

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
              setSelectedTab(tab);
              onChange(tab);
            }}
            className={`p-2 w-fit ${tab === selectedTab ? "bg-blue-400 dark:bg-blue-600" : "bg-neutral-300 dark:bg-neutral-600"} rounded-xl`}
            style={{
              flexGrow: 1,
              flexBasis: "auto",
            }}
          >
            <ThemedText className="text-xl text-center">{formatName(tab)}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View >
  )
}


const KobaTabPicker = RealKobaTabPickerProps;
export default memo(KobaTabPicker);