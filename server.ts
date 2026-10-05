import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  analyzePlantLeafWithGemini,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  type AnalyzePlantRequest,
} from './src/server/plantAnalyzer.ts';
import {
  handlePlantChatWithGemini,
  CHAT_MODEL,
  CHAT_FALLBACK_MODEL,
} from './src/server/plantChat.ts';
import {
  transcribeAudioWithGemini,
  TRANSCRIBE_MODEL,
} from './src/server/audioTranscriber.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

// 1. Limit JSON request body to 8 MB
app.use(express.json({ limit: '8mb' }));

// Handle body-parser payload limit and JSON syntax errors gracefully
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    const isTamil = req.body?.language === 'ta';
    return res.status(413).json({
      error: isTamil
        ? 'படத்தின் அளவு 8 MB-க்கு மேல் உள்ளது. தயவுசெய்து சிறிய படத்தை பதிவேற்றவும்.'
        : 'Uploaded image file is too large. Please select an image under 8 MB.',
    });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON request payload.',
    });
  }
  next(err);
});

// 2. Simple in-memory rate limiting per IP (30 scan requests per minute per IP)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests / minute

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRateLimits.entries()) {
    if (now > record.resetAt) {
      ipRateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
    req.ip ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const isTamil = req.body?.language === 'ta';
    return res.status(429).json({
      error: isTamil
        ? 'அதிகமான கோரிக்கைகள். தயவுசெய்து ஒரு நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.'
        : 'Too many scan requests. Please wait a minute before analyzing another leaf.',
    });
  }

  record.count++;
  next();
}

// 3. Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'PhytoScan Plant Health Assistant',
    uptimeSeconds: Math.round(process.uptime()),
    models: {
      primary: PRIMARY_MODEL,
      fallback: FALLBACK_MODEL,
      chat: CHAT_MODEL,
      chatFallback: CHAT_FALLBACK_MODEL,
      transcribe: TRANSCRIBE_MODEL,
    },
    timestamp: new Date().toISOString(),
  });
});

// 4. Plant Analysis Endpoint with Validation
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);

const SUPPORTED_LANGUAGES = new Set(['en', 'ta', 'te', 'kn', 'ml']);

app.post('/api/analyze-plant', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, language, classifierContext } = req.body || {};

    // Validate Language Code and default to English if unknown
    const effectiveLanguage =
      typeof language === 'string' && SUPPORTED_LANGUAGES.has(language.toLowerCase().trim())
        ? (language.toLowerCase().trim() as 'en' | 'ta' | 'te' | 'kn' | 'ml')
        : 'en';

    const isTamil = effectiveLanguage === 'ta';

    // A. Validate Image Requirement
    if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
      return res.status(400).json({
        error: isTamil
          ? 'தாவர இலை படம் தேவை. தயவுசெய்து கேமரா அல்லது கேலரி மூலம் இலையின் படத்தை தேர்ந்தெடுக்கவும்.'
          : 'A plant leaf photograph is required. Please capture or select a leaf photo.',
      });
    }

    // B. Detect and Validate MIME type
    let effectiveMime = (mimeType || '').toLowerCase().trim();
    if (imageBase64.startsWith('data:') && imageBase64.includes(';base64,')) {
      const extractedMime = imageBase64.substring(5, imageBase64.indexOf(';base64,')).toLowerCase().trim();
      if (extractedMime) {
        effectiveMime = extractedMime;
      }
    }

    if (!effectiveMime) {
      effectiveMime = 'image/jpeg';
    }

    if (!ALLOWED_MIME_TYPES.has(effectiveMime)) {
      return res.status(400).json({
        error: isTamil
          ? 'ஆதரிக்கப்படாத பட வடிவம். தயவுசெய்து JPEG, PNG, WEBP அல்லது SVG படங்களை பயன்படுத்தவும்.'
          : 'Unsupported image format. Please upload a JPEG, PNG, WEBP, or SVG image.',
      });
    }

    const payload: AnalyzePlantRequest = {
      imageBase64,
      mimeType: effectiveMime,
      language: effectiveLanguage,
      classifierContext,
    };

    const result = await analyzePlantLeafWithGemini(payload);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Server /api/analyze-plant error:', err?.message || err);
    
    // Return clean farmer-facing message without internal traces
    const clientMessage =
      err?.message && !err.message.includes('at ')
        ? err.message
        : 'Plant health analysis failed. Please verify your connection and try scanning again.';

    return res.status(500).json({
      error: clientMessage,
    });
  }
});

// 5. Multi-Turn Agronomist Chat Endpoint
app.post('/api/chat-plant', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { messages, reportContext, language } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Conversation messages array is required.',
      });
    }

    const effectiveLanguage =
      typeof language === 'string' && SUPPORTED_LANGUAGES.has(language.toLowerCase().trim())
        ? (language.toLowerCase().trim() as 'en' | 'ta' | 'te' | 'kn' | 'ml')
        : 'en';

    const response = await handlePlantChatWithGemini({
      messages,
      reportContext,
      language: effectiveLanguage,
    });

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Server /api/chat-plant error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'Chat service encountered an error. Please try again.',
    });
  }
});

// 6. Speech-to-Text Audio Transcription Endpoint
app.post('/api/transcribe-audio', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType, language } = req.body || {};

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({
        error: 'Audio data is required for transcription.',
      });
    }

    const response = await transcribeAudioWithGemini({
      audioBase64,
      mimeType,
      language,
    });

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Server /api/transcribe-audio error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'Audio transcription failed. Please try speaking again.',
    });
  }
});

// 7. Development (Vite Middleware) vs Production (Static Serving)
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `PhytoScan server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize PhytoScan server:', err);
  process.exit(1);
});
