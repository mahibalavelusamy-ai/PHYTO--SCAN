/**
 * Confidence Gate Module
 * Architecture stage: MobileNetV2-based model -> class probabilities -> confidence gate -> Gemini guidance
 * 
 * Enforces quality, plausibility, and confidence thresholds:
 * If actual classifier confidence is below configured threshold, flags:
 * "Low confidence. Please retake the photo with better lighting or consult an agricultural expert."
 */
import { ClassifierOutput, PreprocessedImageData, GateDecision } from './types';

export function evaluateConfidenceGate(
  classifierOutput: ClassifierOutput,
  preprocessed: PreprocessedImageData
): GateDecision {
  const prob = classifierOutput.primaryPrediction.probability;
  const qualityIssues = preprocessed.colorProfile.qualityIssues;

  // 1. Check optical / exposure deficiencies
  if (qualityIssues.length > 0) {
    return {
      passed: false,
      requiresGeminiVisualVerification: true,
      confidenceTier: 'insufficient_quality',
      gateNotes: `Low confidence. Please retake the photo with better lighting or consult an agricultural expert. (${qualityIssues.join('; ')})`,
      recommendedFocusAreas: ['Lighting', 'Focus on leaf center', 'Resolution'],
    };
  }

  // 2. Fine-tuned custom plant disease model confidence evaluation
  if (classifierOutput.isCustomPlantModelLoaded) {
    if (prob >= 0.75) {
      return {
        passed: true,
        requiresGeminiVisualVerification: true,
        confidenceTier: 'high',
        gateNotes: `High confidence match (${Math.round(prob * 100)}%) for ${classifierOutput.primaryPrediction.className} from fine-tuned MobileNetV2 plant pathology model.`,
        recommendedFocusAreas: ['Pathogen verification', 'Treatment urgency', 'Prevention regimen'],
      };
    }

    if (prob >= 0.50) {
      return {
        passed: true,
        requiresGeminiVisualVerification: true,
        confidenceTier: 'moderate',
        gateNotes: `Moderate confidence (${Math.round(prob * 100)}%) for ${classifierOutput.primaryPrediction.className}. Visual leaf confirmation required to rule out secondary infections or nutrient stress.`,
        recommendedFocusAreas: ['Differential diagnosis', 'Secondary symptoms', 'Environmental factors'],
      };
    }

    // Low confidence branch
    return {
      passed: false,
      requiresGeminiVisualVerification: true,
      confidenceTier: 'low',
      gateNotes: 'Low confidence. Please retake the photo with better lighting or consult an agricultural expert.',
      recommendedFocusAreas: ['Symptom clarity', 'Uncertainty note', 'Extension contact'],
    };
  }

  // 3. MobileNetV2 Backbone mode (Standard ImageNet weights / 1280-dim feature vector)
  // Transparently handles the status where custom fine-tuned weights are pending
  const botanicalInfo = classifierOutput.isBotanicalSubjectLikely
    ? 'Botanical / foliage features identified by MobileNetV2 backbone.'
    : 'MobileNetV2 feature extraction completed.';

  if (prob >= 0.50) {
    return {
      passed: true,
      requiresGeminiVisualVerification: true,
      confidenceTier: 'moderate',
      gateNotes: `${botanicalInfo} MobileNetV2 top class: "${classifierOutput.primaryPrediction.className}" (${Math.round(prob * 100)}%). Custom fine-tuned plant disease weights pending connection. Gemini visual pathology verification active.`,
      recommendedFocusAreas: ['Visual leaf pathology', 'Lesion inspection', 'Actionable agronomic treatment'],
    };
  }

  return {
    passed: false,
    requiresGeminiVisualVerification: true,
    confidenceTier: 'low',
    gateNotes: 'Low confidence. Please retake the photo with better lighting or consult an agricultural expert.',
    recommendedFocusAreas: ['Photo clarity', 'Lighting', 'Consult agricultural extension'],
  };
}
