import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, ShieldCheck } from 'lucide-react';

const CameraCapture = ({ isOpen, onClose, onCapture, title = 'Verify Identity via Camera' }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const startCamera = async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      setPhotoPreview(null);
      setCapturedBlob(null);

      stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this device/browser. Please ensure HTTPS or localhost.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setIsInitializing(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera hardware found on this device.');
      } else {
        setCameraError(err.message || 'Unable to start camera.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPhotoPreview(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          stopCamera();
        }
      },
      'image/jpeg',
      0.88
    );
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedBlob) {
      onCapture(capturedBlob, photoPreview);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setPhotoPreview(null);
    setCapturedBlob(null);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200/90 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">Live store floor photo verification</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-6">
          <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center border border-slate-800 shadow-inner">
            {cameraError ? (
              <div className="p-6 text-center text-rose-300 flex flex-col items-center gap-2.5 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800/60 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-xs font-medium leading-relaxed">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Camera
                </button>
              </div>
            ) : photoPreview ? (
              <div className="relative w-full h-full">
                <img
                  src={photoPreview}
                  alt="Captured verification"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Photo Captured
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isInitializing ? 'opacity-0' : 'opacity-100'}`}
                />
                {isInitializing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <RefreshCw className="w-7 h-7 animate-spin text-blue-500" />
                    <span className="text-xs font-medium">Starting camera hardware...</span>
                  </div>
                )}
                {/* Biometric-style corner brackets */}
                <div className="absolute inset-5 pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400/80 rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400/80 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400/80 rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400/80 rounded-br-sm"></div>
                </div>

                {/* Status indicator tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> REC • LIVE
                </div>
              </>
            )}
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Anti-spoofing enabled: live capture required. Gallery uploads disabled.</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {photoPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" /> Retake
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm shadow-blue-600/20"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm & Continue
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={isInitializing || !!cameraError}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                <Camera className="w-3.5 h-3.5" /> Capture Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
