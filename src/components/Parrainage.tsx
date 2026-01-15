import { Gift, Users, Zap, Share2, CheckCircle, TrendingUp, Copy } from 'lucide-react';
import { useState } from 'react';

export function Parrainage() {
  const [email, setEmail] = useState('');

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation envoyée à ${email}`);
    setEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://match-app.fr/parrainage/jean-restaurateur-xyz123');
    alert('Lien copié !');
  };

  const parrainages = [
    { id: 1, nom: 'Le Comptoir Sport', statut: 'En attente', date: '05/12/2024' },
    { id: 2, nom: 'Bar des Amis', statut: 'Accepté', date: '28/11/2024', boosts: 5 },
    { id: 3, nom: 'La Taverne', statut: 'Accepté', date: '15/11/2024', boosts: 5 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* 2️⃣ Titre "Parrainez un lieu" - sans icône, titre plus gros */}
      <div className="mb-8">
        <div className="mb-2">
          <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Parrainez un lieu
          </h1>
          <p className="text-lg text-gray-700">Gagnez des boosts en parrainant d&apos;autres restaurants</p>
        </div>
      </div>

      {/* 5️⃣ Formulaire d'invitation - déplacé avant "Comment ça marche" */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-gray-200/50 p-8 mb-8">
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/50 focus:border-transparent bg-white/90 backdrop-blur-sm"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:opacity-90 transition-all italic shadow-md"
            style={{ fontWeight: '600' }}
          >
            Envoyer l&apos;invitation
          </button>
        </form>

        {/* Lien avec style code + icône copier */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-2" style={{ fontWeight: '600' }}>
            Votre lien de parrainage :
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-[#5a03cf] bg-white px-3 py-2 rounded-lg border border-gray-200 break-all font-mono">
              https://match-app.fr/parrainage/jean-restaurateur-xyz123
            </code>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 flex-shrink-0"
              style={{ fontWeight: '600' }}
            >
              <Copy className="w-4 h-4" />
              Copier
            </button>
          </div>
        </div>
      </div>

      {/* 3️⃣ Bloc "Comment ça marche ?" en liquid glass */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-md border border-gradient-to-r from-[#9cff02]/30 to-[#5a03cf]/30 relative overflow-hidden">
        {/* Bordure dégradée */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="mb-6 text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Comment ça marche ?
          </h2>
          
          {/* 3 étapes avec hauteur réduite */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              {/* Icône ronde avec dégradé léger */}
              <div className="bg-gradient-to-br from-[#9cff02]/30 to-[#5a03cf]/30 p-2.5 rounded-full flex-shrink-0">
                <Share2 className="w-5 h-5 text-[#5a03cf]" />
              </div>
              <div>
                <h3 className="mb-1 text-gray-900" style={{ fontWeight: '600' }}>1. Partagez votre lien</h3>
                <p className="text-gray-600 text-sm">
                  Invitez un autre restaurateur à rejoindre Match via votre lien de parrainage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="bg-gradient-to-br from-[#9cff02]/30 to-[#5a03cf]/30 p-2.5 rounded-full flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-[#5a03cf]" />
              </div>
              <div>
                <h3 className="mb-1 text-gray-900" style={{ fontWeight: '600' }}>2. Il s&apos;inscrit</h3>
                <p className="text-gray-600 text-sm">
                  Le restaurateur crée son compte et équipe son premier établissement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <div className="bg-gradient-to-br from-[#9cff02]/30 to-[#5a03cf]/30 p-2.5 rounded-full flex-shrink-0">
                <Zap className="w-5 h-5 text-[#5a03cf]" />
              </div>
              <div>
                <h3 className="mb-1 text-gray-900" style={{ fontWeight: '600' }}>3. Vous gagnez tous les deux</h3>
                <p className="text-gray-600 text-sm">
                  Vous recevez chacun 5 boosts pour maximiser la visibilité de vos matchs
                </p>
              </div>
            </div>
          </div>

          {/* 4️⃣ Bloc "+5 boosts" avec dégradé léger */}
          <div className="bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 backdrop-blur-sm rounded-xl p-6 flex items-center justify-between border border-[#9cff02]/30">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#9cff02] to-[#5a03cf] p-3 rounded-full">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl italic bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent" style={{ fontWeight: '800' }}>
                  +5 boosts
                </p>
                <p className="text-sm text-gray-700">pour chaque parrainage réussi</p>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-[#5a03cf]/30" />
          </div>
        </div>
      </div>

      {/* 6️⃣ Historique des parrainages */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-gray-200/50 overflow-hidden">
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
                className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 shadow-sm"
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
                      <div className="bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 text-[#5a03cf] px-4 py-2 rounded-full flex items-center gap-2 border border-[#9cff02]/30">
                        <Zap className="w-4 h-4" />
                        <span style={{ fontWeight: '700' }}>+{parrainage.boosts} boosts</span>
                      </div>
                    )}
                    <span
                      className={`px-4 py-2 rounded-full ${
                        parrainage.statut === 'Accepté'
                          ? 'bg-green-100/70 text-green-700 border border-green-200'
                          : 'bg-gray-100/70 text-gray-700 border border-gray-200'
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