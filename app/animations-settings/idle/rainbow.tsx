import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
import KobaSlider from "@/components/kobalib/koba-slider";
import KobaSwitch from "@/components/kobalib/koba-switch";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function RainbowAnimationSettings() {
  const { update, selected } = useLedStripsStore();

  return (
    <AnimationWrapper>
      {(animation) => {
        const animIndex = selected.animations.findIndex(
          (anim) => anim.id === animation.id, // animation.id
        );

        if (animIndex === -1) {
          return <ThemedText>Animation not found on this strip.</ThemedText>;
        }

        const currentAnim = selected.animations[animIndex];

        const updateMoving = (newValue: boolean) => {
          handleNewAnimationData({ moving: newValue });
        };

        const updateBreathing = (newValue: boolean) => {
          handleNewAnimationData({ breathing: newValue });
        };

        const updateSpeed = (newValue: number) => {
          handleNewAnimationData({ speed: newValue });
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
          <View className="flex gap-4">
            <KobaSlider
              label="Speed"
              initialValue={currentAnim.speed}
              onValueChangeComplete={updateSpeed}
            />
            <KobaSwitch
              label="Moving"
              value={currentAnim.moving}
              onChange={updateMoving}
            />
            <KobaSwitch
              label="Breathing"
              value={currentAnim.breathing}
              onChange={updateBreathing}
            />
            <View
              className="h-0.5"
              style={{ backgroundColor: Colors.separatorLine }}
            />
            {/* // Az a baj, hogy ha leupdateli akkor a belső componentnekben a "régi" initialAnimation marad. */}
            <KobaAnimationColors initialAnimation={currentAnim} onChange={handleNewAnimationData} />
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
