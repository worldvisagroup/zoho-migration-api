import type {
  MigratedBooksInvoiceEntity,
  MigratedContactEntity,
  MigratedLeadEntity,
} from '../../../database/schema/index.js';

/**
 * Encapsulates client identifiers extracted from a paginated page of leads or contacts
 * to enable zero N+1 batch querying of associated Zoho Books invoices.
 */
export interface ClientBatchIdentities {
  /**
   * Original Zoho IDs of CRM contacts or leads
   */
  zohoIds: string[];

  /**
   * MongoDB internal _ids (used for dual-reference CRM link matching)
   */
  internalIds: string[];

  /**
   * Valid, normalized lowercase client emails (excluding dummy defaults)
   */
  emails: string[];
}

/**
 * Result of a paginated database query on leads or contacts.
 */
export interface PaginatedRecords<T> {
  records: T[];
  total: number;
}

/**
 * Data Access Layer interface for retrieving client migration records and related billing data.
 */
export interface IClientsRepository {
  /**
   * Fetches paginated leads from the migrated_leads collection, filtered by Created_Time range or Modified_Time.
   *
   * @param from - Optional ISO 8601 start date
   * @param to - Optional ISO 8601 end date
   * @param page - 1-indexed page number
   * @param limit - Page size
   * @param updatedSince - Optional ISO 8601 modification timestamp for incremental sync
   */
  findLeads(
    from?: string,
    to?: string,
    page?: number,
    limit?: number,
    updatedSince?: string,
  ): Promise<PaginatedRecords<MigratedLeadEntity>>;

  /**
   * Fetches paginated contacts from the migrated_contacts collection, filtered by Created_Time range or Modified_Time.
   *
   * @param from - Optional ISO 8601 start date
   * @param to - Optional ISO 8601 end date
   * @param page - 1-indexed page number
   * @param limit - Page size
   * @param updatedSince - Optional ISO 8601 modification timestamp for incremental sync
   */
  findContacts(
    from?: string,
    to?: string,
    page?: number,
    limit?: number,
    updatedSince?: string,
  ): Promise<PaginatedRecords<MigratedContactEntity>>;

  /**
   * Batch fetches and associates Zoho Books invoices for the clients in the current page.
   * Matches via Zoho CRM contact link in MigratedBooksContact and/or client email.
   *
   * @param identities - Collected Zoho IDs, internal IDs, and emails for the batch
   * @returns Map keyed by Zoho ID or email, pointing to matching invoices sorted by date DESC
   */
  findInvoicesForClients(
    identities: ClientBatchIdentities,
  ): Promise<Map<string, MigratedBooksInvoiceEntity[]>>;
}
