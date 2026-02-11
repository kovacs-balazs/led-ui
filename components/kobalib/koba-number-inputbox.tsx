import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  minValue?: number;
  maxValue?: number;
  initialValue?: number; // Csak kezdeti érték (nem controlled!)
  onSubmit: (number: number) => void;
}

export default function KobaNumberInputBox({
  label,
  minValue = 0,
  maxValue,
  initialValue = 0,
  onSubmit,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState<string>(initialValue + "");

  const handleChange = (input: string) => {
    const numericValue = input.replace(/[^0-9]/g, "");

    let number = parseInt(numericValue, 10);
    if (isNaN(number)) number = minValue;

    // clamp between min/max
    if (number < minValue) number = minValue;
    if (maxValue !== undefined && number > maxValue) {
      number = maxValue;
    }

    setText(number.toString());
  };

  return (
    <View>
      <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
        {label}
      </Text>
      <TextInput
        className={`border 
          ${focused ? "border-blue-400" : "border-neutral-600"}
          rounded-md p-3 text-neutral-800 dark:text-neutral-200`}
        value={text + ""}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
        }}
        style={{ fontSize: 16 }}
        returnKeyType="done"
        /* onSubmitEditing={() => {
        }} */
        onEndEditing={() => {
          onSubmit(parseInt(text, 10));
        }}
      />
    </View>
  );
}
