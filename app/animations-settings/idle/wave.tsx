import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
import KobaNumberInputBox from "@/components/kobalib/koba-number-inputbox";
import KobaSlider from "@/components/kobalib/koba-slider";
import KobaSwitch from "@/components/kobalib/koba-switch";
import KobaTabPicker from "@/components/kobalib/koba-tab-picker";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function WaveAnimationSettings() {
  const { update, selected } = useLedStripsStore();

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

        const updateType = (newType: string) => {
          updateKey("type", newType);
        }

        const updateKey = (key, value) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...currentAnim,
            [key]: value,
          };

          update({ id: selected.id, animations: newAnimations });
        };

        const handleNewColorData = (data: any) => {
          const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            ...data
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
            <KobaSlider
              label="Speed"
              initialValue={currentAnim.speed}
              onValueChangeComplete={updateSpeed}
            />
            {/* <KobaNumberInputBox
              label="Speed"
              initialValue={currentAnim.speed}
              minValue={0}
              maxValue={100}
              onSubmit={updateSpeed}
            /> */}
            <KobaSwitch
              label="Distance"
              value={currentAnim.distance}
              onChange={updateDistance}
            />
            <KobaTabPicker label="Wave Type" initialTab={currentAnim.type} tabs={["default", "reverse", "bounce"]} onChange={updateType} />
            <View
              className="h-0.5"
              style={{ backgroundColor: Colors.separatorLine }}
            />
            <View className="flex">
              {/* // Az a baj, hogy ha leupdateli akkor a belső componentnekben a "régi" initialAnimation marad. */}
              <KobaAnimationColors initialAnimation={currentAnim} onChange={handleNewColorData} />
            </View>
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
