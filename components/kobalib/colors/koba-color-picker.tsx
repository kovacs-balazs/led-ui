import { Colord, colord } from "colord";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, PanResponder, StyleSheet, View } from "react-native";
import { KobaSlider } from "../koba-slider";
import { KobaColorInputs } from "./koba-color-inputs";

interface InputProps {
  initialColor?: string;
  onColorChange: (color: string) => void;
  onColorChangeComplete: (color: string) => void;
}

function RealKobaColorPicker({
  initialColor = "#FFA500",
  onColorChange,
  onColorChangeComplete,
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
    onColorChange(color.toHex());
  }, [color, onColorChange]);

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
  const svRef = useRef<View>(null);

  const handleResponderSV = (evt, gs, complete = false) => {
    const { width, height } = svSizeRef.current;
    const x = Math.max(0, Math.min(width, evt.nativeEvent.locationX));
    const y = Math.max(0, Math.min(height, evt.nativeEvent.locationY));

    const s = (x / width) * 100;
    const v = (1 - y / height) * 100;
    const newHsv = {
      h: hsvRef.current.h,
      s: s,
      v: v,
      a: hsvRef.current.a,
    };

    const newColor = colord({
      h: newHsv.h,
      s: newHsv.s,
      v: newHsv.v,
      a: newHsv.a,
    });

    setHsvState(newHsv);
    setColor(newColor);

    if (complete) onColorChangeComplete?.(newColor.toHex());
  };

  const svResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => Keyboard.dismiss(),
      onPanResponderMove: handleResponderSV,
      onPanResponderRelease: (_, gs) => {
        handleResponderSV(_, gs, true);
      },
    }),
  ).current;

  // HUE PICKER- ALSÓ SZÍN SLIDER
  const hueWidthRef = useRef(0);
  const hueRef = useRef<View>(null);

  const handleResponderHue = (evt, gs, complete = false) => {
    const width = hueWidthRef.current;

    if (width === 0) return;
    const x = Math.max(0, Math.min(width, evt.nativeEvent.locationX));
    const newHue = (x / width) * 360;

    const newHsv = {
      h: newHue,
      s: hsvRef.current.s,
      v: hsvRef.current.v,
      a: hsvRef.current.a,
    };

    /* const { s, v } = colorRef.current.toHsv(); // get current S/V */
    const newColor = colord({
      h: newHsv.h,
      s: newHsv.s,
      v: newHsv.v,
      a: newHsv.a,
    });

    setHsvState(newHsv);
    setColor(newColor);

    if (complete) onColorChangeComplete?.(newColor.toHex());
  };

  const huePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => Keyboard.dismiss(),
      onPanResponderMove: handleResponderHue,
      onPanResponderRelease: (_, gs) => {
        handleResponderHue(_, gs, true);
      },
    }),
  ).current;

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
  };

  const handleInputChange = (channel: string, value: any) => {
    const { r, g, b } = color.toRgb();
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
      onColorChangeComplete?.(newColor.toHex());
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

  return (
    <View className="flex">
      {/* NAGY KOCKA PICKER */}
      <View className="items-center mb-8">
        <View
          ref={svRef}
          onLayout={handleLayoutSv}
          className="rounded-2xl overflow-hidden"
          style={{
            height: 240, // ← EZ A KULCS! Különben az onLayout sosem fut le
            width: "100%",
          }}
          {...svResponder.panHandlers}
        >
          {/* Base hue color */}
          <View
            style={{ width: "100%", height: svSizeRef.current.height || 240 }}
          >
            <LinearGradient
              colors={[`hsl(${hsv.h}, 100%, 50%)`, `hsl(${hsv.h}, 100%, 50%)`]}
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
      </View>

      {/* Hue Slider */}
      <View
        ref={hueRef}
        onLayout={handleLayoutHue}
        className="rounded-full overflow-hidden mb-6"
        style={{ height: 32 }}
        {...huePanResponder.panHandlers}
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
      {/* Alpha slider */}
      <View className="mb-3">
        <KobaSlider
          value={Math.round(hsv.a * 100)}
          onValueChange={handleAlphaChange}
        />
      </View>
      <View>
        <KobaColorInputs color={color} onSubmit={handleInputChange} />
      </View>
    </View>
  );
}

export const KobaColorPicker = memo(RealKobaColorPicker);
