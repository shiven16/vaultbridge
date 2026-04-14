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
  type: "source" | "destination" = "source",
  pageToken?: string,
  pageSize = 20,
  sourceType: "drive" | "gcs" | "gmail" = "drive",
): Promise<DriveFileListResponse> {
  const url = type === "destination" ? "/drive/files" : `/sources/files`;
  const response = await apiClient.get<DriveFileListResponse>(url, {
    params: { type, pageToken, pageSize, sourceType },
  });
  return response.data;
}
