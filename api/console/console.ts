import { BASE_URL } from "../api";

export async function getConsole() {
  const response = await fetch(`${BASE_URL}/api/console`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return await response.json();
}

export async function clearConsole() {
  const response = await fetch(`${BASE_URL}/api/console/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return await response.json();
}
