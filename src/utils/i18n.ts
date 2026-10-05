export type Language = 'en' | 'ta' | 'te' | 'kn' | 'ml';

export interface Translations {
  tagline: string;
  navHome: string;
  navHistory: string;
  navArchitecture: string;
  heroTitle: string;
  heroSubtitle: string;
  takePhoto: string;
  uploadImage: string;
  bestResultsNote: string;
  trySampleLeaves: string;
  selectedImage: string;
  removeReselect: string;
  analyzePlant: string;
  analyzingPlant: string;
  resultsTitle: string;
  possibleCondition: string;
  confidence: string;
  severity: string;
  whatWeObserved: string;
  possibleCauses: string;
  whatYouCanDo: string;
  prevention: string;
  safetyNoteTitle: string;
  savedToHistory: string;
  savingToHistory: string;
  scanAnotherPlant: string;
  historyTitle: string;
  historySubtitle: string;
  noScansYet: string;
  noScansSubtext: string;
  viewCompleteAnalysis: string;
  deleteScan: string;
  close: string;
  cameraTitle: string;
  capturePhoto: string;
  switchCamera: string;
  cancel: string;
  cameraPermissionError: string;
  signIn: string;
  signOut: string;
  guestUser: string;
  pipelineInfoTitle: string;
  pipelineBadge: string;
  severityMild: string;
  severityModerate: string;
  severitySevere: string;
  severityNone: string;
  severityUnknown: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    tagline: 'Scan. Diagnose. Act early.',
    navHome: 'Home',
    navHistory: 'Scan History',
    navArchitecture: 'AI Pipeline',
    heroTitle: "Understand what's wrong with your plant.",
    heroSubtitle:
      'Take a clear photo of a leaf and get an AI-assisted plant-health assessment with practical next steps.',
    takePhoto: 'Take Photo',
    uploadImage: 'Upload Image',
    bestResultsNote:
      'For best results, use a clear, well-lit photograph of the affected leaf.',
    trySampleLeaves: 'Or try sample diseased leaves:',
    selectedImage: 'Selected Leaf Photograph',
    removeReselect: 'Remove / Change Photo',
    analyzePlant: 'Analyze Plant Leaf',
    analyzingPlant: 'Analyzing Leaf Symptoms...',
    resultsTitle: 'Plant Health Result',
    possibleCondition: 'Possible Condition',
    confidence: 'Confidence',
    severity: 'Severity',
    whatWeObserved: 'What the AI observed',
    possibleCauses: 'Possible Causes',
    whatYouCanDo: 'What you can do (Recommended Actions)',
    prevention: 'Prevention Regimen',
    safetyNoteTitle: 'First-Level Guidance & Uncertainty Note',
    savedToHistory: 'Saved to Scan History',
    savingToHistory: 'Saving to Firebase...',
    scanAnotherPlant: 'Scan Another Plant',
    historyTitle: 'Your Scan History',
    historySubtitle:
      'All previous plant-health assessments securely stored in Firestore.',
    noScansYet: 'No previous scans found',
    noScansSubtext:
      'Take or upload a photo of an affected leaf to start diagnosing plant health.',
    viewCompleteAnalysis: 'View Complete Analysis',
    deleteScan: 'Delete',
    close: 'Close',
    cameraTitle: 'Take Plant Leaf Photo',
    capturePhoto: 'Capture Photo',
    switchCamera: 'Switch Camera',
    cancel: 'Cancel',
    cameraPermissionError:
      'Camera access was denied or is not supported. Please upload an image file instead.',
    signIn: 'Sign In / Account',
    signOut: 'Sign Out',
    guestUser: 'Guest Farmer',
    pipelineInfoTitle: 'Modular MobileNetV2 + Gemini Architecture',
    pipelineBadge: 'MobileNetV2 + Gemini Pipeline',
    severityMild: 'Mild',
    severityModerate: 'Moderate',
    severitySevere: 'Severe',
    severityNone: 'Healthy (None)',
    severityUnknown: 'Uncertain',
  },
  ta: {
    tagline: 'ஸ்கேன் செய்க. கண்டறிக. உடனே தீர்வு காண்க.',
    navHome: 'முகப்பு',
    navHistory: 'முந்தைய ஸ்கேன்கள்',
    navArchitecture: 'AI கட்டமைப்பு',
    heroTitle: 'உங்கள் பயிருக்கு என்ன பிரச்சனை என்பதை அறிந்து கொள்ளுங்கள்.',
    heroSubtitle:
      'பாதிக்கப்பட்ட இலையின் தெளிவான படத்தை எடுத்து, உடனடி AI ஆலோசனை மற்றும் எளிய நடைமுறைத் தீர்வு முறைகளைப் பெறுங்கள்.',
    takePhoto: 'புகைப்படம் எடுங்கள்',
    uploadImage: 'படம் பதிவேற்றவும்',
    bestResultsNote:
      'சிறந்த முடிவுக்கு, பாதிக்கப்பட்ட இலையை நல்ல வெளிச்சத்தில் தெளிவாக புகைப்படம் எடுக்கவும்.',
    trySampleLeaves: 'மாதிரி இலைகளை சோதிக்க:',
    selectedImage: 'தேர்ந்தெடுக்கப்பட்ட இலை புகைப்படம்',
    removeReselect: 'மாற்றுக / நீக்குக',
    analyzePlant: 'பயிரை ஆய்வு செய்க',
    analyzingPlant: 'இலை அறிகுறிகள் ஆய்வு செய்யப்படுகிறது...',
    resultsTitle: 'பயிர் சுகாதார ஆய்வு முடிவு',
    possibleCondition: 'உத்தேச பாதிப்பு / நோய்',
    confidence: 'நம்பிக்கை அளவு',
    severity: 'பாதிப்பு நிலை',
    whatWeObserved: 'AI கவனித்த அறிகுறிகள்',
    possibleCauses: 'சாத்தியமான காரணங்கள்',
    whatYouCanDo: 'நீங்கள் செய்ய வேண்டியவை (உடனடி தீர்வுகள்)',
    prevention: 'எதிர்கால தடுப்பு முறைகள்',
    safetyNoteTitle: 'பாதுகாப்பு & முதற்கட்ட வழிகாட்டல் குறிப்பு',
    savedToHistory: 'வரலாற்றில் சேமிக்கப்பட்டது',
    savingToHistory: 'Firebase-ல் சேமிக்கப்படுகிறது...',
    scanAnotherPlant: 'மற்றொரு பயிரை ஸ்கேன் செய்க',
    historyTitle: 'உங்கள் முந்தைய ஸ்கேன்கள்',
    historySubtitle:
      'Firestore தரவுத்தளத்தில் பாதுகாப்பாக சேமிக்கப்பட்ட முந்தைய பயிர் ஆய்வுகள்.',
    noScansYet: 'முந்தைய ஸ்கேன்கள் எதுவும் இல்லை',
    noScansSubtext:
      'பயிரின் இலையை படம் எடுத்து அல்லது பதிவேற்றி உடனடியாக நோய் கண்டறியுங்கள்.',
    viewCompleteAnalysis: 'முழு அறிக்கையைக் காண்க',
    deleteScan: 'நீக்கு',
    close: 'மூடுக',
    cameraTitle: 'இலையை புகைப்படம் எடுக்கவும்',
    capturePhoto: 'படம் எடு',
    switchCamera: 'கேமராவை மாற்று',
    cancel: 'ரத்து செய்',
    cameraPermissionError:
      'கேமரா அணுகல் கிடைக்கவில்லை. படக்கோப்பை நேரடியாகப் பதிவேற்றவும்.',
    signIn: 'உள்நுழைக / கணக்கு',
    signOut: 'வெளியேறு',
    guestUser: 'விவசாயி (விருந்தினர்)',
    pipelineInfoTitle: 'MobileNetV2 + Gemini AI கட்டமைப்பு',
    pipelineBadge: 'MobileNetV2 + Gemini ஒருங்கிணைப்பு',
    severityMild: 'குறைவானது',
    severityModerate: 'மிதமானது',
    severitySevere: 'தீவிரமானது',
    severityNone: 'ஆரோக்கியமானது (பாதிப்பில்லை)',
    severityUnknown: 'தெரியவில்லை',
  },
  te: {
    tagline: 'స్కాన్ చేయండి. గుర్తించండి. త్వరగా నివారించండి.',
    navHome: 'హోమ్',
    navHistory: 'గత స్కాన్లు',
    navArchitecture: 'AI విధానం',
    heroTitle: 'మీ పంటకు ఏమి సమస్య వచ్చిందో సులభంగా తెలుసుకోండి.',
    heroSubtitle:
      'బాధిత ఆకు స్పష్టమైన ఫోటో తీయండి. AI సాయంతో రోగాన్ని గుర్తించి, తదుపరి చేయాల్సిన సులభమైన పనులను తెలుసుకోండి.',
    takePhoto: 'ఫోటో తీయండి',
    uploadImage: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    bestResultsNote:
      'మంచి ఫలితాల కోసం, మంచి వెలుతురులో రోగం ఉన్న ఆకు స్పష్టమైన ఫోటో తీయండి.',
    trySampleLeaves: 'లేదా నమూనా ఆకులతో పరీక్షించండి:',
    selectedImage: 'ఎంచుకున్న ఆకు ఫోటో',
    removeReselect: 'మార్చండి / తొలగించండి',
    analyzePlant: 'ఆకును పరీక్షించండి',
    analyzingPlant: 'ఆకు లక్షణాలను పరిశీలిస్తోంది...',
    resultsTitle: 'పంట ఆరోగ్య ఫలితం',
    possibleCondition: 'సోకిన వ్యాధి / సమస్య',
    confidence: 'ఖచ్చితత్వ అంచనా',
    severity: 'తీవ్రత',
    whatWeObserved: 'AI గుర్తించిన లక్షణాలు',
    possibleCauses: 'రోగ కారకాలు',
    whatYouCanDo: 'మీరు చేయాల్సిన పనులు (నివారణ చర్యలు)',
    prevention: 'భవిష్యత్తు జాగ్రత్తలు',
    safetyNoteTitle: 'ప్రాథమిక సమాచారం & హెచ్చరిక',
    savedToHistory: 'చరిత్రలో భద్రపరిచారు',
    savingToHistory: 'భద్రపరుస్తోంది...',
    scanAnotherPlant: 'మరో మొక్కను స్కాన్ చేయండి',
    historyTitle: 'మీ గత స్కాన్ల వివరాలు',
    historySubtitle:
      'మీరు గతంలో చేసిన పంట ఆరోగ్య పరీక్షలన్నీ ఇక్కడ సురక్షితంగా ఉంటాయి.',
    noScansYet: 'ఇంతవరకు ఏ స్కాన్లు లేవు',
    noScansSubtext:
      'రోగం ఉన్న ఆకును ఫోటో తీసి లేదా అప్‌లోడ్ చేసి పరీక్ష మొదలుపెట్టండి.',
    viewCompleteAnalysis: 'పూర్తి వివరాలు చూడండి',
    deleteScan: 'తొలగించు',
    close: 'మూసివేయి',
    cameraTitle: 'మొక్క ఆకు ఫోటో తీయండి',
    capturePhoto: 'ఫోటో క్లిక్ చేయండి',
    switchCamera: 'కెమెరా మార్చండి',
    cancel: 'రద్దు చేయి',
    cameraPermissionError:
      'కెమెరా అనుమతి లభించలేదు. దయచేసి గ్యాలరీ నుండి ఫోటోను అప్‌లోడ్ చేయండి.',
    signIn: 'లాగిన్ / ఖాతా',
    signOut: 'లాగ్ అవుట్',
    guestUser: 'రైతు (అతిథి)',
    pipelineInfoTitle: 'MobileNetV2 + Gemini AI సాంకేతికత',
    pipelineBadge: 'MobileNetV2 + Gemini వ్యవస్థ',
    severityMild: 'స్వల్పం',
    severityModerate: 'మధ్యస్థం',
    severitySevere: 'తీవ్రమైనది',
    severityNone: 'ఆరోగ్యంగా ఉంది (బాధ లేదు)',
    severityUnknown: 'స్పష్టత లేదు',
  },
  kn: {
    tagline: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ. ರೋಗ ಪತ್ತೆಹಚ್ಚಿ. ಬೇಗ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಿ.',
    navHome: 'ಮುಖಪುಟ',
    navHistory: 'ಹಿಂದಿನ ಸ್ಕ್ಯಾನ್‌ಗಳು',
    navArchitecture: 'AI ತಂತ್ರಜ್ಞಾನ',
    heroTitle: 'ನಿಮ್ಮ ಬೆಳೆಗೆ ಏನು ಸಮಸ್ಯೆಯಾಗಿದೆ ಎಂದು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ.',
    heroSubtitle:
      'ಬಾಧಿತ ಎಲೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ, AI ನೆರವಿನಿಂದ ರೋಗ ಪತ್ತೆಹಚ್ಚಿ ಸುಲಭ ಪರಿಹಾರ ಕ್ರಮಗಳನ್ನು ಪಡೆಯಿರಿ.',
    takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    uploadImage: 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    bestResultsNote:
      'ಉತ್ತಮ ಫಲಿತಾಂಶಕ್ಕಾಗಿ, ಒಳ್ಳೆಯ ಬೆಳಕಿನಲ್ಲಿ ರೋಗವಿರುವ ಎಲೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ಬಳಸಿ.',
    trySampleLeaves: 'ಅಥವಾ ಮಾದರಿ ಎಲೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ:',
    selectedImage: 'ಆಯ್ಕೆಮಾಡಿದ ಎಲೆಯ ಫೋಟೋ',
    removeReselect: 'ಬದಲಾಯಿಸಿ / ತೆಗೆದುಹಾಕಿ',
    analyzePlant: 'ಎಲೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ',
    analyzingPlant: 'ಎಲೆಯ ಲಕ್ಷಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...',
    resultsTitle: 'ಬೆಳೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ ವರದಿ',
    possibleCondition: 'ಸಾಧ್ಯವಿರುವ ರೋಗ / ಬಾಧೆ',
    confidence: 'ಖಚಿತತೆ',
    severity: 'ತೀವ್ರತೆ',
    whatWeObserved: 'AI ಗಮನಿಸಿದ ಲಕ್ಷಣಗಳು',
    possibleCauses: 'ಸಾಧ್ಯವಿರುವ ಕಾರಣಗಳು',
    whatYouCanDo: 'ನೀವು ಮಾಡಬೇಕಾದ ಕ್ರಮಗಳು (ಪರಿಹಾರ)',
    prevention: 'ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು',
    safetyNoteTitle: 'ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ & ಎಚ್ಚರಿಕೆ',
    savedToHistory: 'ಇತಿಹಾಸದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ',
    savingToHistory: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    scanAnotherPlant: 'ಮತ್ತೊಂದು ಗಿಡವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    historyTitle: 'ನಿಮ್ಮ ಹಿಂದಿನ ಸ್ಕ್ಯಾನ್‌ಗಳು',
    historySubtitle:
      'ಹಿಂದೆ ಪರೀಕ್ಷಿಸಿದ ಎಲ್ಲಾ ಬೆಳೆ ಆರೋಗ್ಯ ವರದಿಗಳು ಸುರಕ್ಷಿತವಾಗಿ ಇಲ್ಲಿವೆ.',
    noScansYet: 'ಇನ್ನೂ ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ಮಾಡಿಲ್ಲ',
    noScansSubtext:
      'ರೋಗವಿರುವ ಎಲೆಯ ಫೋಟೋ ತೆಗೆದು ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ತಪಾಸಣೆ ಪ್ರಾರಂಭಿಸಿ.',
    viewCompleteAnalysis: 'ಸಂಪೂರ್ಣ ವರದಿ ನೋಡಿ',
    deleteScan: 'ಅಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    cameraTitle: 'ಗಿಡದ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    capturePhoto: 'ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ',
    switchCamera: 'ಕ್ಯಾಮೆರಾ ಬದಲಾಯಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    cameraPermissionError:
      'ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ದೊರೆತಿಲ್ಲ. ದಯವಿಟ್ಟು ಗ್ಯಾಲರಿಯಿಂದ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    signIn: 'ಲಾಗಿನ್ / ಖಾತೆ',
    signOut: 'ಲಾಗ್ ಔಟ್',
    guestUser: 'ರೈತ (ಅತಿಥಿ)',
    pipelineInfoTitle: 'MobileNetV2 + Gemini AI ತಂತ್ರಜ್ಞಾನ',
    pipelineBadge: 'MobileNetV2 + Gemini ವ್ಯವಸ್ಥೆ',
    severityMild: 'ಸ್ವಲ್ಪ (ಕಡಿಮೆ)',
    severityModerate: 'ಮಧ್ಯಮ',
    severitySevere: 'ತೀವ್ರವಾದದ್ದು',
    severityNone: 'ಆರೋಗ್ಯಕರ (ಯಾವುದೇ ರೋಗವಿಲ್ಲ)',
    severityUnknown: 'ಖಚಿತವಿಲ್ಲ',
  },
  ml: {
    tagline: 'സ്കാൻ ചെയ്യുക. രോഗം കണ്ടെത്തുക. വേഗത്തിൽ പരിഹരിക്കുക.',
    navHome: 'ഹോം',
    navHistory: 'മുൻകാല സ്കാനുകൾ',
    navArchitecture: 'AI ഘടന',
    heroTitle: 'നിങ്ങളുടെ വിളയ്ക്ക് എന്ത് പ്രശ്നമാണ് സംഭവിച്ചതെന്ന് എളുപ്പത്തിൽ മനസിലാക്കൂ.',
    heroSubtitle:
      'ബാധിച്ച ഇലയുടെ വ്യക്തമായ ഫോട്ടോ എടുക്കൂ, AI സഹായത്തോടെ രോഗം കണ്ടെത്തി അടുത്ത പരിഹಾರങ്ങൾ അറിയൂ.',
    takePhoto: 'ഫോട്ടോ എടുക്കൂ',
    uploadImage: 'ചിത്രം അപ്‌ലോഡ് ചെയ്യൂ',
    bestResultsNote:
      'നല്ല ഫലത്തിനായി, നല്ല വെളിച്ചത്തിൽ രോഗമുള്ള ഇലയുടെ വ്യക്തമായ ഫോട്ടോ ഉപയോഗിക്കൂ.',
    trySampleLeaves: 'അല്ലെങ്കിൽ മാതൃകാ ഇലകൾ പരിശോധിച്ച് നോക്കൂ:',
    selectedImage: 'തിരഞ്ഞെടുത്ത ഇലയുടെ ഫോട്ടോ',
    removeReselect: 'മാറ്റുക / നീക്കം ചെയ്യുക',
    analyzePlant: 'ഇല പരിശോധിച്ച് രോഗം കണ്ടെത്തുക',
    analyzingPlant: 'ഇലയുടെ ലക്ഷണങ്ങൾ പരിശോധിക്കുന്നു...',
    resultsTitle: 'വിള ആരോഗ്യ പരിശോധനാ ഫലം',
    possibleCondition: 'സാധ്യമായ രോഗം / കേടുപാടുകൾ',
    confidence: 'കൃത്യത',
    severity: 'തീവ്രത',
    whatWeObserved: 'AI കണ്ടെത്തിയ ലക്ഷണങ്ങൾ',
    possibleCauses: 'കാരണങ്ങൾ',
    whatYouCanDo: 'നിങ്ങൾ ചെയ്യേണ്ട പ്രതിവിധികൾ',
    prevention: 'പ്രതിരോധ മാർഗ്ഗങ്ങൾ',
    safetyNoteTitle: 'പ്രാഥമിക മാർഗ്ഗനിർദ്ദേശ കുറിപ്പ്',
    savedToHistory: 'ഹിസ്റ്ററിയിൽ സേവ് ചെയ്തു',
    savingToHistory: 'സേവ് ചെയ്യുന്നു...',
    scanAnotherPlant: 'മറ്റൊരു ചെടി സ്കാൻ ചെയ്യൂ',
    historyTitle: 'നിങ്ങളുടെ മുൻകാല സ്കാനുകൾ',
    historySubtitle:
      'മുമ്പ് നടത്തിയ എല്ലാ വിള പരിശോധനകളും സുരക്ഷിതമായി ഇവിടെ സൂക്ഷിച്ചിരിക്കുന്നു.',
    noScansYet: 'മുൻകാല സ്കാനുകൾ ലഭ്യമല്ല',
    noScansSubtext:
      'രോഗം ബാധിച്ച ഇലയുടെ ഫോട്ടോ എടുത്തോ അപ്‌ലോഡ് ചെയ്തോ പരിശോധന തുടങ്ങൂ.',
    viewCompleteAnalysis: 'പൂർണ്ണ വിവരങ്ങൾ കാണുക',
    deleteScan: 'ഡിലീറ്റ് ചെയ്യുക',
    close: 'അടയ്ക്കുക',
    cameraTitle: 'ചെടിയുടെ ഇല ഫോട്ടോ എടുക്കൂ',
    capturePhoto: 'ഫോട്ടോ എടുക്കൂ',
    switchCamera: 'ക്യാമറ മാറ്റുക',
    cancel: 'റദ്ദാക്കുക',
    cameraPermissionError:
      'ക്യാമറ അനുമതി ലഭിച്ചില്ല. ദയവായി ചിത്രത്തിന്റെ ഫയൽ അപ്‌ലോഡ് ചെയ്യൂ.',
    signIn: 'ലോഗിൻ / അക്കൗണ്ട്',
    signOut: 'ലോഗ് ഔട്ട്',
    guestUser: 'കർഷകൻ (അതിഥി)',
    pipelineInfoTitle: 'MobileNetV2 + Gemini AI സാങ്കേതികത',
    pipelineBadge: 'MobileNetV2 + Gemini സംവിധാനം',
    severityMild: 'നേരിയത്',
    severityModerate: 'മിതമായത്',
    severitySevere: 'ഗുരുതരമായത്',
    severityNone: 'ആരോഗ്യമുള്ളത് (രോഗബാധയില്ല)',
    severityUnknown: 'വ്യക്തമല്ല',
  },
};
