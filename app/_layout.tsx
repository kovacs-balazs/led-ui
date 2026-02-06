import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { ThemedToast } from "@/components/kobalib/koba-toast";
import { useConnection } from "@/hooks/use-connection";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";
import LoadingScreen from "./loading";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const connection = useConnection();

  /*   const router = useRouter();
  const segments = useSegments(); */

  /* useEffect(() => {
    // Várunk egy kicsit az átirányítás előtt
    const timer = setTimeout(() => {
      const inTabs = segments[0] === "(tabs)";

      if (!connection.loading) {
        if (connection.isConnected && !inTabs) {
          router.replace("/(tabs)");
        } else if (!connection.isConnected && inTabs) {
          router.replace("/loading");
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [connection.isConnected, connection.loading]); */

  if (!connection.isConnected) {
    return (
      <ThemeProvider value={theme}>
        <LoadingScreen status={connection.status} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <Toast
        config={{
          success: (props) => <ThemedToast {...props} type="success" />,
          error: (props) => <ThemedToast {...props} type="error" />,
          info: (props) => <ThemedToast {...props} type="info" />,
        }}
      />
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
    </ThemeProvider>
  );
}
