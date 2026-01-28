import { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, CheckCircle2, Scan, Loader2, Users } from 'lucide-react';
import { PageType } from '../../../types';
import { useVerifyQR, useCheckIn } from '../../../hooks/api/useReservations';
import { toast } from 'sonner';

interface QRScannerProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
}

interface VerifiedReservation {
  id: string;
  user_name: string;
  party_size: number;
  match_name: string;
  status: string;
}

export function QRScanner({ onBack, onNavigate }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [verifiedReservation, setVerifiedReservation] = useState<VerifiedReservation | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const verifyQRMutation = useVerifyQR();
  const checkInMutation = useCheckIn();

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

  const handleManualInput = async (code: string) => {
    if (!code) return;
    
    setScannedData(code);
    setIsVerifying(true);
    setError(null);
    
    try {
      const result = await verifyQRMutation.mutateAsync(code);
      
      // Store verified reservation info
      setVerifiedReservation({
        id: result.reservation?.id || result.id,
        user_name: result.reservation?.user?.first_name 
          ? `${result.reservation.user.first_name} ${result.reservation.user.last_name}`
          : result.user_name || 'Client',
        party_size: result.reservation?.party_size || result.party_size || 1,
        match_name: result.match_name || 'Match',
        status: result.reservation?.status || result.status || 'pending',
      });
      
      setSuccess(true);
      stopCamera();
      toast.success('QR Code vérifié avec succès!');
    } catch (err: any) {
      setError(err.message || 'QR Code invalide ou expiré');
      toast.error('QR Code invalide');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleCheckIn = async () => {
    if (!verifiedReservation) return;
    
    setIsCheckingIn(true);
    try {
      await checkInMutation.mutateAsync(verifiedReservation.id);
      toast.success('Check-in effectué avec succès!');
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du check-in');
    } finally {
      setIsCheckingIn(false);
    }
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

        {success && verifiedReservation && (
          <div className="text-center w-full max-w-md">
            <div className="w-24 h-24 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-white text-xl mb-2">Réservation vérifiée !</h3>
            
            {/* Reservation Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {verifiedReservation.user_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{verifiedReservation.user_name}</div>
                    <div className="text-white/60 text-sm">{verifiedReservation.match_name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-5 h-5" />
                  <span>{verifiedReservation.party_size} personne(s)</span>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="text-sm text-white/60 mb-2">Statut actuel</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    verifiedReservation.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : verifiedReservation.status === 'checked_in'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {verifiedReservation.status === 'confirmed' ? 'Confirmé' : 
                     verifiedReservation.status === 'checked_in' ? 'Déjà enregistré' : 
                     'En attente'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors"
              >
                Fermer
              </button>
              {verifiedReservation.status !== 'checked_in' && (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] font-semibold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Check-in...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Valider l'arrivée
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        
        {isVerifying && (
          <div className="text-center">
            <div className="w-24 h-24 bg-[#5a03cf]/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-[#9cff02] animate-spin" />
            </div>
            <h3 className="text-white text-xl mb-2">Vérification en cours...</h3>
            <p className="text-white/70">Code: {scannedData}</p>
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