import {
  isSupportedCountry,
  parsePhoneNumberFromString,
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
/**
 * Known mappings for common country names, aliases, and custom values
 * to ISO 3166-1 alpha-2 country codes.
 *
 * Normalize country names to lowercase and remove spaces, hyphens,
 * apostrophes, and other non-alphanumeric characters before lookup.
 */
const COUNTRY_NAME_TO_ISO: Record<string, CountryCode> = {
  // Asia
  india: 'IN',
  pakistan: 'PK',
  bangladesh: 'BD',
  srilanka: 'LK',
  nepal: 'NP',
  bhutan: 'BT',
  maldives: 'MV',
  afghanistan: 'AF',
  china: 'CN',
  japan: 'JP',
  southkorea: 'KR',
  korea: 'KR',
  northkorea: 'KP',
  taiwan: 'TW',
  hongkong: 'HK',
  macau: 'MO',
  indonesia: 'ID',
  malaysia: 'MY',
  thailand: 'TH',
  vietnam: 'VN',
  philippines: 'PH',
  singapore: 'SG',
  myanmar: 'MM',
  burma: 'MM',
  cambodia: 'KH',
  laos: 'LA',
  brunei: 'BN',
  mongolia: 'MN',
  kazakhstan: 'KZ',
  uzbekistan: 'UZ',
  kyrgyzstan: 'KG',
  tajikistan: 'TJ',
  turkmenistan: 'TM',
  timorleste: 'TL',
  easttimor: 'TL',

  // Middle East
  uae: 'AE',
  unitedarabemirates: 'AE',
  saudiarabia: 'SA',
  ksa: 'SA',
  qatar: 'QA',
  kuwait: 'KW',
  oman: 'OM',
  bahrain: 'BH',
  yemen: 'YE',
  iraq: 'IQ',
  iran: 'IR',
  israel: 'IL',
  palestine: 'PS',
  palestinianterritories: 'PS',
  jordan: 'JO',
  lebanon: 'LB',
  syria: 'SY',
  turkey: 'TR',
  turkiye: 'TR',
  cyprus: 'CY',

  // Europe
  uk: 'GB',
  gb: 'GB',
  greatbritain: 'GB',
  britain: 'GB',
  unitedkingdom: 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  northernireland: 'GB',
  ireland: 'IE',
  france: 'FR',
  germany: 'DE',
  italy: 'IT',
  spain: 'ES',
  portugal: 'PT',
  netherlands: 'NL',
  holland: 'NL',
  belgium: 'BE',
  luxembourg: 'LU',
  switzerland: 'CH',
  austria: 'AT',
  denmark: 'DK',
  sweden: 'SE',
  norway: 'NO',
  finland: 'FI',
  iceland: 'IS',
  poland: 'PL',
  czechrepublic: 'CZ',
  czechia: 'CZ',
  slovakia: 'SK',
  hungary: 'HU',
  romania: 'RO',
  bulgaria: 'BG',
  greece: 'GR',
  ukraine: 'UA',
  belarus: 'BY',
  moldova: 'MD',
  estonia: 'EE',
  latvia: 'LV',
  lithuania: 'LT',
  croatia: 'HR',
  slovenia: 'SI',
  serbia: 'RS',
  montenegro: 'ME',
  bosniaandherzegovina: 'BA',
  bosnia: 'BA',
  albania: 'AL',
  macedonia: 'MK',
  northmacedonia: 'MK',
  kosovo: 'XK',
  russia: 'RU',
  russianfederation: 'RU',
  malta: 'MT',
  monaco: 'MC',
  liechtenstein: 'LI',
  andorra: 'AD',
  sanmarino: 'SM',
  vaticancity: 'VA',

  // North America
  usa: 'US',
  us: 'US',
  unitedstates: 'US',
  unitedstatesofamerica: 'US',
  america: 'US',
  canada: 'CA',
  mexico: 'MX',
  greenland: 'GL',
  bermuda: 'BM',

  // Central America
  belize: 'BZ',
  costarica: 'CR',
  elsalvador: 'SV',
  guatemala: 'GT',
  honduras: 'HN',
  nicaragua: 'NI',
  panama: 'PA',

  // Caribbean
  antiguandbarbuda: 'AG',
  bahamas: 'BS',
  barbados: 'BB',
  cuba: 'CU',
  dominica: 'DM',
  dominicanrepublic: 'DO',
  grenada: 'GD',
  haiti: 'HT',
  jamaica: 'JM',
  saintkittsandnevis: 'KN',
  saintlucia: 'LC',
  saintvincentandthegrenadines: 'VC',
  saintvincent: 'VC',
  trinidadandtobago: 'TT',
  trinidad: 'TT',
  tobago: 'TT',

  // South America
  brazil: 'BR',
  argentina: 'AR',
  chile: 'CL',
  colombia: 'CO',
  peru: 'PE',
  venezuela: 'VE',
  ecuador: 'EC',
  bolivia: 'BO',
  paraguay: 'PY',
  uruguay: 'UY',
  guyana: 'GY',
  suriname: 'SR',

  // Africa
  southafrica: 'ZA',
  nigeria: 'NG',
  kenya: 'KE',
  uganda: 'UG',
  tanzania: 'TZ',
  rwanda: 'RW',
  burundi: 'BI',
  ethiopia: 'ET',
  eritrea: 'ER',
  djibouti: 'DJ',
  somalia: 'SO',
  sudan: 'SD',
  southsudan: 'SS',
  egypt: 'EG',
  libya: 'LY',
  tunisia: 'TN',
  algeria: 'DZ',
  morocco: 'MA',
  mauritania: 'MR',
  mali: 'ML',
  niger: 'NE',
  chad: 'TD',
  senegal: 'SN',
  gambia: 'GM',
  ghana: 'GH',
  ivorycoast: 'CI',
  cotedivoire: 'CI',
  liberia: 'LR',
  sierraleone: 'SL',
  guinea: 'GN',
  guineabissau: 'GW',
  burkinafaso: 'BF',
  togo: 'TG',
  benin: 'BJ',
  cameroon: 'CM',
  centralafricanrepublic: 'CF',
  equatorialguinea: 'GQ',
  gabon: 'GA',
  republicofthecongo: 'CG',
  congo: 'CG',
  democraticrepublicofthecongo: 'CD',
  drcongo: 'CD',
  congodemocraticrepublic: 'CD',
  angola: 'AO',
  zambia: 'ZM',
  zimbabwe: 'ZW',
  botswana: 'BW',
  namibia: 'NA',
  lesotho: 'LS',
  eswatini: 'SZ',
  swaziland: 'SZ',
  madagascar: 'MG',
  mauritius: 'MU',
  seychelles: 'SC',
  comoros: 'KM',
  mozambique: 'MZ',
  malawi: 'MW',
  caboverde: 'CV',
  capeverde: 'CV',
  saotomeandprincipe: 'ST',

  // Oceania
  australia: 'AU',
  newzealand: 'NZ',
  fiji: 'FJ',
  papuanewguinea: 'PG',
  samoa: 'WS',
  tonga: 'TO',
  vanuatu: 'VU',
  solomonislands: 'SB',
  kiribati: 'KI',
  tuvalu: 'TV',
  nauru: 'NR',
  palau: 'PW',
  marshallislands: 'MH',
  micronesia: 'FM',

  // Common alternative names
  unitedrepublicoftanzania: 'TZ',
  laopeoplesdemocraticrepublic: 'LA',
  bruneidarussalam: 'BN',
  bolivarianrepublicofvenezuela: 'VE',
  plurinationalstateofbolivia: 'BO',
  republicofkorea: 'KR',
  republicofindia: 'IN',
  republicofsingapore: 'SG',
  russian: 'RU',
};

/**
 * Calling code to ISO country code mapping for common countries.
 */
const CALLING_CODE_TO_ISO: Record<string, CountryCode> = {
  // Asia
  '91': 'IN',
  '92': 'PK',
  '880': 'BD',
  '94': 'LK',
  '977': 'NP',
  '975': 'BT',
  '960': 'MV',
  '93': 'AF',
  '86': 'CN',
  '852': 'HK',
  '853': 'MO',
  '886': 'TW',
  '81': 'JP',
  '82': 'KR',
  '850': 'KP',
  '62': 'ID',
  '60': 'MY',
  '66': 'TH',
  '84': 'VN',
  '63': 'PH',
  '65': 'SG',
  '95': 'MM',
  '855': 'KH',
  '856': 'LA',
  '673': 'BN',
  '976': 'MN',
  '7': 'RU',
  '998': 'UZ',
  '996': 'KG',
  '992': 'TJ',
  '993': 'TM',
  '994': 'AZ',
  '995': 'GE',
  '374': 'AM',
  '375': 'BY',
  '380': 'UA',
  '670': 'TL',

  // Middle East
  '971': 'AE',
  '966': 'SA',
  '974': 'QA',
  '965': 'KW',
  '968': 'OM',
  '973': 'BH',
  '967': 'YE',
  '964': 'IQ',
  '98': 'IR',
  '972': 'IL',
  '970': 'PS',
  '962': 'JO',
  '961': 'LB',
  '963': 'SY',
  '90': 'TR',
  '357': 'CY',

  // Europe
  '44': 'GB',
  '353': 'IE',
  '33': 'FR',
  '49': 'DE',
  '39': 'IT',
  '34': 'ES',
  '351': 'PT',
  '31': 'NL',
  '32': 'BE',
  '352': 'LU',
  '41': 'CH',
  '43': 'AT',
  '45': 'DK',
  '46': 'SE',
  '47': 'NO',
  '358': 'FI',
  '354': 'IS',
  '48': 'PL',
  '420': 'CZ',
  '421': 'SK',
  '36': 'HU',
  '40': 'RO',
  '359': 'BG',
  '30': 'GR',
  '373': 'MD',
  '372': 'EE',
  '371': 'LV',
  '370': 'LT',
  '385': 'HR',
  '386': 'SI',
  '381': 'RS',
  '382': 'ME',
  '387': 'BA',
  '355': 'AL',
  '389': 'MK',
  '377': 'MC',
  '423': 'LI',
  '376': 'AD',
  '378': 'SM',
  '379': 'VA',
  '356': 'MT',

  // North America
  '1': 'US',
  '52': 'MX',
  '501': 'BZ',
  '506': 'CR',
  '503': 'SV',
  '502': 'GT',
  '504': 'HN',
  '505': 'NI',
  '507': 'PA',
  '53': 'CU',
  '1809': 'DO',
  '1829': 'DO',
  '1849': 'DO',
  '1876': 'JM',
  '1868': 'TT',
  '1242': 'BS',
  '1246': 'BB',
  '1441': 'BM',
  '1787': 'PR',
  '1939': 'PR',

  // South America
  '55': 'BR',
  '54': 'AR',
  '56': 'CL',
  '57': 'CO',
  '51': 'PE',
  '58': 'VE',
  '593': 'EC',
  '591': 'BO',
  '595': 'PY',
  '598': 'UY',
  '592': 'GY',
  '597': 'SR',

  // Africa
  '27': 'ZA',
  '234': 'NG',
  '254': 'KE',
  '256': 'UG',
  '255': 'TZ',
  '250': 'RW',
  '257': 'BI',
  '251': 'ET',
  '291': 'ER',
  '253': 'DJ',
  '252': 'SO',
  '249': 'SD',
  '211': 'SS',
  '20': 'EG',
  '218': 'LY',
  '216': 'TN',
  '213': 'DZ',
  '212': 'MA',
  '222': 'MR',
  '223': 'ML',
  '227': 'NE',
  '235': 'TD',
  '221': 'SN',
  '220': 'GM',
  '233': 'GH',
  '225': 'CI',
  '231': 'LR',
  '232': 'SL',
  '224': 'GN',
  '245': 'GW',
  '226': 'BF',
  '228': 'TG',
  '229': 'BJ',
  '237': 'CM',
  '236': 'CF',
  '240': 'GQ',
  '241': 'GA',
  '242': 'CG',
  '243': 'CD',
  '244': 'AO',
  '260': 'ZM',
  '263': 'ZW',
  '267': 'BW',
  '264': 'NA',
  '266': 'LS',
  '268': 'SZ',
  '261': 'MG',
  '230': 'MU',
  '248': 'SC',
  '269': 'KM',
  '258': 'MZ',
  '265': 'MW',
  '238': 'CV',
  '239': 'ST',

  // Oceania
  '61': 'AU',
  '64': 'NZ',
  '679': 'FJ',
  '675': 'PG',
  '685': 'WS',
  '676': 'TO',
  '678': 'VU',
  '677': 'SB',
  '686': 'KI',
  '688': 'TV',
  '674': 'NR',
  '680': 'PW',
  '692': 'MH',
  '691': 'FM',
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
