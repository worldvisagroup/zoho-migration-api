import { ApiProperty } from '@nestjs/swagger';
import type { PaginationMeta } from '../types/index.js';

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty({ description: 'Current active page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items matching query', example: 42 })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Whether next page exists', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether previous page exists', example: false })
  hasPreviousPage: boolean;

  constructor(meta: PaginationMeta) {
    this.page = meta.page;
    this.limit = meta.limit;
    this.totalItems = meta.totalItems;
    this.totalPages = meta.totalPages;
    this.hasNextPage = meta.hasNextPage;
    this.hasPreviousPage = meta.hasPreviousPage;
  }
}
