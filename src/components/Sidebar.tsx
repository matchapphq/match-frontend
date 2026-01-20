import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Settings,
  Gift,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  CalendarCheck,
  Bell
} from 'lucide-react';
import { PageType } from '../App';
import { useState, useEffect } from 'react';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentPage]);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as PageType },
    { name: 'Mes matchs', icon: Calendar, page: 'mes-matchs' as PageType },
    { name: 'Réservations', icon: CalendarCheck, page: 'reservations' as PageType },
    { name: 'Mes lieux', icon: MapPin, page: 'mes-restaurants' as PageType },
    { name: 'Booster', icon: TrendingUp, page: 'booster' as PageType },
    { name: 'Parrainage', icon: Gift, page: 'parrainage' as PageType },
  ];

  const bottomNavigation = [
    { name: 'Paramètres', icon: Settings, page: 'compte' as PageType },
  ];

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 flex flex-col
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <img 
              src={logo} 
              alt="Match" 
              className="h-8" 
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#5a03cf] text-white shadow-lg shadow-[#5a03cf]/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#5a03cf]'
                  }`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-[#5a03cf]" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            title={isCollapsed ? (theme === 'light' ? 'Mode sombre' : 'Mode clair') : undefined}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-[#5a03cf]" />
            ) : (
              <Sun className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-[#5a03cf]" />
            )}
            {!isCollapsed && (
              <span className="text-sm font-medium">
                {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              </span>
            )}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  {currentUser?.prenom?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser?.prenom} {currentUser?.nom}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          )}
          
          {isCollapsed && (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}