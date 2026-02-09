// components/KobaSliderInput.tsx
import { clamp } from "@/utils/utils";
import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ThemedText } from "../themed-text";

interface KobaSliderProps {
  label?: string;
  initialValue: number;
  onValueChange?: (value: number) => void;
  onValueChangeComplete?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function RealKobaSlider({
  label,
  initialValue,
  onValueChange,
  onValueChangeComplete,
  min = 0,
  max = 100,
  step = 1,
}: KobaSliderProps) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value + "");
  const widthRef = useRef(0);
  // const isDraggingRef = useRef(false); // Drag állapot nyilvántartása

  const lastValueRef = useRef(value);
  useEffect(() => {
    lastValueRef.current = value;
  }, [value]);

  useEffect(() => {
    setValue(initialValue);
    setInputValue(initialValue.toString());
    lastValueRef.current = initialValue;
  }, [initialValue]);

  const [renderKey, setRenderKey] = useState(0); // Erőltetett újrarajzolás

  // Sync input when value changes externally
  useEffect(() => {
    setInputValue(value + "");
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

    return clamp(val, min, max);
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
      // onValueChange(clamped);
      setInputValue(clamped + "");
      onValueChange?.(clamped);
      setValue(clamped);
      return;
    }

    setInputValue(numericValue);
  };

  const handleGesture = (evt, complete = false) => {
    const newValue = clamp(positionToValue(evt.x), min, max);
    if (newValue === lastValueRef.current) {
      return;
    }

    lastValueRef.current = newValue;
    setInputValue(newValue.toString());

    onValueChange?.(newValue);
    setValue(newValue);

    if (complete) onValueChangeComplete?.(newValue);
  };

  const gestureSubmit = () => {
    const num = parseInt(inputValue);

    if (!isNaN(num)) {
      const clamped = clamp(num, min, max);
      onValueChangeComplete?.(clamped);
    }
  }

  const sliderGesture = Gesture.Race(
    Gesture.Tap()
      .runOnJS(true)
      .onStart((evt) => {
        Keyboard.dismiss();
        handleGesture(evt, true);
      }),

    Gesture.Pan()
      .runOnJS(true)
      .minDistance(5)
      .onStart((evt) => {
        handleGesture(evt);
      })
      .onUpdate((evt) => {
        handleGesture(evt);
      })
      .onEnd((evt, success) => {
        gestureSubmit();
      })
  );

  const handleSubmit = () => {
    setFocused(false);
    // Ensure valid value on blur
    const num = parseInt(inputValue);
    if (isNaN(num)) {
      setInputValue(value.toString());
    } else {
      const clamped = clamp(num, min, max);
      setInputValue(clamped.toString());

      setValue(clamped);
      onValueChange?.(clamped);
      onValueChangeComplete?.(clamped);
    }
  };

  const handleLayout = (e: any) => {
    widthRef.current = e.nativeEvent.layout.width - 12;
    setRenderKey((prev) => prev + 1);
  };

  return (
    <View className="mb-4">
      <View className="">
        {/* Label */}
        {label && <ThemedText className="text-lg mb-1">{label}</ThemedText>}
        {/* Slider + Input Row */}
        <View className="flex-row items-center gap-6">
          {/* Input Box */}
          <View className="w-14">
            <TextInput
              className={`rounded-md py-1.5 text-center border text-neutral-800 dark:text-neutral-200 ${focused ? "border-blue-400" : "border-neutral-600"}`}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              // onBlur={handleSubmit}
              // onSubmitEditing={handleSubmit}
              onEndEditing={handleSubmit}
              onFocus={() => setFocused(true)}
              selection={{ start: inputValue.length, end: inputValue.length }}
            />
          </View>

          {/* Slider */}
          <GestureDetector gesture={sliderGesture}>
            <View // For the bigger area
              onLayout={handleLayout}
              className="flex-1 h-8 justify-center"
            >
              <View
                className="h-2 bg-neutral-500 rounded-full"
                style={{ width: "100%", maxWidth: widthRef.current }}
              >
                <View
                  style={{ width: valueToPosition(value) }}
                  className="bg-blue-400 h-full rounded-full"
                />
              </View>
              {/* Thumb */}
              <View
                className="absolute w-6 h-6 rounded-xl bg-neutral-300 border border-gray-500 dark:border-0 elevation"
                style={{
                  left: valueToPosition(value) - 12,
                }}
              />
            </View>
          </GestureDetector>
        </View>
      </View>
    </View>
  );
}

function areEqual(prev: KobaSliderProps, next: KobaSliderProps) {
  return (
    prev.initialValue === next.initialValue &&
    prev.min === next.min &&
    prev.max === next.max &&
    prev.step === next.step &&
    prev.label === next.label
  );
}

RealKobaSlider.displayName = "KobaSlider"
const KobaSlider = RealKobaSlider
export default memo(KobaSlider, areEqual);
