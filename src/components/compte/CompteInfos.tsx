import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface CompteInfosProps {
  onBack?: () => void;
}

export function CompteInfos({ onBack }: CompteInfosProps) {
  const { currentUser } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Bouton retour aux paramètres */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retourner aux paramètres du compte
        </button>
      )}

      {/* Header de la page */}
      <div className="mb-12">
        <h1 className="text-5xl italic mb-2 text-[#5a03cf]" style={{ fontWeight: '700' }}>
          Informations personnelles
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Gérez vos informations de compte</p>
      </div>

      {/* Carte principale - liquid glass */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
                Prénom
              </label>
              <input
                type="text"
                defaultValue={currentUser?.prenom || 'Jean'}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
                Nom
              </label>
              <input
                type="text"
                defaultValue={currentUser?.nom || 'Restaurateur'}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={currentUser?.email || 'jean.restaurateur@match.fr'}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Téléphone
            </label>
            <input
              type="tel"
              defaultValue={currentUser?.telephone || '06 12 34 56 78'}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Société
            </label>
            <input
              type="text"
              defaultValue="Le Sport Bar SARL"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
              style={{ fontWeight: '600' }}
            >
              Enregistrer les modifications
            </button>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all"
                style={{ fontWeight: '600' }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}