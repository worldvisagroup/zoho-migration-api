import type { Document, Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
} from '../../common/constants/index.js';
import type { PaginatedResult, PaginationParams } from '../../common/types/index.js';
import type { IBaseRepository } from './base.repository.interface.js';

export interface SoftDeletable {
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

export abstract class BaseRepository<
  TDocument extends Document & SoftDeletable,
> implements IBaseRepository<TDocument> {
  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    const createdDoc = new this.model(data);
    const saved = await createdDoc.save();
    return saved.toObject() as TDocument;
  }

  async createMany(data: Partial<TDocument>[]): Promise<TDocument[]> {
    const created = await this.model.insertMany(data);
    return created.map(item =>
      typeof item.toObject === 'function' ? (item.toObject() as TDocument) : (item as TDocument),
    );
  }

  async findById(id: string): Promise<TDocument | null> {
    const doc = await this.model.findById(id).lean<TDocument>().exec();
    return doc;
  }

  async findOne(filter: QueryFilter<TDocument>): Promise<TDocument | null> {
    const doc = await this.model.findOne(filter).lean<TDocument>().exec();
    return doc;
  }

  async find(
    filter: QueryFilter<TDocument> = {},
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument[]> {
    const docs = await this.model.find(filter, null, options).lean<TDocument[]>().exec();
    return docs;
  }

  async findPaginated(
    filter: QueryFilter<TDocument>,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TDocument>> {
    const page = pagination.page > 0 ? pagination.page : DEFAULT_PAGE;
    const limit = pagination.limit > 0 ? pagination.limit : DEFAULT_PAGE_LIMIT;
    const sortBy = pagination.sortBy || DEFAULT_SORT_FIELD;
    const sortOrder = pagination.sortOrder || DEFAULT_SORT_ORDER;

    const skip = (page - 1) * limit;
    const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortDirection };

    const [items, totalItems] = await Promise.all([
      this.model.find(filter).sort(sortOptions).skip(skip).limit(limit).lean<TDocument[]>().exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateById(id: string, update: UpdateQuery<TDocument>): Promise<TDocument | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .lean<TDocument>()
      .exec();
    return updated;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async softDeleteById(id: string): Promise<TDocument | null> {
    const update: UpdateQuery<TDocument> = {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    };

    const updated = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean<TDocument>()
      .exec();
    return updated;
  }

  async restoreById(id: string): Promise<TDocument | null> {
    const update: UpdateQuery<TDocument> = {
      $set: {
        isDeleted: false,
        deletedAt: null,
      },
    };

    const updated = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean<TDocument>()
      .exec();
    return updated;
  }

  async count(filter: QueryFilter<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: QueryFilter<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return result !== null;
  }
}
