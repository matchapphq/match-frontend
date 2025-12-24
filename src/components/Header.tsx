import { User, LogOut } from 'lucide-react';
import { PageType } from '../App';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-[#5a03cf] border-b border-[#4a02af] sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Menu de gauche */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('mes-matchs')}
            className={`px-6 py-2.5 rounded-full transition-all italic ${
              currentPage === 'mes-matchs'
                ? 'bg-[#9cff02] text-[#5a03cf]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Mes matchs
          </button>
          <button
            onClick={() => onNavigate('mes-restaurants')}
            className={`px-6 py-2.5 rounded-full transition-all italic ${
              currentPage === 'mes-restaurants'
                ? 'bg-[#9cff02] text-[#5a03cf]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Mes restaurants
          </button>
        </div>

        {/* Logo au centre */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <img src={logo} alt="Match" className="h-10" />
        </button>

        {/* Parrainage et compte à droite */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('parrainage')}
            className="text-white hover:text-[#9cff02] transition-colors text-sm"
          >
            Je parraine un lieu de restauration
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <User className="w-6 h-6 text-white" />
            </button>

            {/* Menu déroulant */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-[#5a03cf] to-[#9cff02]">
                  <p className="text-white text-sm opacity-90">Connecté en tant que</p>
                  <p className="text-white">{currentUser?.prenom} {currentUser?.nom}</p>
                  <p className="text-white/70 text-xs mt-1">{currentUser?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('compte');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
                >
                  <User className="w-4 h-4" />
                  Mon compte
                </button>
                
                <div className="border-t border-gray-100"></div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}