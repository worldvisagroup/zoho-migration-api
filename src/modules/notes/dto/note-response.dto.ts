import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Combined note title and content in "Note_Title:- Note_Content" format',
    example: 'Client Call:- Client wants to start in January.',
    type: String,
  })
  body: string;

  @ApiProperty({
    description: 'Normalized lowercase email of the staff member who created the note',
    example: 'asha@example.com',
    type: String,
  })
  createdByEmail: string;

  @ApiProperty({
    description: 'Original Zoho user ID of the creator (_zoho_created_by_id)',
    example: '164193000000000001',
    type: String,
  })
  createdByZohoId: string;

  @ApiProperty({
    description: 'Original Zoho creation timestamp in UTC ISO 8601 format',
    example: '2024-03-02T10:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Normalized lowercase email of the staff member who last modified the note',
    example: 'asha@example.com',
    type: String,
  })
  modifiedByEmail: string;

  @ApiProperty({
    description: 'Original Zoho user ID of the modifier (_zoho_modified_by_id)',
    example: '164193000000000001',
    type: String,
  })
  modifiedByZohoId: string;

  @ApiProperty({
    description: 'Original Zoho modification timestamp in UTC ISO 8601 format',
    example: '2024-03-05T10:00:00.000Z',
    type: String,
  })
  modifiedAt: string;

  constructor(data: {
    externalId: string;
    body: string;
    createdByEmail: string;
    createdByZohoId: string;
    createdAt: string;
    modifiedByEmail: string;
    modifiedByZohoId: string;
    modifiedAt: string;
  }) {
    this.externalId = data.externalId;
    this.body = data.body;
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
