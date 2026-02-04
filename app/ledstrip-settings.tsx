import {
  KobaInputBox,
  KobaInputBoxRef,
} from "@/components/kobalib/koba-inputbox";
import KobaNumberInputBox from "@/components/kobalib/koba-number-inputbox";
import { ThemedView } from "@/components/themed-view";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import { TypeLedStrip } from "@/types/types";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Keyboard, Platform, Pressable, Text, View } from "react-native";

export default function LedStripSettings() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const ledId = Number(id);
  const { data, delete: deleteStrip, update } = useLedStripsStore();
  const ledStrip: TypeLedStrip | undefined = data.find((s) => s.id === ledId);

  const nameInputRef = useRef<KobaInputBoxRef>(null);
  const [nameInputError, setNameInputError] = useState<string>();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (!nameInputError) {
          return;
        }

        e.preventDefault();
        Alert.alert("Hiba!", "Kérlek javítsd ki a hibás beállításokat.");
      });

      return unsubscribe;
    }, [nameInputError, navigation]),
  );

  if (!ledStrip) {
    return <Text>Not found LED Strip!</Text>;
  }

  const handleNameSubmit = (name: string) => {
    if (!name.trim()) {
      nameInputRef.current?.setValue(ledStrip.name);
      setNameInputError("A mező nem lehet üres!");
      return;
    }

    if (
      data.some(
        (s) => s.id !== ledId && s.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      // nameInputRef.current?.setValue(ledStrip.name);
      setNameInputError("Ez a név már foglalt.");
      return;
    }

    update({ id: ledStrip.id, name: name });
    setNameInputError("");
  };

  const handleDelete = () => {
    deleteStrip(ledStrip.id);
    console.log("Delete ledStrip", ledStrip.id);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: ledStrip ? ledStrip.name : "LED Settings",
          headerBackVisible: Platform.OS !== "ios",
          headerTitleStyle: { fontSize: 20 },
          // headerLeft: () =>
          //   Platform.OS === "ios" ? (
          //     <Pressable onPress={() => router.back()} className="px-4">
          //       <Text className="text-xl text-neutral-600 dark:text-neutral-200">{"<"}</Text>
          //     </Pressable>
          //   ) : undefined,
        }}
      />

      <ThemedView className="flex-1">
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View className="flex-1 p-4 justify-between">
            {/* Felső gombok */}
            <View className="flex gap-6">
              <KobaInputBox
                ref={nameInputRef}
                label="Name"
                initialValue={ledStrip.name}
                placeholder={"Enter name"}
                onSubmit={handleNameSubmit}
                error={nameInputError}
              />
              <KobaNumberInputBox
                label={"Pin"}
                initialValue={ledStrip.pin}
                maxValue={12}
                onSubmit={(e) => update({ id: ledStrip.id, pin: e })}
              />
              <KobaNumberInputBox
                label={"LED Count"}
                initialValue={ledStrip.ledCount}
                maxValue={999}
                onSubmit={(e) => update({ id: ledStrip.id, ledCount: e })}
              />
            </View>

            {/* Alsó rész */}
            <View className="mb-8">
              <Pressable onLongPress={handleDelete} delayLongPress={1000}>
                {({ pressed }) => {
                  return (
                    <View
                      className={
                        pressed
                          ? "bg-red-500 p-3 rounded-lg scale-95"
                          : "bg-red-500 p-3 rounded-lg scale-100"
                      }
                    >
                      <Text className="text-neutral-200 font-semibold text-lg text-center">
                        Delete (Hold)
                      </Text>
                    </View>
                  );
                }}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </ThemedView>
    </>
  );
}
