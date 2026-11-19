import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Allowed parent record types for notes.
 */
export const NOTE_PARENT_TYPES = [
  'lead',
  'contact',
  'deal',
  'visa_application',
  'spouse_skill_assessment',
  'task',
  'event',
  'signed_document',
] as const;

export type NoteParentType = (typeof NOTE_PARENT_TYPES)[number];

/**
 * Query parameters DTO for GET /api/v1/notes.
 */
export class QueryNotesDto {
  /**
   * Filter notes by related Zoho Lead ID (_zoho_lead_id).
   * @example "164193000020539123"
   */
  @ApiPropertyOptional({
    description: 'Filter notes by related Zoho Lead ID (_zoho_lead_id)',
    example: '164193000020539123',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoLeadId must be a string' })
  zohoLeadId?: string;

  /**
   * Filter notes by related Zoho Contact ID (_zoho_contact_id).
   * @example "164193000020539456"
   */
  @ApiPropertyOptional({
    description: 'Filter notes by related Zoho Contact ID (_zoho_contact_id)',
    example: '164193000020539456',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoContactId must be a string' })
  zohoContactId?: string;

  /**
   * Filter notes by related Zoho Deal ID (_zoho_deal_id).
   * @example "164193000020539789"
   */
  @ApiPropertyOptional({
    description: 'Filter notes by related Zoho Deal ID (_zoho_deal_id)',
    example: '164193000020539789',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'zohoDealId must be a string' })
  zohoDealId?: string;

  /**
   * Filter notes by related Zoho Visa Application ID (_zoho_visa_application_id).
   * @example "164193000020539999"
   */
  @ApiPropertyOptional({
    description: 'Filter notes by related Zoho Visa Application ID (_zoho_visa_application_id)',
    example: '164193000020539999',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'visaApplicationId must be a string' })
  visaApplicationId?: string;

  /**
   * Filter notes by related Zoho Spouse Skill Assessment ID (_zoho_spouse_skill_assessment_id).
   * @example "164193000020539888"
   */
  @ApiPropertyOptional({
    description:
      'Filter notes by related Zoho Spouse Skill Assessment ID (_zoho_spouse_skill_assessment_id)',
    example: '164193000020539888',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'spouseSkillAssessmentId must be a string' })
  spouseSkillAssessmentId?: string;

  /**
   * Filter by parent record type (parent_entity_type).
   * @example "lead"
   */
  @ApiPropertyOptional({
    description: 'Filter notes by the related parent record type',
    enum: NOTE_PARENT_TYPES,
    example: 'lead',
  })
  @IsOptional()
  @IsIn(NOTE_PARENT_TYPES, {
    message: `type must be one of: ${NOTE_PARENT_TYPES.join(', ')}`,
  })
  type?: NoteParentType;

  /**
   * Current page number (1-indexed). Defaults to 1.
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'Page number for pagination, starting from 1',
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
}
