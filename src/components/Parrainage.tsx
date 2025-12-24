import { Gift, Users, Zap, Share2, CheckCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function Parrainage() {
  const [email, setEmail] = useState('');

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation envoyée à ${email}`);
    setEmail('');
  };

  const parrainages = [
    { id: 1, nom: 'Le Comptoir Sport', statut: 'En attente', date: '05/12/2024' },
    { id: 2, nom: 'Bar des Amis', statut: 'Accepté', date: '28/11/2024', boosts: 5 },
    { id: 3, nom: 'La Taverne', statut: 'Accepté', date: '15/11/2024', boosts: 5 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] p-3 rounded-xl">
            <Gift className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Parrainez un lieu
            </h1>
            <p className="text-gray-600 text-lg">Gagnez des boosts en parrainant d&apos;autres restaurants</p>
          </div>
        </div>
      </div>

      {/* Explication du parrainage */}
      <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <h2 className="mb-6 text-2xl" style={{ fontWeight: '700' }}>
          Comment ça marche ?
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="bg-[#9cff02] p-2 rounded-lg flex-shrink-0">
              <Share2 className="w-6 h-6 text-[#5a03cf]" />
            </div>
            <div>
              <h3 className="mb-2" style={{ fontWeight: '600' }}>1. Partagez votre lien</h3>
              <p className="text-white/80">
                Invitez un autre restaurateur à rejoindre Match via votre lien de parrainage
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="bg-[#9cff02] p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#5a03cf]" />
            </div>
            <div>
              <h3 className="mb-2" style={{ fontWeight: '600' }}>2. Il s&apos;inscrit</h3>
              <p className="text-white/80">
                Le restaurateur crée son compte et équipe son premier établissement
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="bg-[#9cff02] p-2 rounded-lg flex-shrink-0">
              <Zap className="w-6 h-6 text-[#5a03cf]" />
            </div>
            <div>
              <h3 className="mb-2" style={{ fontWeight: '600' }}>3. Vous gagnez tous les deux</h3>
              <p className="text-white/80">
                Vous recevez chacun 5 boosts pour maximiser la visibilité de vos matchs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#9cff02] text-[#5a03cf] rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Gift className="w-12 h-12" />
            <div>
              <p className="text-2xl italic" style={{ fontWeight: '700' }}>+5 boosts</p>
              <p className="text-sm">pour chaque parrainage réussi</p>
            </div>
          </div>
          <TrendingUp className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Formulaire d'invitation */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
        <h2 className="text-2xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Inviter un restaurateur
        </h2>
        <p className="text-gray-600 mb-6">
          Envoyez une invitation par email à un restaurateur que vous connaissez
        </p>
        
        <form onSubmit={handleSendInvitation} className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@restaurant.fr"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-lg transition-all italic"
            style={{ fontWeight: '600' }}
          >
            Envoyer l&apos;invitation
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl border border-[#5a03cf]/20">
          <p className="text-sm text-gray-600">
            <span style={{ fontWeight: '600' }}>Votre lien de parrainage :</span>
            <br />
            <span className="text-[#5a03cf] break-all">
              https://match-app.fr/parrainage/jean-restaurateur-xyz123
            </span>
          </p>
        </div>
      </div>

      {/* Historique des parrainages */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6">
          <h2 className="text-2xl" style={{ fontWeight: '700' }}>
            Mes parrainages
          </h2>
          <p className="text-white/80">
            {parrainages.filter(p => p.statut === 'Accepté').length} parrainages réussis
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {parrainages.map((parrainage) => (
              <div
                key={parrainage.id}
                className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-5 border border-[#5a03cf]/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-[#5a03cf]" />
                    <div>
                      <p className="text-gray-900 italic" style={{ fontWeight: '600' }}>
                        {parrainage.nom}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Invité le {parrainage.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {parrainage.statut === 'Accepté' && parrainage.boosts && (
                      <div className="bg-[#9cff02] text-[#5a03cf] px-4 py-2 rounded-full flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span style={{ fontWeight: '700' }}>+{parrainage.boosts} boosts</span>
                      </div>
                    )}
                    <span
                      className={`px-4 py-2 rounded-full ${
                        parrainage.statut === 'Accepté'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                      style={{ fontWeight: '600' }}
                    >
                      {parrainage.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
