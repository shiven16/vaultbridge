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

  // Calculate total size
  const totalSize = selectedFiles.reduce((acc, file) => acc + (parseInt(file.size, 10) || 0), 0);
  const formattedSize = totalSize > 0 
    ? (totalSize / (1024 * 1024)).toFixed(1) + " MB" 
    : "—";

  return (
    <div className="flex h-full flex-col p-6 font-body">
      <div className="mb-6">
        <h2 className="font-headline font-bold text-on-surface text-xl tracking-tight">Transfer Panel</h2>
        <p className="font-body italic text-base text-on-surface-variant mt-1">Queue Strategy</p>
      </div>

      <div className="border-b border-outline-variant/20 mb-6 pb-2 flex items-center gap-2 text-on-surface font-headline font-bold">
        <span className="material-symbols-outlined text-sm text-primary">sync</span>
        Active Queue
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {hasTransfers ? (
          <TransferStatus transfers={transfers} />
        ) : selectedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container">
              <span className="material-symbols-outlined text-3xl text-outline">queue</span>
            </div>
            <p className="mt-4 text-sm font-headline text-on-surface">No assets queued</p>
            <p className="mt-1 text-xs font-body italic text-on-surface-variant">
              Select files from your repository
            </p>
          </div>
        ) : (
          selectedFiles.map((file) => (
            <div key={file.id} className="p-3 bg-surface-container rounded-lg group relative border border-transparent hover:border-outline-variant/20 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase tracking-tighter font-bold text-outline">Source Asset</span>
                <span 
                  onClick={() => onRemoveFile(file.id)}
                  className="material-symbols-outlined text-outline text-xs cursor-pointer hover:text-error transition-colors"
                >
                  close
                </span>
              </div>
              <p className="text-xs font-semibold font-headline truncate text-on-surface">{file.name}</p>
            </div>
          ))
        )}
      </div>

      {selectedFiles.length > 0 && !hasTransfers && (
        <div className="mt-auto space-y-4 pt-6 bg-surface/90 backdrop-blur-sm sticky bottom-0 border-t border-outline-variant/10">
          <div className="flex justify-between text-xs font-headline text-on-surface-variant mb-2">
            <span>Selected Files</span>
            <span className="font-bold text-on-surface">{selectedFiles.length} Items</span>
          </div>
          <div className="flex justify-between text-xs font-headline text-on-surface-variant mb-4">
            <span>Total Estimated Size</span>
            <span className="font-bold text-on-surface">{formattedSize}</span>
          </div>
          <button
            onClick={onStartTransfer}
            disabled={isTransferring}
            className="w-full py-4 cursor-pointer bg-primary text-on-primary rounded-xl font-bold font-headline text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 hover:brightness-110"
          >
            {isTransferring ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Transferring...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Start Transfer
              </>
            )}
          </button>
          <p className="text-[10px] font-body text-center text-outline italic">
            Encrypting end-to-end via VaultBridge Protocol
          </p>
        </div>
      )}
    </div>
  );
}
