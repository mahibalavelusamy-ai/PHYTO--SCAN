import { findKnowledgeMatches } from './kbSearch.ts';
import { PlantAnalysisResult, ClassifierOutput, GateDecision } from '../services/plantAnalysis/types.ts';

function formatTreatmentToList(treatment: any): string[] {
  if (!treatment) return [];
  if (Array.isArray(treatment)) return treatment;
  if (typeof treatment === 'string') return [treatment];
  if (typeof treatment === 'object') {
    const list: string[] = [];
    if (treatment.organic) {
      const org = Array.isArray(treatment.organic) ? treatment.organic.join(', ') : treatment.organic;
      list.push(`Organic: ${org}`);
    }
    if (treatment.chemical) {
      const chem = Array.isArray(treatment.chemical) ? treatment.chemical.join(', ') : treatment.chemical;
      list.push(`Chemical: ${chem}`);
    }
    if (treatment.preventive) {
      const prev = Array.isArray(treatment.preventive) ? treatment.preventive.join(', ') : treatment.preventive;
      list.push(`Preventive: ${prev}`);
    }
    return list;
  }
  return [String(treatment)];
}

/**
 * Builds a plant analysis result when offline or when the Gemini API is unreachable.
 * 
 * Pipeline order:
 * preprocess -> custom model -> confidence gate -> knowledge base lookup -> Gemini (skipped if offline).
 * 
 * When on-device custom model is active:
 * - Shows banner: "Offline result from the on-device model. Lower accuracy for field photos."
 * - If top confidence is below gate threshold, condition is "Not sure".
 * - If KB matches, displays KB disease and treatment.
 * - If no KB match, displays model condition without invented treatment text.
 */
