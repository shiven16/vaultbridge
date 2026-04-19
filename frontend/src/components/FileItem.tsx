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

function getFileIcon(mimeType: string): {
  icon: string;
  bg: string;
  text: string;
} {
  if (mimeType.includes("image"))
    return { icon: "image", bg: "bg-orange-50", text: "text-orange-600" };
  if (mimeType.includes("video"))
    return { icon: "video_file", bg: "bg-indigo-50", text: "text-indigo-600" };
  if (mimeType.includes("audio"))
    return { icon: "audio_file", bg: "bg-purple-50", text: "text-purple-600" };
  if (mimeType.includes("pdf"))
    return { icon: "picture_as_pdf", bg: "bg-red-50", text: "text-red-600" };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return {
      icon: "table_chart",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    };
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return { icon: "slideshow", bg: "bg-yellow-50", text: "text-yellow-600" };
  if (mimeType.includes("document") || mimeType.includes("word"))
    return { icon: "description", bg: "bg-blue-50", text: "text-blue-600" };
  if (
    mimeType.includes("zip") ||
    mimeType.includes("archive") ||
    mimeType.includes("compressed")
  )
    return { icon: "folder_zip", bg: "bg-slate-100", text: "text-slate-600" };
  if (mimeType.includes("text"))
    return { icon: "article", bg: "bg-slate-50", text: "text-slate-600" };
  if (mimeType.includes("folder"))
    return { icon: "folder", bg: "bg-blue-50", text: "text-blue-500" };
  if (mimeType.includes("application/vnd.google-apps"))
    return { icon: "cloud", bg: "bg-surface-container", text: "text-outline" };
  return {
    icon: "description",
    bg: "bg-surface-container-high",
    text: "text-on-surface-variant",
  };
}

export default function FileItem({
  file,
  isSelected,
  onToggle,
}: FileItemProps) {
  const isVirtual = file.mimeType.startsWith("application/vnd.google-apps.");
  const iconInfo = getFileIcon(file.mimeType);

  return (
    <div
      onClick={() => {
        if (!isVirtual) onToggle(file);
      }}
      className={`group flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all duration-300 border border-transparent 
        ${
          isSelected
            ? "border-primary/20 bg-primary/5 shadow-md cursor-pointer"
            : isVirtual
              ? "bg-surface opacity-60 cursor-not-allowed"
              : "bg-surface-container-lowest hover:shadow-md hover:border-primary/10 cursor-pointer"
        }`}
      title={
        isVirtual ? "Workspace files cannot be transferred directly" : undefined
      }
    >
      <div
        className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-lg ${iconInfo.bg} ${iconInfo.text}`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {iconInfo.icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-headline font-semibold truncate ${
            isVirtual ? "text-outline" : "text-on-surface"
          }`}
        >
          {file.name}
        </h3>
        <p className="text-sm text-outline font-body italic mt-0.5 truncate">
          {formatFileSize(file.size)}
          {isVirtual && " • Workspace File (No direct sync)"}
        </p>
      </div>

      {!isVirtual && (
        <input
          checked={isSelected}
          onChange={() => onToggle(file)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer ml-2"
          type="checkbox"
        />
      )}
    </div>
  );
}
