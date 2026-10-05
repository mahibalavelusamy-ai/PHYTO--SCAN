import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, ChevronDown, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { SAMPLE_PLANTS, SamplePlant } from '../utils/sampleLeaves';

interface HeroSectionProps {
  language: Language;
  onTakePhoto: () => void;
  onSelectImageFile: (file: File) => void;
  onSelectSample: (sample: SamplePlant) => void;
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

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-stone-50/40 to-white border-b border-stone-200">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Eyebrow: AI-POWERED PLANT HEALTH */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs font-extrabold tracking-widest uppercase mb-5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI-POWERED PLANT HEALTH</span>
        </div>

        {/* Primary Title: Scan. Diagnose. Act early. */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-tight mb-4">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroSubtitle}
        </p>

        {/* Action Buttons: [ 📷 Scan Your Plant ] [ Upload Photo ] [ Learn More ] */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onTakePhoto}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
          >
            <Camera className="w-5 h-5 text-emerald-100" />
            <span>{t.scanYourPlant}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-semibold border border-stone-300 hover:border-emerald-500 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all text-sm sm:text-base cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>{t.uploadPhoto}</span>
          </button>

          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-transparent hover:bg-emerald-50/60 text-stone-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>{t.learnMore}</span>
            <ChevronDown className="w-4 h-4 text-stone-500" />
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

        {/* Visual Plant Showcase Container */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative rounded-3xl bg-stone-900 border-4 border-white shadow-2xl overflow-hidden aspect-16/10 group">
            <img
              src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=80"
              alt="Plant health inspection in field"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Scanning HUD Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40 pointer-events-none" />

            {/* Target Reticle corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-sm pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plant Specimen • Ready for Scan</span>
            </div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-sans font-bold">MobileNetV3-Large Classifier</span>
              </div>
              <span className="text-[11px] text-stone-300 bg-white/10 px-2 py-0.5 rounded">
                Tomato, Corn, Citrus, Pepper + 14 Crops
              </span>
            </div>
          </div>
        </div>

        {/* Verified Sample Plants Bar */}
        <div className="max-w-2xl mx-auto pt-6 border-t border-stone-200/80">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            {t.trySamples}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_PLANTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group flex flex-col items-center p-2.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition-all text-left cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 group-hover:scale-105 transition-transform bg-stone-900 mb-2">
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
