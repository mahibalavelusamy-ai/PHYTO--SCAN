import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  type SupportedLanguage,
  LANGUAGE_CONFIGS,
  validateLanguage,
} from './languagePrompts.ts';

dotenv.config();

export const CHAT_MODEL = 'gemini-3.5-flash';
export const CHAT_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ReportContext {
  crop?: string;
  condition?: string;
  confidence?: number;
  severity?: string;
  observations?: string[];
  recommendedActions?: string[];
  prevention?: string[];
  uncertaintyNote?: string;
}

export interface PlantChatRequest {
  messages: ChatMessage[];
  reportContext?: ReportContext;
  language?: SupportedLanguage | string;
}

export interface PlantChatResponse {
  reply: string;
  model: string;
}

export const ChatMessage = class {};
export const ReportContext = class {};
export const PlantChatRequest = class {};
export const PlantChatResponse = class {};

export async function handlePlantChatWithGemini(
  reqData: PlantChatRequest
): Promise<PlantChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const validLang = validateLanguage(reqData.language);
  const langConfig = LANGUAGE_CONFIGS[validLang];

  const report = reqData.reportContext || {};
  const cropName = report.crop || 'the plant';
  const conditionName = report.condition || 'the detected condition';
  const confidence = report.confidence ? `${report.confidence}%` : 'unspecified';
  const severity = report.severity || 'Moderate';
  const obs = report.observations?.length ? report.observations.join('; ') : 'Visual leaf symptoms';
  const actions = report.recommendedActions?.length ? report.recommendedActions.join('; ') : 'Standard treatment';
  const prev = report.prevention?.length ? report.prevention.join('; ') : 'Crop hygiene';

  const systemInstruction = `You are PhytoScan Agronomist AI — an expert agricultural extension officer and senior plant pathologist.
You are directly advising a farmer who is reviewing an active crop health diagnosis report for their farm.

ACTIVE CROP REPORT CONTEXT:
- Target Crop: ${cropName}
- Diagnosed Health Condition: ${conditionName}
- Diagnostic Confidence: ${confidence}
- Disease Severity: ${severity}
- Observed Leaf Symptoms: ${obs}
- Prescribed Initial Treatments: ${actions}
- Recommended Prevention: ${prev}

ROLE & BEHAVIORAL GUIDELINES:
1. Ground your answers in the active crop disease report above. Provide practical, farmer-friendly guidance on treatment application, dosage, organic alternatives, chemical safety, weather precautions, and yield recovery.
2. Tone: Helpful, empathetic, actionable, and encouraging. Avoid overly dense academic jargon without practical explanation.
3. Language: Respond fluently and naturally in ${langConfig.name} (${langConfig.nativeName}).
4. Safety & Stewardship: Emphasize safe handling of agricultural inputs, protective gear, withholding periods before harvest, and consulting local Krishi Vigyan Kendra (KVK) or extension specialists for severe field outbreaks.
5. If the user asks something completely unrelated to agriculture or plants, gently redirect them back to their crop health report.`;

  // Format messages into Google GenAI contents
  const contents = reqData.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  // If no user messages provided, default greeting prompt
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [
        {
          text: `Hello, I just received the diagnosis report for my ${cropName} showing ${conditionName}. What should I do first?`,
        },
      ],
    });
  }

  let chosenModel = CHAT_MODEL;
  try {
    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = (response.text || '').trim();
    if (!reply) {
      throw new Error('Empty response received from Gemini chat model.');
    }

    return {
      reply,
      model: CHAT_MODEL,
    };
  } catch (err: any) {
    console.info(`Chat model ${CHAT_MODEL} unavailable (${err?.status || err?.message}), falling back to ${CHAT_FALLBACK_MODEL}...`);
    chosenModel = CHAT_FALLBACK_MODEL;

    const fallbackResponse = await ai.models.generateContent({
      model: CHAT_FALLBACK_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = (fallbackResponse.text || '').trim();
    if (!reply) {
      throw new Error('Chat service temporarily unavailable. Please retry in a moment.');
    }

    return {
      reply,
      model: CHAT_FALLBACK_MODEL,
    };
  }
}
