import { GradientStop } from "@/types/types";
import { memo, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import KobaColorPicker from "./koba-color-picker-component";
import KobaGradientPicker from "./koba-gradient-picker";

interface BaseProps {
  type: 'solid' | 'gradient';
  onColorTypeChange?: (type: 'solid' | 'gradient') => void;
  onChangeComplete: (type: 'solid' | 'gradient', stops: string | GradientStop[]) => void;
}

/* interface KobaPickerProps {
  onChangeComplete: (channel: 'solid' | 'gradient', stops: string | GradientStop[]) => void;
  initialColorData: string | GradientStop[];
} */

interface SolidColorProps extends BaseProps {
  initialColor: string;
  initialStops?: never;
}

interface GradientProps extends BaseProps {
  initialStops: GradientStop[];
  initialColor?: never;
}

type KobaPickerProps = SolidColorProps | GradientProps



function RealKobaPicker({ type, initialColor, initialStops, onColorTypeChange, onChangeComplete }: KobaPickerProps) {
  const [pickerType, setPickerType] = useState<number>(type === 'solid' ? 0 : 1);

  useEffect(() => {
    setPickerType(type === 'solid' ? 0 : 1);
  }, [type]);

  const handleColorType = (idx: number) => {
    setPickerType(idx);
    onColorTypeChange?.(idx === 0 ? 'solid' : 'gradient');
  }

  return (
    <View className="bg-neutral-300 dark:bg-neutral-800 p-4 gap-6 rounded-xl">
      <View className="flex flex-row gap-4 px-2">
        {["Solid", "Gradient"].map((type, idx) => {
          const isActive = pickerType === idx;

          return (
            <Pressable
              key={idx}
              className={`flex-1 p-2 rounded-lg ${isActive ? "bg-blue-400 dark:bg-blue-600" : "bg-neutral-400 dark:bg-neutral-600"}`}
              onPress={() => handleColorType(idx)}
            >
              <Text className={`text-xl text-center text-neutral-800 ${isActive ? "font-bold dark:text-neutral-200" : " dark:text-neutral-300"}`}>
                {type}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {pickerType === 0 ? (
        <KobaColorPicker initialColor={initialColor} onChangeComplete={(e) => onChangeComplete('solid', e)} />
      ) : (
        <KobaGradientPicker initialStops={initialStops} onChangeComplete={(e) => onChangeComplete('gradient', e)} />
      )}
    </View>
  )
}

RealKobaPicker.displayName = "KobaPicker"

const KobaPicker = RealKobaPicker;
export default memo(KobaPicker);