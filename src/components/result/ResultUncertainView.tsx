import React from 'react';
import {
  Camera,
  AlertTriangle,
  RotateCcw,
  Sun,
  Focus,
  Maximize2,
  FileQuestion,
  HelpCircle,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { PlantAnalysisResult } from '../../services/plantAnalysis/types';
import { Language, translations } from '../../utils/i18n';
import { CropReportChat } from '../CropReportChat';

interface ResultUncertainViewProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  onReset: () => void;
}

export const ResultUncertainView: React.FC<ResultUncertainViewProps> = ({
  result,
  imageSrc,
  language,
  onReset,
}) => {
  const t = translations[language];

  const photoTips = [
    {
      step: '01',
      icon: Sun,
      title: 'Bright Natural Daylight',
      description: 'Photograph the leaf outdoors in morning or late afternoon light. Avoid harsh midday direct flash or deep shadows.',
    },
    {
      step: '02',
      icon: Focus,
      title: 'Tap Screen to Focus',
      description: 'Tap directly on the discolored spot or leaf margin on your camera screen before capturing so the edges are razor-sharp.',
    },
    {
      step: '03',
      icon: Maximize2,
      title: 'Close-Up Framing (10–20 cm)',
      description: 'Hold the camera close enough so a single leaf occupies at least 70% of the frame rather than a distant field canopy.',
    },
    {
      step: '04',
      icon: HelpCircle,
      title: 'Isolate Against Neutral Background',
      description: 'Place your palm, a plain sheet of paper, or a clean surface behind the leaf to prevent background weeds or soil confusion.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Prominent Retake Photo Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border-2 border-amber-400 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 mt-0.5">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Diagnosis Inconclusive • Photo Retake Required</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                We Recommend Retaking the Leaf Photo
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 max-w-2xl leading-relaxed">
                Rather than providing an unreliable or guessed diagnosis, PhytoScan recommends capturing a fresh, sharper photograph. Image clarity or early symptom ambiguity prevented confident identification.
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Retake Photo Now</span>
          </button>
        </div>
      </div>

      {/* Specimen Preview & Uncertainty Metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Uploaded Thumbnail */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[240px] rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-200 shadow-md">
              <img src={imageSrc} alt="Inconclusive leaf photograph" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-amber-950/20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/75 backdrop-blur-xs rounded-lg text-[10px] text-amber-300 font-mono flex items-center justify-between">
                <span>Subject Evaluated</span>
                <span>Uncertain Reading</span>
              </div>
            </div>
          </div>

          {/* Assessment Overview */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                Diagnostic Assessment
              </p>
              <h4 className="text-2xl font-black text-stone-900">
                Inconclusive Symptom Pattern
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                {result.uncertaintyNote ||
                  'The visual features in this image do not match any disease profile above our reliability threshold. No specific chemical or pathology treatment is prescribed.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Confidence</span>
                <p className="text-xl font-black text-amber-900 mt-0.5">{result.confidence || 25}%</p>
                <p className="text-[10px] text-amber-700 mt-0.5">Below certainty threshold</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Diagnosis Status</span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">Withheld</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Avoid misdiagnosis</p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Recommended Action</span>
                <p className="text-base font-extrabold text-amber-700 mt-0.5">New Photograph</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Follow retake guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Retake Photo Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-stone-900">
              5 Steps for a Conclusive Diagnostic Photo
            </h4>
            <p className="text-xs text-stone-500">
              Following these simple photography steps ensures the AI can accurately inspect microscopic vein patterns and lesion borders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photoTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.step}
                className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-start gap-3.5 hover:bg-stone-50 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg shrink-0">
                  {tip.step}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-stone-900">
                    <Icon className="w-3.5 h-3.5 text-stone-600" />
                    <span>{tip.title}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Agronomic Stewardship Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do Not Spray Chemicals Prematurely */}
        <div className="rounded-3xl p-6 bg-rose-50/70 border border-rose-200 text-rose-950">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h5 className="font-bold text-xs sm:text-sm text-rose-900 uppercase tracking-wider">
                Do Not Spray Chemicals Prematurely
              </h5>
              <p className="text-xs text-rose-900/90 leading-relaxed">
                Applying synthetic fungicides or pesticides when the diagnosis is uncertain wastes farm resources and can burn sensitive crop foliage. Wait for a conclusive scan before investing in inputs.
              </p>
            </div>
          </div>
        </div>

        {/* Local Agronomy Support */}
        <div className="rounded-3xl p-6 bg-sky-50/70 border border-sky-200 text-sky-950">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h5 className="font-bold text-xs sm:text-sm text-sky-900 uppercase tracking-wider">
                Consult Local Agricultural Extension (KVK)
              </h5>
              <p className="text-xs text-sky-900/90 leading-relaxed">
                If leaf discoloration is rapidly spreading across multiple field rows, seal a symptomatic leaf sample in a clean plastic bag and visit your nearest Krishi Vigyan Kendra (KVK) or university extension office.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chat for Photo or Agronomic Questions */}
      <CropReportChat result={result} language={language} />

      {/* Retake CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Retake Leaf Photograph</span>
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Scan a Different Leaf</span>
        </button>
      </div>
    </div>
  );
};
