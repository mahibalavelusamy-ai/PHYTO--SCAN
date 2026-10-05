/**
 * Master Plant Health Analysis Pipeline
 * Implements the explicit architectural flow:
 * 
 * Preprocess
 *  → Custom Model (TensorFlow.js PlantVillage 38-class MobileNetV2 or fallback backbone)
 *  → Confidence Gate (Below threshold => "Not sure")
 *  → Knowledge Base Lookup (findKnowledgeMatches)
 *  → Gemini Guidance if online (Skipped if offline with dedicated banner)
 *  → Final Result Assembly
 */
import { preprocessPlantImage } from './preprocessor';
import { defaultMobileNetV2Classifier } from './classifier';
import { evaluateConfidenceGate } from './confidenceGate';
import { requestGeminiGuidance } from './geminiEngine';
import { PipelineInput, PlantAnalysisResult } from './types';
import { buildOfflinePlantResult } from '../../utils/offlineAdvisor';
import { isCropSupportedByCustomModel } from '../../config/plantDiseaseLabels';

export * from './types';
export * from './preprocessor';
export * from './classifier';
export * from './confidenceGate';
export * from './geminiEngine';
export { mobileNetV2Service, getCustomModelUrl } from '../mobilenetClassifier';
export {
  PLANT_DISEASE_LABELS,
  getPlantDiseaseClassByIndex,
  getPlantDiseaseClassByLabel,
  SUPPORTED_PLANTVILLAGE_CROPS,
  isCropSupportedByCustomModel,
} from '../../config/plantDiseaseLabels';

export async function runPlantHealthPipeline(
  input: PipelineInput
): Promise<PlantAnalysisResult> {
  const { imageSource, language, onProgress } = input;

  // 1. Preprocess: Resize to 224x224 RGB and check exposure/lighting
  onProgress?.('preprocessing', 15);
  const preprocessed = await preprocessPlantImage(imageSource);

  // 2. Custom Model: Run on-device TensorFlow.js neural inference
  onProgress?.('mobilenetv2_classification', 35);
  const classifierOutput = await defaultMobileNetV2Classifier.classify(preprocessed);

  // 3. Confidence Gate: Enforce certainty threshold
  onProgress?.('confidence_gate', 55);
  const gateDecision = evaluateConfidenceGate(classifierOutput, preprocessed);

  // 4. Knowledge Base Lookup: Match by crop and disease name from prediction
  onProgress?.('knowledge_base_lookup', 70);
  let candidatePlant = '';
  let candidateDisease = '';

  const labelString = classifierOutput.primaryPrediction.labelString;
  if (labelString && labelString.includes('___')) {
    const parts = labelString.split('___');
    candidatePlant = parts[0].replace(/_/g, ' ');
    if (parts[1]) {
      candidateDisease = parts[1].replace(/_/g, ' ');
    }
  } else if (classifierOutput.primaryPrediction.className.includes('___')) {
    const parts = classifierOutput.primaryPrediction.className.split('___');
    candidatePlant = parts[0].replace(/_/g, ' ');
    if (parts[1]) {
      candidateDisease = parts[1].replace(/_/g, ' ');
    }
  } else {
    candidatePlant = classifierOutput.primaryPrediction.crop || '';
    candidateDisease = classifierOutput.primaryPrediction.className;
  }

  // 5. Online vs Offline Guidance Synthesis
  onProgress?.('gemini_guidance_synthesis', 85);
  let result: PlantAnalysisResult;

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  if (isOffline) {
    // Skip Gemini completely when offline
    result = buildOfflinePlantResult(
      candidatePlant,
      undefined,
      candidateDisease,
      classifierOutput,
      gateDecision
    );
  } else {
    try {
      result = await requestGeminiGuidance(
        preprocessed.originalDataUrl,
        language,
        classifierOutput,
        gateDecision
      );
    } catch (err) {
      console.warn('Gemini request failed, falling back to on-device offline guidance:', err);
      result = buildOfflinePlantResult(
        candidatePlant,
        undefined,
        candidateDisease,
        classifierOutput,
        gateDecision
      );
    }
  }

  // 6. Enforce Honesty Rules:
  // A. If the top confidence is below the gate threshold, say "Not sure" instead of showing a disease name.
  if (classifierOutput.isBelowGateThreshold) {
    result.condition = 'Not sure';
    result.isBelowGateThreshold = true;
  }

  // B. For crops outside the model's 14, flag that the on-device model does not cover this crop
  const detectedCrop = candidatePlant || (result.condition.includes(' ') ? result.condition.split(' ')[0] : result.condition);
  const isCovered = isCropSupportedByCustomModel(detectedCrop);
  result.isCropOutsideCoverage = !isCovered;

  // C. Never show ImageNet class names to the user.
  // If custom model is not loaded, candidateClass is kept undefined for the UI.
  result.classifierMetadata = {
    pipelineStage: isOffline ? 'offline_inference' : 'completed',
    modelName: classifierOutput.modelName,
    modelType: classifierOutput.modelType,
    isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
    candidateClass: classifierOutput.isCustomPlantModelLoaded
      ? classifierOutput.primaryPrediction.className
      : undefined,
    classifierProbability: classifierOutput.primaryPrediction.probability,
    top3Predictions: classifierOutput.top3Predictions?.map((p) => ({
      className: p.className,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      probability: p.probability,
    })),
    featureVectorLength: classifierOutput.featureVectorLength,
    qualityPassed: gateDecision.passed,
    inferenceTimeMs: classifierOutput.inferenceTimeMs,
  };

  onProgress?.('completed', 100);
  return result;
}
