import { Calendar, Eye, Plus, Zap, Edit, TrendingUp, Users, ArrowUpDown, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface MesMatchsProps {
  onNavigate?: (page: PageType, matchId?: number) => void;
  defaultFilter?: 'tous' | 'à venir' | 'terminé';
}

type SortField = 'match' | 'date' | 'heure' | 'statut' | 'places' | null;
type SortOrder = 'asc' | 'desc' | null;

export function MesMatchs({ onNavigate, defaultFilter = 'à venir' }: MesMatchsProps) {
  const { getUserMatchs } = useAppContext();
  const { currentUser } = useAuth();
  const [filtre, setFiltre] = useState<'tous' | 'à venir' | 'terminé'>(defaultFilter);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Filtrer les matchs pour l'utilisateur connecté
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];

  const handleProgrammerMatch = () => {
    if (onNavigate) {
      onNavigate('programmer-match');
    }
  };

  const handleMatchClick = (matchId: number) => {
    if (onNavigate) {
      onNavigate('match-detail', matchId);
    }
  };

  const handleEditMatch = (e: React.MouseEvent, matchId: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('modifier-match', matchId);
    }
  };

  const handleBoostClick = (e: React.MouseEvent, matchId: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('booster');
    }
  };

  // Calculs dynamiques
  const totalMatchs = matchs.length;
  const moyenneRemplissage = matchs.length > 0
    ? Math.round(matchs.reduce((acc, m) => acc + (m.reservees / m.total) * 100, 0) / matchs.length)
    : 0;

  // Simuler le nombre de demandes en attente par match (à remplacer par vraies données)
  const getDemandesEnAttente = (matchId: number) => {
    // Simuler des données aléatoires pour la démo
    const random = [0, 0, 0, 1, 2, 3];
    return random[matchId % random.length] || 0;
  };

  const stats = [
    { label: 'Total matchs', value: totalMatchs.toString(), icon: Calendar, gradient: 'from-[#5a03cf] to-[#7a23ef]' },
    { label: 'Moyenne de remplissage', value: `${moyenneRemplissage}%`, icon: TrendingUp, gradient: 'from-[#9cff02] to-[#7cdf00]' },
    { label: "Nombre d'impressions", value: `12.4K`, icon: Eye, gradient: 'from-[#5a03cf] to-[#7a23ef]' },
  ];

  const matchsFiltres = filtre === 'tous' 
    ? matchs 
    : matchs.filter(m => m.statut === filtre);

  const handleSort = (field: SortField) => {
    let newOrder: SortOrder = 'asc';
    
    if (sortField === field) {
      if (sortOrder === 'asc') {
        newOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newOrder = null;
      }
    }

    setSortField(newOrder ? field : null);
    setSortOrder(newOrder);
  };

  const sortedMatchs = [...matchsFiltres].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;

    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case 'match':
        aVal = `${a.equipe1} vs ${a.equipe2}`;
        bVal = `${b.equipe1} vs ${b.equipe2}`;
        break;
      case 'date':
        aVal = a.date;
        bVal = b.date;
        break;
      case 'heure':
        aVal = a.heure;
        bVal = b.heure;
        break;
      case 'statut':
        aVal = a.statut;
        bVal = b.statut;
        break;
      case 'places':
        aVal = a.reservees / a.total;
        bVal = b.reservees / b.total;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortOrder === 'asc') {
      return <ArrowUp className="w-4 h-4 text-[#5a03cf]" />;
    }
    return <ArrowDown className="w-4 h-4 text-[#5a03cf]" />;
  };

  const getPercentage = (reservees: number, total: number) => {
    return Math.round((reservees / total) * 100);
  };

  const getPlacesRestantes = (reservees: number, total: number) => {
    return total - reservees;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Bloc principal avec bordure dégradée et liquid glass */}
      <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] mb-8">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          {/* En-tête avec titre et bouton */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-gray-900 italic text-5xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Mes matchs
            </h1>
            <button
              onClick={handleProgrammerMatch}
              className="px-6 py-3 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
              style={{ fontWeight: '700' }}
            >
              <Plus className="w-5 h-5" />
              Programmer un match
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              return (
                <div
                  key={index}
                  className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf]"
                >
                  <div className="bg-white rounded-2xl p-6 h-full flex flex-col justify-center">
                    <p className="text-6xl italic bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent mb-2" style={{ fontWeight: '800' }}>
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm" style={{ fontWeight: '500' }}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFiltre('tous')}
          className={`px-6 py-2.5 rounded-full transition-all italic ${
            filtre === 'tous'
              ? 'bg-[#9cff02] text-[#5a03cf]'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          style={{ fontWeight: '600' }}
        >
          Tous
        </button>
        <button
          onClick={() => setFiltre('à venir')}
          className={`px-6 py-2.5 rounded-full transition-all flex items-center gap-2 italic ${
            filtre === 'à venir'
              ? 'bg-[#9cff02] text-[#5a03cf]'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          style={{ fontWeight: '600' }}
        >
          <Calendar className="w-4 h-4" />
          À venir
        </button>
        <button
          onClick={() => setFiltre('terminé')}
          className={`px-6 py-2.5 rounded-full transition-all flex items-center gap-2 italic ${
            filtre === 'terminé'
              ? 'bg-[#9cff02] text-[#5a03cf]'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          style={{ fontWeight: '600' }}
        >
          <Eye className="w-4 h-4" />
          Terminés
        </button>
      </div>

      {/* Liste des matchs en cartes */}
      <div className="space-y-4">
        {sortedMatchs.map((match) => {
          const percentage = getPercentage(match.reservees, match.total);
          const placesRestantes = getPlacesRestantes(match.reservees, match.total);
          const demandesEnAttente = getDemandesEnAttente(match.id);

          return (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match.id)}
              className="relative p-[3px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Partie gauche : Icône + infos du match */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full flex-shrink-0">
                      <span className="text-3xl">{match.sport}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-gray-900 italic text-2xl" style={{ fontWeight: '700' }}>
                          {match.equipe1} vs {match.equipe2}
                        </h3>
                        {demandesEnAttente > 0 && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm border border-orange-200" style={{ fontWeight: '600' }}>
                            <Clock className="w-3.5 h-3.5" />
                            {demandesEnAttente} en attente
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {match.date} à {match.heure} · {match.sportNom}
                      </p>
                    </div>
                  </div>

                  {/* Partie droite : Places + Actions */}
                  <div className="flex items-center gap-6">
                    {/* Places */}
                    <div className="text-right">
                      <p className="text-gray-500 text-sm mb-1">Places</p>
                      <p className="text-gray-900 text-lg" style={{ fontWeight: '700' }}>
                        {placesRestantes}/{match.total}
                      </p>
                    </div>

                    {/* Cercle de pourcentage avec dégradé */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gray-100"></div>
                      <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                        <defs>
                          <linearGradient id={`gradient-${match.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9cff02" />
                            <stop offset="100%" stopColor="#5a03cf" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="url(#gradient-${match.id})"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-900" style={{ fontWeight: '700', fontSize: '15px' }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Boutons */}
                    {match.statut === 'à venir' && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMatch(e, match.id);
                          }}
                          className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:border-[#5a03cf] hover:text-[#5a03cf] transition-all italic"
                          style={{ fontWeight: '600' }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={(e) => handleBoostClick(e, match.id)}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white rounded-full hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 italic"
                          style={{ fontWeight: '600' }}
                        >
                          <Zap className="w-5 h-5" />
                          Booster
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}