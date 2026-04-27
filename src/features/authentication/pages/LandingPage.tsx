import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PublicFooter } from '../../../components/PublicFooter';
import { PublicNavbar } from '../../../components/PublicNavbar';
import { useBillingPricing } from '../../../hooks/api/useBilling';
import { formatPricingLabel } from '../../../utils/pricing';

interface LandingPageProps {
  onGetStarted: () => void;
  onAppPresentation?: () => void;
}

const venueTypes = ['bar', 'restaurant', 'brasserie', 'pub'];

export function LandingPage({ onGetStarted, onAppPresentation }: LandingPageProps) {
  const { data: billingPricing } = useBillingPricing();
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = venueTypes[typingIndex] ?? venueTypes[0];
    if (!currentWord) return;

    const isWordComplete = !isDeleting && typedText === currentWord;
    const isDeletionComplete = isDeleting && typedText === '';

    const timeoutId = window.setTimeout(() => {
      if (isWordComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeletionComplete) {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % venueTypes.length);
        return;
      }

      if (isDeleting) {
        setTypedText(currentWord.slice(0, Math.max(typedText.length - 1, 0)));
        return;
      }

      setTypedText(currentWord.slice(0, typedText.length + 1));
    }, isWordComplete ? 2_000 : isDeletionComplete ? 450 : isDeleting ? 90 : 140);

    return () => window.clearTimeout(timeoutId);
  }, [isDeleting, typedText, typingIndex]);

  const features = [
    {
      title: 'Gérez vos diffusions',
      description: 'Annoncez vos matchs à l\'avance et remplissez votre établissement lors des grands événements sportifs.',
    },
    {
      title: 'Boostez votre visibilité',
      description: 'Mettez en avant les matchs clés pour attirer plus de clients lors des moments stratégiques.',
    },
    {
      title: 'Suivez vos performances',
      description: 'Analysez l\'intérêt des fans et optimisez votre programmation avec des statistiques détaillées.',
    },
  ];

  const benefits = [
    'Interface intuitive et rapide',
    'Gestion multi-établissements',
    'Support client réactif',
    'Tarification transparente',
    'Aucun engagement de durée',
    'Mises à jour régulières',
  ];

  const commissionPricingLabel = billingPricing
    ? formatPricingLabel({
        default_rate: billingPricing.default_rate,
        currency: billingPricing.currency,
        unit: billingPricing.unit,
      })
    : 'Tarification à la commission';

  const pricingFeatures = [
    'Gestion illimitée de matchs',
    'Statistiques en temps réel',
    'Support client prioritaire',
    'Facturation selon l’activité réelle de vos lieux',
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      <PublicNavbar />

      <main id="main-content" role="main" className="relative">
        <section className="relative pt-24 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 glass-card rounded-full mb-10 backdrop-blur-2xl">
                <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse shadow-lg shadow-[#9cff02]/50" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pensé pour tous les lieux qui diffusent du sport</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-[1.08] dark:text-white">
                <span className="block whitespace-nowrap">
                  Remplissez votre{' '}
                  <span className="relative inline-block">
                    <span className="text-gradient inline-flex items-center w-[13ch] whitespace-nowrap">
                      {typedText || '\u00A0'}
                      <span className="inline-block w-[2px] h-[0.9em] ml-1 bg-current align-middle animate-pulse" />
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10C52 3 102 1 152 5C202 9 252 7 298 3" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9cff02" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#5a03cf" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
                <span className="block">pendant les matchs</span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Match vous aide à planifier vos diffusions, attirer les bons fans et piloter l&apos;activité de vos lieux en temps réel.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <button
                  onClick={onGetStarted}
                  className="relative px-8 py-4 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-300 shadow-2xl shadow-[#5a03cf]/30 flex items-center gap-2 group hover:scale-105"
                >
                  Rejoindre le mouvement Match
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {onAppPresentation && (
                  <button
                    onClick={onAppPresentation}
                    className="relative px-8 py-4 glass-card rounded-full text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-300 backdrop-blur-2xl gradient-border"
                  >
                    <span className="relative z-10">Voir la démo utilisateur</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-xl mb-3 text-gradient">Inclusif</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bars, restaurants, brasseries et plus</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-xl mb-3 text-gradient">Connecté</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Synchronisation API et données mises à jour</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="text-xl mb-3 text-gradient">Actionnable</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pilotage simple de vos diffusions sportives</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
                Une plateforme complète pour <span className="text-gradient">votre succès</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Tout ce dont vous avez besoin pour gérer vos diffusions sportives et développer votre activité
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="relative group">
                  <div className="glass-card rounded-3xl p-10 backdrop-blur-2xl transition-all duration-500 group-hover:scale-[1.02] gradient-border h-full">
                    <h3 className="text-2xl mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
                  Pourquoi choisir <span className="text-gradient">Match ?</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                  Une solution pensée pour les restaurateurs, avec des fonctionnalités adaptées à vos besoins réels.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 glass-card rounded-2xl p-4 backdrop-blur-xl">
                      <div className="w-1.5 h-1.5 bg-[#9cff02] rounded-full flex-shrink-0 shadow-lg shadow-[#9cff02]/50" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="glass-card rounded-3xl overflow-hidden backdrop-blur-2xl gradient-border">
                  <img
                    src="https://images.unsplash.com/photo-1759694282882-5e9f4e1ad26e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBiYXIlMjByZXN0YXVyYW50JTIwYXRtb3NwaGVyZXxlbnwxfHx8fDE3Njc0Mzk3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Sports bar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
                Tarification <span className="text-gradient">simple et transparente</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Un modèle à la commission, aligné sur l&apos;activité de vos établissements.
              </p>
            </div>

            <div className="h-10 sm:h-14" />

            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="glass-card rounded-3xl p-8 sm:p-9 backdrop-blur-2xl transition-all duration-500 group-hover:scale-[1.02] h-full flex flex-col gradient-border bg-white/80 dark:bg-white/5">
                  <div className="mb-4 min-h-9 flex items-start">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white text-sm rounded-full self-start">
                      <span>Modèle commission</span>
                    </div>
                  </div>
                  <h3 className="text-2xl mb-2 text-gray-900 dark:text-white">Tarif par client présent</h3>
                  <div className="mb-6">
                    <span className="text-4xl text-gray-900 dark:text-white">{commissionPricingLabel}</span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8 flex-grow">
                    {pricingFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl px-3 py-2">
                        <div className="w-1.5 h-1.5 bg-[#9cff02] rounded-full flex-shrink-0 shadow-lg shadow-[#9cff02]/50" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetStarted}
                    className="w-full py-4 rounded-full transition-all duration-300 hover:scale-[1.02] bg-[#5a03cf] text-white hover:bg-[#4a02af] shadow-xl shadow-[#5a03cf]/30"
                  >
                    Rejoindre le mouvement Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-32 my-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#5a03cf]/20 via-[#7a23ef]/20 to-[#9cff02]/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="glass-card-strong rounded-[3rem] p-16 backdrop-blur-2xl gradient-border">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-8 text-gray-900 dark:text-white">
                Et si vos diffusions sportives passaient au niveau supérieur ?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Rejoignez Match pour centraliser vos programmations, gagner du temps opérationnel et attirer plus de clients les soirs de match.
              </p>
              <button
                onClick={onGetStarted}
                className="px-10 py-5 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-300 shadow-2xl shadow-[#5a03cf]/30 flex items-center gap-3 mx-auto group hover:scale-105"
              >
                <span className="text-lg">Rejoindre le mouvement Match</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
