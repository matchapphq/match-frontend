import { ArrowLeft, Beer, CalendarDays, Clock, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../../api/client';
import { getCheckoutState, saveCheckoutState } from '../../../utils/checkout-state';
import { normalizePhone, type PhoneCountry } from '../../../utils/phone';
import {
  VENUE_DAY_CONFIG as DAY_CONFIG,
  clampTime24,
  formatTime24Input,
  isCompleteTime24,
  type WeekDayKey,
} from '../../../utils/venue-schedule';

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface VenueSummary {
  typeLabel?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: string;
  openingConfigured?: boolean;
  happyHourConfigured?: boolean;
}

interface VenueInfoDraft {
  nomBar?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  telephone?: string;
  email?: string;
  website?: string;
  capacite?: string;
  typeEtablissement?: string;
  phoneCountry?: PhoneCountry;
  useAccountContact?: boolean;
}

const venueTypeMap: Record<string, 'sports_bar' | 'pub' | 'restaurant' | 'cafe'> = {
  bar: 'sports_bar',
  pub: 'pub',
  brasserie: 'restaurant',
  restaurant: 'restaurant',
  cafe: 'cafe',
};

function buildDefaultSchedule(openByDefault: boolean): Record<WeekDayKey, DaySchedule> {
  return DAY_CONFIG.reduce((acc, day) => {
    acc[day.key] = {
      isOpen: openByDefault,
      openTime: day.defaultOpenTime,
      closeTime: day.defaultCloseTime,
    };
    return acc;
  }, {} as Record<WeekDayKey, DaySchedule>);
}

const DEFAULT_CLOSED_SCHEDULE = buildDefaultSchedule(false);

function cloneSchedule(schedule: Record<WeekDayKey, DaySchedule>) {
  return DAY_CONFIG.reduce((acc, day) => {
    acc[day.key] = { ...schedule[day.key] };
    return acc;
  }, {} as Record<WeekDayKey, DaySchedule>);
}

function mapScheduleToOpeningHours(schedule: Record<WeekDayKey, DaySchedule>) {
  return DAY_CONFIG.reduce((acc, day) => {
    const config = schedule[day.key];
    if (!config.isOpen) return acc;
    acc[day.backendKey] = {
      open: config.openTime,
      close: config.closeTime,
      closed: false,
      close_next_day: config.closeTime < config.openTime,
    };
    return acc;
  }, {} as Record<string, { open: string; close: string; closed: boolean; close_next_day: boolean }>);
}

export function ConfigurerHorairesLieu() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { venueId?: string; venueName?: string; venueSummary?: VenueSummary; venueInfoDraft?: VenueInfoDraft } | null) ?? null;

  const [venueId, setVenueId] = useState<string>(locationState?.venueId || '');
  const [venueName, setVenueName] = useState<string>(locationState?.venueName || '');
  const [venueSummary, setVenueSummary] = useState<VenueSummary | null>(locationState?.venueSummary || null);
  const [venueInfoDraft, setVenueInfoDraft] = useState<VenueInfoDraft | null>(locationState?.venueInfoDraft || null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<WeekDayKey>('mon');
  const [openingSchedule, setOpeningSchedule] = useState<Record<WeekDayKey, DaySchedule>>(cloneSchedule(DEFAULT_CLOSED_SCHEDULE));
  const [happyHourEnabled, setHappyHourEnabled] = useState(false);
  const [happyHourSchedule, setHappyHourSchedule] = useState<Record<WeekDayKey, DaySchedule>>(cloneSchedule(DEFAULT_CLOSED_SCHEDULE));

  useEffect(() => {
    if (venueInfoDraft && venueName) return;
    const savedState = getCheckoutState();
    if (!savedState || savedState.type !== 'add-venue') {
      navigate('/my-venues/add/info', { replace: true });
      return;
    }
    if (!savedState.venueInfoDraft && !savedState.venueId) {
      navigate('/my-venues/add/info', { replace: true });
      return;
    }

    setVenueId(savedState.venueId || '');
    setVenueName(savedState.venueName || '');
    setVenueSummary(savedState.venueSummary || null);
    setVenueInfoDraft(savedState.venueInfoDraft || null);
  }, [venueInfoDraft, venueName, navigate]);

  const selectedDayLabel = DAY_CONFIG.find((day) => day.key === selectedDay)?.name || 'Jour';
  const selectedOpeningDaySchedule = openingSchedule[selectedDay];
  const selectedHappyHourDaySchedule = happyHourSchedule[selectedDay];

  const resolvedSummary = useMemo(() => (venueSummary || {}), [venueSummary]);

  const goToSummary = (summaryOverrides: VenueSummary, resolvedVenueId: string) => {
    const mergedSummary = {
      ...resolvedSummary,
      ...summaryOverrides,
    };
    saveCheckoutState({
      type: 'add-venue',
      venueId: resolvedVenueId,
      venueName: venueName || 'Nouveau lieu',
      returnPage: 'mes-restaurants',
      venueSummary: mergedSummary,
      venueInfoDraft: venueInfoDraft || undefined,
    });

    navigate('/my-venues/add/confirmation', {
      replace: true,
      state: {
        venueName: venueName || 'Nouveau lieu',
        venueSummary: mergedSummary,
      },
    });
  };

  const createVenueIfNeeded = async (): Promise<string> => {
    if (venueId) return venueId;
    if (!venueInfoDraft) {
      throw new Error('Les informations du lieu sont manquantes. Revenez à l’étape précédente.');
    }

    const phoneCountry = venueInfoDraft.phoneCountry || 'FR';
    const normalizedPhone = venueInfoDraft.telephone?.trim()
      ? normalizePhone(venueInfoDraft.telephone, phoneCountry)
      : undefined;

    const payload = {
      name: venueInfoDraft.nomBar || '',
      street_address: venueInfoDraft.adresse || '',
      city: venueInfoDraft.ville || '',
      postal_code: venueInfoDraft.codePostal || '',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
      phone: normalizedPhone,
      email: venueInfoDraft.email?.trim() || undefined,
      website: venueInfoDraft.website?.trim() || undefined,
      capacity: parseInt(venueInfoDraft.capacite || '0', 10) || 0,
      type: venueTypeMap[venueInfoDraft.typeEtablissement || 'bar'] || 'sports_bar',
      description: `Etablissement de type ${venueSummary?.typeLabel?.toLowerCase() || 'bar'}`,
    };

    const response = await apiClient.post<{ venue?: { id?: string }; venue_id?: string }>(
      '/partners/venues',
      payload,
    );
    const data = response.data;
    const nextVenueId = data.venue_id
      ? String(data.venue_id)
      : data.venue?.id
      ? String(data.venue.id)
      : '';

    if (!nextVenueId) {
      throw new Error('Identifiant du lieu manquant après création.');
    }

    setVenueId(nextVenueId);
    return nextVenueId;
  };

  const handleScheduleLater = () => {
    setError('');
    setIsSaving(true);
    void (async () => {
      try {
        const resolvedVenueId = await createVenueIfNeeded();
        goToSummary(
          {
            openingConfigured: false,
            happyHourConfigured: false,
          },
          resolvedVenueId,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        const normalized = message.trim().toUpperCase();
        if (
          normalized === 'PAYMENT_METHOD_REQUIRED' ||
          normalized.includes('PAYMENT METHOD IS REQUIRED')
        ) {
          setError('Ajout impossible sans moyen de paiement. Configurez Stripe depuis votre espace facturation.');
        } else {
          setError(message || 'Impossible de créer le lieu pour le moment.');
        }
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleSaveAndContinue = async () => {
    const hasOpenDay = DAY_CONFIG.some((day) => openingSchedule[day.key].isOpen);
    if (!hasOpenDay) {
      setError('Vous devez avoir au moins 1 jour ouvert.');
      return;
    }

    const hasInvalidOpeningSlot = DAY_CONFIG.some((day) => {
      const config = openingSchedule[day.key];
      return config.isOpen && (!isCompleteTime24(config.openTime) || !isCompleteTime24(config.closeTime));
    });
    if (hasInvalidOpeningSlot) {
      setError('Complète tous les horaires d’ouverture au format HH:MM.');
      return;
    }

    if (happyHourEnabled) {
      const hasInvalidHappyHourSlot = DAY_CONFIG.some((day) => {
        const config = happyHourSchedule[day.key];
        return config.isOpen && (!isCompleteTime24(config.openTime) || !isCompleteTime24(config.closeTime));
      });
      if (hasInvalidHappyHourSlot) {
        setError('Complète tous les horaires happy hour au format HH:MM.');
        return;
      }
    }

    setError('');
    setIsSaving(true);

    try {
      const resolvedVenueId = await createVenueIfNeeded();
      const openingHoursPayload = mapScheduleToOpeningHours(openingSchedule);
      const happyHoursPayload = happyHourEnabled ? mapScheduleToOpeningHours(happyHourSchedule) : {};

      await apiClient.put(`/venues/${resolvedVenueId}`, {
        opening_hours: openingHoursPayload,
        happy_hours: happyHoursPayload,
      });

      goToSummary(
        {
          openingConfigured: true,
          happyHourConfigured: happyHourEnabled && Object.keys(happyHoursPayload).length > 0,
        },
        resolvedVenueId,
      );
    } catch (err) {
      console.error('Failed to save schedules:', err);
      const message = err instanceof Error ? err.message : '';
      const normalized = message.trim().toUpperCase();
      if (
        normalized === 'PAYMENT_METHOD_REQUIRED' ||
        normalized.includes('PAYMENT METHOD IS REQUIRED')
      ) {
        setError('Ajout impossible sans moyen de paiement. Configurez Stripe depuis votre espace facturation.');
      } else {
        setError(message || 'Impossible d’enregistrer les horaires pour le moment.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <button
            onClick={() =>
              navigate('/my-venues/add/info', {
                state: {
                  venueInfoDraft: venueInfoDraft || undefined,
                },
              })
            }
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/75 backdrop-blur-xl p-6 shadow-sm">
          <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Configurer les horaires</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {venueName ? `Lieu: ${venueName}` : 'Configurez les jours d’ouverture et le happy hour.'}
          </p>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          ) : null}

          <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900 p-4 mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
              <CalendarDays className="w-4 h-4 text-[#5a03cf]" />
              Choix du jour
            </label>
            <div className="flex items-center gap-2">
              {DAY_CONFIG.map((day) => {
                const isSelected = selectedDay === day.key;
                const dayIsOpen = openingSchedule[day.key].isOpen;
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedDay(day.key)}
                    title={day.name}
                    className={`h-10 flex-1 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-[#5a03cf] bg-[#5a03cf]/10 text-[#5a03cf]'
                        : dayIsOpen
                          ? 'border-[#9cff02]/40 bg-[#9cff02]/10 text-[#2f6a00] dark:text-[#9cff02]'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-[#5a03cf]" />
                Ouverture ({selectedDayLabel})
              </label>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Horaires du {selectedDayLabel}</label>
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 mb-3">
                <button
                  type="button"
                  onClick={() =>
                      setOpeningSchedule((prev) => ({
                        ...prev,
                        [selectedDay]: {
                          ...prev[selectedDay],
                          isOpen: true,
                        },
                      }))
                  }
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    selectedOpeningDaySchedule.isOpen
                      ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Ouvert
                </button>
                <button
                  type="button"
                  onClick={() =>
                      setOpeningSchedule((prev) => ({
                        ...prev,
                        [selectedDay]: {
                          ...prev[selectedDay],
                          isOpen: false,
                        },
                      }))
                  }
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    !selectedOpeningDaySchedule.isOpen
                      ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Fermé
                </button>
              </div>

              {selectedOpeningDaySchedule.isOpen ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ouvre à</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="00:00"
                      maxLength={5}
                      value={selectedOpeningDaySchedule.openTime}
                      onChange={(e) =>
                        setOpeningSchedule((prev) => ({
                          ...prev,
                          [selectedDay]: {
                            ...prev[selectedDay],
                            openTime: formatTime24Input(e.target.value),
                          },
                        }))
                      }
                      onBlur={(e) =>
                        setOpeningSchedule((prev) => ({
                          ...prev,
                          [selectedDay]: {
                            ...prev[selectedDay],
                            openTime: clampTime24(e.target.value, prev[selectedDay].openTime),
                          },
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ferme à</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="00:00"
                        maxLength={5}
                        value={selectedOpeningDaySchedule.closeTime}
                        onChange={(e) =>
                          setOpeningSchedule((prev) => ({
                            ...prev,
                            [selectedDay]: {
                              ...prev[selectedDay],
                              closeTime: formatTime24Input(e.target.value),
                            },
                          }))
                        }
                        onBlur={(e) =>
                          setOpeningSchedule((prev) => ({
                            ...prev,
                            [selectedDay]: {
                              ...prev[selectedDay],
                              closeTime: clampTime24(e.target.value, prev[selectedDay].closeTime),
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                      />
                      {isCompleteTime24(selectedOpeningDaySchedule.openTime) &&
                      isCompleteTime24(selectedOpeningDaySchedule.closeTime) &&
                      selectedOpeningDaySchedule.closeTime < selectedOpeningDaySchedule.openTime ? (
                        <span className="shrink-0 inline-block text-xs font-medium text-[#5a03cf]">+1</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/50 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                  Fermé ce jour.
                </div>
              )}
            </section>

            <section className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Beer className="w-4 h-4 text-[#5a03cf]" />
                Happy hour ({selectedDayLabel})
              </label>

              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 mb-3">
                <button
                  type="button"
                  onClick={() => setHappyHourEnabled(true)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    happyHourEnabled
                      ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setHappyHourEnabled(false)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    !happyHourEnabled
                      ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Non
                </button>
              </div>

              {happyHourEnabled ? (
                <>
                  <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 mb-3">
                    <button
                      type="button"
                      onClick={() =>
                        setHappyHourSchedule((prev) => ({
                          ...prev,
                          [selectedDay]: {
                            ...prev[selectedDay],
                            isOpen: true,
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                        selectedHappyHourDaySchedule.isOpen
                          ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Ouvert
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHappyHourSchedule((prev) => ({
                          ...prev,
                          [selectedDay]: {
                            ...prev[selectedDay],
                            isOpen: false,
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                        !selectedHappyHourDaySchedule.isOpen
                          ? 'bg-white dark:bg-gray-900 text-[#5a03cf] shadow-sm'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Fermé
                    </button>
                  </div>

                  {selectedHappyHourDaySchedule.isOpen ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ouvre à</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="00:00"
                          maxLength={5}
                          value={selectedHappyHourDaySchedule.openTime}
                          onChange={(e) =>
                            setHappyHourSchedule((prev) => ({
                              ...prev,
                              [selectedDay]: {
                                ...prev[selectedDay],
                                openTime: formatTime24Input(e.target.value),
                              },
                            }))
                          }
                          onBlur={(e) =>
                            setHappyHourSchedule((prev) => ({
                              ...prev,
                              [selectedDay]: {
                                ...prev[selectedDay],
                                openTime: clampTime24(e.target.value, prev[selectedDay].openTime),
                              },
                            }))
                          }
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ferme à</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="00:00"
                            maxLength={5}
                            value={selectedHappyHourDaySchedule.closeTime}
                            onChange={(e) =>
                              setHappyHourSchedule((prev) => ({
                                ...prev,
                                [selectedDay]: {
                                  ...prev[selectedDay],
                                  closeTime: formatTime24Input(e.target.value),
                                },
                              }))
                            }
                            onBlur={(e) =>
                              setHappyHourSchedule((prev) => ({
                                ...prev,
                                [selectedDay]: {
                                  ...prev[selectedDay],
                                  closeTime: clampTime24(e.target.value, prev[selectedDay].closeTime),
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5a03cf]/10 focus:border-[#5a03cf]/40 transition-colors"
                          />
                          {isCompleteTime24(selectedHappyHourDaySchedule.openTime) &&
                          isCompleteTime24(selectedHappyHourDaySchedule.closeTime) &&
                          selectedHappyHourDaySchedule.closeTime < selectedHappyHourDaySchedule.openTime ? (
                            <span className="shrink-0 inline-block text-xs font-medium text-[#5a03cf]">+1</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/50 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                      Happy hour désactivé pour ce jour.
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/50 px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                  Happy hour désactivé.
                </div>
              )}
            </section>
          </div>

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleScheduleLater}
              disabled={isSaving}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 disabled:opacity-50"
            >
              Configurer les horaires plus tard
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5a03cf] px-5 py-3 text-sm text-white transition-colors hover:bg-[#4a02af] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enregistrer et continuer
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Si vous choisissez de configurer plus tard, le lieu restera inactif tant que les horaires ne sont pas renseignés.
          </p>
        </div>
      </div>
    </div>
  );
}
