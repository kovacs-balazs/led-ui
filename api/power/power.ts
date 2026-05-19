import { BASE_URL } from "../api";

export async function getPower() {
  const response = await fetch(`${BASE_URL}/api/power`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return response.json();
}

export async function updatePower(power: boolean) {
  const response = await fetch(`${BASE_URL}/api/power`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({power: power}),
  });

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return response.json();
}
