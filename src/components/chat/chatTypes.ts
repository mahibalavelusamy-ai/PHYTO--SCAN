import { Language } from '../../utils/i18n.ts';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export const SUGGESTED_PROMPTS: Record<Language, string[]> = {
  en: [
    'What organic remedies work best for this?',
    'How do I prevent this from spreading?',
    'What is the recommended spraying interval?',
    'Is the harvested yield safe for consumption?',
  ],
  ta: [
    'இதற்கு சிறந்த இயற்கை தீர்வு என்ன?',
    'இது மற்ற பயிர்களுக்கு பரவுவதை தடுப்பது எப்படி?',
    'மருந்து தெளிக்கும் இடைவெளி என்ன?',
    'அறுவடை செய்த பயிரை உண்பது பாதுகாப்பானதா?',
  ],
  te: [
    'దీనికి ఉత్తమ సహజ నివారణ ఏమిటి?',
    'ఇది ఇతర పంటలకు వ్యాపించకుండా ఎలా నిరోధించాలి?',
    'మందులు పిచికారీ చేసే వ్యవధి ఎంత?',
    'దిగుబడి తినుటకు సురక్షితమేనా?',
  ],
  kn: [
    'ಇದಕ್ಕೆ ಉತ್ತಮ ಸಾವಯವ ಪರಿಹಾರ ಯಾವುದು?',
    'ಇದು ಇತರ ಬೆಳೆಗಳಿಗೆ ಹರಡದಂತೆ ತಡೆಯುವುದು ಹೇಗೆ?',
    'ಔಷಧಿ ಸಿಂಪಡಿಸುವ ಕಾಲಾವಧಿ ಏನು?',
    'ಕೊಯ್ಲು ಮಾಡಿದ ಇಳುವರಿ ಬಳಕೆಗೆ ಸುರಕ್ಷಿತವೇ?',
  ],
  ml: [
    'ഇതിന് ഏറ്റവും അനുയോജ്യമായ ജൈവ പ്രതിവിധി എന്താണ്?',
    'ഇത് മറ്റ് ചെടികളിലേക്ക് പടരുന്നത് എങ്ങനെ തടയാം?',
    'മരുന്ന് തളിക്കേണ്ട ഇടവേള എത്രയാണ്?',
    'വിളവെടുത്ത ഉൽപ്പന്നങ്ങൾ ഉപയോഗിക്കാൻ സുരക്ഷിതമാണോ?',
  ],
};

export const INITIAL_GREETINGS: Record<Language, (crop: string, condition: string) => string> = {
  en: (crop, condition) =>
    `Hello! I am your Agronomist AI. I have reviewed your report for ${crop} showing ${condition}. You can ask me anything about treatment applications, organic alternatives, chemical dosages, or weather precautions. Speak or type below!`,
  ta: (crop, condition) =>
    `வணக்கம்! நான் உங்கள் வேளாண்மை நிபுணர் AI. உங்கள் ${crop} பயிரில் உள்ள ${condition} பற்றிய அறிக்கையை ஆய்வு செய்துள்ளேன். சிகிச்சை, இயற்கை உரங்கள் அல்லது பாதுகாப்பு குறித்து எதையும் கேளுங்கள்!`,
  te: (crop, condition) =>
    `నమస్కారం! నేను మీ అగ్రోనమిస్ట్ AI. మీ ${crop} పంటలో ${condition} నివేదికను పరిశీలించాను. చికిత్సలు, సహజ పద్ధతులు లేదా రక్షణ చర్యల గురించి ఏదైనా అడగండి!`,
  kn: (crop, condition) =>
    `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ತಜ್ಞ AI. ನಿಮ್ಮ ${crop} ಬೆಳೆಯ ${condition} ಕುರಿತ ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ಚಿಕಿತ್ಸೆ ಮತ್ತು ರಕ್ಷಣಾ ಕ್ರಮಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ!`,
  ml: (crop, condition) =>
    `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കാർഷിക വിദഗ്ദ്ധൻ AI. നിങ്ങളുടെ ${crop} വിളയിലെ ${condition} സംബന്ധിച്ച റിപ്പോർട്ട് പരിശോധിച്ചു. ചികിത്സകളെക്കുറിച്ചോ മുൻകരുതലുകളെക്കുറിച്ചോ എന്തും ചോദിക്കാം!`,
};
