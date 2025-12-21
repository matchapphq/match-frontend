import { User, Settings, Bell, HelpCircle, LogOut, Lock } from 'lucide-react';
import { PageType } from '../App';

interface CompteProps {
  onNavigate?: (page: PageType) => void;
}

export function Compte({ onNavigate }: CompteProps) {
  const menuItems = [
    { icon: User, label: 'Informations personnelles', description: 'Gérez vos informations de compte', page: 'compte-infos' as PageType },
    { icon: Settings, label: 'Paramètres', description: 'Configurez vos préférences', page: 'compte-parametres' as PageType },
    { icon: Bell, label: 'Notifications', description: 'Gérez vos notifications', page: 'compte-notifications' as PageType },
    { icon: Lock, label: 'Sécurité', description: 'Mot de passe et sécurité', page: 'compte-securite' as PageType },
    { icon: HelpCircle, label: 'Aide et support', description: 'Besoin d\'aide ?', page: 'compte-aide' as PageType },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Mon compte
        </h1>
        <p className="text-gray-600 text-lg">Gérez vos informations et paramètres</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#9cff02] flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 mb-1">Jean Restaurateur</h2>
            <p className="text-gray-600">jean.restaurateur@match.fr</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onNavigate && onNavigate(item.page)}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:scale-[1.01] flex items-center gap-4 text-left"
            >
              <div className="bg-[#5a03cf]/10 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-[#5a03cf]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>{item.label}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => alert('Déconnexion')}
        className="w-full mt-6 bg-red-50 text-red-600 rounded-lg p-5 hover:bg-red-100 transition-colors flex items-center justify-center gap-3"
      >
        <LogOut className="w-5 h-5" />
        Se déconnecter
      </button>
    </div>
  );
}