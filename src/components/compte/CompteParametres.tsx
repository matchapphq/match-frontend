import { ArrowLeft, Settings, Moon, Globe, Zap } from 'lucide-react';
import { useState } from 'react';

interface CompteParametresProps {
  onBack: () => void;
}

export function CompteParametres({ onBack }: CompteParametresProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoBoost, setAutoBoost] = useState(true);
  const [langue, setLangue] = useState('fr');

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
          Paramètres
        </h1>
        <p className="text-gray-600 text-lg">Configurez vos préférences</p>
      </div>

      <div className="space-y-6">
        {/* Langue */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Langue
            </h2>
          </div>
          <select
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Mode sombre */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-6 h-6 text-[#5a03cf]" />
              <div>
                <h2 className="text-xl mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  Mode sombre
                </h2>
                <p className="text-gray-600 text-sm">
                  Activez le thème sombre pour une meilleure expérience visuelle
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-[#9cff02]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Auto boost */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#5a03cf]" />
              <div>
                <h2 className="text-xl mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  Suggestions de boost automatiques
                </h2>
                <p className="text-gray-600 text-sm">
                  Recevez des suggestions pour booster vos matchs à fort potentiel
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoBoost(!autoBoost)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                autoBoost ? 'bg-[#9cff02]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoBoost ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
          style={{ fontWeight: '600' }}
        >
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
