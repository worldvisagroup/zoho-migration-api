import type { MigratedCallEntity } from '../../../database/schema/index.js';
import type { QueryCallsDto } from '../dto/index.js';

export interface PaginatedCallRecords {
  records: MigratedCallEntity[];
  total: number;
}

export interface ICallsRepository {
  /**
   * Fetches paginated call records matching the query filters.
   *
   * @param query - Validated query parameters
   * @returns {Promise<PaginatedCallRecords>} Records and total matching count
   */
  findCalls(query: QueryCallsDto): Promise<PaginatedCallRecords>;

  /**
   * Batch resolves customer phone numbers for the provided calls in a single pass.
   * Maps call zoho_id to the resolved normalized customer phone number.
   *
   * @param calls - Array of call entities in the current page
   * @returns {Promise<Map<string, string>>} Map of call zoho_id -> normalized customer phone
   */
  batchResolveCustomerPhones(calls: MigratedCallEntity[]): Promise<Map<string, string>>;

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   *
   * @param zohoUserIds - Array of unique zoho_id strings from users
   * @returns {Promise<Map<string, string>>} Map of zoho_id to sanitized email
   */
  batchResolveUserEmails(zohoUserIds: string[]): Promise<Map<string, string>>;
}
