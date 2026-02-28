import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { ArrowLeft, Camera, CheckCircle2, ChevronDown, Loader2, Mail, UserRound } from 'lucide-react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useUpdateProfile, useUserProfile } from '../../hooks/api/useAccount';
import { API_ENDPOINTS } from '../../utils/api-constants';
import { resolveProfileAvatar } from '../../utils/profile-avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface CompteInfosProps {
  onBack?: () => void;
}

type PhoneCountry = 'FR' | 'US';

const PHONE_COUNTRY_ORDER: PhoneCountry[] = ['FR', 'US'];

function getCountryDialCode(country: PhoneCountry): string {
  return country === 'US' ? '+1' : '+33';
}

function CountryFlag({ country, className = 'h-4 w-6 rounded-[2px] shadow-sm' }: { country: PhoneCountry; className?: string }) {
  if (country === 'FR') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 3 2">
        <rect width="1" height="2" x="0" y="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#EF4135" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 3 2">
      <rect width="3" height="2" fill="#B22234" />
      <rect width="3" height="0.285" y="0.285" fill="#FFFFFF" />
      <rect width="3" height="0.285" y="0.855" fill="#FFFFFF" />
      <rect width="3" height="0.285" y="1.425" fill="#FFFFFF" />
      <rect width="1.2" height="1.1" x="0" y="0" fill="#3C3B6E" />
    </svg>
  );
}

function inferPhoneCountry(value?: string | null): PhoneCountry {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (normalized.startsWith('+1') || normalized.startsWith('1')) return 'US';
  return 'FR';
}

function formatFrenchPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length > 0 && !digits.startsWith('0')) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

function normalizeFrenchPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length === 9 && /^[1-9]\d{8}$/.test(digits)) {
    digits = `0${digits}`;
  }

  if (!/^0[1-9]\d{8}$/.test(digits)) {
    return null;
  }

  return `+33${digits.slice(1)}`;
}

function formatUsPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('001')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('1') && digits.length > 10) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizeUsPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('001')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('1') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    return null;
  }

  return `+1${digits}`;
}

function formatPhoneInput(value: string, country: PhoneCountry): string {
  return country === 'US' ? formatUsPhoneInput(value) : formatFrenchPhoneInput(value);
}

function normalizePhone(value: string, country: PhoneCountry): string | null {
  return country === 'US' ? normalizeUsPhone(value) : normalizeFrenchPhone(value);
}

function getPhonePlaceholder(country: PhoneCountry): string {
  return country === 'US' ? '(201) 555-0123' : '06 12 34 56 78';
}

function getPhoneErrorMessage(country: PhoneCountry): string {
  return country === 'US'
    ? 'Numéro invalide. Format attendu : (201) 555-0123'
    : 'Numéro invalide. Format attendu : 06 12 34 56 78';
}

