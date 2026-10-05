/**
 * Master Plant Health Analysis Pipeline
 * Implements the locked architectural flow:
 * 
 * Plant Photograph
 *  → Preprocessing & Quality Checks (224x224 RGB)
 *  → MobileNetV3-Large (Plant condition / disease classification)
 *  → Prediction Probability & Confidence (exact MobileNetV3 output)
 *  → Confidence & Rejection Gate (Routes to: Healthy, Condition, Uncertain, Outside Coverage)
 *  → Agricultural Knowledge Base (Grounding source for symptoms, causes, treatments, prevention)
 *  → Structured Plant Health Report
 *  → Gemini Explanation (Summarizes, translates into selected language, Q&A — NO IMAGE INSPECTION)
 *  → Selected Language & TTS
 */
import { preprocessPlantImage } from './preprocessor';
import { defaultMobileNetV3Classifier } from './classifier';
import { evaluateConfidenceGate } from './confidenceGate';
import { requestGeminiExplanation } from './geminiEngine';
import { PipelineInput, PlantAnalysisResult, PlantSeverity } from './types';
import { findKnowledgeMatches } from '../../utils/kbSearch';
import { isCropSupportedByCustomModel } from '../../config/plantDiseaseLabels';

export * from './types';
export * from './preprocessor';
export * from './classifier';
export * from './confidenceGate';
export * from './geminiEngine';
export { mobileNetV3Service, getCustomModelUrl } from '../mobilenetClassifier';

