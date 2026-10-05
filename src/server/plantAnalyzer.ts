import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { findKnowledgeMatches } from '../utils/kbSearch.ts';
import {
  type SupportedLanguage,
  type LanguageConfig,
  LANGUAGE_CONFIGS,
  validateLanguage,
} from './languagePrompts.ts';

export type {
  SupportedLanguage,
  LanguageConfig,
};
export {
  LANGUAGE_CONFIGS,
  validateLanguage,
};

dotenv.config();

export const PRIMARY_MODEL = 'gemini-3.8-flash';
export const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

export interface AnalyzePlantRequest {
  imageBase64: string; // base64 string without data URL prefix or with it
  mimeType?: string;
  language?: SupportedLanguage | string;
  classifierContext?: {
    candidateClass?: string;
    classifierConfidence?: number;
    modelType?: string;
    isCustomPlantModelLoaded?: boolean;
    featureVectorLength?: number;
    notes?: string;
    confidenceTier?: string;
  };
}

export interface PlantAnalysisResponse {
  condition: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None' | 'Unknown' | string;
  observations: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  prevention: string[];
  uncertaintyNote: string;
}

export const AnalyzePlantRequest = class {};
export const PlantAnalysisResponse = class {};

/**
 * Checks if an error is a transient rate limit (429) or temporary server overload (503).
 */
export function isTransientError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.statusCode || err.response?.status || 0;
  const msg = (err.message || '').toLowerCase();
  return (
    status === 429 ||
    status === 503 ||
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded')
  );
}

/**
 * Executes a call to the Gemini API with exponential backoff on 429 / 503 errors.
 */
async function callGeminiWithExponentialBackoff(
  ai: GoogleGenAI,
  modelName: string,
  contents: any[],
  systemInstruction: string,
  maxAttempts: number = 2
): Promise<string> {
  let lastError: any = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      if (text) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      const isTransient = isTransientError(err);
      if (isTransient && attempt < maxAttempts - 1) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error(`No response received from model ${modelName}`);
}

