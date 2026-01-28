import { Bell, Search, Settings } from 'lucide-react';
import { PageType } from '../../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate?: (page: PageType) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {currentPage}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => onNavigate?.('Notifications')}
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => onNavigate?.('Mon Compte')}
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
