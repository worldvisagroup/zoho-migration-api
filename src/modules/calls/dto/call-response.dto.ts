import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'answered' | 'missed' | 'cancelled' | 'busy';

/**
 * Audio recording metadata for phone call.
 */
export class CallRecordingDto {
  @ApiProperty({
    description: 'Audio recording URL from Zoho PhoneBridge',
    example: 'https://files.example.com/call_1.mp3',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'MIME type of recording (empty string if unstated)',
    example: '',
    type: String,
  })
  mimeType: string;

  @ApiProperty({
    description: 'Size of recording in bytes (empty string if unstated)',
    example: '',
    type: String,
  })
  sizeBytes: string;

  constructor(data: { url: string; mimeType?: string; sizeBytes?: string }) {
    this.url = data.url;
    this.mimeType = data.mimeType ?? '';
    this.sizeBytes = data.sizeBytes ?? '';
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
    description: 'Call direction (inbound or outbound)',
    enum: ['inbound', 'outbound'],
    example: 'outbound',
  })
  direction: CallDirection;

  @ApiProperty({
    description: 'Call status outcome',
    enum: ['answered', 'missed', 'cancelled', 'busy'],
    example: 'answered',
  })
  status: CallStatus;

  @ApiProperty({
    description: 'Normalized customer phone number in international format (+91XXXXXXXXXX)',
    example: '+919876543210',
    type: String,
  })
  customerPhone: string;

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

  @ApiPropertyOptional({
    description: 'Voice recording information or null if no recording is available',
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
    direction: CallDirection;
    status: CallStatus;
    customerPhone: string;
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
