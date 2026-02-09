import KobaPicker from "@/components/kobalib/colors/koba-color-picker-menu";
import { ThemedText } from "@/components/themed-text";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { GradientStop } from "@/types/types";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function SolidAnimationSettings() {
  const { update, selected } = useLedStripsStore();

  if (!selected) {
    return <ThemedText>No LED strip selected.</ThemedText>;
  }

  return (
    <AnimationWrapper>
      {(animation) => {
        const animIndex = selected.animations.findIndex(
          (anim) => anim.id === 1,
        );

        if (animIndex === -1) {
          return <ThemedText>Animation not found on this strip.</ThemedText>;
        }

        const currentAnim = selected.animations[animIndex];

        const updateSpeed = (newValue: number) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...currentAnim,
            speed: newValue,
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const handleTypeChange = (type: "solid" | "gradient") => {
          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            colors: {
              ...anim.colors,
              foreground: {
                ...anim.colors.foreground, // ✅ EZ
                type: type,
              },
            },
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const handleAnimationColorChange = (
          channel: "solid" | "gradient",
          colorData: string | GradientStop[]
        ) => {
          const key = channel === "solid" ? "color" : "colors";

          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            colors: {
              ...anim.colors,
              foreground: {
                ...anim.colors.foreground, // ✅ EZ
                type: channel,
                [key]: colorData,
              },
            },
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const { solid, gradient } = { solid: currentAnim.colors.foreground.color, gradient: currentAnim.colors.foreground.colors }

        return (
          <View className="flex">
            {/* Padding 4, hogy beljebb legyen, hogy kézzel könnyen határértékig el lehessen húzni a dolgokat */}
            {/* <KobaColorPicker
              initialColor="#F0A580"
              onColorChange={(e) => {}}
              onColorChangeComplete={(e) => {}}
            /> */}
            {/* <KobaGradientPicker onChangeComplete={(e) => {}} /> */}
            <KobaPicker type={currentAnim.colors.foreground.type} initialColor={solid} initialStops={gradient} onColorTypeChange={handleTypeChange} onChangeComplete={handleAnimationColorChange} />
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
