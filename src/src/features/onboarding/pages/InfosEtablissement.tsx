import { ArrowLeft, Building2, ChevronDown, Coffee, Loader2, Receipt, ShieldCheck, Sparkles, Store, UtensilsCrossed } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PageType } from '../../../types';
import apiClient from '../../../api/client';
import { saveCheckoutState } from '../../../utils/checkout-state';

interface InfosEtablissementProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  onBarInfoSubmit?: (nomBar: string) => void;
  onCheckoutData?: (url: string, sessionId: string) => void;
  isAddingVenue?: boolean; // True when adding from "Mes lieux" (not onboarding)
}

function formatFrenchPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length > 0 && !digits.startsWith('0')) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

function normalizeFrenchPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length === 9 && /^[1-9]\d{8}$/.test(digits)) {
    digits = `0${digits}`;
  }

  if (!/^0[1-9]\d{8}$/.test(digits)) {
    return null;
  }

  return `+33${digits.slice(1)}`;
}

function sanitizeCapacityInput(value: string): string {
  return value.replace(/[^\d]/g, '');
}

export function InfosEtablissement({ onBack, onNavigate, selectedFormule = 'mensuel', onBarInfoSubmit, onCheckoutData, isAddingVenue = false }: InfosEtablissementProps) {
  const typePickerRef = useRef<HTMLDivElement | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);

  const etablissementTypes = useMemo(() => ([
    {
      value: 'bar',
      label: 'Bar',
      icon: Store,
      iconClass: 'text-[#5a03cf] ring-1 ring-[#5a03cf]/15 dark:text-[#c9a7ff] dark:ring-[#c9a7ff]/20',
      fieldLabel: 'Nom du bar *',
      placeholder: 'Le Sport Bar',
    },
    {
      value: 'pub',
      label: 'Pub',
      icon: Store,
      iconClass: 'text-blue-600 ring-1 ring-blue-200 dark:text-blue-300 dark:ring-blue-900/40',
      fieldLabel: 'Nom du pub *',
      placeholder: 'The Corner Pub',
    },
    {
      value: 'brasserie',
      label: 'Brasserie',
      icon: Building2,
      iconClass: 'text-amber-600 ring-1 ring-amber-200 dark:text-amber-300 dark:ring-amber-900/40',
      fieldLabel: 'Nom de la brasserie *',
      placeholder: 'La Brasserie du Centre',
    },
    {
      value: 'restaurant',
      label: 'Restaurant',
      icon: UtensilsCrossed,
      iconClass: 'text-emerald-600 ring-1 ring-emerald-200 dark:text-emerald-300 dark:ring-emerald-900/40',
      fieldLabel: 'Nom du restaurant *',
      placeholder: 'Le Bistrot du Centre',
    },
    {
      value: 'cafe',
      label: 'Café',
      icon: Coffee,
      iconClass: 'text-orange-600 ring-1 ring-orange-200 dark:text-orange-300 dark:ring-orange-900/40',
      fieldLabel: 'Nom du café *',
      placeholder: 'Le Café des Sports',
    },
  ]), []);

  const selectedType = etablissementTypes.find((type) => type.value === formData.typeEtablissement) || etablissementTypes[0];
  const SelectedTypeIcon = selectedType.icon;
  const successRedirectUrl = `${window.location.origin}${isAddingVenue ? '/my-venues/add/confirmation' : '/onboarding/confirmation'}`;
  const cancelRedirectUrl = `${window.location.origin}${isAddingVenue ? '/my-venues/add/payment' : '/onboarding/payment'}`;
  const venueTypeMap: Record<string, 'sports_bar' | 'pub' | 'restaurant' | 'cafe'> = {
    bar: 'sports_bar',
    pub: 'pub',
    brasserie: 'restaurant',
    restaurant: 'restaurant',
    cafe: 'cafe',
  };
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  const normalizedPhone = formData.telephone.trim() ? normalizeFrenchPhone(formData.telephone) : undefined;

  useEffect(() => {
    if (!isTypeMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (typePickerRef.current && !typePickerRef.current.contains(event.target as Node)) {
        setIsTypeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTypeMenuOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.telephone.trim() && !normalizedPhone) {
      setError('Le numéro de téléphone doit être au format 06 12 34 56 78.');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.nomBar,
        street_address: formData.adresse,
        city: formData.ville,
        postal_code: formData.codePostal,
        country: 'France',
        latitude: 48.8566, // Dummy coordinates
        longitude: 2.3522,
        phone: normalizedPhone,
        email: formData.email || undefined,
        capacity: parseInt(formData.capacite) || 0,
        type: venueTypeMap[formData.typeEtablissement] || 'sports_bar',
        description: `Etablissement de type ${selectedType.label.toLowerCase()}`,
        plan_id: selectedFormule === 'annuel' ? 'annual' : 'monthly',
        success_url: successRedirectUrl,
        cancel_url: cancelRedirectUrl,
      };

      const response = await apiClient.post('/partners/venues', payload);
      const data = response.data;

      if (onBarInfoSubmit) {
        onBarInfoSubmit(formData.nomBar);
      }
      
      if (onCheckoutData && data.checkout_url && data.session_id) {
        onCheckoutData(data.checkout_url, data.session_id);
      }

      // Save checkout state before redirecting to Stripe
      // This helps restore context after Stripe redirect
      saveCheckoutState({
        type: isAddingVenue ? 'add-venue' : 'onboarding',
        venueId: data.venue_id,
        venueName: formData.nomBar,
        formule: selectedFormule,
        sessionId: data.session_id,
        checkoutUrl: data.checkout_url,
        returnPage: isAddingVenue ? 'mes-restaurants' : 'confirmation-onboarding'
      });
      
      onNavigate('paiement-validation' as PageType);
    } catch (err) {
      console.error('Failed to create venue:', err);
      setError('Une erreur est survenue lors de la création de l\'établissement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
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
            Ces informations permettront d'afficher et configurer votre établissement sur Match.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Receipt className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">
                  Détails de l’établissement
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                
                <section className="space-y-4">
                  <div>
                    <h3 className="text-base text-gray-900 dark:text-white">Informations de l&apos;établissement</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Les éléments principaux de votre fiche établissement.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative z-30 min-w-0">
                      <label htmlFor="typeEtablissement" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Type d&apos;établissement
                      </label>
                      <div className="relative" ref={typePickerRef}>
                        <button
                          id="typeEtablissement"
                          type="button"
                          onClick={() => setIsTypeMenuOpen((previousState) => !previousState)}
                          className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#5a03cf] dark:border-gray-700 dark:bg-gray-900"
                        >
                          <SelectedTypeIcon className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
                          <span className="min-w-0 flex-1 truncate text-gray-900 dark:text-white">{selectedType.label}</span>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isTypeMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isTypeMenuOpen && (
                          <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                            {etablissementTypes.map((type) => {
                              const Icon = type.icon;

                              return (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => {
                                    updateField('typeEtablissement', type.value);
                                    setIsTypeMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                                    type.value === formData.typeEtablissement
                                      ? 'bg-[#5a03cf]/10 text-[#5a03cf]'
                                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                  }`}
                                >
                                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transparent ${type.iconClass}`}>
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="block">{type.label}</span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">{type.fieldLabel.replace(' *', '')}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <label htmlFor="nomBar" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                          {selectedType.fieldLabel}
                        </label>
                        <input
                          id="nomBar"
                          name="organization"
                          type="text"
                          autoComplete="organization"
                          value={formData.nomBar}
                          onChange={(e) => updateField('nomBar', e.target.value)}
                          placeholder={selectedType.placeholder}
                          required
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <label htmlFor="capacite" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                          Capacité estimée
                        </label>
                        <input
                          id="capacite"
                          name="capacity"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={formData.capacite}
                          onChange={(e) => updateField('capacite', sanitizeCapacityInput(e.target.value))}
                          placeholder="50"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 border-t border-gray-200/70 pt-6 dark:border-gray-700/70">
                  <div>
                    <h3 className="text-base text-gray-900 dark:text-white">Adresse</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      L&apos;adresse utilisée pour identifier et afficher votre lieu.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="adresse" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                      Adresse *
                    </label>
                    <input
                      id="adresse"
                      name="street-address"
                      type="text"
                      autoComplete="street-address"
                      value={formData.adresse}
                      onChange={(e) => updateField('adresse', e.target.value)}
                      placeholder="12 Rue de la République"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="codePostal" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Code postal *
                      </label>
                      <input
                        id="codePostal"
                        name="postal-code"
                        type="text"
                        autoComplete="postal-code"
                        value={formData.codePostal}
                        onChange={(e) => updateField('codePostal', e.target.value)}
                        placeholder="75001"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="ville" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Ville *
                      </label>
                      <input
                        id="ville"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={formData.ville}
                        onChange={(e) => updateField('ville', e.target.value)}
                        placeholder="Paris"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4 border-t border-gray-200/70 pt-6 dark:border-gray-700/70">
                  <div>
                    <h3 className="text-base text-gray-900 dark:text-white">Contact de l&apos;établissement</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Informations publiques utilisées pour contacter votre lieu.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="telephone" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Téléphone de l&apos;établissement
                      </label>
                      <input
                        id="telephone"
                        name="tel"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.telephone}
                        onChange={(e) => updateField('telephone', formatFrenchPhoneInput(e.target.value))}
                        placeholder="01 23 45 67 89"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="email" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Email de contact public
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="contact@lesportbar.fr"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-600"
                      />
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Création en cours...' : 'Aller vers la confirmation'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">À retenir</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/50 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Les informations du lieu sont préparées ici</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Le nom, l’adresse, le contact et la capacité servent à configurer votre établissement sur Match.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-900/10 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Ces informations restent modifiables</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Vous pourrez ajuster ces données plus tard depuis votre espace compte et vos lieux.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">Suite du parcours</h2>
              </div>

              <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-4 flex-1">
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        1
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Votre établissement est préparé avec les informations saisies ici.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        2
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vous passez ensuite à la confirmation et au paiement.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        3
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        L’activation du lieu se poursuit une fois la souscription finalisée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
