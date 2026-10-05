import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  ensureUser,
  auth,
  onAuthStateChanged,
  signOut,
  saveScanToFirestore,
  uploadPlantImage,
  getUserScans,
  getActiveUserId,
  SavedScanRecord,
} from './services/firebase';
import { runPlantHealthPipeline, PlantAnalysisResult } from './services/plantAnalysis';
import { mobileNetV2Service } from './services/mobilenetClassifier';
import { Language, translations } from './utils/i18n';
import { SampleLeaf } from './utils/sampleLeaves';

// UI Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CameraModal } from './components/CameraModal';
import { ImagePreviewCard } from './components/ImagePreviewCard';
import { AnalysisProgressModal } from './components/AnalysisProgressModal';
import { ResultView } from './components/ResultView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AuthModal } from './components/AuthModal';
import { AlertCircle, Leaf, Sparkles, HeartHandshake } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'history'>('home');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('phytoscan_language') as Language;
      if (saved && ['en', 'ta', 'te', 'kn', 'ml'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('phytoscan_language', newLang);
    } catch {
      // ignore
    }
  };

  // Scanning workflow state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('preprocessing');
  const [progressPercent, setProgressPercent] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysisResult | null>(null);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & History
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [scans, setScans] = useState<SavedScanRecord[]>([]);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState<SavedScanRecord | null>(null);

  // Custom on-device model loading progress
  const [modelLoadingStatus, setModelLoadingStatus] = useState<{
    isLoading: boolean;
    progress: number;
    message: string;
  } | null>(null);

  const t = translations[language];

  // Lazy model initialization on startup with progress tracking
  useEffect(() => {
    const unsub = mobileNetV2Service.subscribeLoading((progress, message) => {
      setModelLoadingStatus({
        isLoading: progress < 100,
        progress,
        message,
      });
      if (progress >= 100) {
        setTimeout(() => setModelLoadingStatus(null), 3000);
      }
    });

    mobileNetV2Service.init().catch((err) => {
      console.warn('[PhytoScan] Background model init notice:', err);
    });

    return () => {
      unsub();
    };
  }, []);

  // Initialize Firebase Auth
  useEffect(() => {
    let mounted = true;
    const initialUid = getActiveUserId();
    fetchUserScans(initialUid);

    ensureUser()
      .then((user) => {
        if (mounted && user) {
          setCurrentUser(user);
          fetchUserScans(user.uid);
        }
      })
      .catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        setCurrentUser(user);
        const uid = user ? user.uid : getActiveUserId();
        fetchUserScans(uid);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch scans
  const fetchUserScans = async (userId: string) => {
    try {
      const records = await getUserScans(userId);
      setScans(records);
    } catch {
      // non-fatal
    }
  };

  // Handle Image File selection
  const handleSelectImageFile = (file: File) => {
    setErrorMessage(null);
    setAnalysisResult(null);
    setIsSavedToHistory(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        setCurrentTab('home');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Live Camera Capture
  const handleCameraCapture = (dataUrl: string) => {
    setErrorMessage(null);
    setAnalysisResult(null);
    setIsSavedToHistory(false);
    setSelectedImage(dataUrl);
    setIsCameraOpen(false);
    setCurrentTab('home');
  };

  // Handle Preset Sample Selection
  const handleSelectSample = (sample: SampleLeaf) => {
    setErrorMessage(null);
    setAnalysisResult(null);
    setIsSavedToHistory(false);
    setSelectedImage(sample.dataUrl);
    setCurrentTab('home');
  };

  // Execute Core Pipeline: Upload/Take Photo -> Analyze -> Confidence -> Guidance -> Save to History
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setErrorMessage(null);
    setIsAnalyzing(true);
    setProgressPercent(10);
    setAnalysisStage('preprocessing');

    try {
      // 1. Run modular MobileNetV2 + Confidence Gate + Gemini Guidance pipeline
      const result = await runPlantHealthPipeline({
        imageSource: selectedImage,
        language: language,
        onProgress: (stage, pct) => {
          setAnalysisStage(stage);
          setProgressPercent(pct);
        },
      });

      setAnalysisResult(result);
      setIsAnalyzing(false);

      // 2. Automatically persist scan to Firebase Storage and Firestore
      const activeUid = currentUser?.uid || getActiveUserId();
      setIsSaving(true);
      try {
        const storedImageUrl = await uploadPlantImage(selectedImage, activeUid);
        await saveScanToFirestore(result, storedImageUrl, activeUid, language);
        setIsSavedToHistory(true);
        await fetchUserScans(activeUid);
      } catch (saveErr) {
        console.warn('Auto-save notice:', saveErr);
      } finally {
        setIsSaving(false);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setIsAnalyzing(false);
      setErrorMessage(
        err.message || 'Plant analysis failed. Please verify internet connection or try another leaf photograph.'
      );
    }
  };

  // Manual save trigger if not yet saved
  const handleManualSave = async () => {
    if (!analysisResult || !selectedImage || isSavedToHistory) return;
    const activeUid = currentUser?.uid || getActiveUserId();
    setIsSaving(true);
    try {
      const storedImageUrl = await uploadPlantImage(selectedImage, activeUid);
      await saveScanToFirestore(analysisResult, storedImageUrl, activeUid, language);
      setIsSavedToHistory(true);
      await fetchUserScans(activeUid);
    } catch (err) {
      console.error('Manual save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to scan another leaf
  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsSavedToHistory(false);
    setErrorMessage(null);
    setSelectedHistoryScan(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 text-stone-900">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedHistoryScan(null);
          setCurrentTab(tab);
        }}
        language={language}
        setLanguage={handleLanguageChange}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => signOut(auth)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mt-6 px-4">
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="font-bold text-rose-700 hover:text-rose-900 px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Home / Scanning Workflow */}
        {currentTab === 'home' && (
          <>
            {/* Show Result View if Analysis is completed */}
            {analysisResult && selectedImage ? (
              <ResultView
                result={analysisResult}
                imageSrc={selectedImage}
                language={language}
                onReset={handleReset}
                isSaved={isSavedToHistory}
                onSaveToHistory={handleManualSave}
                isSaving={isSaving}
              />
            ) : selectedImage ? (
              /* Selected Image Preview with "Analyze Plant" CTA */
              <div className="py-6 px-4">
                <ImagePreviewCard
                  imageSrc={selectedImage}
                  onClear={handleReset}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  language={language}
                />
              </div>
            ) : (
              /* Default Landing: Hero Section with Take Photo / Upload buttons & Samples */
              <HeroSection
                language={language}
                onTakePhoto={() => setIsCameraOpen(true)}
                onSelectImageFile={handleSelectImageFile}
                onSelectSample={handleSelectSample}
              />
            )}
          </>
        )}

        {/* Tab 2: Scan History */}
        {currentTab === 'history' && (
          <>
            {selectedHistoryScan ? (
              <div className="py-4">
                <ResultView
                  result={selectedHistoryScan}
                  imageSrc={selectedHistoryScan.imageUrl}
                  language={language}
                  onReset={() => setSelectedHistoryScan(null)}
                  isSaved={true}
                />
              </div>
            ) : (
              <ScanHistoryView
                scans={scans}
                onSelectScan={(scan) => setSelectedHistoryScan(scan)}
                onRefreshScans={() => fetchUserScans(currentUser?.uid || getActiveUserId())}
                onGoHome={() => setCurrentTab('home')}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-stone-800 tracking-tight">
              PhytoScan
            </span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-600 font-medium">AGRIMIND Initiative</span>
          </div>

          <p className="font-medium text-stone-500">
            {language === 'ta'
              ? '“ஸ்கேன் செய்க. கண்டறிக. உடனே தீர்வு காண்க.”'
              : '“Scan. Diagnose. Act early.”'}
          </p>

          <button
            onClick={() => setIsArchitectureOpen(true)}
            className="text-stone-500 hover:text-emerald-700 font-medium transition-colors"
          >
            MobileNetV2 + Gemini AI Specs
          </button>
        </div>
      </footer>

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        language={language}
      />

      <AnalysisProgressModal
        isOpen={isAnalyzing}
        imageSrc={selectedImage || ''}
        stage={analysisStage}
        progressPercent={progressPercent}
        language={language}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        language={language}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
      />

      {/* Lazy Custom Model Loading Progress Indicator */}
      {modelLoadingStatus && modelLoadingStatus.isLoading && (
        <div className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-3 px-4 flex items-center gap-3 text-xs max-w-sm">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-800 truncate">{modelLoadingStatus.message}</p>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${modelLoadingStatus.progress}%` }}
              />
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-700 text-[11px] shrink-0">
            {modelLoadingStatus.progress}%
          </span>
        </div>
      )}
    </div>
  );
}
