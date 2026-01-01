import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Check, Wifi, WifiOff } from 'lucide-react';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }> | boolean;
  onSwitchToRegister: () => void;
  onBackToLanding?: () => void;
}

export function Login({ onLogin, onSwitchToRegister, onBackToLanding }: LoginProps) {
  const { apiStatus, checkApiHealth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await onLogin(email, password);
      
      // Handle both old boolean and new Promise<{success, error}> format
      if (typeof result === 'boolean') {
        if (!result) {
          setError('Email ou mot de passe incorrect');
        }
      } else if (result && !result.success) {
        setError(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Augmentez votre visibilité lors des événements sportifs',
    'Gérez vos réservations en temps réel',
    'Accédez à des statistiques détaillées',
    'Boostez vos matchs stratégiques',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 flex relative overflow-hidden">
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      ></div>

      {/* Partie gauche - Simplifié et professionnel */}
      <div className="hidden lg:flex lg:w-1/2 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Gradient doux sur la gauche */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5a03cf]/70 via-[#5a03cf]/50 to-[#9cff02]/30"></div>

        <div className="relative z-10 flex-1 flex flex-col justify-between space-y-3 pt-3">
          {/* Logo en haut à gauche */}
          <div>
            {onBackToLanding ? (
              <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity">
                <img 
                  src={logoMatch} 
                  alt="Match" 
                  className="h-20"
                  style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                />
              </button>
            ) : (
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-20"
                style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
              />
            )}
          </div>

          {/* Titre avec mise en valeur */}
          <div className="space-y-4">
            <h1 className="text-5xl italic leading-tight text-white" style={{ fontWeight: '700', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              C'est votre moment, <br />
              <span className="text-6xl" style={{ fontWeight: '900', color: '#9cff02' }}>
                rentrez dans le match
              </span>
            </h1>
          </div>

          {/* Checklist sans icônes décoratives */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 border border-white/20 h-[60px]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9cff02] to-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-2 border-white/60">
                  <Check className="w-4 h-4 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-900 text-base leading-tight" style={{ fontWeight: '600' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer discret */}
        <div className="relative z-10 text-xs text-white/50 text-center">
          © 2025 Match - Tous droits réservés
        </div>
      </div>

      {/* Partie droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-xl space-y-8 relative z-10">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-4">
            {onBackToLanding ? (
              <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity">
                <img 
                  src={logoMatch} 
                  alt="Match" 
                  className="h-12 mx-auto"
                />
              </button>
            ) : (
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-12 mx-auto"
              />
            )}
          </div>

          {/* Formulaire en liquid glass */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/50 p-10">
            {/* Titre d'accueil */}
            <div className="text-center mb-10">
              <h2 className="text-4xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Content de vous revoir
              </h2>
              <p className="text-gray-600">Connectez-vous à votre espace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@monrestaurant.fr"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a03cf] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-[#5a03cf] hover:underline transition-all"
                    style={{ fontWeight: '500' }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/70 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}

              {/* Bouton CTA avec dégradé Match */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: '600' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>

              {/* Texte sécurisé sous le bouton */}
              <p className="text-xs text-gray-500 text-center">
                Accès sécurisé – réservé aux restaurateurs partenaires
              </p>

              {/* API Status indicator */}
              <div className="flex items-center justify-center gap-2 text-xs">
                {apiStatus === 'checking' && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    Connexion au serveur...
                  </span>
                )}
                {apiStatus === 'online' && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3 h-3" />
                    API connectée
                  </span>
                )}
                {apiStatus === 'offline' && (
                  <span className="flex items-center gap-1 text-orange-500">
                    <WifiOff className="w-3 h-3" />
                    Mode démo (API hors ligne)
                  </span>
                )}
              </div>

              {/* Séparateur */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/70 px-4 text-gray-500">ou</span>
                </div>
              </div>

              {/* Lien vers inscription - style texte simple */}
              <div className="text-center">
                <p className="text-gray-700 text-sm">
                  Première fois sur Match ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-[#5a03cf] hover:underline transition-all"
                    style={{ fontWeight: '600' }}
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}