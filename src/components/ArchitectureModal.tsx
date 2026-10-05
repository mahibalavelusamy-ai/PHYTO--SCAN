import React from 'react';
import { Cpu, X, Database, Shield, Zap, CheckCircle2, Box } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const steps = [
    {
      stage: '1. Image Input',
      desc: 'Leaf image acquired via WebRTC camera viewfinder or uploaded directly as image file.',
      tech: 'HTML5 Canvas / File API',
    },
    {
      stage: '2. Preprocessing & Tensor Normalization',
      desc: 'Bilinear center-crop to 224×224 RGB, pixel normalization, exposure check without artificial heuristics.',
      tech: 'src/services/plantAnalysis/preprocessor.ts',
    },
    {
      stage: '3. Real MobileNetV2 Neural Network Inference',
      desc: 'Cached TensorFlow.js MobileNetV2 singleton runs browser inference, extracting a 1280-dim feature vector.',
      tech: 'src/services/mobilenetClassifier.ts (TensorFlow.js)',
    },
    {
      stage: '4. Plant Disease Model Slot & Class Labels',
      desc: 'Decoupled slot ready for fine-tuned PlantVillage weights. 38 agricultural disease classes mapped cleanly in config.',
      tech: 'src/config/plantDiseaseLabels.ts',
    },
    {
      stage: '5. Confidence Gate',
      desc: 'Confidence threshold check. If below configured threshold, explicitly advises retaking photo with better lighting.',
      tech: 'src/services/plantAnalysis/confidenceGate.ts',
    },
    {
      stage: '6. Gemini Guidance Engine',
      desc: 'Translates MobileNetV2 telemetry and visual signs into actionable observations, actions, and bilingual guidance.',
      tech: 'src/server/plantAnalyzer.ts (Gemini 3.8 Flash)',
    },
    {
      stage: '7. Scan Persistence',
      desc: 'Stores diagnostic assessment, confidence, severity, and photo URL in Firestore & device cache.',
      tech: 'Firebase Firestore + Storage',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                {t.pipelineInfoTitle}
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">
                Real TensorFlow.js MobileNetV2 + Gemini Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <strong>Real MobileNetV2 Inference Pipeline:</strong> PhytoScan executes actual TensorFlow.js MobileNetV2 tensor inference in the browser. Standard ImageNet MobileNetV2 acts as the feature extraction backbone (1280 dimensions) while providing a pluggable hook where our fine-tuned plant-disease model weights (e.g., PlantVillage) connect.
          </div>

          <div className="space-y-2 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {steps.map((st, i) => (
              <div key={i} className="relative flex items-start gap-4 p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-700 text-xs font-bold flex items-center justify-center shadow-xs shrink-0 z-10">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      {st.stage}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      {st.tech}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 font-mono">
            <strong>Custom Model Connection Hook:</strong><br />
            <code>defaultMobileNetV2Classifier.loadModel(&apos;/path/to/custom_mobilenetv2_model.json&apos;)</code>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
