import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { PageType } from '../../types';
import {
  ArrowLeft,
  Loader2,
  Mail,
  MessageSquare,
  Save,
} from 'lucide-react';
import { UnsavedChangesDialog } from '../common/UnsavedChangesDialog';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../../hooks/api/useAccount';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard';
import { useToast } from '../../context/ToastContext';

interface CompteNotificationsProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

interface NotificationToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  accentClass: string;
  ariaLabel: string;
  disabled?: boolean;
}

interface NotificationSectionProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconClassName: string;
  children: ReactNode;
}

interface NotificationFormState {
  emailReservations: boolean;
  emailMatchReminders: boolean;
  emailCancellations: boolean;
  smsReservations: boolean;
  smsCancellations: boolean;
}

function NotificationToggleRow({
  title,
  description,
  checked,
  onChange,
  accentClass,
  ariaLabel,
  disabled = false,
}: NotificationToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/70">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-all ${
          checked
            ? `${accentClass} border-transparent shadow-sm`
            : 'border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'}`}
      >
        <span
          className={`absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-black/5 bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function NotificationSection({
  icon: Icon,
  title,
  description,
  iconClassName,
  children,
}: NotificationSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-100 p-6 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </section>
  );
}

export function CompteNotifications({ onBack }: CompteNotificationsProps) {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();
  const toast = useToast();
  const didHydrateFromPreferences = useRef(false);

  const [emailReservations, setEmailReservations] = useState(true);
  const [emailMatchReminders, setEmailMatchReminders] = useState(true);
  const [emailCancellations, setEmailCancellations] = useState(true);
  const [smsReservations, setSmsReservations] = useState(true);
  const [smsCancellations, setSmsCancellations] = useState(true);
  const [initialFormState, setInitialFormState] = useState<NotificationFormState | null>(null);

  useEffect(() => {
    if (preferences && !didHydrateFromPreferences.current) {
      const nextFormState: NotificationFormState = {
        emailReservations: preferences.email_reservations ?? true,
        emailMatchReminders: preferences.email_match_reminders ?? true,
        emailCancellations: preferences.email_cancellations ?? true,
        smsReservations: preferences.sms_new_reservations ?? true,
        smsCancellations: preferences.sms_cancellations ?? true,
      };

      setEmailReservations(nextFormState.emailReservations);
      setEmailMatchReminders(nextFormState.emailMatchReminders);
      setEmailCancellations(nextFormState.emailCancellations);
      setSmsReservations(nextFormState.smsReservations);
      setSmsCancellations(nextFormState.smsCancellations);
      setInitialFormState(nextFormState);
      didHydrateFromPreferences.current = true;
    }
  }, [preferences]);

  const hasChanges =
    initialFormState !== null && (
      emailReservations !== initialFormState.emailReservations ||
      emailMatchReminders !== initialFormState.emailMatchReminders ||
      emailCancellations !== initialFormState.emailCancellations ||
      smsReservations !== initialFormState.smsReservations ||
      smsCancellations !== initialFormState.smsCancellations
    );
  const unsavedChangesGuard = useUnsavedChangesGuard(hasChanges);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        email_reservations: emailReservations,
        email_cancellations: emailCancellations,
        email_match_reminders: emailMatchReminders,
        sms_new_reservations: smsReservations,
        sms_cancellations: smsCancellations,
      });
      setInitialFormState({
        emailReservations,
        emailMatchReminders,
        emailCancellations,
        smsReservations,
        smsCancellations,
      });
      toast.success('Préférences mises à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleBackAttempt = () => {
    if (!onBack) return;
    unsavedChangesGuard.handleNavigationAttempt(onBack);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] pb-24 dark:bg-gray-950 lg:pb-0">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center p-8 pb-24 lg:pb-8">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <Loader2 className="h-5 w-5 animate-spin text-[#5a03cf]" />
            Chargement de vos notifications...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 dark:bg-gray-950 lg:pb-0">
      <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="mb-1 text-xl text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Notifications
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Gérez les alertes envoyées par email et SMS selon vos usages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={handleBackAttempt}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={updateMutation.isPending || isLoading || !hasChanges}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-4 py-2.5 text-sm text-white shadow-lg shadow-[#5a03cf]/20 transition-all hover:from-[#6a13df] hover:to-[#8a33ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationSection
            icon={Mail}
            title="Notifications par email"
            description="Recevez les principales informations liées à la vie de votre lieu."
            iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <NotificationToggleRow
              title="Nouvelles réservations"
              description="Recevez un email à chaque nouvelle réservation."
              checked={emailReservations}
              onChange={() => setEmailReservations(!emailReservations)}
              accentClass="bg-[#5a03cf]"
              ariaLabel="Recevoir un email pour chaque nouvelle réservation"
            />
            <NotificationToggleRow
              title="Annulations de réservation"
              description="Recevez un email lorsqu'une réservation est annulée."
              checked={emailCancellations}
              onChange={() => setEmailCancellations(!emailCancellations)}
              accentClass="bg-[#5a03cf]"
              ariaLabel="Recevoir un email lors d'une annulation"
            />
            <NotificationToggleRow
              title="Rappels de matchs"
              description="Recevez un rappel 24h avant vos matchs programmés."
              checked={emailMatchReminders}
              onChange={() => setEmailMatchReminders(!emailMatchReminders)}
              accentClass="bg-[#5a03cf]"
              ariaLabel="Recevoir un email avant vos matchs programmés"
            />
          </NotificationSection>

          <NotificationSection
            icon={MessageSquare}
            title="Notifications par SMS"
            description="Réservez ce canal aux alertes prioritaires."
            iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            <NotificationToggleRow
              title="Nouvelles réservations"
              description="Recevez un SMS lors d'une nouvelle réservation."
              checked={smsReservations}
              onChange={() => setSmsReservations(!smsReservations)}
              accentClass="bg-[#5a03cf]"
              ariaLabel="Recevoir un SMS lors d'une nouvelle réservation"
            />
            <NotificationToggleRow
              title="Annulations de réservation"
              description="Recevez un SMS lorsqu'une réservation est annulée."
              checked={smsCancellations}
              onChange={() => setSmsCancellations(!smsCancellations)}
              accentClass="bg-[#5a03cf]"
              ariaLabel="Recevoir un SMS lors d'une annulation"
            />
          </NotificationSection>
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
