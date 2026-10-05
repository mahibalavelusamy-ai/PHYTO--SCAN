import React from 'react';

interface ModelLoadingToastProps {
  status: {
    isLoading: boolean;
    progress: number;
    message: string;
  } | null;
}

export const ModelLoadingToast: React.FC<ModelLoadingToastProps> = ({ status }) => {
  if (!status || !status.isLoading) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-3 px-4 flex items-center gap-3 text-xs max-w-sm animate-fadeIn">
      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-800 truncate">{status.message}</p>
        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>
      <span className="font-mono font-bold text-emerald-700 text-[11px] shrink-0">
        {status.progress}%
      </span>
    </div>
  );
};
