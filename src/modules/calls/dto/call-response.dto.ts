import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'answered' | 'overdue' | 'scheduled' | 'cancelled';

/**
 * Audio recording metadata for phone call.
 */
export class CallRecordingDto {
  @ApiProperty({
    description:
      'Audio recording URL (null because Zoho PhoneBridge URLs cannot be accessed outside CRM)',
    example: null,
    type: String,
    nullable: true,
  })
  url: string | null;

  @ApiProperty({
    description: 'MIME type of recording (null if unstated)',
    example: null,
    type: String,
    nullable: true,
  })
  mimeType: string | null;

  @ApiProperty({
    description: 'Size of recording in bytes (null if unstated)',
    example: null,
    type: String,
    nullable: true,
  })
  sizeBytes: string | null;

  constructor(data?: {
    url?: string | null;
    mimeType?: string | null;
    sizeBytes?: string | null;
  }) {
    this.url = data?.url ?? null;
    this.mimeType = data?.mimeType ?? null;
    this.sizeBytes = data?.sizeBytes ?? null;
  }
}

/**
 * Transformed call migration record.
 */
export class CallItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the call (zoho_id)',
    example: 'call_1',
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

  @ApiProperty({
    description: 'Call direction (inbound or outbound)',
    enum: ['inbound', 'outbound'],
    example: 'outbound',
  })
  direction: CallDirection;

  @ApiProperty({
    description: 'Call status outcome',
    enum: ['answered', 'overdue', 'scheduled', 'cancelled'],
    example: 'answered',
  })
  status: CallStatus;

  @ApiProperty({
    description:
      'Normalized customer phone number in international format (+91XXXXXXXXXX), or null if unlinked/unparseable',
    example: '+919876543210',
    type: String,
    nullable: true,
  })
  customerPhone: string | null;

  @ApiPropertyOptional({
    description: 'Normalized email of the agent / owner handling the call (null if not found)',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  agentEmail: string | null;

  @ApiProperty({
    description: 'Call start timestamp in UTC ISO 8601 format',
    example: '2024-03-02T10:00:00.000Z',
    type: String,
  })
  startedAt: string;

  @ApiProperty({
    description: 'Call duration in seconds',
    example: 120,
    type: Number,
  })
  durationSeconds: number;

  @ApiPropertyOptional({
    description: 'Call notes or description text, null if not recorded',
    example: 'Discussed documents.',
    type: String,
    nullable: true,
  })
  notes: string | null;

  @ApiPropertyOptional({
    description: 'Scheduled follow-up call timestamp in UTC ISO 8601, null if none',
    example: null,
    type: String,
    nullable: true,
  })
  followUpAt: string | null;

  @ApiProperty({
    description:
      'Voice recording metadata (always { url: null, mimeType: null, sizeBytes: null } as Zoho URLs cannot be accessed outside CRM)',
    type: CallRecordingDto,
    nullable: true,
  })
  recording: CallRecordingDto | null;

  @ApiPropertyOptional({
    description: 'Normalized email of the user who logged the call (null if not found)',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  createdByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho user ID of the creator (_zoho_created_by_id, null if missing)',
    example: 'zoho_user_id',
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
    description:
      'Normalized email of the user who last modified the call (null if missing or not found)',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  modifiedByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho user ID of the modifier (_zoho_modified_by_id, null if missing)',
    example: 'zoho_user_id',
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
    direction: CallDirection;
    status: CallStatus;
    customerPhone: string | null;
    agentEmail: string | null;
    startedAt: string;
    durationSeconds: number;
    notes: string | null;
    followUpAt: string | null;
    recording: CallRecordingDto | null;
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
    this.direction = data.direction;
    this.status = data.status;
    this.customerPhone = data.customerPhone;
    this.agentEmail = data.agentEmail;
    this.startedAt = data.startedAt;
    this.durationSeconds = data.durationSeconds;
    this.notes = data.notes;
    this.followUpAt = data.followUpAt;
    this.recording = data.recording;
    this.createdByEmail = data.createdByEmail;
    this.createdByZohoId = data.createdByZohoId;
    this.createdAt = data.createdAt;
    this.modifiedByEmail = data.modifiedByEmail;
    this.modifiedByZohoId = data.modifiedByZohoId;
    this.modifiedAt = data.modifiedAt;
  }
}

/**
 * Root response envelope for GET /api/v1/calls.
 */
export class CallsResponseDto {
  @ApiProperty({
    description: 'Array of transformed call records',
    type: [CallItemDto],
  })
  data: CallItemDto[];

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

  constructor(data: CallItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
