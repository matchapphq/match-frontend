import { useEffect, useState } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export function Cgv() {
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateShowBackButton = () => setShowBackButton(mediaQuery.matches);
    updateShowBackButton();
    mediaQuery.addEventListener('change', updateShowBackButton);
    return () => mediaQuery.removeEventListener('change', updateShowBackButton);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
        )}

        <div className="text-center mb-8">
          <div
            role="img"
            aria-label="Match"
            className="h-10 w-[178px] mx-auto mb-4"
            style={{
              background: 'linear-gradient(90deg, #7a13ff 0%, #4310d8 52%, #020143 100%)',
              WebkitMaskImage: `url(${logo})`,
              maskImage: `url(${logo})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 mb-4">
            <Receipt className="w-4 h-4 text-[#5a03cf]" />
            <span className="text-sm">Page légale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-3">Conditions Générales de Vente</h1>
          <p className="text-gray-600 dark:text-gray-400">Version applicable aux abonnements professionnels Match</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Dernière mise à jour : 1 mars 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Objet</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes Conditions Générales de Vente encadrent la souscription et l&apos;utilisation des abonnements professionnels proposés par Match pour la gestion et la mise en avant d&apos;établissements sur la plateforme.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Service concerné</h2>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;abonnement Match permet notamment la création et l&apos;administration d&apos;un lieu, l&apos;accès aux fonctionnalités de gestion associées, ainsi qu&apos;aux services de visibilité, de réservation ou d&apos;accompagnement disponibles selon l&apos;offre choisie.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Sauf mention contraire, un abonnement correspond à un seul établissement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">3. Souscription et activation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              La souscription s&apos;effectue en ligne via le parcours de création de lieu et de validation d&apos;abonnement. Le client professionnel s&apos;engage à fournir des informations exactes, complètes et à jour lors de l&apos;ouverture ou de la configuration de son compte.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;activation de l&apos;abonnement intervient après validation du parcours de souscription et confirmation du paiement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Tarifs, facturation et paiement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les tarifs applicables sont ceux affichés au moment de la souscription. Ils sont présentés selon la formule retenue et peuvent être complétés, le cas échéant, par les taxes applicables.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le paiement est réalisé via un prestataire de paiement sécurisé. En choisissant une formule récurrente, le client autorise la facturation selon la cadence associée à l&apos;offre sélectionnée, jusqu&apos;à résiliation dans les conditions prévues ci-dessous.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">5. Durée, renouvellement et résiliation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;abonnement prend effet à compter de sa validation et se renouvelle selon la périodicité choisie lors de la souscription, sauf résiliation effectuée avant la prochaine échéance.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              La résiliation s&apos;effectue depuis les espaces et parcours mis à disposition par Match lorsqu&apos;ils sont disponibles, ou auprès du support si nécessaire. Toute période commencée reste due, sauf disposition contraire indiquée au moment de la souscription.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">6. Client professionnel</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les abonnements visés par cette page sont destinés aux professionnels agissant dans le cadre de leur activité. Le client demeure responsable de l&apos;usage de son compte, de ses accès, des informations diffusées sur son établissement et du respect des lois et réglementations applicables à son activité.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">7. Disponibilité et évolution du service</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match s&apos;efforce d&apos;assurer la disponibilité du service et peut faire évoluer les fonctionnalités, interfaces ou parcours de souscription afin d&apos;améliorer la plateforme, d&apos;en garantir la sécurité ou de respecter ses contraintes techniques et réglementaires.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">8. Support</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pour toute question relative à l&apos;abonnement, à la facturation ou à l&apos;activation d&apos;un établissement, le client peut contacter le support à l&apos;adresse suivante :{' '}
              <a className="underline hover:no-underline" href="mailto:support@matchapp.fr">support@matchapp.fr</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">9. Documents complémentaires</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGV complètent, selon les cas, les Conditions Générales d&apos;Utilisation et la Politique de confidentialité disponibles sur Match.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="/terms"
                className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Voir les CGU
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Voir la politique de confidentialité
              </a>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">10. Mise à jour</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Cette page peut être mise à jour pour refléter l&apos;évolution des offres, du service ou du cadre contractuel applicable. La version publiée sur cette page est la version de référence en vigueur à sa date de mise à jour.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
