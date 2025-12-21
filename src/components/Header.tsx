import { User } from 'lucide-react';
import { PageType } from '../App';
import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

interface HeaderProps {
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
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
          
          <button 
            onClick={() => onNavigate('compte')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}