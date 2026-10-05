import React from 'react';
import { Leaf } from 'lucide-react';
import { Language } from '../utils/i18n';

interface AppFooterProps {
  language: Language;
  onOpenArchitecture: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ language, onOpenArchitecture }) => {
  return (
    <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 mt-12 text-center text-xs text-stone-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-stone-800 tracking-tight">
            PhytoScan
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-600 font-medium">AGRIMIND Initiative</span>
        </div>

        <p className="font-medium text-stone-500">
          {language === 'ta'
            ? '“ஸ்கேன் செய்க. கண்டறிக. உடனே தீர்வு காண்க.”'
            : '“Scan. Diagnose. Act early.”'}
        </p>

        <button
          onClick={onOpenArchitecture}
          className="text-stone-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
        >
          MobileNetV2 + Gemini AI Specs
        </button>
      </div>
    </footer>
  );
};
