import { beforeEach, describe, expect, it, vi } from 'vitest';
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
import type { R2StorageService } from '../../attachments/r2-storage.service.js';
import { EnquiryType } from '../dto/index.js';
import type { EnquiriesRepository } from '../repositories/enquiries.repository.js';
import { EnquiriesService } from './enquiries.service.js';

describe('EnquiriesService', () => {
  let service: EnquiriesService;
  let mockRepository: {
    findEnquiries: ReturnType<typeof vi.fn>;
    batchResolveUsers: ReturnType<typeof vi.fn>;
    batchFindVisaApplications: ReturnType<typeof vi.fn>;
    batchFindUnifiedEntries: ReturnType<typeof vi.fn>;
    batchFindNotes: ReturnType<typeof vi.fn>;
    batchFindCalls: ReturnType<typeof vi.fn>;
    batchFindTasks: ReturnType<typeof vi.fn>;
    batchFindMeetings: ReturnType<typeof vi.fn>;
    batchFindAttachments: ReturnType<typeof vi.fn>;
  };
  let mockR2StorageService: {
    generateDownloadUrlsBatch: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepository = {
      findEnquiries: vi.fn(),
      batchResolveUsers: vi.fn(),
      batchFindVisaApplications: vi.fn(),
      batchFindUnifiedEntries: vi.fn(),
      batchFindNotes: vi.fn(),
      batchFindCalls: vi.fn(),
      batchFindTasks: vi.fn(),
      batchFindMeetings: vi.fn(),
      batchFindAttachments: vi.fn(),
    };
    mockR2StorageService = {
      generateDownloadUrlsBatch: vi.fn(),
    };

    service = new EnquiriesService(
      mockRepository as unknown as EnquiriesRepository,
      mockR2StorageService as unknown as R2StorageService,
    );
  });

  describe('getEnquiries', () => {
    it('should return empty list when no records match query', async () => {
      mockRepository.findEnquiries.mockResolvedValue({ records: [], total: 0 });

      const result = await service.getEnquiries({ type: EnquiryType.LEADS, page: 1, limit: 200 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(200);
      expect(result.hasMore).toBe(false);
      expect(mockRepository.batchResolveUsers).not.toHaveBeenCalled();
      expect(mockRepository.batchFindUnifiedEntries).not.toHaveBeenCalled();
    });

    it('should transform lead enquiries with complete cascade and related activities', async () => {
      const createdDate = new Date('2024-03-01T10:00:00.000Z');
      const mockLead: MigratedLeadEntity = {
        zoho_id: 'lead_100',
        Email: 'jane@example.com',
        Phone: '9876543210',
        Country_Code: 'IN',
        Owner: { id: 'user_owner_1', name: 'Asha K', email: 'asha@example.com' },
        Created_By: { id: 'user_owner_1', name: 'Asha K', email: 'asha@example.com' },
        Modified_By: { id: 'user_owner_1', name: 'Asha K', email: 'asha@example.com' },
        country_addressed: 'Australia',
        intended_country: ['Canada'],
        Service_Required1: 'Australia PR',
        Lead_Source: 'Meta Ads',
        Created_Time: createdDate,
        Modified_Time: new Date('2024-03-02T10:00:00.000Z'),
      };

      const mockUnifiedEntry: UnifiedEntry = {
        entryId: 'entry_abc',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+919876543210',
        consent: true,
        destinationCountry: 'Australia',
        interestedService: 'permanent_residency',
        attribution: {
          campaignName: 'AU PR Campaign',
          utmSource: 'meta_ads',
          utmMedium: 'cpc',
        },
        zohoMetadata: {
          addedTime: new Date('2024-03-01T10:05:00.000Z'),
        },
      };

      const mockNote: MigratedNoteEntity = {
        zoho_id: 'note_1',
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_100',
        Note_Title: 'First call summary',
        Note_Content: 'Client interested in 189 visa',
        Created_Time: new Date('2024-03-01T11:00:00.000Z'),
        Modified_Time: new Date('2024-03-01T11:00:00.000Z'),
        _zoho_owner_id: 'user_owner_1',
      };

      const mockCall: MigratedCallEntity = {
        zoho_id: 'call_1',
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_100',
        Subject: 'Initial screening',
        Call_Duration: '05:30',
        Call_Start_Time: new Date('2024-03-01T10:30:00.000Z'),
        Created_Time: new Date('2024-03-01T10:30:00.000Z'),
        Modified_Time: new Date('2024-03-01T10:35:00.000Z'),
        _zoho_owner_id: 'user_owner_1',
      };

      const mockTask: MigratedTaskEntity = {
        zoho_id: 'task_1',
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_100',
        Subject: 'Collect IELTS score',
        Status: 'In Progress',
        Priority: 'High',
        Created_Time: new Date('2024-03-01T12:00:00.000Z'),
        Modified_Time: new Date('2024-03-01T12:00:00.000Z'),
        _zoho_owner_id: 'user_owner_1',
      };

      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_1',
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_100',
        Event_Title: 'Eligibility counseling',
        Meeting_Status: 'Attended',
        Start_DateTime: new Date('2024-03-02T11:00:00.000Z'),
        End_DateTime: new Date('2024-03-02T11:30:00.000Z'),
        Created_Time: new Date('2024-03-01T14:00:00.000Z'),
        Modified_Time: new Date('2024-03-02T12:00:00.000Z'),
        _zoho_owner_id: 'user_owner_1',
      };

      const mockAttachment: MigratedAttachmentEntity = {
        zoho_id: 'att_1',
        parent_entity_type: 'lead',
        _zoho_lead_id: 'lead_100',
        File_Name: 'resume.pdf',
        Size: 2048,
        r2_key: 'attachments/lead_100/resume.pdf',
        Created_Time: new Date('2024-03-01T10:10:00.000Z'),
        Modified_Time: new Date('2024-03-01T10:10:00.000Z'),
        _zoho_created_by_id: 'user_owner_1',
      };

      mockRepository.findEnquiries.mockResolvedValue({ records: [mockLead], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(
        new Map([['user_owner_1', { email: 'asha@example.com', name: 'Asha K' }]]),
      );
      mockRepository.batchFindVisaApplications.mockResolvedValue(new Map());
      mockRepository.batchFindUnifiedEntries.mockResolvedValue([mockUnifiedEntry]);
      mockRepository.batchFindNotes.mockResolvedValue(new Map([['lead_100', [mockNote]]]));
      mockRepository.batchFindCalls.mockResolvedValue(new Map([['lead_100', [mockCall]]]));
      mockRepository.batchFindTasks.mockResolvedValue(new Map([['lead_100', [mockTask]]]));
      mockRepository.batchFindMeetings.mockResolvedValue(new Map([['lead_100', [mockEvent]]]));
      mockRepository.batchFindAttachments.mockResolvedValue(
        new Map([['lead_100', [mockAttachment]]]),
      );
      mockR2StorageService.generateDownloadUrlsBatch.mockResolvedValue([
        'https://signed.r2.cloud/resume.pdf',
      ]);

      const result = await service.getEnquiries({ type: EnquiryType.LEADS, page: 1, limit: 10 });

      expect(result.data.length).toBe(1);
      const enquiry = result.data[0];
      expect(enquiry.externalId).toBe('lead_100');
      expect(enquiry.client).toEqual({
        email: 'jane@example.com',
        phone: '+919876543210',
      });
      expect(enquiry.ownerEmail).toBe('asha@example.com');
      expect(enquiry.destinationCountry).toBe('Australia');
      expect(enquiry.interestedService).toBe('permanent_residency');
      expect(enquiry.source).toBe('meta_ads');
      expect(enquiry.sourceDetails).toBe('Meta Ads');
      expect(enquiry.attribution?.campaignName).toBe('AU PR Campaign');
      expect(enquiry.notes.length).toBe(1);
      expect(enquiry.notes[0].parentType).toBe('lead');
      expect(enquiry.notes[0].parentZohoId).toBe('lead_100');
      expect(enquiry.notes[0].title).toBe('First call summary');
      expect(enquiry.notes[0].content).toBe('Client interested in 189 visa');
      expect(enquiry.calls.length).toBe(1);
      expect(enquiry.calls[0].parentType).toBe('lead');
      expect(enquiry.calls[0].parentZohoId).toBe('lead_100');
      expect(enquiry.tasks.length).toBe(1);
      expect(enquiry.tasks[0].parentType).toBe('lead');
      expect(enquiry.tasks[0].parentZohoId).toBe('lead_100');
      expect(enquiry.meetings.length).toBe(1);
      expect(enquiry.meetings[0].parentType).toBe('lead');
      expect(enquiry.meetings[0].parentZohoId).toBe('lead_100');
      expect(enquiry.attachments.length).toBe(1);
      expect(enquiry.attachments[0].parentType).toBe('lead');
      expect(enquiry.attachments[0].parentZohoId).toBe('lead_100');
      expect(enquiry.attachments[0].url).toBe('https://signed.r2.cloud/resume.pdf');
      expect(enquiry.invoices).toEqual([]);
      expect(enquiry.createdById).toBe('user_owner_1');
      expect(enquiry.createdByEmail).toBe('asha@example.com');
    });

    it('should transform contact enquiries with contact cascading priority', async () => {
      const mockContact: MigratedContactEntity = {
        zoho_id: 'contact_200',
        Email: 'alex@example.com',
        Phone: '9876543211',
        Country_Code: 'IN',
        country_finalised: 'Canada',
        Country_Qualified_for: 'Australia',
        Service_Finalized: 'Canada PR',
        Lead_Source: 'Google Ads',
        Created_Time: new Date('2024-02-01T10:00:00.000Z'),
        Modified_Time: new Date('2024-02-01T10:00:00.000Z'),
        Owner: { id: 'user_owner_2', name: 'Bob M', email: 'bob@example.com' },
      };

      const mockVisaApp: MigratedVisaApplicationEntity = {
        _id: 'va_200',
        _zoho_contact_id: 'contact_200',
        Qualified_Country: 'Germany',
        Service_Required: 'Job Seeker Visa',
      };

      mockRepository.findEnquiries.mockResolvedValue({ records: [mockContact], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(
        new Map([['user_owner_2', { email: 'bob@example.com', name: 'Bob M' }]]),
      );
      mockRepository.batchFindVisaApplications.mockResolvedValue(
        new Map([['contact_200', mockVisaApp]]),
      );
      mockRepository.batchFindUnifiedEntries.mockResolvedValue([]);
      mockRepository.batchFindNotes.mockResolvedValue(new Map());
      mockRepository.batchFindCalls.mockResolvedValue(new Map());
      mockRepository.batchFindTasks.mockResolvedValue(new Map());
      mockRepository.batchFindMeetings.mockResolvedValue(new Map());
      mockRepository.batchFindAttachments.mockResolvedValue(new Map());

      const result = await service.getEnquiries({
        type: EnquiryType.CONTACTS,
        page: 1,
        limit: 10,
      });

      expect(result.data.length).toBe(1);
      const enquiry = result.data[0];
      expect(enquiry.externalId).toBe('contact_200');
      // country_finalised takes top priority for contacts
      expect(enquiry.destinationCountry).toBe('Canada');
      // Service_Finalized takes top priority for contacts
      expect(enquiry.interestedService).toBe('permanent_residency');
      expect(enquiry.source).toBe('google_ads');
      expect(enquiry.invoices).toEqual([]);
    });

    it('should select unified entry that minimizes delta t to Created_Time', async () => {
      const createdTime = new Date('2024-03-01T12:00:00.000Z');
      const mockLead: MigratedLeadEntity = {
        zoho_id: 'lead_300',
        Email: 'multi@example.com',
        Phone: '9888888888',
        Created_Time: createdTime,
      };

      const farEntry: UnifiedEntry = {
        entryId: 'entry_far',
        fullName: 'Multi Submission',
        email: 'multi@example.com',
        phone: '+919888888888',
        consent: true,
        destinationCountry: 'United Kingdom',
        zohoMetadata: { addedTime: new Date('2024-02-01T12:00:00.000Z') }, // 1 month prior
      };

      const closeEntry: UnifiedEntry = {
        entryId: 'entry_close',
        fullName: 'Multi Submission',
        email: 'multi@example.com',
        phone: '+919888888888',
        consent: true,
        destinationCountry: 'Australia',
        zohoMetadata: { addedTime: new Date('2024-03-01T12:02:00.000Z') }, // 2 minutes later
      };

      mockRepository.findEnquiries.mockResolvedValue({ records: [mockLead], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchFindVisaApplications.mockResolvedValue(new Map());
      mockRepository.batchFindUnifiedEntries.mockResolvedValue([farEntry, closeEntry]);
      mockRepository.batchFindNotes.mockResolvedValue(new Map());
      mockRepository.batchFindCalls.mockResolvedValue(new Map());
      mockRepository.batchFindTasks.mockResolvedValue(new Map());
      mockRepository.batchFindMeetings.mockResolvedValue(new Map());
      mockRepository.batchFindAttachments.mockResolvedValue(new Map());

      const result = await service.getEnquiries({ type: EnquiryType.LEADS, page: 1, limit: 10 });
      const enquiry = result.data[0];

      // Destination country falls back to unifiedEntry since lead has neither country_addressed nor intended_country
      expect(enquiry.destinationCountry).toBe('Australia');
    });

    it('should return null when phone is missing or unparseable', async () => {
      const mockLead: MigratedLeadEntity = {
        zoho_id: 'lead_no_phone',
        Email: 'nophone@example.com',
        Phone: null,
        Mobile: null,
        Created_Time: new Date('2024-01-01T00:00:00.000Z'),
      };

      mockRepository.findEnquiries.mockResolvedValue({ records: [mockLead], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchFindVisaApplications.mockResolvedValue(new Map());
      mockRepository.batchFindUnifiedEntries.mockResolvedValue([]);
      mockRepository.batchFindNotes.mockResolvedValue(new Map());
      mockRepository.batchFindCalls.mockResolvedValue(new Map());
      mockRepository.batchFindTasks.mockResolvedValue(new Map());
      mockRepository.batchFindMeetings.mockResolvedValue(new Map());
      mockRepository.batchFindAttachments.mockResolvedValue(new Map());

      const result = await service.getEnquiries({ type: EnquiryType.LEADS });
      expect(result.data[0].client.phone).toBeNull();
    });

    it('should return null when email is missing or unparseable', async () => {
      const mockLead: MigratedLeadEntity = {
        zoho_id: 'lead_no_email',
        Email: null,
        Phone: '9876543210',
        Country_Code: 'IN',
        Created_Time: new Date('2024-01-01T00:00:00.000Z'),
      };

      mockRepository.findEnquiries.mockResolvedValue({ records: [mockLead], total: 1 });
      mockRepository.batchResolveUsers.mockResolvedValue(new Map());
      mockRepository.batchFindVisaApplications.mockResolvedValue(new Map());
      mockRepository.batchFindUnifiedEntries.mockResolvedValue([]);
      mockRepository.batchFindNotes.mockResolvedValue(new Map());
      mockRepository.batchFindCalls.mockResolvedValue(new Map());
      mockRepository.batchFindTasks.mockResolvedValue(new Map());
      mockRepository.batchFindMeetings.mockResolvedValue(new Map());
      mockRepository.batchFindAttachments.mockResolvedValue(new Map());

      const result = await service.getEnquiries({ type: EnquiryType.LEADS });
      expect(result.data[0].client.email).toBeNull();
      expect(result.data[0].client.phone).toBe('+919876543210');
    });
  });
});
