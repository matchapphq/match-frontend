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
          <p className="text-gray-600 dark:text-gray-400">Dernière mise à jour : 22 février 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Qui sommes-nous</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Match est un service accessible via le site https://matchapp.fr et l&apos;application Match. Cette politique décrit la manière dont nous collectons, utilisons et protégeons les données personnelles des utilisateurs.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Contact confidentialité : <a className="underline hover:no-underline" href="mailto:support@match-app.fr">support@match-app.fr</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Données que nous collectons</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Selon votre usage, nous pouvons collecter : nom, prénom, email, numéro de téléphone, photo de profil, rôle de compte, préférences, données de réservation, et données techniques (adresse IP, logs, appareil, navigateur).
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
              Vous pouvez à tout moment révoquer l&apos;accès Google depuis votre compte Google (myaccount.google.com/permissions) et demander la suppression de vos données via <a className="underline hover:no-underline" href="mailto:support@match-app.fr">support@match-app.fr</a>.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              L&apos;utilisation des informations reçues depuis Google respecte la Google API Services User Data Policy, y compris les exigences de Limited Use lorsqu&apos;elles s&apos;appliquent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Pourquoi nous utilisons vos données</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous traitons vos données pour : créer et sécuriser votre compte, vous authentifier, permettre les réservations et fonctionnalités de l&apos;application, améliorer le service, répondre au support client et respecter nos obligations légales.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Nous n&apos;utilisons pas les données Google pour de la revente de données personnelles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">5. Bases légales</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les traitements reposent selon les cas sur : l&apos;exécution du contrat (fourniture du service), l&apos;intérêt légitime (sécurité et amélioration), le respect d&apos;obligations légales, et votre consentement lorsque nécessaire.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">6. Durée de conservation</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous conservons vos données pendant la durée nécessaire au fonctionnement du service, puis selon les délais légaux applicables. Vous pouvez demander la suppression de votre compte à tout moment, sous réserve des obligations légales de conservation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">7. Partage des données</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Vos données peuvent être partagées uniquement avec des prestataires techniques nécessaires au fonctionnement de Match (hébergement, infrastructure, outils de communication), dans le respect de contrats de confidentialité et de sécurité.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">8. Sécurité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous mettons en place des mesures techniques et organisationnelles adaptées pour protéger vos données contre l&apos;accès non autorisé, l&apos;altération, la perte ou la divulgation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">9. Vos droits</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité de vos données, conformément à la réglementation applicable.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Pour exercer vos droits : <a className="underline hover:no-underline" href="mailto:support@match-app.fr">support@match-app.fr</a>. Vous pouvez également déposer une réclamation auprès de la CNIL (www.cnil.fr).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">10. Modifications</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Cette politique peut évoluer. Toute mise à jour importante sera publiée sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
