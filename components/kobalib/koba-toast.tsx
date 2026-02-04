// components/ThemedToast.js
import { useColorScheme } from "react-native";
import { BaseToast } from "react-native-toast-message";

export const ThemedToast = (props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Color palette (light/dark mode)
  const constColors = {
    text1: isDark ? "#e7e5e4" : "#292524",
    text2: isDark ? "#d6d3d1" : "#44403b",
    bg: isDark ? "#151718" : "#F0F0F0",
  };

  const colors = {
    success: {
      border: isDark ? "#4CAF50" : "#4CAF50",
    },
    error: {
      border: isDark ? "#F44336" : "#F44336",
    },
    info: {
      border: isDark ? "#2196F3" : "#2196F3",
    },
  }[props.type || "success"];

  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.border,
        backgroundColor: constColors.bg,
        marginBottom: 100,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: constColors.text1,
      }}
      text2Style={{
        fontSize: 14,
        color: constColors.text2,
      }}
    />
  );
};
