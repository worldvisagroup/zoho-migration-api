/**
 * Normalizes date of birth (DOB) from Zoho records:
 * - Accepts Date objects or date strings (e.g. "1990-04-02" or ISO datetime strings).
 * - For date-only strings ("YYYY-MM-DD"), constructs UTC timestamp to prevent timezone shifts across timezones.
 * - Always returns in full UTC ISO 8601 format (e.g. "1990-04-02T00:00:00.000Z").
 * - Returns null if missing, empty, or invalid.
 *
 * @param dobRaw - Raw DOB from Zoho (Leads: Dob, Contacts: DOB)
 * @returns {string | null} UTC ISO 8601 timestamp string or null
 */
export function normalizeDob(dobRaw?: Date | string | null): string | null {
  if (!dobRaw) {
    return null;
  }

  if (dobRaw instanceof Date) {
    if (isNaN(dobRaw.getTime())) {
      return null;
    }
    return dobRaw.toISOString();
  }

  if (typeof dobRaw === 'string') {
    const trimmed = dobRaw.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
      return null;
    }

    // Match YYYY-MM-DD format strictly
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (dateOnlyMatch?.[1] && dateOnlyMatch[2] && dateOnlyMatch[3]) {
      const year = Number(dateOnlyMatch[1]);
      const monthIndex = Number(dateOnlyMatch[2]) - 1;
      const day = Number(dateOnlyMatch[3]);
      const utcDate = new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
      if (isNaN(utcDate.getTime())) {
        return null;
      }
      return utcDate.toISOString();
    }

    // Full ISO or datetime string
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString();
  }

  return null;
}

/**
 * Normalizes Zoho timestamps (Created_Time, Modified_Time) to UTC ISO 8601.
 * - Ensures no internal database timestamps are used.
 * - If the primary timestamp is missing/invalid, falls back to the provided fallback timestamp.
 * - Defaults to Unix epoch UTC ISO string if both are missing/invalid.
 *
 * @param timestampRaw - Primary timestamp from Zoho (e.g. Created_Time, Modified_Time)
 * @param fallbackRaw - Optional fallback timestamp
 * @returns {string} ISO 8601 UTC timestamp string
 */
export function normalizeZohoTimestamp(
  timestampRaw?: Date | string | null,
  fallbackRaw?: Date | string | null,
): string {
  if (timestampRaw) {
    if (timestampRaw instanceof Date && !isNaN(timestampRaw.getTime())) {
      return timestampRaw.toISOString();
    }
    if (typeof timestampRaw === 'string') {
      const parsed = new Date(timestampRaw.trim());
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  if (fallbackRaw) {
    if (fallbackRaw instanceof Date && !isNaN(fallbackRaw.getTime())) {
      return fallbackRaw.toISOString();
    }
    if (typeof fallbackRaw === 'string') {
      const parsed = new Date(fallbackRaw.trim());
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  return new Date(0).toISOString();
}
