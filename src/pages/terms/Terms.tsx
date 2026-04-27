import { useEffect, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/BrandLogo';

export function Terms() {
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
          <BrandLogo className="h-10 w-auto mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 mb-4">
            <FileText className="w-4 h-4 text-[#5a03cf]" />
            <span className="text-sm">Page légale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-3">Conditions Générales d&apos;Utilisation (CGU)</h1>
          <p className="text-gray-600 dark:text-gray-400">Dernière mise à jour : 7 avril 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Éditeur du service</h2>
            <p className="text-gray-700 dark:text-gray-300">
              MATCH, SAS au capital de 1 000,00 €, dont le siège social est situé 4 rue Sainte-Bathilde, 77500 Chelles (France), immatriculée au RCS de Meaux sous le numéro 994 446 243 R.C.S. Meaux, SIREN 994 446 243, SIRET (siège) 994 446 243 00010, TVA intracommunautaire FR48994446243.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Contact juridique et données personnelles : <a className="underline hover:no-underline" href="mailto:data@matchapp.fr">data@matchapp.fr</a>. Support : <a className="underline hover:no-underline" href="mailto:support@matchapp.fr">support@matchapp.fr</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Objet</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGU définissent les conditions d&apos;accès et d&apos;utilisation des services Match accessibles depuis le site https://matchapp.fr et l&apos;application mobile Match.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Elles s&apos;appliquent à l&apos;ensemble des utilisateurs, qu&apos;ils utilisent Match en qualité d&apos;utilisateur final ou de professionnel exploitant un établissement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">3. Acceptation des CGU</h2>
            <p className="text-gray-700 dark:text-gray-300">
              La création d&apos;un compte ou l&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Les CGU sont complétées, selon les usages, par les CGV (page /terms-of-sale) et la Politique de confidentialité (page /privacy).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Description du service et rôles</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match met en relation des utilisateurs et des établissements autour d&apos;événements et de réservations. L&apos;application mobile est orientée utilisateur final (découverte et réservation). L&apos;espace web est orienté professionnels (gestion d&apos;établissement, programmation, suivi d&apos;activité et de facturation).
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;accès à certaines fonctionnalités dépend du rôle du compte (utilisateur, venue_owner, admin).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">5. Compte utilisateur</h2>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;utilisateur s&apos;engage à fournir des informations exactes, complètes et à jour. Il est responsable de la confidentialité de ses identifiants et des actions réalisées depuis son compte.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              En cas de perte de contrôle du compte ou d&apos;accès non autorisé, l&apos;utilisateur doit contacter Match sans délai.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">6. Règles d&apos;utilisation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;utilisateur s&apos;interdit tout usage frauduleux, illicite, trompeur ou portant atteinte aux droits de tiers, à la sécurité du service ou à son bon fonctionnement.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Les contenus et informations publiés via Match restent sous la responsabilité de leur émetteur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">7. Réservations et rôle d&apos;intermédiaire</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match fournit une plateforme technique de mise en relation et de gestion de réservation. Les établissements demeurent responsables de leur offre, de leurs informations, de leurs conditions d&apos;accueil et du traitement opérationnel des réservations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">8. Propriété intellectuelle</h2>
            <p className="text-gray-700 dark:text-gray-300">
              La plateforme Match (code, marques, logos, interfaces, bases de données et éléments graphiques) est protégée par les droits de propriété intellectuelle et demeure la propriété exclusive de Match ou de ses ayants droit.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Toute reproduction, extraction, ingénierie inverse ou création d&apos;un service concurrent à partir des éléments de Match est interdite.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">9. Disponibilité du service</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match met en œuvre des moyens raisonnables pour assurer la disponibilité et la sécurité du service, sans garantie d&apos;absence d&apos;interruption, de ralentissement ou d&apos;erreur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">10. Suspension, désactivation et suppression du compte</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut suspendre ou restreindre l&apos;accès au service en cas d&apos;usage frauduleux, de manquement contractuel ou d&apos;atteinte à la sécurité.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              En cas de désactivation du compte par l&apos;utilisateur, les données sont conservées 30 jours avant suppression définitive ; la réactivation est possible pendant ce délai en se reconnectant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">11. Responsabilité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match est tenue d&apos;une obligation de moyens. Sa responsabilité ne saurait être engagée en cas de dysfonctionnements liés aux réseaux, à l&apos;infrastructure Internet, aux services de tiers, ou à une utilisation non conforme du service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">12. Données personnelles</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les traitements de données personnelles sont décrits dans la Politique de confidentialité accessible sur <a className="underline hover:no-underline" href="/privacy">/privacy</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">13. Modification des CGU</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut mettre à jour les présentes CGU à tout moment. La version en vigueur est celle publiée sur cette page à sa date de mise à jour.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">14. Droit applicable et juridiction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les présentes CGU sont régies par le droit français. Tout litige relève de la compétence exclusive du Tribunal de commerce du ressort du siège social de Match (Meaux).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
