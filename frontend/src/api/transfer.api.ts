import apiClient from '../utils/apiClient';

export interface TransferRequest {
  sourceAccessToken: string;
  destinationAccessToken: string;
  fileId: string;
  fileName: string;
  mimeType?: string;
}

export interface TransferResponse {
  message: string;
  transferId: string;
}

export interface Transfer {
  id: string;
  fileId: string;
  fileName: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export async function createTransfer(
  data: TransferRequest,
): Promise<TransferResponse> {
  const response = await apiClient.post<TransferResponse>('/transfer', data);
  return response.data;
}

export async function getTransferStatus(
  transferId: string,
): Promise<Transfer> {
  const response = await apiClient.get<Transfer>(`/transfer/${transferId}`);
  return response.data;
}

export async function getUserTransfers(): Promise<{ transfers: Transfer[] }> {
  const response = await apiClient.get<{ transfers: Transfer[] }>('/transfer');
  return response.data;
}
