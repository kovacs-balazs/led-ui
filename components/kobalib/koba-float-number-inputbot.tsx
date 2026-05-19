import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  minValue?: number;
  maxValue?: number;
  initialValue?: number;
  decimals?: number;
  onSubmit: (number: number) => void;
}

export default function KobaFloatNumberInputBox({
  label,
  minValue = 0,
  maxValue = 1,
  initialValue = 0,
  decimals = 2,
  onSubmit,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(initialValue.toString());

  useEffect(() => {
    setText(initialValue.toString());
  }, [initialValue]);

  const clamp = (value: number) => {
    let num = value;

    if (num < minValue) num = minValue;
    if (maxValue !== undefined && num > maxValue) {
      num = maxValue;
    }

    return num;
  };

  const handleChange = (input: string) => {
    // csak szám + egy pont
    let sanitized = input.replace(/[^0-9.]/g, "");

    // több pont eltávolítása
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    // ha "."-tal kezdődik → "0."
    if (sanitized.startsWith(".")) {
      sanitized = "0" + sanitized;
    }

    setText(sanitized);
  };

  const handleSubmit = () => {
    let number = parseFloat(text);

    if (isNaN(number)) {
      number = minValue;
    }

    number = clamp(number);

    const fixed = parseFloat(number.toFixed(decimals));

    setText(fixed.toString());
    onSubmit(fixed);
  };

  return (
    <View>
      <Text className="mb-1 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        {label}
      </Text>

      <TextInput
        className={`rounded-md border p-3 text-neutral-800 dark:text-neutral-200
          ${focused ? "border-blue-400" : "border-neutral-600"}`}
        value={text}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          handleSubmit();
        }}
        keyboardType="decimal-pad"
        returnKeyType="done"
        style={{ fontSize: 16 }}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
}