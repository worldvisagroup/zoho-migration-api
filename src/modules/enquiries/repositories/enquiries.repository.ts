import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, SortOrder } from 'mongoose';
import { sanitizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedAttachmentDocument,
  MigratedAttachmentEntity,
  MigratedCallDocument,
  MigratedCallEntity,
  MigratedContactDocument,
  MigratedContactEntity,
  MigratedEventDocument,
  MigratedEventEntity,
  MigratedLeadDocument,
  MigratedLeadEntity,
  MigratedNoteDocument,
  MigratedNoteEntity,
  MigratedTaskDocument,
  MigratedTaskEntity,
  MigratedUserDocument,
  MigratedVisaApplicationDocument,
  MigratedVisaApplicationEntity,
  UnifiedEntry,
  UnifiedEntryDocument,
} from '../../../database/schema/index.js';
import type { QueryEnquiriesDto } from '../dto/index.js';
import type {
  IEnquiriesRepository,
  PaginatedEnquiryRecords,
  UserEmailName,
} from './enquiries.repository.interface.js';

@Injectable()
export class EnquiriesRepository implements IEnquiriesRepository {
  constructor(
    @InjectModel('MigratedLead')
    private readonly leadModel: Model<MigratedLeadDocument>,
    @InjectModel('MigratedContact')
    private readonly contactModel: Model<MigratedContactDocument>,
    @InjectModel('MigratedVisaApplication')
    private readonly visaAppModel: Model<MigratedVisaApplicationDocument>,
    @InjectModel('UnifiedEntry')
    private readonly unifiedEntryModel: Model<UnifiedEntryDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
    @InjectModel('MigratedNote')
    private readonly noteModel: Model<MigratedNoteDocument>,
    @InjectModel('MigratedCall')
    private readonly callModel: Model<MigratedCallDocument>,
    @InjectModel('MigratedTask')
    private readonly taskModel: Model<MigratedTaskDocument>,
    @InjectModel('MigratedEvent')
    private readonly eventModel: Model<MigratedEventDocument>,
    @InjectModel('MigratedAttachment')
    private readonly attachmentModel: Model<MigratedAttachmentDocument>,
  ) { }

  /**
   * Fetches paginated Leads or Contacts matching date filters, ordered oldest to newest by Created_Time.
   */
  async findEnquiries(query: QueryEnquiriesDto): Promise<PaginatedEnquiryRecords> {
    const filter: Record<string, unknown> = {};

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

    const sort: Record<string, SortOrder> = query.updatedSince
      ? { Modified_Time: 1, _id: 1 }
      : { Created_Time: 1, _id: 1 };

    const page = query.page ?? 1;
    const limit = query.limit ?? 200;
    const skip = (page - 1) * limit;

    if (query.type === 'leads') {
      const [records, total] = await Promise.all([
        this.leadModel
          .find(filter as QueryFilter<MigratedLeadDocument>)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean<MigratedLeadEntity[]>()
          .exec(),
        this.leadModel.countDocuments(filter as QueryFilter<MigratedLeadDocument>).exec(),
      ]);
      return { records, total };
    }

    const [records, total] = await Promise.all([
      this.contactModel
        .find(filter as QueryFilter<MigratedContactDocument>)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedContactEntity[]>()
        .exec(),
      this.contactModel.countDocuments(filter as QueryFilter<MigratedContactDocument>).exec(),
    ]);
    return { records, total };
  }

