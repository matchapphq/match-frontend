import { User, LogOut } from 'lucide-react';
import { PageType } from '../App';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { NotificationsPopup } from './NotificationsPopup';

interface HeaderProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="max-w-[95%] mx-auto">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#5a03cf]/5 via-white/10 to-[#9cff02]/5 backdrop-blur-2xl border-2 border-black/15 rounded-3xl px-6 py-3 shadow-2xl">
          {/* Menu de gauche */}
          <div className="flex items-center gap-3">
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
              <button
                onClick={() => onNavigate('mes-matchs')}
                className={`px-4 py-2 rounded-full backdrop-blur-xl transition-all text-sm ${
                  currentPage === 'mes-matchs'
                    ? 'bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white'
                    : 'bg-white text-gray-900 hover:bg-white/90 hover:text-[#5a03cf]'
                }`}
                style={{ fontWeight: '600' }}
              >
                Mes matchs
              </button>
            </div>
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
              <button
                onClick={() => onNavigate('mes-restaurants')}
                className={`px-4 py-2 rounded-full backdrop-blur-xl transition-all text-sm ${
                  currentPage === 'mes-restaurants'
                    ? 'bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white'
                    : 'bg-white text-gray-900 hover:bg-white/90 hover:text-[#5a03cf]'
                }`}
                style={{ fontWeight: '600' }}
              >
                Mes lieux
              </button>
            </div>
          </div>

          {/* Logo au centre */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <img 
              src={logo} 
              alt="Match" 
              className="h-12" 
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </button>

          {/* Parrainage, notifications et compte à droite */}
          <div className="flex items-center gap-3">
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
              <button
                onClick={() => onNavigate('parrainage')}
                className="px-4 py-2 bg-white backdrop-blur-xl rounded-full text-gray-900 hover:bg-white/90 hover:text-[#5a03cf] transition-all text-sm"
                style={{ fontWeight: '600' }}
              >
                Parrainer un lieu
              </button>
            </div>

            {/* Notifications */}
            <NotificationsPopup />
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-14 h-14 rounded-full border-2 border-white/40 hover:border-[#5a03cf] transition-all shadow-lg hover:shadow-xl overflow-hidden backdrop-blur-md bg-white/20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1743247299142-8f1c919776c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGF2YXRhciUyMHByb2ZpbGV8ZW58MXx8fHwxNzY3MDE0NTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Menu déroulant */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-gray-200/50 overflow-hidden z-50">
                  {/* Bordure dégradée */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 pointer-events-none"></div>
                  
                  {/* Bloc identité utilisateur */}
                  <div className="relative z-10 p-4 border-b border-gray-200/30">
                    <p className="text-gray-600 text-sm">Connecté en tant que</p>
                    <p className="text-lg" style={{ fontWeight: '700', color: '#5a03cf' }}>
                      {currentUser?.prenom} {currentUser?.nom}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{currentUser?.email}</p>
                  </div>
                  
                  {/* Action "Mon compte" */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('compte');
                    }}
                    className="relative z-10 w-full px-4 py-3 text-left hover:bg-white/40 transition-all flex items-center gap-2 text-gray-700"
                    style={{ fontWeight: '600' }}
                  >
                    <User className="w-4 h-4" />
                    Mon compte
                  </button>
                  
                  {/* Séparateur discret */}
                  <div className="h-2"></div>
                  
                  {/* Action "Se déconnecter" */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="relative z-10 w-full px-4 py-3 text-left hover:bg-red-50/50 transition-all flex items-center gap-2 text-red-500"
                    style={{ fontWeight: '600' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}