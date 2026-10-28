import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
  MAX_PAGE_LIMIT,
} from '../constants/index.js';
import type { SortOrder } from '../types/index.js';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: DEFAULT_PAGE,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: DEFAULT_PAGE_LIMIT,
    minimum: 1,
    maximum: MAX_PAGE_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_LIMIT)
  limit: number = DEFAULT_PAGE_LIMIT;

  @ApiPropertyOptional({
    description: 'Field to sort results by',
    default: DEFAULT_SORT_FIELD,
  })
  @IsOptional()
  @IsString()
  sortBy: string = DEFAULT_SORT_FIELD;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    default: DEFAULT_SORT_ORDER,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: SortOrder = DEFAULT_SORT_ORDER;

  @ApiPropertyOptional({
    description: 'Full text or substring search query',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
