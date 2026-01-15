import { Check, MapPin, Search, Sparkles, Star, Smartphone, Navigation, Users, ArrowRight, Trophy, Zap, Target, Moon, Sun } from 'lucide-react';
import { PageType } from '../App';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface AppPresentationProps {
  onNavigate: (page: PageType) => void;
  onBack?: () => void;
}

export function AppPresentation({ onNavigate, onBack }: AppPresentationProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  
  const handleInstallApp = () => {
    alert("Redirection vers l'App Store / Google Play");
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('comment-ca-marche');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-8" 
                style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 glass-card rounded-full hover:scale-110 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[#9cff02]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#5a03cf]" />
                )}
              </button>
              
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-2 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20"
                >
                  {t('common.back')}
                </button>
              )}
              
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5a03cf]/5 via-transparent to-[#9cff02]/5" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">⚽</div>
          <div className="absolute top-40 right-20 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🏀</div>
          <div className="absolute bottom-40 left-1/4 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🏉</div>
          <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🎾</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}>🏐</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-full mb-8">
              <Trophy className="w-4 h-4 text-[#9cff02]" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('app.mobileApp')}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 dark:text-white">
              {t('app.hero.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.hero.title2')}
              </span>
              <span className="inline-block ml-3 text-5xl">⚡</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('app.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleInstallApp}
                className="px-8 py-4 bg-[#5a03cf] text-white rounded-full hover:bg-[#4a02af] transition-all duration-200 shadow-xl shadow-[#5a03cf]/20 flex items-center gap-2 group"
              >
                {t('app.installApp')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="relative px-8 py-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-200 gradient-border"
              >
                {t('app.howItWorks')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sports showcase section */}
      <section className="py-16 bg-white dark:bg-[#1a1a1a] border-y border-gray-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl mb-2 dark:text-white">
              {t('app.sports.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.sports.title2')}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('app.sports.subtitle')}</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">⚽</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.football')}</p>
            </div>
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">🏀</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.basketball')}</p>
            </div>
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">🏉</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.rugby')}</p>
            </div>
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">🎾</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.tennis')}</p>
            </div>
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">🏐</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.volleyball')}</p>
            </div>
            <div className="group text-center">
              <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">🤾</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.sports.handball')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 dark:text-white">
              {t('app.features.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.features.title2')}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('app.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-[#5a03cf]/20 hover:shadow-lg hover:shadow-[#5a03cf]/5 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 dark:text-white">{t('app.features.find.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('app.features.find.desc')}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-[#5a03cf]/20 hover:shadow-lg hover:shadow-[#5a03cf]/5 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 dark:text-white">{t('app.features.realtime.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('app.features.realtime.desc')}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-[#5a03cf]/20 hover:shadow-lg hover:shadow-[#5a03cf]/5 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 dark:text-white">{t('app.features.nearby.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('app.features.nearby.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="comment-ca-marche" className="py-20 bg-gradient-to-br from-[#5a03cf]/5 via-transparent to-[#9cff02]/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 dark:text-white">
              {t('app.howItWorks.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.howItWorks.title2')}
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6 bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center flex-shrink-0 text-white text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl mb-2 dark:text-white">{t('app.howItWorks.step1.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('app.howItWorks.step1.desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center flex-shrink-0 text-white text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl mb-2 dark:text-white">{t('app.howItWorks.step2.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('app.howItWorks.step2.desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center flex-shrink-0 text-white text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl mb-2 dark:text-white">{t('app.howItWorks.step3.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('app.howItWorks.step3.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 dark:text-white">
              {t('app.preview.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.preview.title2')}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('app.preview.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl flex items-center justify-center border border-gray-200/30 dark:border-white/10">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <Navigation className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 dark:text-white mb-1">{t('app.preview.matches.title')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('app.preview.matches.desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl flex items-center justify-center border border-gray-200/30 dark:border-white/10">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 dark:text-white mb-1">{t('app.preview.venue.title')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('app.preview.venue.desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl flex items-center justify-center border border-gray-200/30 dark:border-white/10">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-900 dark:text-white mb-1">{t('app.preview.map.title')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('app.preview.map.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-[#5a03cf]/5 via-transparent to-[#9cff02]/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 dark:text-white">
              {t('app.benefits.title1')}{' '}
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {t('app.benefits.title2')}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 flex items-center gap-4">
              <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[#1a1a1a] dark:text-[#0a0a0a]" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{t('app.benefits.fans')}</p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 flex items-center gap-4">
              <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[#1a1a1a] dark:text-[#0a0a0a]" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{t('app.benefits.friends')}</p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 flex items-center gap-4">
              <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[#1a1a1a] dark:text-[#0a0a0a]" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{t('app.benefits.events')}</p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 flex items-center gap-4">
              <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[#1a1a1a] dark:text-[#0a0a0a]" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{t('app.benefits.discover')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTEyIDQyYzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            {t('app.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-10">
            {t('app.cta.subtitle')}
          </p>
          <button
            onClick={handleInstallApp}
            className="px-8 py-4 bg-white text-[#5a03cf] rounded-full hover:bg-gray-100 transition-all duration-200 shadow-xl flex items-center gap-2 mx-auto group"
          >
            {t('app.cta.button')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1a1a1a] border-t border-gray-200/50 dark:border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-6" 
                style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('app.footer.rights')}
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors">
                {t('app.footer.terms')}
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors">
                {t('app.footer.privacy')}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 z-50">
        <button
          onClick={handleInstallApp}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-full hover:brightness-105 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {t('app.installApp')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}