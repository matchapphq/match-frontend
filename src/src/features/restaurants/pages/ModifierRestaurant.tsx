import { ArrowLeft, Edit, MapPin, Phone, Mail, Users, Zap, Clock, Loader2, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/client';
import { UnsavedChangesDialog } from '../../../components/common/UnsavedChangesDialog';
import { PhoneInputField } from '../../../components/common/PhoneInputField';
import { useToast } from '../../../context/ToastContext';
import { useUnsavedChangesGuard } from '../../../hooks/useUnsavedChangesGuard';
import { formatPhoneInput, getPhoneErrorMessage, inferPhoneCountry, normalizePhone, type PhoneCountry } from '../../../utils/phone';

interface ModifierRestaurantProps {
  restaurantId: string | null;
  onBack: () => void;
}

type WeekDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface InitialEditState {
  nom: string;
  telephone: string;
  capaciteMax: number;
  bookingMode: 'INSTANT' | 'REQUEST';
  weeklySchedule: Record<WeekDayKey, DaySchedule>;
}

interface UpdateVenuePayload {
  nom: string;
  telephone: string;
  capaciteMax: number;
  bookingMode: 'INSTANT' | 'REQUEST';
  openingHours: Record<string, { open: string; close: string; closed: boolean }>;
  weeklyScheduleSnapshot: Record<WeekDayKey, DaySchedule>;
}

interface DayConfig {
  key: WeekDayKey;
  backendKey: string;
  dayOfWeek: number;
  label: string;
  name: string;
  defaultOpenTime: string;
  defaultCloseTime: string;
}

const DAY_CONFIG: DayConfig[] = [
  { key: 'mon', backendKey: 'monday', dayOfWeek: 1, label: 'L', name: 'Lundi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'tue', backendKey: 'tuesday', dayOfWeek: 2, label: 'M', name: 'Mardi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'wed', backendKey: 'wednesday', dayOfWeek: 3, label: 'M', name: 'Mercredi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'thu', backendKey: 'thursday', dayOfWeek: 4, label: 'J', name: 'Jeudi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'fri', backendKey: 'friday', dayOfWeek: 5, label: 'V', name: 'Vendredi', defaultOpenTime: '11:00', defaultCloseTime: '01:00' },
  { key: 'sat', backendKey: 'saturday', dayOfWeek: 6, label: 'S', name: 'Samedi', defaultOpenTime: '11:00', defaultCloseTime: '01:00' },
  { key: 'sun', backendKey: 'sunday', dayOfWeek: 0, label: 'D', name: 'Dimanche', defaultOpenTime: '11:00', defaultCloseTime: '22:00' },
];

const WEEK_DAYS: Array<{ key: WeekDayKey; label: string; name: string }> = DAY_CONFIG.map((day) => ({
  key: day.key,
  label: day.label,
  name: day.name,
}));

const DEFAULT_WEEKLY_SCHEDULE: Record<WeekDayKey, DaySchedule> = DAY_CONFIG.reduce((acc, day) => {
  acc[day.key] = {
    isOpen: true,
    openTime: day.defaultOpenTime,
    closeTime: day.defaultCloseTime,
  };
  return acc;
}, {} as Record<WeekDayKey, DaySchedule>);

function formatWeeklySchedule(schedule: Record<WeekDayKey, DaySchedule>) {
  return WEEK_DAYS.map((day) => {
    const config = schedule[day.key];
    if (!config.isOpen) return `${day.name}: fermé`;
    return `${day.name}: ${config.openTime}-${config.closeTime}`;
  }).join(' | ');
}

function cloneWeeklySchedule(schedule: Record<WeekDayKey, DaySchedule>) {
  return WEEK_DAYS.reduce((acc, day) => {
    acc[day.key] = { ...schedule[day.key] };
    return acc;
  }, {} as Record<WeekDayKey, DaySchedule>);
}

function normalizeHour(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 5);
  return fallback;
}

