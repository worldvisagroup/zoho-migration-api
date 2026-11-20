import type { MigratedUserEntity } from '../../../database/schema/index.js';

/**
 * Result of a paginated database query on migrated users.
 */
export interface PaginatedStaffRecords {
  records: MigratedUserEntity[];
  total: number;
}

/**
 * Data Access Layer interface for retrieving migrated staff records.
 */
export interface IStaffRepository {
  /**
   * Fetches paginated staff records from the migrated_users collection,
   * filtered by created_time and sorted oldest to newest.
   *
   * @param from - Optional ISO 8601 start date
   * @param to - Optional ISO 8601 end date
   * @param page - 1-indexed page number
   * @param limit - Page size
   * @param updatedSince - Optional ISO 8601 modification timestamp for incremental sync
   */
  findStaff(
    from?: string,
    to?: string,
    page?: number,
    limit?: number,
    updatedSince?: string,
  ): Promise<PaginatedStaffRecords>;
}
