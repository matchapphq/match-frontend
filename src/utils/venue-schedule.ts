export type WeekDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface VenueDayConfig {
  key: WeekDayKey;
  backendKey: string;
  dayOfWeek: number;
  label: string;
  name: string;
  defaultOpenTime: string;
  defaultCloseTime: string;
}

export const VENUE_DAY_CONFIG: VenueDayConfig[] = [
  { key: 'mon', backendKey: 'monday', dayOfWeek: 1, label: 'L', name: 'Lundi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'tue', backendKey: 'tuesday', dayOfWeek: 2, label: 'M', name: 'Mardi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'wed', backendKey: 'wednesday', dayOfWeek: 3, label: 'M', name: 'Mercredi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'thu', backendKey: 'thursday', dayOfWeek: 4, label: 'J', name: 'Jeudi', defaultOpenTime: '11:00', defaultCloseTime: '23:00' },
  { key: 'fri', backendKey: 'friday', dayOfWeek: 5, label: 'V', name: 'Vendredi', defaultOpenTime: '11:00', defaultCloseTime: '01:00' },
  { key: 'sat', backendKey: 'saturday', dayOfWeek: 6, label: 'S', name: 'Samedi', defaultOpenTime: '11:00', defaultCloseTime: '01:00' },
  { key: 'sun', backendKey: 'sunday', dayOfWeek: 0, label: 'D', name: 'Dimanche', defaultOpenTime: '11:00', defaultCloseTime: '22:00' },
];

export const VENUE_WEEK_DAYS: Array<{ key: WeekDayKey; label: string; name: string }> = VENUE_DAY_CONFIG.map((day) => ({
  key: day.key,
  label: day.label,
  name: day.name,
}));

export function normalizeHour(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 5);
  return fallback;
}

export function formatTime24Input(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';

  const hourRaw = digits.slice(0, 2);
  const minuteRaw = digits.slice(2, 4);

  let hour = hourRaw;
  if (hourRaw.length === 2) {
    const hourNumber = Math.min(23, Number(hourRaw));
    hour = String(Number.isFinite(hourNumber) ? hourNumber : 0).padStart(2, '0');
  }

  if (digits.length <= 2) return hour;

  let minute = minuteRaw;
  if (minuteRaw.length === 2) {
    const minuteNumber = Math.min(59, Number(minuteRaw));
    minute = String(Number.isFinite(minuteNumber) ? minuteNumber : 0).padStart(2, '0');
  }

  return `${hour}:${minute}`;
}

export function clampTime24(value: string, fallback: string) {
  const formatted = formatTime24Input(value);
  if (!/^\d{2}:\d{2}$/.test(formatted)) return fallback;
  const [hRaw, mRaw] = formatted.split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return fallback;
  if (h < 0 || h > 23 || m < 0 || m > 59) return fallback;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isCompleteTime24(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

