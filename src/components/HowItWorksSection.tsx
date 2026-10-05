import React from 'react';
import { Camera, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { Language } from '../utils/i18n';

interface HowItWorksSectionProps {
  language: Language;
  onStartScan: () => void;
  onOpenSpecs?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  language,
  onStartScan,
  onOpenSpecs,
}) => {
  const steps = [
    {
      step: '01',
      icon: Camera,
      title: 'Capture',
      subtitle: 'Photo',
      description:
        language === 'ta'
          ? 'பாதிக்கப்பட்ட இலையை உங்கள் தொலைபேசி கேமரா மூலம் படமெடுக்கவும் அல்லது பதிவேற்றவும்.'
          : 'Snap a clear leaf photo using your phone camera or upload an image from your gallery.',
      highlight: 'Field Ready',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Diagnose',
      subtitle: 'MobileNetV2 + Confidence',
      description:
        language === 'ta'
          ? 'MobileNetV2 நுண்ணறிவு மற்றும் Gemini AI மூலம் நம்பகமான துல்லியத்துடன் நோயை கண்டறிகிறது.'
          : 'Dual-tier vision runs on-device MobileNetV2 with Google Gemini AI for calibrated confidence.',
      highlight: 'Multimodal AI',
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'Act',
      subtitle: 'Treatment + Prevention',
      description:
        language === 'ta'
          ? 'இயற்கை மற்றும் ரசாயன சிகிச்சைகள், தெளிக்கும் கால இடைவெளி, தடுப்பு வழிகாட்டல்கள் உடனே கிடைக்கும்.'
          : 'Immediate actionable guidance: organic solutions, chemical controls, and long-term prevention.',
      highlight: 'Practical Steps',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">
            Simple 3-Step Process
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            HOW PHYTOSCAN WORKS
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            From field photograph to field-tested solution in seconds, designed for farmers and growers.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-7 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400 group-hover:text-emerald-600 transition-colors">
                      STEP {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-stone-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {item.highlight}
                  </span>
                  {idx < 2 && (
                    <span className="hidden md:inline-flex text-stone-300 text-sm">→</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartScan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Scan Your Leaf Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {onOpenSpecs && (
            <button
              onClick={onOpenSpecs}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Explore Technical Architecture</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
