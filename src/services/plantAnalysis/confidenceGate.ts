/**
 * Confidence & Rejection Gate Module
 * 
 * Strict architectural role:
 * Evaluates MobileNetV3-Large classification output and preprocessed image metrics.
 * Routes into one of 4 deterministic states:
 * - STATE A — HEALTHY: No visible signs of disease detected (Confidence >= 60% and class is healthy)
 * - STATE B — POSSIBLE CONDITION: Possible [Condition] (Confidence >= 60% and class is disease)
 * - STATE C — UNCERTAIN: We couldn't identify the condition reliably (Confidence < 60% or poor image)
 * - STATE D — OUTSIDE MODEL COVERAGE: Plant/crop is outside coverage
 */
import { ClassifierOutput, PreprocessedImageData, GateDecision, PlantHealthState } from './types';
import { isCropSupportedByCustomModel } from '../../config/plantDiseaseLabels';

export function evaluateConfidenceGate(
  classifierOutput: ClassifierOutput,
  preprocessed: PreprocessedImageData
): GateDecision {
  const prob = classifierOutput.primaryPrediction.probability;
  const qualityIssues = preprocessed.colorProfile.qualityIssues;
  const isBlurryOrDark = preprocessed.colorProfile.isBlurry || preprocessed.colorProfile.isDark;

  const photoTips = [
    'Capture the whole plant or affected area clearly.',
    'Avoid heavy shadows and ensure good natural lighting.',
    'Keep the plant part in sharp focus.',
    'Avoid extreme zoom or being too close to the subject.',
    'Make sure the area of interest is clearly visible.',
  ];

  // 1. Severe optical or exposure issues -> Route immediately to STATE C (Uncertain)
  if (isBlurryOrDark || qualityIssues.length > 1) {
    return {
      passed: false,
      state: 'uncertain',
      confidenceTier: 'low',
      gateNotes: `Low image quality detected (${qualityIssues.join('; ')}). Condition could not be reliably determined.`,
      photoTips,
    };
  }

  // 2. Check coverage of the detected crop
  const detectedCrop = classifierOutput.primaryPrediction.crop || '';
  if (detectedCrop && !isCropSupportedByCustomModel(detectedCrop)) {
    return {
      passed: false,
      state: 'outside_coverage',
      confidenceTier: prob >= 0.8 ? 'high' : prob >= 0.6 ? 'moderate' : 'low',
      gateNotes: `This plant (${detectedCrop}) is not currently covered by the trained model.`,
      photoTips,
    };
  }

  // 3. Low Confidence (< 60%) -> Route to STATE C (Uncertain)
  if (prob < 0.60) {
    return {
      passed: false,
      state: 'uncertain',
      confidenceTier: 'low',
      gateNotes: 'We could not identify the plant condition reliably due to low model certainty.',
      photoTips,
    };
  }

  // 4. Healthy Prediction -> Route to STATE A (Healthy)
  const isHealthy =
    classifierOutput.primaryPrediction.category === 'healthy' ||
    classifierOutput.primaryPrediction.className.toLowerCase().includes('healthy') ||
    (classifierOutput.primaryPrediction.labelString || '').toLowerCase().includes('healthy');

  if (isHealthy) {
    return {
      passed: true,
      state: 'healthy',
      confidenceTier: prob >= 0.80 ? 'high' : 'moderate',
      gateNotes: 'No visible signs of the supported conditions were detected in this image.',
      photoTips: ['Continue standard watering and monitor foliage weekly.'],
    };
  }

  // 5. Supported Condition -> Route to STATE B (Possible Condition)
  return {
    passed: true,
    state: 'condition',
    confidenceTier: prob >= 0.80 ? 'high' : 'moderate',
    gateNotes: `Possible condition identified with ${Math.round(prob * 100)}% model confidence.`,
    photoTips: [],
  };
}
