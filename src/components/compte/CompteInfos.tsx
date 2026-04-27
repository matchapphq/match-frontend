import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { ArrowLeft, Camera, CheckCircle2, Loader2, Mail, UserRound } from 'lucide-react';
import apiClient from '../../api/client';
import { UnsavedChangesDialog } from '../common/UnsavedChangesDialog';
import { PhoneInputField } from '../common/PhoneInputField';
import { useToast } from '../../context/ToastContext';
import { useUpdateProfile, useUserProfile } from '../../hooks/api/useAccount';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard';
import { API_ENDPOINTS } from '../../utils/api-constants';
import {
  formatPhoneInput,
  getPhoneErrorMessage,
  inferPhoneCountry,
  normalizePhone,
  type PhoneCountry,
} from '../../utils/phone';
import { resolveProfileAvatar } from '../../utils/profile-avatar';

interface CompteInfosProps {
  onBack?: () => void;
}

export function CompteInfos({ onBack }: CompteInfosProps) {
  const { currentUser, refreshUserData } = useAuth();
  const toast = useToast();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    setFirstName(currentUser?.prenom || '');
    setLastName(currentUser?.nom || '');
    const nextPhoneCountry = inferPhoneCountry(currentUser?.telephone);
    setPhoneCountry(nextPhoneCountry);
    setPhoneInput(formatPhoneInput(currentUser?.telephone || '', nextPhoneCountry));
  }, [currentUser?.prenom, currentUser?.nom, currentUser?.telephone]);

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
  const unsavedChangesGuard = useUnsavedChangesGuard(hasChanges);

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
    unsavedChangesGuard.handleNavigationAttempt(onBack);
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
                  <PhoneInputField
                    value={phoneInput}
                    country={phoneCountry}
                    onChange={setPhoneInput}
                    onCountryChange={setPhoneCountry}
                    sizeClassName="py-3"
                    textClassName="text-sm"
                  />
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

      <UnsavedChangesDialog
        open={unsavedChangesGuard.isDialogOpen}
        onOpenChange={unsavedChangesGuard.handleDialogOpenChange}
        onStay={unsavedChangesGuard.handleStay}
        onConfirmLeave={unsavedChangesGuard.handleConfirmLeave}
      />
    </div>
  );
}
