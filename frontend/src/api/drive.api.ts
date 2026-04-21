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

export interface StorageQuota {
  limit: string;
  usage: string;
  usageInDrive: string;
  usageInDriveTrash: string;
}

export async function listFiles(
  type: "source" | "destination" = "source",
  pageToken?: string,
  pageSize = 20,
  sourceType: "drive" | "gcs" | "gmail" = "drive",
  orderBy?: string,
): Promise<DriveFileListResponse> {
  const url = type === "destination" ? "/drive/files" : `/sources/files`;
  const response = await apiClient.get<DriveFileListResponse>(url, {
    params: { type, pageToken, pageSize, sourceType, orderBy },
  });
  return response.data;
}

export async function getStorageQuota(
  type: "source" | "destination" = "source",
): Promise<StorageQuota> {
  const url = type === "destination" ? "/drive/quota" : `/sources/quota`;
  const response = await apiClient.get<StorageQuota>(url, {
    params: { type },
  });
  return response.data;
}
