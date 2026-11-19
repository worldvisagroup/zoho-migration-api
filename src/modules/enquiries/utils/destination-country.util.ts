/**
 * Sanitizes candidate country string.
 * Discards empty values, whitespace, literal 'null', 'undefined', and '-None-'.
 *
 * @param candidate - Raw candidate country string
 * @returns {string | null} Cleaned country or null if invalid/missing
 */
export function sanitizeCountry(candidate?: string | null): string | null {
  if (!candidate || typeof candidate !== 'string') {
    return null;
  }
  const trimmed = candidate.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed || lower === 'null' || lower === 'undefined' || lower === '-none-') {
    return null;
  }
  return trimmed;
}

/**
 * Extracts destination country for Leads following prioritized cascade:
 * 1. country_addressed
 * 2. intended_country (first element if array)
 * 3. Related Visa Application Qualified_Country
 * 4. unified_entries.destinationCountry
 *
 * @param countryAddressed - Primary lead country addressed
 * @param intendedCountry - Multiselect or single intended country
 * @param visaAppCountry - Qualified country from matched visa application
 * @param unifiedCountry - Destination country from matched unified entry
 * @returns {string | null} Normalized destination country or null
 */
export function resolveLeadDestinationCountry(
  countryAddressed?: string | null,
  intendedCountry?: string[] | string | null,
  visaAppCountry?: string | null,
  unifiedCountry?: string | null,
): string | null {
  const addressed = sanitizeCountry(countryAddressed);
  if (addressed) {
    return addressed;
  }

  let candidateIntended: string | null = null;
  if (Array.isArray(intendedCountry) && intendedCountry.length > 0) {
    candidateIntended = sanitizeCountry(intendedCountry[0]);
  } else if (typeof intendedCountry === 'string') {
    candidateIntended = sanitizeCountry(intendedCountry);
  }
  if (candidateIntended) {
    return candidateIntended;
  }

  const visaCountry = sanitizeCountry(visaAppCountry);
  if (visaCountry) {
    return visaCountry;
  }

  const unified = sanitizeCountry(unifiedCountry);
  if (unified) {
    return unified;
  }

  return null;
}

/**
 * Extracts destination country for Contacts following prioritized cascade:
 * 1. country_finalised
 * 2. Country_Qualified_for
 * 3. Related Visa Application Qualified_Country
 * 4. unified_entries.destinationCountry
 *
 * @param countryFinalised - Finalized country on contact
 * @param countryQualifiedFor - Qualified for country on contact
 * @param visaAppCountry - Qualified country from matched visa application
 * @param unifiedCountry - Destination country from matched unified entry
 * @returns {string | null} Normalized destination country or null
 */
export function resolveContactDestinationCountry(
  countryFinalised?: string | null,
  countryQualifiedFor?: string | null,
  visaAppCountry?: string | null,
  unifiedCountry?: string | null,
): string | null {
  const finalised = sanitizeCountry(countryFinalised);
  if (finalised) {
    return finalised;
  }

  const qualified = sanitizeCountry(countryQualifiedFor);
  if (qualified) {
    return qualified;
  }

  const visaCountry = sanitizeCountry(visaAppCountry);
  if (visaCountry) {
    return visaCountry;
  }

  const unified = sanitizeCountry(unifiedCountry);
  if (unified) {
    return unified;
  }

  return null;
}
