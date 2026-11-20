import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Allowed parent record types for meetings.
 */
export const MEETING_PARENT_TYPES = [
  'lead',
  'contact',
  'deal',
  'visa_application',
  'spouse_skill_assessment',
  'task',
  'event',
  'signed_document',
] as const;

export type MeetingParentType = (typeof MEETING_PARENT_TYPES)[number];

/**
 * Query parameters DTO for GET /api/v1/meetings.
 */
export class QueryMeetingsDto {
  /**
   * Filter meetings by related Zoho Lead ID (_zoho_lead_id).
   * @example "164193000005168017"
   */
  @ApiPropertyOptional({
    description: 'Filter meetings by related Zoho Lead ID (_zoho_lead_id)',
    example: '164193000005168017',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoLeadId must be a string' })
  zohoLeadId?: string;

  /**
   * Filter meetings by related Zoho Contact ID (_zoho_contact_id).
   * @example "164193000003227315"
   */
  @ApiPropertyOptional({
    description: 'Filter meetings by related Zoho Contact ID (_zoho_contact_id)',
    example: '164193000003227315',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoContactId must be a string' })
  zohoContactId?: string;

  /**
   * Filter meetings by related Zoho Deal ID (_zoho_deal_id).
   * @example "164193000042901364"
   */
  @ApiPropertyOptional({
    description: 'Filter meetings by related Zoho Deal ID (_zoho_deal_id)',
    example: '164193000042901364',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoDealId must be a string' })
  zohoDealId?: string;

  /**
   * Filter meetings by related Zoho Visa Application ID (_zoho_visa_application_id).
   * @example "164193000064036073"
   */
  @ApiPropertyOptional({
    description: 'Filter meetings by related Zoho Visa Application ID (_zoho_visa_application_id)',
    example: '164193000064036073',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'visaApplicationId must be a string' })
  visaApplicationId?: string;

  /**
   * Filter meetings by related Zoho Spouse Skill Assessment ID (_zoho_spouse_skill_assessment_id).
   * @example "164193000130038037"
   */
  @ApiPropertyOptional({
    description:
      'Filter meetings by related Zoho Spouse Skill Assessment ID (_zoho_spouse_skill_assessment_id)',
    example: '164193000130038037',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'spouseSkillAssessmentId must be a string' })
  spouseSkillAssessmentId?: string;

  /**
   * Filter meetings by parent record type (parent_entity_type).
   * @example "lead"
   */
  @ApiPropertyOptional({
    description: 'Filter meetings by the related parent record type',
    enum: MEETING_PARENT_TYPES,
    example: 'lead',
  })
  @IsOptional()
  @IsIn(MEETING_PARENT_TYPES, {
    message: `type must be one of: ${MEETING_PARENT_TYPES.join(', ')}`,
  })
  type?: MeetingParentType;

  /**
   * Page number (1-based). Defaults to 1.
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'Page number for pagination (starts at 1)',
    default: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be greater than or equal to 1' })
  page: number = 1;

  /**
   * Number of records per page. Defaults to 200. Max 1000.
   * @example 200
   */
  @ApiPropertyOptional({
    description: 'Number of records to return per page',
    default: 200,
    minimum: 1,
    maximum: 1000,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be between 1 and 1000' })
  @Max(1000, { message: 'limit must be between 1 and 1000' })
  limit: number = 200;

  /**
   * Optional start date for filtering records by Zoho Created_Time (ISO 8601).
   * @example "2023-01-01T00:00:00Z"
   */
  @ApiPropertyOptional({
    description:
      'Optional start date filter (inclusive) applied to Zoho Created_Time in ISO 8601 format',
    example: '2023-01-01T00:00:00Z',
    type: String,
  })
  @IsOptional()
  @IsISO8601(
    { strict: true },
    { message: 'from must be a valid ISO 8601 date string (e.g. 2023-01-01T00:00:00Z)' },
  )
  from?: string;

  /**
   * Optional end date for filtering records by Zoho Created_Time (ISO 8601).
   * @example "2026-12-31T23:59:59Z"
   */
  @ApiPropertyOptional({
    description:
      'Optional end date filter (inclusive) applied to Zoho Created_Time in ISO 8601 format',
    example: '2026-12-31T23:59:59Z',
    type: String,
  })
  @IsOptional()
  @IsISO8601(
    { strict: true },
    { message: 'to must be a valid ISO 8601 date string (e.g. 2026-12-31T23:59:59Z)' },
  )
  to?: string;

  /**
   * Optional filter for incremental synchronization: returns records modified at or after this ISO 8601 timestamp.
   * Mutually exclusive with from and to.
   * @example "2024-01-01T00:00:00Z"
   */
  @ApiPropertyOptional({
    description:
      'Optional filter for incremental synchronization: returns records modified at or after this ISO 8601 timestamp. Mutually exclusive with from and to.',
    example: '2024-01-01T00:00:00Z',
    type: String,
  })
  @IsOptional()
  @IsISO8601(
    { strict: true },
    {
      message:
        'updatedSince must be a valid ISO 8601 date string (e.g. 2024-01-01T00:00:00Z)',
    },
  )
  updatedSince?: string;
}
