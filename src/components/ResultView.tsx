import React, { useState, useMemo, useEffect } from 'react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types';
import { Language, translations } from '../utils/i18n';
import { findKnowledgeMatches } from '../utils/kbSearch';
import { exportPlantReportToPPTX } from '../utils/reportExport';
import {
  AlertTriangle,
  RotateCcw,
  Share2,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ImageOff,
} from 'lucide-react';

import {
  determineResultState,
  ResultState,
  RESULT_STATE_METAS,
} from './result/resultStateHelper';
import { ResultHealthyView } from './result/ResultHealthyView';
import { ResultUncertainView } from './result/ResultUncertainView';
import { ResultUnsupportedView } from './result/ResultUnsupportedView';
import { ResultConditionView } from './result/ResultConditionView';

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

  // Determine initial state from analysis result
  const autoState = useMemo(() => determineResultState(result), [result]);
  const [activeState, setActiveState] = useState<ResultState>(autoState);

  // Sync state if a new result is analyzed
  useEffect(() => {
    setActiveState(autoState);
  }, [autoState]);

  const handleCopySummary = () => {
    const text = `PhytoScan Assessment (${activeState.toUpperCase()}):
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

  const stateTabs: Array<{ id: ResultState; label: string; icon: React.ElementType }> = [
    { id: 'healthy', label: 'Healthy', icon: CheckCircle2 },
    { id: 'possible_condition', label: 'Possible Condition', icon: AlertCircle },
    { id: 'uncertain', label: 'Uncertain', icon: HelpCircle },
    { id: 'unsupported', label: 'Unsupported', icon: ImageOff },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-200">
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
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copied ? 'Copied!' : 'Share / Copy'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-xs cursor-pointer"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.scanAnotherPlant}</span>
          </button>
        </div>
      </div>

      {/* Four-State Result System Selector Bar */}
      <div className="mb-6 p-2 rounded-2xl bg-stone-100/90 border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
          <span>Diagnostic State:</span>
          {activeState === autoState && (
            <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
              Auto-Detected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto">
          {stateTabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeState === tab.id;
            const meta = RESULT_STATE_METAS[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveState(tab.id)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? `${meta.colorClass.badge} shadow-xs font-extrabold ring-1 ring-inset ${meta.colorClass.border}`
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60 bg-transparent'
                }`}
                title={meta.description}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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

      {/* Active State View Rendering */}
      {activeState === 'healthy' && (
        <ResultHealthyView
          result={result}
          imageSrc={imageSrc}
          language={language}
          onReset={onReset}
          isSaved={isSaved}
          onSaveToHistory={onSaveToHistory}
          isSaving={isSaving}
          onDownloadReport={handleDownloadReport}
          isExporting={isExporting}
          onCopySummary={handleCopySummary}
          copied={copied}
        />
      )}

      {activeState === 'uncertain' && (
        <ResultUncertainView
          result={result}
          imageSrc={imageSrc}
          language={language}
          onReset={onReset}
        />
      )}

      {activeState === 'unsupported' && (
        <ResultUnsupportedView
          result={result}
          imageSrc={imageSrc}
          language={language}
          onReset={onReset}
        />
      )}

      {activeState === 'possible_condition' && (
        <ResultConditionView
          result={result}
          imageSrc={imageSrc}
          language={language}
          onReset={onReset}
          isSaved={isSaved}
          onSaveToHistory={onSaveToHistory}
          isSaving={isSaving}
          onDownloadReport={handleDownloadReport}
          isExporting={isExporting}
          kbMatch={kbMatch}
          isKbExpanded={isKbExpanded}
          setIsKbExpanded={setIsKbExpanded}
        />
      )}
    </div>
  );
};
