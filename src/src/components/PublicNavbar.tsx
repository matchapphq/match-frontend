import { Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useTheme } from '../features/theme/context/ThemeContext';

export function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const isReferralPage = pathname === '/public-referral';
  const isLoginPage = pathname === '/login';

  return (
    <header className="sticky top-0 z-50 relative backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-b border-[#5a03cf]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" aria-label="Retour à l'accueil">
            <img
              src={logo}
              alt="Match"
              className="h-8 dark:brightness-150"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </Link>

          <div className="flex items-center gap-4">
            {!isHomePage && (
              <Link
                to="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-colors"
              >
                Accueil
              </Link>
            )}
            {!isReferralPage && (
              <Link
                to="/public-referral"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-colors hidden sm:block"
              >
                Parrainer un lieu
              </Link>
            )}
            {!isLoginPage && (
              <Link
                to="/login"
                className="relative px-6 py-2.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-full transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 group gradient-border"
              >
                <span className="relative z-10 text-gray-900 dark:text-white">Connexion</span>
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-full transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 group gradient-border"
              aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
            >
              <span className="relative z-10 text-gray-900 dark:text-white">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#5a03cf]/70 to-transparent dark:hidden" />
    </header>
  );
}
