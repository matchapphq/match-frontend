export type PhoneCountry = 'FR' | 'US';

export const PHONE_COUNTRY_ORDER: PhoneCountry[] = ['FR', 'US'];

export function getCountryDialCode(country: PhoneCountry): string {
  return country === 'US' ? '+1' : '+33';
}

export function CountryFlag({
  country,
  className = 'h-4 w-6 rounded-[2px] shadow-sm',
}: {
  country: PhoneCountry;
  className?: string;
}) {
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

export function inferPhoneCountry(value?: string | null): PhoneCountry {
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

export function formatPhoneInput(value: string, country: PhoneCountry): string {
  return country === 'US' ? formatUsPhoneInput(value) : formatFrenchPhoneInput(value);
}

export function normalizePhone(value: string, country: PhoneCountry): string | null {
  return country === 'US' ? normalizeUsPhone(value) : normalizeFrenchPhone(value);
}

export function getPhonePlaceholder(country: PhoneCountry): string {
  return country === 'US' ? '(201) 555-0123' : '06 12 34 56 78';
}

export function getPhoneErrorMessage(country: PhoneCountry): string {
  return country === 'US'
    ? 'Numéro invalide. Format attendu : (201) 555-0123'
    : 'Numéro invalide. Format attendu : 06 12 34 56 78';
}
