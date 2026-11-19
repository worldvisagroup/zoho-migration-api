export type EnquirySource =
  | 'google_ads'
  | 'meta_ads'
  | 'website'
  | 'blog'
  | 'pr_assessment'
  | 'referral'
  | 'walk_in'
  | 'ivr'
  | 'whatsapp';

const DEFAULT_SOURCE: EnquirySource = 'website';

const RAW_SOURCE_MAPPING: Record<string, EnquirySource> = {
  // Meta Ads
  'facebook ads': 'meta_ads',
  facebook: 'meta_ads',
  'facebook  ads': 'meta_ads',
  'facebook ads old': 'meta_ads',
  instagram: 'meta_ads',
  'meta ads': 'meta_ads',
  'job seeker visa - facebook': 'meta_ads',

  // Google Ads
  'google ads': 'google_ads',
  google: 'google_ads',
  'google adwords': 'google_ads',
  'old google ads': 'google_ads',
  'campaigns (fb/google adwords)': 'google_ads',
  'digital campaigns': 'google_ads',
  advertisement: 'google_ads',

  // WhatsApp
  'whatsapp - world visa': 'whatsapp',
  wati: 'whatsapp',

  // IVR
  'ivr - google': 'ivr',
  'ivr facebook': 'ivr',
  'ivr- website': 'ivr',

  // PR Assessment
  'australia assessment report': 'pr_assessment',
  'canada assessment report': 'pr_assessment',
  'germany assessment report': 'pr_assessment',
  'austria assessment report': 'pr_assessment',
  'sweden assessment report': 'pr_assessment',
  'portugal assessment report': 'pr_assessment',
  'uae assessment report': 'pr_assessment',
  'technical assessment report': 'pr_assessment',
  'website australia spot assesment': 'pr_assessment',
  'website canada spot assessment form': 'pr_assessment',
  assessment_report_canada: 'pr_assessment',

  // Referral
  'referral client': 'referral',
  referal: 'referral',
  'employee referral': 'referral',
  'employee referrals': 'referral',
  'external referral': 'referral',
  partner: 'referral',

  // Walk-in
  'walk-in client': 'walk_in',
  'walk-in': 'walk_in',
  'walk -in': 'walk_in',
  'signage / board': 'walk_in',

  // Blog
  blog: 'blog',
  'blog-form': 'blog',

  // Website & Online forms
  website: 'website',
  'website visit': 'website',
  'visa page form': 'website',
  'job page form': 'website',
  'website pricing page': 'website',
  chat: 'website',
  'online chat': 'website',
  'zoho bookings': 'website',
  'mates visa': 'website',
  'job seeker visa': 'website',
  aus_seminar_aug: 'website',
  'contacts created': 'website',
  'manually created': 'website',
  email: 'website',
  'email campaign': 'website',
  linkedin: 'website',
  mara: 'website',
  'cold call': 'website',
  'any other': 'website',
  'old client': 'website',
  'old client / old data': 'website',
};

/**
 * Normalizes raw Zoho Lead_Source value into one of 9 standardized EnquirySource enums.
 * If missing, invalid, or unmapped, defaults to 'website'.
 *
 * @param candidate - Raw Zoho Lead_Source string
 * @returns {EnquirySource} Standardized source enum
 */
export function normalizeEnquirySource(candidate?: string | null): EnquirySource {
  if (!candidate || typeof candidate !== 'string') {
    return DEFAULT_SOURCE;
  }

  const cleaned = candidate.trim().toLowerCase();
  if (!cleaned || cleaned === 'null' || cleaned === 'undefined') {
    return DEFAULT_SOURCE;
  }

  if (RAW_SOURCE_MAPPING[cleaned]) {
    return RAW_SOURCE_MAPPING[cleaned];
  }

  // Check substring heuristics
  if (cleaned.includes('facebook') || cleaned.includes('meta')) {
    return 'meta_ads';
  }
  if (cleaned.includes('google') || cleaned.includes('adwords')) {
    return 'google_ads';
  }
  if (cleaned.includes('whatsapp') || cleaned.includes('wati')) {
    return 'whatsapp';
  }
  if (cleaned.includes('ivr')) {
    return 'ivr';
  }
  if (cleaned.includes('assessment report') || cleaned.includes('spot assesment')) {
    return 'pr_assessment';
  }
  if (cleaned.includes('referral') || cleaned.includes('referal')) {
    return 'referral';
  }
  if (cleaned.includes('walk-in') || cleaned.includes('walk -in')) {
    return 'walk_in';
  }
  if (cleaned.includes('blog')) {
    return 'blog';
  }

  return DEFAULT_SOURCE;
}

