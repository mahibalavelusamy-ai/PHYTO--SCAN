import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
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
    <section className="pt-10 pb-14 sm:pt-14 sm:pb-18 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Kicker & Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2.5">
            AGRIMIND · Leaf Health Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
            Fast, reliable plant health diagnosis.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Photograph a leaf to detect conditions, check foliage vitality, and receive actionable care routines in seconds.
          </p>
        </div>

        {/* Crisp Upload & Camera Card */}
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          {/* Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 sm:p-10 text-center flex flex-col items-center justify-center ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
                : 'border-stone-300 hover:border-emerald-500 bg-white hover:bg-stone-50/50'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs mb-4">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
              Drag & drop a leaf photo here, or click to browse
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-5">
              Supports JPEG, PNG, and WebP · Best with a clear, well-lit photo of a single leaf
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onTakePhoto}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-300 shadow-2xs transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-stone-600" />
                <span>Upload File</span>
              </button>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Quick-Test Specimen Leaves */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Or test with verified specimens:
              </span>
              <span className="text-[11px] text-stone-500 font-medium">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_LEAVES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-300 text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <img
                    src={sample.dataUrl}
                    alt={sample.nameEn}
                    className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 truncate group-hover:text-emerald-800 transition-colors">
                      {language === 'ta' ? sample.nameTa : sample.nameEn}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      {sample.conditionHint}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
