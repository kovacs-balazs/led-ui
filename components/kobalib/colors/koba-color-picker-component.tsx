import { clamp } from "@/utils/utils";
import { Colord, colord } from "colord";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import KobaSlider from "../koba-slider";
import { KobaColorInputs } from "./koba-color-inputs";

interface InputProps {
  initialColor?: string;
  onColorChange?: (color: string) => void;
  onChangeComplete?: (color: string) => void;
}

function RealKobaColorPicker({
  initialColor = "#FF0000",
  onColorChange,
  onChangeComplete,
}: InputProps) {
  const initialColord = colord(initialColor);
  const initialHsv = initialColord.toHsv();
  // A hue értéket külön állapotban tároljuk, hogy ne vesszen el
  const [hsvState, setHsvState] = useState({
    h: initialHsv.h,
    s: initialHsv.s,
    v: initialHsv.v,
    a: initialHsv.a,
  });

  const [color, setColor] = useState(() => initialColord);

  useEffect(() => {
    onColorChange?.(color.toHex());
  }, [color]);

  const colorRef = useRef<Colord>(initialColord);
  const hsvRef = useRef(hsvState);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    hsvRef.current = hsvState;
  }, [hsvState]);

  const [renderKey, setRenderKey] = useState(0); // Erőltetett újrarajzolás

  // NAGY TÉGLALAP KOCKA
  /* const [svSize, setSvSize] = useState({ width: 0, height: 240 }); */
  const svSizeRef = useRef({ width: 0, height: 0 });
  const handleGestureSV = useCallback(
    (evt, complete = false) => {
      const { width, height } = svSizeRef.current;
      if (width === 0 || height === 0) return;

      // RNGH → PanResponder mapping
      const x = clamp(evt.x, 0, width);
      const y = clamp(evt.y, 0, height);

      const s = (x / width) * 100;
      const v = (1 - y / height) * 100;
      const newHsv = { ...hsvRef.current, s, v };

      const newColor = colord({
        h: newHsv.h,
        s: newHsv.s,
        v: newHsv.v,
        a: newHsv.a,
      });

      setHsvState(newHsv);
      setColor(newColor);

      if (complete) onChangeComplete?.(newColor.toHex());
    },
    [onChangeComplete],
  );

  // HUE PICKER- ALSÓ SZÍN SLIDER
  const hueWidthRef = useRef(0);
  const handleGestureHue = useCallback(
    (evt, complete = false) => {
      const width = hueWidthRef.current;
      if (width === 0) return;

      const x = clamp(evt.x, 0, width);
      const newHue = (x / width) * 360;

      const newHsv = { ...hsvRef.current, h: newHue };

      const newColor = colord({
        h: newHsv.h,
        s: newHsv.s,
        v: newHsv.v,
        a: newHsv.a,
      });

      setHsvState(newHsv);
      setColor(newColor);

      if (complete) onChangeComplete?.(newColor.toHex());
    },
    [onChangeComplete],
  );

  const svGesture = Gesture.Race(
    Gesture.Tap()
      .runOnJS(true)
      .maxDuration(500)
      .onStart((evt) => {
        Keyboard.dismiss();
        handleGestureSV(evt, true);
      }),

    Gesture.Pan()
      .minDistance(1)
      .runOnJS(true)
      .onUpdate((evt) => {
        //handleGestureSV(evt);
        handleGestureSV(evt, false);
      })
      .onEnd((evt) => {
        // onColorChangeComplete?.(colorRef.current.toHex());
        handleGestureSV(evt, true);
      }),
  );

  const hueGesture = Gesture.Race(
    Gesture.Tap()
      .runOnJS(true)
      .maxDuration(500)
      .onStart((evt) => {
        Keyboard.dismiss();
        handleGestureHue(evt, true);
      }),

    Gesture.Pan()
      .runOnJS(true)
      .minDistance(1)
      .onStart((evt) => {
        // Keyboard.dismiss();
        // handleGestureHue(evt, false);
        // runOnJS(dismissKeyboard)();
      })
      .onUpdate((evt) => {
        handleGestureHue(evt, false);
      })
      .onEnd((evt) => {
        handleGestureHue(evt, true);
      }),
  );

  const handleAlphaChange = (e) => {
    const clamped = e / 100.0;
    const newHsv = {
      h: hsvRef.current.h,
      s: hsvRef.current.s,
      v: hsvRef.current.v,
      a: clamped,
    };

    const newColor = colord({
      h: newHsv.h,
      s: newHsv.s,
      v: newHsv.v,
      a: clamped,
    });

    setHsvState(newHsv);
    setColor(newColor);
    // onColorChange?.(newColor.toHex());
    onChangeComplete?.(newColor.toHex());
  };

  const handleInputChange = (channel: string, value: any) => {
    const { r, g, b } = colorRef.current.toRgb();
    let newColor = null;
    switch (channel) {
      case "r":
        newColor = colord({
          r: value,
          g: g,
          b: b,
          a: hsvRef.current.a,
        });
        break;
      case "g":
        newColor = colord({
          r: r,
          g: value,
          b: b,
          a: hsvRef.current.a,
        });
        break;
      case "b":
        newColor = colord({
          r: r,
          g: g,
          b: value,
          a: hsvRef.current.a,
        });
        break;
      case "hex":
        newColor = colord(value).alpha(hsvRef.current.a);
        break;
    }

    if (newColor !== null) {
      setHsvState(newColor.toHsv());
      setColor(newColor);
      onChangeComplete?.(newColor.toHex());
    }
  };

  const rgb = color.toRgb();
  const hexDisplay = color.toHex().toUpperCase();

  const handleLayoutSv = (e: any) => {
    svSizeRef.current = e.nativeEvent.layout;
    setRenderKey((prev) => prev + 1);
  };

  const handleLayoutHue = (e: any) => {
    hueWidthRef.current = e.nativeEvent.layout.width;
    setRenderKey((prev) => prev + 1);
  };

  const hsv = hsvState; // color.toHsv();
  const svX = (hsv.s / 100) * svSizeRef.current.width;
  const svY = (1 - hsv.v / 100) * svSizeRef.current.height; // Inverted (top=white, bottom=black)

  const hueX = (hsv.h / 360) * hueWidthRef.current;

  // const renderCount = useRef(0);
  // renderCount.current++;

  return (
    <View className="flex">
      {/* NAGY KOCKA PICKER */}
      <View className="items-center mb-8">
        <GestureDetector gesture={svGesture}>
          <View
            onLayout={handleLayoutSv}
            className="rounded-2xl overflow-hidden"
            style={{
              height: 240, // ← EZ A KULCS! Különben az onLayout sosem fut le
              width: "100%",
            }}
          >
            {/* Base hue color */}
            <View
              style={{ width: "100%", height: svSizeRef.current.height || 240 }}
            >
              <LinearGradient
                colors={[
                  `hsl(${hsv.h}, 100%, 50%)`,
                  `hsl(${hsv.h}, 100%, 50%)`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />

              {/* White gradient (left to right) */}
              <LinearGradient
                colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Black gradient (top to bottom) */}
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          </View>
        </GestureDetector>
      </View>
      <View
        style={{
          position: "absolute",
          left: svX - 14,
          top: svY - 14,
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 3,
          borderColor: "#fff",
        }}
      />

      {/* Hue Slider */}
      <GestureDetector gesture={hueGesture}>
        <View
          onLayout={handleLayoutHue}
          className="rounded-full overflow-hidden mb-6"
          style={{ height: 32 }}
        >
          <LinearGradient
            colors={["#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f", "#f00"]}
            locations={[0, 0.17, 0.33, 0.5, 0.67, 0.83, 1]}
            start={{ x: 0, y: 0 }} // bal
            end={{ x: 1, y: 0 }} // jobb
            style={{ flex: 1 }}
          />
          {/* HUE SLIDER THUMB */}
          <View
            style={{
              position: "absolute",
              left: hueX - 4,
              top: 4,
              bottom: 4,
              width: 8,
              backgroundColor: "#fff",
              borderRadius: 4,
            }}
          />
        </View>
      </GestureDetector>
      {/* Alpha slider */}
      <View className="mb-3">
        <KobaSlider
          initialValue={Math.round(hsv.a * 100)}
          onValueChangeComplete={handleAlphaChange}
        />
      </View>
      <View>
        <KobaColorInputs color={color} onSubmit={handleInputChange} />
      </View>
    </View>
  );
}

RealKobaColorPicker.displayName = "KobaColorPicker";

const KobaColorPicker = RealKobaColorPicker;
export default memo(KobaColorPicker);
