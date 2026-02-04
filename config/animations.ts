import { AnimationConfig } from "@/types/types";

// Centralized animation registry with defaults
export const IDLE_ANIMATIONS: AnimationConfig[] = [
  {
    id: 0,
    name: "Solid",
    route: "solid",
  },
  {
    id: 1,
    name: "Wave",
    route: "wave",
  },
  {
    id: 2,
    name: "Rainbow",
    route: "rainbow",
  },
];

export const AUDIO_ANIMATIONS: AnimationConfig[] = [
  {
    id: 100,
    name: "Bass",
    route: "bass",
  },
  {
    id: 101,
    name: "Volume Line",
    route: "volume_line",
  },
  {
    id: 102,
    name: "High Frequency",
    route: "high_frequency",
  },
];

export const getAnimationById = (
  animationId: number,
): AnimationConfig | undefined => {
  return (animationId < 100 ? IDLE_ANIMATIONS : AUDIO_ANIMATIONS).find(
    (el) => el.id === animationId,
  );
};

/* 
return (animationId < 100 ? IDLE_ANIMATIONS : AUDIO_ANIMATIONS).find(
    (el) => el.id === animationId,
  );
  */
