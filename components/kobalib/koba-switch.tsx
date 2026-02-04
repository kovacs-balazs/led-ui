import { Platform, Switch, Text, View } from "react-native";

interface InputProps {
  label: string;
  value: boolean;
  onChange: (e: boolean) => void;
}

export default function KobaSwitch({ label, value, onChange }: InputProps) {
  return (
    <View className="flex flex-col">
      <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        {label}
      </Text>
      <View className={`self-start ${Platform.OS === "ios" ? "mt-1" : ""}`}>
        <Switch value={value} onValueChange={onChange} />
      </View>
    </View>
  );
}
