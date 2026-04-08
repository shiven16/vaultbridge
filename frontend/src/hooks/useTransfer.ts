import { useState, useCallback } from "react";
import {
  createTransfer,
  getTransferStatus,
  type TransferRequest,
} from "../api/transfer.api";

export interface TransferItem {
  fileId: string;
  fileName: string;
  status: "pending" | "in_progress" | "success" | "failed";
  transferId?: string;
  error?: string;
}

export function useTransfer() {
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);

  const updateTransfer = useCallback(
    (fileId: string, update: Partial<TransferItem>) => {
      setTransfers((prev) =>
        prev.map((t) => (t.fileId === fileId ? { ...t, ...update } : t)),
      );
    },
    [],
  );

  const startTransfers = useCallback(
    async (files: { fileId: string; fileName: string; mimeType: string }[]) => {
      setIsTransferring(true);

      // Initialize all transfers as pending
      const initialTransfers: TransferItem[] = files.map((f) => ({
        fileId: f.fileId,
        fileName: f.fileName,
        status: "pending" as const,
      }));
      setTransfers(initialTransfers);

      // Process transfers sequentially
      for (const file of files) {
        updateTransfer(file.fileId, { status: "in_progress" });

        try {
          const req: TransferRequest = {
            fileId: file.fileId,
            fileName: file.fileName,
            mimeType: file.mimeType,
          };

          const response = await createTransfer(req);
          updateTransfer(file.fileId, {
            status: "in_progress",
            transferId: response.transferId,
          });

          // Poll for completion
          let attempts = 0;
          const maxAttempts = 30;
          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
              const status = await getTransferStatus(response.transferId);
              if (status.status === "success" || status.status === "failed") {
                updateTransfer(file.fileId, { status: status.status });
                break;
              }
            } catch {
              // Continue polling on error
            }
            attempts++;
          }

          if (attempts >= maxAttempts) {
            updateTransfer(file.fileId, {
              status: "failed",
              error: "Transfer timed out",
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Transfer failed";
          updateTransfer(file.fileId, {
            status: "failed",
            error: errorMessage,
          });
        }
      }

      setIsTransferring(false);
    },
    [updateTransfer],
  );

  const clearTransfers = useCallback(() => {
    setTransfers([]);
  }, []);

  return { transfers, isTransferring, startTransfers, clearTransfers };
}
