import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTransfer } from "../hooks/useTransfer";
import FileList from "../components/FileList";
import TransferPanel from "../components/TransferPanel";
import type { DriveFile } from "../api/drive.api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { sourceAccount, destinationAccount, isFullyConnected } = useAuth();
  const { transfers, isTransferring, startTransfers, clearTransfers } =
    useTransfer();
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [sourceType, setSourceType] = useState<"drive" | "gcs" | "gmail">(
    "drive",
  );

  const handleRemoveFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleStartTransfer = useCallback(() => {
    if (!sourceAccount || !destinationAccount) return;

    const filesToTransfer = selectedFiles.map((f) => ({
      fileId: f.id,
      fileName: f.name,
      mimeType: f.mimeType,
      sourceType,
    }));

    startTransfers(filesToTransfer);
  }, [
    selectedFiles,
    sourceAccount,
    destinationAccount,
    sourceType,
    startTransfers,
  ]);

  // Redirect if not connected (must be after all hooks)
  if (!isFullyConnected || !sourceAccount || !destinationAccount) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col pt-16">
      {/* Account Bar */}
      <div className="border-b border-white/[0.06] bg-surface-900/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-6">
            {/* Source */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-success"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <path d="M21 3l-7 7" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                  Source
                </p>
                <p className="text-xs font-medium text-surface-200">
                  {sourceAccount.email}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-surface-600"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>

            {/* Destination */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-primary-400"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                  Destination
                </p>
                <p className="text-xs font-medium text-surface-200">
                  {destinationAccount.email}
                </p>
              </div>
            </div>
          </div>

          {transfers.length > 0 && !isTransferring && (
            <button
              onClick={() => {
                clearTransfers();
                setSelectedFiles([]);
              }}
              className="cursor-pointer rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-surface-400 transition-colors hover:text-white"
            >
              New Transfer
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 lg:flex-row">
        {/* Left Panel - File List */}
        <div className="flex-1 border-r-0 border-white/[0.06] lg:border-r">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <h2 className="text-sm font-semibold text-white">Source Files</h2>
            <select
              value={sourceType}
              onChange={(e) =>
                setSourceType(e.target.value as "drive" | "gcs" | "gmail")
              }
              className="rounded bg-surface-800 px-2 py-1 text-xs text-white border border-white/10 outline-none"
            >
              <option value="drive">Google Drive</option>
              <option value="gmail">Gmail Attachments</option>
              <option value="gcs">Google Cloud Storage</option>
            </select>
          </div>
          <FileList
            type="source"
            selectedFiles={selectedFiles}
            onSelectionChange={setSelectedFiles}
            sourceType={sourceType}
          />
        </div>

        {/* Right Panel - Transfer */}
        <div className="w-full border-t border-white/[0.06] lg:w-96 lg:border-t-0">
          <TransferPanel
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onStartTransfer={handleStartTransfer}
            isTransferring={isTransferring}
            transfers={transfers}
          />
        </div>
      </div>
    </div>
  );
}
