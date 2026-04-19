import type { DriveFile } from "../api/drive.api";
import type { TransferItem } from "../hooks/useTransfer";
import TransferStatus from "./TransferStatus";

interface TransferPanelProps {
  selectedFiles: DriveFile[];
  onRemoveFile: (fileId: string) => void;
  onStartTransfer: () => void;
  isTransferring: boolean;
  transfers: TransferItem[];
  transferMode: "copy" | "move";
  onTransferModeChange: (mode: "copy" | "move") => void;
  onReset?: () => void;
}

export default function TransferPanel({
  selectedFiles,
  onRemoveFile,
  onStartTransfer,
  isTransferring,
  transfers,
  transferMode,
  onTransferModeChange,
  onReset,
}: TransferPanelProps) {
  const hasTransfers = transfers.length > 0;
  const isCompleted = hasTransfers && !isTransferring;

  // Calculate total size
  const totalSize = selectedFiles.reduce(
    (acc, file) => acc + (parseInt(file.size, 10) || 0),
    0,
  );
  const formattedSize =
    totalSize > 0 ? (totalSize / (1024 * 1024)).toFixed(1) + " MB" : "—";

  return (
    <div className="flex h-full flex-col p-6 font-body">
      <div className="mb-6">
        <h2 className="font-headline font-bold text-on-surface text-xl tracking-tight">
          Transfer Panel
        </h2>
        <p className="font-body italic text-base text-on-surface-variant mt-1">
          Queue Strategy
        </p>
      </div>

      <div className="border-b border-outline-variant/20 mb-6 pb-2 flex items-center justify-between text-on-surface font-headline font-bold">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">
            sync
          </span>
          Active Queue
        </div>
        {isCompleted && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-primary text-on-primary rounded-md shadow-sm hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Transfer
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {hasTransfers ? (
          <TransferStatus transfers={transfers} />
        ) : selectedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container">
              <span className="material-symbols-outlined text-3xl text-outline">
                queue
              </span>
            </div>
            <p className="mt-4 text-sm font-headline text-on-surface">
              No assets queued
            </p>
            <p className="mt-1 text-xs font-body italic text-on-surface-variant">
              Select files from your repository
            </p>
          </div>
        ) : (
          selectedFiles.map((file) => (
            <div
              key={file.id}
              className="p-3 bg-surface-container rounded-lg group relative border border-transparent hover:border-outline-variant/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase tracking-tighter font-bold text-outline">
                  Source Asset
                </span>
                <span
                  onClick={() => onRemoveFile(file.id)}
                  className="material-symbols-outlined text-outline text-xs cursor-pointer hover:text-error transition-colors"
                >
                  close
                </span>
              </div>
              <p className="text-xs font-semibold font-headline truncate text-on-surface">
                {file.name}
              </p>
            </div>
          ))
        )}
      </div>

      {selectedFiles.length > 0 && !hasTransfers && (
        <div className="mt-auto space-y-4 pt-6 bg-surface/90 backdrop-blur-sm sticky bottom-0 border-t border-outline-variant/10">
          <div className="flex justify-between text-xs font-headline text-on-surface-variant mb-2">
            <span>Selected Files</span>
            <span className="font-bold text-on-surface">
              {selectedFiles.length} Items
            </span>
          </div>
          <div className="flex justify-between text-xs font-headline text-on-surface-variant mb-4">
            <span>Total Estimated Size</span>
            <span className="font-bold text-on-surface">{formattedSize}</span>
          </div>

          {/* Copy / Move Toggle */}
          <div className="flex rounded-lg bg-surface-container p-1 gap-1">
            <button
              onClick={() => onTransferModeChange("copy")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-headline font-bold text-xs transition-all duration-200 cursor-pointer ${
                transferMode === "copy"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-outline hover:text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                content_copy
              </span>
              Clone
            </button>
            <button
              onClick={() => onTransferModeChange("move")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-headline font-bold text-xs transition-all duration-200 cursor-pointer ${
                transferMode === "move"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-outline hover:text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                drive_file_move
              </span>
              Move
            </button>
          </div>

          {transferMode === "move" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-error/5 border border-error/15">
              <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">
                warning
              </span>
              <p className="text-[11px] font-headline text-error leading-snug">
                <strong>Move mode:</strong> Files will be permanently deleted
                from the source account after transfer.
              </p>
            </div>
          )}

          <button
            onClick={onStartTransfer}
            disabled={isTransferring}
            className="w-full py-4 cursor-pointer rounded-xl font-bold font-headline text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 hover:brightness-110 bg-primary text-on-primary"
          >
            {isTransferring ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  refresh
                </span>
                {transferMode === "move" ? "Moving..." : "Cloning..."}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  {transferMode === "move" ? "drive_file_move" : "content_copy"}
                </span>
                {transferMode === "move"
                  ? `Move ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`
                  : `Clone ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
