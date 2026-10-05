import React from 'react';
import { Camera, Cpu, Sparkles } from 'lucide-react';
import { Language } from '../utils/i18n';

interface HowItWorksSectionProps {
  language: Language;
  onStartScan: () => void;
  onOpenSpecs?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  language,
}) => {
  const steps = [
    {
      step: '01',
      icon: Camera,
      title: 'Capture',
      detail: 'Photograph a single leaf in bright natural daylight or upload an existing image.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Analyze',
      detail: 'On-device MobileNetV2 classification combined with multimodal Gemini vision verification.',
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'Act',
      detail: 'Receive immediate practical steps: vitality care, verified treatments, and long-term prevention.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
            Diagnostic Workflow
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            How PhytoScan Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      STEP {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
