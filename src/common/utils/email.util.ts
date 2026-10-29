/**
 * Default fallback email address when no valid email is found in Zoho records.
 */
export const DEFAULT_FALLBACK_EMAIL = 'notprovided@gmail.com';

/**
 * Validates and sanitizes a raw email candidate string.
 * - Converts to lowercase.
 * - Trims and removes all internal whitespace characters.
 * - Rejects empty values, strings without '@', or literals like 'null' / 'undefined'.
 *
 * @param candidate - Raw candidate email string
 * @returns {string} Cleaned email or empty string if invalid
 */
export function sanitizeEmail(candidate?: string | null): string {
  if (!candidate || typeof candidate !== 'string') {
    return '';
  }

  const cleaned = candidate.toLowerCase().replace(/\s+/g, '').trim();

  if (!cleaned || cleaned === 'null' || cleaned === 'undefined' || !cleaned.includes('@')) {
    return '';
  }

  return cleaned;
}

/**
 * Normalizes an email address according to Zoho migration requirements:
 * 1. Checks primary `Email`.
 * 2. If missing or invalid, falls back to `Secondary_Email`.
 * 3. Defaults to `notprovided@gmail.com` if neither field contains a usable value.
 *
 * @param emailRaw - Primary Email from Zoho record
 * @param secondaryEmailRaw - Secondary_Email from Zoho record
 * @param defaultEmail - Optional override for fallback (defaults to DEFAULT_FALLBACK_EMAIL)
 * @returns {string} Sanitized, normalized email address
 */
export function normalizeEmail(
  emailRaw?: string | null,
  secondaryEmailRaw?: string | null,
  defaultEmail: string = DEFAULT_FALLBACK_EMAIL,
): string {
  const primary = sanitizeEmail(emailRaw);
  if (primary) {
    return primary;
  }

  const secondary = sanitizeEmail(secondaryEmailRaw);
  if (secondary) {
    return secondary;
  }

  return defaultEmail;
}
