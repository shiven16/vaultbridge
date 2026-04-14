import type { DriveFile } from "../api/drive.api";

interface FileItemProps {
  file: DriveFile;
  isSelected: boolean;
  onToggle: (file: DriveFile) => void;
}

function formatFileSize(sizeStr: string): string {
  const bytes = parseInt(sizeStr, 10);
  if (isNaN(bytes) || bytes === 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

function getFileIcon(mimeType: string): string {
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("video")) return "🎬";
  if (mimeType.includes("audio")) return "🎵";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "📽️";
  if (mimeType.includes("document") || mimeType.includes("word")) return "📝";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("archive") ||
    mimeType.includes("compressed")
  )
    return "📦";
  if (mimeType.includes("text")) return "📄";
  return "📎";
}

export default function FileItem({
  file,
  isSelected,
  onToggle,
}: FileItemProps) {
  const isVirtual = file.mimeType.startsWith("application/vnd.google-apps.");

  return (
    <div
      onClick={() => {
        if (!isVirtual) onToggle(file);
      }}
      className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200
        ${
          isSelected
            ? "border-primary-500/40 bg-primary-500/10 shadow-lg shadow-primary-500/5 cursor-pointer"
            : isVirtual
              ? "border-white/[0.04] bg-surface-800/10 opacity-75 cursor-not-allowed"
              : "border-white/[0.06] bg-surface-800/30 hover:border-white/[0.12] hover:bg-surface-800/60 cursor-pointer"
        }`}
      title={
        isVirtual
          ? "Google Workspace files cannot be transferred directly"
          : undefined
      }
    >
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200
          ${
            isSelected
              ? "border-primary-500 bg-primary-500"
              : isVirtual
                ? "border-surface-600/50 bg-surface-700/20"
                : "border-surface-500 group-hover:border-surface-400"
          }`}
      >
        {isSelected && !isVirtual && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <span className="text-lg">{getFileIcon(file.mimeType)}</span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            isVirtual ? "text-surface-300" : "text-surface-100"
          }`}
        >
          {file.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-surface-500">
          <span>{formatFileSize(file.size)}</span>
          {isVirtual && (
            <span className="text-danger flex items-center gap-1 font-medium">
              ❌ (Workspace file — cannot transfer directly)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
