/**
 * Referral Code Input
 * 
 * Composant pour saisir un code de parrainage lors de l'inscription
 * Validation mock (en attendant le backend)
 */

import { useState, useEffect } from 'react';

interface ReferralCodeInputProps {
  defaultCode?: string; // Pre-filled from URL query param
  onCodeValidated?: (code: string, referrerInfo: any) => void;
  onCodeChange?: (code: string) => void;
}

export function ReferralCodeInput({
  defaultCode = '',
  onCodeValidated,
  onCodeChange,
}: ReferralCodeInputProps) {
  const [code, setCode] = useState(defaultCode);
  const [isValidated, setIsValidated] = useState(false);
  const [isError, setIsError] = useState(false);

  // Auto-validate if code is pre-filled from URL
  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
      validateCode(defaultCode);
    }
  }, [defaultCode]);

  // Mock validation (until backend is ready)
  const validateCode = (codeToValidate: string) => {
    const trimmedCode = codeToValidate.trim();
    if (!trimmedCode) return;

    const isValid = trimmedCode.toUpperCase().startsWith('MATCH-');
    
    if (isValid) {
      setIsValidated(true);
      setIsError(false);
      onCodeValidated?.(trimmedCode, {
        reward_for_referee: 'Vous recevrez 1 boost de bienvenue !',
      });
    } else {
      setIsValidated(false);
      setIsError(true);
    }
  };

  const handleCodeChange = (value: string) => {
    const upperCode = value.toUpperCase();
    setCode(upperCode);
    setIsValidated(false);
    setIsError(false);
    onCodeChange?.(upperCode);
  };

  const handleValidate = () => {
    if (code.trim()) {
      validateCode(code);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleValidate();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Code de parrainage <span className="text-gray-500 dark:text-gray-400">(optionnel)</span>
      </label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="MATCH-USER-XYZ789"
          className={`flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none transition-colors text-gray-900 dark:text-white ${
            isValidated
              ? 'border-[#9cff02] focus:border-[#9cff02]'
              : isError
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200 dark:border-gray-700 focus:border-[#5a03cf]'
          }`}
        />
        <button
          type="button"
          onClick={handleValidate}
          disabled={!code.trim()}
          className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
        >
          Vérifier
        </button>
      </div>

      {/* Validation Success */}
      {isValidated && (
        <div className="p-3 bg-[#9cff02]/10 border border-[#9cff02]/30 rounded-xl">
          <div className="flex items-start gap-2">
            <span className="text-lg">✅</span>
            <div className="flex-1">
              <div className="font-medium text-[#9cff02]">Code valide !</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Vous recevrez 1 boost de bienvenue !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {isError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-2">
            <span className="text-lg">❌</span>
            <div className="flex-1">
              <div className="font-medium text-red-600 dark:text-red-400">Code invalide</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Vérifiez le code ou laissez le champ vide pour continuer sans parrainage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!code && !isError && !isValidated && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Si un ami vous a donné un code de parrainage, entrez-le ici pour bénéficier d'avantages exclusifs.
        </p>
      )}
    </div>
  );
}
