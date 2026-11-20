import { BadRequestException } from '@nestjs/common';

/**
 * Interface representing any query object that supports date filtering.
 */
export interface DateFilterQuery {
  from?: string;
  to?: string;
  updatedSince?: string;
}

/**
 * Error message returned when updatedSince is passed together with from or to.
 */
export const FILTER_COLLISION_ERROR_MESSAGE =
  "Cannot specify both 'updatedSince' (modification filter) and 'from'/'to' (creation filters) simultaneously. Use 'from'/'to' for initial backfill by creation date, or 'updatedSince' for incremental synchronization.";

/**
 * Enforces mutual exclusivity between creation-time filters (from, to) and
 * modification-time incremental sync filters (updatedSince).
 *
 * @throws {BadRequestException} When updatedSince is provided alongside from or to.
 */
export function validateDateFilterExclusivity(query: DateFilterQuery): void {
  if (query.updatedSince && (query.from !== undefined || query.to !== undefined)) {
    throw new BadRequestException(FILTER_COLLISION_ERROR_MESSAGE);
  }
}