export function CompteInfos({ onBack }: CompteInfosProps) {
  const { currentUser, refreshUserData } = useAuth();
  const toast = useToast();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const phoneCountryPickerRef = useRef<HTMLDivElement | null>(null);
  const {
    data: userProfile,
    refetch: refetchUserProfile,
  } = useUserProfile();
  const initialPhoneCountry = inferPhoneCountry(currentUser?.telephone);
  const initialPhoneDisplay = formatPhoneInput(currentUser?.telephone || '', initialPhoneCountry);

  const [firstName, setFirstName] = useState(currentUser?.prenom || '');
  const [lastName, setLastName] = useState(currentUser?.nom || '');
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(initialPhoneCountry);
  const [phoneInput, setPhoneInput] = useState(initialPhoneDisplay);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPhoneCountryMenuOpen, setIsPhoneCountryMenuOpen] = useState(false);
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);

  useEffect(() => {
    setFirstName(currentUser?.prenom || '');
    setLastName(currentUser?.nom || '');
    const nextPhoneCountry = inferPhoneCountry(currentUser?.telephone);
    setPhoneCountry(nextPhoneCountry);
    setPhoneInput(formatPhoneInput(currentUser?.telephone || '', nextPhoneCountry));
  }, [currentUser?.prenom, currentUser?.nom, currentUser?.telephone]);

  useEffect(() => {
    if (!isPhoneCountryMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (phoneCountryPickerRef.current && !phoneCountryPickerRef.current.contains(event.target as Node)) {
        setIsPhoneCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPhoneCountryMenuOpen]);

  useEffect(() => {
    const nextAvatar =
      userProfile?.avatar ||
      userProfile?.avatar_url ||
      null;
    setAvatarPreview(nextAvatar);
  }, [userProfile?.avatar, userProfile?.avatar_url]);

  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const normalizedPhone =
    phoneInput.trim().length > 0 ? normalizePhone(phoneInput, phoneCountry) : '';
  const initialFirstName = currentUser?.prenom?.trim() || '';
  const initialLastName = currentUser?.nom?.trim() || '';
  const initialPhone = currentUser?.telephone?.trim() || '';
  const hasPhone = typeof normalizedPhone === 'string' && normalizedPhone.length > 0;
  const profileCompletionCount = [
    normalizedFirstName,
    normalizedLastName,
    currentUser?.email?.trim() || '',
    hasPhone ? normalizedPhone : '',
  ].filter(Boolean).length;
  const hasChanges =
    normalizedFirstName !== initialFirstName ||
    normalizedLastName !== initialLastName ||
    phoneInput !== initialPhoneDisplay ||
    (phoneInput.trim().length > 0 && phoneCountry !== initialPhoneCountry);

  useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  const fullName = useMemo(() => {
    return [normalizedFirstName, normalizedLastName]
      .filter(Boolean)
      .join(' ')
      .trim();
  }, [normalizedFirstName, normalizedLastName]);

  const accountTypeLabel =
    currentUser?.role === 'venue_owner' || currentUser?.role === 'admin' ? 'Pro' : 'Guest';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info('Aucune modification à enregistrer');
      return;
    }

    if (phoneInput.trim().length > 0 && !normalizedPhone) {
      toast.error(getPhoneErrorMessage(phoneCountry));
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        phone: normalizedPhone || '',
      });
      await refreshUserData();
      toast.success('Profil mis à jour avec succès');
    } catch {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleReset = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setPhoneCountry(initialPhoneCountry);
    setPhoneInput(initialPhoneDisplay);
  };

  const handleBackAttempt = () => {
    if (!onBack) return;

    if (hasChanges) {
      setIsUnsavedDialogOpen(true);
      return;
    }

    onBack();
  };

  const handleConfirmLeave = () => {
    setIsUnsavedDialogOpen(false);
    onBack?.();
  };

  const handlePhoneCountryChange = (nextCountry: PhoneCountry) => {
    setPhoneCountry(nextCountry);
    setPhoneInput((previousValue) => formatPhoneInput(previousValue, nextCountry));
    setIsPhoneCountryMenuOpen(false);
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      e.target.value = '';
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('L’image ne doit pas dépasser 5 Mo');
      e.target.value = '';
      return;
    }

    const previousPreview = avatarPreview;
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(API_ENDPOINTS.MEDIA_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl =
        (response.data && typeof response.data.url === 'string' && response.data.url) ||
        localPreview;

      setAvatarPreview(uploadedUrl);
      await refetchUserProfile();
      await refreshUserData();
      toast.success('Photo de profil mise à jour');
    } catch {
      setAvatarPreview(previousPreview);
      toast.error('Impossible de mettre à jour la photo de profil');
    } finally {
      URL.revokeObjectURL(localPreview);
      e.target.value = '';
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mb-1 text-xl text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Informations personnelles
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Gérez les informations principales associées à votre compte Match.
            </p>
          </div>

          {onBack && (
            <button
              onClick={handleBackAttempt}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-6 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5a03cf]/10 text-[#5a03cf]">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white">Éditer le profil</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Mettez à jour vos informations d’identité, de contact et votre photo de profil.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 lg:p-8">
            <div className="border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative pr-4 pb-3">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-xl font-semibold text-white">
                      <img
                        src={resolveProfileAvatar(avatarPreview)}
                        alt="Photo de profil"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAvatarButtonClick}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a03cf] shadow-lg ring-4 ring-white transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:ring-gray-900 dark:hover:bg-gray-800"
                      aria-label={avatarPreview ? 'Modifier la photo de profil' : 'Ajouter une photo de profil'}
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base text-gray-900 dark:text-white">
                      {fullName || 'Profil Match'}
                    </h3>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {currentUser?.email || 'Adresse indisponible'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        Compte {accountTypeLabel}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        Profil {profileCompletionCount}/4
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        {hasPhone ? 'Téléphone renseigné' : 'Téléphone à compléter'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 lg:w-[420px] xl:w-[460px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Photo de profil
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Ajoutez une image claire pour personnaliser votre profil.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAvatarButtonClick}
                      disabled={isUploadingAvatar}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-950"
                    >
                      {isUploadingAvatar ? 'Upload...' : avatarPreview ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Formats image acceptés. Taille maximale recommandée : 5 Mo.
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Identité</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Ces informations sont visibles dans votre espace compte.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#5a03cf] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#5a03cf] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Coordonnées</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Votre e-mail principal reste fixe, mais vous pouvez mettre à jour votre numéro de téléphone.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{currentUser?.email || 'Adresse indisponible'}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Pour modifier votre adresse e-mail, contactez le support.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                    Téléphone
                  </label>
                  <div className="relative" ref={phoneCountryPickerRef}>
                    <div className="flex min-h-[52px] w-full items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:ring-2 focus-within:ring-[#5a03cf] dark:border-gray-700 dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => setIsPhoneCountryMenuOpen((previousState) => !previousState)}
                        className="flex h-full shrink-0 items-center gap-3 pr-4 text-sm text-gray-900 dark:text-white"
                      >
                        <CountryFlag country={phoneCountry} />
                        <span className="font-medium">{phoneCountry}</span>
                        <span className="text-gray-500 dark:text-gray-400">{getCountryDialCode(phoneCountry)}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-400 transition-transform ${isPhoneCountryMenuOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <div className="ml-1 flex min-h-[36px] flex-1 items-center border-l border-gray-300 pl-4 dark:border-gray-600">
                        <input
                          type="tel"
                          inputMode="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(formatPhoneInput(e.target.value, phoneCountry))}
                          className="h-full w-full bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500"
                          placeholder={getPhonePlaceholder(phoneCountry)}
                        />
                      </div>
                    </div>

                    {isPhoneCountryMenuOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[190px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        {PHONE_COUNTRY_ORDER.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => handlePhoneCountryChange(country)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                              country === phoneCountry
                                ? 'bg-[#5a03cf]/10 text-[#5a03cf]'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                          >
                            <CountryFlag country={country} />
                            <span className="font-medium">{country}</span>
                            <span className="text-gray-500 dark:text-gray-400">{getCountryDialCode(country)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasChanges ? 'Des modifications sont prêtes à être enregistrées.' : 'Aucune modification en attente.'}
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {onBack && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Annuler
                  </button>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending || !hasChanges}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-5 py-3 text-sm font-medium text-white transition-all hover:from-[#6a13df] hover:to-[#8a33ff] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog open={isUnsavedDialogOpen} onOpenChange={setIsUnsavedDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <AlertDialogHeader className="space-y-3 text-left">
            <AlertDialogTitle className="text-lg text-gray-900 dark:text-white">
              Modifications non enregistrées
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              Vous avez des changements en cours sur cette page. Si vous quittez maintenant, ils seront perdus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex-row justify-center gap-3 sm:justify-center">
            <AlertDialogCancel className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              Rester sur la page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLeave}
              className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
            >
              Quitter sans enregistrer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
