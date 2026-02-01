import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Key, Lock, Eye, EyeOff, Send, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
//import logo from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logo from '../../../../assets/logo.png';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

type Step = 'email' | 'code' | 'reset' | 'success';

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulated verification code (in real app, this would be sent via email)
  const verificationCode = '123456';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Adresse email invalide');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 1500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const enteredCode = code.join('');
    
    if (enteredCode.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    if (enteredCode !== verificationCode) {
      setError('Code de vérification incorrect');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleResendCode = () => {
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setError('');
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Code renvoyé avec succès !';
      successMsg.className = 'text-green-600 text-sm mt-2';
      document.querySelector('.resend-container')?.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src={logo} 
              alt="Match" 
              className="h-12"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-[#5a03cf]/20 to-[#9cff02]/20 blur-2xl -z-10" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLogin}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>

            {step === 'email' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  Mot de passe oublié ?
                </CardTitle>
                <CardDescription className="text-center">
                  Pas de souci ! Entrez votre adresse email et nous vous enverrons un code de vérification.
                </CardDescription>
              </>
            )}

            {step === 'code' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  Vérifiez votre email
                </CardTitle>
                <CardDescription className="text-center">
                  Nous avons envoyé un code de vérification à
                  <br />
                  <strong className="text-[#5a03cf]">{email}</strong>
                </CardDescription>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  Nouveau mot de passe
                </CardTitle>
                <CardDescription className="text-center">
                  Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </CardDescription>
              </>
            )}

            {step === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  Mot de passe réinitialisé !
                </CardTitle>
                <CardDescription className="text-center">
                  Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-900/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@match.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le code
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {step === 'code' && (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-900/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label className="text-center block text-gray-700 dark:text-gray-300">
                    Code de vérification
                  </Label>
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-[#5a03cf] focus:ring-2 focus:ring-[#5a03cf]/20 text-gray-900 dark:text-white"
                        disabled={isLoading}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    Code de test : <strong className="text-[#5a03cf]">123456</strong>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </Button>

                <div className="text-center resend-container">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous n'avez pas reçu le code ?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-[#5a03cf] hover:text-[#7a23ef] font-medium underline disabled:opacity-50"
                    >
                      Renvoyer
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: Password Reset */}
            {step === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-900/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Au moins 8 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Répétez le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            newPassword.length < 6 ? 'w-1/3 bg-red-500' :
                            newPassword.length < 8 ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        newPassword.length < 6 ? 'text-red-500' :
                        newPassword.length < 8 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {newPassword.length < 6 ? 'Faible' :
                         newPassword.length < 8 ? 'Moyen' :
                         'Fort'}
                      </span>
                    </div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li className={newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                        {newPassword.length >= 8 ? '✓' : '○'} Au moins 8 caractères
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                        {/[A-Z]/.test(newPassword) ? '✓' : '○'} Une lettre majuscule
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                        {/[0-9]/.test(newPassword) ? '✓' : '○'} Un chiffre
                      </li>
                    </ul>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Réinitialiser le mot de passe
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={onBackToLogin}
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:opacity-90 transition-opacity"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        {step === 'email' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous avez besoin d'aide ?{' '}
              <a href="mailto:support@match.com" className="text-[#5a03cf] hover:text-[#7a23ef] font-medium underline">
                Contactez le support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}