import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
// import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logo from '../../../../assets/logo.png';
import { ReferralCodeInput } from '../../../components/ReferralCodeInput';

interface RegisterProps {
  onRegister: (data: any) => Promise<boolean> | boolean;
  onSwitchToLogin: () => void;
  onBackToLanding?: () => void;
}

export function Register({ onRegister, onSwitchToLogin, onBackToLanding }: RegisterProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState('');

  // Get referral code from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralCodeFromUrl(refCode);
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onRegister(formData);
      if (!success) {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo and Back */}
        <div className="text-center mb-8">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
          )}
          <img 
            src={logo} 
            alt="Match" 
            className="h-12 mx-auto mb-6 dark:brightness-150" 
            style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
          />
          <h1 className="text-3xl mb-2 dark:text-white">Créer un compte</h1>
          <p className="text-gray-600 dark:text-gray-400">Rejoignez Match et développez votre activité</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                  placeholder="Jean"
                  required
                />
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                placeholder="06 12 34 56 78"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Code Input */}
            <ReferralCodeInput
              defaultCode={referralCodeFromUrl}
              onCodeValidated={(code) => {
                setFormData(prev => ({ ...prev, referralCode: code }));
              }}
              onCodeChange={(code) => {
                setFormData(prev => ({ ...prev, referralCode: code }));
              }}
            />

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 text-[#5a03cf] focus:ring-[#5a03cf] bg-gray-50 dark:bg-gray-900"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                J'accepte les{' '}
                <a href="#" className="text-[#5a03cf] hover:underline">
                  conditions d'utilisation
                </a>
                {' '}et la{' '}
                <a href="#" className="text-[#5a03cf] hover:underline">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5a03cf]/20"
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte ?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#5a03cf] hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}