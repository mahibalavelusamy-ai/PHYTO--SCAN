import React from 'react';
import { Sprout, Globe2, MessagesSquare, ArrowUpRight } from 'lucide-react';
import { Language } from '../utils/i18n';

interface WhyPhytoScanSectionProps {
  language: Language;
  onStartScan: () => void;
}

export const WhyPhytoScanSection: React.FC<WhyPhytoScanSectionProps> = ({
  onStartScan,
}) => {
  const capabilities = [
    {
      icon: Sprout,
      title: '14 Specialized Crops',
      description:
        'Trained on major agricultural crops including Tomato, Potato, Bell Pepper, Corn, Apple, Grape, Citrus, Peach, and Strawberry.',
      tag: 'Agricultural Scope',
    },
    {
      icon: Globe2,
      title: '5 Regional Languages',
      description:
        'Field guidance available in English, தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), and മലയാളം (Malayalam).',
      tag: 'Multilingual',
    },
    {
      icon: MessagesSquare,
      title: 'Agronomist Consultation',
      description:
        'Ask follow-up questions via text or voice about organic remedies, chemical dosages, spray intervals, and crop hygiene.',
      tag: 'Interactive AI',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
            Core Capabilities
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Built for Farmers & Growers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-700 shadow-2xs mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="text-[11px] font-mono font-medium text-emerald-800">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Crisp Scan CTA Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Ready to analyze a crop leaf?
            </h4>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Instant visual inspection with verified treatment protocols.
            </p>
          </div>
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <span>Scan Plant Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
