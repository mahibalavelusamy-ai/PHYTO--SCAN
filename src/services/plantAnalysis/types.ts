/**
 * Types for PhytoScan Plant Health Analysis Pipeline
 * Architecture:
 * Image -> Preprocessing -> MobileNetV2 Model -> Class Probabilities -> Confidence Gate -> Gemini Guidance -> Result
 */

import { Language } from '../../utils/i18n';

export interface PreprocessedImageData {
  originalDataUrl: string;
  normalizedDataUrl: string;
  width: number;
  height: number;
  targetResolution: { width: 224; height: 224 };
  colorProfile: {
    averageBrightness: number; // 0 to 255
    contrast: number;
    qualityIssues: string[];
  };
}

export interface ClassifierPrediction {
  className: string;
  probability: number; // 0.0 to 1.0
  percentage?: number; // 0 to 100
  labelString?: string; // raw label string from labels.json (e.g., Tomato___Early_blight)
  crop?: string;
  category?: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'healthy' | 'general' | 'uncertain';
}

export interface ClassifierOutput {
  primaryPrediction: ClassifierPrediction;
  topPredictions: ClassifierPrediction[];
  top3Predictions?: ClassifierPrediction[];
  isConfident: boolean;
  featureVectorLength: number;
  modelName: string;
  modelType: 'mobilenet-v2-imagenet-backbone' | 'mobilenet-v2-fine-tuned-plant-disease';
  isCustomPlantModelLoaded: boolean;
  inferenceTimeMs: number;
  isBotanicalSubjectLikely: boolean;
  modelStatusNotes: string;
  isBelowGateThreshold?: boolean;
}

export interface GateDecision {
  passed: boolean;
  requiresGeminiVisualVerification: boolean;
  confidenceTier: 'high' | 'moderate' | 'low' | 'insufficient_quality';
  gateNotes: string;
  recommendedFocusAreas: string[];
}

export interface PlantAnalysisResult {
  condition: string;
  confidence: number; // 0 to 100
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None' | 'Unknown' | string;
  observations: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  prevention: string[];
  uncertaintyNote: string;
  isOfflineGuidance?: boolean;
  offlineBannerText?: string;
  isCropOutsideCoverage?: boolean;
  isBelowGateThreshold?: boolean;
  classifierMetadata?: {
    pipelineStage: string;
    modelName: string;
    modelType: string;
    isCustomPlantModelLoaded: boolean;
    candidateClass?: string;
    classifierProbability?: number;
    top3Predictions?: Array<{
      className: string;
      percentage: number;
      probability: number;
    }>;
    featureVectorLength?: number;
    qualityPassed: boolean;
    inferenceTimeMs: number;
  };
}

export interface PipelineInput {
  imageSource: string; // base64 data URL
  language: Language;
  onProgress?: (stage: string, progressPercent: number) => void;
}
