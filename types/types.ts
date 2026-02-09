export interface WiFiSettings {
  name: string;
  password: string;
}

export interface Settings {
  wifi: WiFiSettings;
  bluetoothName: string;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type GradientStop = {
  id: number;
  position: number; // 0–100
  color: string; // hex color like "#FF0000"
};

export type Gradient = GradientStop[];

export interface TypeLedStrip {
  id: number;
  name: string;
  pin: number;
  ledCount: number;
  power: boolean;
  animation: number;
  animations: BaseAnimation[];
}

export interface AnimationConfig {
  id: number;
  name: string;
  route: string;
}

export type BaseAnimation = {
  id: number;
};

export interface SolidAnimation extends BaseAnimation {
  colors: Gradient;
}

export interface WaveAnimation extends BaseAnimation {
  length: number;
  speed: number;
  distance?: boolean;
  colors: Gradient | WaveColors;
}

export interface WaveColors {
  foreground: Gradient;
  background: Gradient;
}
