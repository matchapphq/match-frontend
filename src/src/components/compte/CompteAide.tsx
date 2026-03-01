import { useState, type FormEvent } from 'react';
import { PageType } from '../../types';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Headphones,
  Loader2,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Clock3,
} from 'lucide-react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { API_ENDPOINTS } from '../../utils/api-constants';

interface CompteAideProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteAide({ onBack }: CompteAideProps) {
  const toast = useToast();
  const { currentUser } = useAuth();
  const faq = [
    {
      question: 'Comment programmer un match ?',
      reponse:
        'Rendez-vous dans "Mes matchs" puis cliquez sur "Programmer un match". Remplissez les informations et validez.',
    },
    {
      question: 'Comment fonctionne le système de boost ?',
      reponse:
        "Le boost permet de mettre en avant votre établissement sur l'application. Vous gagnez des boosts en parrainant d'autres restaurateurs.",
    },
    {
      question: 'Comment modifier mes informations de restaurant ?',
      reponse:
        'Allez dans "Mes lieux", cliquez sur l’établissement concerné et modifiez les informations.',
    },
    {
      question: 'Comment gérer mon abonnement ?',
      reponse:
        'Rendez-vous dans "Facturation & abonnement" pour modifier votre formule ou gérer vos paiements.',
    },
    {
      question: 'Comment ajouter un nouvel établissement ?',
      reponse:
        'Depuis "Mes lieux", utilisez l’action d’ajout d’établissement puis complétez les informations demandées comme le nom, l’adresse, les horaires et les services proposés.',
    },
    {
      question: 'Comment modifier les horaires de mon lieu ?',
      reponse:
        'Ouvrez "Mes lieux", sélectionnez l’établissement concerné puis mettez à jour les horaires dans les paramètres du lieu avant d’enregistrer vos modifications.',
    },
    {
      question: 'Pourquoi mon établissement n’apparaît-il pas correctement dans l’application ?',
      reponse:
        'Vérifiez que les informations du lieu sont complètes, que l’adresse est correcte, que les horaires sont renseignés et que le lieu est bien actif dans vos paramètres.',
    },
    {
      question: 'Comment mettre à jour les informations de contact de mon compte ?',
      reponse:
        'Depuis les réglages du compte, vous pouvez mettre à jour vos informations personnelles et les coordonnées associées à votre profil.',
    },
    {
      question: 'Comment changer mon adresse e-mail ?',
      reponse:
        'Accédez aux paramètres du compte puis mettez à jour votre adresse e-mail si l’option est disponible. Si la modification est bloquée, utilisez le formulaire support.',
    },
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      reponse:
        'Depuis l’écran de connexion ou la section sécurité du compte, utilisez l’option de réinitialisation ou de mise à jour du mot de passe.',
    },
    {
      question: 'Comment gérer les réservations reçues ?',
      reponse:
        'Depuis la page Réservations, vous pouvez consulter les demandes, suivre leur statut et retrouver les informations utiles liées à chaque réservation.',
    },
    {
      question: 'Comment améliorer la visibilité de mon établissement ?',
      reponse:
        'Assurez-vous que votre fiche est complète, que vos matchs sont régulièrement programmés et utilisez les leviers de mise en avant disponibles comme le boost si votre compte y a accès.',
    },
    {
      question: 'Comment consulter mes factures ?',
      reponse:
        'La section "Facturation & abonnement" centralise les informations liées à votre formule, vos paiements et les documents de facturation disponibles.',
    },
    {
      question: 'Comment mettre à jour mes informations de facturation ?',
      reponse:
        'Rendez-vous dans les paramètres de facturation pour modifier les informations liées à votre abonnement ou à votre profil de paiement.',
    },
    {
      question: 'Comment suspendre ou modifier mon abonnement ?',
      reponse:
        'Depuis "Facturation & abonnement", vous pouvez consulter votre formule actuelle et effectuer les changements disponibles selon votre type de compte.',
    },
    {
      question: 'Comment gérer mes préférences de notifications ?',
      reponse:
        'Les réglages du compte permettent d’ajuster les préférences e-mail, marketing et autres consentements selon les options disponibles sur votre profil.',
    },
    {
      question: 'Comment demander l’export de mes données personnelles ?',
      reponse:
        'La page "Données & confidentialité" permet de soumettre une demande d’export de vos données personnelles via le formulaire dédié.',
    },
    {
      question: 'Comment supprimer mon compte ?',
      reponse:
        'La demande de suppression se fait depuis "Données & confidentialité". Vérifiez bien les impacts indiqués avant de confirmer la suppression.',
    },
    {
      question: 'Que faire si je rencontre un bug sur la plateforme ?',
      reponse:
        'Utilisez le formulaire support en décrivant précisément le contexte, le parcours suivi et le résultat attendu. Plus les informations sont précises, plus le traitement sera rapide.',
    },
    {
      question: 'Comment obtenir une aide complémentaire si la FAQ ne répond pas à mon besoin ?',
      reponse:
        'Vous pouvez utiliser le formulaire de contact en bas de page pour transmettre votre demande avec un maximum de détails à l’équipe support.',
    },
  ];

  const [openQuestion, setOpenQuestion] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitError, setContactSubmitError] = useState<string | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const normalizedFaqSearch = faqSearch.trim().toLowerCase();
  const defaultFaqLimit = 4;
  const filteredFaq = faq
    .map((item, index) => ({ ...item, index }))
    .filter((item) => {
      if (!normalizedFaqSearch) return true;
      return (
        item.question.toLowerCase().includes(normalizedFaqSearch) ||
        item.reponse.toLowerCase().includes(normalizedFaqSearch)
      );
    });
  const displayedFaq = normalizedFaqSearch
    ? filteredFaq
    : filteredFaq.slice(0, defaultFaqLimit);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contactSubject.trim()) {
      setContactSubmitError('Veuillez renseigner un sujet.');
      return;
    }

    if (!contactMessage.trim()) {
      setContactSubmitError('Veuillez décrire votre demande.');
      return;
    }

    setIsSubmittingContact(true);
    setContactSubmitError(null);

    try {
      await apiClient.post(API_ENDPOINTS.SUPPORT_CONTACT_REQUEST, {
        subject: contactSubject.trim(),
        message: contactMessage.trim(),
      });

      setIsContactSubmitted(true);
      setContactSubject('');
      setContactMessage('');
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Impossible d’envoyer votre demande pour le moment.';
      setContactSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">
              Aide et support
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Retrouvez les réponses rapides, les canaux de contact et l&apos;aide utile pour gérer votre compte.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}

            <a
              href="mailto:support@matchapp.fr?subject=Support%20Match"
              className="px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#5a03cf]/20"
            >
              <Mail className="w-4 h-4" />
              Contacter le support
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#5a03cf]" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">FAQ</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white">{faq.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Réponses rapides</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Support</span>
            </div>
            <div className="text-2xl text-blue-700 dark:text-blue-300">2</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Canaux disponibles</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Disponibilité</span>
            </div>
            <div className="text-2xl text-emerald-700 dark:text-emerald-300">Lun-Ven</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">9h à 18h</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Aide</span>
            </div>
            <div className="text-2xl text-orange-700 dark:text-orange-300">Pro</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Compte, lieux et abonnements</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white mb-1">Questions fréquentes</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les sujets les plus courants pour avancer sans attendre un retour support.
              </p>

              <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex h-12 flex-1 items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 focus-within:ring-2 focus-within:ring-[#5a03cf] transition-all">
                  <Search className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Rechercher dans la FAQ"
                    className="ml-3 h-full w-full border-0 bg-transparent p-0 text-sm leading-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                  />
                </div>

                <a
                  href="#contact-support-form"
                  className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Demander des informations supplémentaires
                </a>
              </div>

              {normalizedFaqSearch && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {filteredFaq.length} résultat{filteredFaq.length > 1 ? 's' : ''} pour “{faqSearch.trim()}”
                </p>
              )}

            </div>

            <div className="p-6 pt-8 space-y-3">
              {filteredFaq.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-6 text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Aucun résultat trouvé dans la FAQ.
                  </p>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Si votre sujet n&apos;apparaît pas ici, vous pouvez transmettre votre demande via le formulaire ci-dessous.
                  </p>
                  <a
                    href="#contact-support-form"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5a03cf] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6a13df] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Ouvrir le formulaire
                  </a>
                </div>
              )}

              {displayedFaq.map((item) => {
                const isOpen = openQuestion === item.index;

                return (
                  <div
                    key={item.question}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? 'border-[#5a03cf]/20 bg-white dark:bg-gray-900 shadow-[0_18px_40px_-28px_rgba(90,3,207,0.45)]'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => setOpenQuestion(isOpen ? -1 : item.index)}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors ${
                        isOpen
                          ? 'bg-gradient-to-r from-[#5a03cf]/[0.07] via-white to-white dark:from-[#5a03cf]/10 dark:via-gray-900 dark:to-gray-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium sm:text-base text-gray-900 dark:text-white">
                          {item.question}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        } ${isOpen ? 'text-[#5a03cf]' : 'text-gray-400 dark:text-gray-500'}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mx-4 my-4">
                        <div className="rounded-2xl bg-white/95 dark:bg-gray-950/90 px-4 py-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 sm:px-5">
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#5a03cf]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#5a03cf]">
                            <BookOpen className="h-3.5 w-3.5" />
                            Réponse
                          </div>
                          <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                            {item.reponse}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="w-12 h-12 bg-[#5a03cf]/10 text-[#5a03cf] rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base text-gray-900 dark:text-white mb-1">Chat en direct</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Cette fonctionnalité sera disponible plus tard. Utilisez le formulaire ci-dessous en attendant.
              </p>
              <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-medium text-center">
                Bientôt disponible
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base text-gray-900 dark:text-white mb-1">Email support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour les demandes détaillées, d&apos;accès compte ou de facturation.
              </p>
              <a
                href="mailto:support@matchapp.fr"
                className="inline-flex items-center gap-2 text-sm text-[#5a03cf] hover:text-[#7a23ef] font-medium"
              >
                support@matchapp.fr
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div
          id="contact-support-form"
          className="relative scroll-mt-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          {!isContactSubmitted && currentUser?.email && (
            <div className="absolute top-6 right-6 z-10 max-w-[240px] rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
              Réponse envoyée à : {currentUser.email}
            </div>
          )}

          <div className={`p-6 border-b border-gray-100 dark:border-gray-800 ${isContactSubmitted ? 'pr-6' : 'pr-6 lg:pr-72'}`}>
            <h2 className="text-lg text-gray-900 dark:text-white mb-1">Formulaire de contact</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Envoyez votre demande avec un peu de contexte. Le support recevra directement votre message.
            </p>
          </div>

          {isContactSubmitted ? (
            <div className="p-6">
              <div className="rounded-[24px] border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-emerald-950/40 dark:via-gray-900 dark:to-sky-950/30 px-6 py-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Demande bien transmise
                </h3>

                <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Votre demande a bien été prise en charge par notre équipe support. Une réponse vous sera apportée sous 48 heures ouvrées.
                </p>

                {currentUser?.email && (
                  <div className="mx-auto mt-6 max-w-md border-t border-emerald-200/80 dark:border-emerald-900/60 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      La réponse sera envoyée à <span className="font-medium text-gray-700 dark:text-gray-200">{currentUser.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all"
                  placeholder="Ex: problème d'accès au compte"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full min-h-[180px] px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all resize-none"
                  placeholder="Décrivez votre demande"
                />
              </div>

              {contactSubmitError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {contactSubmitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white rounded-xl transition-all text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingContact ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Envoyer au support
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
