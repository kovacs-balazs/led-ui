const BACKEND_BASE_URL = "http://192.168.1.202:8000";

export async function getDeviceStatus() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/device/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return response.json();
}

export async function reconnectDevice() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/device/reconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return response.json();
}
