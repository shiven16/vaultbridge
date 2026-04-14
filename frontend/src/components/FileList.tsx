import { useState, useEffect, useCallback } from "react";
import { listFiles, createPhotosSession, type DriveFile } from "../api/drive.api";
import FileItem from "./FileItem";

interface FileListProps {
  type: "source" | "destination";
  selectedFiles: DriveFile[];
  onSelectionChange: (files: DriveFile[]) => void;
  sourceType?: "drive" | "photos" | "gcs" | "gmail";
}

export default function FileList({
  type,
  selectedFiles,
  onSelectionChange,
  sourceType = "drive",
}: FileListProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerSession, setPickerSession] = useState<{ sessionId: string; pickerUri: string } | null>(null);

  const fetchFiles = useCallback(
    async (pageToken?: string, customSessionId?: string) => {
      const isLoadingMore = !!pageToken;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const sid = customSessionId || pickerSession?.sessionId || undefined;
        // Do not fetch natively for photos unless we have a sessionId
        if (sourceType === "photos" && !sid) {
          setLoading(false);
          setLoadingMore(false);
          return;
        }
        
        const result = await listFiles(type, pageToken, 20, sourceType, sid);
        if (isLoadingMore) {
          setFiles((prev) => [...prev, ...result.files]);
        } else {
          setFiles(result.files);
        }
        setNextPageToken(result.nextPageToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [type, sourceType, pickerSession],
  );

  useEffect(() => {
    // Reset state when sourceType changes
    setFiles([]);
    setNextPageToken(undefined);
    setError(null);
    setPickerSession(null);
    
    // For photos, we don't auto-fetch. We wait for session creation.
    if (sourceType !== "photos") {
      fetchFiles();
    }
  }, [fetchFiles, sourceType]);

  const handleCreatePhotoSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await createPhotosSession();
      setPickerSession(session);
      window.open(session.pickerUri, "_blank", "width=800,height=600");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create picker session");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPickedPhotos = () => {
    if (pickerSession) {
      fetchFiles(undefined, pickerSession.sessionId);
    }
  };

  const toggleFile = useCallback(
    (file: DriveFile) => {
      const isSelected = selectedFiles.some((f) => f.id === file.id);
      if (isSelected) {
        onSelectionChange(selectedFiles.filter((f) => f.id !== file.id));
      } else {
        onSelectionChange([...selectedFiles, file]);
      }
    },
    [selectedFiles, onSelectionChange],
  );

  const selectAll = useCallback(() => {
    const transferableFiles = files.filter(
      (f) => !f.mimeType.startsWith("application/vnd.google-apps.")
    );
    onSelectionChange(transferableFiles);
  }, [files, onSelectionChange]);

  const deselectAll = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-500" />
        <p className="mt-4 text-sm text-surface-400">Loading files…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-danger"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="mt-3 text-sm text-danger">{error}</p>
        <button
          onClick={() => fetchFiles()}
          className="mt-3 cursor-pointer rounded-lg bg-surface-800 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-surface-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sourceType === "photos" && !pickerSession && files.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <span className="text-4xl mb-4">🖼️</span>
        <h3 className="text-lg font-medium text-white mb-2">Google Photos Picker</h3>
        <p className="text-sm text-surface-400 mb-6 max-w-sm">
          Google Photos requires you to explicitly select which media items VaultBridge can access.
        </p>
        <button
          onClick={handleCreatePhotoSession}
          className="cursor-pointer rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500"
        >
          Open Photos Picker
        </button>
      </div>
    );
  }

  if (sourceType === "photos" && pickerSession && files.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <span className="text-4xl mb-4">⏳</span>
        <h3 className="text-lg font-medium text-white mb-2">Waiting for Selection</h3>
        <p className="text-sm text-surface-400 mb-6 max-w-sm">
          A new window has been opened for you to pick your photos. Once you are done clicking "Done" inside the Google popup, click the button below.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.open(pickerSession.pickerUri, "_blank", "width=800,height=600")}
            className="cursor-pointer rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Re-open Window
          </button>
          <button
            onClick={handleFetchPickedPhotos}
            className="cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500"
          >
            I'm Done Picking
          </button>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl">📂</span>
        <p className="mt-3 text-sm text-surface-400">
          No files found in your {sourceType} source.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <p className="text-sm font-medium text-surface-300">
          {files.length} files{" "}
          <span className="text-surface-500">
            · {selectedFiles.length} selected
          </span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="cursor-pointer rounded-md bg-surface-800/60 px-2.5 py-1 text-xs text-surface-400 transition-colors hover:text-white"
          >
            Select All
          </button>
          <button
            onClick={deselectAll}
            className="cursor-pointer rounded-md bg-surface-800/60 px-2.5 py-1 text-xs text-surface-400 transition-colors hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            isSelected={selectedFiles.some((f) => f.id === file.id)}
            onToggle={toggleFile}
          />
        ))}

        {/* Load More */}
        {nextPageToken && (
          <button
            onClick={() => fetchFiles(nextPageToken)}
            disabled={loadingMore}
            className="mt-2 w-full cursor-pointer rounded-xl border border-white/[0.06] bg-surface-800/30 py-3 text-sm font-medium text-surface-400 transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-500" />
                Loading…
              </span>
            ) : (
              "Load More Files"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
