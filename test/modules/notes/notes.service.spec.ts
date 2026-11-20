import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotesService } from '../../../src/modules/notes/services/notes.service.js';
import type { NotesRepository } from '../../../src/modules/notes/repositories/notes.repository.js';
import type { MigratedNoteEntity } from '../../../src/database/schema/index.js';

describe('NotesService', () => {
  let service: NotesService;
  let mockRepo: {
    findNotes: ReturnType<typeof vi.fn>;
    findUserEmailsByZohoIds: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepo = {
      findNotes: vi.fn(),
      findUserEmailsByZohoIds: vi.fn(),
    };

    service = new NotesService(mockRepo as unknown as NotesRepository);
  });

  describe('getNotes', () => {
    it('should fetch, transform notes and batch-resolve creator/modifier emails', async () => {
      const mockNote: MigratedNoteEntity = {
        zoho_id: 'note_101',
        _zoho_lead_id: 'lead_001',
        parent_entity_type: 'lead',
        _zoho_created_by_id: 'user_1',
        _zoho_modified_by_id: 'user_2',
        Note_Title: 'Initial Assessment',
        Note_Content: 'Client has 8 bands in IELTS.',
        Created_Time: new Date('2024-03-02T10:00:00.000Z'),
        Modified_Time: new Date('2024-03-05T12:00:00.000Z'),
      };

      mockRepo.findNotes.mockResolvedValue({
        records: [mockNote],
        total: 500,
      });

      const emailMap = new Map<string, string>([
        ['user_1', 'creator@worldvisa.in'],
        ['user_2', 'modifier@worldvisa.in'],
      ]);
      mockRepo.findUserEmailsByZohoIds.mockResolvedValue(emailMap);

      const result = await service.getNotes({
        page: 1,
        limit: 200,
        type: 'lead',
        zohoLeadId: 'lead_001',
      });

      expect(mockRepo.findNotes).toHaveBeenCalledWith({
        page: 1,
        limit: 200,
        type: 'lead',
        zohoLeadId: 'lead_001',
      });

      expect(mockRepo.findUserEmailsByZohoIds).toHaveBeenCalledWith(['user_1', 'user_2']);

      expect(result.total).toBe(500);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(200);
      expect(result.hasMore).toBe(true);
      expect(result.data).toHaveLength(1);

      const note = result.data[0]!;
      expect(note.externalId).toBe('note_101');
      expect(note.parentType).toBe('lead');
      expect(note.parentZohoId).toBe('lead_001');
      expect(note.title).toBe('Initial Assessment');
      expect(note.content).toBe('Client has 8 bands in IELTS.');
      expect(note.createdByEmail).toBe('creator@worldvisa.in');
      expect(note.createdByZohoId).toBe('user_1');
      expect(note.modifiedByEmail).toBe('modifier@worldvisa.in');
      expect(note.modifiedByZohoId).toBe('user_2');
      expect(note.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(note.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
    });

    it('should correctly handle title-only, content-only, and empty note titles/contents', async () => {
      const mockNotes: MigratedNoteEntity[] = [
        {
          zoho_id: 'note_title_only',
          Note_Title: '  Title Only  ',
          Note_Content: '   ',
          Created_Time: new Date('2024-01-01T00:00:00.000Z'),
        },
        {
          zoho_id: 'note_content_only',
          Note_Title: null,
          Note_Content: '  Raw content only  ',
          Created_Time: new Date('2024-01-02T00:00:00.000Z'),
        },
        {
          zoho_id: 'note_both_empty',
          Note_Title: '   ',
          Note_Content: '',
          Created_Time: new Date('2024-01-03T00:00:00.000Z'),
        },
      ];

      mockRepo.findNotes.mockResolvedValue({
        records: mockNotes,
        total: 3,
      });
      mockRepo.findUserEmailsByZohoIds.mockResolvedValue(new Map());

      const result = await service.getNotes({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(3);

      expect(result.data[0]!.title).toBe('Title Only');
      expect(result.data[0]!.content).toBeNull();

      expect(result.data[1]!.title).toBeNull();
      expect(result.data[1]!.content).toBe('Raw content only');

      expect(result.data[2]!.title).toBeNull();
      expect(result.data[2]!.content).toBeNull();
    });

    it('should set hasMore to false on the final page', async () => {
      mockRepo.findNotes.mockResolvedValue({
        records: [],
        total: 150,
      });
      mockRepo.findUserEmailsByZohoIds.mockResolvedValue(new Map());

      const result = await service.getNotes({
        page: 1,
        limit: 200,
      });

      expect(result.hasMore).toBe(false);
      expect(result.data).toEqual([]);
    });

    it('should set emails to null if user not found in email map', async () => {
      const mockNote: MigratedNoteEntity = {
        zoho_id: 'note_102',
        _zoho_created_by_id: 'unknown_user_999',
        Note_Title: 'Meeting',
        Note_Content: 'Discussed visa pathways.',
        Created_Time: new Date('2024-01-10T08:00:00.000Z'),
      };

      mockRepo.findNotes.mockResolvedValue({
        records: [mockNote],
        total: 1,
      });
      mockRepo.findUserEmailsByZohoIds.mockResolvedValue(new Map());

      const result = await service.getNotes({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      const note = result.data[0]!;
      expect(note.createdByEmail).toBeNull();
      expect(note.createdByZohoId).toBe('unknown_user_999');
      expect(note.modifiedByEmail).toBeNull();
      expect(note.modifiedByZohoId).toBeNull();
      expect(note.modifiedAt).toBe('2024-01-10T08:00:00.000Z');
    });

    it('should forward updatedSince parameter to repository', async () => {
      mockRepo.findNotes.mockResolvedValue({ records: [], total: 0 });
      mockRepo.findUserEmailsByZohoIds.mockResolvedValue(new Map());

      await service.getNotes({
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });

      expect(mockRepo.findNotes).toHaveBeenCalledWith({
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });
    });
  });
});
