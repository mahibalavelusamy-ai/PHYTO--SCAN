import React from 'react';
import { Eye, Layers, Activity, ShieldCheck } from 'lucide-react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { translations, Language } from '../utils/i18n.ts';

interface ResultActionCardsProps {
  result: PlantAnalysisResult;
  language: Language;
}

export const ResultActionCards: React.FC<ResultActionCardsProps> = ({ result, language }) => {
  const t = translations[language];

  return (
    <>
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
                  Physiological or environmental factors.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Plan & Prevention Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Actions */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-emerald-950/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-4 text-emerald-300">
              <div className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
                <Activity className="w-4 h-4" />
              </div>
              <h4>{t.whatYouCanDo}</h4>
            </div>
            <ul className="space-y-3">
              {result.recommendedActions && result.recommendedActions.length > 0 ? (
                result.recommendedActions.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-50/90 leading-relaxed">
                    <span className="w-5 h-5 rounded-lg bg-emerald-800/80 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-emerald-700/40">
                      {idx + 1}
                    </span>
                    <span>{act}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-emerald-200/70 italic">
                  Continue regular soil moisture monitoring and inspect underside of leaves weekly.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Prevention */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4>{t.prevention}</h4>
            </div>
            <ul className="space-y-3">
              {result.prevention && result.prevention.length > 0 ? (
                result.prevention.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
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
    </>
  );
};
