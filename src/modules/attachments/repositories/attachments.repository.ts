import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, SortOrder } from 'mongoose';
import { normalizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedAttachmentDocument,
  MigratedAttachmentEntity,
  MigratedUserDocument,
} from '../../../database/schema/index.js';
import type { QueryAttachmentsDto } from '../dto/index.js';
import type {
  IAttachmentsRepository,
  PaginatedAttachmentRecords,
} from './attachments.repository.interface.js';

@Injectable()
export class AttachmentsRepository implements IAttachmentsRepository {
  constructor(
    @InjectModel('MigratedAttachment')
    private readonly attachmentModel: Model<MigratedAttachmentDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
  ) { }

  /**
   * Constructs MongoDB filter object from validated query parameters.
   */
  private buildFilter(query: QueryAttachmentsDto): QueryFilter<MigratedAttachmentDocument> {
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

    const spouseId = query.spouseSkillAssessmentId;
    if (spouseId) {
      filter['_zoho_spouse_skill_assessment_id'] = spouseId;
    }

    if (query.type) {
      filter['parent_entity_type'] = query.type;
    }

    if (query.updatedSince) {
      filter['Modified_Time'] = { $gte: new Date(query.updatedSince) };
    } else if (query.from || query.to) {
      const dateFilter: Record<string, Date> = {};
      if (query.from) {
        dateFilter['$gte'] = new Date(query.from);
      }
      if (query.to) {
        dateFilter['$lte'] = new Date(query.to);
      }
      filter['Created_Time'] = dateFilter;
    }

    return filter as QueryFilter<MigratedAttachmentDocument>;
  }

  /**
   * Fetches paginated attachment records matching query filters, ordered oldest to newest.
   * Sorted by Modified_Time when updatedSince is provided; otherwise by Created_Time.
   */
  async findAttachments(query: QueryAttachmentsDto): Promise<PaginatedAttachmentRecords> {
    const filter = this.buildFilter(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;
    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = query.updatedSince
      ? { Modified_Time: 1, _id: 1 }
      : { Created_Time: 1, _id: 1 };

    const [records, total] = await Promise.all([
      this.attachmentModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedAttachmentEntity[]>()
        .exec(),
      this.attachmentModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs.
   * Maps zoho_id to normalized email.
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
        const email = normalizeEmail(u.email);
        if (email) {
          userEmailMap.set(u.zoho_id, email);
        }
      }
    }
    return userEmailMap;
  }
}
