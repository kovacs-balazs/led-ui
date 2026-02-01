import { TypeLedStrip } from "@/types/types";
import { Alert, Keyboard, Platform, Pressable, Text, View } from "react-native";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useLedStripsStore } from "@/hooks/use-ledstrips";
import {
  KobaInputBox,
  KobaInputBoxRef,
} from "@/components/kobalib/koba-inputbox";
import { useCallback, useRef, useState } from "react";
import KobaNumberInputBox from "@/components/kobalib/koba-number-inputbox";

export default function LedStripSettings() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const ledId = Number(id);
  const { data, update } = useLedStripsStore();
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

  return (
    <>
      <Stack.Screen
        options={{
          title: ledStrip ? ledStrip.name : "LED Settings",
          headerBackVisible: Platform.OS !== "ios",
          // headerLeft: () =>
          //   Platform.OS === "ios" ? (
          //     <Pressable onPress={() => router.back()} className="px-4">
          //       <Text className="text-xl text-neutral-600 dark:text-neutral-200">{"<"}</Text>
          //     </Pressable>
          //   ) : undefined,
        }}
      />

      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View className="flex p-10 gap-6">
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
          <Pressable
            onLongPress={() => console.log("Deleted", ledStrip.name)}
            delayLongPress={1000}
          >
            {({ pressed }) => {
              return (
                <View
                  className={
                    pressed
                      ? "bg-red-500 px-4 py-2 rounded-lg scale-95"
                      : "bg-red-500 px-4 py-2 rounded-lg scale-100"
                  }
                >
                  <Text className="text-white font-medium text-center">
                    Delete
                  </Text>
                </View>
              );
            }}
          </Pressable>
        </View>
      </Pressable>
    </>
  );
}
