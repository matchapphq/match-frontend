import { useState, useEffect } from 'react';
import { Eye, EyeOff, Wifi, WifiOff, Check } from 'lucide-react';
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
  onShowTerms?: () => void;
}

export function Register({ onRegister, onSwitchToLogin, onBackToLanding, onShowTerms }: RegisterProps) {
  const { apiStatus, checkApiHealth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
  });

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      if (typeof result === 'boolean') {
        if (!result) setError('Cet email est déjà utilisé');
      } else if (result && !result.success) {
        setError(result.error || 'Cet email est déjà utilisé');
      }
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'inscription");
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
      {/* Pattern de fond */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      />

      {/* ✅ GAUCHE */}
      <div className="hidden lg:w-1/2 lg:flex flex top-0 left-0 h-full z-10"/>
      <div className="hidden lg:w-1/2 lg:flex fixed top-0 left-0 h-full z-10">
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10">
          {/* Gradient doux sur la gauche */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5a03cf]/70 via-[#5a03cf]/50 to-[#9cff02]/30" />

          <div className="relative z-10 h-full flex flex-col justify-between space-y-3 pt-3 px-10 pb-8">
            {/* Logo en haut à gauche */}
            <div>
              {onBackToLanding ? (
                <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity cursor-pointer">
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
              <h1
                className="text-5xl italic leading-tight text-white"
                style={{ fontWeight: '700', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
              >
                C&apos;est votre moment, <br />
                <span className="text-6xl" style={{ fontWeight: '900', color: '#9cff02' }}>
                  rentrez dans le match
                </span>
              </h1>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 border border-white/20 h-[60px]"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9cff02] to-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-2 border-white/60">
                    <Check className="w-4 h-4 text-[#5a03cf]" strokeWidth={3} />
                  </div>

                  {/* IMPORTANT: texte visible sur fond */}
                  <span className="text-white text-base leading-tight" style={{ fontWeight: '600' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer discret */}
            <div className="text-xs text-white/50 text-center mb-4">© 2025 Match - Tous droits réservés</div>
          </div>
        </div>
      </div>

      {/* ✅ DROITE */}
      <div
        className={[
          'relative z-20 h-[100dvh] overflow-y-auto w-full',
          'w-full lg:w-1/2 lg:ml-[50%]',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        ].join(' ')}
      >
        <div className="min-h-full flex items-center justify-center p-6">
          <div className="w-full max-w-xl space-y-6">
            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-4 cursor-pointer">
              {onBackToLanding ? (
                <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity">
                  <img src={logoMatch} alt="Match" className="h-12 mx-auto" />
                </button>
              ) : (
                <img src={logoMatch} alt="Match" className="h-12 mx-auto" />
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/50 p-10">
              {/* En-tête */}
              <div className="text-center mb-10">
                <h2 className="text-4xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  Bienvenue !
                </h2>
                <p className="text-gray-600">Créez votre compte en moins d&apos;une minute</p>
              </div>

              {/* Formulaire */}
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
                      autoComplete='given-name'
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
                      autoComplete='family-name'
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
                    autoComplete='email'
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
                      autoComplete='new-password'
                      required
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a03cf] transition-colors cursor-pointer"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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

                {/* Bouton CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
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
                  En créant un compte, vous acceptez nos{' '}
                  <button
                    type="button"
                    className="text-[#5a03cf] text-xs hover:underline transition-all cursor-pointer"
                    style={{ fontWeight: '600' }}
                    onClick={onShowTerms}
                  >
                    conditions d&apos;utilisation
                  </button>
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

              {/* Séparateur */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/70 px-4 text-gray-500">ou</span>
                </div>
              </div>

              {/* Lien vers connexion */}
              <div className="text-center">
                <p className="text-gray-700 text-sm">
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[#5a03cf] hover:underline transition-all cursor-pointer"
                    style={{ fontWeight: '600' }}
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
