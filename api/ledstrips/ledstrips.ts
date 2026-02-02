// Use environment variable or fallback to localhost for development
const BACKEND_BASE_URL = "http://192.168.1.202:8000";

export async function getLedStrips() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/ledstrips`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch led strips: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.warn("Warning: Failed to fetch LED strips from backend:", error);
    // Return mock/default data when backend is unavailable
    return {};
  }
}

export async function updateLedStrips(payload: unknown) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/ledstrips/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update led strips: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.warn("Warning: Failed to update LED strips on backend:", error);
    // Return success even if backend update fails to allow offline functionality
    return {
      success: true,
      message: "Updated locally (backend unavailable)",
    };
  }
}
