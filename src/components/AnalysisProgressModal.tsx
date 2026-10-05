import React from 'react';
import { Cpu, ShieldCheck, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Language } from '../utils/i18n';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  imageSrc: string;
  stage: string;
  progressPercent: number;
  language: Language;
}

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  imageSrc,
  stage,
  progressPercent,
  language,
}) => {
  if (!isOpen) return null;

  const isTa = language === 'ta';

  const stages = [
    {
      id: 'preprocessing',
      title: isTa ? 'படத்தை சீரமைத்தல் (224×224)' : 'Preprocessing & Normalization (224×224)',
      desc: isTa ? 'இலையின் ஒளிர்வு, விளிம்பு பகுப்பாய்வு' : 'Color histograms and contrast validation',
    },
    {
      id: 'mobilenetv2_classification',
      title: isTa ? 'MobileNetV2 நோய்க் கண்டறிதல்' : 'MobileNetV2 Feature Extraction',
      desc: isTa ? 'தாவர நோய்க்கூறு மாதிரியமைத்தல்' : 'Inference against PlantVillage pathology priors',
    },
    {
      id: 'confidence_gate',
      title: isTa ? 'நம்பகத்தன்மை சரிபார்ப்பு' : 'Confidence Gate Assessment',
      desc: isTa ? 'துல்லியம் மற்றும் நிச்சயமற்ற தன்மை மதிப்பீடு' : 'Plausibility thresholds & uncertainty boundary',
    },
    {
      id: 'gemini_guidance_synthesis',
      title: isTa ? 'Gemini AI தீர்வு ஆலோசனை தயாரித்தல்' : 'Gemini Guidance Engine',
      desc: isTa ? 'விரிவான விவசாய வழிகாட்டல் மற்றும் தடுப்பு முறைகள்' : 'Synthesizing agronomic advice & actions in real-time',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 flex flex-col items-center">
        {/* Animated Scanner Visual */}
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-stone-900 border-2 border-emerald-500/50 shadow-inner mb-6">
          <img
            src={imageSrc}
            alt="Scanning leaf"
            className="w-full h-full object-cover filter brightness-95"
          />

          {/* Laser Scanner Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce duration-1000 top-0 bottom-0 m-auto" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="absolute bottom-2 inset-x-2 flex justify-between items-center px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] text-emerald-300 font-mono">
            <span>RES: 224x224</span>
            <span className="animate-pulse">ANALYZING...</span>
          </div>
        </div>

        <h3 className="font-extrabold text-lg sm:text-xl text-stone-900 mb-1 text-center">
          {isTa ? 'இலையின் ஆரோக்கியம் ஆய்வு செய்யப்படுகிறது' : 'Diagnosing Plant Leaf'}
        </h3>
        <p className="text-xs text-stone-500 mb-6 text-center max-w-xs">
          {isTa
            ? 'MobileNetV2 நோய்க் கண்டறிதல் மற்றும் Gemini AI ஆலோசனை ஒருங்கிணைக்கப்படுகிறது.'
            : 'Modular MobileNetV2 transfer feature pipeline coupled with Gemini multimodal reasoning.'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden mb-6 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stages list */}
        <div className="w-full space-y-2.5">
          {stages.map((st, idx) => {
            const isCompleted =
              (idx === 0 && progressPercent > 20) ||
              (idx === 1 && progressPercent > 45) ||
              (idx === 2 && progressPercent > 65) ||
              (idx === 3 && progressPercent >= 95);

            const isCurrent =
              (idx === 0 && progressPercent <= 20) ||
              (idx === 1 && progressPercent > 20 && progressPercent <= 45) ||
              (idx === 2 && progressPercent > 45 && progressPercent <= 65) ||
              (idx === 3 && progressPercent > 65);

            return (
              <div
                key={st.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                    : isCompleted
                    ? 'bg-stone-50 border-stone-200 text-stone-700'
                    : 'bg-transparent border-transparent text-stone-400 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="leading-tight">{st.title}</p>
                  <p className="text-[10px] text-stone-500 font-normal mt-0.5">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
