import { describe, expect, it } from 'vitest';
import { normalizeEnquirySource } from './enquiry-source.util.js';

describe('enquiry-source.util', () => {
  it('should map Meta Ads variants', () => {
    expect(normalizeEnquirySource('Facebook Ads')).toBe('meta_ads');
    expect(normalizeEnquirySource('Facebook  Ads')).toBe('meta_ads');
    expect(normalizeEnquirySource('Facebook')).toBe('meta_ads');
    expect(normalizeEnquirySource('Instagram')).toBe('meta_ads');
    expect(normalizeEnquirySource('Meta Ads')).toBe('meta_ads');
  });

  it('should map Google Ads variants', () => {
    expect(normalizeEnquirySource('Google Ads')).toBe('google_ads');
    expect(normalizeEnquirySource('Google AdWords')).toBe('google_ads');
    expect(normalizeEnquirySource('Campaigns (FB/Google AdWords)')).toBe('google_ads');
    expect(normalizeEnquirySource('Old Google Ads')).toBe('google_ads');
  });

  it('should map WhatsApp and WATI', () => {
    expect(normalizeEnquirySource('WhatsApp - World Visa')).toBe('whatsapp');
    expect(normalizeEnquirySource('WATI')).toBe('whatsapp');
  });

  it('should map IVR sources', () => {
    expect(normalizeEnquirySource('IVR - Google')).toBe('ivr');
    expect(normalizeEnquirySource('IVR Facebook')).toBe('ivr');
    expect(normalizeEnquirySource('IVR- Website')).toBe('ivr');
  });

  it('should map PR assessment reports', () => {
    expect(normalizeEnquirySource('Australia Assessment Report')).toBe('pr_assessment');
    expect(normalizeEnquirySource('Canada Assessment Report')).toBe('pr_assessment');
    expect(normalizeEnquirySource('Website Australia Spot Assesment')).toBe('pr_assessment');
  });

  it('should map referrals', () => {
    expect(normalizeEnquirySource('Referral Client')).toBe('referral');
    expect(normalizeEnquirySource('Referal')).toBe('referral');
    expect(normalizeEnquirySource('Employee Referral')).toBe('referral');
  });

  it('should map walk-in clients', () => {
    expect(normalizeEnquirySource('Walk-in client')).toBe('walk_in');
    expect(normalizeEnquirySource('Walk -in')).toBe('walk_in');
    expect(normalizeEnquirySource('Signage / Board')).toBe('walk_in');
  });

  it('should map blog', () => {
    expect(normalizeEnquirySource('Blog')).toBe('blog');
    expect(normalizeEnquirySource('blog-form')).toBe('blog');
  });

  it('should default to website for online forms, personal names, null, or unmapped values', () => {
    expect(normalizeEnquirySource('Website')).toBe('website');
    expect(normalizeEnquirySource('WebSite Visit')).toBe('website');
    expect(normalizeEnquirySource('Chat')).toBe('website');
    expect(normalizeEnquirySource('Zoho Bookings')).toBe('website');
    expect(normalizeEnquirySource('Princy')).toBe('website');
    expect(normalizeEnquirySource('Aastha Joshi')).toBe('website');
    expect(normalizeEnquirySource(null)).toBe('website');
    expect(normalizeEnquirySource(undefined)).toBe('website');
    expect(normalizeEnquirySource('')).toBe('website');
    expect(normalizeEnquirySource('Some Unknown Source')).toBe('website');
  });
});

