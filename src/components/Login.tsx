import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export function Login({ onSuccess, onRegisterClick }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-2xl mb-4">
            <span className="text-4xl">⚽</span>
          </div>
          <h1 className="text-3xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Match
          </h1>
          <p className="text-gray-600 mt-2">Espace Restaurateur</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl mb-6 text-center" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Connexion
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2 text-sm" style={{ fontWeight: '600' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5a03cf] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm" style={{ fontWeight: '600' }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5a03cf] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#5a03cf] focus:ring-[#5a03cf]" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-[#5a03cf] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 italic"
              style={{ fontWeight: '600' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <button
                onClick={onRegisterClick}
                className="text-[#5a03cf] hover:underline font-semibold"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Mode démo : L'application fonctionne avec des données simulées</p>
        </div>
      </div>
    </div>
  );
}
