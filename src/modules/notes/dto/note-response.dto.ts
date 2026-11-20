import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Transformed note migration record.
 */
export class NoteItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the note (zoho_id)',
    example: '164193000020539649',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Type of the parent record',
    enum: [
      'lead',
      'contact',
      'deal',
      'visa_application',
      'spouse_skill_assessment',
      'task',
      'event',
      'signed_document',
    ],
    example: 'lead',
    type: String,
    nullable: true,
  })
  parentType: string | null;

  @ApiProperty({
    description: 'Original Zoho ID of the parent record',
    example: '164193000000811047',
    type: String,
    nullable: true,
  })
  parentZohoId: string | null;

  @ApiPropertyOptional({
    description: 'Title of the note from Zoho Note_Title, or null if empty',
    example: 'Client Call',
    type: String,
    nullable: true,
  })
  title: string | null;

  @ApiPropertyOptional({
    description: 'Raw text content of the note from Zoho Note_Content, or null if empty',
    example: 'Client wants to start in January.',
    type: String,
    nullable: true,
  })
  content: string | null;

  @ApiPropertyOptional({
    description: 'Normalized lowercase email of the staff member who created the note',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  createdByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho user ID of the creator (_zoho_created_by_id)',
    example: '164193000000000001',
    type: String,
    nullable: true,
  })
  createdByZohoId: string | null;

  @ApiProperty({
    description: 'Original Zoho creation timestamp in UTC ISO 8601 format',
    example: '2024-03-02T10:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Normalized lowercase email of the staff member who last modified the note',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  modifiedByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho user ID of the modifier (_zoho_modified_by_id)',
    example: '164193000000000001',
    type: String,
    nullable: true,
  })
  modifiedByZohoId: string | null;

  @ApiProperty({
    description: 'Original Zoho modification timestamp in UTC ISO 8601 format',
    example: '2024-03-05T10:00:00.000Z',
    type: String,
  })
  modifiedAt: string;

  constructor(data: {
    externalId: string;
    parentType?: string | null;
    parentZohoId?: string | null;
    title: string | null;
    content: string | null;
    createdByEmail: string | null;
    createdByZohoId: string | null;
    createdAt: string;
    modifiedByEmail: string | null;
    modifiedByZohoId: string | null;
    modifiedAt: string;
  }) {
    this.externalId = data.externalId;
    this.parentType = data.parentType ?? null;
    this.parentZohoId = data.parentZohoId ?? null;
    this.title = data.title ?? null;
    this.content = data.content ?? null;
    this.createdByEmail = data.createdByEmail;
    this.createdByZohoId = data.createdByZohoId;
    this.createdAt = data.createdAt;
    this.modifiedByEmail = data.modifiedByEmail;
    this.modifiedByZohoId = data.modifiedByZohoId;
    this.modifiedAt = data.modifiedAt;
  }
}

/**
 * Root response envelope for GET /api/v1/notes.
 */
export class NotesResponseDto {
  @ApiProperty({
    description: 'Array of transformed note records',
    type: [NoteItemDto],
  })
  data: NoteItemDto[];

  @ApiProperty({
    description: 'Total number of records matching the filter criteria before pagination',
    example: 1234,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records requested per page',
    example: 200,
    type: Number,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Boolean flag indicating whether more pages are available',
    example: true,
    type: Boolean,
  })
  hasMore: boolean;

  constructor(data: NoteItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
