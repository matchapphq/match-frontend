import { ArrowLeft, User, Mail, Phone, Building } from 'lucide-react';

interface CompteInfosProps {
  onBack: () => void;
}

export function CompteInfos({ onBack }: CompteInfosProps) {
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
          Informations personnelles
        </h1>
        <p className="text-gray-600 text-lg">Gérez vos informations de compte</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#5a03cf]" />
                  Prénom
                </div>
              </label>
              <input
                type="text"
                defaultValue="Jean"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#5a03cf]" />
                  Nom
                </div>
              </label>
              <input
                type="text"
                defaultValue="Restaurateur"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#5a03cf]" />
                Email
              </div>
            </label>
            <input
              type="email"
              defaultValue="jean.restaurateur@match.fr"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#5a03cf]" />
                Téléphone
              </div>
            </label>
            <input
              type="tel"
              defaultValue="06 12 34 56 78"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-[#5a03cf]" />
                Société
              </div>
            </label>
            <input
              type="text"
              defaultValue="Le Sport Bar SARL"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
