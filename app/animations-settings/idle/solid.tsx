import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
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
          (anim) => anim.id === 1, // animation.id
        );

        if (animIndex === -1) {
          return <ThemedText>Animation not found on this strip.</ThemedText>;
        }

        let currentAnim = selected.animations[animIndex];

        const handleTypeChange = (key, type: "solid" | "gradient") => {
          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            colors: {
              ...anim.colors,
              [key]: {
                ...anim.colors.foreground,
                type: type,
              },
            },
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const handleAnimationColorChange = (
          key,
          channel: "solid" | "gradient",
          colorData: string | GradientStop[]
        ) => {
          const colorKey = channel === "solid" ? "color" : "colors";

          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            colors: {
              ...anim.colors,
              [key]: {
                ...anim.colors.foreground, // ✅ EZ
                type: channel,
                [colorKey]: colorData,
              },
            },
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const handleNewAnimationData = (data: any) => {
          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            ...data
          };

          update({ id: selected.id, animations: newAnimations });
        };

        return (
          <View className="flex">

            {/* // Az a baj, hogy ha leupdateli akkor a belső componentnekben a "régi" initialAnimation marad. */}
            <KobaAnimationColors initialAnimation={currentAnim} onChange={handleNewAnimationData} />
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
