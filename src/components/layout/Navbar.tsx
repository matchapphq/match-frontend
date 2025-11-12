import { useState, useRef, useLayoutEffect } from 'react';
import { Calendar, User, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthModal } from '../auth/AuthModal';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [eggActive, setEggActive] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);

  const isVenueOwner = profile?.role === 'venue_owner';

  const navigation = isVenueOwner
    ? [
        { name: 'Tableau de bord', id: 'dashboard' },
        { name: 'Mes établissements', id: 'my-venues' },
        { name: 'Réservations', id: 'reservations' },
        { name: 'Clients', id: 'customers' },
      ]
    : [
        { name: 'Parcourir les lieux', id: 'browse' },
        { name: 'Mes réservations', id: 'bookings' },
      ];

    function PitchOverlaySVG() {
    return (
      <svg
        viewBox="0 0 24 240"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <rect x="0" y="1.5" width="24" height="20" className="fill-green-500 rounded-[2px]" rx="2" />
        <g className="stroke-white" fill="none" strokeWidth="1">
          <rect x="2" y="4.5" width="20" height="14" rx="1.5" />
          <line x1="12" y1="4.5" x2="12" y2="18" />
          <circle cx="12" cy="11.5" r="2.8" />
          <rect x="2" y="8" width="3" height="7" />
          <rect x="18.9" y="8" width="3" height="7" />
        </g>
      </svg>
    );
  }

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setVar = () =>
      document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`);

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <nav ref={navRef} className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate(isVenueOwner ? 'dashboard' : 'browse')}
                className="flex items-center space-x-2 group relative"
                aria-label="Accueil"
                onMouseEnter={() => {
                  if (eggActive || hoverTimerRef.current) return;
                  hoverTimerRef.current = window.setTimeout(() => {
                    setEggActive(true);
                    hoverTimerRef.current = null;
                  }, 30000);
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                    hoverTimerRef.current = null;
                  }
                }}
                onFocus={() => {
                  if (eggActive || hoverTimerRef.current) return;
                  hoverTimerRef.current = window.setTimeout(() => {
                    setEggActive(true);
                    hoverTimerRef.current = null;
                  }, 30000);
                }}
                onBlur={() => {
                  if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                    hoverTimerRef.current = null;
                  }
                }}
              >
                <span className="relative inline-flex">
                  {!eggActive && (
                  <Calendar className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  )}
                  {eggActive && (
                    <>
                      <Calendar className="w-8 h-8 text-blue-600/0 group-hover:scale-110 transition-transform" />
                      <PitchOverlaySVG />
                      <span className="absolute inset-0 rounded-md ring-2 ring-green-500/50 animate-[ping_1.4s_ease-out_infinite] pointer-events-none" />
                    </>
                  )}
                </span>

                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Match
                </span>
              </button>

              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        currentPage === item.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full p-2"
                aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>

              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Aller au profil"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {profile?.full_name || 'Profil'}
                    </span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex"
                >
                  Se connecter
                </Button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      currentPage === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Se connecter
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
