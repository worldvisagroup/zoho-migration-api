/**
 * Resolves the completedAt timestamp for a task:
 * 1. If isDone is false (task is 'todo' or 'in_progress'): returns null.
 * 2. If isDone is true (task is 'done'):
 *    - If closedTime is missing, null, or invalid: returns null.
 *    - Anomaly Check: If closedTime is earlier than createdTime (closed before creation):
 *      falls back to modifiedTime (if present and valid), otherwise createdTime.
 *    - Otherwise (closedTime >= createdTime): returns closedTime in UTC ISO 8601 format.
 *
 * @param isDone - Whether the task is marked done
 * @param closedTime - Zoho Closed_Time
 * @param modifiedTime - Zoho Modified_Time
 * @param createdTime - Zoho Created_Time
 * @returns {string | null} UTC ISO 8601 completed timestamp, or null
 */
export function resolveTaskCompletedAt(
  isDone: boolean,
  closedTime?: Date | string | null,
  modifiedTime?: Date | string | null,
  createdTime?: Date | string | null,
): string | null {
  if (!isDone || !closedTime) {
    return null;
  }

  const closedDate = new Date(closedTime);
  if (isNaN(closedDate.getTime())) {
    return null;
  }

  if (createdTime) {
    const createdDate = new Date(createdTime);
    if (!isNaN(createdDate.getTime()) && closedDate.getTime() < createdDate.getTime()) {
      if (modifiedTime) {
        const modifiedDate = new Date(modifiedTime);
        if (!isNaN(modifiedDate.getTime())) {
          return modifiedDate.toISOString();
        }
      }
      return createdDate.toISOString();
    }
  }

  return closedDate.toISOString();
}
