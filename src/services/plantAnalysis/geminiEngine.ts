/**
 * Gemini Guidance Engine Module
 * Connects to the secure server-side Gemini multimodal API endpoint.
 * Synthesizes plant health diagnostics, observations, actions, and safety guidance.
 * 
 * IMPORTANT: Gemini does not silently replace MobileNetV2. It receives the real MobileNetV2
 * feature extraction and prediction context, and translates visual symptoms into actionable farmer guidance.
 */
import { ClassifierOutput, GateDecision, PlantAnalysisResult } from './types';
import { Language } from '../../utils/i18n';

export async function requestGeminiGuidance(
  imageDataUrl: string,
  language: Language,
  classifierOutput: ClassifierOutput,
  gateDecision: GateDecision
): Promise<PlantAnalysisResult> {
  const payload = {
    imageBase64: imageDataUrl,
    language: language,
    classifierContext: {
      candidateClass: classifierOutput.primaryPrediction.className,
      classifierConfidence: classifierOutput.primaryPrediction.probability,
      modelType: classifierOutput.modelType,
      isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
      featureVectorLength: classifierOutput.featureVectorLength,
      notes: gateDecision.gateNotes,
      confidenceTier: gateDecision.confidenceTier,
    },
  };

  const response = await fetch('/api/analyze-plant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMsg = errorBody;
    try {
      const errJson = JSON.parse(errorBody);
      parsedMsg = errJson.error || errorBody;
    } catch {
      // ignore
    }
    throw new Error(`AI Analysis service error: ${parsedMsg}`);
  }

  const result = (await response.json()) as PlantAnalysisResult;

  // Augment with real MobileNetV2 inference and pipeline metadata
  result.classifierMetadata = {
    pipelineStage: 'mobilenetv2_to_confidence_gate_to_gemini',
    modelName: classifierOutput.modelName,
    modelType: classifierOutput.modelType,
    isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
    candidateClass: classifierOutput.primaryPrediction.className,
    classifierProbability: classifierOutput.primaryPrediction.probability,
    featureVectorLength: classifierOutput.featureVectorLength,
    qualityPassed: gateDecision.passed,
    inferenceTimeMs: classifierOutput.inferenceTimeMs,
  };

  return result;
}