function mapOpeningHoursToWeeklySchedule(openingHours: unknown) {
  const schedule = cloneWeeklySchedule(DEFAULT_WEEKLY_SCHEDULE);
  if (!openingHours) return schedule;

  if (Array.isArray(openingHours)) {
    for (const rawEntry of openingHours) {
      if (!rawEntry || typeof rawEntry !== 'object') continue;
      const entry = rawEntry as Record<string, unknown>;
      const dayOfWeek = typeof entry.day_of_week === 'number' ? entry.day_of_week : null;
      if (dayOfWeek === null) continue;
      const dayConfig = DAY_CONFIG.find((day) => day.dayOfWeek === dayOfWeek);
      if (!dayConfig) continue;

      const periods = Array.isArray(entry.periods) ? entry.periods : [];
      const firstPeriod = periods[0] && typeof periods[0] === 'object'
        ? (periods[0] as Record<string, unknown>)
        : null;
      const dayKey = dayConfig.key;
      const fallback = schedule[dayKey];

      schedule[dayKey] = {
        isOpen: entry.is_closed !== true,
        openTime: normalizeHour(firstPeriod?.open, fallback.openTime),
        closeTime: normalizeHour(firstPeriod?.close, fallback.closeTime),
      };
    }

    return schedule;
  }

  if (typeof openingHours === 'object') {
    const openingHoursObject = openingHours as Record<string, unknown>;
    Object.entries(openingHoursObject).forEach(([backendKey, dayConfig]) => {
      if (!dayConfig || typeof dayConfig !== 'object') return;
      const mappedDay = DAY_CONFIG.find((day) => day.backendKey === backendKey);
      if (!mappedDay) return;

      const parsedDay = dayConfig as Record<string, unknown>;
      const dayKey = mappedDay.key;
      const fallback = schedule[dayKey];

      schedule[dayKey] = {
        isOpen: parsedDay.closed !== true,
        openTime: normalizeHour(parsedDay.open, fallback.openTime),
        closeTime: normalizeHour(parsedDay.close, fallback.closeTime),
      };
    });
  }

  return schedule;
}

function mapWeeklyScheduleToOpeningHours(
  schedule: Record<WeekDayKey, DaySchedule>,
): Record<string, { open: string; close: string; closed: boolean }> {
  return DAY_CONFIG.reduce((acc, day) => {
    const config = schedule[day.key];
    acc[day.backendKey] = {
      open: config.openTime,
      close: config.closeTime,
      closed: !config.isOpen,
    };
    return acc;
  }, {} as Record<string, { open: string; close: string; closed: boolean }>);
}

function sanitizeCapacity(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.trunc(parsed);
}

function sanitizeEditableCapacity(value: unknown) {
  return Math.max(1, sanitizeCapacity(value));
}

function areSchedulesEqual(
  left: Record<WeekDayKey, DaySchedule>,
  right: Record<WeekDayKey, DaySchedule>,
) {
  return WEEK_DAYS.every((day) => {
    const leftDay = left[day.key];
    const rightDay = right[day.key];
    return (
      leftDay.isOpen === rightDay.isOpen &&
      leftDay.openTime === rightDay.openTime &&
      leftDay.closeTime === rightDay.closeTime
    );
  });
}

