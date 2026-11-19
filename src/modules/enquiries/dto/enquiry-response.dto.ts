import { ApiProperty } from '@nestjs/swagger';
import type { AttachmentItemDto } from '../../attachments/dto/attachment-response.dto.js';
import type { CallItemDto } from '../../calls/dto/call-response.dto.js';
import type { MeetingItemDto } from '../../meetings/dto/meeting-response.dto.js';
import type { NoteItemDto } from '../../notes/dto/note-response.dto.js';
import type { TaskItemDto } from '../../tasks/dto/task-response.dto.js';
import type { InterestedService } from '../utils/enquiry-service.util.js';
import type { EnquirySource } from '../utils/enquiry-source.util.js';

export class EnquiryClientDto {
  @ApiProperty({
    description: 'Client normalized email address (fallback: notprovided@gmail.com)',
    example: 'jane@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Client normalized international phone number (fallback: +919999999999)',
    example: '+919876543210',
  })
  phone: string;

  constructor(data: { email: string; phone: string }) {
    this.email = data.email;
    this.phone = data.phone;
  }
}

export class EnquiryAttributionDto {
  @ApiProperty({ description: 'Campaign name', nullable: true, example: 'AU PR Oct' })
  campaignName: string | null;

  @ApiProperty({ description: 'Ad group name', nullable: true, example: 'Skilled' })
  adGroupName: string | null;

  @ApiProperty({ description: 'Ad name', nullable: true, example: 'Carousel 2' })
  adName: string | null;

  @ApiProperty({ description: 'Google Click Identifier', nullable: true, example: null })
  gclid: string | null;

  @ApiProperty({ description: 'UTM Source', nullable: true, example: 'facebook' })
  utmSource: string | null;

  @ApiProperty({ description: 'UTM Medium', nullable: true, example: 'paid_social' })
  utmMedium: string | null;

  @ApiProperty({ description: 'UTM Campaign', nullable: true, example: 'au-pr-oct' })
  utmCampaign: string | null;

  @ApiProperty({ description: 'UTM Term', nullable: true, example: null })
  utmTerm: string | null;

  @ApiProperty({ description: 'UTM Content', nullable: true, example: 'video-a' })
  utmContent: string | null;

  @ApiProperty({ description: 'Facebook Lead ID', nullable: true, example: '1234567890' })
  facebookLeadId: string | null;

  @ApiProperty({ description: 'Facebook Click ID', nullable: true, example: null })
  fbc: string | null;

  @ApiProperty({ description: 'Facebook Browser ID', nullable: true, example: null })
  fbp: string | null;

  constructor(data: Partial<EnquiryAttributionDto>) {
    this.campaignName = data.campaignName ?? null;
    this.adGroupName = data.adGroupName ?? null;
    this.adName = data.adName ?? null;
    this.gclid = data.gclid ?? null;
    this.utmSource = data.utmSource ?? null;
    this.utmMedium = data.utmMedium ?? null;
    this.utmCampaign = data.utmCampaign ?? null;
    this.utmTerm = data.utmTerm ?? null;
    this.utmContent = data.utmContent ?? null;
    this.facebookLeadId = data.facebookLeadId ?? null;
    this.fbc = data.fbc ?? null;
    this.fbp = data.fbp ?? null;
  }
}

export class EnquiryItemDto {
  @ApiProperty({ description: 'Original Zoho record ID', example: '164193000000192070' })
  externalId: string;

  @ApiProperty({ description: 'Client contact details (email and phone)', type: EnquiryClientDto })
  client: EnquiryClientDto;

  @ApiProperty({
    description: 'Email of assigned Zoho owner',
    nullable: true,
    example: 'asha@worldvisa.in',
  })
  ownerEmail: string | null;

  @ApiProperty({
    description: 'Normalized interested service',
    nullable: true,
    example: 'permanent_residency',
    type: String,
  })
  interestedService: InterestedService | null;

  @ApiProperty({
    description: 'Target destination country',
    nullable: true,
    example: 'Australia',
    type: String,
  })
  destinationCountry: string | null;

  @ApiProperty({
    description: 'Enquiry stage (hardcoded null)',
    nullable: true,
    example: null,
    type: String,
  })
  stage: string | null;

  @ApiProperty({
    description: 'Enquiry status (hardcoded null)',
    nullable: true,
    example: null,
    type: String,
  })
  status: string | null;

