import { Injectable, Logger } from '@nestjs/common';
import { normalizeZohoTimestamp, sanitizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedEventEntity,
  MigratedMeetingRecordingEntity,
} from '../../../database/schema/index.js';
import { getMimeType } from '../../attachments/utils/mime-type.helper.js';
import { R2StorageService } from '../../attachments/r2-storage.service.js';
import {
  MeetingItemDto,
  MeetingParticipantDto,
  MeetingRecordingDto,
  MeetingsResponseDto,
  type QueryMeetingsDto,
} from '../dto/index.js';
import { MeetingsRepository } from '../repositories/meetings.repository.js';
import type { CustomerInfo } from '../repositories/meetings.repository.interface.js';
import { normalizeMeetingStatus } from '../utils/meeting-status.util.js';

@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);

  constructor(
    private readonly meetingsRepository: MeetingsRepository,
    private readonly r2StorageService: R2StorageService,
  ) {}

  /**
   * Fetches, normalizes, and transforms meeting events into standardized migration records.
   *
   * @param query - Validated query parameters
   * @returns {Promise<MeetingsResponseDto>} Paginated meetings migration response
   */
  async getMeetings(query: QueryMeetingsDto): Promise<MeetingsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;

    const { records, total } = await this.meetingsRepository.findMeetings(query);

    if (records.length === 0) {
      return new MeetingsResponseDto([], total, page, limit);
    }

    // 1. Collect user IDs for batch resolution
    const userIds: string[] = [];
    const eventZohoIds: string[] = [];

    for (const r of records) {
      eventZohoIds.push(r.zoho_id);

      const ownerId = r._zoho_owner_id?.trim();
      if (ownerId) userIds.push(ownerId);

      const creatorId = r._zoho_created_by_id?.trim();
      if (creatorId) userIds.push(creatorId);

      const modifierId = r._zoho_modified_by_id?.trim();
      if (modifierId) userIds.push(modifierId);

      if (Array.isArray(r.Participants)) {
        for (const p of r.Participants) {
          if (p && typeof p === 'object') {
            const pId = typeof p.participant === 'string' ? p.participant.trim() : null;
            if (pId) userIds.push(pId);
          }
        }
      }
    }

    // 2. Parallel batch lookups for staff users and recordings
    const [userMap, staffEmailSet, recordingMap] = await Promise.all([
      this.meetingsRepository.batchResolveUsers(userIds),
      this.meetingsRepository.batchResolveStaffEmails(),
      this.meetingsRepository.batchFindRecordings(eventZohoIds),
    ]);

    // 3. Filter strictly the events needing external customer resolution:
    // Only where participant email count is 0, OR participant email count is 1 and that email belongs to staff (not customer)
    const eventsNeedingCustomer: MigratedEventEntity[] = [];

    for (const record of records) {
      const hostId = record._zoho_owner_id?.trim() || null;
      const hostEmail = hostId ? userMap.get(hostId)?.email : null;

      const seenEmails = new Set<string>();
      let hasCustomerEmail = false;

      if (hostEmail) {
        seenEmails.add(hostEmail);
      }

      if (Array.isArray(record.Participants)) {
        for (const p of record.Participants) {
          if (!p || typeof p !== 'object') continue;
          const email = sanitizeEmail(p.Email || p.email);
          if (!email || seenEmails.has(email)) continue;
          seenEmails.add(email);

          const pId = typeof p.participant === 'string' ? p.participant.trim() : null;
          const isStaff =
            p.type === 'user' ||
            Boolean(pId && userMap.has(pId)) ||
            staffEmailSet.has(email) ||
            (hostEmail && email === hostEmail);

          if (!isStaff) {
            hasCustomerEmail = true;
          }
        }
      }

      const totalEmails = seenEmails.size;
      const requiresCustomerFallback =
        !hasCustomerEmail && (totalEmails === 0 || totalEmails === 1);

      if (requiresCustomerFallback) {
        eventsNeedingCustomer.push(record);
      }
    }

    // 4. Concurrently generate presigned recording URLs AND resolve customers for only events that need it
    const recordingItemsToPresign = Array.from(recordingMap.values())
      .filter(rec => rec.r2_key)
      .map(rec => ({
        id: rec.recording_id,
        r2Key: rec.r2_key,
        fallbackUrl: rec.r2_download_url || rec.zoho_share_url,
        fileName: rec.resource_name,
      }));

    const [presignedUrls, customerMap] = await Promise.all([
      this.r2StorageService.generateDownloadUrlsBatch(
        recordingItemsToPresign.map(item => ({
          r2Key: item.r2Key,
          fallbackUrl: item.fallbackUrl,
          fileName: item.fileName,
        })),
      ),
      eventsNeedingCustomer.length > 0
        ? this.meetingsRepository.batchResolveCustomers(eventsNeedingCustomer)
        : Promise.resolve(new Map<string, CustomerInfo>()),
    ]);

    const recordingUrlMap = new Map<string, string>();
    recordingItemsToPresign.forEach((item, index) => {
      const url = presignedUrls[index];
      if (url) {
        recordingUrlMap.set(item.id, url);
      }
    });

    // 5. Transform records into standardized DTOs
    const data = records.map(record =>
      this.transformRecordToMeeting(
        record,
        userMap,
        staffEmailSet,
        recordingMap,
        recordingUrlMap,
        customerMap,
      ),
    );

    return new MeetingsResponseDto(data, total, page, limit);
  }

  /**
   * Transforms a single database entity into a MeetingItemDto.
   */
  private transformRecordToMeeting(
    record: MigratedEventEntity,
    userMap: Map<string, { email: string; name: string }>,
    staffEmailSet: Set<string>,
    recordingMap: Map<string, MigratedMeetingRecordingEntity>,
    recordingUrlMap: Map<string, string>,
    customerMap: Map<string, { email: string; name: string }>,
  ): MeetingItemDto {
    const status = normalizeMeetingStatus(record.Meeting_Status, record.is_closed);
    const title = record.Event_Title ? record.Event_Title.trim() : '';
    const description = record.Description?.trim() ? record.Description.trim() : null;

    // Host
    const hostId = record._zoho_owner_id?.trim() || null;
    const hostUser = hostId ? userMap.get(hostId) : null;
    const hostEmail = hostUser?.email || null;
    const hostName = hostUser?.name || 'Staff Host';

    // Creator
    const createdById = record._zoho_created_by_id?.trim() || null;
    const createdByEmail = createdById ? (userMap.get(createdById)?.email ?? null) : null;

    // Modifier
    const modifiedById = record._zoho_modified_by_id?.trim() || null;

    // Timestamps
    const scheduledAt = normalizeZohoTimestamp(record.Start_DateTime);
    const endedAt = normalizeZohoTimestamp(record.End_DateTime);
    const modifiedAt = normalizeZohoTimestamp(record.Modified_Time, record.Created_Time);
    // startedAt fallback: if ended, falls back to scheduled Start_DateTime; if scheduled/cancelled, null
    const startedAt = status === 'ended' ? scheduledAt : null;

    // Participants resolution & deduplication
    const participants: MeetingParticipantDto[] = [];
    const seenEmails = new Set<string>();

    // 1. Always include the Staff Host if email is present
    if (hostEmail) {
      participants.push(
        new MeetingParticipantDto({
          email: hostEmail,
          name: hostName,
          type: 'staff',
        }),
      );
      seenEmails.add(hostEmail);
    }

    // 2. Direct participants from Participants array
    if (Array.isArray(record.Participants)) {
      for (const p of record.Participants) {
        if (!p || typeof p !== 'object') continue;

        const email = sanitizeEmail(p.Email || p.email);
        if (!email || seenEmails.has(email)) continue;

        const pId = typeof p.participant === 'string' ? p.participant.trim() : null;
        const matchedUser = pId ? userMap.get(pId) : null;

        // Any user in migrated_users, or marked as 'user', or with staff email is 'staff'; otherwise 'guest'
        const isStaff =
          p.type === 'user' ||
          Boolean(matchedUser) ||
          staffEmailSet.has(email) ||
          (hostEmail && email === hostEmail);

        const name =
          p.name?.trim() || matchedUser?.name || (isStaff ? 'Staff Participant' : 'Guest');

        participants.push(
          new MeetingParticipantDto({
            email,
            name,
            type: isStaff ? 'staff' : 'guest',
          }),
        );
        seenEmails.add(email);
      }
    }

    // 3. Fallback: If fewer than 2 participants, resolve the customer from parent Lead/Contact
    if (participants.length < 2) {
      const customer = customerMap.get(record.zoho_id);
      if (customer?.email && !seenEmails.has(customer.email)) {
        participants.push(
          new MeetingParticipantDto({
            email: customer.email,
            name: customer.name || 'Guest',
            type: 'guest',
          }),
        );
        seenEmails.add(customer.email);
      }
    }

    // Recording resolution
    let recording: MeetingRecordingDto | null = null;
    const recordingDoc = recordingMap.get(record.zoho_id);
    if (recordingDoc) {
      const url =
        recordingUrlMap.get(recordingDoc.recording_id) ||
        recordingDoc.r2_download_url ||
        recordingDoc.zoho_share_url ||
        '';

      if (url) {
        const mimeType =
          getMimeType(recordingDoc.resource_name || recordingDoc.r2_key) || 'video/mp4';
        const sizeBytes =
          typeof recordingDoc.file_size === 'number' && recordingDoc.file_size >= 0
            ? recordingDoc.file_size
            : 0;

        recording = new MeetingRecordingDto({
          url,
          mimeType,
          sizeBytes,
        });
      }
    }

    return new MeetingItemDto({
      externalId: record.zoho_id,
      title,
      description,
      status,
      scheduledAt,
      startedAt,
      endedAt,
      hostEmail,
      hostId,
      participants,
      recording,
      createdById,
      createdByEmail,
      modifiedAt,
      modifiedById,
    });
  }
}
