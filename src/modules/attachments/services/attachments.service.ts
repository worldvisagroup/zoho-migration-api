import { Injectable, Logger } from '@nestjs/common';
import { normalizeZohoTimestamp } from '../../../common/utils/index.js';
import type { MigratedAttachmentEntity } from '../../../database/schema/index.js';
import {
  AttachmentItemDto,
  AttachmentsResponseDto,
  type QueryAttachmentsDto,
} from '../dto/index.js';
import { R2StorageService } from '../r2-storage.service.js';
import { AttachmentsRepository } from '../repositories/attachments.repository.js';
import { getMimeType } from '../utils/mime-type.helper.js';

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name);

  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly r2StorageService: R2StorageService,
  ) {}

  /**
   * Retrieves and transforms migrated attachments into the standardized migration contract.
   *
   * 1. Queries MongoDB via AttachmentsRepository with pagination and filtering.
   * 2. Resolves staff creator/modifier email addresses using single-pass batching (0 N+1 queries).
   * 3. Generates fresh presigned download URLs concurrently from Cloudflare R2.
   * 4. Derives standard RFC MIME types from file extensions.
   * 5. Returns formatted response envelope.
   */
  async getAttachments(query: QueryAttachmentsDto): Promise<AttachmentsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;

    const { records, total } = await this.attachmentsRepository.findAttachments(query);

    if (records.length === 0) {
      return new AttachmentsResponseDto([], total, page, limit);
    }

    // 1. Collect all unique user IDs for batch email lookup
    const userIds: string[] = [];
    for (const r of records) {
      if (r._zoho_created_by_id) userIds.push(r._zoho_created_by_id);
      if (r._zoho_owner_id) userIds.push(r._zoho_owner_id);
      if (r._zoho_modified_by_id) userIds.push(r._zoho_modified_by_id);
    }
    const userEmailMap = await this.attachmentsRepository.batchResolveUserEmails(userIds);

    // 2. Concurrently generate fresh presigned download URLs from R2
    const downloadUrls = await this.r2StorageService.generateDownloadUrlsBatch(
      records.map(r => ({
        r2Key: r.r2_key,
        fallbackUrl: r.r2_download_url,
        fileName: r.File_Name,
      })),
    );

    // 3. Map entities to standardized DTOs
    const data = records.map((record, index) =>
      this.transformAttachment(record, downloadUrls[index] ?? '', userEmailMap),
    );

    return new AttachmentsResponseDto(data, total, page, limit);
  }

  /**
   * Transforms a single database entity into an AttachmentItemDto.
   */
  private transformAttachment(
    record: MigratedAttachmentEntity,
    resolvedUrl: string,
    userEmailMap: Map<string, string>,
  ): AttachmentItemDto {
    const creatorId = record._zoho_created_by_id?.trim() || record._zoho_owner_id?.trim() || null;
    const modifierId = record._zoho_modified_by_id?.trim() || null;

    const uploadedByEmail = creatorId ? (userEmailMap.get(creatorId) ?? null) : null;
    const modifiedByEmail = modifierId ? (userEmailMap.get(modifierId) ?? null) : null;

    // Parse size in bytes safely
    let sizeBytes = 0;
    if (record.Size) {
      const parsed = parseInt(record.Size, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        sizeBytes = parsed;
      }
    }

    const fileName = record.File_Name ?? '';
    const mimeType = getMimeType(fileName || record.r2_key);

    return new AttachmentItemDto({
      externalId: record.zoho_id,
      url: resolvedUrl,
      fileName,
      mimeType,
      sizeBytes,
      uploadedByEmail,
      uploadedByZohoId: creatorId,
      uploadedAt: normalizeZohoTimestamp(record.Created_Time, record.createdAt),
      createdAt: normalizeZohoTimestamp(record.Created_Time, record.createdAt),
      modifiedAt: normalizeZohoTimestamp(record.Modified_Time, record.Created_Time),
      modifiedByEmail,
      modifiedByZohoId: modifierId,
    });
  }
}
