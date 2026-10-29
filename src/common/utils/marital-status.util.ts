/**
 * Standardized marital status output values supported by the migration API.
 */
export type StandardMaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

/**
 * Normalizes Zoho marital_status field values to standard enum:
 * - 'Married' -> 'married'
 * - 'Un-married', 'Unmarried', 'Single' -> 'single'
 * - 'Divorced / Separated', 'Divorced', 'Separated' -> 'divorced'
 * - 'Widowed', 'Widow', 'Widower' -> 'widowed'
 * - Unrecognized, missing, or empty -> null
 *
 * @param statusRaw - Raw marital_status field value from Zoho
 * @returns {StandardMaritalStatus | null} Standardized marital status or null
 */
export function normalizeMaritalStatus(statusRaw?: string | null): StandardMaritalStatus | null {
  if (!statusRaw || typeof statusRaw !== 'string') {
    return null;
  }

  const cleaned = statusRaw.trim().toLowerCase();
  if (!cleaned || cleaned === 'null' || cleaned === 'undefined') {
    return null;
  }

  if (cleaned === 'married') {
    return 'married';
  }

  if (cleaned === 'un-married' || cleaned === 'unmarried' || cleaned === 'single') {
    return 'single';
  }

  if (cleaned.includes('divorced') || cleaned.includes('separated')) {
    return 'divorced';
  }

  if (cleaned.includes('widow')) {
    return 'widowed';
  }

  return null;
}
