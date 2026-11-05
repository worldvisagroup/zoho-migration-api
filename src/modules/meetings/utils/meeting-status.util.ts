export type TargetMeetingStatus = 'scheduled' | 'ended' | 'cancelled';

/**
 * Normalizes raw Zoho Meeting_Status and is_closed boolean into the target API status:
 * - 'scheduled'
 * - 'ended'
 * - 'cancelled'
 *
 * Requirements:
 * 1. If Meeting_Status is 'Attended' (case-insensitive) -> 'ended'
 * 2. If Meeting_Status is 'Escaped' or 'Postponed' (case-insensitive) -> 'cancelled'
 * 3. If Meeting_Status is null or unstated:
 *    - If is_closed is false -> 'scheduled'
 *    - If is_closed is true (past events in database) -> 'ended'
 * 4. Fallback defaults: 'ended' if is_closed is true, else 'scheduled'.
 *
 * @param meetingStatusRaw - Raw Meeting_Status picklist string from Zoho event record
 * @param isClosed - is_closed boolean flag
 * @returns {TargetMeetingStatus} Standardized meeting status
 */
export function normalizeMeetingStatus(
  meetingStatusRaw?: string | null,
  isClosed?: boolean | null,
): TargetMeetingStatus {
  const cleanStatus = meetingStatusRaw ? meetingStatusRaw.trim().toLowerCase() : '';

  if (cleanStatus === 'attended') {
    return 'ended';
  }

  if (
    cleanStatus === 'escaped' ||
    cleanStatus === 'postponed' ||
    cleanStatus === 'cancelled' ||
    cleanStatus === 'canceled'
  ) {
    return 'cancelled';
  }

  if (isClosed === false) {
    return 'scheduled';
  }

  return 'ended';
}
