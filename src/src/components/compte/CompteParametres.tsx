import { useState } from 'react';
import { PageType } from '../../types';

interface CompteParametresProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteParametres({ onBack }: CompteParametresProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoBoost, setAutoBoost] = useState(true);
  const [langue, setLangue] = useState('fr');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* 🔁 Navigation - Retour au compte */}
      {onBack && (
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-[#5a03cf] mb-8 transition-colors"
          style={{ fontWeight: '600' }}
        >
          ← Retour au compte
        </button>
      )}

      {/* Header de la page */}
      <div className="mb-12">
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Paramètres
        </h1>
        <p className="text-lg text-gray-700">Configurez vos préférences</p>
      </div>

      {/* Langue */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Langue
        </h2>
        <p className="text-gray-600 mb-6">Choisissez la langue de l'interface</p>
        
        <select
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
          style={{ fontWeight: '600' }}
        >
          <option key="fr" value="fr">Français</option>
          <option key="en" value="en">English</option>
          <option key="es" value="es">Español</option>
        </select>
      </div>

      {/* Mode sombre */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Mode sombre
            </h2>
            <p className="text-gray-600">
              Activez le thème sombre pour une meilleure expérience visuelle
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ml-6 ${
              darkMode ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Auto boost */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Suggestions de boost automatiques
            </h2>
            <p className="text-gray-600">
              Recevez des suggestions pour booster vos matchs à fort potentiel
            </p>
          </div>
          <button
            onClick={() => setAutoBoost(!autoBoost)}
            className={`relative w-14 h-8 rounded-full transition-colors ml-6 ${
              autoBoost ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                autoBoost ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bouton CTA */}
      <button
        className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
        style={{ fontWeight: '600' }}
      >
        Enregistrer les paramètres
      </button>
    </div>
  );
}
