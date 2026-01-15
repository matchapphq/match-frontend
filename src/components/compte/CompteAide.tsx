import { PageType } from '../../App';
import { ArrowLeft } from 'lucide-react';

interface CompteAideProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteAide({ onBack }: CompteAideProps) {
  const faq = [
    {
      question: 'Comment programmer un match ?',
      reponse: 'Rendez-vous dans "Mes matchs" puis cliquez sur "Programmer un match". Remplissez les informations et validez.'
    },
    {
      question: 'Comment fonctionne le système de boost ?',
      reponse: "Le boost permet de mettre en avant votre établissement sur l'application. Vous gagnez des boosts en parrainant d'autres restaurateurs."
    },
    {
      question: 'Comment modifier mes informations de restaurant ?',
      reponse: "Allez dans \"Mes lieux\", cliquez sur l'établissement concerné et modifiez les informations."
    },
    {
      question: 'Comment gérer mon abonnement ?',
      reponse: "Rendez-vous dans \"Facturation & abonnement\" pour modifier votre formule ou gérer vos paiements."
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Bouton retour aux paramètres */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retourner aux paramètres du compte
        </button>
      )}

      {/* Header de la page */}
      <div className="mb-12">
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Aide et support
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Nous sommes là pour vous aider</p>
      </div>

      {/* Contact rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 hover:border-gray-300/60 dark:hover:border-gray-600/60 transition-all">
          <h3 className="text-2xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Chat en direct
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Discutez avec notre équipe support en temps réel
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm" style={{ fontWeight: '600' }}>
            Démarrer une conversation
          </button>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 hover:border-gray-300/60 dark:hover:border-gray-600/60 transition-all">
          <h3 className="text-2xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Email
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Contactez-nous par email
          </p>
          <a 
            href="mailto:support@match-app.fr" 
            className="text-[#5a03cf] hover:underline"
            style={{ fontWeight: '600' }}
          >
            support@match-app.fr
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Questions fréquentes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Trouvez rapidement des réponses à vos questions</p>

        <div className="space-y-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30"
            >
              <h3 className="text-gray-900 dark:text-white mb-2" style={{ fontWeight: '600' }}>
                {item.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{item.reponse}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Centre d'aide */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Centre d'aide
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Consultez notre documentation complète pour en savoir plus sur Match
        </p>
        <button 
          className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
          style={{ fontWeight: '600' }}
        >
          Accéder au centre d'aide
        </button>
      </div>

      {/* Support téléphonique */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Support téléphonique
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Disponible du lundi au vendredi de 9h à 18h
        </p>
        <a 
          href="tel:+33123456789" 
          className="text-xl text-[#5a03cf] hover:underline"
          style={{ fontWeight: '700' }}
        >
          01 23 45 67 89
        </a>
      </div>
    </div>
  );
}