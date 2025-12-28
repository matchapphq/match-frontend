import { Calendar, Eye, Plus, Zap, Edit, TrendingUp, Users, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface MesMatchsProps {
  onNavigate?: (page: PageType, matchId?: string | number) => void;
  defaultFilter?: 'tous' | 'à venir' | 'terminé';
}

type SortField = 'match' | 'date' | 'heure' | 'statut' | 'places' | 'bar' | null;
type SortOrder = 'asc' | 'desc' | null;

export function MesMatchs({ onNavigate, defaultFilter = 'tous' }: MesMatchsProps) {
  const { getUserMatchs } = useAppContext();
  const { currentUser } = useAuth();
  const [filtre, setFiltre] = useState<'tous' | 'à venir' | 'terminé'>(defaultFilter);
  const [barFilter, setBarFilter] = useState<string>('tous');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Filtrer les matchs pour l'utilisateur connecté
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];

  const handleProgrammerMatch = () => {
    if (onNavigate) {
      onNavigate('programmer-match');
    }
  };

  const handleMatchClick = (matchId: string) => {
    if (onNavigate) {
      onNavigate('match-detail', matchId);
    }
  };

  const handleEditMatch = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('modifier-match', matchId);
    }
  };

  const handleBoostClick = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('booster');
    }
  };

  // Get unique bar names for filter
  const uniqueBars = [...new Set(matchs.map(m => m.restaurant).filter(Boolean))];

  // Calculs dynamiques
  const totalMatchs = matchs.length;
  const moyenneRemplissage = matchs.length > 0
    ? Math.round(matchs.reduce((acc, m) => acc + (m.reservees / m.total) * 100, 0) / matchs.length)
    : 0;

  const stats = [
    { label: 'Total matchs', value: totalMatchs.toString(), icon: Calendar, gradient: 'from-[#5a03cf] to-[#7a23ef]' },
    { label: 'Moyenne de remplissage', value: `${moyenneRemplissage}%`, icon: TrendingUp, gradient: 'from-[#9cff02] to-[#7cdf00]' },
    { label: "Nombre d'impressions", value: '—', icon: Eye, gradient: 'from-[#5a03cf] to-[#7a23ef]' },
  ];

  const matchsFiltres = matchs
    .filter(m => filtre === 'tous' || m.statut === filtre)
    .filter(m => barFilter === 'tous' || m.restaurant === barFilter);

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
      case 'bar':
        aVal = a.restaurant || '';
        bVal = b.restaurant || '';
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
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/80 to-[#9cff02]/10 border border-white/50 rounded-3xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Mes matchs
            </h1>
            <p className="text-gray-600 text-lg">Gérez tous vos matchs programmés</p>
          </div>
          <button
            onClick={handleProgrammerMatch}
            className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
          >
            <Plus className="w-5 h-5" />
            Programmer un match
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-2 border-gray-100 hover:border-[#9cff02] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-gray-600 text-sm" style={{ fontWeight: '500' }}>
                  {stat.label}
                </p>
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-5xl italic text-[#5a03cf]" style={{ fontWeight: '800' }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFiltre('tous')}
          className={`px-6 py-2.5 rounded-full transition-all italic ${
            filtre === 'tous'
              ? 'bg-[#9cff02] text-[#5a03cf]'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
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
        >
          <Eye className="w-4 h-4" />
          Terminés
        </button>

        {/* Bar filter */}
        {uniqueBars.length > 0 && (
          <select
            value={barFilter}
            onChange={(e) => setBarFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
          >
            <option value="tous">Tous les bars</option>
            {uniqueBars.map((bar) => (
              <option key={bar} value={bar}>
                {bar}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('match')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Match
                    <SortIcon field="match" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Date
                    <SortIcon field="date" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('heure')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Heure
                    <SortIcon field="heure" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('statut')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Statut
                    <SortIcon field="statut" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('bar')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Bar
                    <SortIcon field="bar" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('places')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Places disponibles
                    <SortIcon field="places" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedMatchs.map((match) => {
                const percentage = getPercentage(match.reservees, match.total);
                const placesRestantes = getPlacesRestantes(match.reservees, match.total);

                return (
                  <tr 
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className="hover:bg-gray-50/80 hover:shadow-sm transition-all cursor-pointer border-b border-[#EFEFEF]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{match.sport}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 italic" style={{ fontWeight: '700' }}>
                              {match.equipe1} vs {match.equipe2}
                            </p>
                            {match.statut === 'à venir' && (
                              <button
                                onClick={(e) => handleEditMatch(e, match.id)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                title="Modifier le match"
                              >
                                <Edit className="w-4 h-4 text-gray-500 hover:text-[#5a03cf]" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">{match.sportNom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{match.date}</td>
                    <td className="px-6 py-4 text-gray-600">{match.heure}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm italic ${
                          match.statut === 'à venir'
                            ? 'bg-[#9cff02] text-[#5a03cf]'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {match.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700" style={{ fontWeight: '500' }}>
                        {match.restaurant || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-gray-900 mb-1" style={{ fontWeight: '700' }}>
                            {placesRestantes}/{match.total}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {match.reservees} réservées
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-full border-4 border-gray-200 flex items-center justify-center relative flex-shrink-0">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(#9cff02 ${percentage}%, transparent ${percentage}%)`,
                            }}
                          />
                          <div className="absolute inset-1 bg-white rounded-full" />
                          <span className="relative text-gray-900 text-sm z-10" style={{ fontWeight: '700' }}>
                            {percentage}%
                          </span>
                        </div>
                        {match.statut === 'à venir' && (
                          <button
                            onClick={(e) => handleBoostClick(e, match.id)}
                            className="ml-2 px-5 py-2.5 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-full hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                            style={{ fontWeight: '700' }}
                          >
                            <Zap className="w-5 h-5" />
                            Boost
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}