// Segédfüggvény az új név generálásához
import { TypeLedStrip } from "@/types/types";

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

  console.log("Existing", existing, existing.length);
  // Ha nincs ilyen név, adjuk vissza az alapnevet
  if (existing.length === 0) return baseName;

  // Keressük meg a legkövetkező számot
  const nextNumber = Math.max(...existing) + 1;
  console.log("Next number", nextNumber);
  return `${baseName} (${nextNumber})`;
};
