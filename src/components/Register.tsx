import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Phone, User, Sparkles, TrendingUp, Calendar, Users, Check, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

interface RegisterProps {
  onRegister: (data: RegisterData) => boolean;
  onSwitchToLogin: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
  });

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.nom || !formData.prenom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = onRegister(formData);
      if (!success) {
        setError('Cet email est déjà utilisé');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1738202321971-a7544e464ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBiYXIlMjByZXN0YXVyYW50JTIwYXRtb3NwaGVyZSUyMGNyb3dkfGVufDF8fHx8MTc2NjQxNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Restaurant atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-sm"></div>
      </div>

      {/* Éléments décoratifs animés */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Bouton retour */}
        <button
          onClick={onSwitchToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la connexion
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoMatch} 
            alt="Match" 
            className="h-16 mx-auto"
          />
        </div>

        {/* En-tête */}
        <div className="text-center">
          <h2 className="text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
            Bienvenue ! 🎉
          </h2>
          <p className="text-gray-600 text-lg">
            Créez votre compte en moins d'une minute
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5a03cf]" />
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => updateField('prenom', e.target.value)}
                  placeholder="Jean"
                  required
                  className="h-11 border-gray-200 focus:border-[#9cff02] focus:ring-[#9cff02]/20 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom" className="text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5a03cf]" />
                  Nom *
                </Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  placeholder="Dupont"
                  required
                  className="h-11 border-gray-200 focus:border-[#9cff02] focus:ring-[#9cff02]/20 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5a03cf]" />
                Email professionnel *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@monrestaurant.fr"
                required
                className="h-11 border-gray-200 focus:border-[#9cff02] focus:ring-[#9cff02]/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5a03cf]" />
                Téléphone *
              </Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => updateField('telephone', e.target.value)}
                placeholder="01 23 45 67 89"
                required
                className="h-11 border-gray-200 focus:border-[#9cff02] focus:ring-[#9cff02]/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#5a03cf]" />
                Mot de passe *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 border-gray-200 focus:border-[#9cff02] focus:ring-[#9cff02]/20 pr-12 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a03cf] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
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
              className="w-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Création du compte...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2" style={{ fontWeight: '700' }}>
                  Créer mon compte et commencer
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-gray-500">
              En créant un compte, vous acceptez nos conditions d'utilisation
            </p>
          </form>
        </div>

        {/* Info rassurante */}
        <div className="bg-gradient-to-r from-[#9cff02]/20 to-[#5a03cf]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#5a03cf]/30">
          <div className="text-center">
            <p className="text-sm text-gray-700">
              <span className="text-[#5a03cf]">🔒 Vos données sont sécurisées</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Nous ne partageons jamais vos informations avec des tiers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}