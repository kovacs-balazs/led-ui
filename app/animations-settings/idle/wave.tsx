import KobaAnimationColors from "@/components/kobalib/colors/koba-animation-colors";
import KobaNumberInputBox from "@/components/kobalib/koba-number-inputbox";
import KobaSlider from "@/components/kobalib/koba-slider";
import KobaSwitch from "@/components/kobalib/koba-switch";
import KobaTabPicker from "@/components/kobalib/koba-tab-picker";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { TypeLedStrip } from "@/types/types";
import { View } from "react-native";
import AnimationWrapper from "../animation-settings-wrapper";

export default function WaveAnimationSettings() {
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

        //const currentAnim = selected.animations[animIndex];

        const updateSpeed = (newValue: number) => {
          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            speed: newValue,
          }));
        };

        /* const updateSpeed = (newValue: number) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...newAnimations[animIndex],
            speed: newValue,
          };

          update({ id: selected.id, animations: newAnimations });
        }; */

        const updateLength = (newValue: number) => {
          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            length: newValue,
          }));
        };

        /* const updateLength = (newValue: number) => {
          const newAnimations = [...selected.animations];
          newAnimations[animIndex] = {
            ...newAnimations[animIndex],
            length: newValue,
          };

          update({ id: selected.id, animations: newAnimations });
        };
 */
        /*         const updateDistance = (newValue: boolean) => {
                  const newAnimations = [...selected.animations];
                  newAnimations[animIndex] = {
                    ...newAnimations[animIndex],
                    distance: newValue,
                  };
        
                  update({ id: selected.id, animations: newAnimations });
                }; */

        const updateDistance = (newValue: boolean) => {
          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            distance: newValue,
          }));
        };

        const updateType = (newType: string) => {
          updateKey("type", newType);

        }

        const updateKey = (key, value) => {

          updateAnimation(selected.id, animation.id, (anim) => ({
            ...anim,
            [key]: value,
          }));
        };

        const handleNewColorData = ({ key, type, value }) => {
          /* const newAnimations = [...selected.animations];
          const anim = newAnimations[animIndex];

          newAnimations[animIndex] = {
            ...anim,
            colors: {
              ...anim.colors,
              [key]: {
                ...anim.colors[key],
                type,
                [type === "solid" ? "color" : "gradient"]: value
              }
            }
          };

          update({ id: selected.id, animations: newAnimations }); */
          
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
            <KobaNumberInputBox
              label="Length"
              initialValue={selected.animations[animIndex].length}
              minValue={0}
              maxValue={100}
              onSubmit={updateLength}
            />
            <KobaSlider
              label="Speed"
              initialValue={selected.animations[animIndex].speed}
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
              value={selected.animations[animIndex].distance}
              onChange={updateDistance}
            />
            <KobaTabPicker label="Wave Type" value={selected.animations[animIndex].type} tabs={["default", "reverse", "bounce"]} onChange={updateType} />
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
