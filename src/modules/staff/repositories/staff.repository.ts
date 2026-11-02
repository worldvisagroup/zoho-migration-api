import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter } from 'mongoose';
import type { MigratedUserDocument, MigratedUserEntity } from '../../../database/schema/index.js';
import type { IStaffRepository, PaginatedStaffRecords } from './staff.repository.interface.js';

@Injectable()
export class StaffRepository implements IStaffRepository {
  constructor(
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
  ) {}

  /**
   * Builds a Mongoose filter object for created_time range.
   */
  private buildDateFilter(from?: string, to?: string): QueryFilter<MigratedUserDocument> {
    const filter: Record<string, unknown> = {};

    if (from || to) {
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
   * Fetches paginated staff records sorted in ascending order of created_time (oldest to newest).
   */
  async findStaff(
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 200,
  ): Promise<PaginatedStaffRecords> {
    const filter = this.buildDateFilter(from, to);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ created_time: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MigratedUserEntity[]>()
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }
}
