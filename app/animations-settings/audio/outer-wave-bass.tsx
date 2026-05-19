import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
import KobaFloatNumberInputBox from "@/components/kobalib/koba-float-number-inputbot";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { TypeLedStrip } from "@/types/types";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function OuterWaveBassAnimationSettings() {
  const { data, selectedId, updateAnimation } = useLedStripsStore();

  return (
    <AnimationWrapper>
      {(animation) => {
        const selected: TypeLedStrip | undefined = data.find((s) => s.id === selectedId);

        if (!selected) {
          return <ThemedText>No LED strip selected</ThemedText>;
        }

        const animIndex = selected.animations.findIndex(
          (anim) => anim.id === animation.id,
        );

        console.log(selected.animations, animIndex);
        

        if (animIndex === -1) {
          return <ThemedText>Animation not found on this strip.</ThemedText>
        }

        const updateThreshold = (newValue: number) => {
          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            threshold: newValue
          }));
        };

        const handleNewColorData = ({ key, type, value }) => {
          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            colors: {
              ...anim.colors,
              [key]: {
                ...anim.colors[key],
                type,
                [type === "solid" ? "color" : "gradient"]: value
              }
            }
          }));
        };

        
        return (
          <View className="flex flex-col gap-4">
            <KobaFloatNumberInputBox
              label="Threshold"
              initialValue={selected.animations[animIndex].threshold}
              minValue={0}
              maxValue={1}
              decimals={4}
              onSubmit={updateThreshold}
            />
            <View
              className="h-0.5"
              style={{ backgroundColor: Colors.separatorLine }}
            />
            <View className="flex">
              {/* // Az a baj, hogy ha leupdateli akkor a belső componentnekben a "régi" initialAnimation marad. */}
              <KobaAnimationColors initialAnimation={selected.animations[animIndex]} onChange={handleNewColorData} />
            </View>
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
