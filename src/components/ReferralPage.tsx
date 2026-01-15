import { ArrowRight, Gift, Building2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useState } from 'react';

interface ReferralPageProps {
  onBackToLanding: () => void;
  onGoToLogin?: () => void;
}

export function ReferralPage({ onBackToLanding, onGoToLogin }: ReferralPageProps) {
  const [referralMode, setReferralMode] = useState<'restaurant' | 'particulier'>('particulier');
  const [referralName, setReferralName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const avantagesRestaurant = [
    {
      icon: Gift,
      titre: '1 mois offert',
      description: "Pour chaque parrainage réussi, bénéficiez d'un mois d'abonnement gratuit"
    },
    {
      icon: Gift,
      titre: 'Boosts gratuits',
      description: 'Recevez des crédits de boost pour mettre en avant vos matchs les plus importants'
    },
    {
      icon: Gift,
      titre: 'Visibilité accrue',
      description: 'Plus vous parrainez, plus votre restaurant gagne en visibilité sur la plateforme'
    }
  ];

  const avantagesParticulier = [
    {
      icon: Gift,
      titre: 'Récompenses exclusives',
      description: 'Gagnez des bons de réduction à utiliser dans les restaurants partenaires Match'
    },
    {
      icon: Gift,
      titre: 'Accès prioritaire',
      description: "Bénéficiez d'un accès prioritaire aux événements sportifs dans vos lieux préférés"
    },
    {
      icon: Gift,
      titre: 'Programme fidélité',
      description: 'Plus vous parrainez, plus vous cumulez de points pour des avantages exclusifs'
    }
  ];

  const avantages = referralMode === 'restaurant' ? avantagesRestaurant : avantagesParticulier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center bg-gray-900/20 backdrop-blur-md border border-gray-400/30 rounded-2xl px-6 py-4 shadow-lg">
            <Button
              variant="outline"
              onClick={onBackToLanding}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              ← Retour
            </Button>

            <button onClick={onBackToLanding} className="hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2">
              <img 
                src={logoMatch} 
                alt="Match" 
                className="h-10 md:h-12"
                style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
              />
            </button>

            <div className="w-24"></div> {/* Spacer pour équilibrer */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal de la page */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl text-gray-900 italic mb-6" style={{ fontWeight: '800' }}>
              <span className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent">
                Parrainez un lieu
              </span>
            </h1>
            
            {/* Bandeau informatif 30€ */}
            <div className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] rounded-xl p-[2px] max-w-3xl mx-auto shadow-lg">
              <div className="bg-white rounded-xl p-5">
                <div className="flex items-center justify-center gap-3">
                  <Gift className="w-8 h-8 flex-shrink-0" style={{ color: '#5a03cf' }} />
                  <p className="text-base md:text-lg text-gray-900 text-center leading-snug">
                    Pour chaque établissement qui rejoint Match, recevez <span style={{ fontWeight: '700', color: '#5a03cf' }}>30€ de bon d'achat</span> à utiliser sur l'application !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sélecteur de mode de parrainage */}
          <div className="flex justify-center gap-4 mb-10">
            <Button
              onClick={() => {
                setReferralMode('particulier');
                setIsSubmitted(false);
              }}
              className={`h-14 px-8 transition-all ${
                referralMode === 'particulier'
                  ? 'bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-xl text-gray-700 border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              <span style={{ fontWeight: '700' }}>Je suis particulier</span>
            </Button>
            
            <Button
              onClick={() => {
                if (onGoToLogin) {
                  onGoToLogin();
                }
              }}
              className="h-14 px-8 transition-all bg-white/80 backdrop-blur-xl text-gray-700 border-2 border-gray-300 hover:bg-black hover:text-white hover:border-black"
            >
              <Building2 className="w-5 h-5 mr-2" />
              <span style={{ fontWeight: '700' }}>Je suis restaurateur</span>
            </Button>
          </div>

          {/* Formulaire rapide avec effet liquid glass renforcé */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40 max-w-2xl mx-auto mb-8 relative overflow-hidden">
            {/* Effet de lumière d'arrière-plan */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9cff02]/5 to-[#5a03cf]/5 opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl mb-6 italic" style={{ fontWeight: '700' }}>
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  Formulaire de parrainage
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quickFirstName" className="text-gray-700 text-left block">
                    Mon prénom *
                  </Label>
                  <Input
                    id="quickFirstName"
                    type="text"
                    placeholder="Marie"
                    className="h-11 border-2 border-gray-300 focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white/90 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quickLastName" className="text-gray-700 text-left block">
                    Mon nom *
                  </Label>
                  <Input
                    id="quickLastName"
                    type="text"
                    placeholder="Dupont"
                    className="h-11 border-2 border-gray-300 focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white/90 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="quickEmail" className="text-gray-700 text-left block">
                    Mon adresse email (utilisée sur Match) *
                  </Label>
                  <Input
                    id="quickEmail"
                    type="email"
                    placeholder="marie.dupont@example.com"
                    className="h-11 border-2 border-gray-300 focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white/90 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quickRestaurantName" className="text-gray-700 text-left block">
                    Nom de l'établissement *
                  </Label>
                  <Input
                    id="quickRestaurantName"
                    type="text"
                    placeholder="Le Sport Bar"
                    className="h-11 border-2 border-gray-300 focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white/90 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quickSiret" className="text-gray-700 text-left block">
                    Numéro de SIRET *
                  </Label>
                  <Input
                    id="quickSiret"
                    type="text"
                    placeholder="123 456 789 00012"
                    className="h-11 border-2 border-gray-300 focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white/90 backdrop-blur-sm"
                  />
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all h-12 group"
              >
                <span className="flex items-center justify-center gap-2" style={{ fontWeight: '700' }}>
                  Envoyer ma recommandation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA supplémentaire */}
      <section className="relative z-10 px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white rounded-full"></div>
            </div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl md:text-4xl mb-4 italic" style={{ fontWeight: '800' }}>
                Vous êtes restaurateur ?
              </h2>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                Rejoignez Match et profitez de tous les avantages de notre plateforme !
              </p>
              <Button
                onClick={onBackToLanding}
                className="bg-[#9cff02] hover:bg-[#8cef00] text-[#5a03cf] shadow-xl hover:shadow-2xl transition-all h-14 px-8 group"
              >
                <span className="flex items-center gap-2" style={{ fontWeight: '800' }}>
                  Découvrir Match
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-8 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 Match - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}