import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';

export interface TranscribeAudioRequest {
  audioBase64: string;
  mimeType?: string;
  language?: string;
}

export interface TranscribeAudioResponse {
  text: string;
  model: string;
}

export const TranscribeAudioRequest = class {};
export const TranscribeAudioResponse = class {};

export async function transcribeAudioWithGemini(
  reqData: TranscribeAudioRequest
): Promise<TranscribeAudioResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  let rawBase64 = reqData.audioBase64 || '';
  let effectiveMime = reqData.mimeType || 'audio/webm';

  if (rawBase64.startsWith('data:') && rawBase64.includes(';base64,')) {
    const parts = rawBase64.split(';base64,');
    effectiveMime = parts[0].replace('data:', '') || effectiveMime;
    rawBase64 = parts[1];
  }

  if (!rawBase64 || rawBase64.trim().length === 0) {
    throw new Error('Audio data is missing or empty.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const audioPart = {
    inlineData: {
      mimeType: effectiveMime,
      data: rawBase64,
    },
  };

  const response = await ai.models.generateContent({
    model: TRANSCRIBE_MODEL,
    contents: {
      parts: [
        audioPart,
        {
          text: 'Transcribe this spoken question accurately into text in its original spoken language (e.g. English, Tamil, Telugu, Kannada, or Malayalam). Output only the transcribed speech with proper punctuation, without adding quotes or conversational commentary.',
        },
      ],
    },
  });

  const transcribedText = (response.text || '').trim();

  return {
    text: transcribedText,
    model: TRANSCRIBE_MODEL,
  };
}
