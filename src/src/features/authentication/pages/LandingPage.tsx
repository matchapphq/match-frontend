import { ArrowRight, Moon, Sun } from 'lucide-react';
// import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logo from '../../../../assets/logo.png';
import { useTheme } from '../../theme/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';

interface LandingPageProps {
  onGetStarted: () => void;
  onReferral?: () => void;
  onAppPresentation?: () => void;
}

export function LandingPage({ onGetStarted, onReferral, onAppPresentation }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  // Health check API call
  useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/health');
        console.log('API Health Check:', res.data);
        return res.data;
      } catch (error) {
        console.error('API Health Check Failed:', error);
        throw error;
      }
    }
  });
  
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

  const pricing = [
    {
      name: 'Mensuel',
      price: '30€',
      period: 'par mois',
      features: [
        'Gestion illimitée de matchs',
        'Statistiques en temps réel',
        'Support client prioritaire',
        'Boosts mensuels inclus',
      ],
    },
    {
      name: 'Annuel',
      price: '300€',
      period: 'par an',
      features: [
        'Gestion illimitée de matchs',
        'Statistiques en temps réel',
        'Support client prioritaire',
        'Boosts illimités',
        '2 mois offerts',
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Match" 
                className="h-8 dark:brightness-150" 
                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
              />
            </div>
            
            <div className="flex items-center gap-4">
              {onReferral && (
                <button
                  onClick={onReferral}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-colors hidden sm:block"
                >
                  Parrainer un lieu
                </button>
              )}
              <button
                onClick={onGetStarted}
                className="relative px-6 py-2.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-full transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 group gradient-border"
              >
                <span className="relative z-10 text-gray-900 dark:text-white">Connexion</span>
              </button>
              <button
                onClick={toggleTheme}
                className="relative p-2.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-full transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 group gradient-border"
                aria-label="Toggle theme"
              >
                <span className="relative z-10 text-gray-900 dark:text-white">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 glass-card rounded-full mb-10 backdrop-blur-2xl">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse shadow-lg shadow-[#9cff02]/50" />
              <span className="text-sm text-gray-700 dark:text-gray-300">100+ établissements partenaires</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-tight dark:text-white">
              Remplissez votre bar<br className="hidden sm:block" /> lors des{' '}
              <span className="relative inline-block">
                <span className="text-gradient">matchs</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C52 3 102 1 152 5C202 9 252 7 298 3" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9cff02" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#5a03cf" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              La plateforme de gestion de diffusions sportives qui connecte votre établissement avec des milliers de fans
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <button
                onClick={onGetStarted}
                className="relative px-8 py-4 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-300 shadow-2xl shadow-[#5a03cf]/30 flex items-center gap-2 group hover:scale-105"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {onAppPresentation && (
                <button
                  onClick={onAppPresentation}
                  className="relative px-8 py-4 glass-card rounded-full text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-300 backdrop-blur-2xl gradient-border"
                >
                  <span className="relative z-10">Voir une démo</span>
                </button>
              )}
            </div>

            {/* Stats - More spaced and elegant */}
            <div className="grid grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="relative group">
                <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl mb-3 text-gradient">100+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Établissements</div>
                </div>
              </div>
              <div className="relative group">
                <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl mb-3 text-gradient">5K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs actifs</div>
                </div>
              </div>
              <div className="relative group">
                <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl mb-3 text-gradient">10+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Villes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Liquid glass design */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
              Une plateforme complète pour{' '}
              <span className="text-gradient">votre succès</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer vos diffusions sportives et développer votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="glass-card rounded-3xl p-10 backdrop-blur-2xl transition-all duration-500 group-hover:scale-[1.02] gradient-border h-full">
                  <h3 className="text-2xl mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Clean and minimal */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
                Pourquoi choisir{' '}
                <span className="text-gradient">Match ?</span>
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

      {/* Pricing Section - Glassmorphism cards */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl mb-6 dark:text-white">
              Tarification{' '}
              <span className="text-gradient">simple et transparente</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              1 établissement = 1 abonnement. Sans engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div 
                key={index}
                className={`relative group ${plan.popular ? 'md:-translate-y-4' : ''}`}
              >
                <div className={`glass-card rounded-3xl p-10 backdrop-blur-2xl transition-all duration-500 group-hover:scale-[1.02] h-full flex flex-col ${
                  plan.popular ? 'gradient-border bg-white/80 dark:bg-white/5' : ''
                }`}>
                  {plan.popular && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white text-sm rounded-full mb-6 self-start">
                      <span>Le plus populaire</span>
                    </div>
                  )}
                  <h3 className="text-3xl mb-3 text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mb-8">
                    <span className="text-5xl text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#9cff02] rounded-full flex-shrink-0 shadow-lg shadow-[#9cff02]/50" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGetStarted}
                    className={`w-full py-4 rounded-full transition-all duration-300 hover:scale-[1.02] ${
                      plan.popular
                        ? 'bg-[#5a03cf] text-white hover:bg-[#4a02af] shadow-xl shadow-[#5a03cf]/30'
                        : 'glass-card text-gray-900 dark:text-white gradient-border backdrop-blur-xl'
                    }`}
                  >
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Liquid glass hero */}
      <section className="relative py-32 my-24 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#5a03cf]/20 via-[#7a23ef]/20 to-[#9cff02]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="glass-card-strong rounded-[3rem] p-16 backdrop-blur-2xl gradient-border">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-8 text-gray-900 dark:text-white">
              Prêt à transformer votre établissement ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les centaines de restaurateurs qui utilisent Match pour optimiser leurs diffusions sportives
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-300 shadow-2xl shadow-[#5a03cf]/30 flex items-center gap-3 mx-auto group hover:scale-105"
            >
              <span className="text-lg">Commencer maintenant</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Minimal and clean */}
      <footer className="relative backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-t border-white/20 dark:border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Match" 
                className="h-6 dark:brightness-150" 
                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 Match. Tous droits réservés.
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-colors">
                Conditions
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-colors">
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}