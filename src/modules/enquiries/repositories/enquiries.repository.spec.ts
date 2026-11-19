import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Model } from 'mongoose';
import type {
  MigratedAttachmentDocument,
  MigratedCallDocument,
  MigratedContactDocument,
  MigratedEventDocument,
  MigratedLeadDocument,
  MigratedNoteDocument,
  MigratedTaskDocument,
  MigratedUserDocument,
  MigratedVisaApplicationDocument,
  UnifiedEntryDocument,
} from '../../../database/schema/index.js';
import { EnquiryType } from '../dto/index.js';
import { EnquiriesRepository } from './enquiries.repository.js';

describe('EnquiriesRepository', () => {
  let repository: EnquiriesRepository;
  let mockLeadModel: { find: ReturnType<typeof vi.fn>; countDocuments: ReturnType<typeof vi.fn> };
  let mockContactModel: {
    find: ReturnType<typeof vi.fn>;
    countDocuments: ReturnType<typeof vi.fn>;
  };
  let mockVisaAppModel: { find: ReturnType<typeof vi.fn> };
  let mockUnifiedEntryModel: { find: ReturnType<typeof vi.fn> };
  let mockUserModel: { find: ReturnType<typeof vi.fn> };
  let mockNoteModel: { find: ReturnType<typeof vi.fn> };
  let mockCallModel: { find: ReturnType<typeof vi.fn> };
  let mockTaskModel: { find: ReturnType<typeof vi.fn> };
  let mockEventModel: { find: ReturnType<typeof vi.fn> };
  let mockAttachmentModel: { find: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockLeadModel = { find: vi.fn(), countDocuments: vi.fn() };
    mockContactModel = { find: vi.fn(), countDocuments: vi.fn() };
    mockVisaAppModel = { find: vi.fn() };
    mockUnifiedEntryModel = { find: vi.fn() };
    mockUserModel = { find: vi.fn() };
    mockNoteModel = { find: vi.fn() };
    mockCallModel = { find: vi.fn() };
    mockTaskModel = { find: vi.fn() };
    mockEventModel = { find: vi.fn() };
    mockAttachmentModel = { find: vi.fn() };

    repository = new EnquiriesRepository(
      mockLeadModel as unknown as Model<MigratedLeadDocument>,
      mockContactModel as unknown as Model<MigratedContactDocument>,
      mockVisaAppModel as unknown as Model<MigratedVisaApplicationDocument>,
      mockUnifiedEntryModel as unknown as Model<UnifiedEntryDocument>,
      mockUserModel as unknown as Model<MigratedUserDocument>,
      mockNoteModel as unknown as Model<MigratedNoteDocument>,
      mockCallModel as unknown as Model<MigratedCallDocument>,
      mockTaskModel as unknown as Model<MigratedTaskDocument>,
      mockEventModel as unknown as Model<MigratedEventDocument>,
      mockAttachmentModel as unknown as Model<MigratedAttachmentDocument>,
    );
  });

  describe('findEnquiries', () => {
    it('should query leads with date filters and return paginated records', async () => {
      const mockRecords = [{ zoho_id: 'lead_1', Full_Name: 'John Doe' }];
      const execFind = vi.fn().mockResolvedValue(mockRecords);
      const leanFind = vi.fn().mockReturnValue({ exec: execFind });
      const limitFind = vi.fn().mockReturnValue({ lean: leanFind });
      const skipFind = vi.fn().mockReturnValue({ limit: limitFind });
      const sortFind = vi.fn().mockReturnValue({ skip: skipFind });
      mockLeadModel.find.mockReturnValue({ sort: sortFind });
      mockLeadModel.countDocuments.mockReturnValue({ exec: vi.fn().mockResolvedValue(1) });

      const result = await repository.findEnquiries({
        type: EnquiryType.LEADS,
        page: 2,
        limit: 10,
        from: '2024-01-01T00:00:00Z',
        to: '2024-01-31T23:59:59Z',
      });

      expect(mockLeadModel.find).toHaveBeenCalledWith({
        Created_Time: {
          $gte: new Date('2024-01-01T00:00:00Z'),
          $lte: new Date('2024-01-31T23:59:59Z'),
        },
      });
      expect(sortFind).toHaveBeenCalledWith({ Created_Time: 1, _id: 1 });
      expect(skipFind).toHaveBeenCalledWith(10);
      expect(limitFind).toHaveBeenCalledWith(10);
      expect(result).toEqual({ records: mockRecords, total: 1 });
    });

    it('should query contacts with default page and limit', async () => {
      const mockRecords = [{ zoho_id: 'contact_1', Full_Name: 'Jane Smith' }];
      const execFind = vi.fn().mockResolvedValue(mockRecords);
      const leanFind = vi.fn().mockReturnValue({ exec: execFind });
      const limitFind = vi.fn().mockReturnValue({ lean: leanFind });
      const skipFind = vi.fn().mockReturnValue({ limit: limitFind });
      const sortFind = vi.fn().mockReturnValue({ skip: skipFind });
      mockContactModel.find.mockReturnValue({ sort: sortFind });
      mockContactModel.countDocuments.mockReturnValue({ exec: vi.fn().mockResolvedValue(1) });

      const result = await repository.findEnquiries({
        type: EnquiryType.CONTACTS,
      });

      expect(mockContactModel.find).toHaveBeenCalledWith({});
      expect(skipFind).toHaveBeenCalledWith(0);
      expect(limitFind).toHaveBeenCalledWith(200);
      expect(result).toEqual({ records: mockRecords, total: 1 });
    });
  });

  describe('batchResolveUsers', () => {
    it('should return empty map for empty userIds array', async () => {
      const result = await repository.batchResolveUsers([]);
      expect(result.size).toBe(0);
      expect(mockUserModel.find).not.toHaveBeenCalled();
    });

    it('should resolve user emails and names indexed by zoho_id', async () => {
      mockUserModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              { zoho_id: 'user_1', email: 'agent@example.com', name: 'Agent One' },
              { zoho_id: 'user_2', email: 'MODIFIER@example.com', name: null },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveUsers(['user_1', 'user_2']);
      expect(result.size).toBe(2);
      expect(result.get('user_1')).toEqual({ email: 'agent@example.com', name: 'Agent One' });
      expect(result.get('user_2')).toEqual({ email: 'modifier@example.com', name: '' });
    });
  });

  describe('batchFindVisaApplications', () => {
    it('should return empty map when zohoIds and emails are empty', async () => {
      const result = await repository.batchFindVisaApplications([], [], 'contacts');
      expect(result.size).toBe(0);
      expect(mockVisaAppModel.find).not.toHaveBeenCalled();
    });

    it('should resolve visa application by contact ID and email', async () => {
      mockVisaAppModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue([
                {
                  zoho_id: 'va_1',
                  _zoho_contact_id: 'contact_1',
                  Email: 'contact@example.com',
                  Qualified_Country: 'Canada',
                },
              ]),
            }),
          }),
        }),
      });

      const result = await repository.batchFindVisaApplications(
        ['contact_1'],
        ['contact@example.com'],
        'contacts',
      );
      expect(result.size).toBe(2);
      expect(result.get('contact_1')?.Qualified_Country).toBe('Canada');
      expect(result.get('contact@example.com')?.Qualified_Country).toBe('Canada');
    });
  });

  describe('batchFindUnifiedEntries', () => {
    it('should short-circuit when emails and phones are empty', async () => {
      const result = await repository.batchFindUnifiedEntries([], []);
      expect(result).toEqual([]);
      expect(mockUnifiedEntryModel.find).not.toHaveBeenCalled();
    });

    it('should query unified entries with $or clause', async () => {
      const mockEntries = [
        {
          entryId: 'entry_1',
          email: 'test@example.com',
          phone: '+919876543210',
          destinationCountry: 'Australia',
        },
      ];
      mockUnifiedEntryModel.find.mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockEntries),
        }),
      });

      const result = await repository.batchFindUnifiedEntries(
        ['test@example.com'],
        ['+919876543210'],
      );
      expect(mockUnifiedEntryModel.find).toHaveBeenCalledWith({
        $or: [{ email: { $in: ['test@example.com'] } }, { phone: { $in: ['+919876543210'] } }],
      });
      expect(result).toEqual(mockEntries);
    });
  });

  describe('batch activities lookups', () => {
    it('should return empty maps when zohoIds is empty', async () => {
      expect((await repository.batchFindNotes([], 'leads')).size).toBe(0);
      expect((await repository.batchFindCalls([], 'leads')).size).toBe(0);
      expect((await repository.batchFindTasks([], 'leads')).size).toBe(0);
      expect((await repository.batchFindMeetings([], 'leads')).size).toBe(0);
      expect((await repository.batchFindAttachments([], 'leads')).size).toBe(0);
    });

    it('should group notes by lead ID', async () => {
      mockNoteModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              { zoho_id: 'note_1', _zoho_lead_id: 'lead_1', Note_Title: 'Title 1' },
              { zoho_id: 'note_2', _zoho_lead_id: 'lead_1', Note_Title: 'Title 2' },
            ]),
          }),
        }),
      });

      const result = await repository.batchFindNotes(['lead_1'], 'leads');
      expect(result.size).toBe(1);
      expect(result.get('lead_1')?.length).toBe(2);
    });

    it('should group calls by lead ID', async () => {
      mockCallModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi
              .fn()
              .mockResolvedValue([
                { zoho_id: 'call_1', _zoho_lead_id: 'lead_1', Call_Duration: '02:30' },
              ]),
          }),
        }),
      });

      const result = await repository.batchFindCalls(['lead_1'], 'leads');
      expect(result.size).toBe(1);
      expect(result.get('lead_1')?.[0]?.zoho_id).toBe('call_1');
    });

    it('should group tasks by lead ID', async () => {
      mockTaskModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi
              .fn()
              .mockResolvedValue([
                { zoho_id: 'task_1', _zoho_lead_id: 'lead_1', Subject: 'Follow up' },
              ]),
          }),
        }),
      });

      const result = await repository.batchFindTasks(['lead_1'], 'leads');
      expect(result.size).toBe(1);
      expect(result.get('lead_1')?.[0]?.zoho_id).toBe('task_1');
    });

    it('should group events by lead ID', async () => {
      mockEventModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi
              .fn()
              .mockResolvedValue([
                { zoho_id: 'event_1', _zoho_lead_id: 'lead_1', Event_Title: 'Consultation' },
              ]),
          }),
        }),
      });

      const result = await repository.batchFindMeetings(['lead_1'], 'leads');
      expect(result.size).toBe(1);
      expect(result.get('lead_1')?.[0]?.zoho_id).toBe('event_1');
    });

    it('should group attachments by lead ID', async () => {
      mockAttachmentModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'att_1',
                _zoho_lead_id: 'lead_1',
                File_Name: 'resume.pdf',
                Size: 1024,
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchFindAttachments(['lead_1'], 'leads');
      expect(result.size).toBe(1);
      expect(result.get('lead_1')?.[0]?.File_Name).toBe('resume.pdf');
    });
  });
});
