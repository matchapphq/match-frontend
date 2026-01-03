import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import api from '../services/api';

interface InfosEtablissementProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  onBarInfoSubmit?: (nomBar: string, venueId: string) => void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Map formule to plan_id
      const planId = selectedFormule === 'annuel' ? 'annual' : 'monthly';
      
      console.log('Creating venue with plan:', planId);
      console.log('Form data:', formData);
      
      // Create venue via API - this now returns checkout_url directly
      const response = await api.createVenue({
        name: formData.nomBar,
        street_address: formData.adresse,
        city: formData.ville,
        postal_code: formData.codePostal,
        country: 'France',
        phone: formData.telephone || undefined,
        email: formData.email || undefined,
        capacity: formData.capacite ? parseInt(formData.capacite, 10) : undefined,
        plan_id: planId,
      });

      console.log('API Response:', response);

      if (response.checkout_url) {
        // Pass bar name to parent for confirmation screen
        if (onBarInfoSubmit) {
          onBarInfoSubmit(formData.nomBar, '');
        }
        console.log('Redirecting to:', response.checkout_url);
        // Redirect directly to Stripe checkout - no need for Facturation page
        window.location.href = response.checkout_url;
      } else {
        console.error('No checkout_url in response:', response);
        throw new Error('Failed to create checkout session - no checkout URL received');
      }
    } catch (err: any) {
      console.error('Venue creation error:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de l\'établissement');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 p-8 relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Bouton retour */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] transition-colors"
            style={{ fontWeight: '600' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au compte
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl italic mb-3" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Informations de votre établissement
          </h1>
          <p className="text-lg text-gray-600">
            Ces informations permettront d'afficher et configurer votre bar sur Match.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Formulaire en liquid glass */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du bar */}
            <div className="space-y-2">
              <label htmlFor="nomBar" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Nom du bar *
              </label>
              <input
                id="nomBar"
                type="text"
                value={formData.nomBar}
                onChange={(e) => updateField('nomBar', e.target.value)}
                placeholder="Le Sport Bar"
                required
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <label htmlFor="adresse" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Adresse *
              </label>
              <input
                id="adresse"
                type="text"
                value={formData.adresse}
                onChange={(e) => updateField('adresse', e.target.value)}
                placeholder="12 Rue de la République"
                required
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Ville et Code postal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="ville" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Ville *
                </label>
                <input
                  id="ville"
                  type="text"
                  value={formData.ville}
                  onChange={(e) => updateField('ville', e.target.value)}
                  placeholder="Paris"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="codePostal" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Code postal *
                </label>
                <input
                  id="codePostal"
                  type="text"
                  value={formData.codePostal}
                  onChange={(e) => updateField('codePostal', e.target.value)}
                  placeholder="75001"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="telephone" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Téléphone du bar
              </label>
              <input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => updateField('telephone', e.target.value)}
                placeholder="01 23 45 67 89"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Email de contact public */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Email de contact public
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@lesportbar.fr"
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
              />
            </div>

            {/* Capacité et Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="capacite" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Capacité estimée
                </label>
                <input
                  id="capacite"
                  type="number"
                  value={formData.capacite}
                  onChange={(e) => updateField('capacite', e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="typeEtablissement" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Type d'établissement
                </label>
                <select
                  id="typeEtablissement"
                  value={formData.typeEtablissement}
                  onChange={(e) => updateField('typeEtablissement', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all"
                >
                  <option value="bar">Bar</option>
                  <option value="pub">Pub</option>
                  <option value="brasserie">Brasserie</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                </select>
              </div>
            </div>

            {/* Bouton CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: '600' }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Création de l'établissement...
                </span>
              ) : (
                'Continuer vers le paiement'
              )}
            </button>
          </form>
        </div>

        {/* Info rassurante */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Vous pourrez modifier ces informations plus tard dans votre espace.
          </p>
        </div>
      </div>
    </div>
  );
}