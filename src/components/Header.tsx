import { User, LogOut, Menu, X, Moon, Sun, Calendar } from 'lucide-react';
import { PageType } from '../App';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { NotificationsPopup } from './NotificationsPopup';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const NavButton = ({ page, label, onClick }: { page: PageType; label: string; onClick?: () => void }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          onClick?.();
          onNavigate(page);
          setShowMobileMenu(false);
        }}
        className={`px-4 py-2 rounded-full transition-all duration-200 ${
          isActive
            ? 'bg-[#5a03cf] text-white shadow-lg shadow-[#5a03cf]/20'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-[#5a03cf] dark:hover:text-[#9cff02]'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Match" 
              className="h-8" 
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton page="mes-matchs" label="Mes matchs" />
            <NavButton page="mes-restaurants" label="Mes lieux" />
            <button
              onClick={() => onNavigate('reservations')}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                currentPage === 'reservations'
                  ? 'bg-[#5a03cf] text-white shadow-lg shadow-[#5a03cf]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-[#5a03cf] dark:hover:text-[#9cff02]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Réservations
            </button>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('parrainage')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              Parrainer
            </button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 text-gray-700 dark:text-gray-300"
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <NotificationsPopup />
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white flex items-center justify-center hover:shadow-lg hover:shadow-[#5a03cf]/20 transition-all duration-200"
              >
                {currentUser?.prenom?.charAt(0) || 'U'}
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connecté en tant que</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {currentUser?.prenom} {currentUser?.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{currentUser?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('compte');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <User className="w-4 h-4" />
                      Mon compte
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-sm text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 py-4 space-y-2">
            <NavButton page="mes-matchs" label="Mes matchs" />
            <NavButton page="mes-restaurants" label="Mes lieux" />
            <button
              onClick={() => {
                onNavigate('reservations');
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                currentPage === 'reservations'
                  ? 'bg-[#5a03cf] text-white shadow-lg shadow-[#5a03cf]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Réservations
            </button>
            <button
              onClick={() => {
                onNavigate('parrainage');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Parrainer un lieu
            </button>
            
            {/* Language Toggle - Mobile */}
            <div className="px-4 py-2">
              <LanguageToggle />
            </div>

            <button
              onClick={toggleTheme}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            </button>
            <button
              onClick={() => {
                onNavigate('compte');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Mon compte
            </button>
            <button
              onClick={() => {
                logout();
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 border-t border-gray-200/50 dark:border-gray-700/50 mt-2 pt-4"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
}