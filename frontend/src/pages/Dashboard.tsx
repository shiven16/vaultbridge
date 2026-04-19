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
  const [transferMode, setTransferMode] = useState<"copy" | "move">("copy");

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

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar (SideNavBar) */}
      <aside className="hidden md:flex flex-col py-8 px-4 gap-y-2 bg-surface-container-low h-screen w-64 shrink-0 font-headline border-r border-outline-variant/10">
        <div
          className="flex flex-col gap-1 mb-8 px-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center">
              V
            </div>
            <span className="text-lg font-black tracking-tight text-on-surface">
              VaultBridge
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-outline mt-1">
            The Digital Atelier
          </span>
        </div>

        <nav className="flex flex-col gap-1">
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
      </aside>

      {/* Central Canvas */}
      <main className="flex-1 bg-surface h-screen overflow-y-auto flex flex-col">
        {/* Header (TopNavBar) */}
        <header className="flex justify-between items-center w-full px-8 h-16 bg-surface-container-lowest shrink-0 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-success text-sm">
                check_circle
              </span>
              <span className="text-xs font-headline font-bold text-on-surface-variant">
                {sourceAccount.email}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-sm">
              arrow_forward
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">
                check_circle
              </span>
              <span className="text-xs font-headline font-bold text-on-surface-variant">
                {destinationAccount.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant/20 overflow-hidden">
              <span className="font-headline font-bold text-sm text-on-primary-container">
                {sourceAccount.email.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="mb-10">
            <h1 className="text-4xl font-bold font-headline text-on-surface tracking-tight mb-2">
              {sourceType === "drive"
                ? "Google Drive"
                : sourceType === "gmail"
                  ? "Gmail Attachments"
                  : "Cloud Storage"}
            </h1>
            <p className="text-lg text-on-surface-variant italic font-body">
              Your primary creative source repository
            </p>
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

      {/* Right Panel (NavigationDrawer / TransferPanel) */}
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
