import { BaseAnimation } from "@/types/types";
import { memo, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import KobaColorPickerMenu from "./color-picker/koba-color-picker-menu";
import KobaAnimationColorsPicker from "./koba-animation-colors-picker";

interface RealKobaAnimationColorsProps {
  initialAnimation: BaseAnimation;
  onChange: (newAnimationData: any) => void;
}

function RealKobaAnimationColors({ initialAnimation, onChange }: RealKobaAnimationColorsProps) {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (initialAnimation.colors && !selected) {
      const firstKey = Object.keys(initialAnimation.colors)[0];
      setSelected(firstKey ?? '');
    }
  }, [initialAnimation.id]);

  const handleChangeAnimationColorType = useCallback((e) => {
    setSelected(e);
    console.log("FASZ")
  }, []);

  const handleColorTypeChange = useCallback((e) => {
    const newData = {
      colors: {
        ...initialAnimation.colors,
        [selected]: {
          ...initialAnimation.colors[selected],
          type: e
        }
      }
    };

    onChange(newData);
  }, [initialAnimation, selected]);


  const handleColorChange = useCallback((type, e) => {
    const colorKey = type === "solid" ? "color" : "colors";
    const newData = {
      colors: {
        ...initialAnimation.colors,
        [selected]: {
          ...initialAnimation.colors[selected],
          type: type,
          [colorKey]: e,
        }
      }
    };

    onChange(newData);
  }, [initialAnimation, selected]);

  // if(selected) console.log(selected, initialAnimation.colors[selected].color)
  return (
    <View className="p-4 gap-4 rounded-xl bg-neutral-300 dark:bg-neutral-800">
      <KobaAnimationColorsPicker initialAnimation={initialAnimation} onChange={handleChangeAnimationColorType} />
      <View className="border border-blue-500" />
      {selected && (
        <KobaColorPickerMenu
          key={selected}
          type={initialAnimation.colors[selected].type}
          initialColor={initialAnimation.colors[selected].color}
          initialStops={initialAnimation.colors[selected].colors}
          onColorTypeChange={handleColorTypeChange}
          onChangeComplete={handleColorChange}
        />
      )}
    </View>
  );
}

RealKobaAnimationColors.displayName = "KobaAnimationColors"
const KobaAnimationColors = RealKobaAnimationColors;
export default memo(KobaAnimationColors);