export const WEBSITE_PROTOCOL_REGEX = /^https?:\/\//i;

interface WebsiteValidationResult {
  isValid: boolean;
  reason?: string;
}

const PRIVATE_IPV4_RULES: Array<(firstOctet: number, secondOctet: number) => boolean> = [
  (a) => [10, 127, 0].includes(a),
  (a, b) => a === 169 && b === 254,
  (a, b) => a === 172 && b >= 16 && b <= 31,
  (a, b) => a === 192 && b === 168,
];

const PRIVATE_IPV6_CHECKS: Array<(hostname: string) => boolean> = [
  (hostname) => hostname === '::1',
  (hostname) => hostname.startsWith('fc'),
  (hostname) => hostname.startsWith('fd'),
  (hostname) => /^fe[89ab]/.test(hostname),
];

const fail = (reason: string): WebsiteValidationResult => ({ isValid: false, reason });

function parseIPv4Octets(hostname: string): [number, number, number, number] | null {
  const octets = hostname.split('.').map(Number);
  const isValidIPv4 =
    octets.length === 4 &&
    octets.every((num) => Number.isInteger(num) && num >= 0 && num <= 255);

  return isValidIPv4
    ? [octets[0] ?? 0, octets[1] ?? 0, octets[2] ?? 0, octets[3] ?? 0]
    : null;
}

function isPrivateIPv4(hostname: string): boolean {
  const octets = parseIPv4Octets(hostname);
  if (!octets) return false;

  const [firstOctet, secondOctet] = octets;
  return PRIVATE_IPV4_RULES.some((rule) => rule(firstOctet, secondOctet));
}

function isPrivateIPv6(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  const mappedIpv4 = lower.includes(':') && lower.includes('.')
    ? (lower.split(':').at(-1) ?? null)
    : null;

  return [
    ...PRIVATE_IPV6_CHECKS.map((check) => check(lower)),
    Boolean(mappedIpv4 && isPrivateIPv4(mappedIpv4)),
  ].some(Boolean);
}

export function validateWebsiteUrl(value: string): WebsiteValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { isValid: true };
  if (!WEBSITE_PROTOCOL_REGEX.test(trimmed)) return fail('Utilisez un lien complet commençant par http:// ou https://');

  try {
    const parsed = new URL(trimmed);
    const topLevelErrors: Array<[boolean, string]> = [
      [parsed.protocol !== 'http:' && parsed.protocol !== 'https:', 'Seuls les protocoles http:// et https:// sont autorisés.'],
      [Boolean(parsed.username || parsed.password), 'Les URL avec identifiants intégrés sont interdites.'],
    ];
    const topLevelError = topLevelErrors.find(([isInvalid]) => isInvalid);
    if (topLevelError) return fail(topLevelError[1]);

    const hostname = parsed.hostname.toLowerCase();
    const hostnameErrors: Array<[boolean, string]> = [
      [!hostname, 'Nom de domaine invalide.'],
      [hostname === 'localhost' || hostname.endsWith('.localhost'), 'Les domaines locaux (localhost) sont interdits.'],
      [!hostname.includes('.') && !hostname.includes(':'), 'Le nom de domaine doit être public.'],
      [isPrivateIPv4(hostname) || isPrivateIPv6(hostname), 'Les adresses IP privées/locales sont interdites.'],
    ];
    const hostnameError = hostnameErrors.find(([isInvalid]) => isInvalid);
    if (hostnameError) return fail(hostnameError[1]);

    return { isValid: true };
  } catch {
    return fail('URL invalide.');
  }
}

export function isValidWebsiteUrl(value: string): boolean {
  return validateWebsiteUrl(value).isValid;
}
