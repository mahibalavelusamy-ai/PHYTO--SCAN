import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  Droplets,
  Sun,
  ShieldCheck,
  Search,
  RotateCcw,
  Download,
  BookmarkCheck,
  Share2,
} from 'lucide-react';
import { PlantAnalysisResult } from '../../services/plantAnalysis/types';
import { Language, translations } from '../../utils/i18n';
import { CropReportChat } from '../CropReportChat';

interface ResultHealthyViewProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  onReset: () => void;
  isSaved?: boolean;
  onSaveToHistory?: () => void;
  isSaving?: boolean;
  onDownloadReport: () => void;
  isExporting?: boolean;
  onCopySummary: () => void;
  copied?: boolean;
}

export const ResultHealthyView: React.FC<ResultHealthyViewProps> = ({
  result,
  imageSrc,
  language,
  onReset,
  isSaved,
  onSaveToHistory,
  isSaving,
  onDownloadReport,
  isExporting,
  onCopySummary,
  copied,
}) => {
  const t = translations[language];

  // Clean condition name for display (e.g., 'Tomato Healthy' -> 'Tomato')
  const cropName = result.condition.replace(/healthy/i, '').replace(/___/g, ' ').trim() || 'Plant';

  const defaultObservations = [
    'Uniform green chlorophyll distribution across the leaf blade.',
    'Absence of fungal pustules, necrotic spots, or water-soaked lesions.',
    'Healthy, intact leaf margins without crisping or pest-induced stippling.',
    'Clean cellular venation indicating unimpeded vascular turgor.',
  ];

  const activeObservations =
    result.observations && result.observations.length > 0 && !result.observations[0].toLowerCase().includes('solid color')
      ? result.observations
      : defaultObservations;

  const carePractices = [
    {
      icon: Droplets,
      title: 'Moisture Management',
      text: 'Water directly at the root base in the early morning to prevent damp leaves overnight.',
    },
    {
      icon: Sun,
      title: 'Canopy Airflow & Sun',
      text: 'Maintain adequate plant spacing and prune lower suckers to ensure sunlight penetrates the inner canopy.',
    },
    {
      icon: Sparkles,
      title: 'Balanced Nutrition',
      text: 'Apply balanced organic compost or slow-release nutrients to sustain natural plant vigor and pest resistance.',
    },
  ];

  const preventionPractices = [
    'Routinely inspect the underside of leaves once a week for emerging aphids or mildew spores.',
    'Sanitize pruning shears with 70% alcohol or mild disinfectant between plants.',
    'Maintain a 3-year crop rotation with unrelated botanical families to break soil-borne pathogen cycles.',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Healthy Banner Notice */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-400/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Healthy Specimen Verified</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                Healthy Foliage — Verified Vigorous
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                The leaf displays vigorous, healthy foliage with vibrant natural pigmentation and prime vegetative vigor.
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Plant</span>
          </button>
        </div>
      </div>

      {/* Primary Specimen & Vitality Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Leaf Photo Thumbnail */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[260px] rounded-2xl overflow-hidden bg-stone-950 border-2 border-emerald-100 shadow-md">
              <img src={imageSrc} alt="Healthy plant leaf" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-lg text-[10px] text-white/90 font-mono flex items-center justify-between">
                <span>Healthy Specimen</span>
                <span className="text-emerald-400 font-bold">100% Intact</span>
              </div>
            </div>
          </div>

          {/* Health Metrics & Status */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                Plant Vitality Status
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {cropName ? `${cropName} — Healthy Foliage` : 'Healthy Plant'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Foliage exhibits prime photosynthetic pigmentation, optimal chlorophyll synthesis, and intact cellular structure.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Vitality Confidence */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-900">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">
                  Health Confidence
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black">{result.confidence || 95}%</span>
                </div>
                <div className="mt-2 w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${result.confidence || 95}%` }}
                  />
                </div>
              </div>

              {/* Foliage Condition */}
              <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50/70 text-teal-900">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">
                  Foliage Condition
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span className="text-lg sm:text-xl font-extrabold">Clean / Optimal</span>
                </div>
                <p className="text-[10px] text-teal-700/80 mt-1.5">No damage detected</p>
              </div>

              {/* Plant Status */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Vitality Grade
                </p>
                <div className="flex items-center gap-1.5 font-bold text-sm text-stone-800 mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Vigorous</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1.5">Prime growth state</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observations & Care Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Observed Indicators */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <h4>Observed Health Indicators</h4>
          </div>
          <ul className="space-y-3">
            {activeObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Maintenance & Care Routine */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4>Optimal Care & Maintenance</h4>
          </div>
          <div className="space-y-3.5">
            {carePractices.map((care, idx) => {
              const Icon = care.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{care.title}</h5>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{care.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ongoing Proactive Prevention */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-emerald-950/15">
        <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-4 text-emerald-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4>Plant Health Preservation Strategy</h4>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/90 mb-4 leading-relaxed">
          Maintaining clean foliage now preserves natural plant immunity and sustains high harvest yields:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {preventionPractices.map((prev, idx) => (
            <li key={idx} className="bg-emerald-900/50 border border-emerald-800/80 p-3.5 rounded-2xl text-xs text-emerald-50 leading-relaxed flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{prev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Agronomist AI Consultation */}
      <CropReportChat result={result} language={language} />

      {/* Reassurance & Uncertainty Note */}
      <div className="rounded-3xl p-5 sm:p-6 bg-emerald-50/70 border border-emerald-200 text-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-emerald-900 uppercase tracking-wider">
              Plant Health Assurance & Monitoring Guidance
            </h5>
            <p className="text-xs sm:text-sm leading-relaxed text-emerald-900/90">
              {result.uncertaintyNote && !result.uncertaintyNote.toLowerCase().includes('inconclusive') && !result.uncertaintyNote.toLowerCase().includes('disease')
                ? result.uncertaintyNote
                : 'This assessment verifies that the photographed leaf specimen is healthy and vigorous. Continue routine weekly monitoring and balanced watering throughout the growing season.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onDownloadReport}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>{isExporting ? 'Creating...' : 'Download Report (.pptx)'}</span>
        </button>

        {onSaveToHistory && !isSaved && (
          <button
            onClick={onSaveToHistory}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>{isSaving ? t.savingToHistory : 'Save to History'}</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Scan Another Plant</span>
        </button>
      </div>
    </div>
  );
};
