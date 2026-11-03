import type { MigratedAttachmentEntity } from '../../../database/schema/index.js';
import type { QueryAttachmentsDto } from '../dto/index.js';

export interface PaginatedAttachmentRecords {
  records: MigratedAttachmentEntity[];
  total: number;
}

export interface IAttachmentsRepository {
  /**
   * Fetches paginated attachment records matching query filters, ordered by Created_Time ascending.
   *
   * @param query - Validated query parameters
   * @returns {Promise<PaginatedAttachmentRecords>} Records and total matching count
   */
  findAttachments(query: QueryAttachmentsDto): Promise<PaginatedAttachmentRecords>;

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   * Maps zoho_id to normalized email.
   *
   * @param zohoUserIds - Array of unique zoho_id strings from users
   * @returns {Promise<Map<string, string>>} Map of zoho_id -> normalized email
   */
  batchResolveUserEmails(zohoUserIds: string[]): Promise<Map<string, string>>;
}
