import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
import { ThemedText } from "@/components/themed-text";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { TypeLedStrip } from "@/types/types";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function SolidAnimationSettings() {
  const { data, selectedId, updateAnimation } = useLedStripsStore();

  return (
    <AnimationWrapper>
      {(animation) => {
        const selected: TypeLedStrip | undefined = data.find((s) => s.id === selectedId);

        if (!selected) {
          return (<ThemedText>No selected ledstrip.</ThemedText>);
        }

        const animIndex = selected.animations.findIndex(
          (anim) => anim.id === animation.id,
        );

        if (animIndex === -1) {
          return <ThemedText>Animation not found on this strip.</ThemedText>;
        }

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
          <View className="flex">

            {/* // Az a baj, hogy ha leupdateli akkor a belső componentnekben a "régi" initialAnimation marad. */}
            <KobaAnimationColors initialAnimation={selected.animations[animIndex]} onChange={handleNewColorData} />
          </View>
        );
      }}
    </AnimationWrapper>
  );
}
