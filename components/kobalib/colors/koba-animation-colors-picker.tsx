import { ThemedText } from "@/components/themed-text";
import { BaseAnimation } from "@/types/types";
import { memo, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

function formatName(name: string): string {
  return name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

interface RealKobaAnimationColorPickerProps {
  initialAnimation: BaseAnimation;
  onChange: (e: string) => void;
}

function RealKobaAnimationColorPicker({ initialAnimation, onChange }: RealKobaAnimationColorPickerProps) {
  const keys = useMemo(() => {
    return initialAnimation.colors ? Object.keys(initialAnimation.colors) : [];
  }, [initialAnimation.colors]);

  const [selected, setSelected] = useState<string | null>(keys[0] ?? null);

  // Ha animation változik → valid selectedet állítunk
  useEffect(() => {
    if (keys.length === 0) {
      setSelected(null);
      return;
    }

    // ha a jelenlegi selected még létezik, ne resetelj
    if (selected && keys.includes(selected)) return;

    // különben az első kulcs legyen kiválasztva
    setSelected(keys[0]);
    onChange(keys[0]);
  }, [selected, keys]);

  if (keys.length === 0) {
    return <ThemedText>Animation does not have colors.</ThemedText>;
  }

  return (
    <View className="">
      <View className="flex flex-row flex-wrap gap-3 justify-center">
        {keys.map((key, idx) => (
          <Pressable
            key={idx}
            className={`p-3 w-fit ${key === selected ? "bg-blue-400 dark:bg-blue-600" : "bg-neutral-400 dark:bg-neutral-600"} rounded-xl`}
            onPress={() => {
              setSelected(key);
              onChange(key);
            }}
            style={{
              flexGrow: 1,
              flexBasis: "auto",
            }}
          >
            <Text className="text-xl text-center text-neutral-800 dark:text-neutral-200">{formatName(key)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

RealKobaAnimationColorPicker.displayName = "KobaAnimationColorPicker"

const KobaAnimationColorPicker = RealKobaAnimationColorPicker;
export default memo(KobaAnimationColorPicker);