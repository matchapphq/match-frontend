import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSwitchToRegister: () => void;
  onBackToLanding?: () => void;
}

export function Login({ onLogin, onSwitchToRegister, onBackToLanding }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
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

      <div className="w-full max-w-md relative">
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
          <h1 className="text-3xl mb-2 dark:text-white">Connexion</h1>
          <p className="text-gray-600 dark:text-gray-400">Accédez à votre espace restaurateur</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#5a03cf] focus:ring-[#5a03cf] bg-gray-50 dark:bg-gray-900"
                />
                Se souvenir de moi
              </label>
              <button type="button" className="text-[#5a03cf] hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5a03cf]/20"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Pas encore de compte ?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#5a03cf] hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Compte de démonstration :</p>
          <p className="text-xs text-gray-900 dark:text-white">Email: demo@match.com</p>
          <p className="text-xs text-gray-900 dark:text-white">Mot de passe: demo123</p>
        </div>
      </div>
    </div>
  );
}
