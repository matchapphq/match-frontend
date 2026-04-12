import { useEffect, useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

export function Privacy() {
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
            <Shield className="w-4 h-4 text-[#5a03cf]" />
            <span className="text-sm">Page légale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-3">Politique de confidentialité</h1>
          <p className="text-gray-600 dark:text-gray-400">Dernière mise à jour : 7 avril 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Responsable de traitement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              MATCH (SAS) est responsable du traitement des données personnelles collectées via le site https://matchapp.fr et l&apos;application mobile Match.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Contact confidentialité : <a className="underline hover:no-underline" href="mailto:data@matchapp.fr">data@matchapp.fr</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Données traitées</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Selon votre usage, Match traite notamment : identité de compte (email, nom, prénom, téléphone, photo), rôle de compte, préférences utilisateur, données de réservation, données de facturation professionnelle, et données techniques de session.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Les données techniques peuvent inclure l&apos;adresse IP, le terminal, le navigateur/user-agent, des journaux de sécurité et une localisation de connexion approximative (ville, région, pays) déduite de l&apos;IP.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">3. Données Google (Google Sign-In)</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Si vous utilisez la connexion Google, nous demandons uniquement les scopes OAuth <strong>openid</strong>, <strong>email</strong> et <strong>profile</strong>. Nous ne demandons pas l&apos;accès à Gmail, Drive, Calendar, Contacts ou autres données Google non nécessaires à l&apos;authentification.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Les données Google reçues peuvent inclure : adresse email, prénom/nom, photo de profil, identifiant Google (sub), et éventuellement numéro de téléphone si fourni par Google. Ces données sont utilisées uniquement pour : créer/lier votre compte, vous authentifier, sécuriser l&apos;accès au service et personnaliser votre profil.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Les données Google sont stockées dans nos bases applicatives selon les mêmes standards de sécurité que les autres données compte. Elles ne sont pas vendues ni utilisées pour la publicité ciblée.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Vous pouvez à tout moment révoquer l&apos;accès Google depuis votre compte Google (myaccount.google.com/permissions) et demander la suppression de vos données via <a className="underline hover:no-underline" href="mailto:data@matchapp.fr">data@matchapp.fr</a>.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;utilisation des informations reçues depuis Google respecte la Google API Services User Data Policy, y compris les exigences de Limited Use lorsqu&apos;elles s&apos;appliquent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Données Apple (Sign In with Apple)</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Si vous utilisez Apple, Match traite les informations d&apos;identification renvoyées par Apple (identifiant Apple, email lorsque fourni et vérifié, éléments de profil transmis lors de la première connexion).
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Ces données sont utilisées uniquement pour créer ou lier votre compte, authentifier l&apos;accès et sécuriser la session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">5. Finalités des traitements</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match traite vos données pour : authentification, gestion de compte, gestion des réservations, gestion des établissements, facturation professionnelle, sécurité des sessions, support client, gestion des demandes RGPD, et amélioration du service.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Sur mobile, Match utilise également PostHog pour la mesure d&apos;usage analytique, selon le paramètre de consentement analytics du compte.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">6. Bases légales</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les traitements reposent, selon les cas, sur : l&apos;exécution du contrat (fourniture du service), le respect des obligations légales, l&apos;intérêt légitime (sécurité et fonctionnement), et le consentement lorsqu&apos;il est requis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">7. Destinataires et sous-traitants</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les données peuvent être transmises, dans la limite nécessaire, à des prestataires techniques impliqués dans l&apos;exécution du service, notamment : Stripe (paiement), Google (authentification), Apple (authentification), PostHog (analytics mobile) et des services de géolocalisation IP (ipapi.co, ipwho.is, ipinfo.io) pour la sécurité des sessions.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Match peut également recourir à des prestataires d&apos;hébergement, d&apos;infrastructure et d&apos;envoi d&apos;e-mails strictement nécessaires au fonctionnement du service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">8. Durées de conservation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les données sont conservées pendant la durée nécessaire à la fourniture du service, puis selon les obligations légales applicables.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              En cas de désactivation du compte, les données sont conservées pendant 30 jours avant suppression définitive, avec possibilité de réactivation pendant ce délai.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">9. Vos droits</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité, conformément à la réglementation applicable.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Pour exercer vos droits : <a className="underline hover:no-underline" href="mailto:data@matchapp.fr">data@matchapp.fr</a>. Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">10. Sécurité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match met en œuvre des mesures techniques et organisationnelles adaptées pour protéger les données contre l&apos;accès non autorisé, la perte, l&apos;altération ou la divulgation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">11. Cookies et technologies similaires</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Sur le web, Match utilise des cookies techniques strictement nécessaires à l&apos;authentification et à la sécurité des sessions. Sur mobile, des SDK peuvent être utilisés pour le fonctionnement du service et la mesure d&apos;usage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">12. Modifications</h2>
            <p className="text-gray-700 dark:text-gray-300">
              La présente politique peut évoluer. La version de référence est celle publiée sur cette page à sa date de mise à jour.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