  @ApiProperty({
    description: 'Enquiry closure reason (hardcoded null)',
    nullable: true,
    example: null,
    type: String,
  })
  closure: string | null;

  @ApiProperty({
    description: 'Normalized enquiry source',
    example: 'meta_ads',
    enum: [
      'google_ads',
      'meta_ads',
      'website',
      'blog',
      'pr_assessment',
      'referral',
      'walk_in',
      'ivr',
      'whatsapp',
    ],
  })
  source: EnquirySource;

  @ApiProperty({
    description: 'Original unmodified Zoho Lead_Source string',
    nullable: true,
    example: 'Facebook Ads',
  })
  sourceDetails: string | null;

  @ApiProperty({
    description: 'Attribution and campaign tracking data',
    type: EnquiryAttributionDto,
  })
  attribution: EnquiryAttributionDto;

  @ApiProperty({
    description: 'Creation timestamp in UTC ISO format',
    example: '2024-03-01T09:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Update timestamp in UTC ISO format',
    example: '2025-09-12T14:30:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Zoho Creator User ID',
    nullable: true,
    example: '164193000000028001',
  })
  createdById: string | null;

  @ApiProperty({ description: 'Zoho Creator Email', nullable: true, example: 'asha@worldvisa.in' })
  createdByEmail: string | null;

  @ApiProperty({
    description: 'Modification timestamp in UTC ISO format',
    example: '2025-09-12T14:30:00.000Z',
  })
  modifiedAt: string;

  @ApiProperty({
    description: 'Zoho Modifier User ID',
    nullable: true,
    example: '164193000000028001',
  })
  modifiedById: string | null;

  @ApiProperty({ description: 'Associated notes list', type: Array, example: [] })
  notes: NoteItemDto[];

  @ApiProperty({ description: 'Associated calls list', type: Array, example: [] })
  calls: CallItemDto[];

  @ApiProperty({ description: 'Associated tasks list', type: Array, example: [] })
  tasks: TaskItemDto[];

  @ApiProperty({ description: 'Associated meetings list', type: Array, example: [] })
  meetings: MeetingItemDto[];

  @ApiProperty({ description: 'Associated attachments list', type: Array, example: [] })
  attachments: AttachmentItemDto[];

  @ApiProperty({ description: 'Associated invoices list (pending)', type: Array, example: [] })
  invoices: unknown[];

  constructor(data: {
    externalId: string;
    client: EnquiryClientDto;
    ownerEmail: string | null;
    interestedService: InterestedService | null;
    destinationCountry: string | null;
    source: EnquirySource;
    sourceDetails: string | null;
    attribution: EnquiryAttributionDto;
    createdAt: string;
    updatedAt: string;
    createdById: string | null;
    createdByEmail: string | null;
    modifiedAt: string;
    modifiedById: string | null;
    notes?: NoteItemDto[];
    calls?: CallItemDto[];
    tasks?: TaskItemDto[];
    meetings?: MeetingItemDto[];
    attachments?: AttachmentItemDto[];
    invoices?: unknown[];
  }) {
    this.externalId = data.externalId;
    this.client = data.client;
    this.ownerEmail = data.ownerEmail;
    this.interestedService = data.interestedService;
    this.destinationCountry = data.destinationCountry;
    this.stage = null;
    this.status = null;
    this.closure = null;
    this.source = data.source;
    this.sourceDetails = data.sourceDetails;
    this.attribution = data.attribution;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdById = data.createdById;
    this.createdByEmail = data.createdByEmail;
    this.modifiedAt = data.modifiedAt;
    this.modifiedById = data.modifiedById;
    this.notes = data.notes ?? [];
    this.calls = data.calls ?? [];
    this.tasks = data.tasks ?? [];
    this.meetings = data.meetings ?? [];
    this.attachments = data.attachments ?? [];
    this.invoices = data.invoices ?? [];
  }
}

export class EnquiriesResponseDto {
  @ApiProperty({ description: 'Paginated migration enquiries data', type: [EnquiryItemDto] })
  data: EnquiryItemDto[];

  @ApiProperty({ description: 'Total matching records before pagination', example: 1234 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of records per page', example: 200 })
  pageSize: number;

  @ApiProperty({ description: 'Indicates whether additional pages exist', example: true })
  hasMore: boolean;

  constructor(data: EnquiryItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
