import { Gift, Users, Zap, Share2, CheckCircle, Copy, Mail, Send, Award, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface ParrainageProps {
  onBack?: () => void;
}

export function Parrainage({ onBack }: ParrainageProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation envoyée à ${email}`);
    setEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://match-app.fr/parrainage/jean-restaurateur-xyz123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parrainages = [
    { id: 1, nom: 'Le Comptoir Sport', statut: 'En attente', date: '05/12/2024', email: 'contact@comptoirsport.fr' },
    { id: 2, nom: 'Bar des Amis', statut: 'Accepté', date: '28/11/2024', boosts: 5, email: 'bar@desamis.fr' },
    { id: 3, nom: 'La Taverne', statut: 'Accepté', date: '15/11/2024', boosts: 5, email: 'contact@lataverne.fr' },
  ];

  const totalBoostsGagnes = parrainages.filter(p => p.statut === 'Accepté').reduce((acc, p) => acc + (p.boosts || 0), 0);
  const parrainagesReussis = parrainages.filter(p => p.statut === 'Accepté').length;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header sticky */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Programme de parrainage</span>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
            <Gift className="w-4 h-4 text-[#9cff02]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Gagnez des boosts</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
            Parrainez et{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              gagnez
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Invitez d'autres restaurateurs et recevez 5 boosts à chaque inscription réussie
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Boosts gagnés</div>
              <div className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent mb-1">
                {totalBoostsGagnes}
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Parrainages réussis</div>
            <div className="text-4xl text-gray-900 dark:text-white">{parrainagesReussis}</div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Invitations envoyées</div>
            <div className="text-4xl text-gray-900 dark:text-white">{parrainages.length}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Invitation Form */}
          <div>
            <h2 className="text-2xl text-gray-900 dark:text-white mb-6">Inviter un restaurateur</h2>
            
            <form onSubmit={handleSendInvitation} className="mb-6">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Adresse email
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@restaurant.fr"
                      className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </form>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">
                Lien de parrainage
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                  match-app.fr/parrainage/jean-xyz123
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-2xl text-gray-900 dark:text-white mb-6">Comment ça marche ?</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf]/10 to-[#7a23ef]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5a03cf] dark:text-[#9cff02]">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-1">Partagez votre lien</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invitez un restaurateur via email ou lien unique
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf]/10 to-[#7a23ef]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5a03cf] dark:text-[#9cff02]">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-1">Il s'inscrit</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Le restaurateur crée son compte et configure son établissement
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf]/10 to-[#7a23ef]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5a03cf] dark:text-[#9cff02]">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-1">Vous gagnez tous les deux</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chacun reçoit 5 boosts pour booster vos matchs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reward highlight */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
              <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-[#5a03cf]" />
                  </div>
                  <div>
                    <div className="text-3xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                      +5 boosts
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">par parrainage réussi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div>
          <h2 className="text-2xl text-gray-900 dark:text-white mb-6">Mes parrainages</h2>
          
          {parrainages.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Aucun parrainage</p>
              <p className="text-sm text-gray-500">
                Invitez votre premier restaurateur pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {parrainages.map((parrainage) => (
                <div
                  key={parrainage.id}
                  className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center text-white flex-shrink-0 text-lg">
                        {parrainage.nom.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white mb-1">{parrainage.nom}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 space-y-0.5">
                          <div className="truncate">{parrainage.email}</div>
                          <div>Invité le {parrainage.date}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {parrainage.statut === 'Accepté' && parrainage.boosts && (
                            <div className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4" />
                              +{parrainage.boosts} boosts
                            </div>
                          )}
                          <div
                            className={`px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm ${
                              parrainage.statut === 'Accepté'
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {parrainage.statut}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
