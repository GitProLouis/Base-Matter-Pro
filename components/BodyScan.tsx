
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, XCircle, ChevronLeft, ShieldCheck } from 'lucide-react';
import { analyzeBodyImage } from '../services/geminiService';
import { BodyProfile } from '../types';

interface BodyScanProps {
  onComplete: (profile: BodyProfile) => void;
  onCancel: () => void;
}

const BodyScan: React.FC<BodyScanProps> = ({ onComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      setError("CAMERA_PERMISSION_DENIED: Please enable access in settings.");
    }
  };

  const captureFrame = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const base64 = capturedImage.split(',')[1];
      const result = await analyzeBodyImage(base64);
      onComplete(result);
    } catch (err) {
      setError("ANALYSIS_FAULT: Biometric engine timed out.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col p-6 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-sm font-bold tracking-tighter uppercase">Biometric Acquisition</h2>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-brand/40" />
      </div>

      {/* Viewport */}
      <div className="relative flex-1 bg-zinc-900/50 rounded-[40px] overflow-hidden border border-white/5 group shadow-2xl">
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.3]" />
            <div className="scan-line"></div>
            {/* Corners UI */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-brand/40 rounded-tl-2xl"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-brand/40 rounded-tr-2xl"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-brand/40 rounded-bl-2xl"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-brand/40 rounded-br-2xl"></div>
          </>
        ) : (
          <img src={capturedImage} alt="Capture" className="w-full h-full object-cover" />
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-6 backdrop-blur-md">
            <div className="relative">
              <RefreshCw className="w-16 h-16 text-brand animate-spin" />
              <div className="absolute inset-0 bg-brand/20 blur-2xl animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2">Analyzing Matter</p>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">System Error</p>
            <p className="text-zinc-500 text-[10px] mb-8 leading-relaxed">{error}</p>
            <button onClick={reset} className="px-8 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-tighter">Initialize Restart</button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center space-y-6">
        {!capturedImage ? (
          <button 
            onClick={captureFrame}
            disabled={!isCapturing}
            className="group relative"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-brand transition-colors">
              <div className="w-16 h-16 rounded-full bg-white group-active:scale-90 transition-transform flex items-center justify-center">
                <Camera className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="absolute -inset-4 border border-brand/0 group-hover:border-brand/20 rounded-full transition-all duration-700"></div>
          </button>
        ) : !isAnalyzing && (
          <div className="flex space-x-4 w-full max-w-sm">
            <button onClick={reset} className="flex-1 py-5 rounded-[24px] bg-zinc-900 border border-white/5 font-bold text-[10px] uppercase tracking-widest">Retake</button>
            <button onClick={handleAnalyze} className="flex-1 py-5 rounded-[24px] bg-brand text-black font-bold text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Data</span>
            </button>
          </div>
        )}
        <div className="text-center space-y-1">
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">A.I. Protocol 2.5.0</p>
          <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Data processed locally via encrypted gateway</p>
        </div>
      </div>
    </div>
  );
};

export default BodyScan;
