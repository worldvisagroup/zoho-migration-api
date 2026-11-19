import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export enum EnquiryType {
  LEADS = 'leads',
  CONTACTS = 'contacts',
}

export class QueryEnquiriesDto {
  @ApiProperty({
    description: 'Target collection type for enquiries extraction',
    enum: EnquiryType,
    example: EnquiryType.LEADS,
  })
  @IsNotEmpty({ message: 'Query parameter "type" is required' })
  @IsIn([EnquiryType.LEADS, EnquiryType.CONTACTS], {
    message: 'Query parameter "type" must be either "leads" or "contacts"',
  })
  type: EnquiryType | 'leads' | 'contacts';

  @ApiPropertyOptional({
    description: 'Page number for pagination (starts at 1)',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be greater than or equal to 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page (default: 200, max: 1000)',
    default: 200,
    minimum: 1,
    maximum: 1000,
    example: 200,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be greater than or equal to 1' })
  @Max(1000, { message: 'limit cannot exceed 1000' })
  limit?: number = 200;

  @ApiPropertyOptional({
    description: 'Filter records created at or after this date (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601({ strict: false }, { message: 'from must be a valid ISO 8601 date string' })
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter records created at or before this date (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsISO8601({ strict: false }, { message: 'to must be a valid ISO 8601 date string' })
  to?: string;
}
