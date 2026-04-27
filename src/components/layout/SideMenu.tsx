import { X } from 'lucide-react';
import { PageType } from '../../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: PageType) => void;
}

export function SideMenu({ isOpen, onClose, onNavigate }: SideMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Side Menu */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => {
              onNavigate?.('dashboard');
              onClose();
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Tableau de bord
          </button>
          <button
            onClick={() => {
              onNavigate?.('mes-matchs');
              onClose();
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Mes Matchs
          </button>
          <button
            onClick={() => {
              onNavigate?.('reservations');
              onClose();
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Réservations
          </button>
        </nav>
      </div>
    </>
  );
}
