import React, { useState, useMemo } from 'react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types';
import { Language, translations } from '../utils/i18n';
import { findKnowledgeMatches } from '../utils/kbSearch';
import { exportPlantReportToPPTX } from '../utils/reportExport';
import {
  AlertTriangle,
  RotateCcw,
  BookmarkCheck,
  Share2,
  Printer,
  Download,
} from 'lucide-react';

import { ResultPrimaryCard } from './ResultPrimaryCard';
import { ResultKnowledgeCard } from './ResultKnowledgeCard';
import { ResultHonestyCard } from './ResultHonestyCard';
import { ResultActionCards } from './ResultActionCards';
import { CropReportChat } from './CropReportChat';

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
  const [isKbExpanded, setIsKbExpanded] = useState(false);

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AGRIMIND Leaf Intelligence</span>
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

      {/* Honesty & Coverage Alerts */}
      <ResultHonestyCard result={result} />

      {/* Primary Diagnostic Summary Card */}
      <ResultPrimaryCard result={result} imageSrc={imageSrc} language={language} />

      {/* Known disease reference card (Reference data) */}
      {kbMatch && (
        <ResultKnowledgeCard
          kbMatch={kbMatch}
          isExpanded={isKbExpanded}
          onToggle={() => setIsKbExpanded((prev) => !prev)}
        />
      )}

      {/* Detailed Analysis Breakdown & Action Cards */}
      <ResultActionCards result={result} language={language} />

      {/* Interactive Agronomist AI Chatbot & Audio Voice Consultation */}
      <CropReportChat result={result} language={language} />

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
