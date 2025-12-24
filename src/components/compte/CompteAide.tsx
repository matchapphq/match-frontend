import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail, Phone } from 'lucide-react';

interface CompteAideProps {
  onBack: () => void;
}

export function CompteAide({ onBack }: CompteAideProps) {
  const faq = [
    {
      question: 'Comment programmer un match ?',
      reponse: 'Rendez-vous dans "Mes matchs" puis cliquez sur "Programmer un match". Remplissez les informations et validez.'
    },
    {
      question: 'Comment fonctionne le système de boost ?',
      reponse: 'Le boost permet de mettre en avant votre établissement sur l\'application. Vous gagnez des boosts en parrainant d\'autres restaurateurs.'
    },
    {
      question: 'Comment modifier mes informations de restaurant ?',
      reponse: 'Allez dans "Mes restaurants", cliquez sur l\'établissement concerné et modifiez les informations.'
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au compte
      </button>

      <div className="mb-8">
        <h1 className="text-gray-900 italic text-4xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Aide et support
        </h1>
        <p className="text-gray-600 text-lg">Nous sommes là pour vous aider</p>
      </div>

      {/* Contact rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl p-6 text-left hover:scale-105 transition-all shadow-lg">
          <MessageCircle className="w-8 h-8 mb-3" />
          <h3 className="text-xl mb-2" style={{ fontWeight: '700' }}>
            Chat en direct
          </h3>
          <p className="text-white/80">Discutez avec notre équipe support</p>
        </button>

        <button className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl p-6 text-left hover:scale-105 transition-all shadow-lg">
          <Mail className="w-8 h-8 mb-3" />
          <h3 className="text-xl mb-2" style={{ fontWeight: '700' }}>
            Email
          </h3>
          <p className="text-[#5a03cf]/80">support@match-app.fr</p>
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Book className="w-6 h-6 text-[#5a03cf]" />
          <h2 className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-5 border border-[#5a03cf]/20"
            >
              <h3 className="text-gray-900 mb-2" style={{ fontWeight: '600' }}>
                {item.question}
              </h3>
              <p className="text-gray-600">{item.reponse}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Centre d'aide */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-[#5a03cf]" />
          <h2 className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Centre d&apos;aide
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Consultez notre documentation complète pour en savoir plus sur Match
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-lg transition-all italic" style={{ fontWeight: '600' }}>
          Accéder au centre d&apos;aide
        </button>
      </div>
    </div>
  );
}
