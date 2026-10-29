/**
 * Standard client address structure required by the migration API.
 */
export interface ClientAddress {
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
}

/**
 * Interface representing address components extracted from Zoho Books Invoice billing_address.
 */
export interface InvoiceBillingAddressInput {
  street?: string | null;
  address?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  zip?: string | null;
  country?: string | null;
}

/**
 * Interface representing fallback address fields from Leads or Contacts records.
 */
export interface RecordAddressInput {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

/**
 * Sanitizes and trims an individual string field.
 * Returns null if the value is empty, null, or undefined.
 *
 * @param val - Raw string input
 * @returns {string | null} Trimmed non-empty string or null
 */
export function sanitizeAddressField(val?: string | null): string | null {
  if (!val || typeof val !== 'string') {
    return null;
  }
  const trimmed = val.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return null;
  }
  return trimmed;
}

/**
 * Intelligently combines street, address, and street2 components without introducing duplicate fragments.
 * - Handles cases where address is identical to street or already includes street2.
 * - Normalizes whitespace and returns combined string or null.
 *
 * @param street - Primary street field
 * @param address - General address field (often used as fallback or parent line)
 * @param street2 - Secondary street / suite / apartment line
 * @returns {string | null} Combined street line or null
 */
export function combineStreetParts(
  street?: string | null,
  address?: string | null,
  street2?: string | null,
): string | null {
  const s = sanitizeAddressField(street);
  const a = sanitizeAddressField(address);
  const s2 = sanitizeAddressField(street2);

  const parts: string[] = [];

  if (s) {
    parts.push(s);
    if (s2 && !s.toLowerCase().includes(s2.toLowerCase())) {
      parts.push(s2);
    }
    if (
      a &&
      !s.toLowerCase().includes(a.toLowerCase()) &&
      !a.toLowerCase().includes(s.toLowerCase())
    ) {
      parts.push(a);
    }
  } else if (a) {
    parts.push(a);
    if (s2 && !a.toLowerCase().includes(s2.toLowerCase())) {
      parts.push(s2);
    }
  } else if (s2) {
    parts.push(s2);
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join(', ');
}

/**
 * Calculates a completeness score (0 to 5) for an invoice billing address.
 * Counts non-empty components among street/address, city, state, country, zipCode.
 *
 * @param billing - Invoice billing address input
 * @returns {number} Completeness score
 */
export function scoreAddressCompleteness(billing?: InvoiceBillingAddressInput | null): number {
  if (!billing) {
    return 0;
  }
  let score = 0;
  if (billing.street?.trim() || billing.address?.trim() || billing.street2?.trim()) {
    score += 1;
  }
  if (billing.city?.trim()) {
    score += 1;
  }
  if (billing.state?.trim()) {
    score += 1;
  }
  if (billing.country?.trim()) {
    score += 1;
  }
  if (billing.zipcode?.trim() || billing.zip?.trim()) {
    score += 1;
  }
  return score;
}

/**
 * Selects the most appropriate invoice from an array of matching invoices:
 * 1. Filters to invoices that have at least one usable address field.
 * 2. Ranks by address completeness (more address fields is preferred).
 * 3. Breaks ties using invoice recency (`date` descending, newest first).
 *
 * @param invoices - List of candidate invoices
 * @returns {T | null} Best invoice or null if none have usable address data
 */
export function selectBestInvoice<
  T extends { date?: Date | string; billing_address?: InvoiceBillingAddressInput },
>(invoices: T[]): T | null {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  const validInvoices = invoices.filter(inv => scoreAddressCompleteness(inv.billing_address) > 0);
  if (validInvoices.length === 0) {
    return null;
  }

  const sorted = [...validInvoices].sort((a, b) => {
    const scoreA = scoreAddressCompleteness(a.billing_address);
    const scoreB = scoreAddressCompleteness(b.billing_address);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return sorted[0] ?? null;
}

/**
 * Resolves address according to Zoho migration priority rules:
 * - Priority 1: Zoho Books Invoice billing address (if usable fields exist).
 * - Priority 2: Lead or Contact record address fields.
 * - Always returns exactly the 5 defined properties with null for missing values.
 *
 * @param invoiceAddress - Address from selected Zoho Books invoice (if any)
 * @param fallbackAddress - Address from Lead or Contact record
 * @returns {ClientAddress} Standardized client address object
 */
export function normalizeAddress(
  invoiceAddress?: InvoiceBillingAddressInput | null,
  fallbackAddress?: RecordAddressInput | null,
): ClientAddress {
  let hasInvoiceData = false;
  let invStreet: string | null = null;
  let invCity: string | null = null;
  let invState: string | null = null;
  let invCountry: string | null = null;
  let invZip: string | null = null;

  if (invoiceAddress) {
    invStreet = combineStreetParts(
      invoiceAddress.street,
      invoiceAddress.address,
      invoiceAddress.street2,
    );
    invCity = sanitizeAddressField(invoiceAddress.city);
    invState = sanitizeAddressField(invoiceAddress.state);
    invCountry = sanitizeAddressField(invoiceAddress.country);
    invZip =
      sanitizeAddressField(invoiceAddress.zipcode) ?? sanitizeAddressField(invoiceAddress.zip);

    if (invStreet || invCity || invState || invCountry || invZip) {
      hasInvoiceData = true;
    }
  }

  if (hasInvoiceData) {
    return {
      street: invStreet,
      city: invCity,
      state: invState,
      country: invCountry,
      zipCode: invZip,
    };
  }

  return {
    street: sanitizeAddressField(fallbackAddress?.street),
    city: sanitizeAddressField(fallbackAddress?.city),
    state: sanitizeAddressField(fallbackAddress?.state),
    country: sanitizeAddressField(fallbackAddress?.country),
    zipCode: sanitizeAddressField(fallbackAddress?.zipCode),
  };
}
