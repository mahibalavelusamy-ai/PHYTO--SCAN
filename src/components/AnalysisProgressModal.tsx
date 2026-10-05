import React from 'react';
import { Cpu, ShieldCheck, Sparkles, CheckCircle2, Loader2, Image as ImageIcon, FileCheck } from 'lucide-react';
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

  const steps = [
    {
      id: 'preparing_image',
      title: isTa ? '1. படத்தைத் தயார் செய்தல்' : '1. Preparing image',
      desc: isTa ? '224×224 வண்ண பரிமாணம்' : 'Standardizing 224×224 RGB input',
    },
    {
      id: 'checking_quality',
      title: isTa ? '2. படத்தின் தரத்தை சரிபார்த்தல்' : '2. Checking image quality',
      desc: isTa ? 'வெளிச்சம் மற்றும் தெளிவு மதிப்பீடு' : 'Validating lighting, contrast, and focus',
    },
    {
      id: 'mobilenetv3_classification',
      title: isTa ? '3. தாவர மாதிரி மதிப்பீடு (MobileNetV3)' : '3. Running plant-health model',
      desc: isTa ? 'MobileNetV3-Large நரம்பியல் கணிப்பு' : 'MobileNetV3-Large condition classification',
    },
    {
      id: 'evaluating_confidence',
      title: isTa ? '4. நம்பகத்தன்மையை மதிப்பிடுதல்' : '4. Evaluating confidence',
      desc: isTa ? 'நம்பகத்தன்மை வாசல் சோதனை' : 'Calibrated certainty & rejection gate',
    },
    {
      id: 'preparing_report',
      title: isTa ? '5. சுகாதார அறிக்கையைத் தயார் செய்தல்' : '5. Preparing plant-health report',
      desc: isTa ? 'விவசாய அறிவுத்தள தரவுகளுடன் இணைத்தல்' : 'Grounding in Agricultural Knowledge Base',
    },
    {
      id: 'preparing_language_summary',
      title: isTa ? '6. உங்கள் மொழியில் சுருக்கம் தயார் செய்தல்' : '6. Preparing your language summary',
      desc: isTa ? 'எளிய வட்டார மொழி விளக்கம்' : 'Farmer-friendly localized explanation',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 flex flex-col items-center">
        {/* Animated Scanner Visual */}
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-stone-900 border-2 border-emerald-500/50 shadow-inner mb-5">
          <img
            src={imageSrc}
            alt="Scanning plant"
            className="w-full h-full object-cover filter brightness-95"
          />

          {/* Laser Scanner Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce duration-1000 top-0 bottom-0 m-auto" />

          {/* Corner target marks */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
            <span>{isTa ? 'செயல்முறை முன்னேற்றம்' : 'Analysis Progress'}</span>
            <span className="font-mono text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6 Sequential Steps */}
        <div className="w-full space-y-2.5">
          {steps.map((s, index) => {
            const stepThresholds = [15, 30, 50, 68, 82, 94];
            const isCompleted = progressPercent > stepThresholds[index];
            const isCurrent =
              progressPercent >= (stepThresholds[index - 1] || 0) &&
              progressPercent <= stepThresholds[index];

            return (
              <div
                key={s.id}
                className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/80 border border-emerald-200'
                    : isCompleted
                    ? 'opacity-80'
                    : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[9px] font-bold text-stone-400">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-emerald-900' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-[10px] text-stone-500">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
