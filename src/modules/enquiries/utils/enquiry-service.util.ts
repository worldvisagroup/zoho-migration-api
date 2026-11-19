export type InterestedService =
  | 'work_permit'
  | 'dependent_spouse'
  | 'intra_office'
  | 'visit_visa'
  | 'investor_migration'
  | 'university_admission'
  | 'college_admission'
  | 'student_visa'
  | 'permanent_residency'
  | 'job_seeker_visa'
  | 'australia_parent_visa'
  | 'australia_child_visa'
  | 'parent_visa_rrv'
  | 'germany_opportunity_card'
  | 'parent_visa_australia_sc804'
  | 'national_innovation_visa'
  | 'australia_pr_stage_2'
  | 'australia_partner_visa'
  | 'australia_rrv'
  | 'temporary_dependent_visa'
  | 'sc_403_visa_application'
  | 'australian_student_visa'
  | 'partner_of_student_work_visa'
  | 'super_visa'
  | 'germany_family_reunion_visa'
  | 'australia_work_holiday_visa'
  | 'business_visitor_visa'
  | 'uk_global_talent_visa'
  | 'skill_assessment';

const KNOWN_SERVICES_SET = new Set<string>([
  'work_permit',
  'dependent_spouse',
  'intra_office',
  'visit_visa',
  'investor_migration',
  'university_admission',
  'college_admission',
  'student_visa',
  'permanent_residency',
  'job_seeker_visa',
  'australia_parent_visa',
  'australia_child_visa',
  'parent_visa_rrv',
  'germany_opportunity_card',
  'parent_visa_australia_sc804',
  'national_innovation_visa',
  'australia_pr_stage_2',
  'australia_partner_visa',
  'australia_rrv',
  'temporary_dependent_visa',
  'sc_403_visa_application',
  'australian_student_visa',
  'partner_of_student_work_visa',
  'super_visa',
  'germany_family_reunion_visa',
  'australia_work_holiday_visa',
  'business_visitor_visa',
  'uk_global_talent_visa',
  'skill_assessment',
]);

const RAW_SERVICE_MAPPING: Record<string, InterestedService> = {
  // Permanent Residency
  'permanent residency': 'permanent_residency',
  immigrate: 'permanent_residency',
  'canada pr': 'permanent_residency',
  'australia pr': 'permanent_residency',

  // Work Permit
  'work permit': 'work_permit',
  work: 'work_permit',

  // Visit Visa
  'visit visa': 'visit_visa',
  travel: 'visit_visa',
  'visitor visa': 'visit_visa',

  // Job Seeker Visa
  'job seeker visa': 'job_seeker_visa',
  'job seeker': 'job_seeker_visa',

  // Germany Opportunity Card
  'germany opportunity card': 'germany_opportunity_card',

  // National Innovation Visa
  'national innovation visa': 'national_innovation_visa',
  'national innovation visa (niv)': 'national_innovation_visa',
  'australia gti': 'national_innovation_visa',

  // Business Visa
  'business visitor visa': 'business_visitor_visa',
  'business visa': 'business_visitor_visa',

  // Partner / Spouse Visa
  'partner visa': 'australia_partner_visa',
  'australia partner visa': 'australia_partner_visa',
  'spouse visa': 'dependent_spouse',
  'dependent spouse': 'dependent_spouse',

  // Student Visa
  'student visa': 'student_visa',
  'student / exchange visa': 'student_visa',
  study: 'student_visa',
  'study abroad': 'student_visa',
  'australian student visa': 'australian_student_visa',

  // Parent Visa
  'australia parent visa': 'australia_parent_visa',
  'parent visa': 'australia_parent_visa',
  'parent visa (aged 804)': 'parent_visa_australia_sc804',
  'parent visa australia sc804': 'parent_visa_australia_sc804',
  'parent visa rrv': 'parent_visa_rrv',
  'parent visa (rrv)': 'parent_visa_rrv',

  // Child Visa
  'australia child visa': 'australia_child_visa',
  'child visa': 'australia_child_visa',

  // Resident Return Visa
  'australia rrv': 'australia_rrv',
  'residential return visa': 'australia_rrv',
  'resident return visa': 'australia_rrv',

  // Work & Holiday
  'australia work in holiday visa': 'australia_work_holiday_visa',
  'australia work & holiday visa': 'australia_work_holiday_visa',
  'australia work holiday visa': 'australia_work_holiday_visa',

  // EOI & Stage 2
  'eoi & visa stage 2': 'australia_pr_stage_2',
  'australia pr stage 2': 'australia_pr_stage_2',

  // Intra-office Transfer
  'intra-office transfer': 'intra_office',
  'intra office': 'intra_office',

  // Partner of Student Work Visa
  'partner of student work visa': 'partner_of_student_work_visa',

  // SC 403
  'sc 403 visa application': 'sc_403_visa_application',

  // Skill Assessment
  'skill assessment': 'skill_assessment',
  'skill assessment stage': 'skill_assessment',

  // Temporary Dependent Visa
  'temporary dependent visa': 'temporary_dependent_visa',

  // UK Global Talent Visa
  'uk global talent visa': 'uk_global_talent_visa',

  // University & College Admissions
  'university admission': 'university_admission',
  'college admission': 'college_admission',

  // Super Visa & Germany Family Reunion
  'super visa': 'super_visa',
  'germany family reunion visa': 'germany_family_reunion_visa',

  // Investor Migration
  'investor migration': 'investor_migration',
};

/**
 * Normalizes any Zoho or unified candidate service string into one of the 29 supported enums.
 * Returns null if the value is missing, unrecognized, or cannot be mapped.
 *
 * @param candidate - Raw service candidate string
 * @returns {InterestedService | null} Standardized enum or null
 */
export function normalizeInterestedService(candidate?: string | null): InterestedService | null {
  if (!candidate || typeof candidate !== 'string') {
    return null;
  }

  const trimmed = candidate.trim();
  const lower = trimmed.toLowerCase();

  if (
    !lower ||
    lower === 'null' ||
    lower === 'undefined' ||
    lower === 'others' ||
    lower === '-none-'
  ) {
    return null;
  }

  // 1. Direct match with snake_case enums (e.g. from unified_entries)
  if (KNOWN_SERVICES_SET.has(lower)) {
    return lower as InterestedService;
  }

  // 2. Lookup in dictionary
  if (RAW_SERVICE_MAPPING[lower]) {
    return RAW_SERVICE_MAPPING[lower];
  }

  return null;
}

/**
 * Resolves the interested service across candidates following the prioritized cascade:
 * For Leads:
 * 1. Service_Required1
 * 2. Visa application service / stage
 * 3. unified_entries.interestedService
 *
 * For Contacts:
 * 1. Service_Finalized
 * 2. Service_Required
 * 3. Visa application service / stage
 * 4. unified_entries.interestedService
 *
 * @param candidates - Ordered list of candidate strings
 * @returns {InterestedService | null} First successfully resolved enum or null
 */
export function resolveInterestedServiceCascade(
  ...candidates: (string | null | undefined)[]
): InterestedService | null {
  for (const candidate of candidates) {
    const resolved = normalizeInterestedService(candidate);
    if (resolved) {
      return resolved;
    }
  }
  return null;
}
