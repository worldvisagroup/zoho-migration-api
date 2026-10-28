import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto.js';

export class ResponseMetaDto {
  @ApiProperty({
    description: 'ISO 8601 timestamp of response generation',
    example: '2026-10-27T10:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Unique request tracing identifier',
    example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
  })
  requestId: string;

  @ApiPropertyOptional({
    description: 'Optional pagination metadata',
    type: () => PaginationMetaDto,
  })
  pagination?: PaginationMetaDto;

  constructor(timestamp: string, requestId: string, pagination?: PaginationMetaDto) {
    this.timestamp = timestamp;
    this.requestId = requestId;
    this.pagination = pagination;
  }
}

export class ErrorDetailsDto {
  @ApiProperty({ description: 'Machine-readable error code', example: 'VALIDATION_FAILED' })
  code: string;

  @ApiProperty({
    description: 'Human-readable error explanation',
    example: 'Invalid input data supplied',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Detailed error messages or field validation breakdown',
    example: ['email must be an email', 'firstName should not be empty'],
  })
  details?: string[] | Record<string, string[]>;

  constructor(code: string, message: string, details?: string[] | Record<string, string[]>) {
    this.code = code;
    this.message = message;
    this.details = details;
  }
}

export class StandardErrorResponseDto {
  @ApiProperty({ description: 'Indicates failed operation', example: false })
  success = false as const;

  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Error payload', type: () => ErrorDetailsDto })
  error: ErrorDetailsDto;

  @ApiProperty({ description: 'Response metadata', type: () => ResponseMetaDto })
  meta: ResponseMetaDto;

  constructor(statusCode: number, error: ErrorDetailsDto, meta: ResponseMetaDto) {
    this.statusCode = statusCode;
    this.error = error;
    this.meta = meta;
  }
}
