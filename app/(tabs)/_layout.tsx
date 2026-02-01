import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScreenTitle } from "@/components/screen-title";
import { Header } from "@react-navigation/elements";
import { Text, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerBackButtonDisplayMode: "minimal",
        header: ({ options }) => (
          <Header
            title={""}
            {...options}
            headerStyle={{
              height: 100,
              borderBottomWidth: 2,
              borderBottomColor: Colors.separatorLine,
            }}
            headerTitleStyle={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="leds"
        options={{
          title: "LED Strips",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      {/*<Tabs.Screen*/}
      {/*  name="index"*/}
      {/*  options={{*/}
      {/*    title: "Home",*/}
      {/*    tabBarButton: () => null,*/}
      {/*    tabBarIcon: ({ color }) => (*/}
      {/*      <IconSymbol size={28} name="paperplane.fill" color={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
    </Tabs>
  );
}
