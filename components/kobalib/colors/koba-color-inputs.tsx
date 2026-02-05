import { ThemedText } from "@/components/themed-text";
import { clamp } from "@/utils/utils";
import { Colord } from "colord";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

function LabelledInputBox({
  label,
  initialValue,
  channel,
  onSubmit,
}: {
  label: string;
  initialValue: number;
  channel: string;
  onSubmit: (channel: string, value: number) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState<string>(initialValue + "");

  useEffect(() => {
    setInputValue(initialValue.toString());
  }, [initialValue]);

  const handleChange = (e: string) => {
    const numericValue = e.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setInputValue("0");
      return;
    }

    const num = parseInt(numericValue);
    if (!isNaN(num)) {
      const clamped = clamp(num, 0, 255);
      setInputValue(clamped + "");
      return;
    }

    setInputValue(numericValue);
  };

  const handleSubmit = () => {
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    onSubmit(channel, parseInt(numericValue));
  };

  return (
    <View
      className={`flex flex-row py-1 w-20 rounded-xl items-center border ${focused ? "border-blue-400" : "border-neutral-600"}`}
    >
      <ThemedText className="text-lg ml-2">{label}</ThemedText>
      <TextInput
        className={`
          rounded-md text-neutral-800 dark:text-neutral-200 text-center w-14`}
        value={inputValue}
        keyboardType="numeric"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        onEndEditing={handleSubmit}
        selection={{ start: inputValue.length, end: inputValue.length }}
        maxLength={3}
      />
    </View>
  );
}

interface KobaColorInputsProps {
  color: Colord;
  onSubmit: (channel: string, value: any) => void;
}

export function KobaColorInputs({ color, onSubmit }: KobaColorInputsProps) {
  const [hexFocused, setHexFocused] = useState(false);
  const [hexInput, setHexInput] = useState(() =>
    color.toHex().substring(0, 7).toUpperCase(),
  );

  useEffect(() => {
    setHexInput(color.toHex().substring(0, 7).toUpperCase());
  }, [color]);

  const handleHexChange = (input: string) => {
    let value = input.toUpperCase();

    if (!value || value === "") {
      setHexInput("#");
      return;
    }

    if (!value.startsWith("#")) {
      value = "#" + value;
    }

    value =
      "#" +
      value
        .substring(1) // a # nélkül
        .replace(/[^0-9A-F]/g, "");

    value = value.substring(0, 7);

    setHexInput(value);
  };

  const { r, g, b } = color.toRgb();
  /* const hex = color.toHex().substring(0, 7).toUpperCase(); */

  return (
    <View className="flex flex-row justify-between">
      {/* RGB */}
      <View className="flex flex-row gap-4">
        <LabelledInputBox
          label="R"
          initialValue={r}
          channel="r"
          onSubmit={onSubmit}
        />
        <LabelledInputBox
          label="G"
          initialValue={g}
          channel="g"
          onSubmit={onSubmit}
        />
        <LabelledInputBox
          label="B"
          initialValue={b}
          channel="b"
          onSubmit={onSubmit}
        />
      </View>
      {/* HEX */}
      <View>
        <TextInput
          className={`
          rounded-lg text-neutral-800 dark:text-neutral-200 text-center w-24 p-2 border
          ${hexFocused ? "border-blue-400" : "border-neutral-600"}`}
          value={hexInput}
          onChangeText={handleHexChange}
          maxLength={7}
          autoCapitalize="characters"
          onBlur={() => setHexFocused(false)}
          onFocus={() => setHexFocused(true)}
          selection={{ start: hexInput.length, end: hexInput.length }}
          onSubmitEditing={() => onSubmit("hex", hexInput)}
          onEndEditing={() => onSubmit("hex", hexInput)}
        />
      </View>
    </View>
  );
}
