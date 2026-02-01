const BACKEND_BASE_URL = "http://192.168.1.202:8000";

export async function getLedStrips() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/ledstrips`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return response.json();
}

export async function updateLedStrips(payload: unknown) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/ledstrips/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return response.json();
}
