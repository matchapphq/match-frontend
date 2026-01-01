import { ArrowLeft, TrendingUp, Zap, Users, Bell, Gift, Sparkles, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageType } from '../App';

interface BoosterProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
}

// Note: Boost history data is not yet available from API
// This will use mock data until boost API endpoints are implemented
const mockMatchsBoostes = [
  { id: 1, equipe1: 'PSG', equipe2: 'OM', date: '15/11/2024', heure: '21:00', resultat: '+87 vues, +24 réservations' },
  { id: 2, equipe1: 'Real Madrid', equipe2: 'Barcelona', date: '10/11/2024', heure: '20:00', resultat: '+142 vues, +31 réservations' },
  { id: 3, equipe1: 'Bayern', equipe2: 'Dortmund', date: '05/11/2024', heure: '18:45', resultat: '+95 vues, +18 réservations' },
];

export function Booster({ onBack, onNavigate }: BoosterProps) {
  const { stats } = useAppContext();
  
  // Use stats from context (API data when available, mock fallback otherwise)
  const boostsDisponibles = stats.boostsDisponibles;
  const matchsBoosted = stats.matchsBoosted;
  const matchsBoostes = mockMatchsBoostes; // TODO: Replace with API data when available

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

      {/* 1️⃣ En-tête "Booster mon match" - sans icône, titre plus gros */}
      <div id="boost-top" className="mb-8">
        <div className="mb-2">
          <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Booster mon match
          </h1>
          <p className="text-lg text-gray-700">Maximisez la visibilité de vos matchs</p>
        </div>
      </div>

      {/* 2️⃣ Statistiques des boosts - transformées en liquid glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Boosts disponibles */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200/50 p-8 relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-gray-700 mb-2 text-lg">Boosts disponibles</p>
              <p className="text-6xl italic bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent" style={{ fontWeight: '800' }}>
                {boostsDisponibles}
              </p>
            </div>
            <button
              onClick={handleBoosterMatch}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:opacity-90 transition-all italic text-lg shadow-md"
              style={{ fontWeight: '700' }}
            >
              Booster un match
            </button>
          </div>
        </div>

        {/* Matchs boostés */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200/50 p-8 relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5a03cf]/10 to-[#9cff02]/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-gray-700 mb-2 text-lg">Matchs boostés</p>
              <p className="text-6xl italic bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent" style={{ fontWeight: '800' }}>
                {matchsBoosted}
              </p>
            </div>
            <button
              onClick={handleParrainer}
              className="w-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white py-4 rounded-xl hover:opacity-90 transition-all italic text-lg shadow-md"
              style={{ fontWeight: '700' }}
            >
              Parrainer un restaurant
            </button>
          </div>
        </div>
      </div>

      {/* 3️⃣ Lien "Voir l'historique des boosts" */}
      <div className="text-center mb-8">
        <button
          onClick={scrollToHistorique}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-all"
          style={{ fontWeight: '600' }}
        >
          Voir l&apos;historique des boosts
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* 5️⃣ Bloc "Comment fonctionne le boost ?" en liquid glass */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-md border border-gray-200/50 relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Comment fonctionne le boost ?
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Le boost est votre atout pour attirer plus de clients ! Voici ce qu&apos;il vous apporte :
            </p>
          </div>

          {/* Sous-cartes glass */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h3 className="mb-2 text-gray-900" style={{ fontWeight: '600' }}>Priorité sur la carte</h3>
              <p className="text-gray-600 text-sm">
                Votre restaurant apparaît en priorité sur la carte de l&apos;application pour ce match
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h3 className="mb-2 text-gray-900" style={{ fontWeight: '600' }}>Notifications ciblées</h3>
              <p className="text-gray-600 text-sm">
                Envoi de notifications ultra personnalisées aux utilisateurs les plus susceptibles de venir
              </p>
            </div>
          </div>

          {/* Ligne "1 boost = 1 match" */}
          <div className="bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 backdrop-blur-sm rounded-xl p-4 border border-[#9cff02]/30">
            <p className="text-center text-lg">
              <span className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent" style={{ fontWeight: '700' }}>1 boost = 1 match</span>
              <span className="text-gray-700"> • Chaque boost est unique et dédié à un match spécifique</span>
            </p>
          </div>
        </div>
      </div>

      {/* 6️⃣ Bloc "Comment obtenir des boosts ?" en liquid glass */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-md border border-gray-200/50 relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-3">
            <h3 className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Comment obtenir des boosts ?
            </h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">
            Les boosts se gagnent uniquement par le parrainage d&apos;un autre lieu de restauration.
          </p>
          
          {/* Carte "Parrainez un restaurant" */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900" style={{ fontWeight: '700' }}>Parrainez un restaurant</p>
                <p className="text-sm text-gray-600">Le parrain et le filleul gagnent chacun</p>
              </div>
              <div className="bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 px-6 py-3 rounded-full border border-[#9cff02]/40">
                <span className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent italic text-xl" style={{ fontWeight: '800' }}>
                  +5 boosts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4️⃣ Historique des matchs boostés */}
      <div id="historique-boosts" className="bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6">
          <h2 className="text-2xl" style={{ fontWeight: '700' }}>
            Historique des boosts utilisés
          </h2>
          <p className="text-white/80">Résultats de vos matchs boostés</p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {matchsBoostes.map((match) => (
              <div
                key={match.id}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 shadow-sm hover:border-[#5a03cf]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-[#5a03cf]" />
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
                  <div className="bg-green-100/70 px-4 py-2 rounded-full text-green-700 border border-green-200" style={{ fontWeight: '700' }}>
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