import { GradientStop } from "@/types/types";
import { memo, useCallback } from "react";
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
  const pickerType = type === 'solid' ? 0 : 1;

  const handleColorType = (idx: number) => {
    onColorTypeChange?.(idx === 0 ? 'solid' : 'gradient');
  };

  // const renderCount = useRef(0);
  // renderCount.current++;
  // console.log("Render", renderCount)

  const handleComplete = useCallback((data: any) => {
    if (pickerType === 0) {
      onChangeComplete('solid', data);
      return;
    }
    onChangeComplete('gradient', data);
  }, [pickerType]);

  return (
    <View className="gap-6">
      <View className="flex flex-row gap-4">
        {["Solid", "Gradient"].map((type, idx) => {
          const isActive = pickerType === idx;

          return (
            <Pressable
              key={idx}
              className={`flex-1 p-2 rounded-lg ${isActive ? "bg-blue-400 dark:bg-blue-600" : "bg-neutral-400 dark:bg-neutral-600"}`}
              onPress={() => handleColorType(idx)}
            >
              <Text className="text-xl text-center text-neutral-800 dark:text-neutral-200">
                {type}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {type === 'solid' ? (
        <KobaColorPicker /* key={initialColor} */ initialColor={initialColor} onChangeComplete={handleComplete} />
      ) : (
        <KobaGradientPicker /* key={JSON.stringify(initialStops)} */ initialStops={initialStops} onChangeComplete={handleComplete} />
      )}
    </View>
  )
}

RealKobaPicker.displayName = "KobaPicker"

const KobaPicker = RealKobaPicker;
export default memo(KobaPicker);