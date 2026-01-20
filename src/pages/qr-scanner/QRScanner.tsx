import { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, CheckCircle2, Scan } from 'lucide-react';
import { PageType } from '../../App';

interface QRScannerProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
}

export function QRScanner({ onBack, onNavigate }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' }, // Préférer la caméra arrière
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setHasPermission(true);
      setScanning(true);
      setError(null);
    } catch (err) {
      console.error('Erreur caméra:', err);
      setHasPermission(false);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const handleManualInput = (code: string) => {
    setScannedData(code);
    setSuccess(true);
    setTimeout(() => {
      alert(`QR Code scanné: ${code}`);
      onBack();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 safe-top">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg">Scanner QR Code</h2>
          <button
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="flex flex-col items-center justify-center h-full p-4">
        {!scanning && !error && !success && (
          <div className="text-center w-full max-w-md">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-white text-xl mb-3">Scanner un QR Code</h3>
            <p className="text-white/70 text-sm mb-8">
              Scannez le QR code de réservation du client pour valider sa venue
            </p>
            
            <button
              onClick={startCamera}
              className="w-full px-8 py-4 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-4"
            >
              <Camera className="w-5 h-5" />
              Activer la caméra
            </button>

            <div className="text-white/50 text-sm mb-4">ou</div>

            <button
              onClick={() => {
                const code = prompt('Entrez le code de réservation:');
                if (code) handleManualInput(code);
              }}
              className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              Saisir manuellement
            </button>
          </div>
        )}

        {error && (
          <div className="text-center w-full max-w-md">
            <div className="w-24 h-24 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-white text-xl mb-3">Erreur de caméra</h3>
            <p className="text-white/70 mb-8">{error}</p>
            <button
              onClick={() => {
                const code = prompt('Entrez le code de réservation:');
                if (code) handleManualInput(code);
              }}
              className="w-full px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors mb-4"
            >
              Saisir manuellement
            </button>
            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

        {scanning && (
          <div className="relative w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto"
                playsInline
                autoPlay
                muted
              />
              
              {/* Overlay de scan */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64">
                  {/* Coins du cadre */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#9cff02] rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#9cff02] rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#9cff02] rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#9cff02] rounded-br-xl" />
                  
                  {/* Ligne de scan animée */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9cff02] to-transparent animate-scan" />
                </div>
              </div>
            </div>

            <p className="text-white text-center mt-6 text-sm mb-4">
              Positionnez le QR code dans le cadre
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  stopCamera();
                  setScanning(false);
                }}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const code = prompt('Entrez le code de réservation:');
                  if (code) {
                    stopCamera();
                    handleManualInput(code);
                  }
                }}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                Saisie manuelle
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-white text-xl mb-2">Succès !</h3>
            <p className="text-white/70">Code scanné: {scannedData}</p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      {!success && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-6 text-center safe-bottom">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Scan className="w-4 h-4" />
            <p>Compatible avec tous les QR codes de réservation Match</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .safe-top {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
        .safe-bottom {
          padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}
