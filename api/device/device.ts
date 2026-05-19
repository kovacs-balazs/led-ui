import { BASE_URL } from "../api";

export async function getDeviceStatus() {
  const response = await fetch(`${BASE_URL}/api/device/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return response.json();
}

export async function reconnectDevice() {
  const response = await fetch(`${BASE_URL}/api/device/reconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return response.json();
}
