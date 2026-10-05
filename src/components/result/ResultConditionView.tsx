import React from 'react';
import {
  RotateCcw,
  Download,
  BookmarkCheck,
  AlertTriangle,
} from 'lucide-react';
import { PlantAnalysisResult } from '../../services/plantAnalysis/types';
import { Language, translations } from '../../utils/i18n';
import { ResultPrimaryCard } from '../ResultPrimaryCard';
import { ResultKnowledgeCard } from '../ResultKnowledgeCard';
import { ResultHonestyCard } from '../ResultHonestyCard';
import { ResultActionCards } from '../ResultActionCards';
import { CropReportChat } from '../CropReportChat';

interface ResultConditionViewProps {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  onReset: () => void;
  isSaved?: boolean;
  onSaveToHistory?: () => void;
  isSaving?: boolean;
  onDownloadReport: () => void;
  isExporting?: boolean;
  kbMatch: any;
  isKbExpanded: boolean;
  setIsKbExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ResultConditionView: React.FC<ResultConditionViewProps> = ({
  result,
  imageSrc,
  language,
  onReset,
  isSaved,
  onSaveToHistory,
  isSaving,
  onDownloadReport,
  isExporting,
  kbMatch,
  isKbExpanded,
  setIsKbExpanded,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Offline Guidance Banner if any */}
      {result.isOfflineGuidance && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 text-amber-900 shadow-sm">
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
      <div className="rounded-3xl p-5 sm:p-6 bg-amber-50/70 border border-amber-200 text-amber-950">
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onDownloadReport}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>{isExporting ? 'Creating PowerPoint...' : 'Download Report (.pptx)'}</span>
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
