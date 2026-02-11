import { TrashIcon } from "@/components/icons/trash-icon";
import { GradientStop } from "@/types/types";
import { clamp, generateOklabGradient } from "@/utils/utils";
import { extend } from "colord";
import lchPlugin from "colord/plugins/lch";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import KobaSlider from "../../koba-slider";
import KobaColorPicker from "./koba-color-picker-component";

extend([lchPlugin]);

interface KobaGradientPickerProps {
  initialStops?: GradientStop[];
  onChangeComplete: (stops: GradientStop[]) => void;
}

function RealKobaGradientPicker({
  initialStops = [
    { id: 0, position: 0, color: "#FF0000" },
    { id: 1, position: 100, color: "#0000FF" },
  ],
  onChangeComplete,
}: KobaGradientPickerProps) {
  const [stops, setStops] = useState<GradientStop[]>(initialStops);
  const [selectedStopId, setSelectedStopId] = useState(stops[0].id);
  const barWidthRef = useRef(0);

  const [renderKey, setRenderKey] = useState(0);

  // Azért kell, hogy ha selectedStopId változik, akkor a stopokból megkeresi azt a stopot.
  const selectedStop = useMemo(() => stops.find((s) => s.id === selectedStopId), [stops, selectedStopId]);

  const updateStops = (newStops: GradientStop[]) => {
    setStops(newStops);
    onChangeComplete?.(newStops);
  };

  const handleTap = useCallback((evt) => {
    if (barWidthRef.current === 0) return;
    const x = clamp(evt.x, 0, barWidthRef.current);
    const position = clamp((x / barWidthRef.current) * 100, 0, 100);
    const tooClose = stops.find(
      (stop) => Math.abs(stop.position - position) < 8,
    );

    if (tooClose) {
      setSelectedStopId(tooClose.id);
      return;
    }

    const maxId = Math.max(...stops.map((stop) => stop.id));
    const newStop: GradientStop = {
      id: maxId + 1,
      position: Math.round(position),
      color: "#FFFFFF",
    };

    const updatedStops = [...stops, newStop].sort((a, b) => a.position - b.position);
    // onChangeComplete(stops);
    console.log("Miért nem selecteli ki? ", maxId, newStop.id)
    setSelectedStopId(newStop.id);
    setStops(updatedStops);
    //onChangeComplete?.(updatedStops);
    //updateStops(updatedStops);
  }, [stops]);

  const removeStop = useCallback(
    (stopId: number) => {
      const removedStop = stops.find((s) => s.id === stopId);
      if (!removedStop) return;
      if (stops.length <= 2) {
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: "You can't delete more stops",
          position: "bottom",
          visibilityTime: 2000,
        });
        return;
      }

      const newStops = stops.filter((stop) => stopId !== stop.id);

      updateStops(newStops);
      //onChangeComplete?.(newStops);
      if (stopId === removedStop.id) {
        const nearestStop = newStops.reduce((closest, current) => {
          const closestDistance = Math.abs(
            closest.position - removedStop.position,
          );
          const currentDistance = Math.abs(
            current.position - removedStop.position,
          );

          return currentDistance < closestDistance ? current : closest;
        });

        setSelectedStopId(nearestStop.id);
      }
    }, [stops]);


  const handleSliderChange = useCallback((e: number) => {
    if(!selectedStop) return;
    setStops(prev => {
      const newStops = prev
        .map(stop =>
          stop.id === selectedStop.id
            ? { ...stop, position: Math.round(e) }
            : stop
        )
        .sort((a, b) => a.position - b.position);
      return newStops;
    });
  }, [selectedStop]);


  const handleColorChange = useCallback((newColor: string) => {
    setStops(prev => {
      const newStops = prev
        .map(stop =>
          stop.id === selectedStopId
            ? { ...stop, color: newColor }
            : stop
        )
        .sort((a, b) => a.position - b.position);
      return newStops;
    });
    // onChangeComplete?.(stops);
  }, [selectedStopId]);

  const handleColorChangeCallback = useCallback((e: string) => {
    handleColorChange(e);
  }, [handleColorChange]);

  const gestureCreateTrackTap = Gesture.Tap().runOnJS(true).onStart((evt) => { Keyboard.dismiss(); handleTap(evt); }); // Create
  const gestureStop = (stopId: number) => Gesture.Tap().runOnJS(true).onStart((evt) => { Keyboard.dismiss(); setSelectedStopId(stopId) }); // Select

  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops]);

  const { colors: gradientColors, locations: gradientLocations } = generateOklabGradient(sortedStops, 50);

  //const gradientColors = sortedStops.map(s => s.color);
  //const gradientLocations = sortedStops.map(s => s.position / 100);

  if (process.env.NODE_ENV === 'development') {
    const ids = stops.map(s => s.id);
    if (new Set(ids).size !== ids.length) {
      console.error('Duplicate stop IDs detected!', stops);
    }
  }

  return (
    <View className="flex flex-col gap-4">
      <GestureDetector gesture={gestureCreateTrackTap}>
        <View
          onLayout={(e) => { barWidthRef.current = e.nativeEvent.layout.width; setRenderKey(prev => prev + 1) }}
          className="h-12 rounded-2xl"
        >
          <LinearGradient
            key="gradient"
            colors={gradientColors}
            locations={gradientLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 16 }}
          />
          {stops.map((stop) => (
            <GestureDetector key={stop.id} gesture={gestureStop(stop.id)}>
              <View
                className={`absolute border-2 rounded-xl border-neutral-800 dark:border-neutral-200 ${stop.id === selectedStopId ? "scale-y-125" : "scale-y-100"} h-full w-3`}
                style={{
                  left: (stop.position / 100) * barWidthRef.current - 6,
                  bottom: 0,
                }}
              />
            </GestureDetector>
          ))}
        </View>
      </GestureDetector>

      {typeof selectedStop?.position === "number" && (
        <View className="flex flex-col gap-4">
          <View className="flex flex-row gap-2">
            <View className="flex-1">
              <KobaSlider initialValue={Math.round(selectedStop.position) ?? 0} onValueChange={handleSliderChange} onValueChangeComplete={() => onChangeComplete?.(stops)} />
            </View>
            <View className="flex">
              <Pressable className="flex bg-red-500 h-10 w-10 rounded-full items-center justify-center" onPress={(e) => removeStop(selectedStop.id)}>
                <TrashIcon size={20} color="#262626" />
              </Pressable>
            </View>
          </View>
          <View>
            <KobaColorPicker key={selectedStopId} initialColor={selectedStop.color} onColorChange={handleColorChangeCallback} onChangeComplete={() => onChangeComplete?.(stops)} />
          </View>
        </View>
      )}
    </View>
  );
}

RealKobaGradientPicker.displayName = "KobaGradientPicker";

const KobaGradientPicker = RealKobaGradientPicker;
export default memo(KobaGradientPicker);
