import { ArrowLeft, Lock, Shield, Key } from 'lucide-react';

interface CompteSecuriteProps {
  onBack: () => void;
}

export function CompteSecurite({ onBack }: CompteSecuriteProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au compte
      </button>

      <div className="mb-8">
        <h1 className="text-gray-900 italic text-4xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Sécurité
        </h1>
        <p className="text-gray-600 text-lg">Gérez la sécurité de votre compte</p>
      </div>

      <div className="space-y-6">
        {/* Changer le mot de passe */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Changer le mot de passe
            </h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>

        {/* Authentification à deux facteurs */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Authentification à deux facteurs
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl hover:shadow-lg transition-all italic" style={{ fontWeight: '600' }}>
            Activer l&apos;authentification à deux facteurs
          </button>
        </div>

        {/* Sessions actives */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Sessions actives
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-4 border border-[#5a03cf]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900" style={{ fontWeight: '600' }}>
                    MacBook Pro • Paris, France
                  </p>
                  <p className="text-gray-600 text-sm">Session actuelle • Dernière activité : Il y a 2 min</p>
                </div>
                <span className="px-3 py-1 bg-[#9cff02] text-[#5a03cf] rounded-full text-sm" style={{ fontWeight: '600' }}>
                  Actif
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900" style={{ fontWeight: '600' }}>
                    iPhone 13 • Lyon, France
                  </p>
                  <p className="text-gray-600 text-sm">Dernière activité : Il y a 2 jours</p>
                </div>
                <button className="text-red-600 hover:text-red-700" style={{ fontWeight: '600' }}>
                  Déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
