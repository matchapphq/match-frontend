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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningLoopRef = useRef<number | null>(null);
  
  const verifyQRMutation = useVerifyQR();
  const checkInMutation = useCheckIn();

  useEffect(() => {
    if (scanning && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      
      const handlePlay = async () => {
        try {
          await video.play();
          startScanningLoop();
        } catch (err) {
          console.error("Video play failed:", err);
        }
      };

      video.onloadedmetadata = handlePlay;
      handlePlay();
    }
  }, [scanning]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scanningLoopRef.current) {
      cancelAnimationFrame(scanningLoopRef.current);
      scanningLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startScanningLoop = () => {
    const video = videoRef.current;
    if (!video) return;

    // Use native BarcodeDetector if available
    const barcodeDetector = 'BarcodeDetector' in window 
      ? new (window as any).BarcodeDetector({ formats: ['qr_code'] }) 
      : null;

    const scan = async () => {
      if (!scanning) return;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
          if (barcodeDetector) {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              handleManualInput(code);
              return; 
            }
          }
        } catch (err) {
          console.error('Erreur de détection:', err);
        }
      }
      scanningLoopRef.current = requestAnimationFrame(scan);
    };

    scanningLoopRef.current = requestAnimationFrame(scan);
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 safe-top border-b border-border bg-background/50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-lg mx-auto w-full">
          <h2 className="text-foreground text-lg font-semibold flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            Scanner QR Code
          </h2>
          <button
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="w-10 h-10 bg-muted/50 hover:bg-muted rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          {!scanning && !error && !success && (
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl font-bold mb-3">Scanner un QR Code</h3>
              <p className="text-muted-foreground text-sm mb-8 px-4">
                Scannez le QR code de réservation du client pour valider sa venue
              </p>
              
              <button
                onClick={startCamera}
                className="w-full py-4 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4"
              >
                <Camera className="w-5 h-5" />
                Activer la caméra
              </button>

              <div className="relative w-full my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">ou</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const code = prompt('Entrez le code de réservation:');
                  if (code) handleManualInput(code);
                }}
                className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors"
              >
                Saisir manuellement
              </button>
            </div>
          )}

          {error && (
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center border-destructive/20">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-foreground text-xl font-bold mb-3">Erreur de caméra</h3>
              <p className="text-muted-foreground mb-8">{error}</p>
              <button
                onClick={() => {
                  const code = prompt('Entrez le code de réservation:');
                  if (code) handleManualInput(code);
                }}
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors mb-3"
              >
                Saisir manuellement
              </button>
              <button
                onClick={onBack}
                className="w-full py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
              >
                Fermer
              </button>
            </div>
          )}

          {scanning && (
            <div className="w-full flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black w-full aspect-[3/4] max-h-[60vh]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted
                />
                
                {/* Overlay de scan */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
                  <div className="relative w-64 h-64 shadow-[0_0_0_4000px_rgba(0,0,0,0.4)] rounded-xl">
                    {/* Coins du cadre */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#9cff02] rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#9cff02] rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#9cff02] rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#9cff02] rounded-br-xl" />
                    
                    {/* Ligne de scan animée */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#9cff02] to-transparent animate-scan shadow-[0_0_8px_#9cff02]" />
                  </div>
                </div>
              </div>

              <div className="glass-card mt-6 p-4 rounded-2xl w-full flex flex-col gap-4">
                <p className="text-foreground text-center text-sm font-medium">
                  Positionnez le QR code dans le cadre
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      stopCamera();
                      setScanning(false);
                    }}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition-colors"
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
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors"
                  >
                    Saisie manuelle
                  </button>
                </div>
              </div>
            </div>
          )}

          {success && verifiedReservation && (
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center border-[#9cff02]/30">
              <div className="w-20 h-20 bg-[#9cff02]/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-[#9cff02]" />
              </div>
              <h3 className="text-foreground text-2xl font-bold mb-2">Réservation vérifiée !</h3>
              
              {/* Reservation Details */}
              <div className="bg-muted/50 rounded-2xl p-6 mt-6 w-full text-left border border-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#7a23ef] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-primary-foreground font-bold text-lg">
                        {verifiedReservation.user_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-lg">{verifiedReservation.user_name}</div>
                      <div className="text-muted-foreground text-sm font-medium">{verifiedReservation.match_name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-foreground font-medium bg-background p-3 rounded-lg border border-border">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{verifiedReservation.party_size} personne(s)</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Statut actuel</div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      verifiedReservation.status === 'confirmed' 
                        ? 'bg-[#9cff02]/20 text-green-700 dark:text-[#9cff02] border border-[#9cff02]/30' 
                        : verifiedReservation.status === 'checked_in'
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {verifiedReservation.status === 'confirmed' ? 'Confirmé' : 
                       verifiedReservation.status === 'checked_in' ? 'Déjà enregistré' : 
                       'En attente'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-8 w-full">
                {verifiedReservation.status !== 'checked_in' && (
                  <button
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="w-full py-4 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                <button
                  onClick={onBack}
                  className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
          
          {isVerifying && (
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h3 className="text-foreground text-xl font-bold mb-2">Vérification...</h3>
              <p className="text-muted-foreground font-mono bg-muted px-3 py-1 rounded-md mt-2">{scannedData}</p>
            </div>
          )}
        </div>
      </div>

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
          80% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out forwards;
        }
        .safe-top {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
      `}</style>
    </div>
  );
}