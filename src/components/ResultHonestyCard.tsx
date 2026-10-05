import React from 'react';
import { Layers, HelpCircle } from 'lucide-react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';

interface ResultHonestyCardProps {
  result: PlantAnalysisResult;
}

export const ResultHonestyCard: React.FC<ResultHonestyCardProps> = ({ result }) => {
  return (
    <>
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
    </>
  );
};
