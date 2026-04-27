export interface PricingLabelInput {
  default_rate: string | number;
  currency: string;
  unit: string;
}

const UNIT_LABELS: Record<string, { fr: string; en: string }> = {
  guest_checked_in: {
    fr: 'client présent',
    en: 'checked-in guest',
  },
};

function resolveLanguage(locale: string): 'fr' | 'en' {
  return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function resolveUnitLabel(unit: string, locale: string): string {
  const mapped = UNIT_LABELS[unit];
  if (mapped) {
    return mapped[resolveLanguage(locale)];
  }

  return unit.replace(/_/g, ' ');
}

function parseRate(defaultRate: string | number): number | null {
  if (typeof defaultRate === 'number') {
    return Number.isFinite(defaultRate) ? defaultRate : null;
  }

  const normalized = defaultRate.replace(',', '.').trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Build a human-readable commission pricing label from atomic API fields.
 *
 * Example: "1,50 $ / client présent" (fr-FR)
 */
export function formatPricingLabel(
  pricing: PricingLabelInput,
  locale: string = 'fr-FR',
): string {
  const unitLabel = resolveUnitLabel(pricing.unit, locale);
  const parsedRate = parseRate(pricing.default_rate);

  if (parsedRate === null) {
    return `${pricing.default_rate} ${pricing.currency} / ${unitLabel}`;
  }

  const amountLabel = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: pricing.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedRate);

  return `${amountLabel} / ${unitLabel}`;
}
