import { Injectable } from '@nestjs/common';
import { normalizeZohoTimestamp, resolveParentEntity } from '../../../common/utils/index.js';
import type { MigratedNoteEntity } from '../../../database/schema/index.js';
import { NoteItemDto, NotesResponseDto, QueryNotesDto } from '../dto/index.js';
import { NotesRepository } from '../repositories/notes.repository.js';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  /**
   * Fetches, normalizes, and transforms notes into standardized migration records.
   *
   * @param query - Validated query parameters
   * @returns {Promise<NotesResponseDto>} Paginated notes migration response
   */
  async getNotes(query: QueryNotesDto): Promise<NotesResponseDto> {
    const { page = 1, limit = 200 } = query;

    const { records, total } = await this.notesRepository.findNotes(query);

    if (records.length === 0) {
      return new NotesResponseDto([], total, page, limit);
    }

    // Collect all unique user IDs to avoid N+1 queries
    const uniqueUserIds = new Set<string>();
    for (const record of records) {
      if (record._zoho_created_by_id) {
        uniqueUserIds.add(record._zoho_created_by_id);
      }
      if (record._zoho_modified_by_id) {
        uniqueUserIds.add(record._zoho_modified_by_id);
      }
    }

    const emailMap = await this.notesRepository.findUserEmailsByZohoIds(Array.from(uniqueUserIds));

    const transformedNotes: NoteItemDto[] = records.map(record =>
      this.transformRecordToNote(record, emailMap),
    );

    return new NotesResponseDto(transformedNotes, total, page, limit);
  }

  /**
   * Combines Note_Title and Note_Content into "Note_Title:- Note_Content".
   * Safely handles missing, empty, or whitespace-only inputs.
   */
  formatBody(titleRaw?: string | null, contentRaw?: string | null): string {
    const title = titleRaw ? titleRaw.trim() : '';
    const content = contentRaw ? contentRaw.trim() : '';

    if (title && content) {
      return `${title}:- ${content}`;
    }
    if (title) {
      return title;
    }
    if (content) {
      return content;
    }
    return '';
  }

  /**
   * Transforms a single MigratedNoteEntity into a NoteItemDto.
   */
  private transformRecordToNote(
    record: MigratedNoteEntity,
    emailMap: Map<string, string>,
  ): NoteItemDto {
    const body = this.formatBody(record.Note_Title, record.Note_Content);

    const createdByZohoId = record._zoho_created_by_id?.trim() || null;
    const createdByEmail = createdByZohoId ? (emailMap.get(createdByZohoId) ?? null) : null;

    const modifiedByZohoId = record._zoho_modified_by_id?.trim() || null;
    const modifiedByEmail = modifiedByZohoId ? (emailMap.get(modifiedByZohoId) ?? null) : null;

    const createdAt = normalizeZohoTimestamp(record.Created_Time);
    const updatedAt = normalizeZohoTimestamp(record.Modified_Time, record.Created_Time);
    const { parentType, parentZohoId } = resolveParentEntity(record);

    return new NoteItemDto({
      externalId: record.zoho_id || '',
      parentType,
      parentZohoId,
      body,
      createdByEmail,
      createdByZohoId,
      createdAt,
      modifiedByEmail,
      modifiedByZohoId,
      modifiedAt: updatedAt,
    });
  }
}
