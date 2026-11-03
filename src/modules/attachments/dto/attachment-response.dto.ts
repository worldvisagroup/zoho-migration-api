import { ApiProperty } from '@nestjs/swagger';

/**
 * Transformed attachment record for migration API.
 */
export class AttachmentItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the attachment (zoho_id)',
    example: '164193000000578074',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Direct or presigned download URL for the attachment file',
    example: 'https://files.example.com/attachments/passport.pdf',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'Original file name of the attachment',
    example: 'passport.pdf',
    type: String,
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the attachment (e.g. application/pdf)',
    example: 'application/pdf',
    type: String,
  })
  mimeType: string;

  @ApiProperty({
    description: 'Size of the attachment file in bytes',
    example: 245760,
    type: Number,
  })
  sizeBytes: number;

  @ApiProperty({
    description: 'Email address of the staff user who uploaded the attachment',
    example: 'asha@worldvisa.com',
    type: String,
  })
  uploadedByEmail: string;

  @ApiProperty({
    description: 'Zoho User ID of the uploader/creator',
    example: '164193000000030001',
    type: String,
  })
  uploadedByZohoId: string;

  @ApiProperty({
    description: 'UTC ISO 8601 timestamp when the file was uploaded/created',
    example: '2024-03-03T10:00:00.000Z',
    type: String,
  })
  uploadedAt: string;

  @ApiProperty({
    description: 'UTC ISO 8601 timestamp when the attachment record was created',
    example: '2024-03-03T10:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'UTC ISO 8601 timestamp when the attachment record was last modified',
    example: '2024-03-05T10:00:00.000Z',
    type: String,
  })
  modifiedAt: string;

  @ApiProperty({
    description: 'Email address of the staff user who last modified the attachment',
    example: 'asha@worldvisa.com',
    type: String,
  })
  modifiedByEmail: string;

  @ApiProperty({
    description: 'Zoho User ID of the staff user who last modified the attachment',
    example: '164193000000030001',
    type: String,
  })
  modifiedByZohoId: string;

  constructor(data: {
    externalId: string;
    url: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedByEmail: string;
    uploadedByZohoId: string;
    uploadedAt: string;
    createdAt: string;
    modifiedAt: string;
    modifiedByEmail: string;
    modifiedByZohoId: string;
  }) {
    this.externalId = data.externalId;
    this.url = data.url;
    this.fileName = data.fileName;
    this.mimeType = data.mimeType;
    this.sizeBytes = data.sizeBytes;
    this.uploadedByEmail = data.uploadedByEmail;
    this.uploadedByZohoId = data.uploadedByZohoId;
    this.uploadedAt = data.uploadedAt;
    this.createdAt = data.createdAt;
    this.modifiedAt = data.modifiedAt;
    this.modifiedByEmail = data.modifiedByEmail;
    this.modifiedByZohoId = data.modifiedByZohoId;
  }
}

/**
 * Root paginated response envelope for GET /api/v1/attachments.
 */
export class AttachmentsResponseDto {
  @ApiProperty({
    description: 'Array of transformed attachment records',
    type: [AttachmentItemDto],
  })
  data: AttachmentItemDto[];

  @ApiProperty({
    description: 'Total number of records matching the filter criteria before pagination',
    example: 1234,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-indexed)',
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

  constructor(data: AttachmentItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
