import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';

interface RegisterProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export function Register({ onSuccess, onLoginClick }: RegisterProps) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: 'venue_owner',
      });
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message || 'Erreur lors de l\'inscription');
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

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl mb-6 text-center" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Créer un compte
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm" style={{ fontWeight: '600' }}>
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5a03cf] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-sm" style={{ fontWeight: '600' }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5a03cf] transition-colors"
                />
              </div>
            </div>

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
                  minLength={8}
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

            <div>
              <label className="block text-gray-700 mb-2 text-sm" style={{ fontWeight: '600' }}>
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5a03cf] transition-colors"
                />
              </div>
            </div>

            <div className="text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-1 rounded border-gray-300 text-[#5a03cf] focus:ring-[#5a03cf]" />
                <span className="text-gray-600">
                  J'accepte les{' '}
                  <a href="#" className="text-[#5a03cf] hover:underline">conditions d'utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-[#5a03cf] hover:underline">politique de confidentialité</a>
                </span>
              </label>
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
                  Création...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Déjà un compte ?{' '}
              <button
                onClick={onLoginClick}
                className="text-[#5a03cf] hover:underline font-semibold"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
