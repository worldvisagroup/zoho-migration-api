export type TargetTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Normalizes raw Zoho task Priority string into target API priority:
 * - 'urgent' (Highest)
 * - 'high' (High)
 * - 'medium' (Normal, default fallback)
 * - 'low' (Low, Lowest)
 *
 * @param priorityRaw - Raw Priority string from Zoho task record
 * @returns {TargetTaskPriority} Standardized priority
 */
export function normalizeTaskPriority(priorityRaw?: string | null): TargetTaskPriority {
  if (!priorityRaw || typeof priorityRaw !== 'string') {
    return 'medium';
  }

  const clean = priorityRaw.trim().toLowerCase();

  switch (clean) {
    case 'highest':
      return 'urgent';
    case 'high':
      return 'high';
    case 'normal':
      return 'medium';
    case 'low':
    case 'lowest':
      return 'low';
    default:
      return 'medium';
  }
}
