import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CallsService } from '../../../src/modules/calls/services/calls.service.js';
import type { CallsRepository } from '../../../src/modules/calls/repositories/calls.repository.js';
import type { MigratedCallEntity } from '../../../src/database/schema/index.js';

describe('CallsService', () => {
  let service: CallsService;
  let mockRepo: {
    findCalls: ReturnType<typeof vi.fn>;
    batchResolveCustomerPhones: ReturnType<typeof vi.fn>;
    batchResolveUserEmails: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepo = {
      findCalls: vi.fn(),
      batchResolveCustomerPhones: vi.fn(),
      batchResolveUserEmails: vi.fn(),
    };

    service = new CallsService(mockRepo as unknown as CallsRepository);
  });

  describe('getCalls', () => {
    it('should fetch, transform calls with resolved phone, agent email, and recording metadata', async () => {
      const mockCall: MigratedCallEntity = {
        zoho_id: 'call_101',
        _zoho_lead_id: 'lead_001',
        parent_entity_type: 'lead',
        Call_Type: 'Outbound',
        Call_Start_Time: new Date('2024-03-02T10:00:00.000Z'),
        Call_Duration_in_seconds: 120,
        Description: 'Discussed documents.',
        When_To_Make_The_Call: new Date('2024-03-10T15:00:00.000Z'),
        Voice_Recording__s: 'https://files.example.com/call_101.mp3',
        _zoho_owner_id: 'user_agent',
        _zoho_created_by_id: 'user_creator',
        _zoho_modified_by_id: 'user_modifier',
        Created_Time: new Date('2024-03-02T10:00:00.000Z'),
        Modified_Time: new Date('2024-03-05T12:00:00.000Z'),
        is_closed: true,
      };

      mockRepo.findCalls.mockResolvedValue({
        records: [mockCall],
        total: 500,
      });

      const phoneMap = new Map<string, string>([['call_101', '+919876543210']]);
      mockRepo.batchResolveCustomerPhones.mockResolvedValue(phoneMap);

      const emailMap = new Map<string, string>([
        ['user_agent', 'agent@worldvisa.in'],
        ['user_creator', 'creator@worldvisa.in'],
        ['user_modifier', 'modifier@worldvisa.in'],
      ]);
      mockRepo.batchResolveUserEmails.mockResolvedValue(emailMap);

      const result = await service.getCalls({
        page: 1,
        limit: 200,
        type: 'lead',
        zohoLeadId: 'lead_001',
      });

      expect(mockRepo.findCalls).toHaveBeenCalledWith({
        page: 1,
        limit: 200,
        type: 'lead',
        zohoLeadId: 'lead_001',
      });

      expect(result.total).toBe(500);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(200);
      expect(result.hasMore).toBe(true);
      expect(result.data).toHaveLength(1);

      const call = result.data[0]!;
      expect(call.externalId).toBe('call_101');
      expect(call.parentType).toBe('lead');
      expect(call.parentZohoId).toBe('lead_001');
      expect(call.direction).toBe('outbound');
      expect(call.status).toBe('answered');
      expect(call.customerPhone).toBe('+919876543210');
      expect(call.agentEmail).toBe('agent@worldvisa.in');
      expect(call.startedAt).toBe('2024-03-02T10:00:00.000Z');
      expect(call.durationSeconds).toBe(120);
      expect(call.notes).toBe('Discussed documents.');
      expect(call.followUpAt).toBe('2024-03-10T15:00:00.000Z');
      expect(call.recording).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
      expect(call.createdByEmail).toBe('creator@worldvisa.in');
      expect(call.createdByZohoId).toBe('user_creator');
      expect(call.modifiedByEmail).toBe('modifier@worldvisa.in');
      expect(call.modifiedByZohoId).toBe('user_modifier');
      expect(call.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(call.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
    });

    it('should set recording to null fields even when Voice_Recording__s is empty or missing', async () => {
      const mockCall: MigratedCallEntity = {
        zoho_id: 'call_102',
        Call_Type: 'Outbound',
        Call_Duration_in_seconds: 45,
        is_closed: true,
      };

      mockRepo.findCalls.mockResolvedValue({
        records: [mockCall],
        total: 1,
      });
      mockRepo.batchResolveCustomerPhones.mockResolvedValue(new Map());
      mockRepo.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getCalls({ page: 1, limit: 10 });
      expect(result.data[0]!.customerPhone).toBeNull();
      expect(result.data[0]!.recording).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
      expect(result.data[0]!.followUpAt).toBeNull();
      expect(result.data[0]!.notes).toBeNull();
    });

    it('should forward updatedSince parameter to repository', async () => {
      mockRepo.findCalls.mockResolvedValue({ records: [], total: 0 });
      mockRepo.batchResolveCustomerPhones.mockResolvedValue(new Map());
      mockRepo.batchResolveUserEmails.mockResolvedValue(new Map());

      await service.getCalls({
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });

      expect(mockRepo.findCalls).toHaveBeenCalledWith({
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should set hasMore to false on the final page', async () => {
      mockRepo.findCalls.mockResolvedValue({
        records: [],
        total: 150,
      });
      mockRepo.batchResolveCustomerPhones.mockResolvedValue(new Map());
      mockRepo.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getCalls({
        page: 1,
        limit: 200,
      });

      expect(result.hasMore).toBe(false);
      expect(result.data).toEqual([]);
    });
  });

  describe('resolveDirection', () => {
    it('should map Inbound to inbound', () => {
      expect(service.resolveDirection('Inbound')).toBe('inbound');
      expect(service.resolveDirection('inbound')).toBe('inbound');
    });

    it('should map Missed to inbound', () => {
      expect(service.resolveDirection('Missed')).toBe('inbound');
      expect(service.resolveDirection('missed')).toBe('inbound');
    });

    it('should map Outbound to outbound', () => {
      expect(service.resolveDirection('Outbound')).toBe('outbound');
      expect(service.resolveDirection('outbound')).toBe('outbound');
    });

    it('should default missing or null values to outbound', () => {
      expect(service.resolveDirection(null)).toBe('outbound');
      expect(service.resolveDirection(undefined)).toBe('outbound');
      expect(service.resolveDirection('')).toBe('outbound');
    });
  });

  describe('resolveStatus', () => {
    const futureDate = new Date(Date.now() + 86400000);
    const pastDate = new Date(Date.now() - 86400000);

    it('should resolve answered when duration is greater than 0', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 60,
          Outgoing_Call_Status: 'Overdue',
        }),
      ).toBe('answered');
    });

    it('should resolve answered when Outgoing_Call_Status is Completed even if duration is 0 or null', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Completed',
        }),
      ).toBe('answered');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: undefined,
          Outgoing_Call_Status: 'completed',
        }),
      ).toBe('answered');
    });

    it('should resolve overdue when Outgoing_Call_Status is Overdue', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Overdue',
        }),
      ).toBe('overdue');
    });

    it('should resolve cancelled when Outgoing_Call_Status is Cancelled', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Cancelled',
        }),
      ).toBe('cancelled');
    });

    it('should resolve scheduled for Scheduled status when Call_Start_Time is in the future', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Scheduled',
          Call_Start_Time: futureDate,
        }),
      ).toBe('scheduled');
    });

    it('should resolve overdue for Scheduled status when Call_Start_Time is in the past or missing', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Scheduled',
          Call_Start_Time: pastDate,
        }),
      ).toBe('overdue');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Scheduled',
        }),
      ).toBe('overdue');
    });

    it('should resolve scheduled for null status when Call_Start_Time is in the future', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Call_Start_Time: futureDate,
        }),
      ).toBe('scheduled');
    });

    it('should resolve overdue for null status when Call_Start_Time is in the past or missing', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
          Call_Start_Time: pastDate,
        }),
      ).toBe('overdue');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          Call_Duration_in_seconds: 0,
        }),
      ).toBe('overdue');
    });
  });

  describe('resolveRecording', () => {
    it('should always return recording object with null url, mimeType, and sizeBytes regardless of input', () => {
      expect(service.resolveRecording('  https://audio.example.com/rec.mp3  ')).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
      expect(service.resolveRecording(null)).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
      expect(service.resolveRecording('')).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
      expect(service.resolveRecording('   ')).toEqual({
        url: null,
        mimeType: null,
        sizeBytes: null,
      });
    });
  });
});
