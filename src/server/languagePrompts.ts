export type SupportedLanguage = 'en' | 'ta' | 'te' | 'kn' | 'ml';
export const SupportedLanguage = class {};

export interface LanguageConfig {
  name: string;
  nativeName: string;
  instructionPrompt: string;
  messages: {
    unconfigured: string;
    overloaded: string;
    genericError: string;
    parseError: string;
    unknownCondition: string;
    defaultSafetyNote: string;
  };
}
export const LanguageConfig = class {};

export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    name: 'English',
    nativeName: 'English',
    instructionPrompt:
      '- Use clear, accessible, practical English that farmers and home gardeners can easily understand.',
    messages: {
      unconfigured:
        'AI diagnostic service is temporarily not configured. Please contact the administrator.',
      overloaded:
        'Plant diagnostic server is temporarily experiencing high traffic. Please wait a minute and scan again.',
      genericError:
        'Unable to analyze the leaf photograph. Please ensure a clear, well-lit photo and try again.',
      parseError:
        'The plant analysis result could not be processed. Please scan the leaf again.',
      unknownCondition: 'Unknown Condition',
      defaultSafetyNote:
        'This is a first-level AI health assessment. Consult your local agricultural extension service for definitive confirmation.',
    },
  },
  ta: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    instructionPrompt:
      '- Use simple, natural, spoken agricultural Tamil (தமிழ்) that Tamil Nadu farmers and rural growers can easily understand. For example: "தக்காளி இலை கருகல் நோய்" (Early Blight), "பாதிப்பு நிலை: மிதமானது", "வேப்ப எண்ணெய் தெளித்தல்" (Neem oil spray), etc.',
    messages: {
      unconfigured:
        'AI நோய் கண்டறியும் சேவை தற்போது கட்டமைக்கப்படவில்லை. தயவுசெய்து கணினி நிர்வாகியை தொடர்பு கொள்ளவும்.',
      overloaded:
        'தாவர நோய் கண்டறியும் சேவையில் தற்போது அதிக பணிச்சுமை உள்ளது. தயவுசெய்து 1 நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.',
      genericError:
        'தாவர இலையை பகுப்பாய்வு செய்ய முடியவில்லை. தயவுசெய்து நல்ல வெளிச்சத்தில் தெளிவான புகைப்படத்துடன் மீண்டும் முயற்சிக்கவும்.',
      parseError:
        'பகுப்பாய்வு முடிவை படிக்க முடியவில்லை. தயவுசெய்து மீண்டும் ஸ்கேன் செய்யவும்.',
      unknownCondition: 'தெரியாத நிலை',
      defaultSafetyNote:
        'இது முதற்கட்ட AI வழிகாட்டல் மட்டுமே. துல்லியமான உறுதிப்படுத்தலுக்கு உங்கள் அருகிலுள்ள வேளாண் விரிவாக்க மையத்தை அணுகவும்.',
    },
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    instructionPrompt:
      '- Use simple, natural, spoken agricultural Telugu (తెలుగు) that Andhra Pradesh and Telangana farmers and rural growers can easily understand. For example: "టమాటా ఆకు మాడు తెగులు" (Early Blight), "తీవ్రత: మధ్యస్థం", "వేప నూనె పిచికారీ" (Neem oil spray), etc.',
    messages: {
      unconfigured:
        'AI రోగ నిర్ధారణ సేవ ప్రస్తుతానికి అందుబాటులో లేదు. దయచేసి నిర్వాహకుడిని సంప్రదించండి.',
      overloaded:
        'సర్వర్‌లో తాత్కాలికంగా ఎక్కువ రద్దీ ఉంది. దయచేసి ఒక నిమిషం ఆగి మళ్లీ ప్రయత్నించండి.',
      genericError:
        'ఆకును విశ్లేషించడం సాధ్యం కాలేదు. దయచేసి మంచి వెలుతురులో స్పష్టమైన ఫోటో తీసి మళ్లీ ప్రయత్నించండి.',
      parseError:
        'విశ్లేషణ ఫలితాన్ని ప్రాసెస్ చేయలేకపోయాము. దయచేసి మళ్లీ స్కాన్ చేయండి.',
      unknownCondition: 'గుర్తించబడని సమస్య',
      defaultSafetyNote:
        'ఇది ప్రాథమిక AI సలహా మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం మీ సమీప వ్యవసాయ అధికారి లేదా కృషి విజ్ఞాన కేంద్రాన్ని సంప్రదించండి.',
    },
  },
  kn: {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    instructionPrompt:
      '- Use simple, natural, spoken agricultural Kannada (ಕನ್ನಡ) that Karnataka farmers and rural growers can easily understand. For example: "ಟೊಮೆಟೊ ಎಲೆ ಕರಕಲು ರೋಗ" (Early Blight), "ತೀವ್ರತೆ: ಮಧ್ಯಮ", "ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಣೆ" (Neem oil spray), etc.',
    messages: {
      unconfigured:
        'AI ರೋಗ ಪತ್ತೆ ಸೇವೆ ಸದ್ಯಕ್ಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿರ್ವಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      overloaded:
        'ಸರ್ವರ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ದಟ್ಟಣೆ ಇದೆ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      genericError:
        'ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾದ ಫೋಟೋದೊಂದಿಗೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      parseError:
        'ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
      unknownCondition: 'ತಿಳಿದಿರದ ರೋಗ',
      defaultSafetyNote:
        'ಇದು ಕೇವಲ ಪ್ರಾಥಮಿಕ AI ಮಾರ್ಗದರ್ಶನವಾಗಿದೆ. ನಿಖರ ಮಾಹಿತಿಗಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    },
  },
  ml: {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    instructionPrompt:
      '- Use simple, natural, spoken agricultural Malayalam (മലയാളം) that Kerala farmers and rural growers can easily understand. For example: "തക്കാളി ഇല കരിച്ചിൽ രോഗം" (Early Blight), "തീവ്രത: മിതമായത്", "വേപ്പെണ്ണ ലായനി തളിക്കൽ" (Neem oil spray), etc.',
    messages: {
      unconfigured:
        'AI രോഗനിർണയ സേവനം ഇപ്പോൾ ലഭ്യമല്ല. ദയവായി അഡ്മിനിസ്ട്രേറ്ററെ ബന്ധപ്പെടുക.',
      overloaded:
        'സെർവറിൽ താൽക്കാലികമായി ഉയർന്ന തിരക്കുണ്ട്. ദയവായി ഒരു മിനിറ്റിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.',
      genericError:
        'ഇല പരിശോധിക്കാൻ സാധിച്ചില്ല. ദയവായി വ്യക്തമായ ഫോട്ടോ സഹിതം വീണ്ടും ശ്രമിക്കുക.',
      parseError:
        'പരിശോധനാ ഫലം തയ്യാറാക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും സ്കാൻ ചെയ്യുക.',
      unknownCondition: 'തിരിച്ചറിയാനാകാത്ത രോഗം',
      defaultSafetyNote:
        'ഇത് പ്രാഥമിക AI മാർഗ്ഗനിർദ്ദേശം മാത്രമാണ്. കൃത്യമായ സ്ഥിരീകരണത്തിനായി നിങ്ങളുടെ അടുത്തുള്ള കൃഷി ഓഫീസറെ ബന്ധപ്പെടുക.',
    },
  },
};

export function validateLanguage(lang?: string): SupportedLanguage {
  if (lang) {
    const normalized = lang.toLowerCase().trim();
    if (normalized in LANGUAGE_CONFIGS) {
      return normalized as SupportedLanguage;
    }
  }
  return 'en';
}
