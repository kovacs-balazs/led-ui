import { Pressable, View, Animated } from "react-native";
import { useRef } from "react";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type HoldBorderButtonProps = {
  onComplete: () => void;
  duration?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  className?: string;
  children: React.ReactNode;
};

export function HoldBorderButton({
  onComplete,
  duration = 1000,
  borderWidth = 3,
  borderColor = "rgb(255, 0, 0)", // red-500
  radius = 12,
  className = "",
  children,
}: HoldBorderButtonProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const layout = useRef({ width: 0, height: 0 }).current;

  const start = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onComplete();
    });
  };

  const cancel = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const perimeter = 2 * (layout.width + layout.height - 2 * borderWidth);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [perimeter, 0],
  });

  return (
    <Pressable
      onPressIn={start}
      onPressOut={cancel}
      className={`relative ${className}`}
      onLayout={(e) => {
        layout.width = e.nativeEvent.layout.width;
        layout.height = e.nativeEvent.layout.height;
      }}
    >
      {/* Border progress */}
      {layout.width > 0 && (
        <Svg width={layout.width} height={layout.height} className="absolute">
          <AnimatedRect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={layout.width - borderWidth}
            height={layout.height - borderWidth}
            rx={radius}
            ry={radius}
            stroke={borderColor}
            strokeWidth={borderWidth}
            fill="none"
            strokeDasharray={perimeter}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      )}

      {/* Content */}
      <View className="flex-1 items-center justify-center">{children}</View>
    </Pressable>
  );
}
