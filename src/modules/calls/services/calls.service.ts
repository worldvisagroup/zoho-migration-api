import { Injectable } from '@nestjs/common';
import {
  normalizeZohoTimestamp,
  resolveParentEntity,
} from '../../../common/utils/index.js';
import type { MigratedCallEntity } from '../../../database/schema/index.js';
import {
  CallDirection,
  CallItemDto,
  CallRecordingDto,
  CallsResponseDto,
  CallStatus,
  QueryCallsDto,
} from '../dto/index.js';
import { CallsRepository } from '../repositories/calls.repository.js';
import { resolveCallStatus } from '../utils/index.js';

@Injectable()
export class CallsService {
  constructor(private readonly callsRepository: CallsRepository) { }

  /**
   * Fetches, normalizes, and transforms calls into standardized migration records.
   *
   * @param query - Validated query parameters
   * @returns {Promise<CallsResponseDto>} Paginated calls migration response
   */
  async getCalls(query: QueryCallsDto): Promise<CallsResponseDto> {
    const { page = 1, limit = 200 } = query;

    const { records, total } = await this.callsRepository.findCalls(query);

    if (records.length === 0) {
      return new CallsResponseDto([], total, page, limit);
    }

    // Single-pass batch lookup for customer phone numbers
    const phoneMap = await this.callsRepository.batchResolveCustomerPhones(records);

    // Collect all unique user IDs for agent, creator, modifier
    const uniqueUserIds = new Set<string>();
    for (const record of records) {
      if (record._zoho_owner_id) {
        uniqueUserIds.add(record._zoho_owner_id);
      }
      if (record._zoho_created_by_id) {
        uniqueUserIds.add(record._zoho_created_by_id);
      }
      if (record._zoho_modified_by_id) {
        uniqueUserIds.add(record._zoho_modified_by_id);
      }
    }

    // Batch resolve user emails
    const emailMap = await this.callsRepository.batchResolveUserEmails(Array.from(uniqueUserIds));

    const transformedCalls: CallItemDto[] = records.map(record =>
      this.transformRecordToCall(record, phoneMap, emailMap),
    );

    return new CallsResponseDto(transformedCalls, total, page, limit);
  }

  /**
   * Resolves call direction from Zoho Call_Type.
   * - Inbound -> inbound
   * - Missed -> inbound (inbound customer call that was unanswered)
   * - Outbound -> outbound
   * - Default -> outbound
   */
  resolveDirection(callTypeRaw?: string | null): CallDirection {
    if (!callTypeRaw) {
      return 'outbound';
    }

    const normalized = callTypeRaw.trim().toLowerCase();
    if (normalized === 'inbound' || normalized === 'missed') {
      return 'inbound';
    }

    return 'outbound';
  }

  /**
   * Deterministically resolves call status:
   * - Duration > 0 -> answered
   * - Duration <= 0 (or null):
   *   - Completed -> answered
   *   - Overdue -> overdue
   *   - Cancelled -> cancelled
   *   - Scheduled: future Call_Start_Time -> scheduled, past or missing -> overdue
   *   - null / empty status: future Call_Start_Time -> scheduled, past or missing -> overdue
   */
  resolveStatus(call: MigratedCallEntity): CallStatus {
    return resolveCallStatus(
      call.Call_Duration_in_seconds,
      call.Outgoing_Call_Status,
      call.Call_Start_Time,
    );
  }

  /**
   * Resolves recording information.
   * Always returns { url: null, mimeType: null, sizeBytes: null } because Zoho CRM PhoneBridge
   * audio URLs cannot be accessed or streamed outside the authenticated CRM domain.
   */
  resolveRecording(_recordingUrlRaw?: string | null): CallRecordingDto {
    return new CallRecordingDto({
      url: null,
      mimeType: null,
      sizeBytes: null,
    });
  }

  /**
   * Transforms a single MigratedCallEntity into a CallItemDto.
   */
  private transformRecordToCall(
    call: MigratedCallEntity,
    phoneMap: Map<string, string | null>,
    emailMap: Map<string, string>,
  ): CallItemDto {
    const direction = this.resolveDirection(call.Call_Type);
    const status = this.resolveStatus(call);

    const customerPhone = phoneMap.get(call.zoho_id) ?? null;

    const agentEmail =
      call._zoho_owner_id && emailMap.has(call._zoho_owner_id)
        ? emailMap.get(call._zoho_owner_id)!
        : null;

    const createdByZohoId = call._zoho_created_by_id?.trim() || null;
    const createdByEmail = createdByZohoId ? (emailMap.get(createdByZohoId) ?? null) : null;

    const modifiedByZohoId = call._zoho_modified_by_id?.trim() || null;
    const modifiedByEmail = modifiedByZohoId ? (emailMap.get(modifiedByZohoId) ?? null) : null;

    const startedAt = normalizeZohoTimestamp(call.Call_Start_Time);
    const createdAt = normalizeZohoTimestamp(call.Created_Time);
    const modifiedAt = normalizeZohoTimestamp(call.Modified_Time, call.Created_Time);

    const durationSeconds =
      call.Call_Duration_in_seconds != null && !isNaN(call.Call_Duration_in_seconds)
        ? Math.max(0, Math.floor(call.Call_Duration_in_seconds))
        : 0;

    const notes = call.Description && call.Description.trim() ? call.Description.trim() : null;

    const followUpAt = call.When_To_Make_The_Call
      ? normalizeZohoTimestamp(call.When_To_Make_The_Call)
      : null;

    const recording = this.resolveRecording(call.Voice_Recording__s);
    const { parentType, parentZohoId } = resolveParentEntity(call);

    return new CallItemDto({
      externalId: call.zoho_id || '',
      parentType,
      parentZohoId,
      direction,
      status,
      customerPhone,
      agentEmail,
      startedAt,
      durationSeconds,
      notes,
      followUpAt,
      recording,
      createdByEmail,
      createdByZohoId,
      createdAt,
      modifiedByEmail,
      modifiedByZohoId,
      modifiedAt,
    });
  }
}
