import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';

/**
 * Supported client record types for migration.
 */
export type ClientRecordType = 'leads' | 'contacts';

/**
 * Query parameters DTO for the GET /clients migration endpoint.
 */
export class QueryClientsDto {
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
   * Specifies the source record type to fetch ('leads' or 'contacts').
   * @example "leads"
   */
  @ApiProperty({
    description: "Specifies the record type to fetch ('leads' or 'contacts')",
    enum: ['leads', 'contacts'],
    example: 'leads',
  })
  @IsIn(['leads', 'contacts'], {
    message: "type must be either 'leads' or 'contacts'",
  })
  type!: ClientRecordType;

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
   * @example "2025-12-31T23:59:59Z"
   */
  @ApiPropertyOptional({
    description:
      'Optional end date filter (inclusive) applied to Zoho Created_Time in ISO 8601 format',
    example: '2025-12-31T23:59:59Z',
    type: String,
  })
  @IsOptional()
  @IsISO8601(
    { strict: true },
    { message: 'to must be a valid ISO 8601 date string (e.g. 2025-12-31T23:59:59Z)' },
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
