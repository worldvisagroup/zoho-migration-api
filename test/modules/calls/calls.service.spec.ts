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
        url: 'https://files.example.com/call_101.mp3',
        mimeType: '',
        sizeBytes: '',
      });
      expect(call.createdByEmail).toBe('creator@worldvisa.in');
      expect(call.createdByZohoId).toBe('user_creator');
      expect(call.modifiedByEmail).toBe('modifier@worldvisa.in');
      expect(call.modifiedByZohoId).toBe('user_modifier');
      expect(call.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(call.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
    });

    it('should set recording to null when Voice_Recording__s is empty or missing', async () => {
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
      expect(result.data[0]!.recording).toBeNull();
      expect(result.data[0]!.followUpAt).toBeNull();
      expect(result.data[0]!.notes).toBeNull();
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
    it('should resolve answered when duration is greater than 0', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 60,
        }),
      ).toBe('answered');
    });

    it('should resolve cancelled when Outgoing_Call_Status is Cancelled', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
          Outgoing_Call_Status: 'Cancelled',
        }),
      ).toBe('cancelled');
    });

    it('should resolve busy when Call_Result indicates busy or unreachable', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
          Call_Result: 'No response/Busy',
        }),
      ).toBe('busy');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
          Call_Result: 'Number Not Reachable',
        }),
      ).toBe('busy');
    });

    it('should resolve missed when duration is 0 and no busy/cancelled indicator', () => {
      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
          Call_Type: 'Missed',
        }),
      ).toBe('missed');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
          Call_Result: 'Ringing Not Answering',
        }),
      ).toBe('missed');

      expect(
        service.resolveStatus({
          zoho_id: '1',
          is_closed: true,
          Call_Duration_in_seconds: 0,
        }),
      ).toBe('missed');
    });
  });

  describe('resolveRecording', () => {
    it('should return recording object with url and empty strings for mimeType and sizeBytes', () => {
      const rec = service.resolveRecording('  https://audio.example.com/rec.mp3  ');
      expect(rec).toEqual({
        url: 'https://audio.example.com/rec.mp3',
        mimeType: '',
        sizeBytes: '',
      });
    });

    it('should return null when url is empty or null', () => {
      expect(service.resolveRecording(null)).toBeNull();
      expect(service.resolveRecording('')).toBeNull();
      expect(service.resolveRecording('   ')).toBeNull();
    });
  });
});
