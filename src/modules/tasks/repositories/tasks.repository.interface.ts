import type { MigratedTaskEntity } from '../../../database/schema/index.js';
import type { QueryTasksDto } from '../dto/index.js';

export interface PaginatedTaskRecords {
  records: MigratedTaskEntity[];
  total: number;
}

export interface ITasksRepository {
  /**
   * Fetches paginated task records matching query filters, ordered by Created_Time ascending.
   *
   * @param query - Validated query parameters
   * @returns {Promise<PaginatedTaskRecords>} Records and total matching count
   */
  findTasks(query: QueryTasksDto): Promise<PaginatedTaskRecords>;

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   * Maps zoho_id to normalized email.
   *
   * @param zohoUserIds - Array of unique zoho_id strings from users
   * @returns {Promise<Map<string, string>>} Map of zoho_id -> normalized email
   */
  batchResolveUserEmails(zohoUserIds: string[]): Promise<Map<string, string>>;
}
