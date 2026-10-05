/**
 * Gemini Explanation Engine Module
 * Connects to the secure server-side Gemini endpoint.
 * 
 * STRICT ARCHITECTURAL RULE:
 * Gemini NEVER inspects the image for diagnosis.
 * Gemini receives ONLY the structured plant health report produced by
 * MobileNetV3-Large and the Agricultural Knowledge Base.
 * It translates, summarizes, and produces natural farmer-friendly text and audio narration.
 */
import { PlantAnalysisResult } from './types';
import { Language } from '../../utils/i18n';

export async function requestGeminiExplanation(
  structuredReport: PlantAnalysisResult,
  language: Language
): Promise<PlantAnalysisResult> {
  try {
    const payload = {
      report: {
        condition: structuredReport.condition,
        state: structuredReport.state,
        confidence: structuredReport.confidence,
        confidenceTier: structuredReport.confidenceTier,
        severity: structuredReport.severity,
        observations: structuredReport.observations,
        possibleCauses: structuredReport.possibleCauses,
        recommendedActions: structuredReport.recommendedActions,
        prevention: structuredReport.prevention,
        uncertaintyNote: structuredReport.uncertaintyNote,
      },
      language,
    };

    const response = await fetch('/api/explain-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.info('Explanation service unavailable, using grounded local report.');
      return structuredReport;
    }

    const data = await response.json();

    return {
      ...structuredReport,
      summary: data.summary || structuredReport.summary,
      condition: data.localizedCondition || structuredReport.condition,
      observations: Array.isArray(data.localizedObservations) && data.localizedObservations.length > 0
        ? data.localizedObservations
        : structuredReport.observations,
      possibleCauses: Array.isArray(data.localizedCauses) && data.localizedCauses.length > 0
        ? data.localizedCauses
        : structuredReport.possibleCauses,
      recommendedActions: Array.isArray(data.localizedActions) && data.localizedActions.length > 0
        ? data.localizedActions
        : structuredReport.recommendedActions,
      prevention: Array.isArray(data.localizedPrevention) && data.localizedPrevention.length > 0
        ? data.localizedPrevention
        : structuredReport.prevention,
      uncertaintyNote: data.localizedUncertaintyNote || structuredReport.uncertaintyNote,
      audioNarration: data.audioNarration || structuredReport.audioNarration,
    };
  } catch (err) {
    console.info('Using grounded report directly without Gemini expansion:', err);
    return structuredReport;
  }
}

// Backward compatibility alias
export const requestGeminiGuidance = (
  _image: string,
  language: Language,
  _classifier: any,
  _gate: any,
  report?: PlantAnalysisResult
) => {
  if (report) {
    return requestGeminiExplanation(report, language);
  }
  throw new Error('Structured report required for Gemini explanation.');
};
