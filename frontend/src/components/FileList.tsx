import { useState, useEffect, useCallback } from "react";
import { listFiles, type DriveFile } from "../api/drive.api";
import FileItem from "./FileItem";

interface FileListProps {
  type: "source" | "destination";
  selectedFiles: DriveFile[];
  onSelectionChange: (files: DriveFile[]) => void;
  sourceType?: "drive" | "gcs" | "gmail";
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

  const fetchFiles = useCallback(
    async (pageToken?: string) => {
      const isLoadingMore = !!pageToken;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await listFiles(type, pageToken, 20, sourceType);
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
    [type, sourceType],
  );

  useEffect(() => {
    // Reset state when sourceType changes
    setFiles([]);
    setNextPageToken(undefined);
    setError(null);
    fetchFiles();
  }, [fetchFiles, sourceType]);

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
      (f) => !f.mimeType.startsWith("application/vnd.google-apps."),
    );
    onSelectionChange(transferableFiles);
  }, [files, onSelectionChange]);

  const deselectAll = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 flex-1">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
        <p className="mt-4 text-sm font-headline text-outline">Synchronizing data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 flex-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error-container">
          <span className="material-symbols-outlined text-on-error-container">error</span>
        </div>
        <p className="mt-3 font-headline text-sm text-error font-bold">{error}</p>
        <button
          onClick={() => fetchFiles()}
          className="mt-4 cursor-pointer rounded-lg bg-surface-container-highest px-6 py-2 text-sm font-bold font-headline text-on-surface transition-all hover:bg-surface-variant active:scale-95 shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
        <div className="flex h-16 w-16 mb-4 items-center justify-center rounded-xl bg-surface-container">
          <span className="material-symbols-outlined text-3xl text-outline">search_off</span>
        </div>
        <p className="font-headline font-bold text-on-surface text-lg">No assets found</p>
        <p className="mt-1 text-sm text-outline font-body italic">
          Try adjusting your source or checking your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Select Assets</span>
          <span className="font-headline text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
            {selectedFiles.length} selected
          </span>
        </div>
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <button
              onClick={deselectAll}
              className="font-headline cursor-pointer rounded-md hover:bg-surface-container px-3 py-1 text-xs font-bold text-outline transition-colors hover:text-on-surface"
            >
              Clear
            </button>
          )}
          <button
            onClick={selectAll}
            className="font-headline cursor-pointer rounded-md bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface transition-all hover:bg-surface-container-highest shadow-sm"
          >
            Select All Eligible
          </button>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-max overflow-y-auto pb-6 pr-2">
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
          <div className="xl:col-span-2 pt-2">
            <button
              onClick={() => fetchFiles(nextPageToken)}
              disabled={loadingMore}
              className="w-full cursor-pointer rounded-xl border border-outline-variant/10 bg-surface-container-lowest py-4 text-sm font-bold font-headline text-outline transition-all hover:border-primary/20 hover:text-primary hover:shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingMore ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  Load more assets
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
