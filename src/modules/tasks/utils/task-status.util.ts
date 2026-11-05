export type TargetTaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Normalizes raw Zoho task Status and is_closed boolean into the target API status:
 * - 'done'
 * - 'in_progress'
 * - 'todo'
 *
 * Requirements:
 * 1. If `is_closed` is true, the task is always normalized to 'done', even if Status is 'In Progress' or inconsistent.
 * 2. If Status is 'Completed' (case-insensitive), normalized to 'done'.
 * 3. If Status is 'In Progress' and not closed, normalized to 'in_progress'.
 * 4. All other open states ('Not Started', 'Deferred', 'Waiting on someone else', 'Waiting for input', empty, null, or unknown) default to 'todo'.
 *
 * @param statusRaw - Raw Status string from Zoho task record
 * @param isClosed - is_closed boolean flag
 * @returns {TargetTaskStatus} Standardized status
 */
export function normalizeTaskStatus(
  statusRaw?: string | null,
  isClosed?: boolean | null,
): TargetTaskStatus {
  if (isClosed === true) {
    return 'done';
  }

  const cleanStatus = statusRaw ? statusRaw.trim().toLowerCase() : '';

  if (cleanStatus === 'completed' || cleanStatus === 'closed' || cleanStatus === 'done') {
    return 'done';
  }

  if (
    cleanStatus === 'in progress' ||
    cleanStatus === 'in_progress' ||
    cleanStatus === 'in-progress'
  ) {
    return 'in_progress';
  }

  return 'todo';
}
