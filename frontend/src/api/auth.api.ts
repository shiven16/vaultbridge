import apiClient from "../utils/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function getLoginUrl(type: "source" | "destination"): string {
  return `${API_BASE_URL}/api/auth/login?type=${type}`;
}

export interface CallbackResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function handleCallback(code: string): Promise<CallbackResponse> {
  const response = await apiClient.get<CallbackResponse>("/auth/callback", {
    params: { code },
  });
  return response.data;
}
