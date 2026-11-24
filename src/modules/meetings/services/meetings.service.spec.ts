import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  MigratedEventEntity,
  MigratedMeetingRecordingEntity,
} from '../../../database/schema/index.js';
import type { R2StorageService } from '../../attachments/r2-storage.service.js';
import type { MeetingsRepository } from '../repositories/meetings.repository.js';
import { MeetingsService } from './meetings.service.js';

describe('MeetingsService', () => {
  let service: MeetingsService;
  let mockRepository: {
    findMeetings: ReturnType<typeof vi.fn>;
    batchResolveUsers: ReturnType<typeof vi.fn>;
    batchResolveStaffEmails: ReturnType<typeof vi.fn>;
    batchResolveCustomers: ReturnType<typeof vi.fn>;
    batchFindRecordings: ReturnType<typeof vi.fn>;
  };
  let mockR2StorageService: {
    generateDownloadUrlsBatch: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepository = {
      findMeetings: vi.fn(),
      batchResolveUsers: vi.fn(),
      batchResolveStaffEmails: vi.fn(),
      batchResolveCustomers: vi.fn(),
      batchFindRecordings: vi.fn(),
    };
    mockR2StorageService = {
      generateDownloadUrlsBatch: vi.fn(),
    };

    service = new MeetingsService(
      mockRepository as unknown as MeetingsRepository,
      mockR2StorageService as unknown as R2StorageService,
    );
  });

  describe('getMeetings', () => {
    it('should return empty list when no records match query', async () => {
      mockRepository.findMeetings.mockResolvedValue({ records: [], total: 0 });

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(200);
      expect(result.hasMore).toBe(false);
      expect(mockRepository.batchResolveUsers).not.toHaveBeenCalled();
      expect(mockR2StorageService.generateDownloadUrlsBatch).not.toHaveBeenCalled();
      expect(mockRepository.batchResolveCustomers).not.toHaveBeenCalled();
    });

    it('should skip batchResolveCustomers when meeting already contains customer email in participants', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_001',
        Event_Title: '  Initial Consultation  ',
        Description: '  Discussion regarding Australia 189 PR visa pathway.  ',
        Meeting_Status: 'Attended',
        is_closed: true,
        Start_DateTime: new Date('2024-03-04T11:00:00.000Z'),
        End_DateTime: new Date('2024-03-04T11:45:00.000Z'),
        Created_Time: new Date('2024-03-01T09:00:00.000Z'),
        Modified_Time: new Date('2024-03-04T12:00:00.000Z'),
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_123',
        _zoho_owner_id: 'user_host_1',
        _zoho_created_by_id: 'user_creator_1',
        _zoho_modified_by_id: 'user_modifier_1',
        Participants: [
          {
            participant: 'user_host_1',
            type: 'user',
            Email: 'host@worldvisa.in',
            name: 'Asha Host',
          },
          {
            participant: 'external_client_1',
            type: 'lead',
            Email: 'client@example.com',
            name: 'Jane Doe',
          },
        ],
      };

      const mockRecording: MigratedMeetingRecordingEntity = {
        zoho_event_id: 'event_001',
        recording_id: 'rec_001',
        resource_name: 'consultation_recording.mp4',
        r2_key: 'recordings/consultation_recording.mp4',
        file_size: 52428800,
        r2_download_url: 'https://r2.example.com/fallback.mp4',
      };

      mockRepository.findMeetings.mockResolvedValue({ records: [mockEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(
        new Map([
          ['user_host_1', { email: 'host@worldvisa.in', name: 'Asha Host' }],
          ['user_creator_1', { email: 'creator@worldvisa.in', name: 'Creator User' }],
          ['user_modifier_1', { email: 'modifier@worldvisa.in', name: 'Modifier User' }],
        ]),
      );
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set(['host@worldvisa.in']));
      mockRepository.batchFindRecordings.mockResolvedValue(new Map([['event_001', mockRecording]]));
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([
        'https://presigned.r2.example.com/consultation_recording.mp4?sig=abc',
      ]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      // Because customer was already present in Participants, customer lookup was skipped
      expect(mockRepository.batchResolveCustomers).not.toHaveBeenCalled();

      const meeting = result.data[0];
      expect(meeting.externalId).toBe('event_001');
      expect(meeting.parentType).toBe('lead');
      expect(meeting.parentZohoId).toBe('lead_123');
      expect(meeting.title).toBe('Initial Consultation');
      expect(meeting.description).toBe('Discussion regarding Australia 189 PR visa pathway.');
      expect(meeting.status).toBe('ended');
      expect(meeting.allDay).toBe(false);
      expect(meeting.scheduledAt).toBe('2024-03-04T11:00:00.000Z');
      expect(meeting.startedAt).toBe('2024-03-04T11:00:00.000Z');
      expect(meeting.endedAt).toBe('2024-03-04T11:45:00.000Z');
      expect(meeting.hostId).toBe('user_host_1');
      expect(meeting.hostEmail).toBe('host@worldvisa.in');
      expect(meeting.createdById).toBe('user_creator_1');
      expect(meeting.createdByEmail).toBe('creator@worldvisa.in');
      expect(meeting.createdAt).toBe('2024-03-01T09:00:00.000Z');
      expect(meeting.modifiedById).toBe('user_modifier_1');
      expect(meeting.modifiedAt).toBe('2024-03-04T12:00:00.000Z');

      // Participants: host (staff) and client (guest)
      expect(meeting.participants).toHaveLength(2);
      expect(meeting.participants[0]).toEqual({
        email: 'host@worldvisa.in',
        name: 'Asha Host',
        type: 'staff',
      });
      expect(meeting.participants[1]).toEqual({
        email: 'client@example.com',
        name: 'Jane Doe',
        type: 'guest',
      });

      // Recording
      expect(meeting.recording).toEqual({
        url: 'https://presigned.r2.example.com/consultation_recording.mp4?sig=abc',
        mimeType: 'video/mp4',
        sizeBytes: 52428800,
      });
    });

    it('should correctly set allDay to true when All_day is true', async () => {
      const mockAllDayEvent: MigratedEventEntity = {
        zoho_id: 'event_allday',
        Event_Title: 'Whole Day Workshop',
        All_day: true,
        Meeting_Status: 'Attended',
        is_closed: true,
        Start_DateTime: new Date('2024-03-04T00:00:00.000Z'),
        End_DateTime: new Date('2024-03-04T23:59:59.000Z'),
        Created_Time: new Date('2024-03-01T09:00:00.000Z'),
        Modified_Time: new Date('2024-03-04T12:00:00.000Z'),
      };
      mockRepository.findMeetings.mockResolvedValue({ records: [mockAllDayEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set());
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);
      mockRepository.batchResolveCustomers.mockResolvedValue(new Map());

      const result = await service.getMeetings({ page: 1, limit: 1 });
      expect(result.data[0].allDay).toBe(true);
    });

    it('should invoke batchResolveCustomers when meeting has only staff email (participant email count 1 and it is staff)', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_002',
        Event_Title: 'One-on-one call',
        Meeting_Status: 'Attended',
        is_closed: true,
        Start_DateTime: new Date('2024-03-05T10:00:00.000Z'),
        End_DateTime: new Date('2024-03-05T10:30:00.000Z'),
        Created_Time: new Date('2024-03-02T08:00:00.000Z'),
        _zoho_owner_id: 'user_host_2',
        _zoho_lead_id: 'lead_001',
        Participants: [], // Only host email (count = 1, is staff)
      };

      mockRepository.findMeetings.mockResolvedValue({ records: [mockEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(
        new Map([['user_host_2', { email: 'staff2@worldvisa.in', name: 'Staff Two' }]]),
      );
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set(['staff2@worldvisa.in']));
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockRepository.batchResolveCustomers.mockResolvedValue(
        new Map([['event_002', { email: 'leadclient@gmail.com', name: 'Lead Client' }]]),
      );
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(mockRepository.batchResolveCustomers).toHaveBeenCalledWith([mockEvent]);
      expect(result.data).toHaveLength(1);
      const meeting = result.data[0];
      expect(meeting.participants).toHaveLength(2);
      expect(meeting.participants[0]).toEqual({
        email: 'staff2@worldvisa.in',
        name: 'Staff Two',
        type: 'staff',
      });
      expect(meeting.participants[1]).toEqual({
        email: 'leadclient@gmail.com',
        name: 'Lead Client',
        type: 'guest',
      });
      expect(meeting.recording).toBeNull();
    });

    it('should invoke batchResolveCustomers when participant email count is 0 (no host email, empty participants)', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_no_emails',
        Event_Title: 'No Host Email Call',
        is_closed: true,
        Start_DateTime: new Date('2024-03-05T10:00:00.000Z'),
        End_DateTime: new Date('2024-03-05T10:30:00.000Z'),
        Created_Time: new Date('2024-03-02T08:00:00.000Z'),
        _zoho_visa_application_id: 'visa_001',
        Participants: [],
      };

      mockRepository.findMeetings.mockResolvedValue({ records: [mockEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set());
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockRepository.batchResolveCustomers.mockResolvedValue(
        new Map([['event_no_emails', { email: 'applicant@gmail.com', name: 'Visa Applicant' }]]),
      );
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(mockRepository.batchResolveCustomers).toHaveBeenCalledWith([mockEvent]);
      expect(result.data[0].participants).toHaveLength(1);
      expect(result.data[0].participants[0]).toEqual({
        email: 'applicant@gmail.com',
        name: 'Visa Applicant',
        type: 'guest',
      });
    });

    it('should handle scheduled and cancelled status with null startedAt', async () => {
      const mockEvents: MigratedEventEntity[] = [
        {
          zoho_id: 'event_scheduled',
          Event_Title: 'Upcoming Meeting',
          is_closed: false,
          Start_DateTime: new Date('2026-12-01T10:00:00.000Z'),
          End_DateTime: new Date('2026-12-01T10:30:00.000Z'),
          Created_Time: new Date('2026-11-01T08:00:00.000Z'),
          _zoho_owner_id: 'user_host_3',
        },
        {
          zoho_id: 'event_cancelled',
          Event_Title: 'Cancelled Meeting',
          Meeting_Status: 'Postponed',
          is_closed: true,
          Start_DateTime: new Date('2024-02-01T10:00:00.000Z'),
          End_DateTime: new Date('2024-02-01T10:30:00.000Z'),
          Created_Time: new Date('2024-01-20T08:00:00.000Z'),
          _zoho_owner_id: 'user_host_3',
        },
      ];

      mockRepository.findMeetings.mockResolvedValue({ records: mockEvents, total: 2 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set());
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockRepository.batchResolveCustomers.mockResolvedValue(new Map());
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].status).toBe('scheduled');
      expect(result.data[0].startedAt).toBeNull();

      expect(result.data[1].status).toBe('cancelled');
      expect(result.data[1].startedAt).toBeNull();
    });

    it('should fallback modifiedAt to Created_Time when Modified_Time is null', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_no_mod',
        Event_Title: 'Meeting Without Modified Time',
        is_closed: true,
        Start_DateTime: new Date('2024-03-01T10:00:00.000Z'),
        End_DateTime: new Date('2024-03-01T10:30:00.000Z'),
        Created_Time: new Date('2024-03-01T08:00:00.000Z'),
        Modified_Time: undefined,
      };

      mockRepository.findMeetings.mockResolvedValue({ records: [mockEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchResolveStaffEmails.mockResolvedValue(new Set());
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockRepository.batchResolveCustomers.mockResolvedValue(new Map());
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      expect(result.data[0].modifiedAt).toBe('2024-03-01T08:00:00.000Z');
    });

    it('should classify attendee with email matching staff email set as staff', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_colleague',
        Event_Title: 'Internal Team Sync',
        is_closed: true,
        Start_DateTime: new Date('2024-03-01T10:00:00.000Z'),
        End_DateTime: new Date('2024-03-01T10:30:00.000Z'),
        Created_Time: new Date('2024-03-01T08:00:00.000Z'),
        _zoho_owner_id: 'host_1',
        Participants: [
          {
            Email: 'colleague@worldvisa.in',
            name: 'Colleague Name',
          },
        ],
      };

      mockRepository.findMeetings.mockResolvedValue({ records: [mockEvent], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(
        new Map([['host_1', { email: 'host@worldvisa.in', name: 'Host Staff' }]]),
      );
      mockRepository.batchResolveStaffEmails.mockResolvedValue(
        new Set(['host@worldvisa.in', 'colleague@worldvisa.in']),
      );
      mockRepository.batchFindRecordings.mockResolvedValue(new Map());
      mockRepository.batchResolveCustomers.mockResolvedValue(new Map());
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([]);

      const result = await service.getMeetings({ page: 1, limit: 200 });

      const participants = result.data[0].participants;
      expect(participants).toHaveLength(2);
      expect(participants[0].type).toBe('staff');
      expect(participants[1].email).toBe('colleague@worldvisa.in');
      expect(participants[1].type).toBe('staff');
    });
  });
});
