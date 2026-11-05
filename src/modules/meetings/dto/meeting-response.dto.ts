import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TargetMeetingStatus } from '../utils/meeting-status.util.js';

export type ParticipantType = 'staff' | 'guest';

/**
 * Transformed meeting participant.
 */
export class MeetingParticipantDto {
  @ApiProperty({
    description: 'Email address of the participant',
    example: 'asha@worldvisa.in',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Display name of the participant',
    example: 'Asha K',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Participant category (staff or guest)',
    enum: ['staff', 'guest'],
    example: 'staff',
  })
  type: ParticipantType;

  constructor(data: { email: string; name: string; type: ParticipantType }) {
    this.email = data.email;
    this.name = data.name;
    this.type = data.type;
  }
}

/**
 * Recording metadata for the meeting.
 */
export class MeetingRecordingDto {
  @ApiProperty({
    description: 'Downloadable presigned URL for the meeting recording file',
    example: 'https://files.example.com/recordings/meeting_1.mp4',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'MIME type of the recording file',
    example: 'video/mp4',
    type: String,
  })
  mimeType: string;

  @ApiProperty({
    description: 'Size of the recording file in bytes',
    example: 52428800,
    type: Number,
  })
  sizeBytes: number;

  constructor(data: { url: string; mimeType: string; sizeBytes: number }) {
    this.url = data.url;
    this.mimeType = data.mimeType;
    this.sizeBytes = data.sizeBytes;
  }
}

/**
 * Transformed meeting record for migration API.
 */
export class MeetingItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the meeting event (zoho_id)',
    example: '164193000005186138',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Title / Subject of the meeting (Event_Title)',
    example: 'Eligibility discussion',
    type: String,
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Plain text description of the meeting (null if empty or missing)',
    example: 'Discussed skilled migration pathways and eligibility.',
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Normalized meeting status outcome',
    enum: ['scheduled', 'ended', 'cancelled'],
    example: 'ended',
  })
  status: TargetMeetingStatus;

  @ApiProperty({
    description: 'UTC ISO 8601 scheduled start timestamp from Start_DateTime',
    example: '2024-03-04T11:00:00.000Z',
    type: String,
  })
  scheduledAt: string;

  @ApiPropertyOptional({
    description:
      'UTC ISO 8601 actual start timestamp (falls back to Start_DateTime if ended, null if scheduled/cancelled)',
    example: '2024-03-04T11:00:00.000Z',
    type: String,
    nullable: true,
  })
  startedAt: string | null;

  @ApiProperty({
    description: 'UTC ISO 8601 scheduled/actual end timestamp from End_DateTime',
    example: '2024-03-04T11:40:00.000Z',
    type: String,
  })
  endedAt: string;

  @ApiPropertyOptional({
    description: 'Resolved email address of host staff member (null if not found)',
    example: 'asha@worldvisa.in',
    type: String,
    nullable: true,
  })
  hostEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho owner ID of the meeting host (null if missing)',
    example: '164193000000512001',
    type: String,
    nullable: true,
  })
  hostId: string | null;

  @ApiProperty({
    description: 'List of meeting attendees including staff host and guest participants',
    type: [MeetingParticipantDto],
  })
  participants: MeetingParticipantDto[];

  @ApiPropertyOptional({
    description: 'Meeting recording metadata and download URL (null if no recording exists)',
    type: MeetingRecordingDto,
    nullable: true,
  })
  recording: MeetingRecordingDto | null;

  @ApiPropertyOptional({
    description: 'Original Zoho creator ID (null if missing)',
    example: '164193000000512001',
    type: String,
    nullable: true,
  })
  createdById: string | null;

  @ApiPropertyOptional({
    description: 'Email address of meeting creator (null if not found)',
    example: 'asha@worldvisa.in',
    type: String,
    nullable: true,
  })
  createdByEmail: string | null;

  @ApiProperty({
    description:
      'UTC ISO 8601 last modified timestamp (falls back to Created_Time if Modified_Time is missing; never null)',
    example: '2024-03-05T10:00:00.000Z',
    type: String,
  })
  modifiedAt: string;

  @ApiPropertyOptional({
    description: 'Original Zoho modifier ID (null if missing)',
    example: '164193000000512001',
    type: String,
    nullable: true,
  })
  modifiedById: string | null;

  constructor(data: {
    externalId: string;
    title: string;
    description: string | null;
    status: TargetMeetingStatus;
    scheduledAt: string;
    startedAt: string | null;
    endedAt: string;
    hostEmail: string | null;
    hostId: string | null;
    participants: MeetingParticipantDto[];
    recording: MeetingRecordingDto | null;
    createdById: string | null;
    createdByEmail: string | null;
    modifiedAt: string;
    modifiedById: string | null;
  }) {
    this.externalId = data.externalId;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.scheduledAt = data.scheduledAt;
    this.startedAt = data.startedAt;
    this.endedAt = data.endedAt;
    this.hostEmail = data.hostEmail;
    this.hostId = data.hostId;
    this.participants = data.participants;
    this.recording = data.recording;
    this.createdById = data.createdById;
    this.createdByEmail = data.createdByEmail;
    this.modifiedAt = data.modifiedAt;
    this.modifiedById = data.modifiedById;
  }
}

/**
 * Standardized pagination envelope for GET /api/v1/meetings.
 */
export class MeetingsResponseDto {
  @ApiProperty({
    description: 'Array of transformed meeting records',
    type: [MeetingItemDto],
  })
  data: MeetingItemDto[];

  @ApiProperty({
    description: 'Total number of meetings matching query filters before pagination',
    example: 6571,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 200,
    type: Number,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Indicates whether more records exist beyond the current page',
    example: true,
    type: Boolean,
  })
  hasMore: boolean;

  constructor(data: MeetingItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
