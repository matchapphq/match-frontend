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
          <p className="text-gray-600 dark:text-gray-400">Version applicable aux clients professionnels (établissements)</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Dernière mise à jour : 7 avril 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Identification de Match</h2>
            <p className="text-gray-700 dark:text-gray-300">
              MATCH, SAS au capital de 1 000,00 €, siège social : 4 rue Sainte-Bathilde, 77500 Chelles (France), SIREN 994 446 243, SIRET 994 446 243 00010, TVA intracommunautaire FR48994446243, immatriculée au RCS de Meaux sous le numéro 994 446 243 R.C.S. Meaux.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Objet et champ d&apos;application</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGV régissent la fourniture des services Match aux clients professionnels exploitant des établissements (bars, restaurants et lieux assimilés) via l&apos;espace web Match.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Elles couvrent l&apos;accès à la plateforme, la gestion des établissements et la facturation à la commission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">3. Commande, activation et prérequis de paiement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;activation d&apos;un établissement s&apos;effectue en ligne via la création du lieu et la configuration d&apos;un moyen de paiement Stripe (carte bancaire ou SEPA).
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le client professionnel garantit l&apos;exactitude des informations transmises lors de la commande, de l&apos;ouverture du compte et de l&apos;activation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Tarifs, facturation et paiement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Le prix du service est fixé à <strong>1,15 € par client effectivement check-in</strong> (commission unitaire).
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              La commission due est calculée à partir des check-ins validés sur la plateforme Match.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">5. Facturation par établissement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              La facturation est traitée établissement par établissement. Si un client exploite 3 établissements, la facturation mensuelle est ventilée par établissement et donne lieu à 3 factures correspondantes.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le client demeure responsable de la gestion de ses établissements et de la cohérence des données publiées sur chacun d&apos;eux.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">6. Période de facturation et date de prélèvement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les commissions sont agrégées en fin de mois civil. Le prélèvement est déclenché en fin de mois sur le moyen de paiement enregistré du compte professionnel.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le traitement mensuel est planifié le dernier jour du mois (horaire planifié : 23h55, heure serveur), puis reflété dans l&apos;espace de facturation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">7. Défaut de paiement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              En cas de défaut de paiement, et à défaut de régularisation dans un délai de 7 jours calendaires à compter de l&apos;exigibilité, Match pourra suspendre l&apos;accès au service après mise en demeure par e-mail et/ou courrier recommandé avec accusé de réception.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Match se réserve également le droit de résilier le contrat et d&apos;engager toute action utile au recouvrement des sommes dues.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">8. Obligations du client professionnel</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Le client professionnel s&apos;engage à utiliser le service dans un cadre strictement professionnel et licite, à sécuriser ses accès, et à respecter l&apos;ensemble des obligations réglementaires liées à son activité.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Match agit comme intermédiaire technique. Il appartient exclusivement au client de disposer des licences, abonnements et autorisations nécessaires pour la diffusion de contenus sportifs, audiovisuels ou musicaux au sein de son établissement.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le client garantit Match contre toute réclamation ou sanction liée à une diffusion non autorisée.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">9. Disponibilité et responsabilité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match met en œuvre des moyens raisonnables pour assurer l&apos;accès au service mais n&apos;est tenue qu&apos;à une obligation de moyens. La responsabilité de Match ne peut être engagée en cas d&apos;interruption réseau, d&apos;indisponibilité d&apos;un tiers, de mauvaise configuration du client ou d&apos;usage non conforme.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">10. Suspension et résiliation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut suspendre l&apos;accès au service en cas de non-paiement, fraude, diffusion de contenus illicites, atteinte à la sécurité ou manquement contractuel grave.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut résilier le contrat en cas de manquement grave non réparé dans un délai de 30 jours après notification.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Le client peut résilier en cas de manquement contractuel avéré de Match non réparé dans le même délai de 30 jours après notification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">11. Évolution des tarifs</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut faire évoluer ses tarifs avec un préavis d&apos;au moins 2 mois par e-mail, avec prise d&apos;effet à compter du cycle de facturation suivant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">12. Documents contractuels complémentaires</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGV se lisent avec les CGU et la Politique de confidentialité.
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
            <h2 className="text-xl text-gray-900 dark:text-white">13. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Contact facturation et support : <a className="underline hover:no-underline" href="mailto:support@matchapp.fr">support@matchapp.fr</a>.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Contact juridique : <a className="underline hover:no-underline" href="mailto:data@matchapp.fr">data@matchapp.fr</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">14. Droit applicable et juridiction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence exclusive du Tribunal de commerce du ressort du siège social de Match (Meaux).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
