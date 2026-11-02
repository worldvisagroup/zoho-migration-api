import type { MigratedNoteEntity } from '../../../database/schema/index.js';
import type { QueryNotesDto } from '../dto/index.js';

export interface PaginatedNoteRecords {
  records: MigratedNoteEntity[];
  total: number;
}

export interface INotesRepository {
  /**
   * Fetches paginated note records matching the query filters.
   *
   * @param query - Validated query parameters
   * @returns {Promise<PaginatedNoteRecords>} Records and total matching count
   */
  findNotes(query: QueryNotesDto): Promise<PaginatedNoteRecords>;

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   *
   * @param zohoUserIds - Array of unique zoho_id strings from users
   * @returns {Promise<Map<string, string>>} Map of zoho_id to sanitized email
   */
  findUserEmailsByZohoIds(zohoUserIds: string[]): Promise<Map<string, string>>;
}
