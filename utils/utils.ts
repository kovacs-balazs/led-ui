// Segédfüggvény az új név generálásához
import { GradientStop, TypeLedStrip } from "@/types/types";
import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";
import mixPlugin from "colord/plugins/mix";
import { useMemo } from "react";

extend([lchPlugin, mixPlugin, labPlugin]);

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export const generateUniqueName = (
  data: TypeLedStrip[],
  baseName: string = "New Strip",
): string => {
  const pattern = new RegExp(`^${baseName}(?: \\((\\d+)\\))?$`);

  // Szűrjük ki azokat, amelyek illeszkednek a mintára
  const existing = data
    .map((strip) => strip.name)
    .filter((name) => pattern.test(name))
    .map((name) => {
      const match = name.match(pattern);
      return match ? (match[1] ? parseInt(match[1]) : 0) : 0;
    });

  // console.log("Existing", existing, existing.length);
  // Ha nincs ilyen név, adjuk vissza az alapnevet
  if (existing.length === 0) return baseName;

  // Keressük meg a legkövetkező számot
  const nextNumber = Math.max(...existing) + 1;
  // console.log("Next number", nextNumber);
  return `${baseName} (${nextNumber})`;
};

export const useOKLCHGradient = (sortedStops: GradientStop[]) => {
  return useMemo(() => {
    if (sortedStops.length === 0) return { colors: [], locations: [] };

    // Convert stops to OKLCH space (l: 0-1, c: number, h: 0-360)
    const oklchStops = sortedStops.map((stop) => {
      const c = colord(stop.color);
      const { l, c: chroma, h } = c.toLch(); // Plugin required!
      return {
        pos: stop.position / 100, // Normalize to [0,1]
        l,
        c: chroma,
        h,
        a: c.alpha(),
      };
    });

    // Handle single-stop edge case
    if (oklchStops.length === 1) {
      const { l, c, h, a } = oklchStops[0];
      const rgba = colord({ l, c, h, a }).toHex();
      return { colors: [rgba, rgba], locations: [0, 1] };
    }

    // Generate dense stops (101 points = smooth gradient)
    const STEP_COUNT = 100;
    const locations = Array.from(
      { length: STEP_COUNT + 1 },
      (_, i) => i / STEP_COUNT,
    );
    const colors = locations.map((t) => {
      // Find bounding stops
      let leftIdx = 0;
      while (leftIdx < oklchStops.length - 1 && oklchStops[leftIdx + 1].pos < t)
        leftIdx++;

      const left = oklchStops[leftIdx];
      const right = oklchStops[leftIdx + 1];

      // Calculate interpolation ratio
      const segLength = right.pos - left.pos;
      const ratio = segLength > 0 ? (t - left.pos) / segLength : 0;

      // Interpolate lightness & chroma (linear)
      const l = left.l + ratio * (right.l - left.l);
      const c = left.c + ratio * (right.c - left.c);

      // Interpolate hue (shortest path)
      let deltaH = right.h - left.h;
      if (deltaH > 180) deltaH -= 360;
      if (deltaH < -180) deltaH += 360;
      const h = (left.h + ratio * deltaH + 360) % 360;

      // Interpolate alpha
      const a = left.a + ratio * (right.a - left.a);

      // Convert back to RGBA string (safe for LinearGradient)
      try {
        return colord({ l, c, h, a }).toHex();
      } catch {
        // Fallback on conversion error (e.g., out-of-gamut)
        return colord(left).mix(colord(right), ratio).toHex();
      }
    });

    return { colors, locations };
  }, [sortedStops]);
};

export function generateOklabGradient(stops, stepsPerSegment = 30) {
  const colors: string[] = [];
  const locations: number[] = [];

  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i];
    const end = stops[i + 1];

    const c1 = colord(start.color).toLab();
    const c2 = colord(end.color).toLab();

    const startPos = start.position / 100;
    const endPos = end.position / 100;

    for (let j = 0; j <= stepsPerSegment; j++) {
      const t = j / stepsPerSegment;

      // Linear OKLAB interpolation
      const l = c1.l + (c2.l - c1.l) * t;
      const a = c1.a + (c2.a - c1.a) * t;
      const b = c1.b + (c2.b - c1.b) * t;

      const hex = colord({ l, a, b }).toHex();
      colors.push(hex);

      const location = startPos + (endPos - startPos) * t;
      locations.push(location);
    }
  }

  return { colors, locations };
}
