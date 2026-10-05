import React from 'react';
import {
  ImageOff,
  RotateCcw,
  Check,
  X,
  FileImage,
  Sprout,
  UploadCloud,
} from 'lucide-react';
import { PlantAnalysisResult } from '../../services/plantAnalysis/types';
import { Language } from '../../utils/i18n';

interface ResultUnsupportedViewProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  onReset: () => void;
}

export const ResultUnsupportedView: React.FC<ResultUnsupportedViewProps> = ({
  result,
  imageSrc,
  onReset,
}) => {
  const supportedCrops = [
    { name: 'Solanaceae', crops: 'Tomato, Potato, Bell Pepper, Eggplant' },
    { name: 'Orchard Fruits', crops: 'Apple, Citrus (Lemon/Orange), Peach, Cherry' },
    { name: 'Berries & Vines', crops: 'Grape, Strawberry, Raspberry, Blueberry' },
    { name: 'Field & Cucurbits', crops: 'Corn, Soybean, Squash' },
  ];

  const doAndDonts = [
    {
      do: true,
      text: 'Capture a close-up photo of an actual botanical plant leaf showing veins.',
    },
    {
      do: true,
      text: 'Ensure the leaf fills most of the frame in clear daylight.',
    },
    {
      do: false,
      text: 'Do not upload solid color graphics, icons, digital illustrations, or screenshots.',
    },
    {
      do: false,
      text: 'Do not photograph non-botanical items (machinery, animals, household objects).',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Unsupported Hero Alert */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-100 border-2 border-stone-300 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-800 text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
              <ImageOff className="w-7 h-7 text-stone-300" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-200 text-stone-800 border border-stone-300">
                <span className="w-2 h-2 rounded-full bg-stone-600" />
                <span>Unsupported Image Subject</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                No Plant Leaf Detected in Photo
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                The uploaded photograph does not appear to contain a recognizable plant leaf or agricultural crop specimen. PhytoScan is specifically designed for analyzing leaf pathology.
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload a Leaf Photo</span>
          </button>
        </div>
      </div>

      {/* Image Preview & Observations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Uploaded Thumbnail */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[220px] rounded-2xl overflow-hidden bg-stone-900 border-2 border-stone-200 shadow-md">
              <img src={imageSrc} alt="Unsupported upload" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                <div className="p-3 rounded-full bg-black/60 backdrop-blur-xs text-stone-300">
                  <ImageOff className="w-8 h-8" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/80 rounded-lg text-[10px] text-stone-300 font-mono text-center">
                Non-Botanical / Unrecognized
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Visual Inspection Findings
              </p>
              <h4 className="text-xl font-bold text-stone-900">
                Image Quality & Subject Verification
              </h4>
            </div>

            <ul className="space-y-2.5">
              {result.observations && result.observations.length > 0 ? (
                result.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3 rounded-xl">
                  The image does not contain visible foliar veins, cuticle textures, or green cellular anatomy needed for plant health evaluation.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Supported Crops & Image Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supported Agricultural Crops */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-4 text-stone-900">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <h4>Supported Crop Families</h4>
          </div>
          <p className="text-xs text-stone-600 mb-3.5">
            PhytoScan provides high-accuracy diagnostic intelligence for 14 major agricultural crops:
          </p>
          <div className="space-y-2.5">
            {supportedCrops.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-xs font-bold text-emerald-800">{item.name}: </span>
                <span className="text-xs text-stone-700">{item.crops}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Guidelines */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-4 text-stone-900">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <h4>Photo Capture Checklist</h4>
          </div>
          <div className="space-y-3">
            {doAndDonts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50">
                {item.do ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-stone-700 leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload or Capture a Plant Leaf</span>
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Photo</span>
        </button>
      </div>
    </div>
  );
};
