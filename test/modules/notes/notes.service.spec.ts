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
      expect(note.body).toBe('Initial Assessment:- Client has 8 bands in IELTS.');
      expect(note.createdByEmail).toBe('creator@worldvisa.in');
      expect(note.createdByZohoId).toBe('user_1');
      expect(note.modifiedByEmail).toBe('modifier@worldvisa.in');
      expect(note.modifiedByZohoId).toBe('user_2');
      expect(note.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(note.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
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

    it('should fallback to default email if user not found in email map', async () => {
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
      expect(note.createdByEmail).toBe('notprovided@gmail.com');
      expect(note.modifiedByEmail).toBe('notprovided@gmail.com');
      expect(note.modifiedByZohoId).toBe('unknown_user_999');
      expect(note.modifiedAt).toBe('2024-01-10T08:00:00.000Z');
    });
  });

  describe('formatBody', () => {
    it('should format combined title and content with whitespace trimmed', () => {
      expect(service.formatBody('  Follow Up  ', '  Called client no response  ')).toBe(
        'Follow Up:- Called client no response',
      );
    });

    it('should return title only when content is missing or empty', () => {
      expect(service.formatBody('Important Note', null)).toBe('Important Note');
      expect(service.formatBody('Important Note', '   ')).toBe('Important Note');
    });

    it('should return content only when title is missing or empty', () => {
      expect(service.formatBody(null, 'Client wants to start in January.')).toBe(
        'Client wants to start in January.',
      );
      expect(service.formatBody('   ', 'Client wants to start in January.')).toBe(
        'Client wants to start in January.',
      );
    });

    it('should return empty string when both title and content are missing or whitespace', () => {
      expect(service.formatBody(null, null)).toBe('');
      expect(service.formatBody('', '')).toBe('');
      expect(service.formatBody('   ', '   ')).toBe('');
    });
  });
});
