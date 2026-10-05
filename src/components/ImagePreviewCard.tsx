import React from 'react';
import { Sparkles, Trash2, Cpu, ArrowRight } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base sm:text-lg text-stone-900">
          {t.selectedImage}
        </h3>
        <button
          onClick={onClear}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.removeReselect}</span>
        </button>
      </div>

      {/* Image Preview Box */}
      <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center group">
        <img
          src={imageSrc}
          alt="Selected plant leaf"
          className="w-full h-full object-contain"
        />

        {/* AI Preprocessing Grid Visual Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Ready for MobileNetV2 + Gemini Pathology Scan</span>
          </div>
        </div>
      </div>

      {/* Pipeline Preview Strip */}
      <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            MobileNetV2 (224×224) → Confidence Gate → Gemini Multimodal
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider hidden sm:inline">
          Verified Pipeline
        </span>
      </div>

      {/* Action CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isAnalyzing ? t.analyzingPlant : t.analyzePlant}</span>
          {!isAnalyzing && <ArrowRight className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </div>
  );
};
