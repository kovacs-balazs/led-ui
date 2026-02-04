import KobaNumberInputBox from "@/components/kobalib/koba-number-inputbox";
import KobaSwitch from "@/components/kobalib/koba-switch";
import { ThemedText } from "@/components/themed-text";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { Text, View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function WaveAnimationSettings() {
  const { update, selected } = useLedStripsStore();

  if (!selected) {
    return (
      <Text className="text-neutral-800 dark:text-neutral-200">
        No LED strip selected.
      </Text>
    );
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

        const updateLength = (newValue: number) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...currentAnim,
            length: newValue,
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const updateDistance = (newValue: boolean) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...currentAnim,
            distance: newValue,
          };

          update({ id: selected.id, animations: newAnimations });
        };

        return (
          <View className="flex flex-col gap-4">
            <KobaNumberInputBox
              label="Length"
              initialValue={currentAnim.length}
              minValue={0}
              maxValue={100}
              onSubmit={updateLength}
            />
            <KobaNumberInputBox
              label="Speed"
              initialValue={currentAnim.speed}
              minValue={0}
              maxValue={100}
              onSubmit={updateSpeed}
            />
            <KobaSwitch
              label="Distance"
              value={currentAnim.distance}
              onChange={updateDistance}
            />
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
