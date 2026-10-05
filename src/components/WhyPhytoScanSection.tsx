import React from 'react';
import {
  ShieldAlert,
  Languages,
  CheckCircle2,
  FileCheck,
  History,
  Bot,
} from 'lucide-react';
import { Language } from '../utils/i18n';

interface WhyPhytoScanSectionProps {
  language: Language;
  onStartScan: () => void;
}

export const WhyPhytoScanSection: React.FC<WhyPhytoScanSectionProps> = ({
  language,
  onStartScan,
}) => {
  const features = [
    {
      icon: ShieldAlert,
      title: 'Early Detection',
      description:
        language === 'ta'
          ? 'ஆரம்ப நிலையிலேயே பூஞ்சை, பாக்டீரியா மற்றும் பூச்சி தாக்குதல்களை கண்டறிந்து மகசூல் இழப்பை தடுக்கிறது.'
          : 'Catch fungal leaf spots, blights, and pests early before damage spreads across your entire field.',
    },
    {
      icon: Languages,
      title: 'Tamil Guidance',
      description:
        language === 'ta'
          ? 'தமிழ், தெலுங்கு, கன்னடம், மலையாளம் மற்றும் ஆங்கிலத்தில் எளிய வட்டார மொழி விளக்கங்கள்.'
          : 'Clear explanations in தமிழ் (Tamil), Telugu, Kannada, Malayalam, and English for field farmers.',
    },
    {
      icon: CheckCircle2,
      title: 'Confidence Score',
      description:
        language === 'ta'
          ? 'படத்தின் தெளிவுத்தன்மை மற்றும் நம்பகத்தன்மை சதவிகிதத்தை வெளிப்படையாக காட்டுகிறது.'
          : 'Transparent certainty ratings with honesty checks and image quality gate warnings.',
    },
    {
      icon: FileCheck,
      title: 'Simple Advice',
      description:
        language === 'ta'
          ? 'களத்தில் உடனடியாக செயல்படுத்தக்கூடிய எளிய இயற்கை மற்றும் ரசாயன தீர்வுகள்.'
          : 'Practical, step-by-step organic remedies and chemical dosages ready for immediate farm application.',
    },
    {
      icon: History,
      title: 'Scan History',
      description:
        language === 'ta'
          ? 'முந்தைய அனைத்து பரிசோதனை அறிக்கைகளும் பாதுகாப்பாக சேமிக்கப்பட்டு பயிரின் வளர்ச்சியை கண்காணிக்கிறது.'
          : 'Cloud-synced scan records in Firestore to track disease recovery throughout the harvest season.',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description:
        language === 'ta'
          ? 'குரல் மூலம் கேள்விகள் கேட்கக்கூடிய நுண்ணறிவு வேளாண்மை உதவியாளர் (Gemini Voice).'
          : 'Multi-turn conversational Agronomist AI with microphone voice transcription in your language.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">
            Built for Farmers
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            WHY PHYTOSCAN?
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Fast, accessible, and scientifically grounded plant health assessments tailored for the field.
          </p>
        </div>

        {/* Feature Grid: 2 Columns on Mobile / Tablet, 3 Columns on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-center text-emerald-700 shadow-2xs mb-4 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action Bar */}
        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              Notice leaf discoloration or spots on your crops?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Take a photo right now to get instant disease diagnosis and treatment steps.
            </p>
          </div>
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Start Leaf Scan
          </button>
        </div>
      </div>
    </section>
  );
};