export async function analyzePlantLeafWithGemini(
  reqData: AnalyzePlantRequest
): Promise<PlantAnalysisResponse> {
  const validLang = validateLanguage(reqData.language);
  const langConfig = LANGUAGE_CONFIGS[validLang];
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(langConfig.messages.unconfigured);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Clean base64 data and detect mime type
  let rawBase64 = reqData.imageBase64;
  let detectedMime = reqData.mimeType || 'image/jpeg';
  if (rawBase64.includes(';base64,')) {
    const parts = rawBase64.split(';base64,');
    detectedMime = parts[0].replace('data:', '') || detectedMime;
    rawBase64 = parts[1];
  }

  let classifierInfo = 'No preliminary classifier priors available.';
  let candidatePlant = '';
  let candidateCondition = '';

  if (reqData.classifierContext) {
    const {
      candidateClass,
      classifierConfidence,
      isCustomPlantModelLoaded,
      featureVectorLength,
      notes,
    } = reqData.classifierContext;

    if (candidateClass) {
      if (candidateClass.includes('___')) {
        const parts = candidateClass.split('___');
        candidatePlant = parts[0].replace(/_/g, ' ');
        candidateCondition = parts[1].replace(/_/g, ' ');
      } else {
        candidatePlant = candidateClass;
      }
    }

    if (isCustomPlantModelLoaded) {
      classifierInfo = `MobileNetV2 Fine-Tuned Plant Pathology Model output: Predicted condition candidate: "${candidateClass}" with ${Math.round((classifierConfidence || 0) * 100)}% probability (1280-dim feature vector). Gate status: ${notes || 'Normal'}. Verify leaf symptoms visually and generate comprehensive guidance.`;
    } else {
      classifierInfo = `MobileNetV2 Backbone Inference (TensorFlow.js, 1280-dim feature vector, feature length: ${featureVectorLength || 1280}): Top backbone prediction: "${candidateClass}" (${Math.round((classifierConfidence || 0) * 100)}% confidence). Standard ImageNet MobileNetV2 is an image feature/backbone classifier, not a plant-disease classifier. Fine-tuned plant pathology weights are pending connection. Gate evaluation: ${notes || 'Proceed with visual synthesis'}. Visually inspect the leaf for symptoms, identify the plant health condition, and provide first-level guidance.`;
    }
  }

  // Look up top KB matches for context (KB remains strictly in English)
  let kbContextBlock = '';
  if (candidatePlant || candidateCondition) {
    const kbMatches = findKnowledgeMatches(candidatePlant, undefined, candidateCondition);
    if (kbMatches.length > 0) {
      const topMatches = kbMatches.slice(0, 3);
      kbContextBlock = `\n\nKNOWLEDGE BASE REFERENCE CANDIDATES (Original Database Records in English):\n` +
        topMatches.map((m, idx) => {
          const e = m.entry;
          const symptomsText = Array.isArray(e.symptoms) ? e.symptoms.join('; ') : e.symptoms;
          const treatText = e.treatment ? JSON.stringify(e.treatment) : (e.treatments ? JSON.stringify(e.treatments) : 'N/A');
          return `[Reference ${idx + 1} - Score ${m.score}]
Crop/Plant: ${e.plant}
Disease: ${e.disease}
Pathogen: ${e.pathogen || 'N/A'}
Symptoms: ${symptomsText || 'N/A'}
Treatment: ${treatText}`;
        }).join('\n\n') +
        `\n\nCRITICAL KNOWLEDGE BASE USAGE RULE:
Use these reference knowledge base entries ONLY when they fit what you actually visually observe in the photograph. If the visual symptoms in the image differ from the reference knowledge base entries, rely strictly on your visual analysis of the photograph. Do NOT force a match.`;
    }
  }

  const systemInstruction = `You are PhytoScan, an expert first-level agricultural plant-health and leaf diagnosis assistant developed for the AGRIMIND team.
Your role is to interpret the plant leaf photograph along with the real MobileNetV2 classifier backbone telemetry to provide an understandable, honest, and actionable plant-health assessment.

CRITICAL DIAGNOSTIC GUIDELINES:
1. Treat your output as FIRST-LEVEL ASSISTANCE, not a definitive professional laboratory diagnosis.
2. DO NOT force a diagnosis if the image is blurry, out of focus, lacks a clear leaf, has poor lighting, or is ambiguous.
3. If image quality is insufficient, explicitly state this in "observations" and "uncertaintyNote", set "condition" to "Inconclusive / Insufficient Image Quality" (translated into ${langConfig.name}), set "confidence" low (e.g. 15-35%), and recommend retaking with good lighting.
4. DO NOT invent certainty. If confidence is below 60%, recommend retaking the photo or consulting a local agricultural extension officer / KVK expert.
5. If the leaf appears healthy with no visible disease spots, blights, or pests, identify it as "Healthy Plant / No Apparent Disease" (translated into ${langConfig.name}), with severity "None".
6. KNOWLEDGE BASE REFERENCES: When reference knowledge base entries are provided, use them ONLY when they fit what you actually see in the photo. If what you see in the photo differs, ignore the references and describe what is visibly present.
7. TARGET LANGUAGE & FARMER-FRIENDLY TONE:
   - Output ALL text fields strictly in ${langConfig.name} (${langConfig.nativeName}).
   ${langConfig.instructionPrompt}
   - Reference entries from the database are in English. Translate the condition name, observations, causes, actions, and prevention naturally into ${langConfig.name} so the farmer can immediately understand what is happening and what to do. You may include the English disease name in parentheses next to the local name for clarity (e.g., "టమాటా ఆకు మాడు తెగులు (Tomato Early Blight)").

OUTPUT FORMAT:
Respond with ONLY a valid, parseable JSON object matching this exact schema:
{
  "condition": "Name of the plant condition or disease in ${langConfig.name}",
  "confidence": 88, // Integer number between 0 and 100
  "severity": "Mild | Moderate | Severe | None | Unknown",
  "observations": [
    "Specific visual symptom 1 seen on the leaf in ${langConfig.name}",
    "Specific visual symptom 2 in ${langConfig.name}"
  ],
  "possibleCauses": [
    "Underlying cause 1 in ${langConfig.name}",
    "Underlying cause 2 in ${langConfig.name}"
  ],
  "recommendedActions": [
    "Immediate practical action 1 in ${langConfig.name}",
    "Immediate practical action 2 in ${langConfig.name}"
  ],
  "prevention": [
    "Long-term prevention method 1 in ${langConfig.name}",
    "Long-term prevention method 2 in ${langConfig.name}"
  ],
  "uncertaintyNote": "Safety & guidance note in ${langConfig.name} advising consultation with local agricultural extension if symptoms persist."
}`;

  const promptText = `Please analyze this leaf photograph for plant diseases, nutrient deficiencies, or pests.
${classifierInfo}${kbContextBlock}
Provide the diagnostic assessment strictly according to the required JSON schema in ${langConfig.name} (${langConfig.nativeName}).`;

  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: detectedMime,
            data: rawBase64,
          },
        },
        { text: promptText },
      ],
    },
  ];

  let responseText = '';
  let modelUsed = PRIMARY_MODEL;

  // 1. Try Primary Model (gemini-3.8-flash) with exponential backoff on 429/503
  try {
    responseText = await callGeminiWithExponentialBackoff(
      ai,
      PRIMARY_MODEL,
      contents,
      systemInstruction,
      2
    );
  } catch (primaryError: any) {
    console.warn(
      `Primary model (${PRIMARY_MODEL}) failed. Falling back to (${FALLBACK_MODEL}). Cause:`,
      primaryError?.message || primaryError
    );

    // 2. Fallback Model (gemini-3.1-flash-lite) with exponential backoff
    try {
      modelUsed = FALLBACK_MODEL;
      responseText = await callGeminiWithExponentialBackoff(
        ai,
        FALLBACK_MODEL,
        contents,
        systemInstruction,
        2
      );
    } catch (fallbackError: any) {
      console.error(
        `Both primary (${PRIMARY_MODEL}) and fallback (${FALLBACK_MODEL}) models failed:`,
        fallbackError
      );

      const isTransient =
        isTransientError(fallbackError) || isTransientError(primaryError);
      if (isTransient) {
        throw new Error(langConfig.messages.overloaded);
      }

      throw new Error(langConfig.messages.genericError);
    }
  }

  try {
    const parsed = JSON.parse(responseText) as PlantAnalysisResponse;
    return {
      condition: parsed.condition || langConfig.messages.unknownCondition,
      confidence:
        typeof parsed.confidence === 'number'
          ? Math.min(100, Math.max(0, Math.round(parsed.confidence)))
          : 75,
      severity: parsed.severity || 'Moderate',
      observations: Array.isArray(parsed.observations) ? parsed.observations : [],
      possibleCauses: Array.isArray(parsed.possibleCauses) ? parsed.possibleCauses : [],
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? parsed.recommendedActions
        : [],
      prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
      uncertaintyNote:
        parsed.uncertaintyNote || langConfig.messages.defaultSafetyNote,
    };
  } catch (parseErr) {
    console.error(`Failed to parse ${modelUsed} JSON output:`, responseText, parseErr);
    throw new Error(langConfig.messages.parseError);
  }
}
