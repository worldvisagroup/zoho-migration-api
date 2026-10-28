import type { QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';
import type { PaginatedResult, PaginationParams } from '../../common/types/index.js';

export interface IBaseRepository<TDocument> {
  create(data: Partial<TDocument>): Promise<TDocument>;
  createMany(data: Partial<TDocument>[]): Promise<TDocument[]>;
  findById(id: string): Promise<TDocument | null>;
  findOne(filter: QueryFilter<TDocument>): Promise<TDocument | null>;
  find(filter?: QueryFilter<TDocument>, options?: QueryOptions<TDocument>): Promise<TDocument[]>;
  findPaginated(
    filter: QueryFilter<TDocument>,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TDocument>>;
  updateById(id: string, update: UpdateQuery<TDocument>): Promise<TDocument | null>;
  deleteById(id: string): Promise<boolean>;
  softDeleteById(id: string): Promise<TDocument | null>;
  restoreById(id: string): Promise<TDocument | null>;
  count(filter?: QueryFilter<TDocument>): Promise<number>;
  exists(filter: QueryFilter<TDocument>): Promise<boolean>;
}
