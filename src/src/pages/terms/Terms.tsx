import { useEffect, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

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
            <FileText className="w-4 h-4 text-[#5a03cf]" />
            <span className="text-sm">Page légale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-3">Conditions d'utilisation</h1>
          <p className="text-gray-600 dark:text-gray-400">Version placeholder temporaire</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">2. Utilisation du service</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">3. Responsabilités</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-gray-900 dark:text-white">4. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
