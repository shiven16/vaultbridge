import { useEffect, useState } from "react";
import type { TransferItem } from "../hooks/useTransfer";

interface TransferStatusProps {
  transfers: TransferItem[];
}

export default function TransferStatus({ transfers }: TransferStatusProps) {
  const [pulseLine, setPulseLine] = useState(0);

  // Animate the subtle pulse gradient position
  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      // move gradient position based on time
      setPulseLine((progress / 30) % 200);
      animationFrameId = window.requestAnimationFrame(step);
    };
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (transfers.length === 0) return null;

  const completed = transfers.filter((t) => t.status === "success").length;
  const failed = transfers.filter((t) => t.status === "failed").length;
  const inProgress = transfers.filter((t) => t.status === "in_progress").length;
  const total = transfers.length;
  const overallProgress = ((completed + failed) / total) * 100;

  return (
    <div className="space-y-6">
      {/* Active Queue Summary */}
      <div className="bg-surface-container-lowest rounded-xl p-4 transition-all">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-outline">
            Active Queue
          </h3>
          {inProgress > 0 && (
            <span className="text-[10px] font-headline bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md font-bold">
              {inProgress} Items Processing
            </span>
          )}
        </div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-on-surface-variant font-headline">
            Overall Progress
          </span>
          <span className="text-xs text-on-surface-variant font-headline font-bold">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Transfer Items */}
      <div className="space-y-1">
        {transfers.map((transfer) => {
          const isPending = transfer.status === "pending";
          const isInProgress = transfer.status === "in_progress";
          const isSuccess = transfer.status === "success";
          const isFailed = transfer.status === "failed";

          return (
            <div
              key={transfer.fileId}
              className="group flex items-center gap-4 p-3 rounded-xl bg-surface-container-lowest border border-transparent hover:border-outline-variant/20 transition-all hover:bg-surface-container-low shadow-sm"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? "bg-success/10 text-success"
                    : isFailed
                      ? "bg-error/10 text-error"
                      : isInProgress
                        ? "bg-primary/20 text-primary"
                        : "bg-surface-container-high text-outline"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${isInProgress ? "animate-spin" : ""}`}
                >
                  {isSuccess
                    ? "check_circle"
                    : isFailed
                      ? "error"
                      : isInProgress
                        ? "sync"
                        : "pending"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="font-headline font-bold text-on-surface text-xs truncate max-w-[150px]"
                    title={transfer.fileName}
                  >
                    {transfer.fileName}
                  </span>

                  {isSuccess && (
                    <span className="text-[10px] text-success font-headline font-bold uppercase">
                      Success
                    </span>
                  )}
                  {isFailed && (
                    <span className="text-[10px] text-error font-headline font-bold uppercase">
                      Failed
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] text-outline font-headline font-bold uppercase">
                      Pending
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-[10px] text-primary font-headline font-bold uppercase">
                      In Progress
                    </span>
                  )}
                </div>

                {isInProgress && (
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-primary/20 right-0"></div>
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-primary rounded-full"
                      style={{
                        width: "30%",
                        transform: `translateX(${pulseLine}%)`,
                      }}
                    ></div>
                  </div>
                )}

                {isFailed && (
                  <p className="text-[10px] text-error font-body truncate">
                    Error during transfer execution
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
