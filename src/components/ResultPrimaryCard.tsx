import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { Language, translations } from '../utils/i18n.ts';

interface ResultPrimaryCardProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
}

export const ResultPrimaryCard: React.FC<ResultPrimaryCardProps> = ({
  result,
  imageSrc,
  language,
}) => {
  const t = translations[language];

  const getSeverityBadge = (severity: string) => {
    const s = severity?.toLowerCase() || '';
    if (
      s.includes('severe') ||
      s.includes('தீவிர') ||
      s.includes('తీవ్ర') ||
      s.includes('ತೀವ್ರ') ||
      s.includes('ഗുരുതര')
    ) {
      return {
        bg: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
        label: t.severitySevere,
      };
    }
    if (
      s.includes('mod') ||
      s.includes('மித') ||
      s.includes('మధ్య') ||
      s.includes('ಮಧ್ಯಮ') ||
      s.includes('മിത')
    ) {
      return {
        bg: 'bg-amber-100 text-amber-900 border-amber-200',
        dot: 'bg-amber-500',
        label: t.severityModerate,
      };
    }
    if (
      s.includes('mild') ||
      s.includes('low') ||
      s.includes('குறை') ||
      s.includes('స్వల్ప') ||
      s.includes('ಕಡಿಮೆ') ||
      s.includes('ನೇരിയ')
    ) {
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        label: t.severityMild,
      };
    }
    if (
      s.includes('none') ||
      s.includes('health') ||
      s.includes('ஆரோக்கிய') ||
      s.includes('ఆరోగ్య') ||
      s.includes('ಆರೋಗ್ಯ') ||
      s.includes('ആരോഗ്യ')
    ) {
      return {
        bg: 'bg-teal-100 text-teal-800 border-teal-200',
        dot: 'bg-teal-600',
        label: t.severityNone,
      };
    }
    return {
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      dot: 'bg-stone-500',
      label: result.severity || t.severityUnknown,
    };
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (conf >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const sevBadge = getSeverityBadge(result.severity);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Leaf Photo Thumbnail */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-[260px] rounded-2xl overflow-hidden bg-stone-900 border-2 border-stone-100 shadow-md group">
            <img
              src={imageSrc}
              alt="Analyzed leaf"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-lg text-[10px] text-white/90 font-mono flex items-center justify-between">
              <span>Verified Specimen</span>
              <span className="text-emerald-400">Scanned</span>
            </div>
          </div>
          {/* Display candidate class only if custom plant model is loaded; never show ImageNet class */}
          {result.classifierMetadata?.isCustomPlantModelLoaded && result.classifierMetadata.candidateClass && (
            <div className="mt-2.5 text-center">
              <p className="text-[11px] text-stone-600 font-mono font-medium">
                Plant Model: {result.classifierMetadata.candidateClass}
              </p>
              {result.classifierMetadata.featureVectorLength && (
                <p className="text-[10px] text-stone-400 font-mono">
                  Tensor: {result.classifierMetadata.featureVectorLength} features ({result.classifierMetadata.inferenceTimeMs}ms)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Condition, Confidence & Severity */}
        <div className="md:col-span-8 space-y-5">
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              {t.possibleCondition}
            </p>
            <h3 className={`text-2xl sm:text-3xl font-extrabold leading-snug ${result.condition === 'Not sure' ? 'text-amber-700' : 'text-stone-900'}`}>
              {result.condition}
            </h3>
            {result.condition === 'Not sure' && (
              <p className="text-xs text-amber-800 font-medium mt-1">
                On-device model confidence was below certainty threshold for reliable identification.
              </p>
            )}
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Confidence metric */}
            <div className={`p-4 rounded-2xl border ${getConfidenceColor(result.confidence)}`}>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">
                {t.confidence}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black">
                  {result.confidence}%
                </span>
              </div>
              <div className="mt-2 w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-current h-full rounded-full"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Severity metric */}
            <div className={`p-4 rounded-2xl border ${sevBadge.bg}`}>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">
                {t.severity}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${sevBadge.dot}`} />
                <span className="text-lg sm:text-xl font-extrabold">
                  {sevBadge.label}
                </span>
              </div>
              <p className="text-[10px] opacity-75 mt-1.5">
                Pathology Stage
              </p>
            </div>

            {/* AI Verification Gate */}
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Diagnostics
              </p>
              <div className="flex items-center gap-1.5 text-stone-800 font-bold text-sm mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Multimodal AI</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1.5">
                Gemini + MobileNetV2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
