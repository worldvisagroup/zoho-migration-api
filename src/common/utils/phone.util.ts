import {
  parsePhoneNumberFromString,
  isSupportedCountry,
  type CountryCode,
} from 'libphonenumber-js';

/**
 * Default fallback phone number when no usable number is provided in Zoho records.
 */
export const DEFAULT_FALLBACK_PHONE = '+919999999999';

/**
 * Parsed representation of country information extracted from Country_Code field.
 */
export interface ExtractedCountryInfo {
  isoCode?: CountryCode;
  callingCode?: string;
}

/**
 * Known mappings for common Zoho country names or custom values to ISO 3166-1 alpha-2 codes.
 */
const COUNTRY_NAME_TO_ISO: Record<string, CountryCode> = {
  india: 'IN',
  usa: 'US',
  us: 'US',
  unitedstates: 'US',
  canada: 'CA',
  uk: 'GB',
  unitedkingdom: 'GB',
  australia: 'AU',
  singapore: 'SG',
  germany: 'DE',
  uae: 'AE',
  newzealand: 'NZ',
};

/**
 * Calling code to ISO country code mapping for common countries.
 */
const CALLING_CODE_TO_ISO: Record<string, CountryCode> = {
  '91': 'IN',
  '1': 'US',
  '44': 'GB',
  '61': 'AU',
  '65': 'SG',
  '49': 'DE',
  '971': 'AE',
  '64': 'NZ',
};

/**
 * Extracts calling code and ISO country code from Zoho's Country_Code field.
 * Handles inputs like:
 * - "+91 - India"
 * - "IN - India"
 * - "91"
 * - "+1 - USA"
 * - "+91"
 * - "IN"
 * - null / ""
 *
 * @param countryCodeRaw - Raw Country_Code string from Zoho record
 * @returns {ExtractedCountryInfo} Extracted ISO code and numerical calling code
 */
export function extractCountryCodeInfo(countryCodeRaw?: string | null): ExtractedCountryInfo {
  if (!countryCodeRaw || typeof countryCodeRaw !== 'string') {
    return { isoCode: 'IN', callingCode: '91' };
  }

  const raw = countryCodeRaw.trim();
  if (!raw || raw.toLowerCase() === 'null' || raw.toLowerCase() === 'undefined') {
    return { isoCode: 'IN', callingCode: '91' };
  }

  let isoCode: CountryCode | undefined;
  let callingCode: string | undefined;

  // 1. Check for leading calling code (e.g., "+91", "91", "+1")
  const plusCallingMatch = /^\+?(\d{1,4})\b/.exec(raw);
  if (plusCallingMatch?.[1]) {
    callingCode = plusCallingMatch[1];
    if (CALLING_CODE_TO_ISO[callingCode]) {
      isoCode = CALLING_CODE_TO_ISO[callingCode];
    }
  }

  // 2. Check for 2-letter ISO code at start (e.g., "IN - India")
  const isoMatch = /^([A-Za-z]{2})\b/.exec(raw);
  if (isoMatch?.[1]) {
    const candidate = isoMatch[1].toUpperCase();
    if (isSupportedCountry(candidate)) {
      isoCode = candidate as CountryCode;
    }
  }

  // 3. Check for country names anywhere in the string (e.g. "India", "USA")
  if (!isoCode) {
    const lower = raw.toLowerCase().replace(/[^a-z]/g, '');
    for (const [name, iso] of Object.entries(COUNTRY_NAME_TO_ISO)) {
      if (lower.includes(name)) {
        isoCode = iso;
        break;
      }
    }
  }

  // If isoCode found without callingCode, set known calling code
  if (isoCode && !callingCode) {
    for (const [code, iso] of Object.entries(CALLING_CODE_TO_ISO)) {
      if (iso === isoCode) {
        callingCode = code;
        break;
      }
    }
  }

  return {
    isoCode: isoCode ?? 'IN',
    callingCode: callingCode ?? '91',
  };
}

