import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'venue_owner'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, role);
      }
      onClose();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('customer');
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Connexion' : 'Créer un compte'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {mode === 'signup' && (
          <>
            <Input
              label="Nom complet"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jean Dupont"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Je suis&nbsp;:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={(e) => setRole(e.target.value as 'customer')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Client</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="venue_owner"
                    checked={role === 'venue_owner'}
                    onChange={(e) => setRole(e.target.value as 'venue_owner')}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Propriétaire de lieu</span>
                </label>
              </div>
            </div>
          </>
        )}

        <Input
          label="Adresse e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          {mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {mode === 'signin'
              ? "Pas encore de compte ? Créez-en un"
              : 'Vous avez déjà un compte ? Connectez-vous'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
