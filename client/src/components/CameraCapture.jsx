import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

const CameraCapture = ({ isOpen, onClose, onCapture, title = 'Verify Identity via Camera' }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Start camera stream
  const startCamera = async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      setPhotoPreview(null);
      setCapturedBlob(null);

      // Stop any existing tracks
      stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this device or browser. Please ensure HTTPS or localhost.');
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
      console.error('Camera error:', err);
      setIsInitializing(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device.');
      } else {
        setCameraError(err.message || 'Unable to access camera.');
      }
    }
  };

  // Stop camera stream
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

    // Get preview as data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoPreview(dataUrl);

    // Convert to Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          // Pause camera while reviewing preview
          stopCamera();
        }
      },
      'image/jpeg',
      0.85
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>{title}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Preview */}
        <div className="p-6">
          <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center border border-slate-800">
            {cameraError ? (
              <div className="p-6 text-center text-rose-300 flex flex-col items-center gap-3">
                <AlertCircle className="w-12 h-12 text-rose-400" />
                <p className="text-sm font-medium">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                </button>
              </div>
            ) : photoPreview ? (
              <img
                src={photoPreview}
                alt="Captured attendance verification"
                className="w-full h-full object-cover"
              />
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
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="text-xs">Initializing camera...</span>
                  </div>
                )}
                {/* Visual guidelines */}
                <div className="absolute inset-8 border-2 border-dashed border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] text-white/50 bg-black/40 px-2.5 py-1 rounded-full">
                    Position your face within the frame
                  </span>
                </div>
              </>
            )}
          </div>

          <p className="mt-3 text-xs text-center text-slate-500">
            Live camera verification is required for supermarket attendance. Gallery uploads are disabled for security.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {photoPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retake
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs shadow-emerald-700/20 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" /> Confirm Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={isInitializing || !!cameraError}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-800/20 rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4" /> Capture Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

