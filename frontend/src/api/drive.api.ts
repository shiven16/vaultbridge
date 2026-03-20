import apiClient from "../utils/apiClient";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
}

export interface DriveFileListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

export async function listFiles(
  accessToken: string,
  pageToken?: string,
  pageSize = 20,
): Promise<DriveFileListResponse> {
  const response = await apiClient.get<DriveFileListResponse>("/drive/files", {
    params: { accessToken, pageToken, pageSize },
  });
  return response.data;
}
