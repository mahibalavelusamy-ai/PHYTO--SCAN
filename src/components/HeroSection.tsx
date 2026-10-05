import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { SAMPLE_LEAVES, SampleLeaf } from '../utils/sampleLeaves';

interface HeroSectionProps {
  language: Language;
  onTakePhoto: () => void;
  onSelectImageFile: (file: File) => void;
  onSelectSample: (sample: SampleLeaf) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onTakePhoto,
  onSelectImageFile,
  onSelectSample,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectImageFile(e.target.files[0]);
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 bg-gradient-to-b from-emerald-50/60 via-stone-50/40 to-white border-b border-stone-200">
      {/* Decorative leaf backdrop shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>AGRIMIND AI Plant Pathology Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
          {t.heroTitle}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroSubtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5">
          {/* Take Photo Button */}
          <button
            onClick={onTakePhoto}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
          >
            <Camera className="w-5 h-5 text-emerald-100" />
            <span>{t.takePhoto}</span>
          </button>

          {/* Upload Image Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-semibold border border-stone-300 hover:border-emerald-500 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
          >
            <Upload className="w-5 h-5 text-emerald-600" />
            <span>{t.uploadImage}</span>
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Photo Quality Guidance Note */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-500 bg-white/70 backdrop-blur-xs px-4 py-2 rounded-lg border border-stone-200 mb-8">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{t.bestResultsNote}</span>
        </div>

        {/* Instant Demo Leaf Samples */}
        <div className="pt-4 border-t border-stone-200/60 max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            {t.trySampleLeaves}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_LEAVES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group flex flex-col items-center p-2.5 rounded-xl bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition-all text-left cursor-pointer"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-stone-200 group-hover:scale-105 transition-transform bg-stone-900 mb-2">
                  <img
                    src={sample.dataUrl}
                    alt={language === 'ta' ? sample.nameTa : sample.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 line-clamp-1 text-center">
                  {language === 'ta' ? sample.nameTa : sample.nameEn}
                </span>
                <span className="text-[10px] text-stone-500 line-clamp-1 text-center">
                  {sample.conditionHint}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
