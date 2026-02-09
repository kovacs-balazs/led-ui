import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  placeholder?: string;
  initialValue?: string; // Csak kezdeti érték (nem controlled!)
  onSubmit: (text: string) => void;
  error?: string;
}

export interface KobaInputBoxRef {
  setValue: (value: string) => void;
  getValue: () => string;
}

export const KobaInputBox = forwardRef<KobaInputBoxRef, InputProps>(
  ({ label, placeholder, initialValue = "", onSubmit, error }, ref) => {
    const [focused, setFocused] = useState(false);
    const [text, setText] = useState(initialValue);

    // Expose imperative methods to parent
    useImperativeHandle(
      ref,
      () => ({
        setValue: (value: string) => setText(value),
        getValue: () => text,
      }),
      [text],
    );

    return (
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
          {label}
        </Text>
        <TextInput
          className={`border 
          ${focused ? "border-blue-400" : "border-neutral-600"}
          rounded-md p-3 text-neutral-800 dark:text-neutral-200`}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ fontSize: 16 }}
          returnKeyType="done"
          /* onSubmitEditing={() => {
            onSubmit(text);
          }} */
          onEndEditing={() => onSubmit(text)}
        />
        {/* Error message */}
        {error ? (
          <Text className="text-red-500 mt-1 text-sm">{error}</Text>
        ) : null}
      </View>
    );
  },
);

KobaInputBox.displayName = "KobaInputBox";