export function buildOfflinePlantResult(
  plantName: string,
  stage?: string,
  symptomsText?: string,
  classifierOutput?: ClassifierOutput,
  gateDecision?: GateDecision
): PlantAnalysisResult {
  const isCustom = classifierOutput?.isCustomPlantModelLoaded || false;
  const isBelowGate = classifierOutput?.isBelowGateThreshold || false;

  const offlineBannerText = isCustom
    ? 'Offline result from the on-device model. Lower accuracy for field photos.'
    : 'Offline guidance, lower accuracy.';

  // Top 3 predictions formatted for metadata
  const top3Predictions = classifierOutput?.top3Predictions
    ? classifierOutput.top3Predictions.map((p) => ({
        className: p.className,
        percentage: p.percentage ?? Math.round(p.probability * 100),
        probability: p.probability,
      }))
    : undefined;

  // 1. If below gate threshold, say "Not sure" instead of disease name
  if (isBelowGate) {
    return {
      condition: 'Not sure',
      confidence: Math.round((classifierOutput?.primaryPrediction.probability || 0) * 100),
      severity: 'Unknown',
      observations: [
        'Model confidence was below certainty threshold for reliable identification.',
        'Visual symptoms may be ambiguous, multi-pathogenic, or affected by field lighting.',
      ],
      possibleCauses: [],
      recommendedActions: [
        'Retake the photo in good, even outdoor daylight focused squarely on an individual leaf.',
        'Consult your local agricultural extension service (KVK) for direct field inspection.',
      ],
      prevention: [],
      uncertaintyNote:
        'The confidence of the on-device model was below the certainty threshold. Please retake the photo with better lighting or consult a local agricultural extension officer.',
      isOfflineGuidance: true,
      offlineBannerText,
      isBelowGateThreshold: true,
      classifierMetadata: classifierOutput
        ? {
            pipelineStage: 'offline_ondevice_model',
            modelName: classifierOutput.modelName,
            modelType: classifierOutput.modelType,
            isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
            candidateClass: isCustom ? classifierOutput.primaryPrediction.className : undefined,
            classifierProbability: classifierOutput.primaryPrediction.probability,
            top3Predictions,
            featureVectorLength: classifierOutput.featureVectorLength,
            qualityPassed: gateDecision ? gateDecision.passed : true,
            inferenceTimeMs: classifierOutput.inferenceTimeMs,
          }
        : undefined,
    };
  }

  // 2. Knowledge base lookup (match by crop and disease name)
  const matches = findKnowledgeMatches(plantName, stage, symptomsText);
  const topMatch = matches[0];

  // If match exists in knowledge base
  if (topMatch && topMatch.score >= 35) {
    const entry = topMatch.entry;
    const treatmentList = formatTreatmentToList(entry.treatment || entry.treatments);
    const symptomsList = Array.isArray(entry.symptoms)
      ? entry.symptoms
      : entry.symptoms
      ? [String(entry.symptoms)]
      : [];

    return {
      condition: isCustom ? classifierOutput?.primaryPrediction.className || entry.disease : entry.disease,
      confidence: Math.min(
        100,
        Math.max(
          40,
          Math.round((classifierOutput?.primaryPrediction.probability || 0.6) * 100)
        )
      ),
      severity: (entry.severity as any) || 'Moderate',
      observations: symptomsList.length > 0 ? symptomsList : ['Visual symptoms match reference disease entry.'],
      possibleCauses: entry.pathogen ? [`Pathogen: ${entry.pathogen}`] : [],
      recommendedActions:
        treatmentList.length > 0
          ? treatmentList
          : ['Consult local agricultural extension officer for specific treatment advice.'],
      prevention: Array.isArray(entry.prevention) ? entry.prevention : [],
      uncertaintyNote:
        'Offline result from on-device model. Consult local agricultural extension service for laboratory verification.',
      isOfflineGuidance: true,
      offlineBannerText,
      classifierMetadata: classifierOutput
        ? {
            pipelineStage: 'offline_ondevice_model',
            modelName: classifierOutput.modelName,
            modelType: classifierOutput.modelType,
            isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
            candidateClass: isCustom ? classifierOutput.primaryPrediction.className : undefined,
            classifierProbability: classifierOutput.primaryPrediction.probability,
            top3Predictions,
            featureVectorLength: classifierOutput.featureVectorLength,
            qualityPassed: gateDecision ? gateDecision.passed : true,
            inferenceTimeMs: classifierOutput.inferenceTimeMs,
          }
        : undefined,
    };
  }

  // 3. No match in knowledge base:
  // "show the model's condition without invented treatment text"
  const modelCondition = classifierOutput?.primaryPrediction.className || plantName || 'Unrecognized Condition';
  const NO_INVENTED_TREATMENT =
    'No specific reference treatments found in knowledge base. Consult a local agricultural extension officer.';

  return {
    condition: modelCondition,
    confidence: Math.round((classifierOutput?.primaryPrediction.probability || 0.5) * 100),
    severity: 'Moderate',
    observations: ['Identified by on-device plant pathology model.'],
    possibleCauses: [],
    recommendedActions: [NO_INVENTED_TREATMENT],
    prevention: [],
    uncertaintyNote:
      'Offline result from on-device model. Consult local agricultural extension service for laboratory verification.',
    isOfflineGuidance: true,
    offlineBannerText,
    classifierMetadata: classifierOutput
      ? {
          pipelineStage: 'offline_ondevice_model',
          modelName: classifierOutput.modelName,
          modelType: classifierOutput.modelType,
          isCustomPlantModelLoaded: classifierOutput.isCustomPlantModelLoaded,
          candidateClass: isCustom ? classifierOutput.primaryPrediction.className : undefined,
          classifierProbability: classifierOutput.primaryPrediction.probability,
          top3Predictions,
          featureVectorLength: classifierOutput.featureVectorLength,
          qualityPassed: gateDecision ? gateDecision.passed : true,
          inferenceTimeMs: classifierOutput.inferenceTimeMs,
        }
      : undefined,
  };
}
