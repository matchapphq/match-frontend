import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';
import { 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield, 
  Database, 
  HelpCircle, 
  ChevronRight,
  ChevronLeft,
  LogOut,
  Mail,
  Phone
} from 'lucide-react';

interface CompteProps {
  onNavigate?: (page: PageType) => void;
}

export function Compte({ onNavigate }: CompteProps) {
  const { logout, currentUser } = useAuth();

  const menuSections = [
    { 
      label: 'Mon profil', 
      description: 'Informations personnelles et coordonnées', 
      page: 'compte-infos' as PageType,
      icon: User,
      color: 'purple' as const
    },
    { 
      label: 'Mes établissements', 
      description: 'Gestion de vos lieux, visibilité et paramètres', 
      page: 'mes-restaurants' as PageType, // Changed from 'mes-lieux' to match App.tsx routing
      icon: Building2,
      color: 'blue' as const
    },
    { 
      label: 'Facturation & abonnement', 
      description: 'Abonnement actif, moyen de paiement, factures', 
      page: 'compte-facturation' as PageType,
      icon: CreditCard,
      color: 'green' as const
    },
    { 
      label: 'Notifications', 
      description: 'Paramètres de notifications et préférences', 
      page: 'compte-notifications' as PageType,
      icon: Bell,
      color: 'orange' as const
    },
    { 
      label: 'Sécurité', 
      description: 'Mot de passe et sécurité du compte', 
      page: 'compte-securite' as PageType,
      icon: Shield,
      color: 'red' as const
    },
    { 
      label: 'Données & confidentialité', 
      description: 'Export des données, RGPD', 
      page: 'compte-donnees' as PageType,
      icon: Database,
      color: 'gray' as const
    },
    { 
      label: 'Aide et support', 
      description: 'Documentation, FAQ et assistance', 
      page: 'compte-aide' as PageType,
      icon: HelpCircle,
      color: 'indigo' as const
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="p-4 lg:p-6 xl:p-8 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl lg:text-2xl xl:text-3xl text-gray-900 dark:text-white">Paramètres du compte</h1>
          </div>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 lg:ml-0 ml-14">Gérez vos informations et préférences</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 lg:p-6 xl:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-xl lg:text-2xl font-semibold">
                {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h2 className="text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-semibold">
                {currentUser?.prenom} {currentUser?.nom}
              </h2>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span className="truncate">{currentUser?.email}</span>
                </div>
                {currentUser?.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span>{currentUser.telephone}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('compte-infos')}
              className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-sm lg:text-base font-medium"
            >
              Modifier
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
          {menuSections.map((section, index) => {
            const Icon = section.icon;
            const iconColorClass = 
              section.color === 'purple' ? 'bg-[#5a03cf]/10 text-[#5a03cf]' :
              section.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
              section.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
              section.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
              section.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
              section.color === 'gray' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
              'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';

            return (
              <button
                key={index}
                onClick={() => onNavigate && onNavigate(section.page)}
                className="group w-full bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-lg hover:shadow-[#5a03cf]/5 transition-all p-4 lg:p-6 text-left"
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-0.5 lg:mb-1 group-hover:text-[#5a03cf] transition-colors">
                      {section.label}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 lg:line-clamp-none">{section.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#5a03cf] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full bg-white dark:bg-gray-900 border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl p-5 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-900 transition-all flex items-center justify-center gap-2 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}