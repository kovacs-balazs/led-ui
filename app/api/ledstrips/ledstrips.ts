const BACKEND_BASE_URL = "http://192.168.1.202:8000";

type ApiError = {
  error: string;
  message?: string;
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorObject: ApiError = { error: "Unknown" };

    try {
      errorObject = await response.json();
    } catch {
      errorObject = { error: "Unknown", message: "No details" };
    }

    throw new Error(
      `${response.status} ${errorObject.error ?? ""} ${errorObject.message ?? ""}`.trim(),
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`JSON Parsing Error: ${(error as Error).message}`);
  }
}
