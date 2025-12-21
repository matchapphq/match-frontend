import { ArrowLeft, TrendingUp, Zap, Users, Bell, Gift, Sparkles, ChevronDown } from 'lucide-react';
import { STATS } from '../data/mockData';

interface BoosterProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

// Données mockées pour les matchs boostés
const matchsBoostes = [
  { id: 1, equipe1: 'PSG', equipe2: 'OM', date: '15/11/2024', heure: '21:00', resultat: '+87 vues, +24 réservations' },
  { id: 2, equipe1: 'Real Madrid', equipe2: 'Barcelona', date: '10/11/2024', heure: '20:00', resultat: '+142 vues, +31 réservations' },
  { id: 3, equipe1: 'Bayern', equipe2: 'Dortmund', date: '05/11/2024', heure: '18:45', resultat: '+95 vues, +18 réservations' },
];

export function Booster({ onBack, onNavigate }: BoosterProps) {
  const handleParrainer = () => {
    if (onNavigate) {
      onNavigate('parrainage');
    } else {
      alert('Fonctionnalité en construction : Parrainer un restaurant');
    }
  };

  const handleBoosterMatch = () => {
    alert('Sélectionnez un match à booster');
  };

  const scrollToHistorique = () => {
    document.getElementById('historique-boosts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au tableau de bord
      </button>

      <div id="boost-top" className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] p-3 rounded-xl">
            <Zap className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Booster mon match
            </h1>
            <p className="text-gray-600 text-lg">Maximisez la visibilité de vos matchs</p>
          </div>
        </div>
      </div>

      {/* Statistiques des boosts EN PREMIER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#9cff02] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mb-2 text-lg">Boosts disponibles</p>
              <p className="text-6xl italic text-[#5a03cf]" style={{ fontWeight: '800' }}>
                {STATS.boostsDisponibles}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] p-5 rounded-2xl">
              <Zap className="w-12 h-12 text-[#5a03cf]" />
            </div>
          </div>
          <button
            onClick={handleBoosterMatch}
            className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
            style={{ fontWeight: '700' }}
          >
            Booster un match
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#5a03cf] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 mb-2 text-lg">Matchs boostés</p>
              <p className="text-6xl italic text-[#5a03cf]" style={{ fontWeight: '800' }}>
                {STATS.matchsBoosted}
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] p-5 rounded-2xl">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
          <button
            onClick={handleParrainer}
            className="w-full bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
            style={{ fontWeight: '700' }}
          >
            Parrainer un restaurant
          </button>
        </div>
      </div>

      {/* Bouton pour voir l'historique */}
      <div className="text-center mb-8">
        <button
          onClick={scrollToHistorique}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all"
          style={{ fontWeight: '600' }}
        >
          Voir l&apos;historique des boosts
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Carte de présentation du boost */}
      <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#9cff02] p-3 rounded-xl">
            <Sparkles className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div className="flex-1">
            <h2 className="mb-4 text-2xl" style={{ fontWeight: '700' }}>
              Comment fonctionne le boost ?
            </h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Le boost est votre atout pour attirer plus de clients ! Voici ce qu&apos;il vous apporte :
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <TrendingUp className="w-6 h-6 mb-3 text-[#9cff02]" />
            <h3 className="mb-2" style={{ fontWeight: '600' }}>Priorité sur la carte</h3>
            <p className="text-white/80 text-sm">
              Votre restaurant apparaît en priorité sur la carte de l&apos;application pour ce match
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <Bell className="w-6 h-6 mb-3 text-[#9cff02]" />
            <h3 className="mb-2" style={{ fontWeight: '600' }}>Notifications ciblées</h3>
            <p className="text-white/80 text-sm">
              Envoi de notifications ultra personnalisées aux utilisateurs les plus susceptibles de venir
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 mb-6">
          <p className="text-center text-lg">
            <span className="text-[#9cff02]" style={{ fontWeight: '700' }}>1 boost = 1 match</span>
            <span className="text-white/80"> • Chaque boost est unique et dédié à un match spécifique</span>
          </p>
        </div>

        <div className="bg-[#9cff02] text-[#5a03cf] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-7 h-7" />
            <h3 className="text-xl" style={{ fontWeight: '700' }}>
              Comment obtenir des boosts ?
            </h3>
          </div>
          <p className="text-[#5a03cf]/90 mb-4 text-lg">
            Les boosts se gagnent uniquement par le parrainage d&apos;un autre lieu de restauration.
          </p>
          <div className="flex items-center justify-between bg-white/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#5a03cf]" />
              <div>
                <p style={{ fontWeight: '700' }}>Parrainez un restaurant</p>
                <p className="text-sm text-[#5a03cf]/80">Le parrain et le filleul gagnent chacun</p>
              </div>
            </div>
            <div className="bg-[#5a03cf] text-[#9cff02] px-6 py-3 rounded-full italic text-xl" style={{ fontWeight: '700' }}>
              +5 boosts
            </div>
          </div>
        </div>
      </div>

      {/* Historique des matchs boostés */}
      <div id="historique-boosts" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6">
          <h2 className="text-2xl" style={{ fontWeight: '700' }}>
            Historique des boosts utilisés
          </h2>
          <p className="text-white/80">Résultats de vos matchs boostés</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {matchsBoostes.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-5 border border-[#5a03cf]/20 hover:border-[#9cff02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-[#9cff02]" />
                      <p className="text-gray-900 italic text-lg" style={{ fontWeight: '600' }}>
                        {match.equipe1} vs {match.equipe2}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {match.date} à {match.heure}
                    </p>
                    <p className="text-[#5a03cf] text-sm" style={{ fontWeight: '600' }}>
                      {match.resultat}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] px-4 py-2 rounded-full text-[#5a03cf] italic" style={{ fontWeight: '700' }}>
                    Boosté ✓
                  </div>
                </div>
              </div>
            ))}
          </div>

          {matchsBoostes.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun boost utilisé pour le moment</p>
              <p className="text-gray-400 text-sm">
                Boostez votre premier match pour maximiser sa visibilité !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}