export function ModifierRestaurant({ restaurantId, onBack }: ModifierRestaurantProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: restaurant, isLoading: isLoadingVenue } = useQuery({
    queryKey: ['venue', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const res = await apiClient.get(`/venues/${restaurantId}`);
      return res.data?.venue ?? res.data;
    },
    enabled: !!restaurantId,
  });

  const [capaciteMax, setCapaciteMax] = useState(1);
  const [bookingMode, setBookingMode] = useState<'INSTANT' | 'REQUEST'>('INSTANT');
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    horaires: '',
  });
  const [selectedWeekDay, setSelectedWeekDay] = useState<WeekDayKey>('mon');
  const [weeklySchedule, setWeeklySchedule] = useState<Record<WeekDayKey, DaySchedule>>(
    cloneWeeklySchedule(DEFAULT_WEEKLY_SCHEDULE),
  );
  const [initialEditState, setInitialEditState] = useState<InitialEditState | null>(null);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>('FR');

  useEffect(() => {
    if (restaurant) {
      const venueCapacity = sanitizeEditableCapacity(restaurant.capacity);
      const venueSchedule = mapOpeningHoursToWeeklySchedule(restaurant.opening_hours);
      const nextPhoneCountry = inferPhoneCountry(restaurant.phone);
      const formattedPhone = formatPhoneInput(restaurant.phone || '', nextPhoneCountry);
      const address = [restaurant.street_address, restaurant.city].filter(Boolean).join(', ');
      setFormData({
        nom: restaurant.name || '',
        adresse: address || 'Adresse non renseignée',
        telephone: formattedPhone,
        email: restaurant.email || '',
        horaires: formatWeeklySchedule(venueSchedule),
      });
      setCapaciteMax(venueCapacity);
      setBookingMode(restaurant.booking_mode || 'INSTANT');
      setPhoneCountry(nextPhoneCountry);
      setSelectedWeekDay('mon');
      setWeeklySchedule(venueSchedule);
      setInitialEditState({
        nom: (restaurant.name || '').trim(),
        telephone: formattedPhone.trim(),
        capaciteMax: venueCapacity,
        bookingMode: (restaurant.booking_mode || 'INSTANT') as 'INSTANT' | 'REQUEST',
        weeklySchedule: cloneWeeklySchedule(venueSchedule),
      });
    }
  }, [restaurant]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      horaires: formatWeeklySchedule(weeklySchedule),
    }));
  }, [weeklySchedule]);

  const selectedDaySchedule = weeklySchedule[selectedWeekDay];
  const selectedDayLabel = WEEK_DAYS.find((day) => day.key === selectedWeekDay)?.name || 'Jour';
  const savedCapacity = sanitizeCapacity(restaurant?.capacity);
  const normalizedNom = formData.nom.trim();
  const normalizedTelephone = formData.telephone.trim()
    ? normalizePhone(formData.telephone, phoneCountry) || formData.telephone.trim()
    : '';

  const hasChanges = useMemo(() => {
    if (!initialEditState) return false;
    return (
      normalizedNom !== initialEditState.nom ||
      normalizedTelephone !== initialEditState.telephone ||
      capaciteMax !== initialEditState.capaciteMax ||
      bookingMode !== initialEditState.bookingMode ||
      !areSchedulesEqual(weeklySchedule, initialEditState.weeklySchedule)
    );
  }, [initialEditState, normalizedNom, normalizedTelephone, capaciteMax, bookingMode, weeklySchedule]);

  const unsavedChangesGuard = useUnsavedChangesGuard(hasChanges);

  useEffect(() => {
    const handleSidebarNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ path?: string }>;
      const targetPath = customEvent.detail?.path;
      if (!targetPath) return;

      if (hasChanges) {
        event.preventDefault();
        unsavedChangesGuard.handleNavigationAttempt(() => navigate(targetPath));
      }
    };

    window.addEventListener('match:sidebar-navigate', handleSidebarNavigate as EventListener);
    return () => {
      window.removeEventListener('match:sidebar-navigate', handleSidebarNavigate as EventListener);
    };
  }, [hasChanges, navigate, unsavedChangesGuard]);

  const updateVenueMutation = useMutation({
    mutationFn: async (data: UpdateVenuePayload) => {
      const basicPayload = {
        name: data.nom,
        phone: data.telephone,
        capacity: data.capaciteMax,
        booking_mode: data.bookingMode,
        opening_hours: data.openingHours,
      };
      await apiClient.put(`/venues/${restaurantId}`, basicPayload);
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venue', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['venue-detail', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['partner-venues'] });
      setInitialEditState({
        nom: variables.nom.trim(),
        telephone: variables.telephone.trim(),
        capaciteMax: variables.capaciteMax,
        bookingMode: variables.bookingMode,
        weeklySchedule: cloneWeeklySchedule(variables.weeklyScheduleSnapshot),
      });
      toast.success('Modifications enregistrées');
    },
    onError: (err) => {
      console.error('Update failed:', err);
      toast.error('Erreur lors de la modification du restaurant.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    const normalizedPhone = formData.telephone.trim()
      ? normalizePhone(formData.telephone, phoneCountry)
      : '';
    if (formData.telephone.trim() && !normalizedPhone) {
      toast.error(getPhoneErrorMessage(phoneCountry));
      return;
    }
    if (restaurantId) {
      const weeklyScheduleSnapshot = cloneWeeklySchedule(weeklySchedule);
      updateVenueMutation.mutate({
        ...formData,
        telephone: normalizedPhone || formData.telephone.trim(),
        capaciteMax: sanitizeEditableCapacity(capaciteMax),
        bookingMode,
        openingHours: mapWeeklyScheduleToOpeningHours(weeklyScheduleSnapshot),
        weeklyScheduleSnapshot,
      });
    }
  };

  const handleBackAttempt = () => {
    unsavedChangesGuard.handleNavigationAttempt(onBack);
  };

  const handleResetChanges = () => {
    if (!initialEditState) return;
    setFormData((prev) => ({
      ...prev,
      nom: initialEditState.nom,
      telephone: initialEditState.telephone,
      horaires: formatWeeklySchedule(initialEditState.weeklySchedule),
    }));
    setCapaciteMax(initialEditState.capaciteMax);
    setBookingMode(initialEditState.bookingMode);
    setWeeklySchedule(cloneWeeklySchedule(initialEditState.weeklySchedule));
    setPhoneCountry(inferPhoneCountry(initialEditState.telephone));
    setSelectedWeekDay('mon');
  };

  const handleDialogStay = () => {
    unsavedChangesGuard.handleStay();
  };

  const handleDialogConfirmLeave = () => {
    unsavedChangesGuard.handleConfirmLeave();
  };

  if (isLoadingVenue) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf]" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1100px] mx-auto">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">Restaurant non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-24 lg:pb-0 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-24 lg:pt-28 pb-6 lg:pb-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={handleBackAttempt}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/70 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-[#5a03cf] hover:border-[#5a03cf]/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#9cff02]/40 bg-[#9cff02]/10 px-3 py-1.5 text-xs text-[#2f6a00] dark:text-[#9cff02]">
            <span className="w-2 h-2 rounded-full bg-[#9cff02] animate-pulse" />
            Édition active
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-[#5a03cf]/5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#5a03cf]/20 bg-[#5a03cf]/5 text-[#5a03cf] text-xs sm:text-sm mb-4">
            <Edit className="w-4 h-4" />
            Édition d'établissement
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-3">
            Modifier{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              {restaurant.name}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl">
            Mettez à jour les informations clés du lieu, la capacité d'accueil et le mode de réservation.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-full">
              <section className="h-full rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-6 shadow-sm">
                <h2 className="text-lg text-gray-900 dark:text-white mb-5">Informations générales</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Nom du restaurant</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 text-[#5a03cf]" />
                      Adresse complète (non modifiable)
                    </label>
                    <input
                      type="text"
                      value={formData.adresse}
                      disabled
                      className="w-full rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 text-[#5a03cf]" />
                        Téléphone
                      </label>
                      <PhoneInputField
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        country={phoneCountry}
                        onChange={(value) => setFormData({ ...formData, telephone: value })}
                        onCountryChange={setPhoneCountry}
                        required
                        sizeClassName="py-3"
                        textClassName="text-sm"
                        ariaInvalid={formData.telephone.trim().length > 0 && !normalizePhone(formData.telephone, phoneCountry)}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 text-[#5a03cf]" />
                        Email (non modifiable)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Horaires d'ouverture</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900 p-4">
                        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                          <CalendarDays className="w-4 h-4 text-[#5a03cf]" />
                          Jours ouverts
                        </label>
                        <div className="flex items-center gap-2">
                          {WEEK_DAYS.map((day) => {
                            const dayConfig = weeklySchedule[day.key];
                            const isSelected = selectedWeekDay === day.key;
                            return (
                              <button
                                key={day.key}
                                type="button"
                                onClick={() => setSelectedWeekDay(day.key)}
                                title={`${day.name} - ${dayConfig.isOpen ? 'Ouvert' : 'Fermé'}`}
                                className={`h-10 flex-1 rounded-lg border text-xs transition-all ${
                                  isSelected
                                    ? 'border-[#5a03cf] bg-[#5a03cf]/10 text-[#5a03cf]'
                                    : dayConfig.isOpen
                                      ? 'border-[#9cff02]/40 bg-[#9cff02]/10 text-[#2f6a00] dark:text-[#9cff02]'
                                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          Sélectionnez un jour à gauche, puis réglez ses horaires à droite.
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900 p-4">
                        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <Clock className="w-4 h-4 text-[#5a03cf]" />
                          Horaires du {selectedDayLabel}
                        </label>
                        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 mb-3">
                          <button
                            type="button"
                            onClick={() =>
                              setWeeklySchedule((prev) => ({
                                ...prev,
                                [selectedWeekDay]: {
                                  ...prev[selectedWeekDay],
                                  isOpen: true,
                                },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                              selectedDaySchedule.isOpen
                                ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            Ouvert
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setWeeklySchedule((prev) => ({
                                ...prev,
                                [selectedWeekDay]: {
                                  ...prev[selectedWeekDay],
                                  isOpen: false,
                                },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                              !selectedDaySchedule.isOpen
                                ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            Fermé
                          </button>
                        </div>

                        {selectedDaySchedule.isOpen ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Ouvre à
                              </label>
                              <input
                                type="time"
                                value={selectedDaySchedule.openTime}
                                onChange={(e) =>
                                  setWeeklySchedule((prev) => ({
                                    ...prev,
                                    [selectedWeekDay]: {
                                      ...prev[selectedWeekDay],
                                      openTime: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Ferme à
                              </label>
                              <input
                                type="time"
                                value={selectedDaySchedule.closeTime}
                                onChange={(e) =>
                                  setWeeklySchedule((prev) => ({
                                    ...prev,
                                    [selectedWeekDay]: {
                                      ...prev[selectedWeekDay],
                                      closeTime: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                                required
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/50 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                            Ce jour est fermé.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-6 shadow-sm">
                <h2 className="text-lg text-gray-900 dark:text-white mb-4">Capacité</h2>

                <div className="rounded-xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 border border-[#5a03cf]/20 px-4 py-3 mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Capacité actuelle (sauvegardée)</p>
                  <p className="text-3xl text-[#5a03cf]" style={{ fontWeight: 700 }}>
                    {savedCapacity}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 text-[#5a03cf]" />
                  Nouvelle capacité
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={capaciteMax}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);
                    setCapaciteMax(Number.isFinite(nextValue) ? Math.max(1, Math.trunc(nextValue)) : 1);
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                />
              </section>

              <section className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-6 shadow-sm">
                <h2 className="text-lg text-gray-900 dark:text-white mb-2">Mode de réservation</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Choisissez comment gérer les demandes.
                </p>

                <div className="space-y-3">
                  <div
                    onClick={() => setBookingMode('INSTANT')}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      bookingMode === 'INSTANT'
                        ? 'border-[#9cff02] bg-[#9cff02]/10 dark:bg-[#9cff02]/15'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#9cff02]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className={`w-4 h-4 ${bookingMode === 'INSTANT' ? 'text-[#5a03cf]' : 'text-gray-400'}`} />
                      <p className="text-sm text-gray-900 dark:text-white">Instantané</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Confirmation automatique des réservations.</p>
                  </div>

                  <div
                    onClick={() => setBookingMode('REQUEST')}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      bookingMode === 'REQUEST'
                        ? 'border-[#5a03cf] bg-[#5a03cf]/10 dark:bg-[#5a03cf]/15'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={`w-4 h-4 ${bookingMode === 'REQUEST' ? 'text-[#5a03cf]' : 'text-gray-400'}`} />
                      <p className="text-sm text-gray-900 dark:text-white">Approbation manuelle</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Validation de chaque demande par vos soins.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasChanges ? 'Des modifications sont prêtes à être enregistrées.' : 'Aucune modification en attente.'}
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleResetChanges}
                  disabled={updateVenueMutation.isPending}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={updateVenueMutation.isPending || !hasChanges}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-5 py-3 text-sm text-white transition-all hover:from-[#6a13df] hover:to-[#8a33ff] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  {updateVenueMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <UnsavedChangesDialog
        open={unsavedChangesGuard.isDialogOpen}
        onOpenChange={unsavedChangesGuard.handleDialogOpenChange}
        onStay={handleDialogStay}
        onConfirmLeave={handleDialogConfirmLeave}
      />
    </div>
  );
}
