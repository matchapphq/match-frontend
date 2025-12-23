import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp, Users, Calendar, Zap, Star, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = onLogin(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1000);
  };

  const stats = [
    { icon: Users, value: '2,500+', label: 'Restaurateurs partenaires' },
    { icon: Calendar, value: '15,000+', label: 'Matchs diffusés par mois' },
    { icon: TrendingUp, value: '+45%', label: 'De fréquentation en moyenne' },
  ];

  const testimonials = [
    {
      text: "Match a transformé notre restaurant. Nous sommes complets à chaque grand match !",
      author: "Pierre D.",
      restaurant: "Le Sport Bar, Paris",
      rating: 5
    },
    {
      text: "Une solution simple et efficace. L'application nous a permis d'attirer une nouvelle clientèle.",
      author: "Sophie M.",
      restaurant: "Chez Michel, Lyon",
      rating: 5
    },
    {
      text: "Le système de boost est génial ! Nos matchs sont toujours en première page.",
      author: "Marc L.",
      restaurant: "La Brasserie du Stade, Marseille",
      rating: 5
    }
  ];

  const features = [
    'Augmentez votre visibilité lors des événements sportifs',
    'Gérez vos réservations en temps réel',
    'Accédez à des statistiques détaillées',
    'Boostez vos matchs stratégiques',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Partie gauche - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5a03cf] via-[#6a13df] to-[#7a23ef] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-12">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-16"
            />
          </div>

          {/* Titre accrocheur - Plus en avant */}
          <div className="space-y-6">
            <h1 className="text-6xl italic leading-tight" style={{ fontWeight: '800' }}>
              Transformez chaque match en opportunité
            </h1>
            <p className="text-2xl text-white/90 leading-relaxed">
              Rejoignez des milliers de restaurateurs qui ont fait de Match leur allié pour attirer plus de clients lors des événements sportifs.
            </p>
          </div>

          {/* Témoignages carrousel - Remonté */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#9cff02] text-[#9cff02]" />
              ))}
            </div>
            <p className="text-lg mb-4 italic">"{testimonials[0].text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#9cff02]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#9cff02]" />
              </div>
              <div>
                <div className="text-sm">{testimonials[0].author}</div>
                <div className="text-xs text-white/60">{testimonials[0].restaurant}</div>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#5a03cf]" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-white/60 text-center">
          © 2024 Match - Tous droits réservés
        </div>
      </div>

      {/* Partie droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1738202321971-a7544e464ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBiYXIlMjByZXN0YXVyYW50JTIwYXRtb3NwaGVyZSUyMGNyb3dkfGVufDF8fHx8MTc2NjQxNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Restaurant atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-sm"></div>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-16 mx-auto"
            />
          </div>

          {/* En-tête */}
          <div className="text-center">
            <h2 className="text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Bon retour parmi nous ! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Connectez-vous pour gérer vos matchs
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#5a03cf]" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@monrestaurant.fr"
                  required
                  className="h-14 text-lg border-2 border-[#9cff02] focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 bg-white shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#5a03cf]" />
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-14 text-lg border-2 border-[#9cff02] focus:border-[#5a03cf] focus:ring-[#5a03cf]/20 pr-14 bg-white shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a03cf] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2" style={{ fontWeight: '700' }}>
                    Se connecter
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#5a03cf] hover:text-[#9cff02] transition-colors text-sm"
                >
                  Pas encore de compte ? <span className="underline" style={{ fontWeight: '600' }}>Créer un compte</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info compte démo */}
          <div className="bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#5a03cf]/30">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-2">
                <span className="text-[#5a03cf]">💡 Compte de démonstration</span>
              </p>
              <p className="text-xs text-gray-600">
                Email: <span className="font-mono bg-white/80 px-2 py-1 rounded">demo@match.com</span> • 
                Mot de passe: <span className="font-mono bg-white/80 px-2 py-1 rounded">demo123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}