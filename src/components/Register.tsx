import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';
import { useAuth } from '../context/AuthContext';

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

interface RegisterProps {
  onRegister: (data: RegisterData) => Promise<{ success: boolean; error?: string }> | boolean;
  onSwitchToLogin: () => void;
  onBackToLanding?: () => void;
}

export function Register({ onRegister, onSwitchToLogin, onBackToLanding }: RegisterProps) {
  const { apiStatus, checkApiHealth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  // État du formulaire
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
  });

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.nom || !formData.prenom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (apiStatus === 'offline') {
      setError('API hors ligne. Impossible de créer un compte actuellement.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onRegister(formData);
      
      // Handle both old boolean and new Promise<{success, error}> format
      if (typeof result === 'boolean') {
        if (!result) {
          setError('Cet email est déjà utilisé');
        }
      } else if (result && !result.success) {
        setError(result.error || 'Cet email est déjà utilisé');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      ></div>

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        {/* Bouton retour */}
        <button
          onClick={onSwitchToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] transition-colors"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la connexion
        </button>

        {/* Logo - Cliquable pour retour landing */}
        <div className="text-center mb-4">
          {onBackToLanding ? (
            <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity">
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-16 mx-auto"
              />
            </button>
          ) : (
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-16 mx-auto"
            />
          )}
        </div>

        {/* En-tête */}
        <div className="text-center">
          <h2 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Bienvenue !
          </h2>
          <p className="text-gray-600 text-lg">
            Créez votre compte en moins d'une minute
          </p>
        </div>

        {/* Formulaire en liquid glass */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/50 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prénom et Nom sur la même ligne */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="prenom" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Prénom
                </label>
                <input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => updateField('prenom', e.target.value)}
                  placeholder="Jean"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nom" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Nom
                </label>
                <input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  placeholder="Dupont"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@monrestaurant.fr"
                required
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="telephone" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => updateField('telephone', e.target.value)}
                placeholder="01 23 45 67 89"
                required
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
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
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
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
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte et commencer'
              )}
            </button>

            {/* Texte légal */}
            <p className="text-center text-xs text-gray-500">
              En créant un compte, vous acceptez nos conditions d'utilisation
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
                  API hors ligne - inscription impossible
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Info rassurante */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-1">
              <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>🔒 Vos données sont sécurisées</span>
            </p>
            <p className="text-xs text-gray-600">
              Nous ne partageons jamais vos informations avec des tiers
            </p>
          </div>
        </div>

        {/* Lien vers connexion - style texte simple */}
        <div className="text-center">
          <p className="text-gray-700 text-sm">
            Déjà un compte ?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#5a03cf] hover:underline transition-all"
              style={{ fontWeight: '600' }}
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}