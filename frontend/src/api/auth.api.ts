import apiClient from "../utils/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getLoginUrl(type: "source" | "destination"): Promise<string> {
  const response = await apiClient.get<{ url: string }>(`/auth/login?type=${type}`);
  return response.data.url;
}

export interface CallbackResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: string;
  };
}

export async function handleCallback(
  code: string,
  type: string,
): Promise<CallbackResponse> {
  const response = await apiClient.get<CallbackResponse>("/auth/callback", {
    params: { code, type },
  });
  return response.data;
}

export async function disconnectAccount(
  type: "source" | "destination",
): Promise<void> {
  await apiClient.post("/auth/disconnect", { type });
}
