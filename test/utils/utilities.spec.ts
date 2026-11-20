import { describe, expect, it } from 'vitest';
import {
  combineStreetParts,
  extractCountryCodeInfo,
  extractNames,
  normalizeAddress,
  normalizeDob,
  normalizeEmail,
  normalizeMaritalStatus,
  normalizePhoneNumber,
  normalizeZohoTimestamp,
  scoreAddressCompleteness,
  selectBestInvoice,
} from '../../src/common/utils/index.js';

describe('Reusable Migration Utilities', () => {
  describe('Name Extraction (extractNames)', () => {
    it('should use First_Name and Last_Name directly when available', () => {
      const res = extractNames('Jane', 'Doe', 'Ignored Full Name');
      expect(res).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    });

    it('should extract first and last name from Full_Name when missing', () => {
      const res = extractNames('', '', 'Jane Marie Doe');
      expect(res).toEqual({ firstName: 'Jane Marie', lastName: 'Doe' });
    });

    it('should handle single-word Full_Name gracefully', () => {
      const res = extractNames('', '', 'Madonna');
      expect(res).toEqual({ firstName: '', lastName: 'Madonna' });
    });

    it('should extract missing Last_Name from Full_Name when First_Name is given', () => {
      const res = extractNames('Jane', '', 'Jane Doe');
      expect(res).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    });

    it('should extract missing First_Name from Full_Name when Last_Name is given', () => {
      const res = extractNames('', 'Doe', 'Jane Doe');
      expect(res).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    });

    it('should capitalize lowercase or ALL CAPS names properly', () => {
      const res1 = extractNames('jane', 'doe', null);
      expect(res1).toEqual({ firstName: 'Jane', lastName: 'Doe' });

      const res2 = extractNames('JANE', 'DOE', null);
      expect(res2).toEqual({ firstName: 'Jane', lastName: 'Doe' });

      const res3 = extractNames('', '', "john mark-anthony o'connor");
      expect(res3).toEqual({ firstName: 'John Mark-Anthony', lastName: "O'Connor" });
    });

    it('should handle null / undefined / empty safely', () => {
      const res = extractNames(null, undefined, '');
      expect(res).toEqual({ firstName: '', lastName: '' });
    });
  });

  describe('Email Normalization (normalizeEmail)', () => {
    it('should normalize valid primary email to lowercase and trim spaces', () => {
      const res = normalizeEmail('  Jane.Doe@Example.COM  ', 'secondary@example.com');
      expect(res).toBe('jane.doe@example.com');
    });

    it('should remove internal whitespace', () => {
      const res = normalizeEmail('jane . doe @ example . com');
      expect(res).toBe('jane.doe@example.com');
    });

    it('should fallback to secondary email when primary is missing or invalid', () => {
      const res = normalizeEmail('', 'Secondary@example.com');
      expect(res).toBe('secondary@example.com');
    });

    it('should fallback to null when both are missing', () => {
      const res = normalizeEmail(null, undefined);
      expect(res).toBeNull();
    });
  });

  describe('Phone Normalization (normalizePhoneNumber)', () => {
    it('should normalize Indian phone with +91 prefix and spaces', () => {
      const res = normalizePhoneNumber('+91 9611597691', null, '+91 - India');
      expect(res).toBe('+919611597691');
    });

    it('should normalize 10-digit Indian phone with Country_Code', () => {
      const res = normalizePhoneNumber('9060443444', null, '+91 - India');
      expect(res).toBe('+919060443444');
    });

    it('should normalize international number with + and no Country_Code', () => {
      const res = normalizePhoneNumber('+256759843653', null, null);
      expect(res).toBe('+256759843653');
    });

    it('should normalize formatted international number with spaces', () => {
      const res = normalizePhoneNumber('+234 8023888449', null, null);
      expect(res).toBe('+2348023888449');
    });

    it('should avoid duplicating calling code when phone already includes it without plus', () => {
      const res = normalizePhoneNumber('919718322718', null, '+91');
      expect(res).toBe('+919718322718');
    });

    it('should fallback to Mobile if Phone is missing', () => {
      const res = normalizePhoneNumber(null, '9060443444', 'IN - India');
      expect(res).toBe('+919060443444');
    });

    it('should fallback to null if neither is usable', () => {
      const res = normalizePhoneNumber('', null, null);
      expect(res).toBeNull();
    });

    it('should extract country info correctly from various Country_Code formats', () => {
      expect(extractCountryCodeInfo('+91 - India')).toEqual({ isoCode: 'IN', callingCode: '91' });
      expect(extractCountryCodeInfo('IN - India')).toEqual({ isoCode: 'IN', callingCode: '91' });
      expect(extractCountryCodeInfo('+1 - USA')).toEqual({ isoCode: 'US', callingCode: '1' });
      expect(extractCountryCodeInfo('91')).toEqual({ isoCode: 'IN', callingCode: '91' });
    });
  });

  describe('Date & DOB Normalization (normalizeDob & normalizeZohoTimestamp)', () => {
    it('should format Date object to UTC ISO 8601', () => {
      const d = new Date('1990-04-02T10:00:00Z');
      expect(normalizeDob(d)).toBe('1990-04-02T10:00:00.000Z');
    });

    it('should convert date-only string YYYY-MM-DD to exact UTC midnight preserving calendar date', () => {
      const res = normalizeDob('1990-04-02');
      expect(res).toBe('1990-04-02T00:00:00.000Z');
    });

    it('should return null for invalid or missing DOB', () => {
      expect(normalizeDob(null)).toBeNull();
      expect(normalizeDob('')).toBeNull();
      expect(normalizeDob('invalid-date')).toBeNull();
    });

    it('should normalize Zoho timestamps correctly', () => {
      const res = normalizeZohoTimestamp('2023-02-01T10:00:00Z');
      expect(res).toBe('2023-02-01T10:00:00.000Z');
    });

    it('should fallback to fallback timestamp if primary is missing', () => {
      const res = normalizeZohoTimestamp(null, '2023-02-01T10:00:00Z');
      expect(res).toBe('2023-02-01T10:00:00.000Z');
    });
  });

  describe('Marital Status Normalization (normalizeMaritalStatus)', () => {
    it('should map Married to married', () => {
      expect(normalizeMaritalStatus('Married')).toBe('married');
      expect(normalizeMaritalStatus('married')).toBe('married');
    });

    it('should map Un-married to single', () => {
      expect(normalizeMaritalStatus('Un-married')).toBe('single');
      expect(normalizeMaritalStatus('Single')).toBe('single');
    });

    it('should map Divorced / Separated to divorced', () => {
      expect(normalizeMaritalStatus('Divorced / Separated')).toBe('divorced');
      expect(normalizeMaritalStatus('Separated')).toBe('divorced');
    });

    it('should map Widowed to widowed', () => {
      expect(normalizeMaritalStatus('Widowed')).toBe('widowed');
    });

    it('should return null for unrecognized values or missing input', () => {
      expect(normalizeMaritalStatus(null)).toBeNull();
      expect(normalizeMaritalStatus('')).toBeNull();
      expect(normalizeMaritalStatus('Unknown Status')).toBeNull();
    });
  });

  describe('Address Normalization (normalizeAddress & selectBestInvoice)', () => {
    it('should combine street parts without duplicate content', () => {
      expect(combineStreetParts('123 Main St', null, 'Suite 100')).toBe('123 Main St, Suite 100');
      expect(combineStreetParts('123 Main St', '123 Main St', null)).toBe('123 Main St');
      expect(combineStreetParts(null, '456 Oak Ave', null)).toBe('456 Oak Ave');
    });

    it('should score address completeness accurately', () => {
      expect(scoreAddressCompleteness(null)).toBe(0);
      expect(
        scoreAddressCompleteness({
          street: '123 Main St',
          city: 'Pune',
          state: 'MH',
          country: 'India',
          zipcode: '411001',
        }),
      ).toBe(5);
    });

    it('should select best invoice by completeness and recency', () => {
      const invoices = [
        {
          date: new Date('2023-01-01'),
          billing_address: { city: 'Pune' },
        },
        {
          date: new Date('2023-05-01'),
          billing_address: {
            street: '123 Main',
            city: 'Pune',
            state: 'MH',
            country: 'India',
            zipcode: '411001',
          },
        },
      ];

      const best = selectBestInvoice(invoices);
      expect(best?.billing_address?.street).toBe('123 Main');
    });

    it('should prefer invoice address over record fallback when available', () => {
      const invoiceAddress = {
        street: 'Suite 200',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipcode: '400001',
      };
      const recordFallback = {
        street: 'Old St',
        city: 'Pune',
        state: 'MH',
        country: 'India',
        zipCode: '411001',
      };

      const res = normalizeAddress(invoiceAddress, recordFallback);
      expect(res).toEqual({
        street: 'Suite 200',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '400001',
      });
    });

    it('should fallback to record address when invoice address has no usable data', () => {
      const recordFallback = {
        street: 'Fallback St',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '411001',
      };

      const res = normalizeAddress(null, recordFallback);
      expect(res).toEqual({
        street: 'Fallback St',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '411001',
      });
    });

    it('should always return 5 defined properties with null for empty fields', () => {
      const res = normalizeAddress(null, null);
      expect(res).toEqual({
        street: null,
        city: null,
        state: null,
        country: null,
        zipCode: null,
      });
    });
  });
});
