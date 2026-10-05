import React from 'react';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { WhyPhytoScanSection } from './WhyPhytoScanSection';
import { Language } from '../utils/i18n';
import { SampleLeaf } from '../utils/sampleLeaves';

interface LandingViewProps {
  language: Language;
  onTakePhoto: () => void;
  onSelectImageFile: (file: File) => void;
  onSelectSample: (sample: SampleLeaf) => void;
  onOpenArchitecture: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onTakePhoto,
  onSelectImageFile,
  onSelectSample,
  onOpenArchitecture,
}) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section matching wireframe */}
      <HeroSection
        language={language}
        onTakePhoto={onTakePhoto}
        onSelectImageFile={onSelectImageFile}
        onSelectSample={onSelectSample}
      />

      {/* HOW PHYTOSCAN WORKS: Capture -> Diagnose -> Act */}
      <HowItWorksSection
        language={language}
        onStartScan={onTakePhoto}
        onOpenSpecs={onOpenArchitecture}
      />

      {/* WHY PHYTOSCAN?: 6-pillar benefit matrix */}
      <WhyPhytoScanSection
        language={language}
        onStartScan={onTakePhoto}
      />
    </div>
  );
};
