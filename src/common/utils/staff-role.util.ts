/**
 * Allowed staff roles supported by the Staff Migration API.
 */
export type StaffRole =
  | 'director'
  | 'branch_manager'
  | 'sales_manager'
  | 'sales_executive'
  | 'sales_team_leader'
  | 'processing_manager'
  | 'processing_executive'
  | 'processing_team_leader'
  | 'processing_supervisor'
  | 'finance_manager'
  | 'finance_executive'
  | 'marketing_manager'
  | 'marketing_executive';

/**
 * Allowed staff departments supported by the Staff Migration API.
 */
export type StaffDepartment = 'sales' | 'processing' | 'finance' | 'marketing';

/**
 * Resolved role and department pair.
 */
export interface ResolvedStaffRole {
  role: StaffRole;
  department: StaffDepartment;
}

/**
 * Default fallback role when role cannot be identified confidently.
 */
export const DEFAULT_STAFF_ROLE: StaffRole = 'sales_executive';

/**
 * Default fallback department when department cannot be identified confidently.
 */
export const DEFAULT_STAFF_DEPARTMENT: StaffDepartment = 'sales';

/**
 * Default fallback Indian phone number when phone is missing or invalid.
 */
export const DEFAULT_FALLBACK_STAFF_PHONE = '+919999999999';

/**
 * Derives both role and department from the source Zoho `role_name` field.
 *
 * Direct mappings:
 * - 'CEO' -> director (sales)
 * - 'General Manager' -> branch_manager (sales)
 * - 'Sales Manager' -> sales_manager (sales)
 * - 'Sales Executive' -> sales_executive (sales)
 * - 'Operation Manager' -> processing_manager (processing)
 * - 'Canada Operations' -> processing_executive (processing)
 * - 'Australia Operations' -> processing_executive (processing)
 *
 * Fallback pattern matching:
 * - Keyword matching for team leaders, supervisors, finance, marketing, operations, and sales.
 * - Defaults to role='sales_executive', department='sales'.
 *
 * @param roleNameRaw - Raw role_name string from Zoho migrated_users
 * @returns {ResolvedStaffRole} Strongly-typed role and department
 */
export function resolveStaffRoleAndDepartment(roleNameRaw?: string | null): ResolvedStaffRole {
  if (!roleNameRaw || typeof roleNameRaw !== 'string') {
    return {
      role: DEFAULT_STAFF_ROLE,
      department: DEFAULT_STAFF_DEPARTMENT,
    };
  }

  const raw = roleNameRaw.trim().toLowerCase();
  if (!raw || raw === 'null' || raw === 'undefined') {
    return {
      role: DEFAULT_STAFF_ROLE,
      department: DEFAULT_STAFF_DEPARTMENT,
    };
  }

  // 1. Direct Known Mappings from the Database
  if (raw === 'ceo' || raw === 'director' || raw === 'managing director') {
    return { role: 'director', department: 'sales' };
  }

  if (raw === 'general manager' || raw === 'branch manager') {
    return { role: 'branch_manager', department: 'sales' };
  }

  if (raw === 'sales manager') {
    return { role: 'sales_manager', department: 'sales' };
  }

  if (raw === 'sales executive') {
    return { role: 'sales_executive', department: 'sales' };
  }

  if (raw === 'operation manager' || raw === 'operations manager' || raw === 'processing manager') {
    return { role: 'processing_manager', department: 'processing' };
  }

  if (
    raw === 'canada operations' ||
    raw === 'australia operations' ||
    raw === 'processing executive' ||
    raw === 'operations executive'
  ) {
    return { role: 'processing_executive', department: 'processing' };
  }

  // 2. Pattern Matching by Role Level and Department Keywords
  const isTeamLeader =
    raw.includes('team leader') || raw.includes('team lead') || raw.includes(' tl');
  const isSupervisor = raw.includes('supervisor');
  const isManager = raw.includes('manager') || raw.includes('head');

  const isSales =
    raw.includes('sale') || raw.includes('business development') || raw.includes('counselor');
  const isProcessing = raw.includes('process') || raw.includes('operation') || raw.includes('case');
  const isFinance = raw.includes('finance') || raw.includes('account');
  const isMarketing = raw.includes('market') || raw.includes('digital') || raw.includes('seo');

  // Finance hierarchy
  if (isFinance) {
    return {
      role: isManager ? 'finance_manager' : 'finance_executive',
      department: 'finance',
    };
  }

  // Marketing hierarchy
  if (isMarketing) {
    return {
      role: isManager ? 'marketing_manager' : 'marketing_executive',
      department: 'marketing',
    };
  }

  // Processing hierarchy
  if (isProcessing) {
    if (isTeamLeader) {
      return { role: 'processing_team_leader', department: 'processing' };
    }
    if (isSupervisor) {
      return { role: 'processing_supervisor', department: 'processing' };
    }
    if (isManager) {
      return { role: 'processing_manager', department: 'processing' };
    }
    return { role: 'processing_executive', department: 'processing' };
  }

  // Sales hierarchy
  if (isSales) {
    if (isTeamLeader) {
      return { role: 'sales_team_leader', department: 'sales' };
    }
    if (isManager) {
      return { role: 'sales_manager', department: 'sales' };
    }
    return { role: 'sales_executive', department: 'sales' };
  }

  // Generic Manager
  if (isManager) {
    return { role: 'branch_manager', department: 'sales' };
  }

  // Default fallback
  return {
    role: DEFAULT_STAFF_ROLE,
    department: DEFAULT_STAFF_DEPARTMENT,
  };
}

/**
 * Normalizes staff phone numbers to consistent Indian format (+91XXXXXXXXXX):
 * 1. Checks primary `phone`, falling back to `mobile`.
 * 2. Strips all non-digit characters.
 * 3. If phone starts with 91 and has 12 digits (e.g. 918431429371), extracts the 10-digit number.
 * 4. If phone has 10 digits (e.g. 8431429371), prepends +91.
 * 5. If missing, null, or invalid, returns +919999999999.
 *
 * @param phoneRaw - Raw phone field from Zoho migrated_users
 * @param mobileRaw - Raw mobile field from Zoho migrated_users
 * @returns {string} Normalized Indian phone number (+91XXXXXXXXXX)
 */
export function normalizeIndianPhone(phoneRaw?: string | null, mobileRaw?: string | null): string {
  const candidate = (phoneRaw && phoneRaw.trim()) || (mobileRaw && mobileRaw.trim()) || '';
  if (!candidate) {
    return DEFAULT_FALLBACK_STAFF_PHONE;
  }

  // Remove all non-digit characters
  const digits = candidate.replace(/\D/g, '');

  // 10-digit Indian mobile/landline
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // 12-digit Indian number starting with 91 (e.g. 918431429371)
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  // 11-digit number with leading 0 (e.g. 08431429371)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91${digits.slice(1)}`;
  }

  return DEFAULT_FALLBACK_STAFF_PHONE;
}
