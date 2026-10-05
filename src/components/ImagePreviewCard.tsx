import React from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Sun, Focus, Eye } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface ImagePreviewCardProps {
  imageSrc: string;
  onClear: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  language: Language;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  imageSrc,
  onClear,
  onAnalyze,
  isAnalyzing,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-2xl mx-auto my-6 sm:my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
            Step 2 of 2
          </span>
          <h3 className="font-extrabold text-xl text-stone-900">
            {t.readyToScan}
          </h3>
        </div>
        <button
          onClick={onClear}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.retake}</span>
        </button>
      </div>

      {/* Image Preview Box */}
      <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center group shadow-inner">
        <img
          src={imageSrc}
          alt="Selected plant photograph"
          className="w-full h-full object-contain"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-4">
          <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs w-max">
            {t.looksClear}
          </span>
        </div>
      </div>

      {/* Quality Check Indicators */}
      <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/90">
        <p className="text-xs font-bold text-stone-700 mb-2">
          {t.looksClear}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-600">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{t.qualityGoodLighting}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{t.qualityInFocus}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{t.qualityPlantVisible}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <span>{isAnalyzing ? 'Analyzing...' : t.useThisPhoto}</span>
          {!isAnalyzing && <ArrowRight className="w-4 h-4" />}
        </button>

        <button
          onClick={onClear}
          disabled={isAnalyzing}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-semibold text-sm border border-stone-300 transition-colors cursor-pointer"
        >
          {t.retake}
        </button>
      </div>
    </div>
  );
};
