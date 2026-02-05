import { KobaColorPicker } from "@/components/kobalib/colors/koba-color-picker";
import { ThemedText } from "@/components/themed-text";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
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
          (anim) => anim.id === animation.id,
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

        return (
          <View className="">
            <View className="p-4">
              {/* Padding 4, hogy beljebb legyen, hogy kézzel könnyen határértékig el lehessen húzni a dolgokat */}
              <KobaColorPicker
                initialColor="#F0A580"
                onColorChange={(e) => {}}
                onColorChangeComplete={(e) => {}}
              />
            </View>
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
