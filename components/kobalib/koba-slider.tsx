// components/KobaSliderInput.tsx
import { clamp } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { Keyboard, PanResponder, Text, TextInput, View } from "react-native";
import { ThemedText } from "../themed-text";

interface KobaSliderProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // e.g., "%", "px", "ms"
}

export function KobaSlider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: KobaSliderProps) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const trackRef = useRef<View>(null);
  const widthRef = useRef(0);
  const [sliderValue, setSliderValue] = useState(value);

  const [renderKey, setRenderKey] = useState(0); // Erőltetett újrarajzolás

  // Sync input when value changes externally
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const valueToPosition = (pos: number) => {
    const clamped = clamp(pos, min, max);
    return ((clamped - min) / (max - min)) * widthRef.current;
  };

  // Számolás: pozíció → érték
  const positionToValue = (pos: number) => {
    const percentage = Math.max(0, Math.min(1, pos / widthRef.current));
    let val = min + percentage * (max - min);

    // Step rounding
    if (step !== 0) {
      val = Math.round(val / step) * step;
    }

    return Math.max(min, Math.min(max, val));
  };

  const handleInputChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setInputValue(min.toString());
      return;
    }

    const num = parseInt(numericValue);
    if (!isNaN(num)) {
      const clamped = clamp(num, min, max);
      onValueChange(clamped);
      setInputValue(clamped + "");
      return;
    }

    setInputValue(numericValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      // Tap vagy drag mindig frissíti az értéket
      onPanResponderGrant: (evt, gs) => {
        Keyboard.dismiss();

        const newValue = positionToValue(evt.nativeEvent.locationX);
        setInputValue(newValue + "");
        onValueChange(newValue);
      },

      onPanResponderMove: (evt, gs) => {
        Keyboard.dismiss();

        const newValue = positionToValue(evt.nativeEvent.locationX);
        setInputValue(newValue + "");
        onValueChange(newValue);
      },
    }),
  ).current;

  const handleSubmit = () => {
    setFocused(false);
    // Ensure valid value on blur
    const num = parseInt(inputValue);
    if (isNaN(num)) {
      setInputValue(value.toString());
    } else {
      const clamped = clamp(num, min, max);
      if (clamped !== num) {
        setInputValue(clamped.toString());
        onValueChange(clamped);
      }
    }
  };

  const handleLayout = (e: any) => {
    widthRef.current = e.nativeEvent.layout.width;
    setRenderKey((prev) => prev + 1);
  };

  return (
    <View className="mb-4">
      <View className="">
        {/* Label */}
        {label && <ThemedText className="text-lg mb-1">{label}</ThemedText>}
        {/* Slider + Input Row */}
        <View className="flex-row items-center gap-4">
          {/* Input Box */}
          <View className="w-16">
            <TextInput
              className={`rounded-md py-1.5 text-center border border-neutral-600 text-neutral-800 dark:text-neutral-200
								${focused ? "border-blue-400" : ""}`}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              onBlur={handleSubmit}
              onSubmitEditing={handleSubmit}
              onEndEditing={handleSubmit}
              onFocus={() => setFocused(true)}
              selection={{ start: inputValue.length, end: inputValue.length }}
            />
          </View>

          {/* Unit Label (if exists) */}
          {unit ? (
            <Text className="text-neutral-500 dark:text-neutral-400 w-6 text-right">
              {unit}
            </Text>
          ) : null}

          {/* Slider */}
          <View // For the bigger area
            ref={trackRef}
            onLayout={handleLayout}
            className="flex-1 h-8 justify-center"
            {...panResponder.panHandlers}
          >
            <View
              className="h-2 bg-neutral-500 rounded-full"
              style={{ width: "100%" }}
            >
              <View
                style={{ width: valueToPosition(value) }}
                className="bg-blue-400 h-full rounded-full"
              />
            </View>
            {/* Thumb */}
            <View
              pointerEvents="none"
              className="absolute w-6 h-6 rounded-xl bg-neutral-300 border border-gray-500 dark:border-0 elevation"
              style={{
                left: valueToPosition(value) - 12,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
