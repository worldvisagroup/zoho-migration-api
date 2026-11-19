import { describe, expect, it } from 'vitest';
import {
  resolveContactDestinationCountry,
  resolveLeadDestinationCountry,
  sanitizeCountry,
} from './destination-country.util.js';

describe('destination-country.util', () => {
  describe('sanitizeCountry', () => {
    it('should return trimmed country for valid strings', () => {
      expect(sanitizeCountry('  Australia  ')).toBe('Australia');
      expect(sanitizeCountry('Canada')).toBe('Canada');
    });

    it('should return null for empty, whitespace, null, undefined, or -None-', () => {
      expect(sanitizeCountry(null)).toBeNull();
      expect(sanitizeCountry(undefined)).toBeNull();
      expect(sanitizeCountry('')).toBeNull();
      expect(sanitizeCountry('   ')).toBeNull();
      expect(sanitizeCountry('null')).toBeNull();
      expect(sanitizeCountry('NULL')).toBeNull();
      expect(sanitizeCountry('-None-')).toBeNull();
      expect(sanitizeCountry('-none-')).toBeNull();
    });
  });

  describe('resolveLeadDestinationCountry', () => {
    it('should prioritize country_addressed when populated', () => {
      const result = resolveLeadDestinationCountry(
        'Germany',
        ['Australia', 'Canada'],
        'Canada',
        'UK',
      );
      expect(result).toBe('Germany');
    });

    it('should fall back to intended_country[0] when country_addressed is null', () => {
      const result = resolveLeadDestinationCountry(null, ['Australia', 'Canada'], 'Canada', 'UK');
      expect(result).toBe('Australia');
    });

    it('should ignore intended_country if array contains only null or -None-', () => {
      const result = resolveLeadDestinationCountry('   ', ['null'], 'Canada', 'UK');
      expect(result).toBe('Canada');
    });

    it('should fall back to visaAppCountry when country_addressed and intended_country are absent', () => {
      const result = resolveLeadDestinationCountry(null, [], 'Canada', 'UK');
      expect(result).toBe('Canada');
    });

    it('should fall back to unifiedCountry when other sources are absent', () => {
      const result = resolveLeadDestinationCountry(null, null, null, 'Australia');
      expect(result).toBe('Australia');
    });

    it('should return null when all sources are missing or invalid', () => {
      const result = resolveLeadDestinationCountry(null, ['-None-'], null, 'null');
      expect(result).toBeNull();
    });
  });

  describe('resolveContactDestinationCountry', () => {
    it('should prioritize country_finalised when populated', () => {
      const result = resolveContactDestinationCountry('Australia', 'Canada', 'UK', 'USA');
      expect(result).toBe('Australia');
    });

    it('should fall back to Country_Qualified_for when country_finalised is null', () => {
      const result = resolveContactDestinationCountry(null, 'Canada', 'UK', 'USA');
      expect(result).toBe('Canada');
    });

    it('should fall back to visaAppCountry when direct contact fields are absent', () => {
      const result = resolveContactDestinationCountry('null', '  ', 'UK', 'USA');
      expect(result).toBe('UK');
    });

    it('should fall back to unifiedCountry when all higher sources are absent', () => {
      const result = resolveContactDestinationCountry(null, null, null, 'USA');
      expect(result).toBe('USA');
    });

    it('should return null when all sources are missing', () => {
      const result = resolveContactDestinationCountry(null, null, null, null);
      expect(result).toBeNull();
    });
  });
});
