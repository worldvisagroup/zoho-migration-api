import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter } from 'mongoose';
import { sanitizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedTaskDocument,
  MigratedTaskEntity,
  MigratedUserDocument,
} from '../../../database/schema/index.js';
import type { QueryTasksDto } from '../dto/index.js';
import type { ITasksRepository, PaginatedTaskRecords } from './tasks.repository.interface.js';

@Injectable()
export class TasksRepository implements ITasksRepository {
  constructor(
    @InjectModel('MigratedTask')
    private readonly taskModel: Model<MigratedTaskDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
  ) {}

  /**
   * Constructs MongoDB filter object from validated query parameters.
   */
  private buildFilter(query: QueryTasksDto): QueryFilter<MigratedTaskDocument> {
    const filter: Record<string, unknown> = {};

    if (query.zohoLeadId) {
      filter['_zoho_lead_id'] = query.zohoLeadId;
    }

    if (query.zohoContactId) {
      filter['_zoho_contact_id'] = query.zohoContactId;
    }

    if (query.zohoDealId) {
      filter['_zoho_deal_id'] = query.zohoDealId;
    }

    if (query.visaApplicationId) {
      filter['_zoho_visa_application_id'] = query.visaApplicationId;
    }

    const spouseId = query.spouseSkillAssementId ?? query.spouseSkillAssessmentId;
    if (spouseId) {
      filter['_zoho_spouse_skill_assessment_id'] = spouseId;
    }

    if (query.type) {
      filter['parent_entity_type'] = query.type;
    }

    if (query.from || query.to) {
      const dateFilter: Record<string, Date> = {};
      if (query.from) {
        dateFilter['$gte'] = new Date(query.from);
      }
      if (query.to) {
        dateFilter['$lte'] = new Date(query.to);
      }
      filter['Created_Time'] = dateFilter;
    }

    return filter as QueryFilter<MigratedTaskDocument>;
  }

  /**
   * Fetches paginated task records matching query filters, ordered oldest to newest by Created_Time.
   */
  async findTasks(query: QueryTasksDto): Promise<PaginatedTaskRecords> {
    const filter = this.buildFilter(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort({ Created_Time: 1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MigratedTaskEntity[]>()
        .exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   * Maps zoho_id to sanitized email address.
   */
  async batchResolveUserEmails(zohoUserIds: string[]): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(zohoUserIds.filter(Boolean))];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const users = await this.userModel
      .find({ zoho_id: { $in: uniqueIds } })
      .select({ zoho_id: 1, email: 1 })
      .lean<{ zoho_id: string; email?: string | null }[]>()
      .exec();

    const userEmailMap = new Map<string, string>();
    for (const u of users) {
      if (u.zoho_id) {
        const cleaned = sanitizeEmail(u.email);
        if (cleaned) {
          userEmailMap.set(u.zoho_id, cleaned);
        }
      }
    }
    return userEmailMap;
  }
}
