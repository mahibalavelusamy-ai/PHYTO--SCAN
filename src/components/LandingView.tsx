import React, { useRef, useState } from 'react';
import { Camera, Upload, Sprout, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { SAMPLE_LEAVES, SampleLeaf } from '../utils/sampleLeaves';

interface LandingViewProps {
  language: Language;
  onTakePhoto: () => void;
  onSelectImageFile: (file: File) => void;
  onSelectSample: (sample: SampleLeaf) => void;
  onOpenArchitecture: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onTakePhoto,
  onSelectImageFile,
  onSelectSample,
  onOpenArchitecture,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onSelectImageFile(file);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      {/* Minimalist 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Headline, Prominent 'Scan Your Plant' CTA & Dropzone */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
              AGRIMIND · PHYTOSCAN
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
              Plant health diagnosis from a single leaf photo.
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Detect conditions early, verify foliage vitality, and receive field-tested care routines in seconds.
            </p>
          </div>

          {/* Prominent 'Scan Your Plant' CTA Button Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={onTakePhoto}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5 text-emerald-100" />
              <span>Scan Your Plant</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 font-bold text-sm sm:text-base border border-stone-300 hover:border-emerald-500 shadow-2xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-6 sm:p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
                : 'border-stone-300 hover:border-emerald-500 bg-stone-50/60 hover:bg-stone-50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-700 shadow-2xs mb-2.5">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-800">
              Drag and drop leaf photo here, or click to browse
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Supports JPEG, PNG, WebP · Close-up single leaf under natural daylight
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* 3-Point Workflow Strip */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-center">
              <span className="text-[10px] font-mono font-bold text-stone-400">01</span>
              <p className="text-xs font-bold text-stone-800 mt-0.5">Snap Leaf</p>
              <p className="text-[10px] text-stone-500 mt-0.5">Clear close-up</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-center">
              <span className="text-[10px] font-mono font-bold text-stone-400">02</span>
              <p className="text-xs font-bold text-stone-800 mt-0.5">Dual AI</p>
              <p className="text-[10px] text-stone-500 mt-0.5">MobileNet + Gemini</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-center">
              <span className="text-[10px] font-mono font-bold text-stone-400">03</span>
              <p className="text-xs font-bold text-stone-800 mt-0.5">Act Early</p>
              <p className="text-[10px] text-stone-500 mt-0.5">Targeted care</p>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Test Specimens & Quick Scope */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Test Specimens Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Test With Leaf Specimens
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                1-Click Test
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_LEAVES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                >
                  <img
                    src={sample.dataUrl}
                    alt={sample.nameEn}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 truncate group-hover:text-emerald-800 transition-colors">
                      {language === 'ta' ? sample.nameTa : sample.nameEn}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate mt-0.5">
                      {sample.conditionHint}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Minimalist Scope & System Stats */}
          <div className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">14 Agricultural Crops</p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Tomato, Potato, Bell Pepper, Corn, Apple, Grape, Citrus, Peach & Strawberry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-stone-200/70">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Dual-Tier AI Engine</p>
                <p className="text-xs text-stone-600 mt-0.5">
                  On-device MobileNetV2 for instant local classification paired with Gemini multimodal vision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-stone-200/70">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Multilingual & Offline Ready</p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Available in English, தமிழ், తెలుగు, ಕನ್ನಡ, and മലയാളம் with offline guidance.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenArchitecture}
              className="w-full mt-2 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <span>View System Architecture & Models</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
