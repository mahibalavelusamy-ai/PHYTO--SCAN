import React, { useState, useMemo } from 'react';
import {
  PlantAnalysisResult,
} from '../services/plantAnalysis/types';
import { Language, translations } from '../utils/i18n';
import { findKnowledgeMatches } from '../utils/kbSearch';
import { exportPlantReportToPPTX } from '../utils/reportExport';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers,
  ShieldCheck,
  RotateCcw,
  BookmarkCheck,
  Share2,
  Printer,
  ChevronRight,
  Eye,
  Crosshair,
  Sparkles,
  BookOpen,
  Download,
} from 'lucide-react';

interface ResultViewProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  onReset: () => void;
  isSaved: boolean;
  onSaveToHistory?: () => void;
  isSaving?: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  imageSrc,
  language,
  onReset,
  isSaved,
  onSaveToHistory,
  isSaving,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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

  const handleCopySummary = () => {
    const text = `PhytoScan Assessment:
Condition: ${result.condition}
Confidence: ${result.confidence}%
Severity: ${result.severity}
Observations: ${result.observations.join(', ')}
Actions: ${result.recommendedActions.join('; ')}
Prevention: ${result.prevention.join('; ')}
Note: ${result.uncertaintyNote}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await exportPlantReportToPPTX({
        result,
        imageSrc,
        language,
        kbMatch,
      });
    } catch (err: any) {
      console.error('Failed to export PowerPoint report:', err);
      setExportError(
        'Unable to generate PowerPoint report. Please verify browser permissions and try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const kbMatch = useMemo(() => {
    if (!result || !result.condition) return null;

    let crop = '';
    let cond = result.condition;

    if (result.classifierMetadata?.candidateClass?.includes('___')) {
      const parts = result.classifierMetadata.candidateClass.split('___');
      crop = parts[0].replace(/_/g, ' ');
      if (parts[1]) {
        cond = parts[1].replace(/_/g, ' ');
      }
    } else {
      const words = result.condition.trim().split(/\s+/);
      if (words.length > 1) {
        crop = words[0];
        cond = words.slice(1).join(' ');
      } else {
        crop = result.condition;
        cond = result.condition;
      }
    }

    const matches = findKnowledgeMatches(crop, undefined, cond);
    const top = matches[0];
    if (top && top.score >= 45) {
      return top.entry;
    }
    return null;
  }, [result]);

  const formatLossRangePercent = (lossRange: any): string | null => {
    if (lossRange === undefined || lossRange === null || lossRange === '') return null;
    if (typeof lossRange === 'string') {
      return lossRange.includes('%') ? lossRange : `${lossRange}%`;
    }
    if (typeof lossRange === 'number') {
      return `${lossRange}%`;
    }
    if (Array.isArray(lossRange)) {
      if (lossRange.length === 2) {
        return `${lossRange[0]}% - ${lossRange[1]}%`;
      }
      return `${lossRange.join('-')}%`;
    }
    if (typeof lossRange === 'object' && ('min' in lossRange || 'max' in lossRange)) {
      return `${lossRange.min ?? 0}% - ${lossRange.max ?? 100}%`;
    }
    return `${String(lossRange)}%`;
  };

  const renderTreatmentContent = (treatment: any) => {
    if (!treatment) return <p className="text-xs text-stone-500 italic">None specified</p>;
    if (Array.isArray(treatment)) {
      return (
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-stone-700">
          {treatment.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof treatment === 'object') {
      return (
        <div className="space-y-1.5 text-xs sm:text-sm text-stone-700">
          {treatment.organic && (
            <div>
              <span className="font-bold text-emerald-800">Organic: </span>
              <span>{Array.isArray(treatment.organic) ? treatment.organic.join(', ') : String(treatment.organic)}</span>
            </div>
          )}
          {treatment.chemical && (
            <div>
              <span className="font-bold text-amber-800">Chemical: </span>
              <span>{Array.isArray(treatment.chemical) ? treatment.chemical.join(', ') : String(treatment.chemical)}</span>
            </div>
          )}
          {treatment.preventive && (
            <div>
              <span className="font-bold text-stone-800">Preventive: </span>
              <span>{Array.isArray(treatment.preventive) ? treatment.preventive.join(', ') : String(treatment.preventive)}</span>
            </div>
          )}
        </div>
      );
    }
    return <p className="text-xs sm:text-sm text-stone-700">{String(treatment)}</p>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              AGRIMIND AI Report
            </span>
            {isSaved && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{t.savedToHistory}</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            {t.resultsTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Download PowerPoint Presentation (.pptx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isExporting ? 'Creating...' : 'Download report'}</span>
          </button>
          <button
            onClick={handleCopySummary}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copied ? 'Copied!' : 'Share / Copy'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.scanAnotherPlant}</span>
          </button>
        </div>
      </div>

      {/* Export Error Alert if any */}
      {exportError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{exportError}</span>
          </div>
          <button
            onClick={() => setExportError(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Offline Guidance Banner */}
      {result.isOfflineGuidance && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 text-amber-900 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-extrabold tracking-wide">
              {result.offlineBannerText ||
                (result.classifierMetadata?.isCustomPlantModelLoaded
                  ? 'Offline result from the on-device model. Lower accuracy for field photos.'
                  : 'Offline guidance, lower accuracy.')}
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Cloud AI service is unavailable. Guidance generated strictly on-device without external server connection.
            </p>
          </div>
        </div>
      )}

      {/* Outside Crop Coverage Notice */}
      {result.isCropOutsideCoverage && (
        <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs sm:text-sm text-sky-900">
                On-Device Model Scope Notice
              </p>
              <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                The on-device model does not cover this crop. It is specialized for 14 crops (Apple, Blueberry, Cherry, Corn, Grape, Citrus, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato). Diagnosis was performed using the reference knowledge base and Gemini multimodal analysis only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Diagnostic Summary Card */}
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

      {/* On-Device Model Top 3 Predictions Card (Honesty & Scope Disclosure) */}
      {result.classifierMetadata?.isCustomPlantModelLoaded &&
        result.classifierMetadata.top3Predictions &&
        result.classifierMetadata.top3Predictions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 mb-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-stone-900">
                  On-Device Model Predictions (Top 3)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
                Custom MobileNetV2
              </span>
            </div>

            {/* Top 3 Predictions list */}
            <div className="space-y-3 mb-4">
              {result.classifierMetadata.top3Predictions.map((pred, idx) => (
                <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-800 mb-1.5">
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{pred.className}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700">{pred.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, pred.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Honesty note on 14 crops & outdoor accuracy */}
            <div className="text-xs text-stone-600 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-900">Model Scope & Outdoor Accuracy: </span>
              This on-device model is trained on 14 crops (Apple, Blueberry, Cherry, Corn, Grape, Citrus, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato) and may be less accurate on photos taken outdoors under variable sunlight, wind, or natural soil backgrounds.
            </div>
          </div>
        )}

      {/* Known disease reference card (Reference data) */}
      {kbMatch && (
        <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm mb-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-bold text-stone-900">
                Known disease reference
              </h4>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              Reference data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Disease
              </p>
              <p className="text-base font-bold text-stone-900">
                {kbMatch.disease}
              </p>
              {kbMatch.plant && (
                <p className="text-xs text-stone-500 mt-0.5">Crop: {kbMatch.plant}</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Pathogen
              </p>
              <p className="text-base font-bold text-stone-900">
                {kbMatch.pathogen || kbMatch.scientificName || 'Not specified'}
              </p>
            </div>

            {formatLossRangePercent(kbMatch.lossRange) && (
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs sm:col-span-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Typical Loss Range
                </p>
                <p className="text-lg font-extrabold text-amber-700">
                  {formatLossRangePercent(kbMatch.lossRange)}
                </p>
              </div>
            )}
          </div>

          {(kbMatch.treatment || kbMatch.treatments) && (
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Treatment
              </p>
              {renderTreatmentContent(kbMatch.treatment || kbMatch.treatments)}
            </div>
          )}
        </div>
      )}

      {/* Detailed Analysis Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* What AI Observed */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <h4>{t.whatWeObserved}</h4>
            </div>
            <ul className="space-y-3">
              {result.observations && result.observations.length > 0 ? (
                result.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-stone-500 italic">
                  No specific visible lesion patterns detected.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Possible Causes */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4>{t.possibleCauses}</h4>
            </div>
            <ul className="space-y-3">
              {result.possibleCauses && result.possibleCauses.length > 0 ? (
                result.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-stone-500 italic">
                  Environmental conditions or natural leaf senescence.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/40 rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base sm:text-lg mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h4>{t.whatYouCanDo}</h4>
            </div>
            <ol className="space-y-3">
              {result.recommendedActions && result.recommendedActions.length > 0 ? (
                result.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-stone-500 italic">
                  Continue regular watering and balanced fertilization.
                </li>
              )}
            </ol>
          </div>
        </div>

        {/* Prevention */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4>{t.prevention}</h4>
            </div>
            <ul className="space-y-3">
              {result.prevention && result.prevention.length > 0 ? (
                result.prevention.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span>{prev}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-stone-500 italic">
                  Follow good crop rotation and avoid overhead sprinkling.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Uncertainty & Safety Note Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-amber-50/70 border border-amber-200 text-amber-950 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-amber-900 uppercase tracking-wider">
              {t.safetyNoteTitle}
            </h5>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
              {result.uncertaintyNote}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleDownloadReport}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>{isExporting ? 'Creating PowerPoint...' : 'Download report (.pptx)'}</span>
        </button>

        {onSaveToHistory && !isSaved && (
          <button
            onClick={onSaveToHistory}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>{isSaving ? t.savingToHistory : t.savedToHistory}</span>
          </button>
        )}
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.scanAnotherPlant}</span>
        </button>
      </div>
    </div>
  );
};
