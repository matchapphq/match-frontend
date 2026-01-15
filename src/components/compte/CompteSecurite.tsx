import { PageType } from '../../App';
import { ArrowLeft } from 'lucide-react';

interface CompteSecuriteProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteSecurite({ onBack }: CompteSecuriteProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* 🔁 Navigation - Retour au compte */}
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
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Sécurité
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Gérez la sécurité de votre compte</p>
      </div>

      {/* Changer le mot de passe */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Changer le mot de passe
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Modifiez votre mot de passe actuel</p>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Mot de passe actuel
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
            style={{ fontWeight: '600' }}
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      {/* Authentification à deux facteurs */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Authentification à deux facteurs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ajoutez une couche de sécurité supplémentaire à votre compte
        </p>

        <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
            Statut actuel
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            L'authentification à deux facteurs est désactivée
          </p>
        </div>

        <button 
          className="px-6 py-3 text-[#5a03cf] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all"
          style={{ fontWeight: '600' }}
        >
          Activer l'authentification à deux facteurs
        </button>
      </div>

      {/* Sessions actives */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Sessions actives
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Gérez les appareils connectés à votre compte</p>

        <div className="space-y-3">
          {/* Session actuelle */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                  MacBook Pro • Paris, France
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Session actuelle • Dernière activité : Il y a 2 min
                </p>
              </div>
              <span 
                className="px-3 py-1 bg-[#9cff02]/20 text-[#5a03cf] rounded-lg border border-[#9cff02]/30 text-sm"
                style={{ fontWeight: '600' }}
              >
                Actif
              </span>
            </div>
          </div>

          {/* Autre session */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                  iPhone 13 • Lyon, France
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Dernière activité : Il y a 2 jours
                </p>
              </div>
              <button 
                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                style={{ fontWeight: '600' }}
              >
                Déconnecter
              </button>
            </div>
          </div>

          {/* Autre session */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                  iPad Air • Marseille, France
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Dernière activité : Il y a 5 jours
                </p>
              </div>
              <button 
                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                style={{ fontWeight: '600' }}
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}