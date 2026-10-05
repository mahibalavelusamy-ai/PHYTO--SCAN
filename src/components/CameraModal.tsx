import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  language: Language;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setCameraError(t.cameraPermissionError);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onCapture(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/60 text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">{t.cameraTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Video */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-stone-300 max-w-xs flex flex-col items-center">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
              <p className="text-sm leading-relaxed mb-4">{cameraError}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Aiming Reticle / Leaf Frame */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded bg-black/50 text-emerald-200 backdrop-blur-xs">
                  Center Affected Leaf Here
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-5 bg-stone-950/90 flex items-center justify-around border-t border-stone-800">
          <button
            onClick={switchCamera}
            disabled={!!cameraError}
            title={t.switchCamera}
            className="p-3 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            disabled={!!cameraError}
            className="w-16 h-16 rounded-full border-4 border-white/80 p-1 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 transition-transform bg-transparent"
          >
            <div className="w-full h-full rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
          </button>

          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
