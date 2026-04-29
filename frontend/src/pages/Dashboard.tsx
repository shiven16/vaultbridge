import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTransfer } from "../hooks/useTransfer";
import FileList from "../components/FileList";
import TransferPanel from "../components/TransferPanel";
import type { DriveFile } from "../api/drive.api";
import { getStorageQuota } from "../api/drive.api";

const STORAGE_UNITS = ["B", "KB", "MB", "GB", "TB"];

/** Pick the best unit index for a given byte count (same logic as human-readable) */
function getBestUnitIndex(bytes: number): number {
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < STORAGE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return unitIndex;
}

/** Convert bytes to value in target unit, truncated (NOT rounded) to 2 decimal places */
function toUnit(bytes: number, unitIndex: number): string {
  const divisor = Math.pow(1024, unitIndex);
  const value = bytes / divisor;
  // Truncate to 2 decimal places without rounding
  const truncated = Math.floor(value * 100) / 100;
  return truncated.toFixed(2);
}

interface StorageInfo {
  limitBytes: number;
  availableBytes: number;
  usedPercent: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { sourceAccount, destinationAccount, isFullyConnected } = useAuth();
  const { transfers, isTransferring, startTransfers, clearTransfers } =
    useTransfer();
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [sourceType, setSourceType] = useState<"drive" | "gcs" | "gmail">(
    "drive",
  );
  const [transferMode, setTransferMode] = useState<"copy" | "move">("copy");
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);

  // Fetch storage quota when source is drive
  useEffect(() => {
    let cancelled = false;
    setStorageLoading(true);

    const fetchQuota = async () => {
      if (sourceType !== "drive") {
        if (!cancelled) {
          setStorageInfo(null);
          setStorageLoading(false);
        }
        return;
      }
      try {
        const quota = await getStorageQuota("source");
        if (cancelled) return;
        const limitBytes = parseInt(quota.limit, 10) || 0;
        const usedBytes = parseInt(quota.usage, 10) || 0;
        const availableBytes = Math.max(limitBytes - usedBytes, 0);
        const usedPercent =
          limitBytes > 0 ? Math.round((usedBytes / limitBytes) * 100) : 0;
        setStorageInfo({ limitBytes, availableBytes, usedPercent });
      } catch {
        if (!cancelled) setStorageInfo(null);
      } finally {
        if (!cancelled) setStorageLoading(false);
      }
    };

    fetchQuota();
    return () => {
      cancelled = true;
    };
  }, [sourceType]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedFiles([]);
    clearTransfers();
  }, [clearTransfers]);

  const handleStartTransfer = useCallback(() => {
    if (!sourceAccount || !destinationAccount) return;

    const filesToTransfer = selectedFiles.map((f) => ({
      fileId: f.id,
      fileName: f.name,
      mimeType: f.mimeType,
      sourceType,
      transferMode,
    }));

    startTransfers(filesToTransfer);
  }, [
    selectedFiles,
    sourceAccount,
    destinationAccount,
    sourceType,
    transferMode,
    startTransfers,
  ]);

  // Redirect if not connected
  if (!isFullyConnected || !sourceAccount || !destinationAccount) {
    navigate("/login");
    return null;
  }

  const sourceLabel =
    sourceType === "drive"
      ? "Google Drive"
      : sourceType === "gmail"
        ? "Gmail Attachments"
        : "Cloud Storage";

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar */}
      <aside className="hidden md:flex flex-col pb-8 gap-y-2 bg-surface-container-low h-screen w-64 shrink-0 font-headline border-r border-outline-variant/10">
        <div
          className="flex flex-col justify-center h-16 px-6 mb-6 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-1.5">
            <img
              src="/logo.png"
              alt="VaultBridge Logo"
              className="h-8 w-auto object-contain drop-shadow-sm"
            />
            <span className="text-lg font-black tracking-tight text-on-surface">
              VaultBridge
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          <button
            onClick={() => setSourceType("drive")}
            className={`flex w-full items-center gap-3 py-3 px-4 rounded-lg shadow-sm font-bold transition-all duration-300 cursor-pointer ${sourceType === "drive" ? "bg-surface-container-highest text-on-surface" : "text-outline hover:bg-surface-container hover:text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined">drive_file_move</span>
            <span className="text-xs uppercase tracking-widest">
              Google Drive
            </span>
          </button>
          <button
            onClick={() => setSourceType("gmail")}
            className={`flex w-full items-center gap-3 py-3 px-4 rounded-lg shadow-sm font-bold transition-all duration-300 cursor-pointer ${sourceType === "gmail" ? "bg-surface-container-highest text-on-surface" : "text-outline hover:bg-surface-container hover:text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined">mail_lock</span>
            <span className="text-xs uppercase tracking-widest">
              Gmail Attachments
            </span>
          </button>
          <button
            onClick={() => setSourceType("gcs")}
            className={`flex w-full items-center gap-3 py-3 px-4 rounded-lg shadow-sm font-bold transition-all duration-300 cursor-pointer ${sourceType === "gcs" ? "bg-surface-container-highest text-on-surface" : "text-outline hover:bg-surface-container hover:text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined">cloud_done</span>
            <span className="text-xs uppercase tracking-widest">
              Cloud Storage
            </span>
          </button>
        </nav>

        {/* Storage capacity in sidebar bottom */}
        {storageInfo && (
          <div className="mt-auto pt-4 border-t border-outline-variant/10 px-4">
            <div className="px-2 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  cloud_queue
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-outline">
                  Storage
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${storageInfo.usedPercent > 85 ? "bg-error" : storageInfo.usedPercent > 70 ? "bg-warning" : "bg-primary"}`}
                  style={{
                    width: `${Math.min(storageInfo.usedPercent, 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-on-surface-variant font-headline">
                {(() => {
                  const unitIdx = getBestUnitIndex(storageInfo.limitBytes);
                  const unit = STORAGE_UNITS[unitIdx];
                  return (
                    <>
                      <span className="font-bold text-on-surface">
                        {toUnit(storageInfo.availableBytes, unitIdx)} {unit}
                      </span>{" "}
                      available of {toUnit(storageInfo.limitBytes, unitIdx)}{" "}
                      {unit}
                    </>
                  );
                })()}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Central Canvas */}
      <main className="flex-1 bg-surface h-screen overflow-y-auto flex flex-col">
        {/* Header (TopNavBar) */}
        <header className="flex justify-between items-center w-full px-8 h-16 bg-surface-container-lowest shrink-0 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              {sourceAccount.picture ? (
                <img
                  src={sourceAccount.picture}
                  alt="Profile"
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                  <span className="font-headline font-bold text-[8px] text-on-primary-container">
                    {sourceAccount.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs font-headline font-bold text-on-surface-variant">
                {sourceAccount.email}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-sm">
              arrow_forward
            </span>
            <div className="flex items-center gap-2">
              {destinationAccount.picture ? (
                <img
                  src={destinationAccount.picture}
                  alt="Profile"
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                  <span className="font-headline font-bold text-[8px] text-on-secondary-container">
                    {destinationAccount.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs font-headline font-bold text-on-surface-variant">
                {destinationAccount.email}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline text-on-surface tracking-tight mb-2">
              {sourceLabel}
            </h1>
            <p className="text-lg text-on-surface-variant italic font-body">
              Your primary creative source repository
            </p>

            {/* Storage badge — available storage */}
            {sourceType === "drive" && (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                {storageLoading ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-outline-variant/10 shadow-sm animate-pulse">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      cloud
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-outline font-headline">
                      Loading storage…
                    </span>
                  </div>
                ) : storageInfo ? (
                  (() => {
                    // Use the unit of the total (limit) for both values
                    const unitIdx = getBestUnitIndex(storageInfo.limitBytes);
                    const unit = STORAGE_UNITS[unitIdx];
                    const availableStr = toUnit(
                      storageInfo.availableBytes,
                      unitIdx,
                    );
                    const totalStr = toUnit(storageInfo.limitBytes, unitIdx);
                    return (
                      <>
                        {/* Single available badge */}
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm ${
                            storageInfo.usedPercent > 85
                              ? "bg-error/5 border-error/15"
                              : "bg-primary/8 border-primary/15"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              storageInfo.usedPercent > 85
                                ? "text-error"
                                : "text-primary"
                            }`}
                          >
                            {storageInfo.usedPercent > 85
                              ? "warning"
                              : "cloud_queue"}
                          </span>
                          <span
                            className={`text-xs font-bold uppercase tracking-widest font-headline ${
                              storageInfo.usedPercent > 85
                                ? "text-error"
                                : "text-primary"
                            }`}
                          >
                            {availableStr} {unit} available of {totalStr} {unit}
                          </span>
                        </div>
                      </>
                    );
                  })()
                ) : null}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 shadow-sm">
            <FileList
              type="source"
              selectedFiles={selectedFiles}
              onSelectionChange={setSelectedFiles}
              sourceType={sourceType}
            />
          </div>
        </div>
      </main>

      {/* Right Panel (TransferPanel) */}
      <aside className="hidden lg:flex flex-col w-80 bg-surface-container-lowest border-l border-outline-variant/10 shadow-2xl z-40 h-screen relative">
        <TransferPanel
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onStartTransfer={handleStartTransfer}
          isTransferring={isTransferring}
          transfers={transfers}
          transferMode={transferMode}
          onTransferModeChange={setTransferMode}
          onReset={handleReset}
        />
      </aside>
    </div>
  );
}
