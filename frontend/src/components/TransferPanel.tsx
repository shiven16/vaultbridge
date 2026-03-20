import type { DriveFile } from "../api/drive.api";
import type { TransferItem } from "../hooks/useTransfer";
import TransferStatus from "./TransferStatus";

interface TransferPanelProps {
  selectedFiles: DriveFile[];
  onRemoveFile: (fileId: string) => void;
  onStartTransfer: () => void;
  isTransferring: boolean;
  transfers: TransferItem[];
}

export default function TransferPanel({
  selectedFiles,
  onRemoveFile,
  onStartTransfer,
  isTransferring,
  transfers,
}: TransferPanelProps) {
  const hasTransfers = transfers.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-5 py-3">
        <h2 className="text-sm font-semibold text-white">Transfer Queue</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {hasTransfers ? (
          <TransferStatus transfers={transfers} />
        ) : selectedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800/50">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-surface-500"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-surface-400">
              Select files from the source drive
            </p>
            <p className="mt-1 text-xs text-surface-600">
              They'll appear here for transfer
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-surface-800/30 p-3 transition-colors hover:bg-surface-800/50"
              >
                <p className="min-w-0 flex-1 truncate text-sm text-surface-200">
                  {file.name}
                </p>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="ml-2 shrink-0 cursor-pointer rounded-md border-none bg-transparent p-1 text-surface-600 opacity-0 transition-all group-hover:opacity-100 hover:text-danger"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Button */}
      {selectedFiles.length > 0 && !hasTransfers && (
        <div className="border-t border-white/[0.06] p-4">
          <button
            onClick={onStartTransfer}
            disabled={isTransferring}
            className="w-full cursor-pointer rounded-xl border-none bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isTransferring ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Transferring…
              </span>
            ) : (
              `Transfer ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
