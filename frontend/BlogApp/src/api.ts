export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/blogapp/api";

export const getErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    return payload.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
};