export async function runPlantHealthPipeline(
  input: PipelineInput
): Promise<PlantAnalysisResult> {
  const { imageSource, language, onProgress } = input;

  // 1. Preparing image & checking image quality
  onProgress?.('preparing_image', 15);
  const preprocessed = await preprocessPlantImage(imageSource);

  onProgress?.('checking_quality', 30);

  // 2. Running plant-health model (MobileNetV3-Large)
  onProgress?.('mobilenetv3_classification', 50);
  const classifierOutput = await defaultMobileNetV3Classifier.classify(preprocessed);

  // 3. Evaluating confidence gate
  onProgress?.('evaluating_confidence', 68);
  const gateDecision = evaluateConfidenceGate(classifierOutput, preprocessed);

  // 4. Preparing plant-health report grounded in Agricultural Knowledge Base
  onProgress?.('preparing_report', 82);

  const rawConfidence = classifierOutput.primaryPrediction.probability;
  const confidencePercent = Math.min(100, Math.max(1, Math.round(rawConfidence * 100)));
  const labelString = classifierOutput.primaryPrediction.labelString || '';

  let candidateCrop = classifierOutput.primaryPrediction.crop || '';
  let candidateDisease = classifierOutput.primaryPrediction.className;

  if (labelString.includes('___')) {
    const parts = labelString.split('___');
    candidateCrop = parts[0].replace(/_/g, ' ');
    if (parts[1]) {
      candidateDisease = parts[1].replace(/_/g, ' ');
    }
  }

  let structuredResult: PlantAnalysisResult;

  if (gateDecision.state === 'healthy') {
    // STATE A — HEALTHY
    structuredResult = {
      condition: 'No visible signs of disease detected',
      state: 'healthy',
      confidence: confidencePercent,
      confidenceTier: gateDecision.confidenceTier,
      severity: 'None',
      observations: [
        'Plant foliage and surface tissue display uniform coloration without active lesions.',
        'No visible fungal mycelium, bacterial water-soaked spots, or pest pustules detected.',
        'Leaf structure, veins, and margins appear healthy and intact.',
      ],
      possibleCauses: ['Optimal environmental conditions and proper crop management.'],
      recommendedActions: [
        'Continue current watering schedule, watering at the base to keep foliage dry.',
        'Maintain balanced fertilization according to crop growth requirements.',
        'Conduct weekly visual inspections to catch any early changes in plant health.',
      ],
      prevention: [
        'Ensure proper plant spacing for sunlight exposure and adequate air movement.',
        'Sanitize garden tools and pruning shears between plants.',
      ],
      uncertaintyNote:
        'A photograph cannot guarantee that an entire plant is disease-free. Continue routine field monitoring.',
      summary: 'No visible signs of the supported conditions were detected in this image.',
      audioNarration:
        'No visible signs of disease detected. Your plant appears healthy. Continue regular care and weekly monitoring.',
    };
  } else if (gateDecision.state === 'uncertain') {
    // STATE C — UNCERTAIN
    structuredResult = {
      condition: "We couldn't identify the condition reliably",
      state: 'uncertain',
      confidence: confidencePercent,
      confidenceTier: 'low',
      severity: 'Not determined',
      observations: [
        'The image may have uneven lighting, shadows, or motion blur.',
        'Distinct pathogen symptoms could not be isolated with sufficient certainty.',
      ],
      possibleCauses: ['Insufficient photo sharpness, lighting contrast, or early subtle symptom stage.'],
      recommendedActions: [
        'Take another photo with bright, even natural light without harsh shadows.',
        'Keep the plant part in sharp focus and avoid extreme digital zoom.',
        'Capture the affected area clearly so symptoms are distinct.',
        'If plant health deteriorates, consult a local agricultural extension specialist (KVK).',
      ],
      prevention: [
        'Inspect both upper and lower foliage surfaces regularly.',
        'Monitor whether spots or discoloration spread over 2 to 3 days.',
      ],
      uncertaintyNote:
        'Confidence was below threshold. Do not apply chemical treatments until the condition is confirmed.',
      summary:
        "We couldn't identify the plant condition reliably. Please try another photo with better lighting and sharper focus.",
      audioNarration:
        "We couldn't identify the plant condition reliably. Please retake the photo with better lighting and sharp focus.",
    };
  } else if (gateDecision.state === 'outside_coverage') {
    // STATE D — OUTSIDE MODEL COVERAGE
    structuredResult = {
      condition: "This plant isn't currently covered",
      state: 'outside_coverage',
      confidence: confidencePercent,
      confidenceTier: gateDecision.confidenceTier,
      severity: 'Not determined',
      observations: [
        `The detected subject (${candidateCrop || 'plant'}) is outside the 14 supported PlantVillage crop categories.`,
      ],
      possibleCauses: ['Model coverage boundary: trained on 14 major agricultural crops and 38 classes.'],
      recommendedActions: [
        'Refer to your district or regional agricultural extension center for specialized diagnostics.',
        'Take fresh leaf or plant samples to an accredited plant pathology clinic.',
      ],
      prevention: ['Follow standard good agricultural practices (GAP) for your specific crop variety.'],
      uncertaintyNote: 'The current trained model does not support this plant or condition.',
      summary: 'The current trained model does not support this plant or condition.',
      audioNarration:
        'This plant is not currently covered by our trained model. Please consult your local agricultural office.',
    };
  } else {
    // STATE B — POSSIBLE CONDITION
    const kbMatches = findKnowledgeMatches(candidateCrop, undefined, candidateDisease);
    const topMatch = kbMatches[0]?.entry;

    let derivedSeverity: PlantSeverity = 'Not determined';
    if (topMatch?.severity) {
      const sevStr = String(topMatch.severity).toLowerCase();
      if (sevStr.includes('mild')) derivedSeverity = 'Mild';
      else if (sevStr.includes('severe')) derivedSeverity = 'Severe';
      else if (sevStr.includes('moderate')) derivedSeverity = 'Moderate';
    }

    const observations = topMatch?.symptoms
      ? Array.isArray(topMatch.symptoms)
        ? topMatch.symptoms
        : [topMatch.symptoms]
      : ['Visible lesion spotting and localized discoloration detected on plant tissue.'];

    let causes = topMatch?.causes
      ? Array.isArray(topMatch.causes)
        ? topMatch.causes
        : [topMatch.causes]
      : [];
    if (causes.length === 0 && topMatch?.pathogen) {
      causes = [topMatch.pathogen];
    }
    if (causes.length === 0) {
      causes = ['Fungal or bacterial pathogen favored by prolonged surface moisture.'];
    }

    let actions: string[] = [];
    if (topMatch?.treatment) {
      if (typeof topMatch.treatment === 'object' && 'organic' in topMatch.treatment) {
        const org = (topMatch.treatment as any).organic || [];
        const chem = (topMatch.treatment as any).chemical || [];
        actions = [...org, ...chem];
      } else if (Array.isArray(topMatch.treatment)) {
        actions = topMatch.treatment;
      } else {
        actions = [String(topMatch.treatment)];
      }
    }
    if (actions.length === 0) {
      actions = [
        'Prune visibly affected plant parts and dispose of them away from the field.',
        'Avoid overhead irrigation to reduce foliage wetness duration.',
        'Consult local agricultural extension for recommended treatment products.',
      ];
    }

    const prevention = topMatch?.prevention && Array.isArray(topMatch.prevention) && topMatch.prevention.length > 0
      ? topMatch.prevention
      : [
          'Maintain adequate plant spacing for ventilation and canopy aeration.',
          'Water early in the morning so plant foliage dries rapidly in the sun.',
          'Disinfect harvesting and pruning equipment regularly.',
        ];

    structuredResult = {
      condition: `Possible ${classifierOutput.primaryPrediction.className}`,
      state: 'condition',
      confidence: confidencePercent,
      confidenceTier: gateDecision.confidenceTier,
      severity: derivedSeverity,
      observations,
      possibleCauses: causes,
      recommendedActions: actions,
      prevention,
      uncertaintyNote:
        'Confidence indicates model class probability. It does not guarantee diagnosis. Confirm with local extension officers before major interventions.',
      summary: `Possible ${classifierOutput.primaryPrediction.className} identified with ${confidencePercent}% model confidence.`,
      audioNarration: `Possible ${classifierOutput.primaryPrediction.className} detected with ${confidencePercent} percent confidence. Review the recommended actions to protect your crop.`,
    };
  }

  // Attach metadata
  structuredResult.classifierMetadata = {
    pipelineStage: 'completed',
    modelName: 'MobileNetV3-Large',
    modelType: classifierOutput.modelType,
    isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
    candidateClass: classifierOutput.primaryPrediction.className,
    classifierProbability: rawConfidence,
    top3Predictions: classifierOutput.top3Predictions?.map((p) => ({
      className: p.className,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      probability: p.probability,
    })),
    featureVectorLength: classifierOutput.featureVectorLength,
    qualityPassed: gateDecision.passed,
    inferenceTimeMs: classifierOutput.inferenceTimeMs,
  };

  // 5. Preparing language summary & translation via Gemini (NO image sent!)
  onProgress?.('preparing_language_summary', 94);
  const finalResult = await requestGeminiExplanation(structuredResult, language);

  onProgress?.('completed', 100);
  return finalResult;
}
