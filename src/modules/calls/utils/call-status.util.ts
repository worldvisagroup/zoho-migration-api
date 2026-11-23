import type { CallStatus } from '../dto/call-response.dto.js';

/**
 * Normalizes call status based on duration, Zoho Outgoing_Call_Status, and Call_Start_Time:
 *
 * 1. If Call_Duration_in_seconds > 0 -> 'answered'
 * 2. If duration is 0, null, or negative:
 *    - Outgoing_Call_Status is 'Completed' -> 'answered'
 *    - Outgoing_Call_Status is 'Overdue' -> 'overdue'
 *    - Outgoing_Call_Status is 'Cancelled' / 'Canceled' -> 'cancelled'
 *    - Outgoing_Call_Status is 'Scheduled':
 *        - Call_Start_Time in future (> now) -> 'scheduled'
 *        - Call_Start_Time in past (<= now) or missing -> 'overdue'
 *    - Outgoing_Call_Status is null / unstated / empty:
 *        - Call_Start_Time in future (> now) -> 'scheduled'
 *        - Call_Start_Time in past (<= now) or missing -> 'overdue'
 *
 * @param durationSecondsRaw - Call duration in seconds (can be null/undefined)
 * @param outgoingStatusRaw - Zoho CRM Outgoing_Call_Status picklist value
 * @param callStartTimeRaw - Zoho CRM Call_Start_Time timestamp
 * @param now - Optional reference date for deterministic unit testing (defaults to new Date())
 * @returns {CallStatus} Standardized call status ('answered' | 'overdue' | 'scheduled' | 'cancelled')
 */
export function resolveCallStatus(
  durationSecondsRaw?: number | null,
  outgoingStatusRaw?: string | null,
  callStartTimeRaw?: Date | string | null,
  now: Date = new Date(),
): CallStatus {
  // 1. Check if duration is greater than 0
  if (
    durationSecondsRaw != null &&
    !isNaN(durationSecondsRaw) &&
    durationSecondsRaw > 0
  ) {
    return 'answered';
  }

  // 2. Evaluate Outgoing_Call_Status
  const cleanStatus = outgoingStatusRaw ? outgoingStatusRaw.trim().toLowerCase() : '';

  if (cleanStatus === 'completed') {
    return 'answered';
  }

  if (cleanStatus === 'overdue') {
    return 'overdue';
  }

  if (cleanStatus === 'cancelled' || cleanStatus === 'canceled') {
    return 'cancelled';
  }

  // Helper to determine if start time is in the future relative to `now`
  const isFutureStartTime = (): boolean => {
    if (!callStartTimeRaw) {
      return false;
    }
    const startTime =
      typeof callStartTimeRaw === 'string' || typeof callStartTimeRaw === 'number'
        ? new Date(callStartTimeRaw)
        : callStartTimeRaw;
    if (isNaN(startTime.getTime())) {
      return false;
    }
    return startTime.getTime() > now.getTime();
  };

  if (cleanStatus === 'scheduled') {
    return isFutureStartTime() ? 'scheduled' : 'overdue';
  }

  // Null, empty, or unstated outgoing status
  return isFutureStartTime() ? 'scheduled' : 'overdue';
}
