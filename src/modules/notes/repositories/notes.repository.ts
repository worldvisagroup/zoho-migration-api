import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, SortOrder } from 'mongoose';
import { normalizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedNoteDocument,
  MigratedNoteEntity,
  MigratedUserDocument,
} from '../../../database/schema/index.js';
import type { QueryNotesDto } from '../dto/index.js';
import type { INotesRepository, PaginatedNoteRecords } from './notes.repository.interface.js';

@Injectable()
export class NotesRepository implements INotesRepository {
  constructor(
    @InjectModel('MigratedNote')
    private readonly noteModel: Model<MigratedNoteDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
  ) { }

  /**
   * Constructs a MongoDB filter object from validated query parameters.
   */
  private buildFilter(query: QueryNotesDto): QueryFilter<MigratedNoteDocument> {
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

    const spouseSkillId = query.spouseSkillAssessmentId;
    if (spouseSkillId) {
      filter['_zoho_spouse_skill_assessment_id'] = spouseSkillId;
    }

    if (query.type) {
      filter['parent_entity_type'] = query.type;
    }

    if (query.updatedSince) {
      filter['Modified_Time'] = { $gte: new Date(query.updatedSince) };
    } else if (query.from || query.to) {
      const dateRange: Record<string, Date> = {};
      if (query.from) {
        dateRange['$gte'] = new Date(query.from);
      }
      if (query.to) {
        dateRange['$lte'] = new Date(query.to);
      }
      filter['Created_Time'] = dateRange;
    }

    return filter as QueryFilter<MigratedNoteDocument>;
  }

  /**
   * Fetches paginated notes sorted in ascending order (oldest to newest).
   * Sorted by Modified_Time when updatedSince is provided; otherwise by Created_Time.
   */
  async findNotes(query: QueryNotesDto): Promise<PaginatedNoteRecords> {
    const filter = this.buildFilter(query);
    const page = query.page || 1;
    const limit = query.limit || 200;
    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = query.updatedSince
      ? { Modified_Time: 1, _id: 1 }
      : { Created_Time: 1, _id: 1 };

    const [records, total] = await Promise.all([
      this.noteModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedNoteEntity[]>()
        .exec(),
      this.noteModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs in a single query.
   */
  async findUserEmailsByZohoIds(zohoUserIds: string[]): Promise<Map<string, string>> {
    const emailMap = new Map<string, string>();

    if (zohoUserIds.length === 0) {
      return emailMap;
    }

    const users = await this.userModel
      .find({ zoho_id: { $in: zohoUserIds } })
      .select({ zoho_id: 1, email: 1 })
      .lean<Array<{ zoho_id: string; email?: string | null }>>()
      .exec();

    for (const user of users) {
      if (user.zoho_id) {
        emailMap.set(user.zoho_id, normalizeEmail(user.email));
      }
    }

    return emailMap;
  }
}
