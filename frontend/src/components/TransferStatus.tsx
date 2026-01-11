import type { TransferItem } from '../hooks/useTransfer';

interface TransferStatusProps {
  transfers: TransferItem[];
}

function StatusBadge({ status }: { status: TransferItem['status'] }) {
  const config = {
    pending: {
      label: 'Pending',
      className: 'bg-surface-700 text-surface-300',
    },
    in_progress: {
      label: 'Transferring',
      className: 'bg-primary-500/20 text-primary-300',
    },
    success: {
      label: 'Completed',
      className: 'bg-success/20 text-success',
    },
    failed: {
      label: 'Failed',
      className: 'bg-danger/20 text-danger',
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status === 'in_progress' && (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-300/20 border-t-primary-300" />
      )}
      {status === 'success' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status === 'failed' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {label}
    </span>
  );
}

export default function TransferStatus({ transfers }: TransferStatusProps) {
  if (transfers.length === 0) return null;

  const completed = transfers.filter((t) => t.status === 'success').length;
  const failed = transfers.filter((t) => t.status === 'failed').length;
  const total = transfers.length;
  const progress = ((completed + failed) / total) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <div className="rounded-xl border border-white/[0.06] bg-surface-800/30 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-surface-200">
            Transfer Progress
          </p>
          <p className="text-xs text-surface-400">
            {completed + failed} / {total}
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {(completed > 0 || failed > 0) && (
          <div className="mt-2 flex gap-4 text-xs">
            {completed > 0 && (
              <span className="text-success">{completed} completed</span>
            )}
            {failed > 0 && (
              <span className="text-danger">{failed} failed</span>
            )}
          </div>
        )}
      </div>

      {/* Transfer Items */}
      <div className="space-y-2">
        {transfers.map((transfer) => (
          <div
            key={transfer.fileId}
            className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-surface-900/50 p-3"
          >
            <p className="min-w-0 flex-1 truncate pr-3 text-sm text-surface-200">
              {transfer.fileName}
            </p>
            <StatusBadge status={transfer.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