/**
 * Normalizes a raw phone candidate with country information.
 * - Resolves international format starting with `+` followed by digits.
 * - Removes whitespace, hyphens, and formatting characters.
 * - Prevents duplicating calling codes.
 * - Uses libphonenumber-js for strict E.164 parsing and validation.
 *
 * @param phoneRaw - Raw phone candidate
 * @param countryInfo - Extracted country calling code / ISO info
 * @returns {string | null} Normalized E.164 phone number, or null if unparseable
 */
export function sanitizeAndParsePhoneNumber(
  phoneRaw: string,
  countryInfo: ExtractedCountryInfo,
): string | null {
  const trimmed = phoneRaw.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return null;
  }

  // Remove whitespace and formatting characters except '+'
  const cleaned = trimmed.replace(/[^\d+]/g, '');
  if (!cleaned || cleaned === '+') {
    return null;
  }

  // Case A: Phone already starts with '+'
  if (cleaned.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(cleaned);
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164');
    }

    // Fallback if libphonenumber fails but it's a valid international format: +[1-9]\d{6,14}
    if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
      return cleaned;
    }
  }

  // Case B: Phone doesn't start with '+', but digits only
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }

  const callingCode = countryInfo.callingCode ?? '91';
  const defaultCountry = countryInfo.isoCode ?? 'IN';

  // Check if digits already start with the calling code (e.g. "919060443444")
  if (digitsOnly.startsWith(callingCode) && digitsOnly.length > callingCode.length + 5) {
    const withPlus = `+${digitsOnly}`;
    const parsed = parsePhoneNumberFromString(withPlus);
    if (parsed) {
      return parsed.format('E.164');
    }
    if (/^\+[1-9]\d{6,14}$/.test(withPlus)) {
      return withPlus;
    }
  }

  // Try parsing with the resolved defaultCountry (e.g., standard national number "9060443444")
  const parsedWithCountry = parsePhoneNumberFromString(digitsOnly, defaultCountry);
  if (parsedWithCountry && parsedWithCountry.isValid()) {
    return parsedWithCountry.format('E.164');
  }

  // Try prefixing calling code explicitly: +{callingCode}{digitsOnly}
  const constructed = `+${callingCode}${digitsOnly}`;
  const parsedConstructed = parsePhoneNumberFromString(constructed);
  if (parsedConstructed) {
    return parsedConstructed.format('E.164');
  }

  // Fallback structural validation
  if (/^\+[1-9]\d{6,14}$/.test(constructed)) {
    return constructed;
  }

  return null;
}

/**
 * Normalizes phone numbers according to Zoho migration requirements:
 * 1. Checks primary `Phone`.
 * 2. If missing or invalid, falls back to `Mobile`.
 * 3. Extracts country info from `Country_Code`.
 * 4. Normalizes to consistent international E.164 format.
 * 5. Falls back to `+919999999999` only when a usable number cannot be determined.
 *
 * @param phoneRaw - Primary Phone from Zoho record
 * @param mobileRaw - Mobile from Zoho record
 * @param countryCodeRaw - Country_Code from Zoho record
 * @param defaultPhone - Optional override for fallback (defaults to DEFAULT_FALLBACK_PHONE)
 * @returns {string} Normalized international phone number
 */
export function normalizePhoneNumber(
  phoneRaw?: string | null,
  mobileRaw?: string | null,
  countryCodeRaw?: string | null,
  defaultPhone: string = DEFAULT_FALLBACK_PHONE,
): string {
  const countryInfo = extractCountryCodeInfo(countryCodeRaw);

  if (typeof phoneRaw === 'string') {
    const normalizedPhone = sanitizeAndParsePhoneNumber(phoneRaw, countryInfo);
    if (normalizedPhone) {
      return normalizedPhone;
    }
  }

  if (typeof mobileRaw === 'string') {
    const normalizedMobile = sanitizeAndParsePhoneNumber(mobileRaw, countryInfo);
    if (normalizedMobile) {
      return normalizedMobile;
    }
  }

  return defaultPhone;
}