  /**
   * Batch resolves staff user records (email, name) by Zoho User IDs.
   */
  async batchResolveUsers(zohoUserIds: string[]): Promise<Map<string, UserEmailName>> {
    const uniqueIds = [...new Set(zohoUserIds.filter(Boolean))];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const users = await this.userModel
      .find({ zoho_id: { $in: uniqueIds } })
      .select({ zoho_id: 1, email: 1, name: 1, first_name: 1, last_name: 1 })
      .lean<
        {
          zoho_id: string;
          email?: string | null;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
        }[]
      >()
      .exec();

    const userMap = new Map<string, UserEmailName>();
    for (const u of users) {
      if (u.zoho_id) {
        const cleanedEmail = sanitizeEmail(u.email);
        const fullName =
          u.name?.trim() || [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
        userMap.set(u.zoho_id, {
          email: cleanedEmail || '',
          name: fullName || '',
        });
      }
    }

    return userMap;
  }

  /**
   * Batch finds related Visa Applications sorted latest first.
   */
  async batchFindVisaApplications(
    zohoIds: string[],
    emails: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedVisaApplicationEntity>> {
    const conditions: Record<string, unknown>[] = [];

    if (type === 'contacts' && zohoIds.length > 0) {
      conditions.push({ _zoho_contact_id: { $in: zohoIds } });
    }

    const cleanEmails = emails.filter(Boolean).map(e => e.toLowerCase().trim());
    if (cleanEmails.length > 0) {
      conditions.push({ Email: { $in: cleanEmails } });
    }

    if (conditions.length === 0) {
      return new Map();
    }

    const visaApps = await this.visaAppModel
      .find({ $or: conditions })
      .select({
        zoho_id: 1,
        Name: 1,
        Email: 1,
        Qualified_Country: 1,
        Application_Stage: 1,
        Selected_Visa_Type: 1,
        _zoho_contact_id: 1,
        Created_Time: 1,
      })
      .sort({ Created_Time: -1 })
      .lean<MigratedVisaApplicationEntity[]>()
      .exec();

    const visaMap = new Map<string, MigratedVisaApplicationEntity>();
    for (const v of visaApps) {
      // Index by contact ID if present
      if (v._zoho_contact_id && !visaMap.has(v._zoho_contact_id)) {
        visaMap.set(v._zoho_contact_id, v);
      }
      // Index by lowercase email
      if (v.Email) {
        const lowerEmail = v.Email.toLowerCase().trim();
        if (!visaMap.has(lowerEmail)) {
          visaMap.set(lowerEmail, v);
        }
      }
    }

    return visaMap;
  }

  /**
   * Batch finds unified entries matching candidate emails or phones.
   */
  async batchFindUnifiedEntries(emails: string[], phones: string[]): Promise<UnifiedEntry[]> {
    const cleanEmails = [
      ...new Set(
        emails.filter(e => e && e !== 'notprovided@gmail.com').map(e => e.toLowerCase().trim()),
      ),
    ];
    const cleanPhones = [
      ...new Set(phones.filter(p => p && p !== '+919999999999').map(p => p.trim())),
    ];

    const conditions: Record<string, unknown>[] = [];
    if (cleanEmails.length > 0) {
      conditions.push({ email: { $in: cleanEmails } });
    }
    if (cleanPhones.length > 0) {
      conditions.push({ phone: { $in: cleanPhones } });
    }

    if (conditions.length === 0) {
      return [];
    }

    return this.unifiedEntryModel.find({ $or: conditions }).lean<UnifiedEntry[]>().exec();
  }

  /**
   * Batch finds related Notes for a page of Leads or Contacts.
   */
  async batchFindNotes(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedNoteEntity[]>> {
    if (zohoIds.length === 0) return new Map();
    const filterKey = type === 'leads' ? '_zoho_lead_id' : '_zoho_contact_id';

    const notes = await this.noteModel
      .find({ [filterKey]: { $in: zohoIds } })
      .sort({ Created_Time: 1, _id: 1 })
      .lean<MigratedNoteEntity[]>()
      .exec();

    const map = new Map<string, MigratedNoteEntity[]>();
    for (const n of notes) {
      const key = type === 'leads' ? n._zoho_lead_id : n._zoho_contact_id;
      if (key) {
        const list = map.get(key) ?? [];
        list.push(n);
        map.set(key, list);
      }
    }
    return map;
  }

  /**
   * Batch finds related Calls for a page of Leads or Contacts.
   */
  async batchFindCalls(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedCallEntity[]>> {
    if (zohoIds.length === 0) return new Map();
    const filterKey = type === 'leads' ? '_zoho_lead_id' : '_zoho_contact_id';

    const calls = await this.callModel
      .find({ [filterKey]: { $in: zohoIds } })
      .sort({ Created_Time: 1, _id: 1 })
      .lean<MigratedCallEntity[]>()
      .exec();

    const map = new Map<string, MigratedCallEntity[]>();
    for (const c of calls) {
      const key = type === 'leads' ? c._zoho_lead_id : c._zoho_contact_id;
      if (key) {
        const list = map.get(key) ?? [];
        list.push(c);
        map.set(key, list);
      }
    }
    return map;
  }

  /**
   * Batch finds related Tasks for a page of Leads or Contacts.
   */
  async batchFindTasks(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedTaskEntity[]>> {
    if (zohoIds.length === 0) return new Map();
    const filterKey = type === 'leads' ? '_zoho_lead_id' : '_zoho_contact_id';

    const tasks = await this.taskModel
      .find({ [filterKey]: { $in: zohoIds } })
      .sort({ Created_Time: 1, _id: 1 })
      .lean<MigratedTaskEntity[]>()
      .exec();

    const map = new Map<string, MigratedTaskEntity[]>();
    for (const t of tasks) {
      const key = type === 'leads' ? t._zoho_lead_id : t._zoho_contact_id;
      if (key) {
        const list = map.get(key) ?? [];
        list.push(t);
        map.set(key, list);
      }
    }
    return map;
  }

  /**
   * Batch finds related Meetings (Events) for a page of Leads or Contacts.
   */
  async batchFindMeetings(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedEventEntity[]>> {
    if (zohoIds.length === 0) return new Map();
    const filterKey = type === 'leads' ? '_zoho_lead_id' : '_zoho_contact_id';

    const events = await this.eventModel
      .find({ [filterKey]: { $in: zohoIds } })
      .sort({ Created_Time: 1, _id: 1 })
      .lean<MigratedEventEntity[]>()
      .exec();

    const map = new Map<string, MigratedEventEntity[]>();
    for (const e of events) {
      const key = type === 'leads' ? e._zoho_lead_id : e._zoho_contact_id;
      if (key) {
        const list = map.get(key) ?? [];
        list.push(e);
        map.set(key, list);
      }
    }
    return map;
  }

  /**
   * Batch finds related Attachments for a page of Leads or Contacts.
   */
  async batchFindAttachments(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedAttachmentEntity[]>> {
    if (zohoIds.length === 0) return new Map();
    const filterKey = type === 'leads' ? '_zoho_lead_id' : '_zoho_contact_id';

    const attachments = await this.attachmentModel
      .find({ [filterKey]: { $in: zohoIds } })
      .sort({ Created_Time: 1, _id: 1 })
      .lean<MigratedAttachmentEntity[]>()
      .exec();

    const map = new Map<string, MigratedAttachmentEntity[]>();
    for (const a of attachments) {
      const key = type === 'leads' ? a._zoho_lead_id : a._zoho_contact_id;
      if (key) {
        const list = map.get(key) ?? [];
        list.push(a);
        map.set(key, list);
      }
    }
    return map;
  }
}
