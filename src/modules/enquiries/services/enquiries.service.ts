import { Injectable, Logger } from '@nestjs/common';
import {
  normalizeEmail,
  normalizePhoneNumber,
  normalizeZohoTimestamp,
  resolveParentEntity,
  sanitizeEmail,
} from '../../../common/utils/index.js';
import type {
  MigratedAttachmentEntity,
  MigratedCallEntity,
  MigratedContactEntity,
  MigratedEventEntity,
  MigratedLeadEntity,
  MigratedNoteEntity,
  MigratedTaskEntity,
  MigratedVisaApplicationEntity,
  UnifiedEntry,
} from '../../../database/schema/index.js';
import { R2StorageService } from '../../attachments/r2-storage.service.js';
import { getMimeType } from '../../attachments/utils/mime-type.helper.js';
import { AttachmentItemDto } from '../../attachments/dto/attachment-response.dto.js';
import { CallItemDto, CallRecordingDto } from '../../calls/dto/call-response.dto.js';
import { MeetingItemDto, MeetingParticipantDto } from '../../meetings/dto/meeting-response.dto.js';
import { normalizeMeetingStatus } from '../../meetings/utils/meeting-status.util.js';
import { NoteItemDto } from '../../notes/dto/note-response.dto.js';
import { TaskItemDto } from '../../tasks/dto/task-response.dto.js';
import { normalizeTaskPriority } from '../../tasks/utils/task-priority.util.js';
import { normalizeTaskStatus } from '../../tasks/utils/task-status.util.js';
import {
  EnquiriesResponseDto,
  EnquiryAttributionDto,
  EnquiryClientDto,
  EnquiryItemDto,
  type QueryEnquiriesDto,
} from '../dto/index.js';
import { EnquiriesRepository } from '../repositories/enquiries.repository.js';
import type { UserEmailName } from '../repositories/enquiries.repository.interface.js';
import {
  resolveContactDestinationCountry,
  resolveLeadDestinationCountry,
} from '../utils/destination-country.util.js';
import { resolveInterestedServiceCascade } from '../utils/enquiry-service.util.js';
import { normalizeEnquirySource } from '../utils/enquiry-source.util.js';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    private readonly enquiriesRepository: EnquiriesRepository,
    private readonly r2StorageService: R2StorageService,
  ) {}

  /**
   * Fetches, normalizes, and combines Leads or Contacts into standardized migration enquiries.
   */
  async getEnquiries(query: QueryEnquiriesDto): Promise<EnquiriesResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;

    // 1. Fetch primary page of Leads or Contacts
    const { records, total } = await this.enquiriesRepository.findEnquiries(query);

    if (records.length === 0) {
      return new EnquiriesResponseDto([], total, page, limit);
    }

    // 2. Extract batch identities
    const zohoIds: string[] = [];
    const clientEmails: string[] = [];
    const clientPhones: string[] = [];
    const userIdsSet = new Set<string>();

    for (const r of records) {
      if (r.zoho_id) zohoIds.push(r.zoho_id);

      const rRec = r as unknown as Record<string, unknown>;
      const ownerObj = rRec['Owner'] as { id?: string; email?: string } | undefined;
      const createdByObj = rRec['Created_By'] as { id?: string; email?: string } | undefined;
      const modifiedByObj = rRec['Modified_By'] as { id?: string; email?: string } | undefined;

      const oId = r._zoho_owner_id?.trim() || ownerObj?.id?.trim();
      const cId = r._zoho_created_by_id?.trim() || createdByObj?.id?.trim();
      const mId = r._zoho_modified_by_id?.trim() || modifiedByObj?.id?.trim();

      if (oId) userIdsSet.add(oId);
      if (cId) userIdsSet.add(cId);
      if (mId) userIdsSet.add(mId);

      const email = normalizeEmail(r.Email, r.Secondary_Email);
      if (email) {
        clientEmails.push(email);
      }

      const phone = normalizePhoneNumber(r.Phone, r.Mobile, r.Country_Code);
      if (phone) {
        clientPhones.push(phone);
      }
    }

    // 3. Parallel Batch Secondary Lookups
    const [
      userMap,
      visaAppMap,
      unifiedEntries,
      notesMap,
      callsMap,
      tasksMap,
      meetingsMap,
      attachmentsMap,
    ] = await Promise.all([
      this.enquiriesRepository.batchResolveUsers(Array.from(userIdsSet)),
      this.enquiriesRepository.batchFindVisaApplications(zohoIds, clientEmails, query.type),
      this.enquiriesRepository.batchFindUnifiedEntries(clientEmails, clientPhones),
      this.enquiriesRepository.batchFindNotes(zohoIds, query.type),
      this.enquiriesRepository.batchFindCalls(zohoIds, query.type),
      this.enquiriesRepository.batchFindTasks(zohoIds, query.type),
      this.enquiriesRepository.batchFindMeetings(zohoIds, query.type),
      this.enquiriesRepository.batchFindAttachments(zohoIds, query.type),
    ]);

    // 4. Batch generate presigned download URLs for all attachments in this page
    const allAttachments: MigratedAttachmentEntity[] = [];
    for (const attList of attachmentsMap.values()) {
      allAttachments.push(...attList);
    }

    const presignedUrlMap = await this.resolveAttachmentUrlsBatch(allAttachments);

    // 5. Transform records into standardized EnquiryItemDto list
    const data = records.map(record =>
      this.transformRecordToEnquiry(
        record,
        query.type,
        userMap,
        visaAppMap,
        unifiedEntries,
        notesMap,
        callsMap,
        tasksMap,
        meetingsMap,
        attachmentsMap,
        presignedUrlMap,
      ),
    );

    return new EnquiriesResponseDto(data, total, page, limit);
  }

  /**
   * Concurrently generates presigned download URLs for attachments.
   */
  private async resolveAttachmentUrlsBatch(
    attachments: MigratedAttachmentEntity[],
  ): Promise<Map<string, string>> {
    const itemsToPresign = attachments
      .filter(a => a.r2_key)
      .map(a => ({
        id: a.zoho_id,
        r2Key: a.r2_key!,
        fallbackUrl: a.r2_download_url || a.r2_preview_url || '',
        fileName: a.File_Name,
      }));

    if (itemsToPresign.length === 0) {
      return new Map();
    }

    const presignedUrls = await this.r2StorageService.generateDownloadUrlsBatch(
      itemsToPresign.map(item => ({
        r2Key: item.r2Key,
        fallbackUrl: item.fallbackUrl,
        fileName: item.fileName,
      })),
    );

    const map = new Map<string, string>();
    itemsToPresign.forEach((item, index) => {
      const url = presignedUrls[index];
      if (url) {
        map.set(item.id, url);
      }
    });

    return map;
  }

  /**
   * Selects best matching unified entry for a given enquiry by timestamp proximity.
   */
  private selectBestUnifiedEntry(
    unifiedEntries: UnifiedEntry[],
    cleanEmail: string | null,
    cleanPhone: string | null,
    recordCreatedTime?: Date | string | null,
  ): UnifiedEntry | null {
    const candidates = unifiedEntries.filter(u => {
      const uEmail = u.email ? u.email.toLowerCase().trim() : '';
      const uPhone = u.phone ? u.phone.trim() : '';
      return (
        (Boolean(cleanEmail) && uEmail === cleanEmail) ||
        (Boolean(cleanPhone) && uPhone === cleanPhone)
      );
    });

    if (candidates.length === 0) {
      return null;
    }
    if (candidates.length === 1) {
      return candidates[0];
    }

    const targetTime = recordCreatedTime ? new Date(recordCreatedTime).getTime() : 0;

    // Sort by minimum |addedTime - targetTime|
    candidates.sort((a, b) => {
      const timeA = a.zohoMetadata?.addedTime
        ? new Date(a.zohoMetadata.addedTime).getTime()
        : a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
      const timeB = b.zohoMetadata?.addedTime
        ? new Date(b.zohoMetadata.addedTime).getTime()
        : b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

      const diffA = Math.abs(timeA - targetTime);
      const diffB = Math.abs(timeB - targetTime);
      return diffA - diffB;
    });

    return candidates[0];
  }

  /**
   * Merges primary CRM attribution fields with fallback values from unified_entries.
   */
  private buildAttribution(
    record: MigratedLeadEntity | MigratedContactEntity,
    unified: UnifiedEntry | null,
  ): EnquiryAttributionDto {
    const r = record as unknown as Record<string, unknown>;
    const uAttr = unified?.attribution;

    const campaignName =
      (r['Campaign_Name'] as string) ||
      (r['Ad_Campaign_Name'] as string) ||
      (r['UTM_Campaign_Name'] as string) ||
      (r['Campaigns_Name'] as string) ||
      uAttr?.campaignName ||
      null;

    const adGroupName =
      (r['AdGroup_Name'] as string) || (r['Ad_Set'] as string) || uAttr?.adGroupName || null;

    const adName =
      (typeof r['facebookadvertmanager__Facebook_Ad'] === 'string'
        ? (r['facebookadvertmanager__Facebook_Ad'] as string)
        : null) ||
      (r['Ad_ID'] as string) ||
      (r['ADID'] as string) ||
      (r['Ad'] as string) ||
      uAttr?.adName ||
      null;

    const gclid = (r['GCLID'] as string) || uAttr?.gclid || null;
    const utmSource = (r['UTM_Lead_Source'] as string) || uAttr?.utmSource || null;
    const utmMedium = (r['UTM_Medium'] as string) || uAttr?.utmMedium || null;
    const utmCampaign = (r['UTM_Campaign_Name'] as string) || uAttr?.utmCampaign || null;
    const utmTerm = (r['UTM_Term'] as string) || uAttr?.utmTerm || null;
    const utmContent = (r['UTM_Content'] as string) || uAttr?.utmContent || null;

    const facebookLeadId =
      (r['Lead_ID'] as string) ||
      (r['leadchain0__Social_Lead_ID'] as string) ||
      uAttr?.facebookLeadId ||
      null;

    const fbc = (r['FBCLID'] as string) || uAttr?.fbc || null;
    const fbp = uAttr?.fbp || null;

    return new EnquiryAttributionDto({
      campaignName: campaignName?.trim() || null,
      adGroupName: adGroupName?.trim() || null,
      adName: adName?.trim() || null,
      gclid: gclid?.trim() || null,
      utmSource: utmSource?.trim() || null,
      utmMedium: utmMedium?.trim() || null,
      utmCampaign: utmCampaign?.trim() || null,
      utmTerm: utmTerm?.trim() || null,
      utmContent: utmContent?.trim() || null,
      facebookLeadId: facebookLeadId?.trim() || null,
      fbc: fbc?.trim() || null,
      fbp: fbp?.trim() || null,
    });
  }

  /**
   * Transforms a single Lead or Contact record into an EnquiryItemDto.
   */
  private transformRecordToEnquiry(
    record: MigratedLeadEntity | MigratedContactEntity,
    type: 'leads' | 'contacts',
    userMap: Map<string, UserEmailName>,
    visaAppMap: Map<string, MigratedVisaApplicationEntity>,
    unifiedEntries: UnifiedEntry[],
    notesMap: Map<string, MigratedNoteEntity[]>,
    callsMap: Map<string, MigratedCallEntity[]>,
    tasksMap: Map<string, MigratedTaskEntity[]>,
    meetingsMap: Map<string, MigratedEventEntity[]>,
    attachmentsMap: Map<string, MigratedAttachmentEntity[]>,
    presignedUrlMap: Map<string, string>,
  ): EnquiryItemDto {
    const email = normalizeEmail(record.Email, record.Secondary_Email);
    const phone = normalizePhoneNumber(record.Phone, record.Mobile, record.Country_Code);
    const client = new EnquiryClientDto({ email, phone });

    const rRec = record as unknown as Record<string, unknown>;
    const ownerObj = rRec['Owner'] as { id?: string; email?: string } | undefined;
    const createdByObj = rRec['Created_By'] as { id?: string; email?: string } | undefined;
    const modifiedByObj = rRec['Modified_By'] as { id?: string; email?: string } | undefined;

    // Owner Email
    const ownerId = record._zoho_owner_id?.trim() || ownerObj?.id?.trim() || null;
    const ownerEmail =
      (ownerId ? userMap.get(ownerId)?.email : null) || sanitizeEmail(ownerObj?.email) || null;

    // Creator & Modifier
    const createdById = record._zoho_created_by_id?.trim() || createdByObj?.id?.trim() || null;
    const createdByEmail =
      (createdById ? userMap.get(createdById)?.email : null) ||
      sanitizeEmail(createdByObj?.email) ||
      null;
    const modifiedById = record._zoho_modified_by_id?.trim() || modifiedByObj?.id?.trim() || null;

    // Timestamps
    const createdAt = normalizeZohoTimestamp(record.Created_Time);
    const updatedAt = normalizeZohoTimestamp(record.Modified_Time, record.Created_Time);
    const modifiedAt = normalizeZohoTimestamp(record.Modified_Time, record.Created_Time);

    // Matching Visa Application
    const matchedVisaApp =
      (record.zoho_id ? visaAppMap.get(record.zoho_id) : null) ||
      (email ? visaAppMap.get(email) : null) ||
      null;

    // Matching Unified Entry
    const bestUnified = this.selectBestUnifiedEntry(
      unifiedEntries,
      email,
      phone,
      record.Created_Time,
    );

    // Destination Country Resolution
    const destinationCountry =
      type === 'leads'
        ? resolveLeadDestinationCountry(
            (record as MigratedLeadEntity).country_addressed,
            (record as MigratedLeadEntity).intended_country,
            matchedVisaApp?.Qualified_Country,
            bestUnified?.destinationCountry,
          )
        : resolveContactDestinationCountry(
            (record as MigratedContactEntity).country_finalised,
            (record as MigratedContactEntity).Country_Qualified_for,
            matchedVisaApp?.Qualified_Country,
            bestUnified?.destinationCountry,
          );

    // Interested Service Resolution
    const interestedService =
      type === 'leads'
        ? resolveInterestedServiceCascade(
            (record as MigratedLeadEntity).Service_Required1,
            matchedVisaApp?.Application_Stage,
            matchedVisaApp?.Selected_Visa_Type,
            bestUnified?.interestedService,
          )
        : resolveInterestedServiceCascade(
            (record as MigratedContactEntity).Service_Finalized,
            (record as MigratedContactEntity).Service_Required,
            matchedVisaApp?.Application_Stage,
            matchedVisaApp?.Selected_Visa_Type,
            bestUnified?.interestedService,
          );

    // Source & Source Details
    const sourceDetails = record.Lead_Source?.trim() || null;
    const source = normalizeEnquirySource(record.Lead_Source);

    // Attribution
    const attribution = this.buildAttribution(record, bestUnified);

    // Related Activity Lists
    const rawNotes = (record.zoho_id ? notesMap.get(record.zoho_id) : null) || [];
    const notes: NoteItemDto[] = rawNotes.map(n => {
      const title = n.Note_Title?.trim() || null;
      const content = n.Note_Content?.trim() || null;
      const cId = n._zoho_created_by_id?.trim() || null;
      const mId = n._zoho_modified_by_id?.trim() || null;
      const { parentType, parentZohoId } = resolveParentEntity(n);
      return new NoteItemDto({
        externalId: n.zoho_id || '',
        parentType,
        parentZohoId,
        title,
        content,
        createdByZohoId: cId,
        createdByEmail: cId ? (userMap.get(cId)?.email ?? null) : null,
        createdAt: normalizeZohoTimestamp(n.Created_Time),
        modifiedByZohoId: mId,
        modifiedByEmail: mId ? (userMap.get(mId)?.email ?? null) : null,
        modifiedAt: normalizeZohoTimestamp(n.Modified_Time, n.Created_Time),
      });
    });

    const rawCalls = (record.zoho_id ? callsMap.get(record.zoho_id) : null) || [];
    const calls: CallItemDto[] = rawCalls.map(c => {
      const direction = c.Call_Type?.toLowerCase().includes('inbound') ? 'inbound' : 'outbound';
      const durationSeconds =
        c.Call_Duration_in_seconds != null && !isNaN(c.Call_Duration_in_seconds)
          ? Math.max(0, Math.floor(c.Call_Duration_in_seconds))
          : 0;

      let callStatus: 'answered' | 'missed' | 'busy' | 'cancelled' = 'missed';
      if (durationSeconds > 0) {
        callStatus = 'answered';
      } else {
        const outStatus = c.Outgoing_Call_Status?.toLowerCase().trim();
        const res = c.Call_Result?.toLowerCase().trim();
        if (outStatus === 'cancelled' || (res && res.includes('cancelled'))) {
          callStatus = 'cancelled';
        } else if (res && (res.includes('busy') || res.includes('reachable'))) {
          callStatus = 'busy';
        }
      }

      const cId = c._zoho_created_by_id?.trim() || null;
      const mId = c._zoho_modified_by_id?.trim() || null;
      const oId = c._zoho_owner_id?.trim() || null;
      const { parentType, parentZohoId } = resolveParentEntity(c);

      const recording = c.Voice_Recording__s?.trim()
        ? new CallRecordingDto({ url: c.Voice_Recording__s.trim(), mimeType: '', sizeBytes: '' })
        : null;

      return new CallItemDto({
        externalId: c.zoho_id || '',
        parentType,
        parentZohoId,
        direction,
        status: callStatus,
        customerPhone: phone,
        agentEmail: oId ? (userMap.get(oId)?.email ?? null) : null,
        startedAt: normalizeZohoTimestamp(c.Call_Start_Time),
        durationSeconds,
        notes: c.Description?.trim() || null,
        followUpAt: c.When_To_Make_The_Call
          ? normalizeZohoTimestamp(c.When_To_Make_The_Call)
          : null,
        recording,
        createdByEmail: cId ? (userMap.get(cId)?.email ?? null) : null,
        createdByZohoId: cId,
        createdAt: normalizeZohoTimestamp(c.Created_Time),
        modifiedByEmail: mId ? (userMap.get(mId)?.email ?? null) : null,
        modifiedByZohoId: mId,
        modifiedAt: normalizeZohoTimestamp(c.Modified_Time, c.Created_Time),
      });
    });

    const rawTasks = (record.zoho_id ? tasksMap.get(record.zoho_id) : null) || [];
    const tasks: TaskItemDto[] = rawTasks.map(t => {
      const cId = t._zoho_created_by_id?.trim() || null;
      const mId = t._zoho_modified_by_id?.trim() || null;
      const oId = t._zoho_owner_id?.trim() || null;
      const { parentType, parentZohoId } = resolveParentEntity(t);
      return new TaskItemDto({
        externalId: t.zoho_id || '',
        parentType,
        parentZohoId,
        title: t.Subject?.trim() || '',
        description: t.Description?.trim() || null,
        status: normalizeTaskStatus(t.Status, t.is_closed),
        priority: normalizeTaskPriority(t.Priority),
        dueDate: t.Due_Date ? normalizeZohoTimestamp(t.Due_Date) : null,
        assigneeId: oId,
        assigneeEmail: oId ? (userMap.get(oId)?.email ?? null) : null,
        createdByZohoId: cId,
        createdByEmail: cId ? (userMap.get(cId)?.email ?? null) : null,
        createdAt: normalizeZohoTimestamp(t.Created_Time),
        modifiedByZohoId: mId,
        modifiedByEmail: mId ? (userMap.get(mId)?.email ?? null) : null,
        modifiedAt: normalizeZohoTimestamp(t.Modified_Time, t.Created_Time),
        completedAt: t.Closed_Time ? normalizeZohoTimestamp(t.Closed_Time) : null,
      });
    });

    const rawMeetings = (record.zoho_id ? meetingsMap.get(record.zoho_id) : null) || [];
    const meetings: MeetingItemDto[] = rawMeetings.map(m => {
      const meetingStatus = normalizeMeetingStatus(m.Meeting_Status, m.is_closed);
      const scheduledAt = normalizeZohoTimestamp(m.Start_DateTime);
      const endedAt = normalizeZohoTimestamp(m.End_DateTime);
      const startedAt = meetingStatus === 'ended' ? scheduledAt : null;
      const oId = m._zoho_owner_id?.trim() || null;
      const cId = m._zoho_created_by_id?.trim() || null;
      const mId = m._zoho_modified_by_id?.trim() || null;
      const { parentType, parentZohoId } = resolveParentEntity(m);

      const hostEmail = oId ? (userMap.get(oId)?.email ?? null) : null;
      const participants: MeetingParticipantDto[] = [];
      if (hostEmail) {
        participants.push(
          new MeetingParticipantDto({
            email: hostEmail,
            name: userMap.get(oId!)?.name || 'Staff Host',
            type: 'staff',
          }),
        );
      }
      if (email && email !== hostEmail) {
        participants.push(
          new MeetingParticipantDto({
            email,
            name: 'Client',
            type: 'guest',
          }),
        );
      }

      return new MeetingItemDto({
        externalId: m.zoho_id || '',
        parentType,
        parentZohoId,
        title: m.Event_Title?.trim() || '',
        description: m.Description?.trim() || null,
        status: meetingStatus,
        scheduledAt,
        startedAt,
        endedAt,
        hostEmail,
        hostId: oId,
        participants,
        recording: null,
        createdById: cId,
        createdByEmail: cId ? (userMap.get(cId)?.email ?? null) : null,
        modifiedAt: normalizeZohoTimestamp(m.Modified_Time, m.Created_Time),
        modifiedById: mId,
      });
    });

    const rawAttachments = (record.zoho_id ? attachmentsMap.get(record.zoho_id) : null) || [];
    const attachments: AttachmentItemDto[] = rawAttachments.map(a => {
      const fileName = a.File_Name || '';
      const resolvedUrl =
        presignedUrlMap.get(a.zoho_id) || a.r2_download_url || a.r2_preview_url || '';
      const cId = a._zoho_created_by_id?.trim() || a._zoho_owner_id?.trim() || null;
      const mId = a._zoho_modified_by_id?.trim() || null;
      const { parentType, parentZohoId } = resolveParentEntity(a);

      let sizeBytes = 0;
      if (typeof a.Size === 'number') {
        sizeBytes = a.Size;
      } else if (a.Size) {
        const parsed = parseInt(String(a.Size), 10);
        if (!isNaN(parsed) && parsed >= 0) {
          sizeBytes = parsed;
        }
      }

      const uploadedAt = normalizeZohoTimestamp(a.Created_Time);
      return new AttachmentItemDto({
        externalId: a.zoho_id || '',
        parentType,
        parentZohoId,
        url: resolvedUrl,
        fileName,
        mimeType: getMimeType(fileName || a.r2_key),
        sizeBytes,
        uploadedByEmail: cId ? (userMap.get(cId)?.email ?? null) : null,
        uploadedByZohoId: cId,
        uploadedAt,
        createdAt: uploadedAt,
        modifiedAt: normalizeZohoTimestamp(a.Modified_Time, a.Created_Time),
        modifiedByEmail: mId ? (userMap.get(mId)?.email ?? null) : null,
        modifiedByZohoId: mId,
      });
    });

    return new EnquiryItemDto({
      externalId: record.zoho_id,
      client,
      ownerEmail,
      interestedService,
      destinationCountry,
      source,
      sourceDetails,
      attribution,
      createdAt,
      updatedAt,
      createdById,
      createdByEmail,
      modifiedAt,
      modifiedById,
      notes,
      calls,
      tasks,
      meetings,
      attachments,
      invoices: [],
    });
  }
}
