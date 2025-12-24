import { ArrowLeft, Users, Calendar, Trophy, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { STATS, CLIENTS_RECENTS } from '../../data/mockData';

interface ClientsDetailProps {
  onBack: () => void;
}

type SortField = 'nom' | 'prenom' | 'match' | 'date' | null;
type SortOrder = 'asc' | 'desc' | null;

export function ClientsDetail({ onBack }: ClientsDetailProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [clientsData, setClientsData] = useState(CLIENTS_RECENTS);

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

    if (newOrder === null) {
      setClientsData(CLIENTS_RECENTS);
    } else {
      const sorted = [...clientsData].sort((a, b) => {
        const aVal = a[field as keyof typeof a];
        const bVal = b[field as keyof typeof b];
        
        if (newOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      setClientsData(sorted);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortOrder === 'asc') {
      return <ArrowUp className="w-4 h-4 text-[#5a03cf]" />;
    }
    return <ArrowDown className="w-4 h-4 text-[#5a03cf]" />;
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

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] p-3 rounded-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 italic">Mes clients</h1>
            <p className="text-gray-600">Statistiques et liste complète</p>
          </div>
        </div>
      </div>

      {/* 4 Statistiques clients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white p-6 rounded-xl shadow-lg">
          <Calendar className="w-6 h-6 mb-3 opacity-80" />
          <p className="text-white/80 text-sm mb-1">Âge moyen</p>
          <p className="italic text-2xl">{STATS.ageMoyen} ans</p>
        </div>

        <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] p-6 rounded-xl shadow-lg">
          <Trophy className="w-6 h-6 mb-3 opacity-80" />
          <p className="text-[#5a03cf]/80 text-sm mb-1">Sport favori</p>
          <p className="italic text-2xl">{STATS.sportFavori}</p>
        </div>

        <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white p-6 rounded-xl shadow-lg">
          <Users className="w-6 h-6 mb-3 opacity-80" />
          <p className="text-white/80 text-sm mb-1">Total clients</p>
          <p className="italic text-2xl">{STATS.clientsTotal.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] p-6 rounded-xl shadow-lg">
          <TrendingUp className="w-6 h-6 mb-3 opacity-80" />
          <p className="text-[#5a03cf]/80 text-sm mb-1">Moyenne/match</p>
          <p className="italic text-2xl">{STATS.moyenneClientsParMatch}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Liste des clients récents
          </h2>
          <p className="text-gray-600 text-sm">30 derniers jours : {clientsData.length} clients</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('nom')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                  >
                    Nom
                    <SortIcon field="nom" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('prenom')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                  >
                    Prénom
                    <SortIcon field="prenom" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('match')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                  >
                    Match
                    <SortIcon field="match" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#5a03cf] transition-colors"
                  >
                    Date
                    <SortIcon field="date" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientsData.map((client) => (
                <tr 
                  key={client.id} 
                  onClick={() => alert(`Détails du client : ${client.prenom} ${client.nom}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-900">{client.nom}</td>
                  <td className="px-6 py-4 text-gray-900">{client.prenom}</td>
                  <td className="px-6 py-4 text-gray-600">{client.match}</td>
                  <td className="px-6 py-4 text-gray-600">{client.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}