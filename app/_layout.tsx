import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { View } from "react-native"; // Add this import

import { useColorScheme } from "@/hooks/use-color-scheme";

import "../global.css";
import Toast from "react-native-toast-message";
import { ThemedToast } from "@/components/kobalib/koba-toast";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const bgColor = theme.colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal", }}
          />
        </Stack>
        <Toast config={{
          success: (props) => <ThemedToast {...props} type="success" />,
          error: (props) => <ThemedToast {...props} type="error" />,
          info: (props) => <ThemedToast {...props} type="info" />,
        }} />
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor="transparent"
          translucent
        />
      </ThemeProvider>
    </View>
  );
}