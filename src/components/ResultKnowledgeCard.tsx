import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { KnowledgeBaseEntry } from '../types.ts';

interface ResultKnowledgeCardProps {
  kbMatch: KnowledgeBaseEntry;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ResultKnowledgeCard: React.FC<ResultKnowledgeCardProps> = ({
  kbMatch,
  isExpanded: controlledExpanded,
  onToggle: controlledOnToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const handleToggle = controlledOnToggle || (() => setInternalExpanded((prev) => !prev));

  const hasTreatment = Boolean(kbMatch.treatment || kbMatch.treatments);

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
    if (!treatment) return null;
    if (typeof treatment === 'string') {
      return <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{treatment}</p>;
    }
    if (Array.isArray(treatment)) {
      return (
        <ul className="space-y-1.5 mt-2">
          {treatment.map((t, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (typeof treatment === 'object') {
      return (
        <div className="space-y-3 text-xs sm:text-sm text-stone-700">
          {treatment.organic && (
            <div>
              <span className="font-bold text-emerald-800">Organic: </span>
              <span>{Array.isArray(treatment.organic) ? treatment.organic.join(', ') : treatment.organic}</span>
            </div>
          )}
          {treatment.chemical && (
            <div>
              <span className="font-bold text-amber-800">Chemical: </span>
              <span>{Array.isArray(treatment.chemical) ? treatment.chemical.join(', ') : treatment.chemical}</span>
            </div>
          )}
          {treatment.preventive && (
            <div>
              <span className="font-bold text-blue-800">Preventive: </span>
              <span>{Array.isArray(treatment.preventive) ? treatment.preventive.join(', ') : treatment.preventive}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm mb-8 transition-all">
      {/* Header with Title and Expand/Collapse Toggle */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700 shrink-0" />
          <h4 className="text-base font-bold text-stone-900">
            Known disease reference
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
            Reference data
          </span>
          {hasTreatment && (
            <button
              onClick={handleToggle}
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100/70 border border-emerald-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-emerald-600"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Hide treatment instructions' : 'Show full treatment instructions'}
            >
              <span>{isExpanded ? 'Hide treatments' : 'Show treatments'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Disease, Pathogen & Typical Loss Metrics */}
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

      {/* Expandable Treatment Section */}
      {hasTreatment && (
        <div className="mt-2">
          {!isExpanded ? (
            <button
              onClick={handleToggle}
              type="button"
              className="w-full bg-white hover:bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-3 transition-colors cursor-pointer text-left group focus-visible:outline-2 focus-visible:outline-emerald-600"
              aria-expanded={false}
              aria-label="Tap to show full treatment instructions"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">
                    Full Treatment Instructions
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Tap to expand organic, chemical, and preventive protocols
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0">
                <span className="hidden sm:inline">Tap to expand</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </div>
            </button>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Full Treatment Instructions
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Reference Protocol
                  </span>
                </div>
                <button
                  onClick={handleToggle}
                  type="button"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  aria-label="Hide treatment instructions"
                >
                  <span>Hide</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
              {renderTreatmentContent(kbMatch.treatment || kbMatch.treatments)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
