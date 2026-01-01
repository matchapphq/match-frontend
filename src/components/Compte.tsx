import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';

interface CompteProps {
  onNavigate?: (page: PageType) => void;
}

export function Compte({ onNavigate }: CompteProps) {
  const { logout, currentUser } = useAuth();

  const menuSections = [
    { 
      label: 'Mon profil', 
      description: 'Informations personnelles et coordonnées', 
      page: 'compte-infos' as PageType 
    },
    { 
      label: 'Mes établissements', 
      description: 'Gestion de vos lieux, visibilité et paramètres', 
      page: 'mes-lieux' as PageType 
    },
    { 
      label: 'Facturation & abonnement', 
      description: 'Abonnement actif, moyen de paiement, factures et résiliation', 
      page: 'compte-facturation' as PageType 
    },
    { 
      label: 'Notifications', 
      description: 'Paramètres de notifications et préférences', 
      page: 'compte-notifications' as PageType 
    },
    { 
      label: 'Sécurité', 
      description: 'Mot de passe et sécurité du compte', 
      page: 'compte-securite' as PageType 
    },
    { 
      label: 'Données & confidentialité', 
      description: 'Export des données, suppression du compte, RGPD', 
      page: 'compte-donnees' as PageType 
    },
    { 
      label: 'Aide et support', 
      description: 'Documentation, FAQ et assistance', 
      page: 'compte-aide' as PageType 
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header de la page */}
      <div className="mb-8">
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Mon compte
        </h1>
        <p className="text-gray-600">Gérez vos informations et paramètres</p>
      </div>

      {/* Bloc utilisateur (avatar) */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding p-6 mb-8"
        style={{
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#9cff02] flex items-center justify-center shadow-md">
            <span className="text-white text-xl" style={{ fontWeight: '700' }}>
              {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
              {currentUser?.prenom} {currentUser?.nom}
            </h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Cards des sections */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding mb-8 divide-y divide-gray-200/50"
        style={{
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {menuSections.map((section, index) => (
          <button
            key={index}
            onClick={() => onNavigate && onNavigate(section.page)}
            className="w-full p-5 hover:bg-gray-50/50 transition-all text-left first:rounded-t-2xl last:rounded-b-2xl"
          >
            <p className="text-lg mb-1 italic" style={{ fontWeight: '600', color: '#5a03cf' }}>
              {section.label}
            </p>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </button>
        ))}
      </div>

      {/* 7️⃣ Bouton "Se déconnecter" */}
      <button 
        onClick={logout}
        className="w-full bg-red-50/70 backdrop-blur-sm text-red-500 rounded-xl p-5 hover:bg-red-50 transition-all border border-red-100/50 shadow-sm"
        style={{ fontWeight: '600' }}
      >
        Se déconnecter
      </button>
    </div>
  );
}