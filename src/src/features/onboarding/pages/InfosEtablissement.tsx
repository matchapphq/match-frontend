import { ArrowLeft, Building2, MapPin, Mail, Phone, Users, Store } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../../../types';

interface InfosEtablissementProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  onBarInfoSubmit?: (nomBar: string) => void;
}

export function InfosEtablissement({ onBack, onNavigate, selectedFormule = 'mensuel', onBarInfoSubmit }: InfosEtablissementProps) {
  const [formData, setFormData] = useState({
    nomBar: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: '',
    email: '',
    capacite: '',
    typeEtablissement: 'bar',
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enregistrer le nom du bar
    if (onBarInfoSubmit) {
      onBarInfoSubmit(formData.nomBar);
    }
    // Passer à la page de paiement
    onNavigate('paiement-validation' as PageType);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Bouton retour */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <Building2 className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Informations de votre établissement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ces informations permettront d'afficher et configurer votre bar sur Match.
          </p>
        </div>

        {/* Formulaire en liquid glass */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom du bar */}
            <div>
              <label htmlFor="nomBar" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Nom du bar *
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="nomBar"
                  type="text"
                  value={formData.nomBar}
                  onChange={(e) => updateField('nomBar', e.target.value)}
                  placeholder="Le Sport Bar"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="adresse" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Adresse *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => updateField('adresse', e.target.value)}
                  placeholder="12 Rue de la République"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Ville et Code postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ville" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Ville *
                </label>
                <input
                  id="ville"
                  type="text"
                  value={formData.ville}
                  onChange={(e) => updateField('ville', e.target.value)}
                  placeholder="Paris"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>

              <div>
                <label htmlFor="codePostal" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Code postal *
                </label>
                <input
                  id="codePostal"
                  type="text"
                  value={formData.codePostal}
                  onChange={(e) => updateField('codePostal', e.target.value)}
                  placeholder="75001"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Téléphone du bar
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => updateField('telephone', e.target.value)}
                  placeholder="01 23 45 67 89"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Email de contact public */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Email de contact public
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@lesportbar.fr"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Capacité et Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacite" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Capacité estimée
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="capacite"
                    type="number"
                    value={formData.capacite}
                    onChange={(e) => updateField('capacite', e.target.value)}
                    placeholder="50"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="typeEtablissement" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Type d'établissement
                </label>
                <select
                  id="typeEtablissement"
                  value={formData.typeEtablissement}
                  onChange={(e) => updateField('typeEtablissement', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all"
                >
                  <option key="bar" value="bar">Bar</option>
                  <option key="pub" value="pub">Pub</option>
                  <option key="brasserie" value="brasserie">Brasserie</option>
                  <option key="restaurant" value="restaurant">Restaurant</option>
                  <option key="cafe" value="cafe">Café</option>
                </select>
              </div>
            </div>

            {/* Bouton CTA */}
            <button
              type="submit"
              className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] mt-2"
            >
              Continuer vers le paiement
            </button>
          </form>
        </div>

        {/* Info rassurante */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous pourrez modifier ces informations plus tard dans votre espace.
          </p>
        </div>
      </div>
    </div>
  );
}