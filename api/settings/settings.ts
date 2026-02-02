const BACKEND_BASE_URL = "http://192.168.1.202:8000";

export async function getSettings() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/settings`);

  if (!response.ok) {
    throw new Error("Failed to fetch led strips");
  }

  return response.json();
}

export async function updateSettings(payload: unknown) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/settings/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log(JSON.stringify(payload));

  if (!response.ok) {
    throw new Error("Failed to update led strips");
  }

  return response.json();
}
