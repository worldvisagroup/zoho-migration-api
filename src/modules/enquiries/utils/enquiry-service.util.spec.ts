import { describe, expect, it } from 'vitest';
import {
  normalizeInterestedService,
  resolveInterestedServiceCascade,
} from './enquiry-service.util.js';

describe('enquiry-service.util', () => {
  describe('normalizeInterestedService', () => {
    it('should normalize direct snake_case values from unified entries', () => {
      expect(normalizeInterestedService('permanent_residency')).toBe('permanent_residency');
      expect(normalizeInterestedService('germany_opportunity_card')).toBe(
        'germany_opportunity_card',
      );
      expect(normalizeInterestedService('national_innovation_visa')).toBe(
        'national_innovation_visa',
      );
    });

    it('should map natural Zoho strings into corresponding enums', () => {
      expect(normalizeInterestedService('Permanent Residency')).toBe('permanent_residency');
      expect(normalizeInterestedService('Immigrate')).toBe('permanent_residency');
      expect(normalizeInterestedService('Work Permit')).toBe('work_permit');
      expect(normalizeInterestedService('Visit Visa')).toBe('visit_visa');
      expect(normalizeInterestedService('Job Seeker Visa')).toBe('job_seeker_visa');
      expect(normalizeInterestedService('National Innovation Visa (NIV)')).toBe(
        'national_innovation_visa',
      );
      expect(normalizeInterestedService('Australia GTI')).toBe('national_innovation_visa');
      expect(normalizeInterestedService('Australia Partner Visa')).toBe('australia_partner_visa');
      expect(normalizeInterestedService('Spouse Visa')).toBe('dependent_spouse');
      expect(normalizeInterestedService('Residential Return Visa')).toBe('australia_rrv');
      expect(normalizeInterestedService('Australia RRV')).toBe('australia_rrv');
      expect(normalizeInterestedService('Australia Work in Holiday Visa')).toBe(
        'australia_work_holiday_visa',
      );
      expect(normalizeInterestedService('EOI & Visa Stage 2')).toBe('australia_pr_stage_2');
      expect(normalizeInterestedService('Intra-office Transfer')).toBe('intra_office');
      expect(normalizeInterestedService('SC 403 Visa Application')).toBe('sc_403_visa_application');
      expect(normalizeInterestedService('Skill Assessment Stage')).toBe('skill_assessment');
      expect(normalizeInterestedService('UK Global Talent visa')).toBe('uk_global_talent_visa');
    });

    it('should return null for invalid, unrecognized, or Others values', () => {
      expect(normalizeInterestedService(null)).toBeNull();
      expect(normalizeInterestedService(undefined)).toBeNull();
      expect(normalizeInterestedService('')).toBeNull();
      expect(normalizeInterestedService('Others')).toBeNull();
      expect(normalizeInterestedService('Visitor Visa Rejection')).toBeNull();
      expect(normalizeInterestedService('Unrecognized Service 123')).toBeNull();
    });
  });

  describe('resolveInterestedServiceCascade', () => {
    it('should return the first candidate that resolves to a valid service', () => {
      const result = resolveInterestedServiceCascade(
        'Others',
        null,
        'Permanent Residency',
        'work_permit',
      );
      expect(result).toBe('permanent_residency');
    });

    it('should return null when all candidates fail', () => {
      const result = resolveInterestedServiceCascade('Others', '-None-', null, '');
      expect(result).toBeNull();
    });
  });
});
