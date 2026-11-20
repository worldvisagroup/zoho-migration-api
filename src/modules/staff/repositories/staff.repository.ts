import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, SortOrder } from 'mongoose';
import type { MigratedUserDocument, MigratedUserEntity } from '../../../database/schema/index.js';
import type { IStaffRepository, PaginatedStaffRecords } from './staff.repository.interface.js';

@Injectable()
export class StaffRepository implements IStaffRepository {
  constructor(
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
  ) {}

  /**
   * Builds a Mongoose filter object for created_time range or modified_time incremental sync.
   */
  private buildDateFilter(
    from?: string,
    to?: string,
    updatedSince?: string,
  ): QueryFilter<MigratedUserDocument> {
    const filter: Record<string, unknown> = {};

    if (updatedSince) {
      filter['modified_time'] = { $gte: new Date(updatedSince) };
    } else if (from || to) {
      const dateRange: Record<string, Date> = {};
      if (from) {
        dateRange['$gte'] = new Date(from);
      }
      if (to) {
        dateRange['$lte'] = new Date(to);
      }
      filter['created_time'] = dateRange;
    }

    return filter as QueryFilter<MigratedUserDocument>;
  }

  /**
   * Fetches paginated staff records sorted in ascending order (oldest to newest).
   * Sorted by modified_time when updatedSince is provided; otherwise by created_time.
   */
  async findStaff(
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 200,
    updatedSince?: string,
  ): Promise<PaginatedStaffRecords> {
    const filter = this.buildDateFilter(from, to, updatedSince);
    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = updatedSince
      ? { modified_time: 1, _id: 1 }
      : { created_time: 1, _id: 1 };

    const [records, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedUserEntity[]>()
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }
}
